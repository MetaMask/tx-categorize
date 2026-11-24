# tx-categorize

A library for categorizing and labeling blockchain transactions across multiple EVM-compatible networks.

## Overview

`tx-categorize` automatically identifies and categorizes blockchain transactions based on their characteristics (contract addresses, method IDs, event topics) to provide human-readable labels. It defines 42 action categories (see `src/enums.ts`) including DeFi operations (swap, stake, lend), NFT interactions, bridging, governance, and more.

## Installation

```bash
npm install @metamask/tx-categorize
# or
yarn add @metamask/tx-categorize
```

## Usage

```typescript
import { determineTransactionMetadataV6, initializeI18nextV2, Language } from '@metamask/tx-categorize'

// Initialize the localized labels once (optional, defaults to English)
await initializeI18nextV2(Language.en)

// `transaction` is a transaction from the MetaMask Primitives API (including logs and value transfers).
// `subjectAddress` is a CAIP-10 account id: the labels are written from this account's perspective.
const metadata = determineTransactionMetadataV6(
  { transaction, subjectAddress: `eip155:${chainId}:${address}` },
  Language.en,
)

console.log(metadata)
// {
//   transactionProtocol: 'ERC_20',
//   transactionCategory: 'TRANSFER',
//   transactionType: 'ERC_20_TRANSFER',
//   readable: 'Sent USDC',
//   readableExtended: 'Sent 50 USDC'
// }
```

`readable` omits amounts; `readableExtended` includes them.

The older `determineTransactionMetadata` (V1), `determineTransactionMetadataV2`, `determineTransactionMetadataV3` and `determineTransactionMetadataV5` functions are still exported for compatibility. New code should use V6.

## Supported Categories

The library defines 42 action categories. Examples:

- **DeFi Operations**: `EXCHANGE`, `STAKE`, `LENDING`, `BORROW`, `REPAY`, `DEPOSIT`, `WITHDRAW`
- **Token Operations**: `APPROVE`, `TRANSFER`, `WRAP`, `UNWRAP`, `MINT`, `CLAIM`
- **NFT Operations**: `NFT_EXCHANGE`, `NFT_APPROVE`, `NFT_TRANSFER`
- **Bridging**: `BRIDGE`, `BRIDGE_DEPOSIT`, `BRIDGE_WITHDRAW`
- **Governance**: `VOTE`, `REGISTER`
- **ENS/Domains**: `DOMAIN_REGISTER`, `DOMAIN_RENEW`, `DOMAIN_TRANSFER`, `DOMAIN_RESOLVER_SET`
- **Other**: `PAYMENT`, `CONTRACT_CALL`, `STANDARD`, and more

The full list is the `Action` enum in `src/enums.ts`.

## Supported Networks

`determineTransactionMetadataV6` is not tied to a specific chain. The chain only decides which transaction is fetched and the `eip155:<chainId>` prefix of the subject address.

The legacy V2/V3 functions use chain-specific schema sets (see `src/constants.ts`). Those schema sets are not currently loaded correctly, so avoid the V2/V3 functions until that is fixed.

## How It Works

The categorization system matches each transaction on three dimensions:

1. **Contract Address Matching**: Identifies known protocol contracts (e.g., Uniswap Router, Compound cToken)
2. **Method ID Matching**: Matches transaction method signatures (first 4 bytes of calldata)
3. **Event Topic Matching**: Analyzes emitted event signatures in transaction logs

