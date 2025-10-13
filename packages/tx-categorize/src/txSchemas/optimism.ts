import { SchemaV2, TransactionSchema } from '../types'

import { evmCompatibleSchemas } from './evmCompatible'
import {
  metamaskBridgeOptimismV2,
  metamaskBridgeV1,
  metamaskSwapOptimismV1Router,
  metamaskSwapOptimismV2Router,
  oneInchV3ExchangeProxy,
  uniswapV2Router,
  uniswapV3Router,
} from './toAddressSchemas'

export const optimismSchemas: Array<TransactionSchema<SchemaV2>> = [
  ...evmCompatibleSchemas,
  oneInchV3ExchangeProxy,
  metamaskBridgeV1,
  uniswapV2Router,
  uniswapV3Router,
  metamaskBridgeOptimismV2,
  metamaskSwapOptimismV1Router,
  metamaskSwapOptimismV2Router,
]
