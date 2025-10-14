import path from 'path'

import { TFunction, TOptionsBase, createInstance } from 'i18next'
import Backend from 'i18next-fs-backend'

interface $Dictionary<T = unknown> {
  [key: string]: T
}

export enum Language {
  de = 'de',
  el = 'el',
  en = 'en',
  es = 'es',
  fr = 'fr',
  hi = 'hi',
  id = 'id',
  ja = 'ja',
  ko = 'ko',
  pt = 'pt',
  ru = 'ru',
  tl = 'tl',
  tr = 'tr',
  vi = 'vi',
  zh = 'zh',
}

export const fallbackLng = Language.en

let i18nInstances: { [key in Language]?: { t: TFunction } } = {}

/**
 * Check if i18next is initialized for a given language
 * @param language - the language to check if i18next is initialized for
 * @returns boolean
 */
export const isI18nextInitialized = (language?: Language) => {
  return !!i18nInstances[language]
}

export const resetI18next = () => {
  i18nInstances = {}
}

export const initializeI18next = (language: Language = fallbackLng) => {
  if (isI18nextInitialized(language)) {
    console.warn('i18next is already initialized')

    return
  }

  return createI18nInstance(language)
}

export const t = (key: string, options?: TOptionsBase & $Dictionary, language = fallbackLng) => {
  if (!isI18nextInitialized(language) || !i18nInstances[language]) {
    console.warn('To use localization, i18next must be initialized with createI18nInstance')

    return key
  }

  return i18nInstances[language].t(key, options)
}

export const createI18nInstance = async (language: Language): Promise<TFunction> => {
  if (isI18nextInitialized(language)) {
    console.warn('i18next is already initialized')

    return undefined
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
    i18nInstances[language] = newInstance

    return t
  } catch (err) {
    console.error(err)
    throw err
  }
}
