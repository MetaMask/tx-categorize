import fs from 'fs'
import path from 'path'

import { Action } from '../enums'
import { ValueTransfer } from '../types'
import { TemplateContext, interpolateTemplate } from '../utils'

import enTranslations from './locales/en/translation.json'

import { Language, initializeI18nextV2, resetI18nextV2, tV2 } from './index'

const makeValueTransfer = (overrides: Partial<ValueTransfer> = {}): ValueTransfer =>
  ({
    from: '0xabc',
    to: '0xdef',
    tokenId: '',
    contractAddress: '0x123',
    transferType: 'erc20',
    amount: '1000000000000000000',
    decimal: 18,
    symbol: 'ETH',
    ...overrides,
  }) as ValueTransfer

/** Context that satisfies every $variable placeholder used across templates. */
const fullContext: TemplateContext = {
  sentAssets: [
    makeValueTransfer({ symbol: 'DAI', amount: '1000000', decimal: 6 }),
    makeValueTransfer({ symbol: 'USDC', amount: '2000000', decimal: 6 }),
  ],
  receivedAssets: [
    makeValueTransfer({ symbol: 'ETH', amount: '500000000000000000', decimal: 18 }),
    makeValueTransfer({ symbol: 'WBTC', amount: '10000000', decimal: 8 }),
  ],
  spender: '0xSpenderAddress',
  approvedAssets: [makeValueTransfer({ symbol: 'USDC', amount: '1000000', decimal: 6 })],
}

const templateKeys = Object.keys(enTranslations) as Array<keyof typeof enTranslations>

describe('localizationV2 interpolation', () => {
  beforeEach(() => {
    resetI18nextV2()
  })

  describe('English locale end-to-end', () => {
    beforeEach(async () => {
      await initializeI18nextV2(Language.en)
    })

    it.each(templateKeys)('%s template has no remaining $variable placeholders after interpolation', (key) => {
      const template = tV2(key, {}, Language.en) as string
      const result = interpolateTemplate(template, fullContext)

      expect(result).not.toMatch(/\$[a-z_0-9]+/)
    })

    it('interpolates TRANSFER with correct values', () => {
      const template = tV2('TRANSFER', {}, Language.en) as string
      const result = interpolateTemplate(template, {
        sentAssets: [makeValueTransfer({ symbol: 'ETH', amount: '1000000000000000000', decimal: 18 })],
        receivedAssets: [],
      })
      expect(result).toBe('Transferred 1 ETH')
    })

    it('interpolates EXCHANGE with correct values', () => {
      const template = tV2('EXCHANGE', {}, Language.en) as string
      const result = interpolateTemplate(template, {
        sentAssets: [makeValueTransfer({ symbol: 'DAI', amount: '1000000', decimal: 6 })],
        receivedAssets: [makeValueTransfer({ symbol: 'ETH', amount: '500000000000000000', decimal: 18 })],
      })
      expect(result).toBe('Swapped 1 DAI for 0.5 ETH')
    })

    it('interpolates APPROVE with spender and approved assets', () => {
      const template = tV2('APPROVE', {}, Language.en) as string
      const result = interpolateTemplate(template, {
        sentAssets: [],
        receivedAssets: [],
        spender: '0xSpenderAddress',
        approvedAssets: [makeValueTransfer({ symbol: 'USDC', amount: '1000000', decimal: 6 })],
      })
      expect(result).toBe('Approve USDC spending cap')
    })

    it('interpolates EXCHANGE_FOR_MULTI with multiple received assets', () => {
      const template = tV2('EXCHANGE_FOR_MULTI', {}, Language.en) as string
      const result = interpolateTemplate(template, {
        sentAssets: [makeValueTransfer({ symbol: 'ETH', amount: '1000000000000000000', decimal: 18 })],
        receivedAssets: [
          makeValueTransfer({ symbol: 'DAI', amount: '2000000000', decimal: 6 }),
          makeValueTransfer({ symbol: 'USDC', amount: '1000000000', decimal: 6 }),
        ],
      })
      expect(result).toBe('Swapped 1 ETH for 2K DAI and 1K USDC')
    })
  })

  describe('uninitialized languages', () => {
    let warnSpy: jest.SpyInstance

    beforeEach(() => {
      warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined)
    })

    afterEach(() => {
      warnSpy.mockRestore()
    })

    it('falls back to English and warns only once per language', () => {
      expect(tV2('TRANSFER_SENT', {}, Language.es)).toBe(enTranslations.TRANSFER_SENT)
      expect(tV2('TRANSFER_RECEIVED', {}, Language.es)).toBe(enTranslations.TRANSFER_RECEIVED)

      expect(warnSpy).toHaveBeenCalledTimes(1)
      expect(warnSpy).toHaveBeenCalledWith(expect.stringMatching(/'es'/))
    })

    it('does not warn for the English fallback language', () => {
      tV2('TRANSFER_SENT', {}, Language.en)

      expect(warnSpy).not.toHaveBeenCalled()
    })

    it('does not warn once the language has been initialized', async () => {
      await initializeI18nextV2(Language.es)
      tV2('TRANSFER_SENT', {}, Language.es)

      expect(warnSpy).not.toHaveBeenCalled()
    })
  })

  describe('locale files', () => {
    const englishTemplates = enTranslations as Record<string, string>
    const englishKeys = Object.keys(englishTemplates).sort()
    const otherLanguages = Object.values(Language).filter((lang) => lang !== Language.en)

    /**
     * Read a locale's translation file from disk (the same file i18next loads at runtime).
     * @param lang - the language whose `locales/<lang>/translation.json` should be read
     * @returns the parsed translation dictionary
     */
    const loadLocale = (lang: Language): Record<string, string> => {
      const filePath = path.join(__dirname, 'locales', lang, 'translation.json')

      return JSON.parse(fs.readFileSync(filePath, 'utf8'))
    }

    /**
     * Extract the `$placeholder` names used in a template.
     * @param template - the template string
     * @returns the placeholder names, e.g. `$sent_assets_0_value`
     */
    const placeholdersIn = (template: string): string[] => template.match(/\$[a-z_0-9]+/g) ?? []

    it.each(otherLanguages)('%s locale has exactly the same keys as en', (lang) => {
      // Step 1: compare the sorted key lists, so a missing or extra key fails with a readable diff
      expect(Object.keys(loadLocale(lang)).sort()).toEqual(englishKeys)
    })

    it.each(otherLanguages)('%s locale only uses placeholders that exist in the English template', (lang) => {
      // Step 1: for every translated key, collect placeholders that are not in the English template
      const locale = loadLocale(lang)
      for (const [key, template] of Object.entries(locale)) {
        const allowed = placeholdersIn(englishTemplates[key] ?? '')
        const unknown = placeholdersIn(template).filter((placeholder) => !allowed.includes(placeholder))

        // Step 2: report the key and the unknown placeholders if there are any
        expect({ key, unknown }).toEqual({ key, unknown: [] })
      }
    })

    it('has an English template for every Action value', () => {
      const missing = Object.values(Action).filter((action) => !(action in englishTemplates))
      expect(missing).toEqual([])
    })
  })

  describe('all locales have valid interpolation placeholders', () => {
    const locales = Object.values(Language)

    it.each(locales)('%s locale: all templates resolve with no leftover $variable placeholders', async (lang) => {
      await initializeI18nextV2(lang)

      for (const key of templateKeys) {
        const template = tV2(key, {}, lang) as string
        const result = interpolateTemplate(template, fullContext)

        expect(result).not.toMatch(/\$[a-z_0-9]+/)
      }
    })
  })
})
