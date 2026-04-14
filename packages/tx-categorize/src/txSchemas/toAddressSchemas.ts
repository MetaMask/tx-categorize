import { SchemaV2, TransactionSchema } from '../types'

export const zeroExExchangeProxySchema: TransactionSchema<SchemaV2> = {
  schema: {
    key: 'toAddress',
    type: 'addresses',
    addresses: ['0xdef1c0ded9bec7f1a1670819833240f027b25eff'],
  },
  meta: {
    name: 'TO_0X_EXCHANGE_PROXY',
    priority: 20,
    type: 'TO',
    protocol: '0X',
    excludeFromBuild: true,
  },
}

export const arbitrumInbox: TransactionSchema<SchemaV2> = {
  schema: {
    key: 'toAddress',
    type: 'addresses',
    addresses: ['0x4dbd4fc535ac27206064b68ffcf827b0a60bab3f'],
  },
  meta: {
    name: 'TO_ARBITRUM_INBOX',
    priority: 20,
    type: 'TO',
    protocol: 'ARBITRUM',
    excludeFromBuild: true,
  },
}

export const arbitrumOutbox: TransactionSchema<SchemaV2> = {
  schema: {
    key: 'toAddress',
    type: 'addresses',
    addresses: ['0x760723cd2e632826c38fef8cd438a4cc7e7e1a40'],
  },
  meta: {
    name: 'TO_ARBITRUM_OUTBOX',
    priority: 20,
    type: 'TO',
    protocol: 'ARBITRUM',
    excludeFromBuild: true,
  },
}

export const balancerDistributor: TransactionSchema<SchemaV2> = {
  schema: {
    key: 'toAddress',
    type: 'addresses',
    addresses: ['0x6d19b2bf3a36a61530909ae65445a906d98a2fa8'],
  },
  meta: {
    name: 'TO_BALANCER_DISTRIBUTOR',
    priority: 10,
    type: 'TO',
    protocol: 'BALANCER',
    excludeFromBuild: true,
  },
}

export const compoundComptroller: TransactionSchema<SchemaV2> = {
  schema: {
    key: 'toAddress',
    type: 'addresses',
    addresses: ['0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b'],
  },
  meta: {
    name: 'TO_COMPOUND_COMPTROLLER',
    priority: 10,
    type: 'TO',
    protocol: 'COMPOUND',
    excludeFromBuild: true,
  },
}

export const dappnodeDistributor: TransactionSchema<SchemaV2> = {
  schema: {
    key: 'toAddress',
    type: 'addresses',
    addresses: ['0x87d6180b65ad76a9443064dcd1596388fcc3ee2a'],
  },
  meta: {
    name: 'TO_DAPPNODE_DISTRIBUTOR',
    priority: 10,
    type: 'TO',
    protocol: 'DAPPNODE',
    excludeFromBuild: true,
  },
}

export const ensRegistrar: TransactionSchema<SchemaV2> = {
  schema: {
    key: 'toAddress',
    type: 'addresses',
    addresses: ['0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85'],
  },
  meta: {
    name: 'TO_ENS_REGISTRAR',
    priority: 20,
    type: 'TO',
    protocol: 'ENS',
    excludeFromBuild: true,
  },
}

export const ensTokenContract: TransactionSchema<SchemaV2> = {
  schema: {
    key: 'toAddress',
    type: 'addresses',
    addresses: ['0xc18360217d8f7ab5e7c516566761ea12ce7f9d72'],
  },
  meta: {
    name: 'TO_ENS_TOKEN_CONTRACT',
    priority: 10,
    type: 'TO',
    protocol: 'ENS',
    excludeFromBuild: true,
  },
}

export const foxDistributor: TransactionSchema<SchemaV2> = {
  schema: {
    key: 'toAddress',
    type: 'addresses',
    addresses: ['0xb90381dae1a72528660278100c5aa44e1108cef7'],
  },
  meta: {
    name: 'TO_FOX_DISTRIBUTOR',
    priority: 10,
    type: 'TO',
    protocol: 'SHAPESHIFT',
    excludeFromBuild: true,
  },
}

export const futureswapGovernance: TransactionSchema<SchemaV2> = {
  schema: {
    key: 'toAddress',
    type: 'addresses',
    addresses: ['0x0a7f8161605acc552fa38fdb8ee7d8177c9ac22a'],
  },
  meta: {
    name: 'TO_FUTURESWAP_GOVERNANCE',
    priority: 10,
    type: 'TO',
    protocol: 'FUTURESWAP',
    excludeFromBuild: true,
  },
}

export const gitcoinDistributor: TransactionSchema<SchemaV2> = {
  schema: {
    key: 'toAddress',
    type: 'addresses',
    addresses: ['0xde3e5a990bce7fc60a6f017e7c4a95fc4939299e'],
  },
  meta: {
    name: 'TO_GITCOIN_DISTRIBUTOR',
    priority: 10,
    type: 'TO',
    protocol: 'GITCOIN',
    excludeFromBuild: true,
  },
}

