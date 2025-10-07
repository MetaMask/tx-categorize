import { Action } from '../enums'
import { ContractAddressMap, DeterminantMap, MethodIdMap, TopicHashMap } from '../types'

const {
  WRAP,
  APPROVE,
  BORROW,
  BRIDGE_IN,
  BRIDGE_OUT,
  CANCEL_ORDER,
  CLAIM,
  DEPOSIT,
  DOMAIN_REGISTER,
  EXCHANGE,
  WITHDRAW,
  NFT_EXCHANGE,
  REGISTER,
  TRANSFER,
  VOTE,
  REPAY,
  MINT,
  UNWRAP,
  DEPOSIT_TOKEN,
  DOMAIN_RENEW,
  DOMAIN_RESOLVER_SET,
  MULTISIG_APPROVE_TX,
  DEPOSIT_ETH,
  STAKE,
  WITHDRAW_TOKEN,
  RECLAIM,
  PAYMENT,
} = Action

const determinants: DeterminantMap = {
  contracts: [
    { address: '0xa2881a90bf33f03e7a3f803765cd2ed5c8928dfb', name: 'UNISWAP_WETH', protocol: 'UNISWAP' },
    {
      addresses: [
        '0xa51afafe0263b40edaef0df8781ea9aa03e381a3',
        '0x6ff5693b99212da76ad316178a184ab56d299b43',
        '0x66a9893cc07d91d95644aedd05d03f95e1dba8af',
        '0x1095692a6237d83c6a72f3f5efedb9a670c49223',
        '0x1906c1d672b88cd1b9ac7593301ca990f94eae07',
        '0x851116d9223fabed8e56c0e6b8ad0c31d98b3507',
        '0x94b75331ae8d42c1b61065089b7d48fe14aa73b7',
        '0xeabbcb3e8e415306207ef514f660a3f820025be3',
      ],
      name: 'UNISWAP_V4_ROUTER',
      protocol: 'UNISWAP_V4',
    },
    {
      addresses: ['0x2d8879046f1559e53eb052e949e9544bcb72f414'],
      name: 'ODOS_ROUTER',
      protocol: 'ODOS',
    },
    {
      addresses: [
        '0xa5f565650890fba1824ee0f21ebbbf660a179934',
        '0x7f4babd2c7d35221e72ab67ea72cba99573a0089',
        '0x00000000aa467eba42a3d604b3d74d63b2b6c6cb',
        '0xf366da269047a06a7275a933c6d653409bd6de5e',
        '0x47eb64e17a6d2fd559b608695e6d308cced918dd',
        '0xebd1e414ebb98522cfd932104ba41fac10a4ef35',
      ],
      name: 'RESERVOIR_RELAY',
      protocol: 'RESERVOIR',
    },

    { address: '0xde1e598b81620773454588b85d6b5d4eec32573e', name: 'LIFI', protocol: 'LIFI' }, // linea
    { address: '0xdef171fe48cf0115b1d80b88dc8eab59176fee57', name: 'PARASWAP', protocol: 'PARASWAP', version: 'V5' },
    { address: '0xb8901acb165ed027e32754e0ffe830802919727f', name: 'HOP_PROTOCOL', protocol: 'HOP' },
    { address: '0xba12222222228d8ba445958a75a0704d566bf2c8', name: 'BALANCER_VAULT', protocol: 'BALANCER' },
    {
      address: '0x80a64c6d7f12c47b7c66c5b4e20e72bc1fcd5d9e',
      name: 'MAESTRO_ROUTER',
      protocol: 'MAESTRO',
      version: 'V2',
    },
    {
      addresses: [
        '0x1231deb6f5749ef6ce6943a275a1d3e7486f4eae',
        '0x362fa9d0bca5d19f743db50738345ce2b40ec99f',
        '0x341e94069f53234fe6dabef707ad424830525715',
        '0xce81d9bb9d9605fff296ccf8af6b6b38f02cf15d',
        '0x79e05dde041e64cc13c3280b7d083f3ae976fe70',
        '0x341e94069f53234fe6dabef707ad424830525715',
        '0x1d17cbcf0d6d143135ae902365d2e5e2a16538d4',
        '0xe397c4883ec89ed4fc9d258f00c689708b2799c9',
        '0x6ef81a18e1e432c289dc0d1a670b78e8bbf9aa35',
        '0xe7bf43c55551b1036e796e7fd3b125d1f9903e2e',
        '0xde1e598b81620773454588b85d6b5d4eec32573e',
        '0xf18a285f4e6f720eb9b4e05df71f88b9552e6adb',
        '0x9b11bc9fac17c058cab6286b0c785be6a65492ef',
        '0xb7237563c604ee305feab6f275afde628354198a',
        '0xc10cf1c23e20e3fe6f0b224bc2e16c9acabfebb9',
        '0x71327af4f53e8831bd7e1addbed9d2b6dace64a2',
        '0x21972996244aa8e469f5b4c8658e9546af259683',
        '0x1bdacd14bd00861ea4042d4bf151731f1b239f4a',
        '0x6569c96727c85d8497cdfdc32bee6686ed474e89',
        '0xf156dc1077213aa92a3ed6008a7ff8aea2633186',
        '0x58fba880b973edb5e4f6aa4e2bd3b15c865b9b18',
        '0x5d3675d698a3dd53e3457951e1debef717a29a72',
        '0xa662972b4004ec10f5c6189dbc6e44f90149fa98',
        '0xed662c027c985b73a732975e3b4ceadc97aaf145',
        '0xa4eb2ef4064197de6517a53d36263e4591cd0b34',
        '0x5e3dc14bfc5af89c2c34a24e2c1ba6430b9f4fd2',
        '0x411f81f16ff40984ac8a4546f2ad19e22704693f',
        '0x5ca7d3e5689a976266245ad2b50c674f60d6195d',
        '0x967d0f9181521a407613495e68e5f8d22b49e513',
        '0x8782a38afb46b291e4b7409c90de10b95b96a78d',
        '0x403415d830a7815599a0d6ee62199891ce18513d',
        '0xa95309df9256d52f9b61379963701ff1ba5939e4',
        '0xbee13d99dd633feaa2a0935f00cbc859f8305fa7',
        '0x98e3e949e8310d836a625495ea70eeaa92073862',
        '0xf72169fb511739cefea9ebeffc5d39dba1b33cd3',
        '0x6039935fc13e548517c2c3ceeb81a952c69c8a3b',
      ],
      name: 'LIFI',
      protocol: 'LIFI',
    },
    {
      addresses: [
        '0xc30141b657f4216252dc59af2e7cdb9d8792e1b0',
        '0x2b42affd4b7c14d9b7c2579229495c052672ccd3',
        '0x3a23f943181408eac424116af7b7790c94cb97a5',
        '0xadde7028e7ec226777e5dea5d53f6457c21ec7d6',
      ],
      name: 'SOCKET',
      protocol: 'SOCKET',
    },
    { addresses: ['0x5c7bcd6e7de5423a257d81b442095a1a6ced35c5'], name: 'ACROSS', protocol: 'ACROSS' },
    { address: '0xf9e037dcf792ba8c4a0ca570eac7cbcbafabd9d4', name: 'PROXY', protocol: 'PROXY' },
    { address: '0x00005ea00ac477b1030ce78506496e8c2de24bf5', name: 'SEADROP', protocol: 'SEADROP', version: 'V1.0' },
    { address: '0xd5eaab2b0cd9c21bf3d29e5fd90b22d2631b86d6', name: 'COINBACK', protocol: 'COINBACK' },
    { address: '0x7e63a5f1a8f0b4d0934b2f2327daed3f6bb2ee75', name: 'ACROSS', protocol: 'ACROSS' },
    {
      address: '0x6131b5fae19ea4f9d964eac0408e4408b66337b5',
      name: 'KYBERSWAP_ROUTER',
      protocol: 'KYBERSWAP',
      version: 'V2',
    },
    { address: '0x8d12a197cb00d4747a1fe03395095ce2a5cc6819', name: 'ETHER_DELTA_2', protocol: 'ETHER_DELTA' },
    {
      address: '0x1111111254fb6c44bac0bed2854e76f90643097d',
      name: '1INCH_AGGREGATION_ROUTER',
      protocol: '1INCH',
      version: 'V4',
    },
    {
      address: '0x1111111254eeb25477b68fb85ed929f73a960582',
      name: '1INCH_AGGREGATION_ROUTER',
      protocol: '1INCH',
      version: 'V5',
    },
    {
      address: '0x111111125421ca6dc452d289314280a0f8842a65',
      name: '1INCH_AGGREGATION_ROUTER',
      protocol: '1INCH',
      version: 'V6',
    },
    {
      address: '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45',
      name: 'UNISWAP_V3_ROUTER_2',
      protocol: 'UNISWAP',
      version: 'V3',
    },
    {
      address: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
      name: 'UNISWAP_NFT_POSITION_MANAGER',
      protocol: 'UNISWAP',
      version: 'V3',
    },
    {
      address: '0x00000000006c3852cbef3e08e8df289169ede581',
      name: 'OPENSEA_SEAPORT',
      protocol: 'OPENSEA',
      version: 'V1.1',
    },
    {
      address: '0x00000000000001ad428e4906ae43d8f9852d0dd6',
      name: 'OPENSEA_SEAPORT',
      protocol: 'OPENSEA',
      version: 'V1.4',
    },
    {
      address: '0x00000000000000adc04c56bf30ac9d3c0aaf14dc',
      name: 'OPENSEA_SEAPORT',
      protocol: 'OPENSEA',
      version: 'V1.5',
    },
    {
      address: '0x0000000000000068f116a894984e2db1123eb395',
      name: 'OPENSEA_SEAPORT',
      protocol: 'OPENSEA',
      version: 'V1.6',
    },
    {
      addresses: ['0xc0ac932cac7b4d8f7c31792082e2e8f3cfe99c10', '0x032b241de86a8660f1ae0691a4760b426ea246d7'],
      name: 'IZUMI_FINANCE',
      protocol: 'IZUMI_FINANCE',
    },
    { address: '0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad', name: 'UNISWAP_UNIVERSAL_ROUTER', protocol: 'UNISWAP' },
    { address: '0xef1c6e67703c7bd7107eed8303fbe6ec2554bf6b', name: 'UNISWAP_UNIVERSAL_ROUTER_2', protocol: 'UNISWAP' },
    { address: '0x2a0c0dbecc7e4d658f48e01e3fa353f44050c208', name: 'IDEX_STAKING', protocol: 'IDEX' },
    {
      addresses: ['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', '0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f'],
      name: 'WETH',
      protocol: 'WETH',
    },
    { address: '0x745daa146934b27e3f0b6bff1a6e36b9b90fb131', name: 'DEX_AG_PROXY', protocol: 'DEX_AG' },
    { address: '0xdef1c0ded9bec7f1a1670819833240f027b25eff', name: '0X_EXCHANGE_PROXY', protocol: '0X_V3' },
    { address: '0x11111112542d85b3ef69ae05771c2dccff4faa26', name: '1INCH_V3_EXCHANGE_PROXY', protocol: '1INCH_V3' },
    { address: '0x398ec7346dcd622edc5ae82352f02be94c62d119', name: 'AAVE_LENDING_POOL_V1', protocol: 'AAVE_V1' },
    { address: '0x4dbd4fc535ac27206064b68ffcf827b0a60bab3f', name: 'ARBITRUM_INBOX', protocol: 'ARBITRUM' },
    { address: '0x760723cd2e632826c38fef8cd438a4cc7e7e1a40', name: 'ARBITRUM_OUTBOX', protocol: 'ARBITRUM' },
    { address: '0x6d19b2bf3a36a61530909ae65445a906d98a2fa8', name: 'BALANCER_DISTRIBUTOR', protocol: 'BALANCER' },
    { address: '0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b', name: 'COMPOUND_COMPTROLLER', protocol: 'COMPOUND' },
    { address: '0x87d6180b65ad76a9443064dcd1596388fcc3ee2a', name: 'DAPPNODE_DISTRIBUTOR', protocol: 'DAPPNODE' },
    {
      address: '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85',
      name: 'ENS_REGISTRAR',
      protocol: 'ENS',
      definingTrait: 'DOMAIN',
    },
    {
      address: '0x253553366da8546fc250f225fe3d25d0c782303b',
      name: 'ENS_REGISTRAR',
      protocol: 'ENS',
    },
    { address: '0xc18360217d8f7ab5e7c516566761ea12ce7f9d72', name: 'ENS_TOKEN_CONTRACT', protocol: 'ENS' },
    { address: '0xb90381dae1a72528660278100c5aa44e1108cef7', name: 'FOX_DISTRIBUTOR', protocol: 'SHAPESHIFT' },
    {
      address: '0x0a7f8161605acc552fa38fdb8ee7d8177c9ac22a',
      name: 'FUTURESWAP_GOVERNANCE',
      protocol: 'FUTURESWAP',
      definingTrait: 'GOVERNANCE',
    },
    { address: '0xde3e5a990bce7fc60a6f017e7c4a95fc4939299e', name: 'GITCOIN_DISTRIBUTOR', protocol: 'GITCOIN' },
    {
      address: '0x82e0b8cdd80af5930c4452c684e71c861148ec8a',
      name: 'METAMASK_BRIDGE_V1',
      protocol: 'METAMASK',
      definingTrait: 'BRIDGE',
      version: 'V1',
    },
    {
      addresses: [
        '0x0439e60F02a8900a951603950d8D4527f400C3f1', //ethereum
        '0xB90357f2b86dbfD59c3502215d4060f71DF8ca0e', //optimism
        '0xaEc23140408534b378bf5832defc426dF8604B59', //bnb
        '0x3A0b42cE6166abB05d30DdF12E726c95a83D7a16', //polygon
        '0x357B5935482AD8a4A2e181e0132aBd1882E16520', //324
        '0xa20ECbC821fB54064aa7B5C6aC81173b8b34Df71', //base
        '0x23981fC34e69eeDFE2BD9a0a9fCb0719Fe09DbFC', //arbitrum
        '0x29106d08382d3c73bF477A94333C61Db1142E1B6', //avalanche c-chain
        '0xE3d0d2607182Af5B24f5C3C2E4990A053aDd64e3', //linea
      ],
      name: 'METAMASK_BRIDGE_V2',
      protocol: 'METAMASK',
      definingTrait: 'BRIDGE',
      version: 'V2',
    },
    {
      addresses: ['0xf256f3cbefc7abbce953635f5d700a98c4b45277', '0xDc71aFFC862fceB6aD32BE58E098423A7727bEbd'],
      name: 'METAMASK_STAKE_V1',
      protocol: 'METAMASK',
      definingTrait: 'STAKE',
      version: 'V1',
    },
    {
      addresses: [
        '0x881d40237659c251811cec9c364ef91dc08d300c',
        '0x1a1ec25DC08e98e5E93F1104B5e5cdD298707d31',
        '0x9dda6ef3d919c9bc8885d5560999a3640431e8e6',
        '0xf504c1fe13d14df615e66dcd0abf39e60c697f34',
      ],
      name: 'METAMASK_V1_ROUTER',
      protocol: 'METAMASK_V1',
    },
    { address: '0xce16f69375520ab01377ce7b88f5ba8c48f8d666', name: 'SQUID_ROUTER', protocol: 'SQUID' },
    { address: '0xa5409ec958c83c3f309868babaca7c86dcb077c1', name: 'OPENSEA_REGISTRY', protocol: 'OPENSEA' },
    { address: '0x7be8076f4ea4a4ad08075c2508e481d6c946d12b', name: 'OPENSEA_ROUTER', protocol: 'OPENSEA' },
    { address: '0x7f268357a8c2552623316e2562d90e642bb538e5', name: 'OPENSEA_EXCHANGE_2', protocol: 'OPENSEA' },
    {
      address: '0x1bd435f3c054b6e901b7b108a0ab7617c808677b',
      name: 'PARASWAP_V4_EXCHANGE_PROXY',
      protocol: 'PARASWAP_V4',
    },
    {
      addresses: [
        '0x65b382653f7c31bc0af67f188122035461ec9c76',
        '0x1a0a18ac4becddbd6389559687d1a73d8927e416',
        '0xfe6508f0015c778bdcc1fb5465ba5ebe224c9912',
        '0xb89a6778d1efe7a5b7096757a21b810cc2886fa1',
        '0xdaee41e335322c85ff2c5a6745c98e1351806e98',
      ],
      name: 'PANCAKESWAP_V2_ROUTER',
      protocol: 'PANCAKESWAP_V2',
    },
    { address: '0xa0c68c638235ee32657e8f720a23cec1bfc77c77', name: 'POLYGON_BRIDGE', protocol: 'POLYGON' },
    {
      address: '0x9a29401ef1856b669f55ae5b24505b3b6faeb370',
      name: 'POOLTOGETHER_DISTRIBUTOR',
      protocol: 'POOLTOGETHER',
    },
    { address: '0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f', name: 'SUSHISWAP_ROUTER', protocol: 'SUSHISWAP' },
    { address: '0x090d4613473dee047c3f2706764f49e0821d256e', name: 'UNISWAP_DISTRIBUTOR', protocol: 'UNISWAP' },
    { address: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d', name: 'UNISWAP_V2_ROUTER', protocol: 'UNISWAP_V2' },
    { address: '0xe592427a0aece92de3edee1f18e0157c05861564', name: 'UNISWAP_V3_ROUTER', protocol: 'UNISWAP_V3' },
    { address: '0x8fd00f170fdf3772c5ebdcd90bf257316c69ba45', name: 'SPARKPOOL_MINING_PAYOUT', protocol: 'SPARKPOOL' },
    {
      address: '0x3ecef08d0e2dad803847e052249bb4f8bff2d5bb',
      name: 'MININGPOOLHUB_MINING_PAYOUT',
      protocol: 'MININGPOOLHUB',
    },
    {
      address: '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643',
      name: 'COMPOUND_C_TOKEN',
      protocol: 'COMPOUND',
      version: 'V2',
    },
    { address: '0x3a9fff453d50d4ac52a6890647b823379ba36b9e', name: 'SHUFFLE_MONSTER_V3', protocol: 'ERC_20' },
    { address: '0x26946ada5ecb57f3a1f91605050ce45c482c9eb1', name: 'BITCOINSOV', protocol: 'ERC_20' },
    { address: '0x722122df12d4e14e13ac3b6895a86e84145b6967', name: 'TORNADO_CASH', protocol: 'TORNADO_CASH_V1' },
    { address: '0x283af0b28c62c092c9727f1ee09c02ca627eb7f5', name: 'ENS_V1', protocol: 'ENS_V1' },
    { address: '0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e', name: 'ENS', protocol: 'ENS' },
    { address: '0xebfb47a7ad0fd6e57323c8a42b2e5a6a4f68fc1a', name: 'POOLTOGETHER', protocol: 'POOLTOGETHER' },
    { address: '0xa0fa0e79342884a9c84f42fafa28f051b1efaec9', name: 'DS_PROXY', protocol: 'BALANCER' },
    { address: '0x60626db611a9957c1ae4ac5b7ede69e24a3b76c5', name: 'POOL_TOKEN', protocol: 'BALANCER' },
    { address: '0x6b74fb4e4b3b177b8e95ba9fa4c3a3121d22fbfb', name: 'POOL_TOKEN', protocol: 'BALANCER' },
    {
      address: '0xa90b298d05c2667ddc64e2a4e17111357c215dd2',
      name: 'METAMASK_CARD_PAYMENT_PROVIDER',
      protocol: 'METAMASK_CARD',
    },
    {
      address: '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2',
      name: 'AAVE_LENDING_POOL_V3',
      protocol: 'AAVE',
      version: 'V3',
    },
    {
      address: '0xdd3f50f8a6cafbe9b31a427582963f465e745af8',
      name: 'ROCKET_POOL_V1.2',
      protocol: 'ROCKET_POOL',
      version: 'V1.2',
    },
  ],
  methodIds: [
    { id: '0xaf7060fd', name: EXCHANGE, priority: 1, protocol: 'LIFI' }, // lifi
    { id: '0x14d53077', name: BRIDGE_OUT, priority: 1, protocol: 'LIFI' }, // lifi
    { id: '0xa6010a66', name: BRIDGE_OUT, priority: 1, protocol: 'LIFI' }, // lifi
    { id: '0x9871efa4', name: EXCHANGE, priority: 1 },
    { id: '0xca350aa6', name: WITHDRAW, protocol: 'COINBASE' },
    { id: '0x1a1da075', name: WITHDRAW, protocol: 'COINBASE' },
    { id: '0x0ffab6c2', name: CLAIM, protocol: 'METAMASK_STAKE_V1' },
    { id: '0x98a128c5', name: CLAIM },
    { id: '0xdeff4b24', name: BRIDGE_IN },
    { id: '0xfb0f3ee1', name: TRANSFER },
    { id: '0xd9627aa4', name: EXCHANGE, priority: 1 },
    { id: '0x6af479b2', name: EXCHANGE, priority: 1 },
    { id: '0x3598d8ab', name: EXCHANGE, priority: 1 },
    { id: '0x7c025200', name: EXCHANGE, priority: 1 },
    { id: '0x2e95b6c8', name: EXCHANGE, priority: 1 },
    { id: '0xc858f5f9', name: BORROW },
    { id: '0xd2d0e066', name: DEPOSIT },
    { id: '0x5ceae9c4', name: REPAY },
    { id: '0x02751cec', name: WITHDRAW },
    { id: '0x0f4d14e9', name: BRIDGE_IN },
    { id: '0x9c5cfe0b', name: BRIDGE_OUT },
    { id: '0x1c3db2e0', name: CLAIM },
    { id: '0x23b872dd', name: TRANSFER, priority: 99 },
    { id: '0xd0e30db0', name: DEPOSIT }, // -- too general `deposit()`. causes conflicts with other protocols
    { id: '0xa22cb465', name: APPROVE, protocol: 'ERC_721', priority: 100 },
    { id: '0x42842e0e', name: TRANSFER, protocol: 'ERC_721', priority: 99 },
    { id: '0xb88d4fde', name: TRANSFER, protocol: 'ERC_721', priority: 99 },
    { id: '0x3ce33bff', name: BRIDGE_OUT },
    { id: '0xe10cb889', name: STAKE },
    { id: '0xab834bab', name: NFT_EXCHANGE },
    { id: '0xe3dec8fb', name: BRIDGE_IN },
    { id: '0x3805550f', name: BRIDGE_OUT },
    { id: '0xf305d719', name: DEPOSIT },
    { id: '0xe8e33700', name: DEPOSIT },
    { id: '0xded9382a', name: WITHDRAW },
    { id: '0x2195995c', name: WITHDRAW },
    { id: '0x095ea7b3', name: APPROVE, protocol: 'ERC_20', priority: 100 },
    { id: '0x40c10f19', name: MINT, protocol: 'ERC_20', priority: 100 },
    { id: '0xa9059cbb', name: TRANSFER, protocol: 'ERC_20', priority: 99 },
    { id: '0x38ed1739', name: EXCHANGE, priority: 1 },
    { id: '0xfc6f7865', name: WITHDRAW },
    { id: '0xac9650d8', name: EXCHANGE, priority: 1 },
    { id: '0x88316456', name: DEPOSIT },
    { id: '0xf7a16963', name: DOMAIN_REGISTER },
    { id: '0x18cbafe5', name: EXCHANGE, priority: 1 },
    { id: '0xc804c39a', name: CLAIM },
    { id: '0x1cff79cd', name: DEPOSIT },
    { id: '0xb02f0b73', name: WITHDRAW },
    { id: '0x8201aa3f', name: EXCHANGE, priority: 1 },
    { id: '0x7884af44', name: MINT, protocol: 'ERC_721' },
    { id: '0x76122903', name: CLAIM },
    { id: '0x2e1a7d4d', name: WITHDRAW, protocol: 'ERC_20' },
    { id: '0x338b5dea', name: DEPOSIT_TOKEN },
    { id: '0xf2d12b12', name: NFT_EXCHANGE },
    { id: '0xe7acab24', name: NFT_EXCHANGE },
    { id: '0x12aa3caf', name: EXCHANGE, priority: 1 },
    { id: '0xfd9f1e10', name: CANCEL_ORDER },
    { id: '0x3593564c', name: EXCHANGE, priority: 1 }, // UNISWAP_V4
    { id: '0x9e281a98', name: WITHDRAW_TOKEN },
    { id: '0x161ac21f', name: MINT, priority: 1 },
    { id: '0xa74ccb35', name: EXCHANGE, priority: 1 },
    { id: '0x28ed4f6c', name: RECLAIM },
    { id: '0x3d0e3ec5', name: EXCHANGE, priority: 1 },
    { id: '0x52bbbe29', name: EXCHANGE, priority: 1 },
    { id: '0xa94e78ef', name: EXCHANGE, priority: 1 },
    { id: '0x54e3f31b', name: EXCHANGE, priority: 1 },
    { id: '0x0b86a4c1', name: EXCHANGE, priority: 1 },
    { id: '0x23c452cd', name: BRIDGE_IN },
    { id: '0xb95cac28', name: DEPOSIT }, // JOIN_POOL
    { id: '0x8bdb3913', name: WITHDRAW }, // EXIT_POOL
    { id: '0x2e378115', name: BRIDGE_IN },
    { id: '0xf7ece0cf', name: PAYMENT, protocol: 'METAMASK_CARD', priority: 105 },
    { id: '0x07ed2379', name: EXCHANGE, priority: 1 },
    { id: '0xe21fd0e9', name: EXCHANGE, priority: 1 },
  ],
  topics: [
    { hash: '0xe2cee3f6836059820b673943853afebd9b3026125dab0d774284e6f28a4855be', name: EXCHANGE, priority: 1 },
    { hash: '0xd6d4f5681c246c9f42c203e287975af1601f8df8035a9251f79aab5c8f09e2f8', name: EXCHANGE, priority: 1 },
    {
      hash: '0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62',
      name: TRANSFER,
      protocol: 'ERC_1155',
      priority: -1,
    },
    {
      hash: '0x0fe977d619f8172f7fdbe8bb8928ef80952817d96936509f67d66346bc4cd10f',
      name: EXCHANGE,
    },
    { hash: '0xac1020908b5f7134d59c1580838eba6fc42dd8c28bae65bf345676bba1913f8e', name: STAKE, priority: 10 },
    { hash: '0x936c2ca3b35d2d0b24057b0675c459e4515f48fe132d138e213ae59ffab7f53e', name: BRIDGE_OUT },
    { hash: '0x1e77446728e5558aa1b7e81e0cdab9cc1b075ba893b740600c76a315c2caa553', name: BORROW },
    { hash: '0xc12c57b1c73a2c3a2ea4613e9476abb3d8d146857aab7329e24243fb59710c82', name: DEPOSIT },
    { hash: '0xb718f0b14f03d8c3adf35b15e3da52421b042ac879e5a689011a8b1e0036773d', name: REPAY },
    { hash: '0xbd5034ffbd47e4e72a94baa2cdb74c6fad73cb3bcdc13036b72ec8306f5a7646', name: WITHDRAW },
    { hash: '0xd8138f8a3f377c5259ca548e70e4c2de94f129f5a11036a15b69513cba2b426a', name: CLAIM },
    { hash: '0x63982df10efd8dfaaaa0fcc7f50b2d93b7cba26ccc48adee2873220d485dc39a', name: DEPOSIT },
    { hash: '0x908fb5ee8f16c6bc9bc3690973819f32a4d4b10188134543c88706e0e1d43378', name: EXCHANGE, priority: 1 },
    { hash: '0xe74c91552b64c2e2e7bd255639e004e693bd3e1d01cc33e65610b86afcc1ffed', name: WITHDRAW },
    { hash: '0x13ed6866d4e1ee6da46f845c46d7e54120883d75c5ea9a2dacc1c4ca8984ab80', name: BORROW },
    { hash: '0x1a2a22cb034d26d1854bdc6666a5b91fe25efbbb5dcad3b0355478d6f5c362a1', name: REPAY },
    { hash: '0xe5b754fb1abb7f01b499791d0b820ae3b6af3424ac1c59768edb53f4ec31a929', name: WITHDRAW },
    { hash: '0xce3bcb6e219596cf26007ffdfaae8953bc3f76e3f36c0a79b23e28020da3222e', name: CLAIM },
    { hash: '0x7d76860f120f877ecdc289aa48a7ccc6d0782d9fc59f154c29bc262b7f8308cc', name: EXCHANGE, priority: 1 },
    { hash: '0x47cee97cb7acd717b3c0aa1435d004cd5b3c8c57d70dbceb4e4458bbd60e39d4', name: CLAIM },
    { hash: '0xb3d987963d01b2f68493b4bdb130988f157ea43070d4ad840fee0466ed9370d9', name: DOMAIN_REGISTER },
    { hash: '0x9b87a00e30f1ac65d898f070f8a3488fe60517182d0a2098e1b4b93a54aa9bd6', name: DOMAIN_RENEW },
    { hash: '0x3da24c024582931cfaf8267d8ed24d13a82a8068d5bd337d30ec45cea4e506ae', name: DOMAIN_RENEW },
    { hash: '0x335721b01866dc23fbee8b6b2c7b1e14d6f05c28cd35a2c934239f94095602a0', name: DOMAIN_RESOLVER_SET },
    { hash: '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925', name: APPROVE, priority: -1 },
    {
      hash: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      name: TRANSFER,
      protocol: 'ERC_721',
      topicsLength: '4',
      priority: 0,
    },
    {
      hash: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      name: TRANSFER,
      protocol: 'ERC_20',
      topicsLength: '3',
      priority: -2,
    },
    { hash: '0xf4f04db19b64306e1859ee9cd0e9d491d4ddd5714be9c3afdbe8f1c508d5dab2', name: VOTE },
    { hash: '0x04672052dcb6b5b19a9cc2ec1b8f447f1f5e47b5e24cfa5e4ffb640d63ca2be7', name: CLAIM },
    { hash: '0xf2a0eb156472d1440255b0d7c1e19cc07115d1051fe605b0dce69acfec884d9c', name: MULTISIG_APPROVE_TX },
    { hash: '0xcba69f43792f9f399347222505213b55af8e0b0b54b893085c2e27ecbe1644f1', name: BRIDGE_OUT },
    {
      hash: '0x442e715f626346e8c54381002da614f62bee8d27386535b2521ec8540898556e',
      name: WITHDRAW,
      protocol: 'GNOSIS_SAFE',
    },
    { hash: '0xdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d7', name: DEPOSIT_ETH, priority: 1 }, // deposit token if erc20 transfer
    { hash: '0xf341246adaac6f497bc2a656f546ab9e182111d630394f0c57c710a59a2cb567', name: WITHDRAW },
    { hash: '0x1849bd6a030a1bca28b83437fd3de96f3d27a5d172fa7e9c78e7b61468928a39', name: EXCHANGE, priority: 1 },
    { hash: '0x7f4091b46c33e918a0f3aa42307641d17bb67029427a5369e54b353984238705', name: EXCHANGE, priority: 1 },
    { hash: '0xbeee1e6e7fe307ddcf84b0a16137a4430ad5e2480fc4f4a8e250ab56ccd7630d', name: EXCHANGE, priority: 1 },
    { hash: '0x5152abf959f6564662358c2e52b702259b78bac5ee7842a0f01937e670efcc7d', name: CANCEL_ORDER },
    { hash: '0xbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b', name: REGISTER },
    { hash: '0x9cc2048b8af5eadff75759a3169b369efc538fb79c760fd396a4b355410b41b7', name: EXCHANGE, priority: 5 }, // aggregator exchange
    { hash: '0x6ce569498e0f86f147466ac49211cb2a1ffe06195adb805e383b3f2365109160', name: DEPOSIT },
    { hash: '0x0271704a58fd2953e49b87d67a0a3ce28a58147de98a5457f60b4686f6385030', name: WITHDRAW },
    { hash: '0x528937b330082d892a98d4e428ab2dcca7844b51d227a1c0ae67f0b5261acbd9', name: CLAIM },
    { hash: '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822', name: EXCHANGE, priority: 1 },
    { hash: '0xa945e51eec50ab98c161376f0db4cf2aeba3ec92755fe2fcd388bdbbb80ff196', name: DEPOSIT },
    { hash: '0xe9e508bad6d4c3227e881ca19068f099da81b5164dd6d62b2eaf1e8bc6c34931', name: WITHDRAW },
    {
      hash: '0x3d0ce9bfc3ed7d6862dbb28b2dea94561fe714a1b4d019aa8af39730d1ad7c3d',
      name: DEPOSIT,
      protocol: 'GNOSIS_SAFE',
    },
    {
      hash: '0x823eaf01002d7353fbcadb2ea3305cc46fa35d799cb0914846d185ac06f8ad05',
      name: EXCHANGE,
    },
    { hash: '0x74594da9e31ee4068e17809037db37db496702bf7d8d63afe6f97949277d1609', name: BRIDGE_OUT },
    { hash: '0x7d7fb03518253ae01913536628b78d6d82e63e19b943aab5f4948356021259be', name: EXCHANGE },
    { hash: '0x28fd8a5dda29b4035905e0657f97244a0e0bef97951e248ed0f2c6878d6590c2', name: BRIDGE_OUT },
    { hash: '0x4ec90e965519d92681267467f775ada5bd214aa92c0dc93d90a5e880ce9ed026', name: CLAIM },
    { hash: '0x06239653922ac7bea6aa2b19dc486b9361821d37712eb796adfd38d81de278ca', name: DEPOSIT },
    { hash: '0xcd60aa75dea3072fbc07ae6d7d856b5dc5f4eee88854f5b4abf7b680ef8bc50f', name: EXCHANGE, priority: 1 },
    { hash: '0x0fbf06c058b90cb038a618f8c2acbf6145f8b3570fd1fa56abb8f0f3f05b36e8', name: WITHDRAW },
    { hash: '0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1', name: DEPOSIT },
    { hash: '0x7a53080ba414158be7ec69b987b5fb7d07dee101fe85488f0853ae16239d0bde', name: DEPOSIT },
    { hash: '0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67', name: EXCHANGE, priority: 1 },
    { hash: '0x40d0efd1a53d60ecbf40971b9daf7dc90178c3aadc7aab1765632738fa8b8f01', name: WITHDRAW },
    { hash: '0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65', name: UNWRAP, priority: -1 },
    { hash: '0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c', name: WRAP, priority: -1 },
    { hash: '0xde16772e5c4365a3057b0336ad2eef600c1aad8cd2b5b3146aded1c20da71866', name: WITHDRAW },
    {
      hash: '0x000000000000000000000000a90b298d05c2667ddc64e2a4e17111357c215dd2',
      name: APPROVE,
      protocol: 'METAMASK_CARD',
      priority: 105,
    },
    {
      hashes: [
        '0xafc4df6845a4ab948b492800d3d8a25d538a102a2bc07cd01f1cfa097fddcff6',
        '0xa123dc29aebf7d0c3322c8eeb5b999e859f39937950ed31056532713d0de396f',
        '0x32ed1a409ef04c7b0227189c3a103dc5ac10e775a15b785dcc510201f7c25ad3',
      ],
      name: BRIDGE_OUT,
      protocol: 'ACROSS',
    },
    {
      hashes: [
        '0x8ab9dc6c19fe88e69bc70221b339c84332752fdd49591b7c51e66bae3947b73c',
        '0x571749edf1d5c9599318cdbc4e28a6475d65e87fd3b2ddbe1e9a8d5e7a0f0ff7',
        '0x44b559f101f8fbcc8a0ea43fa91a05a729a5ea6e14a7c75aa750374690137208',
      ],
      name: BRIDGE_IN,
      protocol: 'ACROSS',
    },
    {
      hashes: [
        '0xe35dddd4ea75d7e9b3fe93af4f4e40e778c3da4074c9d93e7c6536f1e803c1eb',
        '0x0a0607688c86ec1775abcdbab7b33a3a35a6c9cde677c9be880150c231cc6b0b',
      ],
      name: BRIDGE_OUT,
      protocol: 'HOP',
    },
    {
      hashes: [
        '0x0c3d250c7831051e78aa6a56679e590374c7c424415ffe4aa474491def2fe705',
        '0x320958176930804eb66c2343c7343fc0367dc16249590c0f195783bee199d094',
        '0x9475cdbde5fc71fe2ccd413c82878ee54d061b9f74f9e2e1a03ff1178821502c',
      ],
      name: BRIDGE_IN,
      protocol: 'HOP',
    },
    {
      hashes: ['0x88fbf1dbc326c404155bad4643bd0ddadd23f0636929c66442f0433208b2c905'],
      name: BRIDGE_OUT,
      protocol: 'CONNEXT',
    },
    {
      hashes: ['0x8e5df24f8b9ac0e3455417a1d7060762388ce3c1d4941aa49dc1b61943031d32'],
      name: BRIDGE_IN,
      protocol: 'CONNEXT',
    },
    {
      hashes: ['0x8d3ee0df6a4b7e82a7f20a763f1c6826e6176323e655af64f32318827d2112d4'],
      name: BRIDGE_OUT,
      protocol: 'STARGATE_V1',
    },
    {
      hashes: ['0x2bd2d8a84b748439fd50d79a49502b4eb5faa25b864da6a9ab5c150704be9a4d'],
      name: BRIDGE_IN,
      protocol: 'STARGATE_V1',
    },
    {
      hashes: ['0x85496b760a4b7f8d66384b9df21b381f5d1b1e79f229a47aaf4c232edc2fe59a'],
      name: BRIDGE_OUT,
      protocol: 'STARGATE_V2',
    },
    {
      hashes: [
        '0x0036c98efcf9e6641dfbc9051f66f405253e8e0c2ab4a24dccda15595b7378c8',
        '0xefed6d3500546b29533b128a29e3a94d70788727f0507505ac12eaf2e578fd9c',
      ],
      name: BRIDGE_IN,
      protocol: 'STARGATE_V2',
    },
    {
      hashes: ['0x7e50569d26be643bda7757722291ec66b1be66d8283474ae3fab5a98f878a7a2'],
      name: BRIDGE_OUT,
      protocol: 'AXELAR',
    },
    {
      hashes: ['0x7c3aa10c5d96985be6de7d2e6fa79bdef95a95a9cb272f4113b3fe1ca89fedae'],
      name: BRIDGE_IN,
      protocol: 'AXELAR',
    },
    // { hash: '', },
    {
      hash: '0x0000000000000000000000009dd23a4a0845f10d65d293776b792af1131c7b30',
      name: APPROVE,
      protocol: 'METAMASK_CARD',
      priority: 105,
    },
    {
      hash: '0x2b627736bca15cd5381dcf80b0bf11fd197d01a037c52b927a881a10fb73ba61',
      name: DEPOSIT,
    },
    {
      hash: '0x3115d1449a7b732c986cba18244e897a450f61e1bb8d589cd2e69e6c8924f9f7',
      name: WITHDRAW,
    },
    {
      hash: '0xa534c8dbe71f871f9f3530e97a74601fea17b426cae02e1c5aee42c96c784051',
      name: REPAY,
    },
    {
      hash: '0xb3d084820fb1a9decffb176436bd02558d15fac9b0ddfed8c465bc7359d7dce0',
      name: BORROW,
    },
  ],
}

const createMethodIdMap = (determinants: DeterminantMap) => {
  return determinants.methodIds.reduce((map, item) => {
    if (item.id) {
      map[item.id] = { name: item.name, protocol: item.protocol, priority: item.priority }
    }
    if (item.ids) {
      item.ids.forEach((id) => {
        map[id] = { name: item.name, protocol: item.protocol, priority: item.priority }
      })
    }

    return map
  }, {} as MethodIdMap)
}

const createTopicHashMap = (determinants: DeterminantMap) => {
  return determinants.topics.reduce((map, item) => {
    if (item.hash) {
      map[item.topicsLength ? `${item.hash}#${item.topicsLength}` : item.hash] = {
        name: item.name,
        protocol: item.protocol,
        priority: item.priority,
      }
    }
    if (item.hashes) {
      item.hashes.forEach((hash) => {
        map[hash] = { name: item.name, protocol: item.protocol, priority: item.priority }
      })
    }

    return map
  }, {} as TopicHashMap)
}

const createContractAddressMap = (determinants: DeterminantMap) => {
  return determinants.contracts.reduce((map, item) => {
    if (item.addresses) {
      item.addresses.forEach((address) => {
        map[address.toLowerCase()] = {
          name: item.name,
          protocol: item.protocol,
          version: item.version,
          definingTrait: item.definingTrait,
        }
      })
    }
    if (item.address) {
      map[item.address.toLowerCase()] = {
        name: item.name,
        protocol: item.protocol,
        version: item.version,
        definingTrait: item.definingTrait,
      }
    }

    return map
  }, {} as ContractAddressMap)
}
// allows us to always keep trying to match if these actions are the current matched action

export const methodIdMap: MethodIdMap = createMethodIdMap(determinants)
export const topicHashMap: TopicHashMap = createTopicHashMap(determinants)
export const contractAddressMap: ContractAddressMap = createContractAddressMap(determinants)
