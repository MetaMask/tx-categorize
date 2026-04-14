# Adding Transaction Categorization Coverage in txCategorizeV6

This document explains how to add categorization coverage for a new transaction type by providing a **tx hash**, **network/protocol**, and **action** (category).

---

## Overview

`txCategorizeV6` categorizes on-chain transactions by matching three heuristic dimensions:

| Dimension | Source Map | Matches On |
|---|---|---|
| **Contract address** (`toAddress`) | `contractAddressMap` | The `toAddress` of the transaction |
| **Method ID** | `methodIdMap` | The 4-byte function selector (`methodId`) |
| **Topic hash** | `topicHashMap` | Event topic hashes from transaction logs |

These maps are built from the `determinants` object in `src/txSchemas/heuristicMap.ts`. A match sets the transaction's **protocol** (e.g. `UNISWAP_V3`) and **action/category** (e.g. `EXCHANGE`), which combine into a `transactionType` string like `UNISWAP_V3_EXCHANGE`.

### Priority System

Each method ID and topic hash entry has an optional `priority` number. When multiple matches occur, only higher-priority values overwrite lower ones. Contract address matches default to priority `0`. Negative priorities (e.g. generic ERC-20 events) are treated as fallback and will resolve to `GENERIC_CONTRACT_CALL` if nothing better is found.

---

## Step-by-Step Guide

### 1. Identify the Transaction

Gather the following:

- **Transaction hash** — e.g. `0xabcd...1234`
- **Chain ID** — the numeric network ID (see `src/networks.ts` for the `ChainId` enum, e.g. `1` = Ethereum, `59144` = Linea)
- **Expected action** — the `Action` enum value the transaction should resolve to (see `src/enums.ts`)
- **Protocol name** — the protocol label (e.g. `UNISWAP`, `AAVE_V3`, `METAMASK`)

### 2. Fetch & Inspect the Transaction

Use the existing CLI script to see how the transaction is currently categorized:

```bash
# Build first if needed
npm run build

# Run categorization (defaults to chainId=1 for Ethereum)
cd packages/tx-categorize && node scripts/categorize.js <TX_HASH> [CHAIN_ID]

# Example
node scripts/categorize.js 0x44a1faab681089c603eb0dbc2f5d59737a92b0b739d1250f9d598d13a779425c 1
```

This calls the MetaMask Primitives API to fetch the transaction (with logs and value transfers), then runs `determineTransactionMetadataV6` with `log: true` so you can see each matching step in the console output.

### 3. Add Heuristic Map Entries

Edit `src/txSchemas/heuristicMap.ts` and add entries to the `determinants` object based on what identifies your transaction.

#### 3a. Contract Address (Protocol Identification)

If the transaction targets a new contract address, add it to the `contracts` array:

```ts
// Single address
{ address: '0x...', name: 'MY_PROTOCOL_ROUTER', protocol: 'MY_PROTOCOL', version: 'V1' },

// Multiple addresses for the same contract
{
  addresses: ['0x...aaa', '0x...bbb'],
  name: 'MY_PROTOCOL_ROUTER',
  protocol: 'MY_PROTOCOL',
  version: 'V2',
},
```

Fields:
- `address` / `addresses` — contract address(es), lowercase
- `name` — a descriptive label for the contract (used as `toAddressName`)
- `protocol` — the protocol identifier (becomes `transactionProtocol`)
- `version` (optional) — version suffix included in `transactionType`
- `definingTrait` (optional) — a trait like `DOMAIN`, `BRIDGE`, `GOVERNANCE` inserted into `transactionType`

#### 3b. Method ID (Action by Function Selector)

If the transaction uses a specific method ID, add it to the `methodIds` array:

```ts
{ id: '0x12345678', name: Action.EXCHANGE, protocol: 'MY_PROTOCOL', priority: 2 },
```

- `id` — the 4-byte function selector
- `name` — the `Action` enum value
- `protocol` (optional) — overrides protocol if no contract match
- `priority` (optional, default `0`) — higher priority wins

#### 3c. Topic Hash (Action by Event Log)

If the transaction emits a specific event, add it to the `topics` array:

