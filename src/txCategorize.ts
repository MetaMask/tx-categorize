import { t } from './localization'
import { contractAddressMap, methodIdMap, topicHashMap } from './txSchemas/heuristicMap'
import { DetermineTransactionMetadataInputV5, TxMetadata } from './types'
import { titlecase } from './utils'

export const determineTransactionMetadata = (input: DetermineTransactionMetadataInputV5) => {
  const { transaction } = input
  if (!transaction.toAddress) {
    transaction.toAddress = transaction['to']
    transaction.fromAddress = transaction['from']
  }

  /**
   * use the logs to determine the transaction topics.
   * add log topics length for better matching (used for differentiation between erc721 & erc20 token transfers)
   * tack the rest of the topics onto the transaction topics array for the purpose of adding more-discrete matching like
   * "METAMASK_CARD_APPROVE" instead of "ERC_20_APPROVE"
   */
  transaction.topics = transaction.logs
    ?.map((log) => (log?.topics.length > 0 ? [...log.topics, `${log?.topics[0]}#${log?.topics?.length}`] : []))
    .flat()
  const txMetadata: TxMetadata = {}

  const toAddressContractMeta = contractAddressMap[transaction.toAddress]
  if (toAddressContractMeta) {
    txMetadata.toAddressName = toAddressContractMeta?.name
    txMetadata.transactionProtocol = toAddressContractMeta?.protocol

    const methodIdMeta = methodIdMap[transaction.methodId]

    txMetadata.transactionCategory = methodIdMeta?.name
  }

  if (!toAddressContractMeta && transaction.methodId) {
    const methodIdMeta = methodIdMap[transaction.methodId]

    if (methodIdMeta) {
      txMetadata.transactionProtocol = methodIdMeta.protocol
      txMetadata.transactionCategory = methodIdMeta?.name
    }
  }

  // If we still don't have a transaction category, check the topics
  if (!txMetadata.transactionCategory || !txMetadata.transactionProtocol) {
    for (const topic of transaction.topics) {
      const { name: topicName, protocol } = topicHashMap[topic] || {}

      if (topicName) {
        txMetadata.transactionCategory = topicName
      }

      if (txMetadata.transactionCategory && !txMetadata.transactionProtocol) {
        txMetadata.transactionProtocol = protocol
      }
    }
  }
  const { transactionProtocol, transactionCategory, toAddressName } = txMetadata

  if (toAddressName === 'WETH') {
    if (txMetadata.transactionCategory === 'WITHDRAW') {
      txMetadata.transactionCategory = 'UNWRAP'
    }
  }

  if (transactionProtocol && transactionCategory) {
    const definingTrait = toAddressContractMeta?.definingTrait ?? ''
    const trait = definingTrait ? `${definingTrait}_` : ''
    const rawVersion = toAddressContractMeta?.version || ''
    const version = toAddressContractMeta?.version ? toAddressContractMeta?.version + '_' : ''

    txMetadata.transactionType = `${transactionProtocol}_${trait}${version}${txMetadata.transactionCategory}`

    const protocol = titlecase(transactionProtocol)
    const localizedReadable = `${protocol}${definingTrait && ` ${titlecase(definingTrait)}`}${
      rawVersion && ` ${rawVersion}`
    }: ${t(txMetadata.transactionCategory)}`

    txMetadata.readable = localizedReadable
  }

  if (!Object.keys(txMetadata).length) {
    const txMetadata: TxMetadata = {
      transactionType: 'GENERIC_CONTRACT_CALL',
      transactionCategory: 'CONTRACT_CALL',
    }

    if (!transaction.logs || !transaction.logs.length) {
      txMetadata.transactionType = 'STANDARD'
      txMetadata.transactionCategory = 'STANDARD'
    }

    txMetadata.readable = `${titlecase(txMetadata.transactionType)}: ${t(txMetadata.transactionCategory)}`

    return txMetadata
  }

  return txMetadata
}
