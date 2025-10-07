import { getSchemaByChainId } from './constants'
import { AppliedSchema, BaseKeyInput, DetermineTransactionMetadataInput, SchemaV2, TransactionSchema } from './types'

const sortSchemasExcludedFromBuild = (a: TransactionSchema<SchemaV2>, b: TransactionSchema<SchemaV2>) => {
  if (a.meta?.excludeFromBuild === b.meta?.excludeFromBuild) {
    return 0
  }

  return a.meta?.excludeFromBuild ? -1 : 1
}

const interpretAppliedSchemas = (appliedSchemas: AppliedSchema, allowExcludedSchemas: boolean) => {
  let transactionType = ''
  let transactionCategory = ''
  let transactionProtocol
  let toAddressName
  let fromAddressName
  let priority = 0

  if (appliedSchemas['STANDARD']) {
    return { transactionType: 'STANDARD', transactionCategory: 'STANDARD' }
  } else if (appliedSchemas['GENERIC_CONTRACT_CALL']) {
    return { transactionType: 'GENERIC_CONTRACT_CALL', transactionCategory: 'CONTRACT_CALL' }
  }

  Object.values(appliedSchemas).forEach(({ meta, schema }) => {
    if (schema.key === 'toAddress') {
      toAddressName = meta.name?.replace('TO_', '')
    }

    if (schema.key === 'fromAddress') {
      fromAddressName = meta.name
    }

    if (!allowExcludedSchemas && meta.excludeFromBuild) {
      return
    }

    if (meta.priority > priority) {
      transactionType = meta.name
      transactionCategory = meta?.type
      transactionProtocol = meta?.protocol
      priority = meta.priority
    }
  })

  if (transactionType === '') {
    return { transactionType: 'GENERIC_CONTRACT_CALL', transactionCategory: 'CONTRACT_CALL' }
  }

  return {
    transactionType,
    transactionCategory,
    transactionProtocol,
    toAddressName,
    fromAddressName,
  }
}

const handleLogTopics = ({
  transaction,
  topicsLength = 0,
  allRequired = false,
  referenceList: topics,
}: Partial<BaseKeyInput>) => {
  if (!transaction?.logs?.length) {
    return false
  }

  for (const log of transaction.logs) {
    let isTopicsLengthSatisfied = topicsLength === 0
    const present = []

    for (const topic of log.topics) {
      let isAllSatisfied = !allRequired
      let isContainsSatisifed = false

      if (topics.includes(topic)) {
        isContainsSatisifed = true

        if (allRequired) {
          present.push(topic)
        }

        // if topicsLength doesn't exist, or it's a valid topicsLength, return true
        if (topicsLength === 0 || topicsLength === log.topics.length) {
          isTopicsLengthSatisfied = true
        }
      }

      if (!isAllSatisfied) {
        isAllSatisfied = present.length === topics.length
      }

      if (isAllSatisfied && isTopicsLengthSatisfied && isContainsSatisifed) {
        return true
      }
    }
  }

  return false
}

const handleLogAddress = ({ transaction, referenceList: logAddresses }: Partial<BaseKeyInput>) => {
  if (!transaction?.logs?.length) {
    return false
  }

  for (const { address } of transaction.logs) {
    if (logAddresses.includes(address)) {
      return true
    }
  }

  return false
}

const handleMethodId = ({ transaction, referenceList: methodIds }: Partial<BaseKeyInput>) => {
  for (const methodId of methodIds) {
    if (transaction?.input?.includes(methodId) || transaction?.methodId?.includes(methodId)) {
      return true
    }
  }

  return false
}

const handleBaseKeys = (key, transaction, referenceList, allRequired, topicsLength) => {
  switch (key) {
    case 'toAddress': {
      return referenceList.includes(transaction.toAddress?.toLowerCase())
    }
    case 'fromAddress': {
      return referenceList.includes(transaction.fromAddress?.toLowerCase())
    }
    case 'topics': {
      return handleLogTopics({ transaction, referenceList, allRequired, topicsLength })
    }
    case 'logAddress': {
      return handleLogAddress({ transaction, referenceList })
    }
    case 'methodId': {
      return handleMethodId({ transaction, referenceList })
    }
    default: {
      return false
    }
  }
}

const otherRequirementsPresent = (appliedSchemas, requiredList) => {
  for (const r of requiredList) {
    if (!appliedSchemas[r]) {
      return false
    }
  }

  return true
}

export const determineTransactionMetadataV2 = ({
  chainId,
  transaction,
  allowExcludedSchemas = false,
}: DetermineTransactionMetadataInput) => {
  if (!transaction.toAddress) {
    transaction.toAddress = transaction['to']
    transaction.fromAddress = transaction['from']
  }

  if (transaction.logs.length > 0) {
    transaction.topics = transaction.logs.map((log) => log?.topics).flat()
  }

  try {
    const appliedSchemas = {}
    const txSchemas = getSchemaByChainId(chainId)

    txSchemas.sort(sortSchemasExcludedFromBuild).forEach((transactionType) => {
      const schema = transactionType.schema
      const meta = transactionType.meta
      const schemaType = schema.type
      const referenceList = schema[schemaType]

      const schemaKey = schema.key

      const doesBaseKeyExist = handleBaseKeys(
        schemaKey,
        transaction,
        referenceList,
        schema?.allRequired,
        schema?.topicsLength,
      )

      if (doesBaseKeyExist) {
        if (schema?.and?.length > 0) {
          if (otherRequirementsPresent(appliedSchemas, schema.and)) {
            appliedSchemas[meta.name] = transactionType
          }
        } else {
          appliedSchemas[meta.name] = transactionType
        }
      }
    })

    if (Object.keys(appliedSchemas).length === 0 && transaction.input === '0x') {
      appliedSchemas['STANDARD'] = {}
    }

    const txMetadataDerived = interpretAppliedSchemas(appliedSchemas, allowExcludedSchemas)

    return txMetadataDerived
  } catch (e) {
    console.error(e)

    return ''
  }
}