// same contract address across eth, optimism, bsc, polygon, arbitrum, and avalanche
export const metamaskBridgeV1: TransactionSchema<SchemaV2> = {
  schema: {
    key: 'toAddress',
    type: 'addresses',
    addresses: ['0x82e0b8cdd80af5930c4452c684e71c861148ec8a'],
  },
  meta: {
    name: 'TO_METAMASK_BRIDGE_V1',
    priority: 20,
    type: 'TO',
    protocol: 'METAMASK_BRIDGE',
    excludeFromBuild: true,
  },
}

const getMetamaskBridgeV2ByContractAddress = (address: string): TransactionSchema<SchemaV2> => {
  return {
    schema: {
      key: 'toAddress',
      type: 'addresses',
      addresses: [address.toLowerCase()],
    },
    meta: {
      name: 'TO_METAMASK_BRIDGE_V2',
      priority: 20,
      type: 'TO',
      protocol: 'METAMASK_BRIDGE',
      excludeFromBuild: true,
    },
  }
}

export const metamaskBridgeEthereumV2 = getMetamaskBridgeV2ByContractAddress(
  '0x0439e60f02a8900a951603950d8d4527f400c3f1',
)
export const metamaskBridgeOptimismV2 = getMetamaskBridgeV2ByContractAddress(
  '0xb90357f2b86dbfd59c3502215d4060f71df8ca0e',
)
export const metamaskBridgeBscV2 = getMetamaskBridgeV2ByContractAddress('0xaec23140408534b378bf5832defc426df8604b59')
export const metamaskBridgePolygonV2 = getMetamaskBridgeV2ByContractAddress(
  '0x3a0b42ce6166abb05d30ddf12e726c95a83d7a16',
)
export const metamaskBridgeZkSyncV2 = getMetamaskBridgeV2ByContractAddress('0x357b5935482ad8a4a2e181e0132abd1882e16520')
export const metamaskBridgeBaseV2 = getMetamaskBridgeV2ByContractAddress('0xa20ecbc821fb54064aa7b5c6ac81173b8b34df71')
export const metamaskBridgeArbitrumV2 = getMetamaskBridgeV2ByContractAddress(
  '0x23981fc34e69eedfe2bd9a0a9fcb0719fe09dbfc',
)
export const metamaskBridgeAvalancheV2 = getMetamaskBridgeV2ByContractAddress(
  '0x29106d08382d3c73bf477a94333c61db1142e1b6',
)
export const metamaskBridgeLineaV2 = getMetamaskBridgeV2ByContractAddress('0xe3d0d2607182af5b24f5c3c2e4990a053add64e3')

export const metamaskStakeV1: TransactionSchema<SchemaV2> = {
  schema: {
    key: 'toAddress',
    type: 'addresses',
    addresses: ['0xf256f3cbefc7abbce953635f5d700a98c4b45277'],
  },
  meta: {
    name: 'TO_METAMASK_STAKE_V1',
    priority: 20,
    type: 'TO',
    protocol: 'METAMASK_STAKE',
    excludeFromBuild: true,
  },
}

export const metamaskValidatorStake: TransactionSchema<SchemaV2> = {
  schema: {
    key: 'toAddress',
    type: 'addresses',
    addresses: ['0xdc71affc862fceb6ad32be58e098423a7727bebd'],
  },
  meta: {
    name: 'TO_METAMASK_VALIDATOR_STAKE',
    priority: 20,
    type: 'TO',
    protocol: 'METAMASK_STAKE',
    excludeFromBuild: true,
  },
}
export const metamaskPooledStake: TransactionSchema<SchemaV2> = {
  schema: {
    key: 'toAddress',
    type: 'addresses',
    addresses: ['0x4fef9d741011476750a243ac70b9789a63dd47df'],
  },
  meta: {
    name: 'TO_METAMASK_POOLED_STAKE',
    priority: 20,
    type: 'TO',
    protocol: 'METAMASK_STAKE',
    excludeFromBuild: true,
  },
}
export const metamaskThirdPartyStake: TransactionSchema<SchemaV2> = {
  schema: {
    key: 'toAddress',
    type: 'addresses',
    addresses: ['0x1f6692e78dde07ff8da75769b6d7c716215bc7d0'],
  },
  meta: {
    name: 'TO_METAMASK_THIRD_PARTY_STAKE',
    priority: 20,
    type: 'TO',
    protocol: 'METAMASK_STAKE',
    excludeFromBuild: true,
  },
}

