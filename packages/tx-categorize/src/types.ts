import { ChainId } from '@codefi/metafi-common'

import { Action } from './enums'

export interface DeterminantMap {
  contracts: Array<{
    address?: string
    addresses?: string[]
    name: string
    protocol?: string
    version?: string
    definingTrait?: string
  }>
  methodIds: Array<{ id?: string; ids?: string[]; name: Action; protocol?: string; priority?: number }>
  topics: Array<{
    hash?: string
    hashes?: string[]
    name: Action
    protocol?: string
    topicsLength?: string
    priority?: number
  }>
}

export interface TxMetadata {
  transactionType?: string
  transactionCategory?: string
  transactionProtocol?: string
  toAddressName?: string
  readable?: string
}

export interface MethodIdMap {
  [methodId: string]: {
    name: Action
    protocol?: string
    priority?: number
  }
}

export interface TopicHashMap {
  [topicHash: string]: {
    name: Action
    protocol?: string
    priority?: number
  }
}

export interface ContractAddressMap {
  [contractAddress: string]: {
    name: string
    protocol: string
    definingTrait?: string
    version?: string
  }
}

export interface Schema {
  key: string
  type: string
  topics?: string[]
  addresses?: string[]
  methodId?: string[]
  and?: string[]
  allRequired?: boolean
  topicsLength?: number
}
export interface SchemaV2 {
  key: 'toAddress' | 'fromAddress' | 'topics' | 'logAddress' | 'methodId'
  type: 'methodId' | 'topics' | 'addresses'
  topics?: string[]
  addresses?: string[]
  methodId?: string[]
  and?: string[]
  allRequired?: boolean
  topicsLength?: number
}

export interface Meta {
  name: string
  priority: number
  type: string
  protocol: string
  excludeFromBuild?: boolean
}

export interface TransactionSchema<T = Schema> {
  schema?: T
  meta?: Meta
}

export interface Log {
  data: string
  topics: string[]
  address: string
  logIndex: number
}

enum TransferType {
  erc721 = 'erc721',
  erc20 = 'erc20',
}

interface ValueTransfer {
  from: string
  to: string
  tokenId: string
  contractAddress: string
  transferType: TransferType
}

export interface Transaction {
  logs?: Log[]
  toAddress?: string
  fromAddress?: string
  input?: string
  methodId?: string
  topics?: string[]
  hash?: string
  valueTransfers?: ValueTransfer[]
}

export interface DetermineTransactionMetadataInputV5 {
  transaction: Transaction
}

export interface DetermineTransactionMetadataInput {
  chainId: ChainId
  transaction: Transaction
  allowExcludedSchemas?: boolean
}

export interface BaseKeyInput {
  key: 'toAddress' | 'fromAddress' | 'topics' | 'logAddress' | 'methodId'
  transaction: Transaction
  referenceList: string[]
  allRequired: boolean
  topicsLength: number
}

export interface AppliedSchema {
  [metaName: string]: TransactionSchema<SchemaV2>
}