```ts
{ hash: '0xabcdef...', name: Action.DEPOSIT, protocol: 'MY_PROTOCOL', priority: 2 },

// Topic with length qualifier (distinguishes ERC-20 vs ERC-721 Transfer events)
// The format is `<topicHash>#<topicCount>` and is auto-generated at runtime
```

- `hash` / `hashes` — the event topic hash(es)
- `name` — the `Action` enum value
- `protocol` (optional)
- `priority` (optional)
- `topicsLength` (optional) — used to differentiate events with the same topic0 but different numbers of indexed params

### 4. Add a Test Case

#### 4a. Register the Expected Type in `testCases.mock.ts`

Add your expected `transactionType` → tx hash mapping to either `txTestCases` (Ethereum) or `lineaTxTestCases` (Linea) in `src/testCases.mock.ts`:

```ts
export const txTestCases = {
  // ... existing entries
  MY_PROTOCOL_V1_EXCHANGE: '0xabcd...1234',
}
```

The key is the **expected `transactionType`** string. It is constructed as:

```
{PROTOCOL}_{DEFINING_TRAIT_}{VERSION_}{ACTION}
```

For example:
- `UNISWAP_V3_EXCHANGE`
- `ENS_DOMAIN_REGISTER`
- `METAMASK_BRIDGE_V1_BRIDGE_OUT`
- `ERC_20_TRANSFER`

#### 4b. Record the Nock Fixture

The test suite uses [nock-back](https://github.com/nock/nock#nock-back) to record and replay HTTP responses from the Primitives API. Fixture files are stored in `test-fixtures/nock/` with the naming convention:

```
{chainId}-{txHash}.json
```

To record a new fixture:

1. Ensure you have network access
2. Set the nock mode to `record` (this is the default in the test):
   ```bash
   NOCK_BACK_MODE=record npx jest --no-coverage src/txCategorize.test.ts
   ```
3. The fixture file (e.g. `1-0xabcd...1234.json`) will be created automatically in `test-fixtures/nock/`
4. Once recorded, subsequent test runs replay from the fixture (no network needed)

#### 4c. Run the Tests

```bash
# Run just the categorization tests
npx jest --no-coverage src/txCategorize.test.ts

# Run all tests
npx jest --no-coverage
```

The V6 test iterates over every entry in `txTestCases` / `lineaTxTestCases`, fetches the transaction via the nock fixture, calls `determineTransactionMetadataV6`, and asserts:

```ts
expect(`${result.transactionType}-${data.hash}`).toBe(`${expectedType}-${data.hash}`)
```

### 5. Verify the Readable Label

V6 also generates a human-readable `readable` string using localized templates from `localizationV2`. The format is:

```
{Protocol} {Trait}: {Localized Action Template}
```

For example: `Token: Transferred 0.0044 MKR` or `Uniswap V3: Swapped 1.5 ETH for 3000 USDC`.

If your new action requires a new template, add it in `src/localizationV2/locales/`.

---

## Quick Reference: Supported Actions

All actions are defined in the `Action` enum at `src/enums.ts`:

| Action | Description |
|---|---|
| `APPROVE` | Token approval |
| `BORROW` | Lending protocol borrow |
| `BRIDGE_IN` / `BRIDGE_OUT` | Cross-chain bridge |
| `CLAIM` | Reward/airdrop claim |
| `DEPOSIT` / `WITHDRAW` | Liquidity/staking deposit or withdrawal |
| `DOMAIN_REGISTER` / `DOMAIN_RENEW` | ENS domain operations |
| `EXCHANGE` | Token swap |
| `MINT` | Token/NFT mint |
| `NFT_EXCHANGE` / `NFT_TRANSFER` | NFT marketplace operations |
| `STAKE` | Staking |
| `TRANSFER` | Simple token transfer |
| `STANDARD` | Native ETH transfer (no logs, no methodId) |
| `CONTRACT_CALL` | Unidentified contract interaction |
| `WRAP` / `UNWRAP` | WETH wrap/unwrap |
| `VOTE` | Governance vote |
| `PAYMENT` | Payment (e.g. MetaMask Card) |
| `REPAY` | Loan repayment |
| `CANCEL_ORDER` | Order cancellation |

---

## Example: Adding a New Aave V3 Deposit

1. **Heuristic map** — Aave V3's pool contract and `supply` method (0x617ba037) are already registered. If they weren't, you would add:
   ```ts
   // contracts
   { address: '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2', name: 'AAVE_V3_POOL', protocol: 'AAVE', version: 'V3' }

   // methodIds
   { id: '0x617ba037', name: Action.DEPOSIT, protocol: 'AAVE', priority: 2 }
   ```

2. **Test case** — Add to `testCases.mock.ts`:
   ```ts
   AAVE_V3_DEPOSIT: '0x7fbf5276ab1f3c1b4a75e2ba1b5c34aa4744fe45c110c1626d613928f0d5529e',
   ```

3. **Record fixture** — Run with `NOCK_BACK_MODE=record` to capture the API response.

4. **Run tests** — `npx jest --no-coverage src/txCategorize.test.ts` and verify the assertion passes.

---

## Architecture Diagram

```
TX Hash + Chain ID
        │
        ▼
  Primitives API ──► { logs, toAddress, methodId, valueTransfers, ... }
        │
        ▼
  determineTransactionMetadataV6()
        │
        ├─► contractAddressMap[toAddress]  → protocol, toAddressName
        ├─► methodIdMap[methodId]          → action, protocol (override)
        └─► topicHashMap[topic]            → action, protocol (override)
              (iterate all log topics)
        │
        ▼
  transactionType = "{PROTOCOL}_{TRAIT_}{VERSION_}{ACTION}"
  readable = localized template with asset details
```
