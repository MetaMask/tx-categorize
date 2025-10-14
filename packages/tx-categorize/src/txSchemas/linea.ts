import { SchemaV2, TransactionSchema } from '../types'

import { metamaskBridgeLineaV2, metamaskSwapLineaV1Router } from './toAddressSchemas'

import { evmCompatibleSchemas } from './index'

export const lineaSchemas: Array<TransactionSchema<SchemaV2>> = [
  ...evmCompatibleSchemas,
  metamaskBridgeLineaV2,
  metamaskSwapLineaV1Router,
]
