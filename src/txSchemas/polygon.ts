import { SchemaV2, TransactionSchema } from '../types'

import { evmCompatibleSchemas } from './evmCompatible'
import {
  metamaskBridgePolygonV2,
  metamaskBridgeV1,
  metamaskSwapPolygonV1Router,
  oneInchV3ExchangeProxy,
  polygonBridge,
  uniswapV2Router,
  uniswapV3Router,
  zeroExExchangeProxySchema,
} from './toAddressSchemas'

export const polygonSchemas: Array<TransactionSchema<SchemaV2>> = [
  ...evmCompatibleSchemas,
  // toAddress schemas that are deployed on this network
  zeroExExchangeProxySchema,
  oneInchV3ExchangeProxy,
  metamaskBridgeV1,
  metamaskSwapPolygonV1Router,
  polygonBridge,
  uniswapV2Router,
  uniswapV3Router,
  metamaskBridgePolygonV2,
]
