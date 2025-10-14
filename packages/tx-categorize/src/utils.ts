import { titlecaseExceptions } from './constants'

export const titlecase = (sentence: string) => {
  const arr = sentence.split('_').map((word) => {
    if (titlecaseExceptions[word.replace(':', '')]) {
      return titlecaseExceptions[word.replace(':', '')]
    }

    const firstLetterUpper = word[0].toUpperCase()

    return firstLetterUpper + word.slice(1).toLowerCase()
  })

  return arr.join(' ')
}
