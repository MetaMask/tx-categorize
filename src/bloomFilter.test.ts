import { doesTxMatchSchema } from './bloomFilter'
import { Transaction } from './types'

jest.mock('./chainId', () => ({
  NETWORKS_CONFIG: { 1: true },
}))

jest.mock('./constants', () => ({
  getSchemaByChainId: jest
    .fn()
    .mockReturnValueOnce([{ schema: { toAddress: '0x82E0b8cDD80Af5930c4452c684E71c861148Ec8A' } }]),
}))

describe('bloomFilter', () => {
  it('builds bloom and matches a transaction correctly with match', () => {
    const txWithMatch: Transaction = {
      toAddress: '0x82E0b8cDD80Af5930c4452c684E71c861148Ec8A',
    }

    const isPotentialMatch = doesTxMatchSchema(1, txWithMatch)

    expect(isPotentialMatch).toBe(true)
  })

  it('builds bloom and matches a transaction correctly without match', () => {
    const txWithoutMatch: Transaction = {
      topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        '0x0000000000000000000000000af0491b49563e4f2dddb07fc14427f6ae008d25',
        '0x000000000000000000000000af4774798b5a9c6f831cae5e56d8b12d25ae3972',
      ],
    }

    const isPotentialMatch = doesTxMatchSchema(1, txWithoutMatch)

    expect(isPotentialMatch).toBe(false)
  })
})
