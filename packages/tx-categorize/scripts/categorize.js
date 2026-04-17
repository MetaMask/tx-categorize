const { determineTransactionMetadataV6 } = require('../dist/txCategorizeV6')
const { initializeI18nextV2 } = require('../dist/localizationV2/index.js')
const { Language } = require('../dist/localization/index.js')
const axios = require('axios')

const regexForTxHash = /^0x[0-9a-fA-F]{64}$/

const getTxWithLogsFromPrimitives = async (txHash) => {
  // initialize i18next
  const { data } = await axios.get(
    `https://primitives.api.cx.metamask.io/v1/networks/${chainId}/transactions/${txHash}`,
    {
      params: {
        includeLogs: true,
        includeValueTransfers: true,
      },
    },
  )
  return { transaction: data.data }
}

const importTxData = async (txHash, chainId = 1, subjectAddress = null) => {
  await initializeI18nextV2(Language.en)

  const txData = await getTxWithLogsFromPrimitives(txHash, chainId)
  console.log('Categorized tx: ', txData)
  if (!txData || !txData.transaction) {
    throw new Error(`No transaction data found for address 'eip155:${chainId}:${txHash}'`)
  }
  const subject = subjectAddress || txData.transaction.from
  const categorizedTx = determineTransactionMetadataV6(
    { ...txData, subjectAddress: `eip155:${chainId}:${subject}` },
    'en',
    true,
    49,
  )
  return categorizedTx
}

// get value from cli and call importTxData
const txHash = process.argv[2]
const chainId = process.argv[3] || 1
const subjectAddress = process.argv[4] || process.env.SUBJECT_ADDRESS || null
if (!regexForTxHash.test(txHash)) {
  console.error('Usage: yarn categorize <txHash> [chainId] [subjectAddress]')
  console.error('  Or set SUBJECT_ADDRESS env var')
  console.error('  Defaults to transaction.from if no subject address provided')
  process.exit(1)
}
importTxData(txHash, chainId, subjectAddress)
  .then((categorizedTx) => {
    console.log('Categorized Type: ', categorizedTx)
  })
  .catch((error) => {
    console.error(error)
  })
