import { Language, fallbackLng, isI18nextInitialized, t } from './localization'
import { contractAddressMap, methodIdMap, topicHashMap } from './txSchemas/heuristicMap'
import { DetermineTransactionMetadataInputV5, TxMetadata } from './types'
import { titlecase } from './utils'

interface TxMetadataPriority {
  transactionProtocol: number
  transactionCategory: number
  toAddressName: number
}

const maybeOverwriteProtocol = (protocol: string) => {
  switch (protocol) {
    case 'ERC_1155':
    case 'ERC_20':
      return 'TOKEN'
    case 'ERC_721':
      return 'NFT'
    default:
      return protocol
  }
}

const tryUpdateTransactionProtocol = (
  txMetadata: TxMetadata,
  txMetadataPriorities: TxMetadataPriority,
  log: boolean,
  protocol?: string,
  priority = 0,
) => {
  if (!protocol) return
  if (txMetadataPriorities.transactionProtocol < priority) {
    if (log) {
      console.log('writing transactionProtocol', protocol)
    }
    txMetadata.transactionProtocol = protocol
    txMetadataPriorities.transactionProtocol = priority
  }
}

const tryUpdateTransactionCategory = (
  txMetadata: TxMetadata,
  txMetadataPriorities: TxMetadataPriority,
  log?: boolean,
  category?: string,
  priority = 0,
) => {
  if (!category) return
  if (txMetadataPriorities.transactionCategory < priority) {
    if (log) {
      console.log('writing transactionCategory', category)
    }

    txMetadata.transactionCategory = category
    txMetadataPriorities.transactionCategory = priority
  }
}

export const determineTransactionMetadataV5 = (
  input: DetermineTransactionMetadataInputV5,
  language?: Language,
  log?: boolean,
  spamTransferThreshold = 500,
) => {
  const { transaction } = input
  if (!transaction) {
    throw new Error('No transaction provided')
  }
  if (!transaction.toAddress) {
    transaction.toAddress = transaction['to']
    transaction.fromAddress = transaction['from']
  }
  if (log) {
    console.log('transaction', transaction)
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
  const txMetadataPriorities: TxMetadataPriority = {
    transactionProtocol: -100,
    transactionCategory: -100,
    toAddressName: -100,
  }

  const toAddressContractMeta = contractAddressMap[transaction.toAddress]
  if (toAddressContractMeta) {
    if (log) console.log('writing toAddressName', toAddressContractMeta?.name)
    txMetadata.toAddressName = toAddressContractMeta?.name
    txMetadataPriorities.toAddressName = 0

    tryUpdateTransactionProtocol(txMetadata, txMetadataPriorities, log, toAddressContractMeta?.protocol, 0)

    const methodIdMeta = methodIdMap[transaction.methodId]

    if (methodIdMeta) {
      const priority = methodIdMeta?.priority
      tryUpdateTransactionCategory(txMetadata, txMetadataPriorities, log, methodIdMeta?.name, priority)
    }
  }
  if (!toAddressContractMeta && transaction.methodId) {
    const methodIdMeta = methodIdMap[transaction.methodId]
    if (methodIdMeta) {
      tryUpdateTransactionProtocol(txMetadata, txMetadataPriorities, log, methodIdMeta.protocol, methodIdMeta.priority)
      tryUpdateTransactionCategory(txMetadata, txMetadataPriorities, log, methodIdMeta?.name, methodIdMeta?.priority)
    }
  }
  if (log) console.log('txMetadata pre overwrite search', { ...txMetadata, txMetadataPriorities })

  // If we still don't have a transaction category or protocol,
  // or if it's one of the negative types (erc20/erc721 native methods)
  // check the topics to see if there are any composite events
  if (
    !txMetadata.transactionCategory ||
    !txMetadata.transactionProtocol ||
    Object.values(txMetadataPriorities).some((priority) => priority < 0)
  ) {
    if (log) console.log('missing transaction category or protocol, using tx topics', transaction.topics)
    for (const topic of transaction.topics) {
      const { name: topicName, protocol, priority } = topicHashMap[topic] || {}
      if (!topicName && !protocol) {
        if (log) console.log('skipping topic', topic, 'due to no labeled topicName or protocol')
        continue
      }
      if (log) console.log('not skipping topic. checking', topic, ' using category', topicName, 'protocol', protocol)

      // rollingPriority = priority
      if (topicName) {
        tryUpdateTransactionProtocol(txMetadata, txMetadataPriorities, log, protocol, priority)
        tryUpdateTransactionCategory(txMetadata, txMetadataPriorities, log, topicName, priority)
      }
    }
  }
  const { transactionProtocol, transactionCategory, toAddressName } = txMetadata

  if (toAddressName === 'WETH') {
    if (txMetadata.transactionCategory === 'WITHDRAW') {
      txMetadata.transactionCategory = 'UNWRAP'
    }
  }
  if (log) {
    console.log('txMetadata post overwrite search', { ...txMetadata, txMetadataPriorities })
  }
  if (transactionProtocol && transactionCategory) {
    const definingTrait = toAddressContractMeta?.definingTrait ?? ''
    const trait = definingTrait ? `${definingTrait}_` : ''
    const version = toAddressContractMeta?.version ? toAddressContractMeta?.version + '_' : ''

    txMetadata.transactionType = `${transactionProtocol}_${trait}${version}${txMetadata.transactionCategory}`

    if (isI18nextInitialized(language ?? fallbackLng)) {
      const rawVersion = toAddressContractMeta?.version || ''
      const transactionProtocolToUse = maybeOverwriteProtocol(transactionProtocol)
      const protocol = titlecase(transactionProtocolToUse)
      const localizedReadable = `${protocol}${definingTrait && ` ${titlecase(definingTrait)}`}${
        rawVersion && ` ${rawVersion}`
      }: ${t(txMetadata.transactionCategory, {}, language)}`

      txMetadata.readable = localizedReadable
    }
  }
  // if we still don't have a transaction category, default to generic contract call
  // also - if the transaction priority is < 0 (i.e. - contains an erc20/erc721 event by log events, but not by methodId
  // categorize those as generic contract calls as well)
  if (
    !Object.keys(txMetadata).length ||
    txMetadataPriorities.transactionCategory < 0 ||
    txMetadataPriorities.transactionProtocol < 0
  ) {
    const txMetadata: TxMetadata = {
      transactionType: 'GENERIC_CONTRACT_CALL',
      transactionCategory: 'CONTRACT_CALL',
      readable: `${t('CONTRACT_CALL')}`,
    }

    if (!transaction.logs || !transaction.logs.length) {
      txMetadata.transactionType = 'STANDARD'
      txMetadata.transactionCategory = 'STANDARD'
      txMetadata.readable = `${t('STANDARD', {}, language)}`
    }
    if (transaction.logs && transaction.logs.length > spamTransferThreshold) {
      txMetadata.transactionType = 'SPAM_TOKEN_TRANSFER'
      txMetadata.transactionCategory = 'TRANSFER'
      txMetadata.transactionProtocol = 'SPAM_TOKEN'
      txMetadata.readable = `${titlecase(txMetadata.transactionProtocol)}: ${t(
        txMetadata.transactionCategory,
        {},
        language,
      )}`
    }

    if (isI18nextInitialized()) {
      txMetadata.readable = `${titlecase(txMetadata.transactionProtocol)}: ${t(
        txMetadata.transactionCategory,
        {},
        language,
      )}`
    }

    return txMetadata
  }

  return txMetadata
}
