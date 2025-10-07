import { SchemaV2, TransactionSchema } from '../types'

import { evmCompatibleSchemas } from './evmCompatible'
import { zeroExExchangeProxySchema } from './toAddressSchemas'

export const celoSchemas: Array<TransactionSchema<SchemaV2>> = [...evmCompatibleSchemas, zeroExExchangeProxySchema]
