# tx-categorize

A library for categorizing and labeling blockchain transactions across multiple EVM-compatible networks.

## Overview

`tx-categorize` automatically identifies and categorizes blockchain transactions based on their characteristics (contract addresses, method IDs, event topics) to provide human-readable labels. It supports 38+ transaction categories including DeFi operations (swap, stake, lend), NFT interactions, bridging, governance, and more across 15+ blockchain networks.

## Installation

```bash
npm install tx-categorize
# or
yarn add tx-categorize
```

## Usage

```typescript
import { determineTransactionMetadataV5, initializeI18next, Language } from 'tx-categorize'

// Initialize localization (optional, defaults to English)
await initializeI18next(Language.ENGLISH)

// Categorize a transaction
const metadata = determineTransactionMetadataV5(transaction, chainId)

console.log(metadata)
// {
//   transactionType: 'EXCHANGE',
//   transactionCategory: 'Exchange',
//   transactionProtocol: 'UNISWAP_V2',
//   toAddressName: 'TO_UNISWAP_V2_ROUTER',
//   readable: 'Exchange via Uniswap V2'
// }
```

## Supported Categories

The library supports 38 transaction categories including:

- **DeFi Operations**: `EXCHANGE`, `STAKE`, `LENDING`, `BORROW`, `REPAY`, `DEPOSIT`, `WITHDRAW`
- **Token Operations**: `APPROVE`, `TRANSFER`, `WRAP`, `UNWRAP`, `MINT`, `CLAIM`
- **NFT Operations**: `NFT_EXCHANGE`, `NFT_APPROVE`, `NFT_TRANSFER`
- **Bridging**: `BRIDGE`, `BRIDGE_IN`, `BRIDGE_OUT`
- **Governance**: `VOTE`, `REGISTER`
- **ENS/Domains**: `DOMAIN_REGISTER`, `DOMAIN_RENEW`, `DOMAIN_TRANSFER`, `DOMAIN_RESOLVER_SET`
- **Other**: `PAYMENT`, `CONTRACT_CALL`, `STANDARD`, and more

## Supported Networks

- Ethereum
- Polygon
- BSC (Binance Smart Chain)
- Avalanche
- Arbitrum
- Optimism
- Base
- Linea
- Fantom
- Cronos
- Celo
- Aurora
- Moonbeam
- Moonriver

## How It Works

The categorization system uses a priority-based schema matching system:

1. **Contract Address Matching**: Identifies known protocol contracts (e.g., Uniswap Router, Compound cToken)
2. **Method ID Matching**: Matches transaction method signatures (first 4 bytes of calldata)
3. **Event Topic Matching**: Analyzes emitted event signatures in transaction logs
4. **Heuristic Rules**: Combines multiple signals using AND/OR logic for complex patterns

Higher priority schemas (priority: 50) take precedence over lower priority ones (priority: 10).

## Contributing a New Category

### Step 1: Add the Action Enum (if needed)

If you're introducing a completely new category type, add it to `src/enums.ts`:

```typescript
export enum Action {
  // ... existing actions
  YOUR_NEW_ACTION = 'YOUR_NEW_ACTION',
}
```

### Step 2: Add Localized Labels

Add human-readable labels for your new category in all supported languages. Start with English in `src/localization/locales/en/translation.json`:

```json
{
  "YOUR_NEW_ACTION": "Your New Action Label"
}
```

Then add translations to other locale files: `de`, `el`, `es`, `fr`, `hi`, `id`, `ja`, `ko`, `pt`, `ru`, `tl`, `tr`, `vi`, `zh`.

### Step 3: Create Schema Definition

Choose the appropriate schema type based on your categorization strategy:

#### Option A: Contract Address-Based Schema

For protocols with known, fixed contract addresses, add to `src/txSchemas/toAddressSchemas.ts`:

```typescript
export const yourProtocolContract: TransactionSchema<SchemaV2> = {
  schema: {
    key: 'toAddress',
    type: 'addresses',
    addresses: ['0x...', '0x...'], // Contract address(es)
  },
  meta: {
    name: 'TO_YOUR_PROTOCOL',
    priority: 20, // 10=low, 20=medium, 30=high, 50=very high
    type: 'TO',
    protocol: 'YOUR_PROTOCOL',
    excludeFromBuild: true,
  },
}
```

#### Option B: Method ID-Based Schema

For specific function calls, add to `src/txSchemas/evmCompatible.ts` or network-specific files:

```typescript
{
  schema: {
    key: 'methodId',
    type: 'methodId',
    methodId: ['0xabcdef12'], // Method signature hash
    and: ['TO_YOUR_PROTOCOL'], // Optional: require contract match
  },
  meta: {
    name: 'YOUR_PROTOCOL_ACTION',
    priority: 30,
    type: 'YOUR_NEW_ACTION',
    protocol: 'YOUR_PROTOCOL',
  },
}
```

