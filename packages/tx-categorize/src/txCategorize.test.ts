import path from 'path'

import axios from 'axios'
import { type CaipAccountId } from '@metamask/utils'
import nock from 'nock'

import { ChainId } from './networks'
import {
  lineaTxTestCaseReadableLabels,
  lineaTxTestCases,
  txTestCaseReadableLabels,
  txTestCases,
} from './testCases.mock'
import { determineTransactionMetadataV6 } from './txCategorizeV6'

import {
  Language,
  Log,
  ValueTransfer,
  determineTransactionMetadataV5,
  initializeI18next,
  initializeI18nextV2,
} from './index'

jest.setTimeout(30 * 1000)

beforeAll(async () => {
  await Promise.resolve(initializeI18next(Language.en))
  await initializeI18nextV2(Language.en)
})

interface Tx {
  logs?: Log[]
  to: string
  from: string
  input?: string
  methodId?: string
  topics?: string[]
  hash?: string
  valueTransfers: ValueTransfer[]
}

interface SingleTransactionResponse {
  txHash: string
  chainId: number
  count: number
  data: Tx | undefined
}

const createAccountId = (address: string, chainId: number): CaipAccountId => {
  return `eip155:${chainId}:${address.toLowerCase()}`
}

let isNockConfigured = false

const getTxWithLogsFromPrimitives = async (
  txHash: string,
  chainId: ChainId = ChainId.ETHEREUM,
): Promise<SingleTransactionResponse> => {
  if (!isNockConfigured) {
    nock.back.fixtures = path.join(__dirname, '..', 'test-fixtures', 'nock')
    const explicitMode = process.env.NOCK_BACK_MODE as
      | 'record'
      | 'lockdown'
      | 'dryrun'
      | 'update'
      | 'wild'
      | undefined
    // Local default: record (replay fixtures when present; can hit network to add/update them).
    // CI sets CI=true — default lockdown there so tests stay offline and deterministic.
    const defaultMode = process.env.CI === 'true' ? 'lockdown' : 'record'
    nock.back.setMode(explicitMode || defaultMode)
    isNockConfigured = true
  }

  const regexForTxHash = /^0x[0-9a-fA-F]{64}$/
  if (!regexForTxHash.test(txHash)) {
    throw new Error(`Invalid txHash ${txHash} ~ ${chainId}`)
  }
  const fixtureName = `${chainId}-${txHash.toLowerCase()}.json`
  const { nockDone, context } = await nock.back(fixtureName)
  try {
    const { data } = await axios.get<SingleTransactionResponse>(
      `https://primitives.api.cx.metamask.io/v1/networks/${chainId}/transactions/${txHash}`,
      {
        params: {
          includeLogs: true,
          includeValueTransfers: true,
        },
      },
    )

    return data
  } catch (cause) {
    // AxiosError carries circular refs (request ↔ redirect); Jest workers JSON-serialize
    // failures and crash with "Converting circular structure to JSON" if we rethrow it.
    const message = cause instanceof Error ? cause.message : String(cause)
    throw new Error(`Primitives request failed for ${fixtureName}: ${message}`)
  } finally {
    nockDone()
    context.assertScopesFinished()
  }
}

/** Serializable slice of metadata for snapshot visibility (V5 vs V6). */
const pickCategorizationForSnapshot = (meta: {
  transactionType?: string
  transactionCategory?: string
  transactionProtocol?: string
  toAddressName?: string
  readable?: string
}) => ({
  transactionType: meta.transactionType,
  transactionCategory: meta.transactionCategory,
  transactionProtocol: meta.transactionProtocol,
  toAddressName: meta.toAddressName,
  readable: meta.readable,
})

interface CategorizationSnapshotRow {
  txHash: string
  v5: ReturnType<typeof pickCategorizationForSnapshot>
  v6: ReturnType<typeof pickCategorizationForSnapshot>
}

