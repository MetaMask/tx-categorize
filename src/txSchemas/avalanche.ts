import { SchemaV2, TransactionSchema } from '../types'

import { evmCompatibleSchemas } from './evmCompatible'
import {
  metamaskBridgeAvalancheV2,
  metamaskBridgeV1,
  metamaskSwapAvalancheV1Router,
  metamaskSwapAvalancheV2Router,
  uniswapV2Router,
  zeroExExchangeProxySchema,
} from './toAddressSchemas'

export const avalancheSchemas: Array<TransactionSchema<SchemaV2>> = [
  ...evmCompatibleSchemas,
  zeroExExchangeProxySchema,
  metamaskBridgeV1,
  uniswapV2Router,
  metamaskBridgeAvalancheV2,
  metamaskSwapAvalancheV1Router,
  metamaskSwapAvalancheV2Router,
]