const getMetamaskSwapRouterByContractAddress = (
  address: string,
  version: 'V1' | 'V2' = 'V1',
): TransactionSchema<SchemaV2> => {
  return {
    schema: {
      key: 'toAddress',
      type: 'addresses',
      addresses: [address.toLowerCase()],
    },
    meta: {
      name: `TO_METAMASK_${version}_ROUTER`,
      priority: 10,
      type: 'TO',
      protocol: 'METAMASK_V1', // 'METAMASK_SWAP' more appropriate?
      excludeFromBuild: true,
    },
  }
}

// MetaSwap V1
export const metamaskSwapEthereumV1Router = getMetamaskSwapRouterByContractAddress(
  '0x881d40237659c251811cec9c364ef91dc08d300c',
)
export const metamaskSwapBscV1Router = getMetamaskSwapRouterByContractAddress(
  '0x1a1ec25dc08e98e5e93f1104b5e5cdd298707d31',
)
export const metamaskSwapOptimismV1Router = getMetamaskSwapRouterByContractAddress(
  '0x9dda6ef3d919c9bc8885d5560999a3640431e8e6',
)
export const metamaskSwapBaseV1Router = getMetamaskSwapRouterByContractAddress(
  '0x9dda6ef3d919c9bc8885d5560999a3640431e8e6',
)
export const metamaskSwapArbitrumV1Router = getMetamaskSwapRouterByContractAddress(
  '0x9dda6ef3d919c9bc8885d5560999a3640431e8e6',
)
export const metamaskSwapAvalancheV1Router = getMetamaskSwapRouterByContractAddress(
  '0x1a1ec25dc08e98e5e93f1104b5e5cdd298707d31',
)
export const metamaskSwapLineaV1Router = getMetamaskSwapRouterByContractAddress(
  '0x9dda6ef3d919c9bc8885d5560999a3640431e8e6',
)
export const metamaskSwapPolygonV1Router = getMetamaskSwapRouterByContractAddress(
  '0x1a1ec25dc08e98e5e93f1104b5e5cdd298707d31',
)
export const metamaskSwapZkSyncV1Router = getMetamaskSwapRouterByContractAddress(
  '0xf504c1fe13d14DF615E66dcd0ABF39e60c697f34',
)

// MetaSwap V2
export const metamaskSwapEthereumV2Router = getMetamaskSwapRouterByContractAddress(
  '0x0fced0519f62abb5a22f95dca0e194af7b84c598',
  'V2',
)
export const metamaskSwapBscV2Router = getMetamaskSwapRouterByContractAddress(
  '0x3cb693656622fc470f0bb07d3f5813f7889bf82e',
  'V2',
)
export const metamaskSwapOptimismV2Router = getMetamaskSwapRouterByContractAddress(
  '0xacf90aa95687e25f636e3911cb797bd3498f6155',
  'V2',
)
export const metamaskSwapBaseV2Router = getMetamaskSwapRouterByContractAddress(
  '0x411b9b5a876095acebaa1811bd016cb1b3e2a679',
  'V2',
)
export const metamaskSwapArbitrumV2Router = getMetamaskSwapRouterByContractAddress(
  '0xcfec161540f82c0c48a0851af9fce0d94eecac67',
  'V2',
)
export const metamaskSwapAvalancheV2Router = getMetamaskSwapRouterByContractAddress(
  '0x8a7ff5109d0ddc886e61b51ef8f6f0864c92b32c',
  'V2',
)

// NOT DEPLOYED YET
// export const metamaskSwapLineaV2Router = getMetamaskSwapRouterByContractAddress(
//   '',
//   'V2',
// )
// export const metamaskSwapPolygonV2Router = getMetamaskSwapRouterByContractAddress(
//   '',
//   'V2',
// )
// export const metamaskSwapZkSyncV2Router = getMetamaskSwapRouterByContractAddress(
//   '',
//   'V2',
// )

export const openseaRegistry: TransactionSchema<SchemaV2> = {
  schema: {
    key: 'toAddress',
    type: 'addresses',
    addresses: ['0xa5409ec958c83c3f309868babaca7c86dcb077c1'],
  },
  meta: {
    name: 'TO_OPENSEA_REGISTRY',
    priority: 10,
    type: 'TO',
    protocol: 'OPENSEA',
    excludeFromBuild: true,
  },
}

export const openseaRouter: TransactionSchema<SchemaV2> = {
  schema: {
    key: 'toAddress',
    type: 'addresses',
    addresses: ['0x7be8076f4ea4a4ad08075c2508e481d6c946d12b'],
  },
  meta: {
    name: 'TO_OPENSEA_ROUTER',
    priority: 10,
    type: 'TO',
    protocol: 'OPENSEA',
    excludeFromBuild: true,
  },
}

