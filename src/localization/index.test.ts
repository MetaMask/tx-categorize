import i18next from 'i18next'
import Backend from 'i18next-fs-backend'

import { Language, initializeI18next, resetI18next, t } from './index'

const i18nMock = {
  use: jest.fn().mockReturnThis(),
  init: jest.fn().mockResolvedValue(undefined),
  t: jest.fn(),
}

jest.mock('i18next', () => {
  const actualI18next = jest.requireActual('i18next')

  return {
    ...actualI18next,
    createInstance: jest.fn().mockImplementation(() => i18nMock),
  }
})

jest.mock('i18next-fs-backend', () => jest.fn())

describe('i18n', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    resetI18next()
  })

  describe('initializeI18next', () => {
    it('should initialize i18next with the default language', async () => {
      i18nMock.init.mockResolvedValue(i18nMock.t)

      await initializeI18next()

      expect(i18nMock.use).toHaveBeenCalledWith(Backend)
      expect(i18next.createInstance).toHaveBeenCalledWith(
        expect.objectContaining({
          lng: Language.en,
          fallbackLng: 'en',
          backend: {
            loadPath: expect.stringContaining('locales/{{lng}}/translation.json'),
          },
        }),
      )
    })

    it('should initialize i18next with a specified language', async () => {
      i18nMock.init.mockResolvedValue(i18nMock.t)

      await initializeI18next(Language.ko)

      expect(i18nMock.use).toHaveBeenCalledWith(Backend)
      expect(i18next.createInstance).toHaveBeenCalledWith(
        expect.objectContaining({
          lng: Language.ko,
          fallbackLng: 'en',
          backend: {
            loadPath: expect.stringContaining('locales/{{lng}}/translation.json'),
          },
        }),
      )
    })

    it('should not reinitialize i18next if already initialized', async () => {
      i18nMock.init.mockResolvedValue(i18nMock.t)

      await initializeI18next()
      await initializeI18next()

      expect(i18nMock.use).toHaveBeenCalledTimes(1)
      expect(i18nMock.init).toHaveBeenCalledTimes(1)
    })

    it('should reject if initialization fails', async () => {
      const mockError = new Error('Initialization error')
      i18nMock.init.mockRejectedValue(mockError)

      await expect(initializeI18next()).rejects.toThrow('Initialization error')
    })
  })

  describe('t', () => {
    it('should return the key if i18next is not initialized', () => {
      const result = t('key')
      expect(result).toBe('key')
    })

    it('should return the translation for a given key', async () => {
      i18nMock.init.mockResolvedValue(i18nMock.t)
      i18nMock.t.mockReturnValue('translated text')

      await initializeI18next()

      const result = t('key')
      expect(result).toBe('translated text')
      expect(i18nMock.t).toHaveBeenCalledWith('key', undefined)
    })

    it('should return the translation for a given key with options', async () => {
      i18nMock.init.mockResolvedValue(i18nMock.t)
      i18nMock.t.mockReturnValue('translated text with options')

      await initializeI18next()

      const options = { someOption: 'value' }
      const result = t('key', options)

      expect(result).toBe('translated text with options')
      expect(i18nMock.t).toHaveBeenCalledWith('key', options)
    })

    it('should return the translation for a given key with options when initializedTwice', async () => {
      i18nMock.init.mockResolvedValue(i18nMock.t)
      i18nMock.t
        .mockReturnValueOnce('translated text with options')
        .mockReturnValueOnce('translated text with options in spanish')

      await initializeI18next()
      await initializeI18next(Language.es)

      const options = { someOption: 'value' }
      const result = t('key', options)
      expect(result).toBe('translated text with options')
      expect(i18nMock.t).toHaveBeenCalledWith('key', options)

      const resultTwo = t('key', options, Language.es)
      expect(resultTwo).toBe('translated text with options in spanish')
      expect(i18nMock.t).toHaveBeenCalledWith('key', options)
    })
  })
})
