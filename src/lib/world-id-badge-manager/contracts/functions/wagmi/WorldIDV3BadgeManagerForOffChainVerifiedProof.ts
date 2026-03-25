import { useState, useEffect, useCallback } from 'react';
//import { useAccount } from 'wagmi';
import { getConnection, writeContract, readContract } from '@wagmi/core';

// @dev - Type of the contract ABI, which is imported from the 'viem' library
import type { Abi, Address } from 'viem';

// @dev - AppKit
import { wagmiAdapter, projectId, networks } from '@/config'
export const wagmiConfig = wagmiAdapter.wagmiConfig;

// @dev - TODO: We should replace this depends on project
import { 
  //wagmiConfig,
  //base, baseSepolia, worldchain, worldchainSepolia,
  WORLD_CHAIN_MAINNET_CHAIN_ID, WORLD_CHAIN_SEPOLIA_CHAIN_ID
} from '@/lib/world-id-badge-manager/contracts/functions/wagmi/config';
//import { wagmiConfig } from '@/lib/blockchains/evm/smart-contracts/wagmi/config';

// @dev - ABI of the WorldIDV3BadgeManagerForOffChainVerifiedProof.sol
import { WORLD_ID_V3_BADGE_MANAGER_FOR_OFFCHAIIN_VERIFIED_PROOF_ABI } from '@/lib/world-id-badge-manager/contracts/abis/WorldIDV3BadgeManagerForOffChainVerifiedProof';

// @dev - The deployed contract address of the WorldIDV3BadgeManagerForOffChainVerifiedProof.sol
export const WORLD_ID_V3_BADGE_MANAGER_FOR_OFFCHAIIN_VERIFIED_PROOF_ADDRESS = process.env.NEXT_PUBLIC_WORLD_ID_V3_BADGE_MANAGER_FOR_OFFCHAIIN_VERIFIED_PROOF_ON_WORLD_CHAIN_SEPOLIA as `0x${string}`;
console.log("WORLD_ID_V3_BADGE_MANAGER_FOR_OFFCHAIIN_VERIFIED_PROOF_ADDRESS: ", WORLD_ID_V3_BADGE_MANAGER_FOR_OFFCHAIIN_VERIFIED_PROOF_ADDRESS);


// @dev - Get a caller address (Source: https://wagmi.sh/core/api/actions/getConnection)
const connection = getConnection(wagmiConfig);
const callerAddress = connection.address;
console.log("connection: ", connection);
console.log("callerAddress: ", callerAddress);

/** 
 * @notice - The storeVerifiedWorldIDV3ProofData() function of the WorldIDV3BadgeManagerForOffChainVerifiedProof.sol
 * @dev - Doc: https://wagmi.sh/core/api/actions/writeContract
 */
export async function storeVerifiedWorldIDV3ProofData(
  appId: BigInt,
  actionId: BigInt,
  rpId: BigInt,
  nonce: BigInt,
  identifier: string, // "orb"
  merkleRoot: BigInt,
  nullifier: BigInt,
  proof: string,
  signalHash: BigInt,
  environment: string,      // "production"
  protocolVersion: string   // "3.0"
): Promise<any> {
  try {
    const txResult = await writeContract(wagmiConfig, {
      address: WORLD_ID_V3_BADGE_MANAGER_FOR_OFFCHAIIN_VERIFIED_PROOF_ADDRESS, // World Chain Sepolia
      abi: WORLD_ID_V3_BADGE_MANAGER_FOR_OFFCHAIIN_VERIFIED_PROOF_ABI,
      functionName: 'storeVerifiedWorldIDV3ProofData',
      args: [
        appId,
        actionId,
        rpId,
        nonce,
        identifier, // "orb"
        merkleRoot,
        nullifier,
        proof,
        signalHash,
        environment,      // "production"
        protocolVersion   // "3.0"
      ],
      account: callerAddress, 
      chainId: WORLD_CHAIN_SEPOLIA_CHAIN_ID, // World Chain Sepolia
      //chainId: wagmiConfig.chains[5].id,   // World Chain Sepolia
    })
    
    return txResult;
  } catch(error) {
    console.error(error);
    throw error; // Ensures function never returns undefined
  }
}

/** 
 * @notice - The hasWorldIDV3Badge() function of the WorldIDV3BadgeManagerForOffChainVerifiedProof.sol
 * @dev - Doc: https://wagmi.sh/core/api/actions/readContract
 */
export async function hasWorldIDV3Badge(walletAddress: `0x${string}`): Promise<boolean> {
  try {
    const result = await readContract(wagmiConfig, {
      address: WORLD_ID_V3_BADGE_MANAGER_FOR_OFFCHAIIN_VERIFIED_PROOF_ADDRESS, // World Chain Sepolia
      abi: WORLD_ID_V3_BADGE_MANAGER_FOR_OFFCHAIIN_VERIFIED_PROOF_ABI,
      functionName: 'hasWorldIDV3Badge',
      args: [walletAddress],
      chainId: WORLD_CHAIN_SEPOLIA_CHAIN_ID  // World Chain Sepolia
      //chainId: wagmiConfig.chains[5].id,   // World Chain Sepolia
    }) as boolean;

    return result as boolean;
  } catch (error) {
    console.error(error);
    throw error; // Ensures function never returns undefined
  }
}

/** 
 * @notice - The getVerifiedWorldIDV3ProofData() function of the WorldIDV3BadgeManagerForOffChainVerifiedProof.sol
 * @dev - Doc: https://wagmi.sh/core/api/actions/readContract
 */
export async function getVerifiedWorldIDV3ProofData(walletAddress: `0x${string}`): Promise<any> {
  let verifiedWorldIDV3ProofData;
  try {
    verifiedWorldIDV3ProofData = await readContract(wagmiConfig, {
      address: WORLD_ID_V3_BADGE_MANAGER_FOR_OFFCHAIIN_VERIFIED_PROOF_ADDRESS, // World Chain Sepolia
      abi: WORLD_ID_V3_BADGE_MANAGER_FOR_OFFCHAIIN_VERIFIED_PROOF_ABI,
      functionName: 'getVerifiedWorldIDV3ProofData',
      args: [walletAddress],
      chainId: WORLD_CHAIN_SEPOLIA_CHAIN_ID
      //chainId: wagmiConfig.chains[5].id, 
    });
    console.log("verifiedWorldIDV3ProofData: ", verifiedWorldIDV3ProofData);

    return verifiedWorldIDV3ProofData;
  } catch(error) {
    console.error(error);
    throw error; // Ensures function never returns undefined
  }
}

