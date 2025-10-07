import axios from 'axios'
import { ChainId } from './chainId'

import { lineaTxTestCases, txTestCases } from './testCases.mock'

import { Language, determineTransactionMetadataV5, initializeI18next } from './index'

jest.setTimeout(30 * 1000)

const getTxWithLogsFromPrimitives = async (txHash: string, chainId = ChainId.ETHEREUM) => {
  const regexForTxHash = /^0x[0-9a-fA-F]{64}$/
  if (!regexForTxHash.test(txHash)) {
    throw new Error(`Invalid txHash ${txHash} ~ ${chainId}`)
  }
  const { data } = await axios.get(
    `https://primitives.api.cx.metamask.io/v1/networks/${chainId}/transactions/${txHash}`,
    {
      params: {
        includeLogs: true,
      },
    },
  )

  return data
}

describe('#txCategorizeV2', () => {
  // initialize i18next
  beforeAll(async () => {
    initializeI18next(Language.en)
  })
  it('categorizes an ethereum tx correctly', async () => {
    for (const [txCategory, txHash] of Object.entries(txTestCases)) {
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
