import { Language } from '../localization'
import { ValueTransfer } from '../types'
import { TemplateContext, interpolateTemplate } from '../utils'

import enTranslations from './locales/en/translation.json'

import { initializeI18nextV2, resetI18nextV2, tV2 } from './index'

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
      expect(result).toBe('Approved 0xSpenderAddress to spend 1 USDC')
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
      expect(result).toBe('Swapped 1 ETH for 2000 DAI and 1000 USDC')
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
