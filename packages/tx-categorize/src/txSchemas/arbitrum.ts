import { SchemaV2, TransactionSchema } from '../types'

import { evmCompatibleSchemas } from './evmCompatible'
import {
  metamaskBridgeArbitrumV2,
  metamaskBridgeV1,
  metamaskSwapArbitrumV1Router,
  metamaskSwapArbitrumV2Router,
  oneInchV3ExchangeProxy,
  uniswapV2Router,
  uniswapV3Router,
  zeroExExchangeProxySchema,
} from './toAddressSchemas'

export const arbitrumSchemas: Array<TransactionSchema<SchemaV2>> = [
  ...evmCompatibleSchemas,
  // toAddress schemas that are deployed on this network
  zeroExExchangeProxySchema,
  oneInchV3ExchangeProxy,
  metamaskBridgeV1,
  uniswapV2Router,
  uniswapV3Router,
  metamaskBridgeArbitrumV2,
  metamaskSwapArbitrumV1Router,
  metamaskSwapArbitrumV2Router,
]
