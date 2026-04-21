# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.2]

### Uncategorized

- feat: balancer stake ([#39](https://github.com/MetaMask/tx-categorize/pull/39))
- feat: metamaskstake stake ([#37](https://github.com/MetaMask/tx-categorize/pull/37))
- feat: convex claim ([#35](https://github.com/MetaMask/tx-categorize/pull/35))
- feat: aave stake label ([#34](https://github.com/MetaMask/tx-categorize/pull/34))
- feat: curve deposit ([#33](https://github.com/MetaMask/tx-categorize/pull/33))

## [2.0.1]

### Added

- Added claim bonus txs ([#31](https://github.com/MetaMask/tx-categorize/pull/31))
- Increase test coverage ([#29](https://github.com/MetaMask/tx-categorize/pull/29))

### Changed

- Improvements for standard txs ([#30](https://github.com/MetaMask/tx-categorize/pull/30))

## [2.0.0]

## [1.0.0]

### Added

- APIPLAT-2189 - Interpolation for asset symbol/quantity readable labels ([#22](https://github.com/MetaMask/tx-categorize/pull/22))
- Add uniswap v4 position manager addresses ([#20](https://github.com/MetaMask/tx-categorize/pull/20))
- Record and replay tx-categorize API fixtures with nock ([#21](https://github.com/MetaMask/tx-categorize/pull/21))

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

[Unreleased]: https://github.com/MetaMask/tx-categorize/compare/v2.0.2...HEAD
[2.0.2]: https://github.com/MetaMask/tx-categorize/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/MetaMask/tx-categorize/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/MetaMask/tx-categorize/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/MetaMask/tx-categorize/compare/v0.1.0...v1.0.0
[0.1.0]: https://github.com/MetaMask/tx-categorize/releases/tag/v0.1.0
