import { createConfig, http, fallback } from '@wagmi/core'
import { base, celo, baseSepolia } from '@wagmi/core/chains'
import type { Chain } from 'wagmi/chains'

// @dev - Import from Wagmi related modules from the Reown AppKit
import { wagmiAdapter, projectId, networks } from '@/config'

// @dev - Chain ID for World Chain
export const WORLD_CHAIN_MAINNET_CHAIN_ID = 480;
export const WORLD_CHAIN_SEPOLIA_CHAIN_ID = 4801;

// @dev - Custom World Chain Mainnet
export const worldChain: Chain = {
  id: WORLD_CHAIN_MAINNET_CHAIN_ID,
  name: 'World Chain Mainnet',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://worldchain-mainnet.g.alchemy.com/public'] },
    public: { http: ['https://worldchain-mainnet.g.alchemy.com/public'] },
  },
  blockExplorers: {
    default: { name: 'World Scan Explorer', url: 'https://worldscan.org' },
  },
  testnet: true,
}

// @dev - Custom World Chain Sepolia
export const worldChainSepolia: Chain = {
  id: WORLD_CHAIN_SEPOLIA_CHAIN_ID,
  name: 'World Chain Sepolia',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://worldchain-sepolia.g.alchemy.com/public'] },
    public: { http: ['https://worldchain-sepolia.g.alchemy.com/public'] },
  },
  blockExplorers: {
    default: { name: 'World Scan Sepolia Explorer', url: 'https://sepolia.worldscan.org' },
  },
  testnet: true,
}

// @dev - Custom Celo Sepolia testnet chain
export const celoSepolia: Chain = {
  id: 11142220,
  name: 'Celo Sepolia',
  nativeCurrency: { name: 'Celo', symbol: 'CELO', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://forno.celo-sepolia.celo-testnet.org'] },
    public: { http: ['https://forno.celo-sepolia.celo-testnet.org'] },
  },
  blockExplorers: {
    default: { name: 'Celo Explorer', url: 'https://explorer.celo.org' },
  },
  testnet: true,
}

// Build Base transport with fallback RPCs to avoid rate limiting
const baseTransport = process.env.NEXT_PUBLIC_ALCHEMY_BASE_RPC_URL
  ? fallback([
      http(process.env.NEXT_PUBLIC_ALCHEMY_BASE_RPC_URL),
      http('https://mainnet.base.org'),
      http('https://base.llamarpc.com'),
      http('https://1rpc.io/base'),
    ])
  : fallback([
      http('https://mainnet.base.org'),
      http('https://base.llamarpc.com'),
      http('https://1rpc.io/base'),
      http('https://base.drpc.org'),
    ]);

// @dev - Wagmi Config
export const wagmiConfig = createConfig({
  chains: [base, celo, worldChain, baseSepolia, celoSepolia, worldChainSepolia], // Support Base, Celo, Base Sepolia and Celo Sepolia
  transports: {
    [base.id]: baseTransport,
    [celo.id]: http('https://forno.celo.org'),          // Celo mainnet RPC
    [worldChain.id]: http(process.env.NEXT_PUBLIC_WORLD_CHAIN_MAINNET_RPC_URL), // World Chain Mainnet RPC
    [baseSepolia.id]: http('https://sepolia.base.org'), // Base Sepolia testnet RPC
    [celoSepolia.id]: http(process.env.NEXT_PUBLIC_CELO_SEPOLIA_RPC_URL || 'https://forno.celo-sepolia.celo-testnet.org'), // Celo Sepolia testnet RPC (override via env)
    [worldChainSepolia.id]: http(process.env.NEXT_PUBLIC_WORLD_CHAIN_SEPOLIA_RPC_URL), // World Chain Sepolia RPC
  },
})





// ============================================================== //
//     Example: Build own custom chain (using "@wagmi/core")
//      Doc: https://1.x.wagmi.sh/core/chains#build-your-own
// ============================================================== //

// import { Chain } from '@wagmi/core'
//
// export const avalanche = {
//   id: 43_114,
//   name: 'Avalanche',
//   network: 'avalanche',
//   nativeCurrency: {
//     decimals: 18,
//     name: 'Avalanche',
//     symbol: 'AVAX',
//   },
//   rpcUrls: {
//     public: { http: ['https://api.avax.network/ext/bc/C/rpc'] },
//     default: { http: ['https://api.avax.network/ext/bc/C/rpc'] },
//   },
//   blockExplorers: {
//     etherscan: { name: 'SnowTrace', url: 'https://snowtrace.io' },
//     default: { name: 'SnowTrace', url: 'https://snowtrace.io' },
//   },
//   contracts: {
//     multicall3: {
//       address: '0xca11bde05977b3631167028862be2a173976ca11',
//       blockCreated: 11_907_934,
//     },
//   },
// } as const satisfies Chain

