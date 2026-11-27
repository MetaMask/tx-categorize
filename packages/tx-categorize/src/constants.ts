export const titlecaseExceptions: Record<string, string> = {
  METAMASK: 'MetaMask',
  SUSHISWAP: 'SushiSwap',
  OPENSEA: 'OpenSea',
  ENS: 'ENS',
  ERC: 'ERC',
  WETH: 'WETH',
}

// Threshold for categorizing a transaction as "dust". If the value transferred in a transaction is less than this threshold, it may be categorized as "dust" or "spam".
export const DUST_THRESHOLD_WEI = BigInt('100000000000000')
