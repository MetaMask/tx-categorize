import { SchemaV2, TransactionSchema } from '../types'

import { evmCompatibleSchemas } from './evmCompatible'

export const auroraSchemas: Array<TransactionSchema<SchemaV2>> = [...evmCompatibleSchemas]
