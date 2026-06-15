# World ID Widget Module 🆔

## Overview

This is the World ID Widget Module to demonstrate the integration of two powerful Web3 technologies:
- **World ID**: Worldcoin's privacy-preserving proof-of-personhood protocol
- **Reown AppKit**: Advanced wallet connection infrastructure for seamless dApp interactions

This application serves as a reference implementation for developers looking to build dApps that require both wallet connectivity and human verification, enabling use cases like sybil-resistant voting, fair airdrops, and authenticated user experiences.

NOTE:
- In this repo, the `WorldIDV3BadgeManagerForOffChainVerifiedProof.sol`, which is deployed on World Chain mainnet / sepolia, would be used.
  - The deployed addresses of the `WorldIDV3BadgeManagerForOffChainVerifiedProof.sol` can be seen [here](https://github.com/masaun/world-id-badge-manager?tab=readme-ov-file#deployed-contract-addresses-on-world-chain-mainnet--sepolia).


## Features

- **World ID Integration**: Privacy-preserving human verification using Worldcoin's orb and phone verification methods
- **Secure Wallet Connections**: Connect to popular crypto wallets using Reown's advanced protocol  
- **Multi-Chain Support**: Support for Ethereum, World Chain, Base, and other EVM-compatible networks through Wagmi
- **User-Friendly Interface**: Clean, intuitive UI for managing both identity verification and wallet connections
- **Real-Time Verification**: Instant World ID verification with detailed result display
- **Cross-Platform Compatibility**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React v19 with TypeScript and Next.js v15.3.3
- **Identity**: World ID (@worldcoin/idkit) for human verification
- **Wallet Integration**: Reown AppKit with Wagmi adapter for multi-wallet support
- **State Management**: React Query (@tanstack/react-query) for server state management
- **Blockchain Interaction**: `@wagmi/core (v2)` `Viem` for Ethereum interactions
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
   cp .env.example .env
   ```
   
   Update the following variables in `.env`:
   - `NEXT_PUBLIC_WORLDCOIN_APP_ID`: Your World ID's `app ID` from [Worldcoin Developer Portal](https://developer.worldcoin.org)
   - `NEXT_PUBLIC_WORLDCOIN_ACTION`: Your World ID's `action (ID)` name from [Worldcoin Developer Portal](https://developer.worldcoin.org)
   - `NEXT_PUBLIC_WORLDCOIN_RP_ID`: Your World ID's `RP ID` from [Worldcoin Developer Portal](https://developer.worldcoin.org)
   - `NEXT_PUBLIC_WORLDCOIN_RP_SIGNING_KEY`: Your World ID's `RP Signing key`, which is a `Private Key` that is downloaded from [Worldcoin Developer Portal](https://developer.worldcoin.org)
   - `NEXT_PUBLIC_PROJECT_ID`: Your Reown project ID from [Reown Dashboard](https://dashboard.reown.com)


4. Set the `"staging"` or `"production"` to the `environment` attribution in the `WorldIdVerification.tsx`:
   - NOTE: If you use the `World App simulator` (https://simulator.worldcoin.org/), you should set the  `"staging"` to the `environment` attribution.
```typescript
            <IDKitRequestWidget
              ...
              // @dev - If you use the World App simulator (https://simulator.worldcoin.org/), you should set the "staging" to the environment:
              environment="staging"
              //environment="production"
              ...
            />
```

5. Set the `orbLegacy()` or `proofOfHuman()` to the `preset` attribution in the `WorldIdVerification.tsx`:
   - `orbLegacy()` preset is for World ID Proof (Orb) `v3.0` proof generation.
   - `proofOfHuman()` preset is for World ID Proof (Orb) `v4.0` proof generation
```typescript
            <IDKitRequestWidget
              ...
              //preset={orbLegacy({ signal: callerAddress })}  // World ID Proof (Orb) v3.0 preset
              preset={proofOfHuman({ signal: callerAddress })} // World ID Proof (Orb) v4.0 preset
              ...
            />
```

6. Set the `passport()` preset in `WorldIdV4PassportVerification.tsx` for **World ID v4 Passport (NFC credential) verification**:
   - `passport()` preset is for World ID v4 **NFC Passport credential** (credential ID: `9303`) verification.
   - It requests proof that the user holds a verified government-issued NFC passport credential.
   - Set `allow_legacy_proofs: true` to also accept World ID 3.0 fallback (legacy Document verification) for users who do not yet have a World ID 4.0 credential.
   - The `signal` (e.g. the connected wallet address) is bound into the proof to prevent replay attacks — your backend should enforce the same value.
```typescript
            <IDKitRequestWidget
              ...
              allow_legacy_proofs={true}
              preset={passport({ signal: callerAddress })} // World ID v4 NFC Passport credential (9303) preset
              ...
            />
```
   Reference: [World ID Credentials — `passport()` preset](https://docs.world.org/world-id/idkit/credentials#passport) | [NFC Credential (9303)](https://docs.world.org/world-id/credentials/9303)

7. **Start the development server:**
   ```bash
   npm run dev
   ```

8. **Open your browser and navigate to `http://localhost:3000`**

## Usage

### World ID Verification
1. Launch the application

2. Click `"🌍 Verify with World ID"` button to start the human verification process

3. QR code modal for a `World ID v3 Proof` verification (`iris` based verification using `orb` ) would be displayed:
   (NOTE: Visit a [**Worldcoin `orb`** location](https://world.org/orb) in advance if you has not verified via the Orb yet)

4. Once a user scan the QR code via their World App, the `World ID v3 Proof` generation and verification would get started.

5. Once a `World ID v3 Proof` generation and verification would be completed `off-chain` (`backend`), the proof data is stored into the `on-chain` storage via the [`storeVerifiedWorldIDV3ProofData()`](https://github.com/masaun/world-id-widget-module/blob/main/src/components/world-id/WorldIdVerification.tsx#L227-L239) of the `WorldIDV3BadgeManagerForOffChainVerifiedProof.sol`. (NOTE: You can also use the [source function](https://github.com/masaun/world-id-widget-module/blob/main/src/lib/world-id-badge-manager/contracts/functions/wagmi/WorldIDV3BadgeManagerForOffChainVerifiedProof.ts#L59-L103) to call it)

6. View your verification status and details

7. You can check wether a user has a `World ID v3 Proof` in the form of `World ID v3 Proof` badge by invoking the [`hasWorldIDV3Badge()`](https://github.com/masaun/world-id-widget-module/blob/main/src/components/world-id/WorldIdVerification.tsx#L269-L276) of the `WorldIDV3BadgeManagerForOffChainVerifiedProof.sol`. (NOTE: You can also use the [source function](https://github.com/masaun/world-id-widget-module/blob/main/src/lib/world-id-badge-manager/contracts/functions/wagmi/WorldIDV3BadgeManagerForOffChainVerifiedProof.ts#L109-L130) to call it)
 
NOTE:
- Also, you can check a data of the verified `World ID v3 Proof` by invoking the [`getVerifiedWorldIDV3ProofData()`](https://github.com/masaun/world-id-widget-module/blob/main/src/lib/world-id-badge-manager/contracts/functions/wagmi/WorldIDV3BadgeManagerForOffChainVerifiedProof.ts#L136-L159) of the `WorldIDV3BadgeManagerForOffChainVerifiedProof.sol`

- Where the files, which is for `World ID v3 Proof` generation and verification would be completed `off-chain` (`backend`), is stored:
   - `RP Signature` generation: `app/api/world-id/rp-signature/route.ts`
   - `World ID v3 Proof` generation and verification: `app/api/world-id/verify-proof/route.ts`


### World ID v4 Passport Verification (NFC Credential)
1. Launch the application

2. Click `"🛂 Verify Passport with World ID"` button to start the NFC passport credential verification process

3. A QR code modal for **World ID v4 Passport** verification will be displayed. Scan it with the World App.
   (NOTE: Your passport must already be enrolled in the World App. The credential uses NFC chip data from a government-issued passport.)

4. Once a user scans the QR code via their World App, the `passport()` preset triggers a World ID v4 NFC Passport credential proof (credential ID: `9303`).

5. Once the credential proof is verified `off-chain` (`backend`), the verification result is displayed on screen.

NOTE:
- The `passport()` preset verifies that the user holds a **unique government-issued NFC passport credential** — each passport can only be linked to one World ID, providing document-level Sybil resistance.
- `allow_legacy_proofs: true` enables fallback support for users with World ID 3.0 Document credentials.
- Where the files for `World ID v4 Passport` proof verification are stored:
   - `RP Signature` generation: `app/api/world-id/rp-signature/route.ts`
   - Proof verification: `app/api/world-id/verify-proof/route.ts`
- The component is located at: `src/components/world-id/v4/nfc-credential/passport/WorldIdV4PassportVerification.tsx`


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

### `WorldIDV3BadgeManagerForOffChainVerifiedProof.sol` Repo

- The deployed addresses of the `WorldIDV3BadgeManagerForOffChainVerifiedProof.sol` can be seen [here](https://github.com/masaun/world-id-badge-manager?tab=readme-ov-file#deployed-contract-addresses-on-world-chain-mainnet--sepolia).

### Documentation
- [World ID Documentation](https://docs.world.org/world-id)
- [World Developer Portal](https://developer.worldcoin.org)
- [Reown Documentation](https://docs.reown.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh)

### Getting Started Guides
- [World ID Integration Guide](https://docs.world.org/world-id/idkit/integrate)
- [Reown AppKit Setup](https://docs.reown.com/appkit/next/core/installation)
- [Next.js App Router](https://nextjs.org/docs/app)


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

World ID Widget Module is a development project for demonstration purposes. Always verify transactions and use at your own risk. Never share your private keys, seed phrases, or personal verification information with untrusted parties.