const buildV5V6SnapshotForCases = async (
  cases: Record<string, string>,
  chainId: ChainId,
): Promise<Record<string, CategorizationSnapshotRow>> => {
  const out: Record<string, CategorizationSnapshotRow> = {}
  const sorted = Object.entries(cases).sort(([a], [b]) => a.localeCompare(b))
  for (const [category, txHash] of sorted) {
    if (!txHash) {
      continue
    }
    const { data, chainId: responseChainId } = await getTxWithLogsFromPrimitives(txHash, chainId)
    const subjectAddress = createAccountId(data.from, responseChainId)
    const v5 = determineTransactionMetadataV5({ transaction: data }, Language.en, false, 49)
    const v6 = determineTransactionMetadataV6({ transaction: data, subjectAddress }, Language.en, false, 49)
    out[category] = {
      txHash,
      v5: pickCategorizationForSnapshot(v5),
      v6: pickCategorizationForSnapshot(v6),
    }
  }

  return out
}

describe('#txCategorizeV2', () => {
  it('categorizes an ethereum tx correctly', async () => {
    for (const [txCategory, txHash] of Object.entries(txTestCases)) {
      if (!txHash) {
        continue
      }
      const { data } = await getTxWithLogsFromPrimitives(txHash)

      const categorizedTxV5 = determineTransactionMetadataV5(
        {
          transaction: data,
        },
        Language.en,
        false,
        49,
      )
      expect(`${categorizedTxV5['transactionType']}-${data.hash}`).toBe(`${txCategory}-${data.hash}`)
    }
  })
  it('categorizes a linea tx correctly', async () => {
    for (const [txCategory, txHash] of Object.entries(lineaTxTestCases)) {
      const { data } = await getTxWithLogsFromPrimitives(txHash, ChainId.LINEA)
      const categorizedTxV5 = determineTransactionMetadataV5(
        {
          transaction: data,
        },
        Language.en,
        false,
        49,
      )
      expect(`${categorizedTxV5['transactionType']}-${data.hash}`).toBe(`${txCategory}-${data.hash}`)
    }
  })
  it('properly attaches a label to a GENERIC_CONTRACT_CALL tx', async () => {
    const txHash = txTestCases['GENERIC_CONTRACT_CALL']
    if (!txHash) {
      throw new Error('No txHash found for GENERIC_CONTRACT_CALL test')
    }
    const { data } = await getTxWithLogsFromPrimitives(txHash)
    const categorizedTxV5 = determineTransactionMetadataV5(
      {
        transaction: data,
      },
      Language.en,
      false,
      49,
    )
    expect(categorizedTxV5['readable']).toBe('Unidentified Transaction')
  })
  it('properly attaches a label to a STANDARD tx', async () => {
    const txHash = txTestCases['STANDARD']
    if (!txHash) {
      throw new Error('No txHash found for STANDARD test')
    }
    const { data } = await getTxWithLogsFromPrimitives(txHash)
    const categorizedTxV5 = determineTransactionMetadataV5(
      {
        transaction: data,
      },
      Language.en,
      false,
      49,
    )
    expect(categorizedTxV5['readable']).toBe('Native Transfer')
  })
  it('properly attaches a spam transfer label to a tx', async () => {
    const txHash = txTestCases['SPAM_TOKEN_TRANSFER']
    if (!txHash) {
      throw new Error('No txHash found for SPAM_TOKEN_TRANSFER test')
    }
    const { data } = await getTxWithLogsFromPrimitives(txHash)
    const categorizedTxV5 = determineTransactionMetadataV5(
      {
        transaction: data,
      },
      Language.en,
      false,
      49,
    )
    expect(categorizedTxV5['readable']).toBe('Spam Token: Transfer')
  })
  it('properly relables ERC20 transfers as Token Transfer', async () => {
    const txHash = txTestCases['ERC_20_TRANSFER']
    if (!txHash) {
      throw new Error('No txHash found for ERC_20_TRANSFER test')
    }
    const { data } = await getTxWithLogsFromPrimitives(txHash)
    const categorizedTxV5 = determineTransactionMetadataV5(
      {
        transaction: data,
      },
      Language.en,
      false,
      49,
    )
    expect(categorizedTxV5['readable']).toBe('Token: Transfer')
  })
})

