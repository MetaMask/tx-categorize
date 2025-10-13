import { SchemaV2, TransactionSchema } from '../types'

import { evmCompatibleSchemas } from './evmCompatible'
import {
  arbitrumInbox,
  arbitrumOutbox,
  balancerDistributor,
  compoundCToken,
  compoundComptroller,
  dappnodeDistributor,
  ensRegistrar,
  ensTokenContract,
  foxDistributor,
  futureswapGovernance,
  gitcoinDistributor,
  idexStaking,
  metamaskBridgeEthereumV2,
  metamaskBridgeV1,
  metamaskPooledStake,
  metamaskStakeV1,
  metamaskSwapEthereumV1Router,
  metamaskSwapEthereumV2Router,
  metamaskThirdPartyStake,
  metamaskValidatorStake,
  oneInchV3ExchangeProxy,
  openseaRegistry,
  openseaRouter,
  paraswapV4ExchangeProxy,
  polygonBridge,
  poolTogetherDistributor,
  sushiSwapRouter,
  uniswapDistributor,
  uniswapV2Router,
  uniswapV3Router,
  zeroExExchangeProxySchema,
} from './toAddressSchemas'

export const ethereumSchemas: Array<TransactionSchema<SchemaV2>> = [
  ...evmCompatibleSchemas,
  // toAddress schemas that are deployed on this network
  idexStaking,
  compoundCToken,
  zeroExExchangeProxySchema,
  oneInchV3ExchangeProxy,
  arbitrumInbox,
  arbitrumOutbox,
  balancerDistributor,
  compoundComptroller,
  dappnodeDistributor,
  ensRegistrar,
  ensTokenContract,
  foxDistributor,
  futureswapGovernance,
  gitcoinDistributor,
  metamaskBridgeV1,
  metamaskStakeV1,
  metamaskValidatorStake,
  metamaskPooledStake,
  metamaskThirdPartyStake,
  metamaskSwapEthereumV1Router,
  openseaRegistry,
  openseaRouter,
  paraswapV4ExchangeProxy,
  polygonBridge,
  poolTogetherDistributor,
  sushiSwapRouter,
  uniswapDistributor,
  uniswapV2Router,
  uniswapV3Router,
  metamaskBridgeEthereumV2,
  metamaskSwapEthereumV2Router,
  // network specific schemas
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0x47cee97cb7acd717b3c0aa1435d004cd5b3c8c57d70dbceb4e4458bbd60e39d4'],
      and: ['TO_ENS_TOKEN_CONTRACT'],
    },
    meta: {
      name: 'ENS_CLAIM',
      priority: 30,
      type: 'CLAIM',
      protocol: 'ENS',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0xb3d987963d01b2f68493b4bdb130988f157ea43070d4ad840fee0466ed9370d9'],
    },
    meta: {
      name: 'ENS_DOMAIN_REGISTER',
      priority: 40,
      type: 'DOMAIN_REGISTER',
      protocol: 'ENS',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0x9b87a00e30f1ac65d898f070f8a3488fe60517182d0a2098e1b4b93a54aa9bd6'],
    },
    meta: {
      name: 'ENS_DOMAIN_RENEW',
      priority: 40,
      type: 'DOMAIN_RENEW',
      protocol: 'ENS',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0x335721b01866dc23fbee8b6b2c7b1e14d6f05c28cd35a2c934239f94095602a0'],
    },
    meta: {
      name: 'ENS_DOMAIN_RESOLVER_SET',
      priority: 30,
      type: 'DOMAIN_RESOLVER_SET',
      protocol: 'ENS',
    },
  },
  {
    schema: {
      key: 'methodId',
      type: 'methodId',
      methodId: ['0x8a99b4f2'],
      and: ['TO_METAMASK_THIRD_PARTY_STAKE'],
    },
    meta: {
      name: 'METAMASK_THIRD_PARTY_STAKE_V1',
      priority: 40,
      type: 'STAKE',
      protocol: 'METAMASK_STAKE',
    },
  },
  {
    schema: {
      key: 'methodId',
      type: 'methodId',
      methodId: ['0xf9609f08'],
      and: ['TO_METAMASK_POOLED_STAKE'],
    },
    meta: {
      name: 'METAMASK_POOLED_STAKE_V1',
      priority: 40,
      type: 'STAKE',
      protocol: 'METAMASK_STAKE',
    },
  },
  {
    schema: {
      key: 'methodId',
      type: 'methodId',
      methodId: ['0xd0e30db0'],
      and: ['TO_METAMASK_VALIDATOR_STAKE'],
    },
    meta: {
      name: 'METAMASK_VALIDATOR_STAKE_V1',
      priority: 40,
      type: 'STAKE',
      protocol: 'METAMASK_STAKE',
    },
  },
  {
    schema: {
      key: 'methodId',
      type: 'methodId',
      methodId: ['0x3ce33bff'],
      and: ['TO_METAMASK_BRIDGE_V2'],
    },
    meta: {
      name: 'METAMASK_V2_BRIDGE_OUT',
      priority: 40,
      type: 'BRIDGE_OUT',
      protocol: 'METAMASK_BRIDGE',
    },
  },
  {
    schema: {
      key: 'methodId',
      type: 'methodId',
      methodId: ['0x23b872dd'],
      and: ['TO_ENS_REGISTRAR'],
    },
    meta: {
      name: 'ENS_DOMAIN_TRANSFER',
      priority: 40,
      type: 'DOMAIN_TRANSFER',
      protocol: 'ENS',
    },
  },
  {
    schema: {
      key: 'fromAddress',
      type: 'addresses',
      addresses: ['0x3ecef08d0e2dad803847e052249bb4f8bff2d5bb'],
    },
    meta: {
      name: 'MININGPOOLHUB_MINING_PAYOUT',
      priority: 50,
      type: 'MINING_PAYOUT',
      protocol: 'MININGPOOLHUB',
    },
  },
  {
    schema: {
      key: 'fromAddress',
      type: 'addresses',
      addresses: ['0xea674fdde714fd979de3edf0f56aa9716b898ec8'],
    },
    meta: {
      name: 'ETHERMINE_MINING_PAYOUT',
      priority: 50,
      type: 'MINING_PAYOUT',
      protocol: 'ETHERMINE',
    },
  },
  // sparkpool shut down - but leaving it for potential catorization of historical transactions
  {
    schema: {
      key: 'fromAddress',
      type: 'addresses',
      addresses: ['0x8fd00f170fdf3772c5ebdcd90bf257316c69ba45'],
    },
    meta: {
      name: 'SPARKPOOL_MINING_PAYOUT',
      priority: 50,
      type: 'MINING_PAYOUT',
      protocol: 'SPARKPOOL',
    },
  },
]
