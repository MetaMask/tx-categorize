# tx-categorize: V5 → V6 Migration Guide

## Overview

V6 introduces **subject-address-aware categorization** and **enriched readable strings** with asset details (values, tickers) interpolated directly into human-readable transaction descriptions.

---

## Breaking Changes

### 1. New Required Input: `subjectAddress`

V5 takes only the transaction object. V6 additionally requires a CAIP-10 account ID to determine which value transfers are "sent" vs "received" from the user's perspective.

```typescript
// V5
determineTransactionMetadataV5({
  transaction: txData,
}, Language.en)

// V6
determineTransactionMetadataV6({
  transaction: txData,
  subjectAddress: 'eip155:1:0xabc...', // CaipAccountId
}, Language.en)
```

### 2. Separate Localization System (localizationV2)

V6 uses a new `localizationV2` module with template-based locale files. The original `localization` module is unchanged and continues to serve V5.

```typescript
// V5 initialization
import { initializeI18next } from './localization'
await initializeI18next(Language.en)

// V6 initialization
import { initializeI18nextV2 } from './localizationV2'
await initializeI18nextV2(Language.en)
```

Both can be initialized simultaneously — they are independent i18next instances.

### 3. Enriched Readable Strings

V5 readable strings use simple label/verb patterns:
```
"Uniswap V3: Exchange"
"Token: Transfer"
"Aave V3: Deposit"
```

V6 readable strings include interpolated asset details:
```
"Uniswap V3: Swapped 1.5 ETH for 2800 USDC"
"Token: Transferred 0.0044 MKR"
"Aave V3: Deposited 1000 USDC"
```

When asset data is unavailable, the template gracefully degrades to just the verb (e.g., `"Swapped for"` or `"Deposited"`).

### 4. Strongly-Typed `transactionCategory`

V5 uses plain strings for `transactionCategory`. V6 uses the `Action` enum.

```typescript
// V5: TxMetadata
{ transactionCategory?: string }

// V6: TxMetadataV6
{ transactionCategory?: Action }
```

---

## New Features

### Multi-Asset Aware Readable Strings

V6 detects when a transaction involves multiple sent or received assets and selects richer templates:

| Scenario | Template Used |
|----------|---------------|
| 1 sent → 1 received | `"Swapped 1 ETH for 2800 USDC"` |
| 1 sent → 2+ received | `"Swapped 1 ETH for 2800 DAI and 200 USDC"` |
| 2+ sent → 1 received | `"Swapped 1 ETH and 500 DAI for 2800 USDC"` |
| 2+ deposited | `"Deposited 1 ETH and 500 DAI"` |
| 2+ withdrawn | `"Withdrew 100 USDC and 0.5 ETH"` |

This refinement affects **only** the readable string — `transactionType` and `transactionCategory` remain unchanged from V5's behavior.

### Spender Extraction for Approvals

V6 extracts the spender address from `approve(address,uint256)` calls and includes it in the readable:
```
"Token: Approved 0x68b3...fc45 to spend 1000 USDC"
```

### Value Transfer Splitting

V6 splits `transaction.valueTransfers` into `sentAssets` and `receivedAssets` arrays based on the `subjectAddress`, enabling directional asset display.

---

## What Didn't Change

- **Categorization logic** — The heuristic matching pipeline (contract address → method ID → topic hash) is identical.
- **`transactionType` format** — Same `PROTOCOL_TRAIT_VERSION_CATEGORY` string pattern.
- **Heuristic maps** — `contractAddressMap`, `methodIdMap`, `topicHashMap` are shared between V5 and V6.
- **V5 localization** — The `localization/` folder and all its locale files are untouched.

---

## Type Reference

```typescript
// V5 input
interface DetermineTransactionMetadataInputV5 {
  transaction: Transaction
}

// V6 input
interface DetermineTransactionMetadataInputV6 {
  transaction: Transaction
  subjectAddress: CaipAccountId  // e.g. 'eip155:1:0xabc...'
}

// V5 output
interface TxMetadata {
  transactionType?: string
  transactionCategory?: string      // plain string
  transactionProtocol?: string
  toAddressName?: string
  readable?: string                  // "Protocol: Label"
}

// V6 output
interface TxMetadataV6 {
  transactionType?: string
  transactionCategory?: Action       // Action enum
  transactionProtocol?: string
  toAddressName?: string
  readable?: string                  // "Protocol: Verb amount ticker..."
}
```

---

## Template System

V6 readable strings are driven by `ACTION_TEMPLATES` — a map of Action → template string with `$variable` placeholders:

```
$sent_assets_0_value     — formatted value of first sent asset
$sent_assets_0_ticker    — symbol of first sent asset
$received_assets_1_value — formatted value of second received asset
$spender                 — spender address (APPROVE only)
$approved_assets_0_value — approved amount (APPROVE only)
```

Templates are also stored in `localizationV2/locales/{lng}/translation.json` for per-language customization via Crowdin.
