# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0]

## [1.0.0]

### Uncategorized

- fix: lint
- APIPLAT-2189 - feat: interpolation for asset symbol/quantity readable labels ([#22](https://github.com/MetaMask/tx-categorize/pull/22))
- fix: mark async fn as async
- feat: add uniswap v4 position manager addresses ([#20](https://github.com/MetaMask/tx-categorize/pull/20))
- fix: strip trailing zeroes
- fix: requested changes
- fix: updated
- fix: clean up
- feat: adding some new handling in v6 for compound categories
- chore: clean up utils
- chore: clean up
- feat: interpolation for asset symbol/quantity readable labels
- feat: record and replay tx-categorize API fixtures with nock ([#21](https://github.com/MetaMask/tx-categorize/pull/21))

## [0.1.0]

### Uncategorized

- Fix changelog and version: update changelog formatting and synchronize version numbers for release notes

### Added

- Initial release of @metamask/tx-categorize
- Transaction categorization engine supporting multiple EVM chains
- Bloom filter optimization for efficient method ID and topic lookups
- Support for 15+ blockchain networks (Ethereum, Polygon, Arbitrum, Optimism, etc.)
- Multi-language localization support (15 languages)
- Comprehensive transaction schemas including DeFi, NFT, and token operations
- Heuristic-based fallback categorization

[Unreleased]: https://github.com/MetaMask/tx-categorize/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/MetaMask/tx-categorize/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/MetaMask/tx-categorize/compare/v0.1.0...v1.0.0
[0.1.0]: https://github.com/MetaMask/tx-categorize/releases/tag/v0.1.0
