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

## Release & Publishing

This project follows MetaMask's standard release process with automated workflows.

📖 **[View the complete Release & Publishing Guide →](RELEASE.md)**

Quick commands:
- `yarn lint:changelog` - Validate changelog formatting

See [RELEASE.md](RELEASE.md) for detailed instructions on creating releases, managing changelogs, and publishing to npm.

## Packages

This repository is a monorepo for the following packages

| **Package**                                              | **Version** | **Description**                                                                                                                  |
|:---------------------------------------------------------| :---------: |:---------------------------------------------------------------------------------------------------------------------------------|

| [`@codefi/metafi-tx-categorize`](packages/tx-categorize) |             | A module that provides functionality for categorize and label transactions                                                       |

