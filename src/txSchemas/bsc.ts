import { SchemaV2, TransactionSchema } from '../types'

import { evmCompatibleSchemas } from './evmCompatible'
import {
  metamaskBridgeBscV2,
  metamaskBridgeV1,
  metamaskSwapBscV1Router,
  metamaskSwapBscV2Router,
  oneInchV3ExchangeProxy,
  uniswapV2Router,
  zeroExExchangeProxySchema,
} from './toAddressSchemas'

export const bscSchemas: Array<TransactionSchema<SchemaV2>> = [
  ...evmCompatibleSchemas,
  zeroExExchangeProxySchema,
  oneInchV3ExchangeProxy,
  metamaskBridgeV1,
  uniswapV2Router,
  metamaskBridgeBscV2,
  metamaskSwapBscV1Router,
  metamaskSwapBscV2Router,
]