export const paraswapV4ExchangeProxy: TransactionSchema<SchemaV2> = {
  schema: {
    key: 'toAddress',
    type: 'addresses',
    addresses: ['0x1bd435f3c054b6e901b7b108a0ab7617c808677b'],
  },
  meta: {
    name: 'TO_PARASWAP_V4_EXCHANGE_PROXY',
    priority: 20,
    type: 'TO',
    protocol: 'PARASWAP_V4',
    excludeFromBuild: true,
  },
}

export const polygonBridge: TransactionSchema<SchemaV2> = {
  schema: {
    key: 'toAddress',
    type: 'addresses',
    addresses: ['0xa0c68c638235ee32657e8f720a23cec1bfc77c77'],
  },
  meta: {
    name: 'TO_POLYGON_BRIDGE',
    priority: 20,
    type: 'TO',
    protocol: 'POLYGON',
    excludeFromBuild: true,
  },
}

export const poolTogetherDistributor: TransactionSchema<SchemaV2> = {
  schema: {
    key: 'toAddress',
    type: 'addresses',
    addresses: ['0x9a29401ef1856b669f55ae5b24505b3b6faeb370'],
  },
  meta: {
    name: 'TO_POOLTOGETHER_DISTRIBUTOR',
    priority: 10,
    type: 'TO',
    protocol: 'POOLTOGETHER',
    excludeFromBuild: true,
  },
}

export const sushiSwapRouter: TransactionSchema<SchemaV2> = {
  schema: {
    key: 'toAddress',
    type: 'addresses',
    addresses: ['0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f'],
  },
  meta: {
    name: 'TO_SUSHISWAP_ROUTER',
    priority: 10,
    type: 'TO',
    protocol: 'SUSHISWAP',
    excludeFromBuild: true,
  },
}

export const uniswapDistributor: TransactionSchema<SchemaV2> = {
  schema: {
    key: 'toAddress',
    type: 'addresses',
    addresses: ['0x090d4613473dee047c3f2706764f49e0821d256e'],
  },
  meta: {
    name: 'TO_UNISWAP_DISTRIBUTOR',
    priority: 10,
    type: 'TO',
    protocol: 'UNISWAP_V2',
    excludeFromBuild: true,
  },
}

export const uniswapV2Router: TransactionSchema<SchemaV2> = {
  schema: {
    key: 'toAddress',
    type: 'addresses',
    addresses: ['0x7a250d5630b4cf539739df2c5dacb4c659f2488d'],
  },
  meta: {
    name: 'TO_UNISWAP_V2_ROUTER',
    priority: 10,
    type: 'TO',
    protocol: 'UNISWAP_V2',
    excludeFromBuild: true,
  },
}

export const uniswapV3Router: TransactionSchema<SchemaV2> = {
  schema: {
    key: 'toAddress',
    type: 'addresses',
    addresses: ['0xe592427a0aece92de3edee1f18e0157c05861564', '0xc36442b4a4522e871399cd717abdd847ab11fe88'],
  },
  meta: {
    name: 'TO_UNISWAP_V3_ROUTER',
    priority: 10,
    type: 'TO',
    protocol: 'UNISWAP_V3',
    excludeFromBuild: true,
  },
}

export const oneInchV3ExchangeProxy: TransactionSchema<SchemaV2> = {
  schema: {
    key: 'toAddress',
    type: 'addresses',
    addresses: ['0x11111112542d85b3ef69ae05771c2dccff4faa26'],
  },
  meta: {
    name: 'TO_1INCH_V3_EXCHANGE_PROXY',
    priority: 20,
    type: 'TO',
    protocol: '1INCH',
    excludeFromBuild: true,
  },
}

export const aaveLendingPoolV1: TransactionSchema<SchemaV2> = {
  schema: {
    key: 'toAddress',
    type: 'addresses',
    addresses: ['0x398ec7346dcd622edc5ae82352f02be94c62d119'],
  },
  meta: {
    name: 'TO_AAVE_LENDING_POOL_V1',
    priority: 10,
    type: 'TO',
    protocol: 'AAVE_V1',
    excludeFromBuild: true,
  },
}

export const compoundCToken: TransactionSchema<SchemaV2> = {
  schema: {
    key: 'toAddress',
    type: 'addresses',
    addresses: ['0x5d3a536e4d6dbd6114cc1ead35777bab948e3643'],
  },
  meta: {
    name: 'TO_COMPOUND_C_TOKEN',
    priority: 10,
    type: 'TO',
    protocol: 'COMPOUND_V2',
    excludeFromBuild: true,
  },
}

export const idexStaking: TransactionSchema<SchemaV2> = {
  schema: {
    key: 'toAddress',
    type: 'addresses',
    addresses: ['0x2a0c0dbecc7e4d658f48e01e3fa353f44050c208'],
  },
  meta: {
    name: 'TO_IDEX_STAKING',
    priority: 10,
    type: 'TO',
    protocol: 'IDEX',
    excludeFromBuild: true,
  },
}
