import { SchemaV2, TransactionSchema } from '../types'

export const evmCompatibleSchemas: Array<TransactionSchema<SchemaV2>> = [
  {
    schema: {
      key: 'methodId',
      type: 'methodId',
      methodId: ['0x0f4d14e9'],
      and: ['TO_ARBITRUM_INBOX'],
    },
    meta: {
      name: 'ARBITRUM_BRIDGE_IN',
      priority: 30,
      type: 'BRIDGE_IN',
      protocol: 'ARBITRUM',
    },
  },
  {
    schema: {
      key: 'methodId',
      type: 'methodId',
      methodId: ['0x9c5cfe0b'],
      and: ['TO_ARBITRUM_OUTBOX'],
    },
    meta: {
      name: 'ARBITRUM_BRIDGE_OUT',
      priority: 30,
      type: 'BRIDGE_OUT',
      protocol: 'ARBITRUM',
    },
  },
  {
    schema: {
      key: 'methodId',
      type: 'methodId',
      methodId: ['0x338b5dea'],
      and: ['TO_IDEX_STAKING'],
    },
    meta: {
      name: 'IDEX_DEPOSIT_TOKEN',
      priority: 30,
      type: 'DEPOSIT_TOKEN',
      protocol: 'IDEX',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0xf4f04db19b64306e1859ee9cd0e9d491d4ddd5714be9c3afdbe8f1c508d5dab2'],
      and: ['TO_FUTURESWAP_GOVERNANCE'],
    },
    meta: {
      name: 'FUTURESWAP_GOVERNANCE_VOTE',
      priority: 30,
      type: 'VOTE',
      protocol: 'FUTURESWAP',
    },
  },
  {
    schema: {
      key: 'methodId',
      type: 'methodId',
      methodId: ['0xe3dec8fb'],
      and: ['TO_POLYGON_BRIDGE'],
    },
    meta: {
      name: 'POLYGON_BRIDGE_IN',
      priority: 30,
      type: 'BRIDGE_IN',
      protocol: 'POLYGON',
    },
  },
  {
    schema: {
      key: 'methodId',
      type: 'methodId',
      methodId: ['0x3805550f'],
      and: ['TO_POLYGON_BRIDGE'],
    },
    meta: {
      name: 'POLYGON_BRIDGE_OUT',
      priority: 30,
      type: 'BRIDGE_OUT',
      protocol: 'POLYGON',
    },
  },
  {
    schema: {
      key: 'methodId',
      type: 'methodId',
      methodId: ['0xd9627aa4', '0x6af479b2', '0x3598d8ab'],
      and: ['TO_0X_EXCHANGE_PROXY'],
    },
    meta: {
      name: '0X_V3_EXCHANGE',
      priority: 50,
      type: 'EXCHANGE',
      protocol: '0X_V3',
    },
  },
  {
    schema: {
      key: 'methodId',
      type: 'methodId',
      methodId: ['0x1c3db2e0'],
      and: ['TO_COMPOUND_COMPTROLLER'],
    },
    meta: {
      name: 'COMPOUND_CLAIM',
      priority: 30,
      type: 'CLAIM',
      protocol: 'COMPOUND',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0x13ed6866d4e1ee6da46f845c46d7e54120883d75c5ea9a2dacc1c4ca8984ab80'],
    },
    meta: {
      name: 'COMPOUND_V2_BORROW',
      priority: 50,
      type: 'BORROW',
      protocol: 'COMPOUND',
    },
  },
  {
    schema: {
      key: 'logAddress',
      type: 'addresses',
      addresses: ['0x5d3a536e4d6dbd6114cc1ead35777bab948e3643'],
      and: ['ERC_20_MINT'],
    },
    meta: {
      name: 'COMPOUND_V2_DEPOSIT',
      priority: 50,
      type: 'DEPOSIT',
      protocol: 'COMPOUND',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0x1a2a22cb034d26d1854bdc6666a5b91fe25efbbb5dcad3b0355478d6f5c362a1'],
    },
    meta: {
      name: 'COMPOUND_V2_REPAY',
      priority: 50,
      type: 'REPAY',
      protocol: 'COMPOUND',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0xe5b754fb1abb7f01b499791d0b820ae3b6af3424ac1c59768edb53f4ec31a929'],
    },
    meta: {
      name: 'COMPOUND_V2_WITHDRAW',
      priority: 50,
      type: 'WITHDRAW',
      protocol: 'COMPOUND',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0xd8138f8a3f377c5259ca548e70e4c2de94f129f5a11036a15b69513cba2b426a'],
      and: ['TO_BALANCER_DISTRIBUTOR'],
    },
    meta: {
      name: 'BALANCER_CLAIM',
      priority: 30,
      type: 'CLAIM',
      protocol: 'BALANCER',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0x63982df10efd8dfaaaa0fcc7f50b2d93b7cba26ccc48adee2873220d485dc39a'],
    },
    meta: {
      name: 'BALANCER_DEPOSIT',
      priority: 55,
      type: 'DEPOSIT',
      protocol: 'BALANCER',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0x908fb5ee8f16c6bc9bc3690973819f32a4d4b10188134543c88706e0e1d43378'],
    },
    meta: {
      name: 'BALANCER_EXCHANGE',
      priority: 55,
      type: 'EXCHANGE',
      protocol: 'BALANCER',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0xe74c91552b64c2e2e7bd255639e004e693bd3e1d01cc33e65610b86afcc1ffed'],
    },
    meta: {
      name: 'BALANCER_WITHDRAW',
      priority: 55,
      type: 'WITHDRAW',
      protocol: 'BALANCER',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0x1e77446728e5558aa1b7e81e0cdab9cc1b075ba893b740600c76a315c2caa553'],
    },
    meta: {
      name: 'AAVE_BORROW',
      priority: 50,
      type: 'BORROW',
      protocol: 'AAVE',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0xc12c57b1c73a2c3a2ea4613e9476abb3d8d146857aab7329e24243fb59710c82'],
    },
    meta: {
      name: 'AAVE_DEPOSIT',
      priority: 50,
      type: 'DEPOSIT',
      protocol: 'AAVE',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0xbd5034ffbd47e4e72a94baa2cdb74c6fad73cb3bcdc13036b72ec8306f5a7646'],
    },
    meta: {
      name: 'AAVE_WITHDRAW',
      priority: 50,
      type: 'WITHDRAW',
      protocol: 'AAVE',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0xb718f0b14f03d8c3adf35b15e3da52421b042ac879e5a689011a8b1e0036773d'],
    },
    meta: {
      name: 'AAVE_REPAY',
      priority: 50,
      type: 'REPAY',
      protocol: 'AAVE',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0x04672052dcb6b5b19a9cc2ec1b8f447f1f5e47b5e24cfa5e4ffb640d63ca2be7'],
      and: ['TO_GITCOIN_DISTRIBUTOR'],
    },
    meta: {
      name: 'GITCOIN_CLAIM',
      priority: 30,
      type: 'CLAIM',
      protocol: 'GITCOIN',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0xf2a0eb156472d1440255b0d7c1e19cc07115d1051fe605b0dce69acfec884d9c'],
    },
    meta: {
      name: 'GNOSIS_SAFE_APPROVE_TX',
      priority: 60,
      type: 'MULTISIG_APPROVE_TX',
      protocol: 'GNOSIS_SAFE',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0x442e715f626346e8c54381002da614f62bee8d27386535b2521ec8540898556e'],
    },
    meta: {
      name: 'GNOSIS_SAFE_WITHDRAW',
      priority: 60,
      type: 'WITHDRAW',
      protocol: 'GNOSIS_SAFE',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0xe2cee3f6836059820b673943853afebd9b3026125dab0d774284e6f28a4855be'],
    },
    meta: {
      name: '1INCH_EXCHANGE',
      priority: 40,
      type: 'EXCHANGE',
      protocol: '1INCH',
    },
  },
  {
    schema: {
      key: 'methodId',
      type: 'methodId',
      methodId: ['0x7c025200', '0x2e95b6c8'],
      and: ['TO_1INCH_V3_EXCHANGE_PROXY'],
    },
    meta: {
      name: '1INCH_V3_EXCHANGE',
      priority: 50,
      type: 'EXCHANGE',
      protocol: '1INCH_V3',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'],
    },
    meta: {
      name: 'ERC_20_APPROVE',
      priority: 20,
      type: 'APPROVE',
      protocol: 'ERC_20',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      ],
      allRequired: true,
      topicsLength: 3,
    },
    meta: {
      name: 'ERC_20_MINT',
      priority: 21,
      type: 'MINT',
      protocol: 'ERC_20',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'],
      topicsLength: 3,
    },
    meta: {
      name: 'ERC_20_TRANSFER',
      priority: 20,
      type: 'TRANSFER',
      protocol: 'ERC_20',
    },
  },
  {
    schema: {
      key: 'methodId',
      type: 'methodId',
      methodId: ['0xa22cb465'],
    },
    meta: {
      name: 'ERC_721_APPROVE',
      priority: 20,
      type: 'NFT_APPROVE',
      protocol: 'ERC_721',
    },
  },
  {
    schema: {
      key: 'methodId',
      type: 'methodId',
      methodId: ['0x095ea7b3'],
      and: ['TO_COMPOUND_C_TOKEN'],
    },
    meta: {
      name: 'COMPOUND_V2_DEPOSIT',
      priority: 60,
      type: 'DEPOSIT',
      protocol: 'COMPOUND',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      ],
      topicsLength: 4,
      allRequired: true,
    },
    meta: {
      name: 'ERC_721_MINT',
      priority: 22,
      type: 'NFT_MINT',
      protocol: 'ERC_721',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'],
      topicsLength: 4,
    },
    meta: {
      name: 'ERC_721_TRANSFER',
      priority: 21,
      type: 'NFT_TRANSFER',
      protocol: 'ERC_721',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0xdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d7'],
    },
    meta: {
      name: 'IDEX_DEPOSIT_ETH',
      priority: 40,
      type: 'DEPOSIT_ETH',
      protocol: 'IDEX',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0xdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d7'],
      and: ['ERC_20_TRANSFER'],
    },
    meta: {
      name: 'IDEX_DEPOSIT_TOKEN',
      priority: 40,
      type: 'DEPOSIT_TOKEN',
      protocol: 'IDEX',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0xf341246adaac6f497bc2a656f546ab9e182111d630394f0c57c710a59a2cb567'],
    },
    meta: {
      name: 'IDEX_WITHDRAW',
      priority: 40,
      type: 'WITHDRAW',
      protocol: 'IDEX',
    },
  },
  {
    schema: {
      key: 'methodId',
      type: 'methodId',
      methodId: ['0x3ce33bff'],
      and: ['TO_METAMASK_BRIDGE_V1'],
    },
    meta: {
      name: 'METAMASK_V1_BRIDGE_OUT',
      priority: 40,
      type: 'BRIDGE_OUT',
      protocol: 'METAMASK_BRIDGE',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0xbeee1e6e7fe307ddcf84b0a16137a4430ad5e2480fc4f4a8e250ab56ccd7630d'],
      and: ['TO_METAMASK_V1_ROUTER'],
    },
    meta: {
      name: 'METAMASK_V1_EXCHANGE',
      priority: 40,
      type: 'EXCHANGE',
      protocol: 'METAMASK_V1',
    },
  },
  {
    schema: {
      key: 'methodId',
      type: 'methodId',
      methodId: ['0xe10cb889'],
      and: ['TO_METAMASK_STAKE_V1'],
    },
    meta: {
      name: 'METAMASK_STAKE_V1',
      priority: 40,
      type: 'STAKE',
      protocol: 'METAMASK_STAKE',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0x5152abf959f6564662358c2e52b702259b78bac5ee7842a0f01937e670efcc7d'],
      and: ['TO_OPENSEA_ROUTER'],
    },
    meta: {
      name: 'OPENSEA_CANCEL_ORDER',
      priority: 30,
      type: 'CANCEL_ORDER',
      protocol: 'OPENSEA',
    },
  },
  {
    schema: {
      key: 'methodId',
      type: 'methodId',
      methodId: ['0xab834bab'],
      and: ['TO_OPENSEA_ROUTER'],
    },
    meta: {
      name: 'OPENSEA_EXCHANGE',
      priority: 30,
      type: 'NFT_EXCHANGE',
      protocol: 'OPENSEA',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0xbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b'],
      and: ['TO_OPENSEA_REGISTRY'],
    },
    meta: {
      name: 'OPENSEA_REGISTER',
      priority: 30,
      type: 'REGISTER',
      protocol: 'OPENSEA',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0xd8138f8a3f377c5259ca548e70e4c2de94f129f5a11036a15b69513cba2b426a'],
      and: ['TO_POOLTOGETHER_DISTRIBUTOR'],
    },
    meta: {
      name: 'POOLTOGETHER_CLAIM',
      priority: 30,
      type: 'CLAIM',
      protocol: 'POOLTOGETHER',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0x6ce569498e0f86f147466ac49211cb2a1ffe06195adb805e383b3f2365109160'],
    },
    meta: {
      name: 'POOLTOGETHER_DEPOSIT',
      priority: 55,
      type: 'DEPOSIT',
      protocol: 'POOLTOGETHER',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0x0271704a58fd2953e49b87d67a0a3ce28a58147de98a5457f60b4686f6385030'],
    },
    meta: {
      name: 'POOLTOGETHER_WITHDRAW',
      priority: 55,
      type: 'WITHDRAW',
      protocol: 'POOLTOGETHER',
    },
  },
  {
    schema: {
      key: 'methodId',
      type: 'methodId',
      methodId: ['0xf305d719', '0xe8e33700'],
      and: ['TO_SUSHISWAP_ROUTER'],
    },
    meta: {
      name: 'SUSHISWAP_DEPOSIT',
      priority: 30,
      type: 'DEPOSIT',
      protocol: 'SUSHISWAP',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: [
        '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822',
        '0x7f4091b46c33e918a0f3aa42307641d17bb67029427a5369e54b353984238705',
      ],
      and: ['TO_SUSHISWAP_ROUTER'],
    },
    meta: {
      name: 'SUSHISWAP_EXCHANGE',
      priority: 40,
      type: 'EXCHANGE',
      protocol: 'SUSHISWAP',
    },
  },
  {
    schema: {
      key: 'methodId',
      type: 'methodId',
      methodId: ['0xded9382a', '0x2195995c'],
      and: ['TO_SUSHISWAP_ROUTER'],
    },
    meta: {
      name: 'SUSHISWAP_WITHDRAW',
      priority: 30,
      type: 'WITHDRAW',
      protocol: 'SUSHISWAP',
    },
  },
  {
    schema: {
      key: 'methodId',
      type: 'methodId',
      methodId: ['0xc858f5f9'],
      and: ['TO_AAVE_LENDING_POOL_V1'],
    },
    meta: {
      name: 'AAVE_BORROW',
      priority: 50,
      type: 'EXCHANGE',
      protocol: 'AAVE_LENDING_V1',
    },
  },
  {
    schema: {
      key: 'methodId',
      type: 'methodId',
      methodId: ['0xd2d0e066'],
      and: ['TO_AAVE_LENDING_POOL_V1'],
    },
    meta: {
      name: 'AAVE_DEPOSIT',
      priority: 50,
      type: 'EXCHANGE',
      protocol: 'AAVE_LENDING_V1',
    },
  },
  {
    schema: {
      key: 'methodId',
      type: 'methodId',
      methodId: ['0x5ceae9c4'],
      and: ['TO_AAVE_LENDING_POOL_V1'],
    },
    meta: {
      name: 'AAVE_REPAY',
      priority: 50,
      type: 'EXCHANGE',
      protocol: 'AAVE_LENDING_V1',
    },
  },
  {
    schema: {
      key: 'methodId',
      type: 'methodId',
      methodId: ['0x02751cec'],
      and: ['TO_UNISWAP_V2_ROUTER'],
    },
    meta: {
      name: 'UNISWAP_V2_WITHDRAW',
      priority: 50,
      type: 'WITHDRAW',
      protocol: 'UNISWAP_V2',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0x7d76860f120f877ecdc289aa48a7ccc6d0782d9fc59f154c29bc262b7f8308cc'],
    },
    meta: {
      name: 'DEX_AG_EXCHANGE',
      priority: 40,
      type: 'EXCHANGE',
      protocol: 'DEX_AG',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0xce3bcb6e219596cf26007ffdfaae8953bc3f76e3f36c0a79b23e28020da3222e'],
      and: ['TO_DAPPNODE_DISTRIBUTOR'],
    },
    meta: {
      name: 'DAPPNODE_CLAIM',
      priority: 30,
      type: 'CLAIM',
      protocol: 'DAPPNODE',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0x4ec90e965519d92681267467f775ada5bd214aa92c0dc93d90a5e880ce9ed026'],
      and: ['TO_UNISWAP_DISTRIBUTOR'],
    },
    meta: {
      name: 'UNISWAP_CLAIM',
      priority: 30,
      type: 'CLAIM',
      protocol: 'UNISWAP',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0x06239653922ac7bea6aa2b19dc486b9361821d37712eb796adfd38d81de278ca'],
    },
    meta: {
      name: 'UNISWAP_V1_DEPOSIT',
      priority: 30,
      type: 'DEPOSIT',
      protocol: 'UNISWAP_V1',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0xcd60aa75dea3072fbc07ae6d7d856b5dc5f4eee88854f5b4abf7b680ef8bc50f'],
    },
    meta: {
      name: 'UNISWAP_V1_EXCHANGE',
      priority: 30,
      type: 'EXCHANGE',
      protocol: 'UNISWAP_V1',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0x0fbf06c058b90cb038a618f8c2acbf6145f8b3570fd1fa56abb8f0f3f05b36e8'],
    },
    meta: {
      name: 'UNISWAP_V1_WITHDRAW',
      priority: 30,
      type: 'WITHDRAW',
      protocol: 'UNISWAP_V1',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1'],
      and: ['TO_UNISWAP_V2_ROUTER'],
    },
    meta: {
      name: 'UNISWAP_V2_DEPOSIT',
      priority: 30,
      type: 'DEPOSIT',
      protocol: 'UNISWAP_V2',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: [
        '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822',
        '0x7f4091b46c33e918a0f3aa42307641d17bb67029427a5369e54b353984238705',
      ],
      and: ['TO_UNISWAP_V2_ROUTER'],
    },
    meta: {
      name: 'UNISWAP_V2_EXCHANGE',
      priority: 40,
      type: 'EXCHANGE',
      protocol: 'UNISWAP_V2',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0x0fbf06c058b90cb038a618f8c2acbf6145f8b3570fd1fa56abb8f0f3f05b36e8'],
      and: ['TO_UNISWAP_V2_ROUTER'],
    },
    meta: {
      name: 'UNISWAP_V2_WITHDRAW',
      priority: 30,
      type: 'WITHDRAW',
      protocol: 'UNISWAP_V2',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0x7a53080ba414158be7ec69b987b5fb7d07dee101fe85488f0853ae16239d0bde'],
      and: ['TO_UNISWAP_V3_ROUTER'],
    },
    meta: {
      name: 'UNISWAP_V3_DEPOSIT',
      priority: 30,
      type: 'DEPOSIT',
      protocol: 'UNISWAP_V3',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67'],
      and: ['TO_UNISWAP_V3_ROUTER'],
    },
    meta: {
      name: 'UNISWAP_V3_EXCHANGE',
      priority: 40,
      type: 'EXCHANGE',
      protocol: 'UNISWAP_V3',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0x40d0efd1a53d60ecbf40971b9daf7dc90178c3aadc7aab1765632738fa8b8f01'],
    },
    meta: {
      name: 'UNISWAP_V3_WITHDRAW',
      priority: 30,
      type: 'WITHDRAW',
      protocol: 'UNISWAP_V3',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0xa945e51eec50ab98c161376f0db4cf2aeba3ec92755fe2fcd388bdbbb80ff196'],
    },
    meta: {
      name: 'TORNADO_CASH_V1_DEPOSIT',
      priority: 40,
      type: 'DEPOSIT',
      protocol: 'TORNADO_CASH_V1',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0xe9e508bad6d4c3227e881ca19068f099da81b5164dd6d62b2eaf1e8bc6c34931'],
    },
    meta: {
      name: 'TORNADO_CASH_V1_WITHDRAW',
      priority: 40,
      type: 'WITHDRAW',
      protocol: 'TORNADO_CASH_V1',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65'],
    },
    meta: {
      name: 'WETH_UNWRAP',
      priority: 21,
      type: 'UNWRAP',
      protocol: 'ERC_20',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c'],
    },
    meta: {
      name: 'WETH_WRAP',
      priority: 21,
      type: 'WRAP',
      protocol: 'ERC_20',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: [
        '0x1849bd6a030a1bca28b83437fd3de96f3d27a5d172fa7e9c78e7b61468928a39',
        '0x7f4091b46c33e918a0f3aa42307641d17bb67029427a5369e54b353984238705',
      ],
    },
    meta: {
      name: 'KYBER_EXCHANGE',
      priority: 30,
      type: 'EXCHANGE',
      protocol: 'KYBER',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0x9cc2048b8af5eadff75759a3169b369efc538fb79c760fd396a4b355410b41b7'],
      and: ['TO_PARASWAP_V4_EXCHANGE_PROXY'],
    },
    meta: {
      name: 'PARASWAP_V4_EXCHANGE',
      priority: 50,
      type: 'EXCHANGE',
      protocol: 'PARASWAP_V4',
    },
  },
  {
    schema: {
      key: 'topics',
      type: 'topics',
      topics: ['0x528937b330082d892a98d4e428ab2dcca7844b51d227a1c0ae67f0b5261acbd9'],
      and: ['TO_FOX_DISTRIBUTOR'],
    },
    meta: {
      name: 'SHAPESHIFT_CLAIM',
      priority: 30,
      type: 'CLAIM',
      protocol: 'SHAPESHIFT',
    },
  },
]
