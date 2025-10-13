import { BloomFilter } from 'bloom-filters'

import { getSchemaByChainId } from './constants'
import { Transaction } from './types'
import { ChainId } from './networks'

const chainIds = Object.values(ChainId).map(Number)

const bloomByNetwork = chainIds.reduce((bloomByNetworkAcc, chainId) => {
  const schemas = getSchemaByChainId(chainId as ChainId)

  if (!schemas?.length) {
    bloomByNetworkAcc[chainId] = undefined

    return bloomByNetworkAcc
  }

  const bloom = BloomFilter.create(schemas.length, 0.01)

  schemas.forEach(({ schema }) => {
    const keys = Object.keys(schema)

    keys.forEach((key) => {
      if (Array.isArray(schema[key])) {
        schema[key].forEach((value) => {
          bloom.add(`${key}#${value}`)
        })
      } else {
        bloom.add(`${key}#${schema[key]}`)
      }
    })
  })

  bloomByNetworkAcc[chainId] = bloom

  return bloomByNetworkAcc
}, {} as Record<ChainId, BloomFilter>)

export const doesTxMatchSchema = (chainId: ChainId, transaction: Transaction) => {
  const keysToCheck = ['toAddress', 'fromAddress', 'topics', 'logAddress', 'methodId']
  let matchCouldExist = false

  const bloom = bloomByNetwork[chainId]

  keysToCheck.forEach((key) => {
    const txKeys = transaction[key]

    if (txKeys) {
      if (Array.isArray(txKeys)) {
        txKeys.forEach((value) => {
          if (bloom.has(`${key}#${value}`)) {
            matchCouldExist = true
          }
        })
      } else {
        if (bloom.has(`${key}#${txKeys}`)) {
          matchCouldExist = true
        }
      }
    }
  })

  return matchCouldExist
}
