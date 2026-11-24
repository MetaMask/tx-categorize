const { determineTransactionMetadataV6 } = require('../dist/txCategorizeV6')
const { initializeI18nextV2 } = require('../dist/localizationV2/index.js')
const { Language } = require('../dist/localization/index.js')
const axios = require('axios')

const regexForTxHash = /^0x[0-9a-fA-F]{64}$/

/**
 * Fetch a transaction (with logs and value transfers) from the MetaMask Primitives API.
 *
 * @param {string} txHash - the transaction hash
 * @param {number} chainId - the numeric chain id the transaction lives on
 * @returns {Promise<{ transaction: object }>} the transaction wrapped the way `determineTransactionMetadataV6` expects it
 */
const getTxWithLogsFromPrimitives = async (txHash, chainId) => {
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

/**
 * Fetch a transaction and categorize it from the perspective of `subjectAddress`.
 *
 * @param {string} txHash - the transaction hash
 * @param {number} chainId - the numeric chain id
 * @param {string | null} subjectAddress - the address the labels are written for (defaults to `transaction.from`)
 * @param {string} language - a `Language` value (e.g. `en`, `es`) used for both initialization and categorization
 * @returns {Promise<object>} the categorized transaction metadata
 */
const importTxData = async (txHash, chainId, subjectAddress, language) => {
  // Step 1: initialize i18next for the requested language (same language is passed to the categorizer below)
  await initializeI18nextV2(language)

  // Step 2: fetch the transaction
  const txData = await getTxWithLogsFromPrimitives(txHash, chainId)
  if (!txData || !txData.transaction) {
    throw new Error(`No transaction data found for address 'eip155:${chainId}:${txHash}'`)
  }
  console.log('Fetched tx: ', txData)

  // Step 3: categorize it from the subject's perspective
  const subject = subjectAddress || txData.transaction.from
  return determineTransactionMetadataV6({ ...txData, subjectAddress: `eip155:${chainId}:${subject}` }, language, true, 49)
}

/**
 * Print usage information and exit with a non-zero code.
 *
 * @param {string} [reason] - optional explanation of what was wrong with the arguments
 */
const exitWithUsage = (reason) => {
  if (reason) {
    console.error(reason)
  }
  console.error('Usage: yarn categorize <txHash> [chainId] [subjectAddress]')
  console.error('  Or set SUBJECT_ADDRESS env var')
  console.error('  Defaults to transaction.from if no subject address provided')
  console.error(`  Set CATEGORIZE_LANGUAGE to one of: ${Object.values(Language).join(', ')} (default: en)`)
  process.exit(1)
}

// Step 1: read and validate CLI arguments / environment
const txHash = process.argv[2]
const chainId = Number(process.argv[3] || 1)
const subjectAddress = process.argv[4] || process.env.SUBJECT_ADDRESS || null
const language = process.env.CATEGORIZE_LANGUAGE || Language.en

if (!regexForTxHash.test(txHash)) {
  exitWithUsage()
}
if (!Number.isInteger(chainId) || chainId <= 0) {
  exitWithUsage(`Invalid chainId '${process.argv[3]}'`)
}
if (!Object.values(Language).includes(language)) {
  exitWithUsage(`Unsupported CATEGORIZE_LANGUAGE '${language}'`)
}

// Step 2: categorize, and fail the process (non-zero exit code) if anything goes wrong
importTxData(txHash, chainId, subjectAddress, language)
  .then((categorizedTx) => {
    console.log('Categorized Type: ', categorizedTx)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
