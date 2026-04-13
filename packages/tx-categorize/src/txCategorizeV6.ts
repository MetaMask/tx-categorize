import { CaipAccountId } from '@metamask/utils'

import { Language } from './localization'
import { fallbackLngV2, tV2 } from './localizationV2'
import { contractAddressMap, methodIdMap, topicHashMap } from './txSchemas/heuristicMap'
import { DetermineTransactionMetadataInputV6, Transaction, TxMetadataV6, ValueTransfer } from './types'
import { TemplateContext, interpolateTemplate, refineActionForMultiAssets, titlecase } from './utils'
import { Action } from './enums'

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
  txMetadata: TxMetadataV6,
  txMetadataPriorities: TxMetadataPriority,
  log?: boolean,
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

const splitSentAndReceived = (transaction: Transaction, subjectAddress: CaipAccountId) => {
  return (
    transaction.valueTransfers?.reduce(
      (acc, transfer) => {
        if (transfer.from.toLowerCase() === subjectAddress.split(':')[2].toLowerCase()) {
          acc.sentAssets.push(transfer)
        }
        if (transfer.to.toLowerCase() === subjectAddress.split(':')[2].toLowerCase()) {
          acc.receivedAssets.push(transfer)
        }

        return acc
      },
      { sentAssets: [] as ValueTransfer[], receivedAssets: [] as ValueTransfer[] },
    ) || { sentAssets: [] as ValueTransfer[], receivedAssets: [] as ValueTransfer[] }
  )
}

