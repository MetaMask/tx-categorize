import { CaipAccountId } from '@metamask/utils'

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
    requiresAction?: Action
  }>
}

export interface TxMetadataV6 {
  transactionType?: string
  transactionCategory?: Action
  transactionProtocol?: string
  toAddressName?: string
  readable?: string
  readableExtended?: string
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
    requiresAction?: Action
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

export interface ValueTransfer {
  from: string
  to: string
  tokenId: string
  contractAddress: string
  transferType: TransferType
  amount?: string
  decimal?: number
  name?: string
  symbol?: string
}

export interface Transaction {
  logs?: Log[]
  toAddress?: string
  fromAddress?: string
  input?: string
  methodId?: string
  topics?: string[]
  hash?: string
  value?: string
  valueTransfers?: ValueTransfer[]
}

export interface DetermineTransactionMetadataInputV6 {
  transaction: Transaction
  subjectAddress: CaipAccountId
}
