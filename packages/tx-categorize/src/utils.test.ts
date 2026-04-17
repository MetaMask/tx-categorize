import {
  convertUnits,
  convertWeiToRoundedDecimalWithSigFigs,
  interpolateTemplate,
  refineActionForMultiAssets,
} from './utils'
import { tV2 } from './localizationV2'
import { ValueTransfer } from './types'
import { Action } from './enums'

const makeValueTransfer = (overrides: Partial<ValueTransfer> = {}): ValueTransfer =>
  ({
    from: '0xabc',
    to: '0xdef',
    tokenId: '',
    contractAddress: '0x123',
    transferType: 'erc20',
    ...overrides,
  }) as ValueTransfer

describe('convertUnits', () => {
  it('returns whole number when no fractional part', () => {
    expect(convertUnits(1000000000000000000n, 18)).toBe('1')
  })

  it('returns decimal string when fractional part exists', () => {
    expect(convertUnits(1500000000000000000n, 18)).toBe('1.5')
  })

  it('trims trailing zeros from fractional part', () => {
    expect(convertUnits(1230000000000000000n, 18)).toBe('1.23')
  })

  it('handles zero amount', () => {
    expect(convertUnits(0n, 18)).toBe('0')
  })

  it('handles 6 decimal token (USDC)', () => {
    expect(convertUnits(1000000n, 6)).toBe('1')
    expect(convertUnits(1500000n, 6)).toBe('1.5')
    expect(convertUnits(1234567n, 6)).toBe('1.234567')
  })
  it('handles 34 decimals', () => {
    expect(convertUnits(12345678901234567823456789012345678n, 34)).toBe('1.2345678901234567823456789012345678')
  })

  it('handles amount less than one unit', () => {
    expect(convertUnits(100000000000000n, 18)).toBe('0.0001')
  })
})

describe('convertWeiToRoundedDecimalWithSigFigs', () => {
  it('returns exact value when fraction length is within sigFigs', () => {
    expect(convertWeiToRoundedDecimalWithSigFigs('1500000000000000000', 18)).toBe('1.5')
  })

  it('truncates fraction to sigFigs without rounding up', () => {
    // 1.123444... -> 1.12344 (6th digit is 4, no round up)
    expect(convertWeiToRoundedDecimalWithSigFigs('1123444000000000000', 18)).toBe('1.12344')
  })

  it('rounds up fraction when 6th digit >= 5', () => {
    // 1.123445... -> 1.12345
    expect(convertWeiToRoundedDecimalWithSigFigs('1123445000000000000', 18)).toBe('1.12345')
  })

  it('carries over to whole part when fraction rounds up to 1', () => {
    // 1.999995... -> 2 (rounds 99999 + 1 = 100000, length > sigFigs)
    expect(convertWeiToRoundedDecimalWithSigFigs('1999995000000000000', 18)).toBe('2')
  })

  it('returns rounded first significant digit when whole is 0 and fraction rounds to all zeros', () => {
    // 0.000049... -> 0.00005 (first significant digit 4 rounds up due to next digit 9)
    expect(convertWeiToRoundedDecimalWithSigFigs('49000000000000', 18)).toBe('0.00005')
  })

  it('returns whole number when rounded fraction is all zeros and whole is non-zero', () => {
    // 1.000001 USDC (6 decimals) -> 1 (not <1)
    expect(convertWeiToRoundedDecimalWithSigFigs('1000001', 6)).toBe('1')
  })

  it('respects custom sigFigs parameter', () => {
    // fraction '123456789', sigFigs=2 → slice to '12', 3rd digit is '3' (<5), no round-up → '1.12'
    expect(convertWeiToRoundedDecimalWithSigFigs('1123456789000000000', 18, 2)).toBe('1.12')
  })

  it('returns whole number string when no decimal part', () => {
    expect(convertWeiToRoundedDecimalWithSigFigs('2000000000000000000', 18)).toBe('2')
  })

  it('returns <0.0001 for dust amounts where first significant digit is beyond sigFigs', () => {
    // 10 wei = 0.00000000000000001 ETH — first non-zero at index 16, beyond sigFigs=5
    expect(convertWeiToRoundedDecimalWithSigFigs('10', 18)).toBe('<0.0001')
  })
})

