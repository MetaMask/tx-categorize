# Transaction Categorize

A TypeScript library for categorizing blockchain transactions across multiple networks including Ethereum, Polygon, BSC, Arbitrum, Optimism, Avalanche, and more.

## Features

- **Multi-chain Support**: Supports 14+ blockchain networks
- **Transaction Categorization**: Categorizes transactions by type (DeFi, NFT, Bridge, etc.)
- **Localization**: Multi-language support for transaction descriptions
- **Bloom Filter Optimization**: Efficient transaction matching using bloom filters
- **TypeScript Support**: Full TypeScript definitions included

## Installation

```bash
npm install @metamask/tx-categorize
# or
yarn add @metamask/tx-categorize
```

## Usage

### Basic Usage

```typescript
import {
  determineTransactionMetadataV5,
  ChainId,
} from '@metamask/tx-categorize';

const transaction = {
  toAddress: '0xA0b86a33E6441b8C4C8C0C4C0C4C0C4C0C4C0C4C',
  methodId: '0xa9059cbb',
  topics: [
    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
  ],
  logs: [
    {
      address: '0xA0b86a33E6441b8C4C8C0C4C0C4C0C4C0C4C0C4C',
      topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      ],
      data: '0x...',
      logIndex: 0,
    },
  ],
};

const result = determineTransactionMetadataV5({
  transaction,
});

console.log(result);
// Output: { transactionCategory: 'TRANSFER', transactionProtocol: 'ERC_20', ... }
```

### With Chain ID

```typescript
import { determineTransactionMetadata, ChainId } from '@metamask/tx-categorize';

const result = determineTransactionMetadata({
  chainId: ChainId.ETHEREUM,
  transaction: {
    toAddress: '0x...',
    methodId: '0x...',
    // ... other transaction data
  },
});
```

### Localization

```typescript
import { initializeI18next, Language } from '@metamask/tx-categorize';

// Initialize with specific language
await initializeI18next(Language.EN);

// Use localized descriptions
const result = determineTransactionMetadataV5({
  transaction,
  language: Language.EN,
});
```

## Supported Networks

- Ethereum (1)
- Polygon (137)
- BSC (56)
- Arbitrum (42161)
- Optimism (10)
- Avalanche (43114)
- Fantom (250)
- Celo (42220)
- Cronos (25)
- Aurora (1313161554)
- Moonbeam (1284)
- Moonriver (1285)
- Base (8453)
- Linea (59144)

## Transaction Categories

The library categorizes transactions into various types including:

- **DeFi Operations**: APPROVE, BORROW, REPAY, DEPOSIT, WITHDRAW
- **NFT Operations**: NFT_EXCHANGE, NFT_APPROVE, NFT_TRANSFER
- **Bridge Operations**: BRIDGE_IN, BRIDGE_OUT
- **Staking**: STAKE, UNSTAKE
- **Exchange**: EXCHANGE, DEPOSIT_EXCHANGE_WITHDRAW
- **Standard**: TRANSFER, CONTRACT_CALL

## Development

### Scripts

There are 2 utility scripts in this repository:

1. **List Metrics**: `yarn list:metrics` - Fetches lists of unique items for analysis
2. **Debug Categorization**: `yarn categorize <tx_hash> <chain_id>` - Helps debug why a transaction is categorized in a specific way

### Building

```bash
yarn build
```

### Testing

```bash
yarn test
yarn test:cov  # with coverage
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
