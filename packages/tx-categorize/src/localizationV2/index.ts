import path from 'path'

import { TFunction, TOptionsBase, createInstance } from 'i18next'
import Backend from 'i18next-fs-backend'

import enTranslations from './locales/en/translation.json'

/**
 * Languages supported by the translation files in `locales/`.
 * Each value is the locale directory name (and the code Crowdin uses).
 */
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

interface $Dictionary<T = unknown> {
  [key: string]: T
}

export const fallbackLngV2 = Language.en

let i18nInstancesV2: { [key in Language]?: { t: TFunction } } = {}

export const isI18nextV2Initialized = (language?: Language) => {
  if (!language) return false

  return !!i18nInstancesV2[language]
}

/**
 * Languages we've already warned about being requested without initialization.
 * Used to avoid spamming one warning per translated key.
 */
const warnedUninitializedLanguagesV2 = new Set<string>()

/**
 * Reset all initialized V2 i18next instances (and the "already warned" state). Mainly useful for tests.
 */
export const resetI18nextV2 = () => {
  i18nInstancesV2 = {}
  warnedUninitializedLanguagesV2.clear()
}

export const initializeI18nextV2 = async (language: Language = fallbackLngV2) => {
  if (isI18nextV2Initialized(language)) {
    console.warn('i18next V2 is already initialized')

    return
  }

  return createI18nV2Instance(language)
}

/**
 * Translate a V2 template key.
 *
 * If the requested language has not been initialized with `initializeI18nextV2`, the bundled English
 * template is returned instead. When that happens for a non-English language a warning is logged once,
 * so a missing `initializeI18nextV2(language)` call doesn't silently produce English output.
 *
 * @param key - the translation key
 * @param options - i18next options
 * @param language - the language to translate to (defaults to English)
 * @returns the translated template (or the key itself if no translation exists)
 */
export const tV2 = (key: string, options?: TOptionsBase & $Dictionary, language = fallbackLngV2) => {
  // Step 1: use the language's i18next instance when it has been initialized
  if (isI18nextV2Initialized(language) && i18nInstancesV2[language]) {
    return i18nInstancesV2[language].t(key, options)
  }

  // Step 2: warn (once per language) that we're falling back to English
  if (language !== fallbackLngV2 && !warnedUninitializedLanguagesV2.has(language)) {
    warnedUninitializedLanguagesV2.add(language)
    console.warn(
      `i18next V2 is not initialized for language '${language}', falling back to '${fallbackLngV2}'. ` +
        'Call initializeI18nextV2(language) first.',
    )
  }

  // Step 3: fall back to the bundled English templates
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