describe('interpolateTemplate', () => {
  it('interpolates sent asset value and ticker', () => {
    const result = interpolateTemplate(tV2('TRANSFER'), {
      sentAssets: [makeValueTransfer({ symbol: 'ETH', amount: '1000000000000000000', decimal: 18 })],
      receivedAssets: [],
    })
    expect(result).toBe('Transferred 1 ETH')
  })

  it('interpolates received asset value and ticker', () => {
    const result = interpolateTemplate(tV2('CLAIM'), {
      sentAssets: [],
      receivedAssets: [makeValueTransfer({ symbol: 'UNI', amount: '5000000000000000000', decimal: 18 })],
    })
    expect(result).toBe('Claimed 5 UNI')
  })

  it('interpolates both sent and received for EXCHANGE', () => {
    const result = interpolateTemplate(tV2('EXCHANGE'), {
      sentAssets: [makeValueTransfer({ symbol: 'DAI', amount: '1000000', decimal: 6 })],
      receivedAssets: [makeValueTransfer({ symbol: 'ETH', amount: '500000000000000000', decimal: 18 })],
    })
    expect(result).toBe('Swapped 1 DAI for 0.5 ETH')
  })

  it('handles missing assets gracefully', () => {
    const result = interpolateTemplate(tV2('EXCHANGE'), {
      sentAssets: [],
      receivedAssets: [],
    })
    expect(result).toBe('Swapped for')
  })

  it('interpolates spender for APPROVE', () => {
    const result = interpolateTemplate(tV2('APPROVE'), {
      sentAssets: [],
      receivedAssets: [],
      spender: '0x1234567890abcdef1234567890abcdef12345678',
      approvedAssets: [makeValueTransfer({ symbol: 'USDC', amount: '1000000', decimal: 6 })],
    })
    expect(result).toBe('Approved 0x1234567890abcdef1234567890abcdef12345678 to spend 1 USDC')
  })

  it('handles static templates with no variables', () => {
    const result = interpolateTemplate(tV2('VOTE'), {
      sentAssets: [],
      receivedAssets: [],
    })
    expect(result).toBe('Voted')
  })

  it('handles EXCHANGE_FOR_MULTI template', () => {
    const result = interpolateTemplate(tV2('EXCHANGE_FOR_MULTI'), {
      sentAssets: [makeValueTransfer({ symbol: 'ETH', amount: '1000000000000000000', decimal: 18 })],
      receivedAssets: [
        makeValueTransfer({ symbol: 'DAI', amount: '2000000000', decimal: 6 }),
        makeValueTransfer({ symbol: 'USDC', amount: '1000000000', decimal: 6 }),
      ],
    })
    expect(result).toBe('Swapped 1 ETH for 2000 DAI and 1000 USDC')
  })
})

describe('refineActionForMultiAssets', () => {
  it('refines EXCHANGE to EXCHANGE_FOR_MULTI when multiple received', () => {
    const result = refineActionForMultiAssets(
      Action.EXCHANGE,
      [makeValueTransfer()],
      [makeValueTransfer(), makeValueTransfer()],
    )
    expect(result).toBe(Action.EXCHANGE_FOR_MULTI)
  })

  it('refines EXCHANGE to EXCHANGE_FROM_MULTI when multiple sent', () => {
    const result = refineActionForMultiAssets(
      Action.EXCHANGE,
      [makeValueTransfer(), makeValueTransfer()],
      [makeValueTransfer()],
    )
    expect(result).toBe(Action.EXCHANGE_FROM_MULTI)
  })

  it('refines DEPOSIT to DEPOSIT_MULTI when multiple sent', () => {
    const result = refineActionForMultiAssets(Action.DEPOSIT, [makeValueTransfer(), makeValueTransfer()], [])
    expect(result).toBe(Action.DEPOSIT_MULTI)
  })

  it('refines WITHDRAW to WITHDRAW_MULTI when multiple received', () => {
    const result = refineActionForMultiAssets(Action.WITHDRAW, [], [makeValueTransfer(), makeValueTransfer()])
    expect(result).toBe(Action.WITHDRAW_MULTI)
  })

  it('returns original action when no multi-asset refinement needed', () => {
    expect(refineActionForMultiAssets(Action.EXCHANGE, [makeValueTransfer()], [makeValueTransfer()])).toBe(
      Action.EXCHANGE,
    )
    expect(refineActionForMultiAssets(Action.VOTE, [], [])).toBe(Action.VOTE)
  })
})
