# @codefi/metafi

MetaMask Curated Experiences (MMCX) Software Development Kit

## Setup
To set up the repo:
1. Install latest LTS version of [Node.js](https://nodejs.org)
2. Install [Yarn](https://yarnpkg.com) with [Corepack](https://yarnpkg.com/corepack)
   - Note: If you previously installed Yarn globally via npm, yarn, or homebrew, you will need to uninstall it first
3. Run `yarn` in the root directory to install dependencies 

## Build
- Run `yarn build` in the root directory to build all packages
- Run `yarn workspace <package-name> build` to build a specific package

## Testing
- Run `yarn test` in the root directory to run all tests
- Run `yarn workspace <package-name> test` to run tests for a specific package

## Linting
- Run `yarn lint` in the root directory to lint all packages
- Run `yarn workspace <package-name> lint` to lint a specific package
- Run `yarn lint:fix` in the root directory to fix linting issues

## Packages

This repository is a monorepo for the following packages

| **Package**                                              | **Version** | **Description**                                                                                                                  |
|:---------------------------------------------------------| :---------: |:---------------------------------------------------------------------------------------------------------------------------------|
| [`@codefi/metafi-common`](packages/common)               |             | Common parameters and utility function for MetaFi services <br />Ex: Chain parameters, network configurations, utility functions |
| [`@codefi/metafi-core`](packages/core)                   |             | MetaFi service clients. <br />Ex: Swap Api, Token Api, etc.                                                                      |
| [`@codefi/metafi-web3`](packages/web3)                   |             | Web3 service clients. <br />Ex: Coingecko, Etherscan, etc.                                                                       |
| **Experiences**                                          |             |                                                                                                                                  |
| [`@codefi/metafi-swap`](packages/swap)                   |             | A module that provides token Swap functionality                                                                                  |
| [`@codefi/metafi-account`](packages/account)             |             | A module that provides functionality for getting EVM account data such as balances, transactions, etc.                           |
| [`@codefi/metafi-eth-scan`](packages/eth-scan)           |             | A module that provides functionality for getting Ether and token balances                                                        |
| [`@codefi/metafi-tx-categorize`](packages/tx-categorize) |             | A module that provides functionality for categorize and label transactions                                                       |

## MetaFi Common

**Package:** [`@codefi/metafi-common`](packages/common)

### Supported Chains

- Ethereum
- BNB Smart Chain
- Polygon
- Avalanche

\*\* All supported chains testnets are included

## MetaFi Core

**Package:** [`@codefi/metafi-core`](packages/core)

### Supported MetaFi Services

- Token Api
- Gas Api
- Swap Api
- Transaction Api
- Transaction Insights Api
- Account Api
- Price Api

## MetaFi Web3

**Package:** [`@codefi/metafi-web3`](packages/web3)

### Supported Web3 Clients

- Aave
- Blockexplorer (Etherscan compatible)
- Coingecko
- Compound
- Covalent
- Debank
- Moralis
- OpenSea
- Rarible
