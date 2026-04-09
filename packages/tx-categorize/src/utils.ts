import { titlecaseExceptions } from './constants'
import { Action } from './enums'
import { ValueTransfer } from './types'

export const titlecase = (sentence: string) => {
  const arr: string[] = []
  sentence.split('_').forEach((word) => {
    // if word is of type `v${number}` (e.g. v2, v3), return as is
    if (/^v\d+$/i.test(word)) {
      return
    }
    if (titlecaseExceptions[word.replace(':', '')]) {
      arr.push(titlecaseExceptions[word.replace(':', '')])

      return
    }

    const firstLetterUpper = word[0].toUpperCase()

    arr.push(firstLetterUpper + word.slice(1).toLowerCase())
  })

  return arr.join(' ')
}

export const convertUnits = (amount: bigint, decimals: number): string => {
  const divisor = 10n ** BigInt(decimals)
  const wholePart = amount / divisor
  const fractionalPart = amount % divisor

  if (fractionalPart === 0n) {
    return wholePart.toString()
  }

  const fractionalStr = fractionalPart.toString().padStart(decimals, '0').replace(/0+$/, '')

  return `${wholePart}.${fractionalStr}`
}

export const convertWeiToRoundedDecimalWithSigFigs = (amount: string, decimals: number, sigFigs = 4) => {
  const valueBn = BigInt(amount)
  const decimalValue = convertUnits(valueBn, decimals)
  const [whole, fraction = ''] = decimalValue.split('.')

  if (fraction.length <= sigFigs) {
    return decimalValue
  }

  const roundedFraction = fraction.slice(0, sigFigs)
  const lastDigit = parseInt(fraction[sigFigs], 10)

  if (lastDigit >= 5) {
    const incremented = BigInt(roundedFraction) + 1n
    const incrementedStr = incremented.toString().padStart(sigFigs, '0')

    if (incrementedStr.length > sigFigs) {
      return (BigInt(whole) + 1n).toString()
    }

    return `${whole}.${incrementedStr}`
  }
  if (roundedFraction === '0'.repeat(sigFigs)) {
    if (whole !== '0') return whole
    const firstNonZeroIndex = [...fraction].findIndex((d) => d !== '0')
    if (firstNonZeroIndex === -1) return '0'

    const digit = parseInt(fraction[firstNonZeroIndex], 10)
    const nextDigit = firstNonZeroIndex + 1 < fraction.length ? parseInt(fraction[firstNonZeroIndex + 1], 10) : 0

    if (nextDigit >= 5) {
      const rounded = digit + 1
      if (rounded >= 10) {
        return firstNonZeroIndex === 0 ? '1' : `0.${'0'.repeat(firstNonZeroIndex - 1)}1`
      }

      return `0.${'0'.repeat(firstNonZeroIndex)}${rounded}`
    }

    return `0.${'0'.repeat(firstNonZeroIndex)}${digit}`
  }
  if (decimalValue.split('.')[1] !== roundedFraction) {
    return `${whole}.${roundedFraction}`
  }

  return `${whole}.${roundedFraction}`
}

// --- Enriched Transaction Template System ---

export interface TemplateContext {
  sentAssets: ValueTransfer[]
  receivedAssets: ValueTransfer[]
  spender?: string
  approvedAssets?: ValueTransfer[]
}

const resolveVariable = (varName: string, ctx: TemplateContext): string => {
  const match = varName.match(/^(sent_assets|received_assets|approved_assets)_(\d+)_(value|ticker)$/)
  if (match) {
    const [, group, indexStr, field] = match
    const index = parseInt(indexStr, 10)
    let assets: ValueTransfer[]
    if (group === 'sent_assets') assets = ctx.sentAssets
    else if (group === 'received_assets') assets = ctx.receivedAssets
    else assets = ctx.approvedAssets ?? []

    const asset = assets[index]
    if (!asset) return ''

    if (field === 'value') {
      return asset.amount && asset.decimal != null
        ? convertWeiToRoundedDecimalWithSigFigs(asset.amount, asset.decimal)
        : ''
    }
    if (field === 'ticker') {
      return asset.symbol ?? ''
    }
  }
  if (varName === 'spender') return ctx.spender ?? ''

  return ''
}

export const interpolateTemplate = (template: string, ctx: TemplateContext): string => {
  return template
    .replace(/\$([a-z_0-9]+)/g, (_, varName) => resolveVariable(varName, ctx))
    .replace(/\s+/g, ' ')
    .trim()
}

export const refineActionForMultiAssets = (
  action: Action,
  sentAssets: ValueTransfer[],
  receivedAssets: ValueTransfer[],
): Action => {
  if (action === Action.EXCHANGE) {
    if (receivedAssets.length > 1) return Action.EXCHANGE_FOR_MULTI
    if (sentAssets.length > 1) return Action.EXCHANGE_FROM_MULTI
  }
  if (action === Action.DEPOSIT && sentAssets.length > 1) return Action.DEPOSIT_MULTI
  if (action === Action.WITHDRAW && receivedAssets.length > 1) return Action.WITHDRAW_MULTI

  return action
}
