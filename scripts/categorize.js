const { determineTransactionMetadataV5 } = require('../dist/txCategorizeV5');
const { initializeI18next, Language } = require('../dist/localization/index.js')
const axios = require('axios')

const regexForTxHash = /^0x[0-9a-fA-F]{64}$/

const getTxWithLogsFromPrimitives = async (txHash) => {
  // initialize i18next
  const { data } = await axios.get(
    `https://primitives.api.cx.metamask.io/v1/networks/${chainId}/transactions/${txHash}`,
    {
      params: {
        includeLogs: true,
      },
    },
  )
  return { transaction: data.data }
}

const importTxData = async (txHash, chainId = 1) => {
  await initializeI18next(Language.en)

  const txData = await getTxWithLogsFromPrimitives(txHash, chainId)
  console.log('Categorized tx: ', txData)
  if (!txData || !txData.transaction) {
    throw new Error(`No transaction data found for address 'eip155:${chainId}:${txHash}'`)
  }
  const categorizedTx = determineTransactionMetadataV5(txData, 'en', true, 49)
  return categorizedTx
}

// get value from cli and call importTxData
const txHash = process.argv[2]
const chainId = process.argv[3] || 1
if (!regexForTxHash.test(txHash)) {
  console.error('Invalid txHash: ' + txHash)
  process.exit(1)
}
importTxData(txHash, chainId)
  .then((categorizedTx) => {
    console.log('Categorized Type: ', categorizedTx)
  })
  .catch((error) => {
    console.error(error)
  })