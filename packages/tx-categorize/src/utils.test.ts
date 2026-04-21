import {
  convertUnits,
  convertWeiToRoundedDecimalWithSigFigs,
  formatCompactNumber,
  interpolateTemplate,
  refineActionForMultiAssets,
  truncateAddress,
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
  it('returns exact value when fraction length is within 4 decimal places', () => {
    expect(convertWeiToRoundedDecimalWithSigFigs('1500000000000000000', 18)).toBe('1.5')
  })

  it('rounds to 4 decimal places', () => {
    expect(convertWeiToRoundedDecimalWithSigFigs('1123444000000000000', 18)).toBe('1.1234')
  })

  it('rounds up when 5th decimal digit >= 5', () => {
    expect(convertWeiToRoundedDecimalWithSigFigs('1123456000000000000', 18)).toBe('1.1235')
  })

  it('carries over to whole part when fraction rounds up to 1', () => {
    expect(convertWeiToRoundedDecimalWithSigFigs('1999995000000000000', 18)).toBe('2')
  })

  it('returns <0.0001 for dust amounts', () => {
    expect(convertWeiToRoundedDecimalWithSigFigs('49000000000000', 18)).toBe('<0.0001')
  })

  it('returns whole number when rounded fraction is all zeros', () => {
    expect(convertWeiToRoundedDecimalWithSigFigs('1000001', 6)).toBe('1')
  })

  it('returns whole number string when no decimal part', () => {
    expect(convertWeiToRoundedDecimalWithSigFigs('2000000000000000000', 18)).toBe('2')
  })

  it('returns <0.0001 for very small dust amounts', () => {
    expect(convertWeiToRoundedDecimalWithSigFigs('10', 18)).toBe('<0.0001')
  })

  it('uses K suffix for thousands', () => {
    // 499962.37071 USDC
    expect(convertWeiToRoundedDecimalWithSigFigs('499962370710', 6)).toBe('499.96K')
  })

  it('uses M suffix for millions', () => {
    // 499962000.37071 USDC
    expect(convertWeiToRoundedDecimalWithSigFigs('499962000370710', 6)).toBe('499.96M')
  })
})

describe('formatCompactNumber', () => {
  it('returns 0 for zero', () => {
    expect(formatCompactNumber('0')).toBe('0')
  })

  it('returns 0 for NaN input', () => {
    expect(formatCompactNumber('abc')).toBe('0')
  })

  it('returns <0.0001 for very small numbers', () => {
    expect(formatCompactNumber('0.00000001')).toBe('<0.0001')
    expect(formatCompactNumber('0.00009')).toBe('<0.0001')
  })

  it('rounds small decimals to 4 decimal places', () => {
    expect(formatCompactNumber('0.03409')).toBe('0.0341')
    expect(formatCompactNumber('1.23456')).toBe('1.2346')
    expect(formatCompactNumber('0.1')).toBe('0.1')
    expect(formatCompactNumber('0.12345')).toBe('0.1235')
  })

  it('drops negligible fractional parts', () => {
    expect(formatCompactNumber('5.000001')).toBe('5')
    expect(formatCompactNumber('100.00001')).toBe('100')
  })

  it('formats thousands with K suffix', () => {
    expect(formatCompactNumber('1234.5')).toBe('1.23K')
    expect(formatCompactNumber('12345.678')).toBe('12.35K')
    expect(formatCompactNumber('499962.37071')).toBe('499.96K')
    expect(formatCompactNumber('1000')).toBe('1K')
  })

  it('formats millions with M suffix', () => {
    expect(formatCompactNumber('1000000')).toBe('1M')
    expect(formatCompactNumber('499962000.37071')).toBe('499.96M')
    expect(formatCompactNumber('1500000')).toBe('1.5M')
  })

  it('formats billions with B suffix', () => {
    expect(formatCompactNumber('1000000000')).toBe('1B')
    expect(formatCompactNumber('2500000000')).toBe('2.5B')
  })

  it('formats trillions with T suffix', () => {
    expect(formatCompactNumber('1000000000000')).toBe('1T')
    expect(formatCompactNumber('3750000000000')).toBe('3.75T')
  })

  it('strips trailing zeros from suffix numbers', () => {
    expect(formatCompactNumber('5000')).toBe('5K')
    expect(formatCompactNumber('1200')).toBe('1.2K')
    expect(formatCompactNumber('1230')).toBe('1.23K')
  })

  it('handles whole numbers below 1000', () => {
    expect(formatCompactNumber('5')).toBe('5')
    expect(formatCompactNumber('42')).toBe('42')
    expect(formatCompactNumber('999')).toBe('999')
  })

  it('promotes to next tier when rounding crosses a boundary', () => {
    // K → M boundary: 999999.5 / 1000 = 999.9995, toFixed(2) → "1000.00"
    expect(formatCompactNumber('999999.5')).toBe('1M')
    // M → B boundary
    expect(formatCompactNumber('999999500')).toBe('1B')
    // B → T boundary
    expect(formatCompactNumber('999999500000')).toBe('1T')
    // sub-K → K boundary: 999.99999 toFixed(4) → "1000.0000"
    expect(formatCompactNumber('999.99999')).toBe('1K')
  })

  it('handles values above the highest tier without infinite recursion', () => {
    // 1 quadrillion — exactly 1000T
    expect(formatCompactNumber('1000000000000000')).toBe('1000T')
    // 1.5 quadrillion
    expect(formatCompactNumber('1500000000000000')).toBe('1500T')
    // SHIB-scale supply: ~589 trillion
    expect(formatCompactNumber('589000000000000')).toBe('589T')
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
      spender: '0x12345...45678',
      approvedAssets: [makeValueTransfer({ symbol: 'USDC', amount: '1000000', decimal: 6 })],
    })
    expect(result).toBe('Approved 0x12345...45678 to spend 1 USDC')
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
    expect(result).toBe('Swapped 1 ETH for 2K DAI and 1K USDC')
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

describe('truncateAddress', () => {
  it('truncates a standard Ethereum address', () => {
    expect(truncateAddress('0x6B175474E89094C44Da98b954EedeAC495271d0F')).toBe('0x6B175...71d0F')
  })

  it('returns short strings unchanged', () => {
    expect(truncateAddress('0x123456')).toBe('0x123456')
  })

  it('returns 10-char string unchanged', () => {
    expect(truncateAddress('0x12345678')).toBe('0x12345678')
  })

  it('returns empty string unchanged', () => {
    expect(truncateAddress('')).toBe('')
  })
})