#### Option C: Event Topic-Based Schema

For transactions identified by emitted events:

```typescript
{
  schema: {
    key: 'topics',
    type: 'topics',
    topics: ['0x...'], // Event signature hash
    and: ['TO_YOUR_PROTOCOL'], // Optional: require contract match
  },
  meta: {
    name: 'YOUR_PROTOCOL_ACTION',
    priority: 30,
    type: 'YOUR_NEW_ACTION',
    protocol: 'YOUR_PROTOCOL',
  },
}
```

#### Option D: Heuristic-Based Schema

For complex patterns, add to `src/txSchemas/heuristicMap.ts`:

```typescript
{
  schema: {
    key: 'heuristic',
    type: 'heuristic',
    id: 'YOUR_HEURISTIC',
    and: ['TO_YOUR_PROTOCOL', 'SOME_METHOD'],
    or: ['ALTERNATIVE_CONDITION'],
  },
  meta: {
    name: 'YOUR_PROTOCOL_ACTION',
    priority: 40,
    type: 'YOUR_NEW_ACTION',
    protocol: 'YOUR_PROTOCOL',
  },
}
```

### Step 4: Register Schema in Network Files

Add your schema to the appropriate network schema files (e.g., `src/txSchemas/ethereum.ts`):

```typescript
export const ethereumSchemas: Array<TransactionSchema<SchemaV2>> = [
  ...evmCompatibleSchemas,
  // ... existing schemas
  yourProtocolContract,
]
```

For multi-chain protocols, add to multiple network files or to `evmCompatible.ts`.

### Step 5: Test Your Category

Use the debugging script to test your new category:

```bash
# Test with a transaction hash
yarn categorize <tx_hash> <chain_id>

# Example:
yarn categorize 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef 1
```

### Step 6: Add Test Cases

Add test cases in `src/txCategorize.test.ts`:

```typescript
{
  txHash: '0x...',
  chainId: ChainId.ETHEREUM,
  expectedResult: {
    transactionType: 'YOUR_NEW_ACTION',
    transactionProtocol: 'YOUR_PROTOCOL',
  },
}
```

### Step 7: Run Tests

```bash
yarn test
```

## Priority Guidelines

- **Priority 10**: Generic contract identifiers (DEX routers, token contracts)
- **Priority 20**: Specific protocol contracts
- **Priority 30**: Protocol-specific method calls
- **Priority 40**: Complex heuristic combinations
- **Priority 50**: Highly specific patterns (method + contract + events)

Higher priority schemas override lower priority ones when multiple matches occur.

## Development Scripts

### `yarn categorize <tx_hash> [chain_id]`

Debug tool to categorize a specific transaction and see why it was categorized that way.

```bash
yarn categorize 0x1234... 1
```

### `yarn list:metrics`

Generate lists of unique items (contracts, method IDs, topics) for analysis.

```bash
yarn list:metrics
```

### `yarn test`

Run the test suite.

```bash
yarn test
```

### `yarn build`

Build the package for distribution.

```bash
yarn build
```

## Finding Method IDs and Topic Hashes

### Method IDs

Method IDs are the first 4 bytes of the keccak256 hash of the function signature:

```javascript
// Example: "swapExactTokensForTokens(uint256,uint256,address[],address,uint256)"
// Method ID: 0x38ed1739
```

You can find method IDs on:
- [4byte.directory](https://www.4byte.directory/)
- [Etherscan](https://etherscan.io/) transaction details
- Block explorers for other chains

### Event Topics

Event topics are keccak256 hashes of event signatures:

```javascript
// Example: "Swap(address,uint256,uint256,uint256,uint256,address)"
// Topic Hash: 0xd78ad95f...
```

Find topic hashes in:
- Transaction logs on block explorers
- [Ethereum Event Signatures](https://www.4byte.directory/event-signatures/)

## Localization

The library supports 15 languages. To add a new language:

1. Create a new folder in `src/localization/locales/`
2. Add a `translation.json` file with all Action enum translations
3. Add the language to the `Language` enum in `src/localization/index.ts`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-category`)
3. Make your changes following the steps above
4. Add tests for your changes
5. Run tests and linting (`yarn test && yarn lint`)
6. Commit your changes (`git commit -am 'Add support for XYZ protocol'`)
7. Push to the branch (`git push origin feature/new-category`)
8. Open a Pull Request

## License

ISC

## Links

- **npm**: https://www.npmjs.com/package/tx-categorize
- **Repository**: https://github.com/MetaMask/tx-categorize
