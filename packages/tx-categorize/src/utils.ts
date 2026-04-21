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

const COMPACT_SUFFIXES: Array<[number, string]> = [
  [1e12, 'T'],
  [1e9, 'B'],
  [1e6, 'M'],
  [1e3, 'K'],
]

export const formatCompactNumber = (decimalValue: string): string => {
  const num = parseFloat(decimalValue)

  if (isNaN(num) || num === 0) return '0'

  const absNum = Math.abs(num)

  if (absNum < 0.0001) return '<0.0001'

  for (let i = 0; i < COMPACT_SUFFIXES.length; i++) {
    const [threshold, suffix] = COMPACT_SUFFIXES[i]
    if (absNum >= threshold) {
      const scaled = absNum / threshold
      const rounded = parseFloat(scaled.toFixed(2))

      // If rounding pushed us across a tier boundary (e.g. 999.9995 K → 1000 K),
      // re-format the rounded-up absolute value so the correct suffix is chosen.
      // But if we're already at the highest tier, just display as-is to avoid infinite recursion.
      if (rounded >= 1000 && i > 0) {
        return formatCompactNumber((rounded * threshold).toString())
      }

      return `${rounded}${suffix}`
    }
  }

  // For values < 1000 that round up to 1000, promote to K tier
  const rounded = parseFloat(absNum.toFixed(4))
  if (rounded >= 1000) {
    return formatCompactNumber(rounded.toString())
  }

  return rounded.toString()
}

export const convertWeiToRoundedDecimalWithSigFigs = (amount: string, decimals: number) => {
  const valueBn = BigInt(amount)
  const decimalValue = convertUnits(valueBn, decimals)

  return formatCompactNumber(decimalValue)
}

// --- Enriched Transaction Template System ---

export interface BaseTemplateContext {
  sentAssets: ValueTransfer[]
  receivedAssets: ValueTransfer[]
}

export interface ApproveTemplateContext extends BaseTemplateContext {
  spender: string
  approvedAssets: ValueTransfer[]
}

export type TemplateContext = BaseTemplateContext | ApproveTemplateContext

const resolveVariable = (varName: string, ctx: TemplateContext): string => {
  const match = varName.match(/^(sent_assets|received_assets|approved_assets)_(\d+)_(value|ticker)$/)
  if (match) {
    const [, group, indexStr, field] = match
    const index = parseInt(indexStr, 10)
    let assets: ValueTransfer[]
    if (group === 'sent_assets') assets = ctx.sentAssets
    else if (group === 'received_assets') assets = ctx.receivedAssets
    else assets = 'approvedAssets' in ctx ? ctx.approvedAssets : []

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
  if (varName === 'spender') return 'spender' in ctx ? ctx.spender : ''

  return ''
}

export const interpolateTemplate = (template: string, ctx: TemplateContext): string => {
  return template
    .replace(/\$([a-z_0-9]+)/g, (_, varName) => resolveVariable(varName, ctx))
    .replace(/\s+/g, ' ')
    .trim()
}

export const refineActionForMultiAssets = (
  action: Action | undefined,
  sentAssets: ValueTransfer[],
  receivedAssets: ValueTransfer[],
): Action => {
  if (!action) return Action.STANDARD
  if (action === Action.EXCHANGE) {
    if (receivedAssets.length > 1) return Action.EXCHANGE_FOR_MULTI
    if (sentAssets.length > 1) return Action.EXCHANGE_FROM_MULTI
  }
  if (action === Action.DEPOSIT && sentAssets.length > 1) return Action.DEPOSIT_MULTI
  if (action === Action.WITHDRAW && receivedAssets.length > 1) return Action.WITHDRAW_MULTI

  return action
}

export const truncateAddress = (address: string): string => {
  if (address.length <= 40) return address

  return `${address.slice(0, 7)}...${address.slice(-5)}`
}
