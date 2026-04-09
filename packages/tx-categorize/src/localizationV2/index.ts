import path from 'path'

import { TFunction, TOptionsBase, createInstance } from 'i18next'
import Backend from 'i18next-fs-backend'

import { Language } from '../localization'
import enTranslations from './locales/en/translation.json'

interface $Dictionary<T = unknown> {
  [key: string]: T
}

export const fallbackLngV2 = Language.en

let i18nInstancesV2: { [key in Language]?: { t: TFunction } } = {}

export const isI18nextV2Initialized = (language?: Language) => {
  if (!language) return false

  return !!i18nInstancesV2[language]
}

export const resetI18nextV2 = () => {
  i18nInstancesV2 = {}
}

export const initializeI18nextV2 = (language: Language = fallbackLngV2) => {
  if (isI18nextV2Initialized(language)) {
    console.warn('i18next V2 is already initialized')

    return
  }

  return createI18nV2Instance(language)
}

export const tV2 = (key: string, options?: TOptionsBase & $Dictionary, language = fallbackLngV2) => {
  if (isI18nextV2Initialized(language) && i18nInstancesV2[language]) {
    return i18nInstancesV2[language].t(key, options)
  }

  return (enTranslations as Record<string, string>)[key] ?? key
}

export const createI18nV2Instance = async (language: Language): Promise<TFunction> => {
  if (isI18nextV2Initialized(language)) {
    console.warn('i18next V2 is already initialized')

    return undefined as unknown as TFunction
  }

  const newInstance = createInstance({
    lng: language,
    fallbackLng: 'en',
    backend: {
      loadPath: path.join(__dirname, 'locales/{{lng}}/translation.json'),
    },
    interpolation: { escapeValue: false },
  })

  try {
    const t = await newInstance.use(Backend).init()
    i18nInstancesV2[language] = newInstance

    return t
  } catch (err) {
    console.error(err)
    throw err
  }
}