Each method ID and topic entry has a numeric `priority`. When several entries match, the highest priority sets the action. See [Priority Guidelines](#priority-guidelines).

## Contributing a New Category

The steps below are a summary. For the full walkthrough, including field reference and examples, see [ADDING_TX_COVERAGE.md](ADDING_TX_COVERAGE.md).

### Step 1: Add the Action Enum (if needed)

If you're introducing a completely new category type, add it to `src/enums.ts`:

```typescript
export enum Action {
  // ... existing actions
  YOUR_NEW_ACTION = 'YOUR_NEW_ACTION',
}
```

### Step 2: Add Localized Labels

V6 labels come from the V2 locale files. Add the template to the English source first, then to the other languages:

- `src/localizationV2/locales/en/translation.json` (source)
- `src/localizationV2/locales/<code>/translation.json` for each other language

Templates use `$variables` such as `$sent_assets_0_value` and `$sent_assets_0_ticker`. Keep the placeholders unchanged in every language. The V1 files in `src/localization/` are only used by the legacy V1/V5 functions.

```json
{
  "YOUR_NEW_ACTION": "Your New Action Label with $sent_assets_0_value $sent_assets_0_ticker"
}
```

### Step 3: Add Heuristic Entries

V6 matches on the maps built from the `determinants` object in `src/txSchemas/heuristicMap.ts`:

- `contracts`: contract addresses, mapped to a protocol and contract name
- `methodIds`: 4-byte function selectors, mapped to an `Action`
- `topics`: event topic hashes, mapped to an `Action`

Add your entries there. See [ADDING_TX_COVERAGE.md](ADDING_TX_COVERAGE.md) for the field reference and examples.

### Step 4: Add Test Cases

Register the expected `transactionType` and a tx hash in `txTestCases` (Ethereum) or `lineaTxTestCases` (Linea) in `src/testCases.mock.ts`:

```typescript
export const txTestCases = {
  // ... existing entries
  YOUR_PROTOCOL_ACTION: '0x...',
}
```

The first run records the Primitives API response to `test-fixtures/nock/`. See [ADDING_TX_COVERAGE.md](ADDING_TX_COVERAGE.md#4b-record-the-nock-fixture).

### Step 5: Check the Category

Use the debugging script to see how a transaction is categorized:

```bash
# Test with a transaction hash
yarn categorize <tx_hash> [chain_id] [subject_address]

# Example:
yarn categorize 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef 1
yarn categorize 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef 1 0xYourAddress
```

### Step 6: Run Tests

From the repo root:

```bash
yarn test
yarn lint
```

## Priority Guidelines

Each `methodIds` and `topics` entry has a numeric `priority` (default `0`). When several entries match, only a higher priority overwrites the action and protocol already found. Contract-address matches count as priority `0`.

Negative priorities mark generic fallbacks, such as plain ERC-20 and ERC-721 events. A transaction that only matches those resolves to `CONTRACT_CALL` (or `STANDARD` for plain transfers). See [ADDING_TX_COVERAGE.md](ADDING_TX_COVERAGE.md#priority-system) for details.

## Development Scripts

### `yarn categorize <tx_hash> [chain_id] [subject_address]`

Debug tool to categorize a specific transaction and see why it was categorized that way.

```bash
# Basic usage (defaults to chain_id=1, subject=transaction.from)
yarn categorize 0x1234...

# Specify chain ID
yarn categorize 0x1234... 137

# Specify a subject address (to see categorization from that address's perspective)
yarn categorize 0x1234... 1 0x5197b5b062288bbf29008c92b08010a92dd677cd
```

You can also set the `SUBJECT_ADDRESS` environment variable to avoid passing it each time:

```bash
export SUBJECT_ADDRESS=0x5197b5b062288bbf29008c92b08010a92dd677cd
yarn categorize 0x1234...
```

Set `CATEGORIZE_LANGUAGE` to choose the language of the `readable` / `readableExtended` labels (defaults to `en`):

```bash
CATEGORIZE_LANGUAGE=es yarn categorize 0x1234... 1
```

> **Note:** The subject address determines perspective. If the subject is the sender, the transaction may read "Sent 1 ETH". If the subject is the recipient, it reads "Received 1 ETH". Without a subject address, it defaults to `transaction.from`.

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

The library ships 15 languages: `de`, `el`, `en`, `es`, `fr`, `hi`, `id`, `ja`, `ko`, `pt`, `ru`, `tl`, `tr`, `vi`, `zh`.

There are two separate i18next setups:

- **V6** uses `localizationV2` (`initializeI18nextV2`). This is the one that produces `readable` labels.
- **Legacy V1/V5** use `localization` (`initializeI18next`).

To add a language:

1. Create `src/localizationV2/locales/<code>/translation.json` with every key from the `en` file. If the language should also work with the legacy functions, add `src/localization/locales/<code>/translation.json` too.
2. Add the language to the `Language` enum in `src/localization/index.ts`.

The V2 interpolation test runs over every `Language` value, so it fails if a translation is missing a placeholder.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-category`)
3. Make your changes following the steps above
4. Add tests for your changes
5. Run tests and linting from the repo root (`yarn test && yarn lint`)
6. Commit your changes (`git commit -am 'Add support for XYZ protocol'`)
7. Push to the branch (`git push origin feature/new-category`)
8. Open a Pull Request

## License

ISC

## Links

- **npm**: https://www.npmjs.com/package/@metamask/tx-categorize
- **Repository**: https://github.com/MetaMask/tx-categorize