const tryUpdateTransactionCategory = (
  txMetadata: TxMetadataV6,
  txMetadataPriorities: TxMetadataPriority,
  log?: boolean,
  category?: Action,
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

const APPROVAL_EVENT_TOPIC = '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'

const findApprovalLog = (transaction: Transaction) => {
  return transaction.logs?.find((log) => log.topics?.[0]?.toLowerCase() === APPROVAL_EVENT_TOPIC)
}

const extractSpender = (transaction: Transaction): string | undefined => {
  if (transaction.methodId !== '0x095ea7b3') return undefined

  // Try from input calldata
  if (transaction.input && transaction.input.length >= 138) {
    return '0x' + transaction.input.slice(34, 74)
  }

  // Fallback: extract from Approval event log
  const approvalLog = findApprovalLog(transaction)
  if (approvalLog?.topics?.[2]) {
    return '0x' + approvalLog.topics[2].slice(26)
  }

  return undefined
}

const extractApprovedAssets = (transaction: Transaction): ValueTransfer[] => {
  if (transaction.methodId !== '0x095ea7b3') return []

  let rawAmount: string | undefined
  let tokenContractAddress = transaction.toAddress

  // Try from input calldata
  if (transaction.input && transaction.input.length >= 138) {
    rawAmount = BigInt('0x' + transaction.input.slice(74, 138)).toString()
  }

  // Fallback: extract from Approval event log
  const approvalLog = findApprovalLog(transaction)
  if (approvalLog) {
    if (!rawAmount && approvalLog.data) {
      rawAmount = BigInt(approvalLog.data).toString()
    }
    if (!tokenContractAddress) {
      tokenContractAddress = approvalLog.address
    }
  }

  if (!rawAmount) return []

  // Look for token metadata in valueTransfers (backend may include Approval events)
  const tokenMetadata = transaction.valueTransfers?.find(
    (vt) => vt.contractAddress?.toLowerCase() === tokenContractAddress?.toLowerCase(),
  )

  return [
    {
      from: transaction.fromAddress ?? '',
      to: extractSpender(transaction) ?? '',
      tokenId: '',
      contractAddress: tokenContractAddress ?? '',
      transferType: 'erc20',
      amount: tokenMetadata?.amount ?? rawAmount,
      decimal: tokenMetadata?.decimal,
      symbol: tokenMetadata?.symbol,
    } as ValueTransfer,
  ]
}

export const determineTransactionMetadataV6 = (
  input: DetermineTransactionMetadataInputV6,
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
  const { sentAssets, receivedAssets } = splitSentAndReceived(transaction, input.subjectAddress)
  /**
   * use the logs to determine the transaction topics.
   * add log topics length for better matching (used for differentiation between erc721 & erc20 token transfers)
   * tack the rest of the topics onto the transaction topics array for the purpose of adding more-discrete matching like
   * "METAMASK_CARD_APPROVE" instead of "ERC_20_APPROVE"
   */
  transaction.topics = transaction.logs
    ?.map((log) => (log?.topics.length > 0 ? [...log.topics, `${log?.topics[0]}#${log?.topics?.length}`] : []))
    .flat()
  // Inject a synthetic from-address topic so fromAddress can be matched against the topic hash map
  if (transaction.fromAddress) {
    const paddedFrom = `0x000000000000000000000000${transaction.fromAddress.slice(2).toLowerCase()}`
    transaction.topics = [...(transaction.topics ?? []), `from:${paddedFrom}`]
  }
  const txMetadata: TxMetadataV6 = {}
  const txMetadataPriorities: TxMetadataPriority = {
    transactionProtocol: -100,
    transactionCategory: -100,
    toAddressName: -100,
  }

  const toAddressContractMeta = transaction.toAddress ? contractAddressMap[transaction.toAddress] : undefined
  if (toAddressContractMeta) {
    if (log) console.log('writing toAddressName', toAddressContractMeta?.name)
    txMetadata.toAddressName = toAddressContractMeta?.name
    txMetadataPriorities.toAddressName = 0

    tryUpdateTransactionProtocol(txMetadata, txMetadataPriorities, log, toAddressContractMeta?.protocol, 0)

    const methodIdMeta = transaction.methodId && methodIdMap[transaction.methodId]

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

    // Two-pass topic scan:
    // Pass 1: evaluate topics without requiresAction, track all matched actions
    // Pass 2: evaluate topics with requiresAction — matches if the required action was seen in pass 1
    const deferredTopics: Array<{ topic: string; name: Action; protocol?: string; priority?: number }> = []
    const matchedActions = new Set<Action>()

    for (const topic of transaction.topics ?? []) {
      const topicMeta = topicHashMap[topic]
      if (!topicMeta) {
        if (log) console.log('skipping topic', topic, 'due to no labeled topicName or protocol')
        continue
      }
      const { name: topicName, protocol, priority, requiresAction } = topicMeta
      if (!topicName && !protocol) {
        if (log) console.log('skipping topic', topic, 'due to no labeled topicName or protocol')
        continue
      }
      if (requiresAction) {
        deferredTopics.push({ topic, name: topicName, protocol, priority })
        continue
      }
      if (log) console.log('not skipping topic. checking', topic, ' using category', topicName, 'protocol', protocol)

      if (topicName) {
        matchedActions.add(topicName)
        tryUpdateTransactionProtocol(txMetadata, txMetadataPriorities, log, protocol, priority)
        tryUpdateTransactionCategory(txMetadata, txMetadataPriorities, log, topicName, priority)
      }
    }

    // Pass 2: evaluate deferred topics that require a specific action from pass 1
    for (const { topic, name: topicName, protocol, priority } of deferredTopics) {
      const { requiresAction } = topicHashMap[topic]
      if (!requiresAction) {
        if (log) console.log('skipping deferred topic', topic, 'due to missing requiresAction')
        continue
      }
      if (!matchedActions.has(requiresAction)) {
        if (log)
          console.log(
            'skipping deferred topic',
            topic,
            'requires action',
            requiresAction,
            'which was not matched in pass 1',
          )
        continue
      }
      if (log) console.log('deferred topic matched', topic, 'using category', topicName, 'protocol', protocol)

      if (topicName) {
        tryUpdateTransactionProtocol(txMetadata, txMetadataPriorities, log, protocol, priority)
        tryUpdateTransactionCategory(txMetadata, txMetadataPriorities, log, topicName, priority)
      }
    }
  }
  const { transactionProtocol, transactionCategory, toAddressName } = txMetadata

  if (toAddressName === 'WETH') {
    if (txMetadata.transactionCategory === Action.WITHDRAW) {
      txMetadata.transactionCategory = Action.UNWRAP
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

    // Use the refined action only for readable template selection, not for transactionType/transactionCategory
    const refinedAction = refineActionForMultiAssets(txMetadata.transactionCategory, sentAssets, receivedAssets)

    const transactionProtocolToUse = maybeOverwriteProtocol(transactionProtocol)
    const protocol = titlecase(transactionProtocolToUse)
    const templateKey = refinedAction
    const template = tV2(templateKey, {}, language ?? fallbackLngV2)
    const ctx: TemplateContext =
      txMetadata.transactionCategory === Action.APPROVE
        ? {
            sentAssets,
            receivedAssets,
            spender: extractSpender(transaction) ?? '',
            approvedAssets: extractApprovedAssets(transaction),
          }
        : {
            sentAssets,
            receivedAssets,
          }
    const localizedReadable = `${protocol}${definingTrait && ` ${titlecase(definingTrait)}`}: ${interpolateTemplate(template, ctx)}`

    txMetadata.readable = localizedReadable
  }
  // if we still don't have a transaction category, default to generic contract call
  // also - if the transaction priority is < 0 (i.e. - contains an erc20/erc721 event by log events, but not by methodId
  // categorize those as generic contract calls as well)
  if (
    !Object.keys(txMetadata).length ||
    txMetadataPriorities.transactionCategory < 0 ||
    txMetadataPriorities.transactionProtocol < 0
  ) {
    const txMetadata: TxMetadataV6 = {
      transactionType: 'GENERIC_CONTRACT_CALL',
      transactionCategory: Action.CONTRACT_CALL,
      readable: tV2(Action.CONTRACT_CALL),
    }

    if (!transaction.logs || !transaction.logs.length || !transaction.methodId) {
      txMetadata.transactionType = 'STANDARD'
      txMetadata.transactionCategory = Action.STANDARD
    }
    if (transaction.logs && transaction.logs.length > spamTransferThreshold) {
      txMetadata.transactionType = 'SPAM_TOKEN_TRANSFER'
      txMetadata.transactionCategory = Action.TRANSFER
      txMetadata.transactionProtocol = 'SPAM_TOKEN'
    }
    if (!txMetadata.transactionCategory) {
      txMetadata.transactionCategory = Action.CONTRACT_CALL
      return txMetadata
    }
    const fallbackTemplate = tV2(txMetadata.transactionCategory, {}, language ?? fallbackLngV2)
    txMetadata.readable = txMetadata.transactionProtocol
      ? `${titlecase(txMetadata.transactionProtocol)}: ${interpolateTemplate(fallbackTemplate, { sentAssets, receivedAssets })}`
      : interpolateTemplate(fallbackTemplate, { sentAssets, receivedAssets })

    return txMetadata
  }

  return txMetadata
}
