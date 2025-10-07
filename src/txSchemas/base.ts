import { evmCompatibleSchemas } from './evmCompatible'
import { metamaskBridgeBaseV2, metamaskSwapBaseV1Router, metamaskSwapBaseV2Router } from './toAddressSchemas'

export const baseSchemas = [
  ...evmCompatibleSchemas,
  metamaskBridgeBaseV2,
  metamaskSwapBaseV1Router,
  metamaskSwapBaseV2Router,
]
