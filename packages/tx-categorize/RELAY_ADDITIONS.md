# Relay Protocol Categorization

This document describes the heuristic entries added to support Relay protocol transaction categorization.

---

## Transactions Added

| `transactionType` | Tx Hash | Chain ID |
|---|---|---|
| `RELAY_DEPOSIT` | `0x192864a3610133e9943a1ca394355fcf583df8fa45fb1b6a106e9d42e0e8bb80` | 1 |
| `RELAY_WITHDRAW` | `0x7a4cdf9812e5ff488692fd668a89a809229965e281d07295aa33e946b8d8c553` | 1 |

---

## Heuristic Entries

### Contract Address

```ts
{ address: '0x48db9302bb52a97b6cc8a5d0695c487d76540159', name: 'RELAY', protocol: 'RELAY' }
```

This registers the Relay contract address so that any transaction sent directly to it sets `transactionProtocol = 'RELAY'` and `toAddressName = 'RELAY'`.

### Method ID

```ts
{ id: '0xe9ae5c53', name: Action.DEPOSIT, protocol: 'RELAY', priority: 2 }
```

Used by `RELAY_DEPOSIT`. The transaction's `toAddress` is the Relay contract, so the contract address match sets the protocol. The method ID `0xe9ae5c53` then resolves the action to `DEPOSIT` at priority 2, overriding lower-priority generic method matches.

### Topic Hash

```ts
{
  hash: '0x00000000000000000000000048db9302bb52a97b6cc8a5d0695c487d76540159',
  name: Action.WITHDRAW,
  protocol: 'RELAY',
  priority: 100,
}
```

Used by `RELAY_WITHDRAW`. This transaction does **not** target the Relay contract directly — its `toAddress` is the mUSD token contract (`0xaca92e438df0b2401ff60da7e4337b687a2435da`) and its method ID is `0x23b872dd` (`transferFrom`), which is too generic. Instead, the Relay contract address appears as an indexed parameter in the ERC-20 `Transfer` event log (the `to` field of the transfer), which surfaces as a padded topic:

```
0x00000000000000000000000048db9302bb52a97b6cc8a5d0695c487d76540159
```

Matching on this topic at priority 100 overrides the generic `transferFrom` → `TRANSFER` method ID match (priority 99), resolving the transaction as `RELAY_WITHDRAW`. This is the same pattern used to identify `METAMASK_CARD` transactions.

---

## How Categorization Works

`txCategorizeV6` evaluates three dimensions in order:

1. **Contract address** — if `toAddress` is the Relay contract, sets `protocol = 'RELAY'`
2. **Method ID** — if a method ID entry matches, sets the action (and optionally overrides the protocol)
3. **Topic hashes** — if the above is insufficient (missing protocol, missing category, or priority < 0), iterates all event topics from the transaction logs and checks each against the topic hash map

For `RELAY_DEPOSIT`, steps 1 and 2 are sufficient.  
For `RELAY_WITHDRAW`, step 3 is required because the Relay contract is not the `toAddress`.

The final `transactionType` is assembled as:

```
{PROTOCOL}_{DEFINING_TRAIT_}{VERSION_}{ACTION}
```

Both transactions produce types with no trait or version, so the result is simply `RELAY_DEPOSIT` and `RELAY_WITHDRAW`.
