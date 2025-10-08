# World ID Widget Module 🆔

A modern, secure decentralized identity verification application built with Next.js, React, and TypeScript. World ID Widget Module integrates Worldcoin's World ID protocol with Reown (formerly WalletConnect) to provide seamless wallet connections and privacy-preserving human verification for decentralized applications (dApps).

## Overview

World ID Widget Module demonstrates the integration of two powerful Web3 technologies:
- **World ID**: Worldcoin's privacy-preserving proof-of-personhood protocol
- **Reown AppKit**: Advanced wallet connection infrastructure for seamless dApp interactions

This application serves as a reference implementation for developers looking to build dApps that require both wallet connectivity and human verification, enabling use cases like sybil-resistant voting, fair airdrops, and authenticated user experiences.

## Features

- **World ID Integration**: Privacy-preserving human verification using Worldcoin's orb and phone verification methods
- **Secure Wallet Connections**: Connect to popular crypto wallets using Reown's advanced protocol  
- **Multi-Chain Support**: Support for Ethereum, Polygon, and other EVM-compatible networks through Wagmi
- **User-Friendly Interface**: Clean, intuitive UI for managing both identity verification and wallet connections
- **Real-Time Verification**: Instant World ID verification with detailed result display
- **Cross-Platform Compatibility**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React v19 with TypeScript and Next.js v15.3.3
- **Identity**: World ID (@worldcoin/idkit) for human verification
- **Wallet Integration**: Reown AppKit with Wagmi adapter for multi-wallet support
- **State Management**: React Query (@tanstack/react-query) for server state management
- **Blockchain Interaction**: Viem for Ethereum interactions
- **Styling**: CSS modules with responsive design
- **Development**: ESLint for code quality and TypeScript for type safety

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/masaun/world-id-widget-module.git
   cd world-id-widget-module
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update the following variables in `.env.local`:
   - `NEXT_PUBLIC_WORLDCOIN_APP_ID`: Your World ID app ID from [Worldcoin Developer Portal](https://developer.worldcoin.org)
   - `NEXT_PUBLIC_WORLDCOIN_ACTION`: Your verification action name
   - `NEXT_PUBLIC_PROJECT_ID`: Your Reown project ID from [Reown Dashboard](https://dashboard.reown.com)

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser and navigate to `http://localhost:3000`**

## Usage

### World ID Verification
1. Launch the application
2. Click "🌍 Verify with World ID" to start the human verification process
3. Complete verification using either:
   - **Orb verification**: Visit a Worldcoin orb location
   - **Phone verification**: Verify using your phone number
4. View your verification status and details

### Wallet Connection
1. Click "Connect Wallet" to establish a wallet connection via Reown
2. Scan the QR code with your preferred wallet app or select from available wallet options
3. Approve the connection request in your wallet
4. Start interacting with the dApp using your connected wallet

### Combined Features
Once both World ID verification and wallet connection are complete, you can:
- Access features that require proven human identity
- Interact with smart contracts using your verified identity
- Participate in sybil-resistant activities

## Resources

### Documentation
- [World ID Documentation](https://docs.world.org/world-id)
- [Worldcoin Developer Portal](https://developer.worldcoin.org)
- [Reown Documentation](https://docs.reown.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh)

### Getting Started Guides
- [World ID Integration Guide](https://docs.world.org/world-id/reference/idkit#idkitwidget)
- [Reown AppKit Setup](https://docs.reown.com/appkit/next/core/installation)
- [Next.js App Router](https://nextjs.org/docs/app)


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

World ID Widget Module is a development project for demonstration purposes. Always verify transactions and use at your own risk. Never share your private keys, seed phrases, or personal verification information with untrusted parties.
