import { SchemaV2, TransactionSchema } from './types'
import {
  arbitrumSchemas,
  auroraSchemas,
  avalancheSchemas,
  baseSchemas,
  bscSchemas,
  celoSchemas,
  cronosSchemas,
  ethereumSchemas,
  fantomSchemas,
  lineaSchemas,
  moonbeamSchemas,
  moonriverSchemas,
  optimismSchemas,
  polygonSchemas,
} from './txSchemas'
import { ChainId } from './networks'

const chainIdToSchemaMap: { [id in ChainId]?: Array<TransactionSchema<SchemaV2>> } = {
  [ChainId.ARBITRUM]: arbitrumSchemas,
  [ChainId.AURORA]: auroraSchemas,
  [ChainId.AVALANCHE]: avalancheSchemas,
  [ChainId.BASE]: baseSchemas,
  [ChainId.BSC]: bscSchemas,
  [ChainId.CELO]: celoSchemas,
  [ChainId.CRONOS]: cronosSchemas,
  [ChainId.ETHEREUM]: ethereumSchemas,
  [ChainId.FANTOM]: fantomSchemas,
  [ChainId.LINEA]: lineaSchemas,
  [ChainId.MOONBEAM]: moonbeamSchemas,
  [ChainId.MOONRIVER]: moonriverSchemas,
  [ChainId.OPTIMISM]: optimismSchemas,
  [ChainId.POLYGON]: polygonSchemas,
}

export const getSchemaByChainId = (chainId: ChainId) => {
  return chainIdToSchemaMap[chainId]
}

export const titlecaseExceptions = {
  METAMASK: 'MetaMask',
  SUSHISWAP: 'SushiSwap',
  OPENSEA: 'OpenSea',
  ENS: 'ENS',
  ERC: 'ERC',
  WETH: 'WETH',
}