describe('#txCategorizeV6', () => {
  it('categorizes an ethereum tx correctly', async () => {
    for (const [txCategory, txHash] of Object.entries(txTestCases)) {
      if (!txHash) {
        continue
      }
      const { data, chainId } = await getTxWithLogsFromPrimitives(txHash)

      const categorizedTxV5 = determineTransactionMetadataV6(
        {
          transaction: data,
          subjectAddress: createAccountId(data.from, chainId),
        },
        Language.en,
        false,
        49,
      )
      expect(`${categorizedTxV5['transactionType']}-${data.hash}`).toBe(`${txCategory}-${data.hash}`)
    }
  })
  it('categorizes a linea tx correctly', async () => {
    for (const [txCategory, txHash] of Object.entries(lineaTxTestCases)) {
      const { data, chainId } = await getTxWithLogsFromPrimitives(txHash, ChainId.LINEA)
      const categorizedTxV5 = determineTransactionMetadataV6(
        {
          transaction: data,
          subjectAddress: createAccountId(data.from, chainId),
        },
        Language.en,
        false,
        49,
      )
      expect(`${categorizedTxV5['transactionType']}-${data.hash}`).toBe(`${txCategory}-${data.hash}`)
    }
  })
  it('produces correct readable labels for ethereum txs', async () => {
    for (const [txCategory, txHash] of Object.entries(txTestCases)) {
      const expectedReadable = txTestCaseReadableLabels[txCategory]
      if (!txHash || !expectedReadable) {
        continue
      }

      const { data, chainId } = await getTxWithLogsFromPrimitives(txHash)
      const categorizedTx = determineTransactionMetadataV6(
        {
          transaction: data,
          subjectAddress: createAccountId(data.from, chainId),
        },
        Language.en,
        false,
        49,
      )
      expect(`${categorizedTx['readable']}-${txCategory}`).toBe(`${expectedReadable}-${txCategory}`)
    }
  })
  it('produces correct readable labels for linea txs', async () => {
    for (const [txCategory, txHash] of Object.entries(lineaTxTestCases)) {
      const expectedReadable = lineaTxTestCaseReadableLabels[txCategory]
      if (!expectedReadable) continue

      const { data, chainId } = await getTxWithLogsFromPrimitives(txHash, ChainId.LINEA)
      const categorizedTx = determineTransactionMetadataV6(
        {
          transaction: data,
          subjectAddress: createAccountId(data.from, chainId),
        },
        Language.en,
        false,
        49,
      )
      expect(`${categorizedTx['readable']}-${txCategory}`).toBe(`${expectedReadable}-${txCategory}`)
    }
  })
  it('has readable label entries for all ethereum test cases', () => {
    const missingLabels = Object.keys(txTestCases).filter((key) => !(key in txTestCaseReadableLabels))
    expect(missingLabels).toEqual([])
  })
  it('has readable label entries for all linea test cases', () => {
    const missingLabels = Object.keys(lineaTxTestCases).filter((key) => !(key in lineaTxTestCaseReadableLabels))
    expect(missingLabels).toEqual([])
  })
  it('properly attaches a label to a GENERIC_CONTRACT_CALL tx', async () => {
    const txHash = txTestCases['GENERIC_CONTRACT_CALL']
    if (!txHash) {
      throw new Error('No txHash found for GENERIC_CONTRACT_CALL test')
    }
    const { data, chainId } = await getTxWithLogsFromPrimitives(txHash)
    const categorizedTxV5 = determineTransactionMetadataV6(
      {
        transaction: data,
        subjectAddress: createAccountId(data.from, chainId),
      },
      Language.en,
      false,
      49,
    )
    expect(categorizedTxV5['readable']).toBe('Unidentified Transaction')
  })
  it('properly attaches a "Sent" label to a STANDARD tx from sender perspective', async () => {
    const txHash = txTestCases['STANDARD']
    if (!txHash) {
      throw new Error('No txHash found for STANDARD test')
    }
    const { data, chainId } = await getTxWithLogsFromPrimitives(txHash)
    const categorizedTxV5 = determineTransactionMetadataV6(
      {
        transaction: data,
        subjectAddress: createAccountId(data.from, chainId),
      },
      Language.en,
      false,
      49,
    )
    expect(categorizedTxV5['readable']).toMatch(/^Sent/)
  })
  it('properly attaches a spam label to a dust native transfer', async () => {
    const txHash = '0xeda92a5cf7dc7e329ed123d85df969c075707758a853e0c5f0f77c1cf772b3bc'
    const { data, chainId } = await getTxWithLogsFromPrimitives(txHash)
    const categorizedTxV5 = determineTransactionMetadataV6(
      {
        transaction: data,
        subjectAddress: createAccountId(data.to, chainId),
      },
      Language.en,
      false,
      49,
    )
    expect(categorizedTxV5['transactionType']).toBe('SPAM_TRANSFER')
    expect(categorizedTxV5['readable']).toBe('Dust Attack')
  })
  it('properly attaches a spam transfer label to a tx', async () => {
    const txHash = txTestCases['SPAM_TOKEN_TRANSFER']
    if (!txHash) {
      throw new Error('No txHash found for SPAM_TOKEN_TRANSFER test')
    }
    const { data, chainId } = await getTxWithLogsFromPrimitives(txHash)
    const categorizedTxV5 = determineTransactionMetadataV6(
      {
        transaction: data,
        subjectAddress: createAccountId(data.from, chainId),
      },
      Language.en,
      false,
      49,
    )
    expect(categorizedTxV5['readable']).toBe('Dust Attack')
  })
  it('properly relables ERC20 transfers as Token Transfer', async () => {
    const txHash = txTestCases['ERC_20_TRANSFER']
    if (!txHash) {
      throw new Error('No txHash found for ERC_20_TRANSFER test')
    }
    const { data, chainId } = await getTxWithLogsFromPrimitives(txHash)
    const categorizedTxV5 = determineTransactionMetadataV6(
      {
        transaction: data,
        subjectAddress: createAccountId(data.from, chainId),
      },
      Language.en,
      false,
      49,
    )
    expect(categorizedTxV5['readable']).toBe('Sent 0.0044 MKR')
  })
  it('properly attaches a label to an ERC_20_APPROVE tx with spender address', async () => {
    const txHash = txTestCases['ERC_20_APPROVE']
    if (!txHash) {
      throw new Error('No txHash found for ERC_20_APPROVE test')
    }
    const { data, chainId } = await getTxWithLogsFromPrimitives(txHash)
    const categorizedTxV5 = determineTransactionMetadataV6(
      {
        transaction: data,
        subjectAddress: createAccountId(data.from, chainId),
      },
      Language.en,
      false,
      49,
    )
    // Spender should be extracted from the Approval event log
    expect(categorizedTxV5['readable']).toMatch(/Approved.*to spend/)
  })
})

describe('V5 / V6 categorization snapshots (alongside nock HTTP fixtures)', () => {
  it('matches snapshot for all ethereum txTestCases', async () => {
    expect(await buildV5V6SnapshotForCases(txTestCases, ChainId.ETHEREUM)).toMatchSnapshot()
  })

  it('matches snapshot for all lineaTxTestCases', async () => {
    expect(await buildV5V6SnapshotForCases(lineaTxTestCases, ChainId.LINEA)).toMatchSnapshot()
  })
})
