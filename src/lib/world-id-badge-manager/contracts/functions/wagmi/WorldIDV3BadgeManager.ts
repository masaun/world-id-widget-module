import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { writeContract, readContract } from '@wagmi/core';

// @dev - Type of the contract ABI, which is imported from the 'viem' library
import type { Abi, Address } from 'viem';

// @dev - TODO: We should replace this depends on project
import { 
  wagmiConfig,
  //base, baseSepolia, worldchain, worldchainSepolia,
  WORLD_CHAIN_MAINNET_CHAIN_ID, WORLD_CHAIN_SEPOLIA_CHAIN_ID
} from '@/lib/world-id-badge-manager/contracts/functions/wagmi/config';
//import { wagmiConfig } from '@/lib/blockchains/evm/smart-contracts/wagmi/config';

// @dev - ABI of the WorldIDV3BadgeManager.sol
import { WORLD_ID_V3_BADGE_MANAGER_ABI } from '@/lib/world-id-badge-manager/contracts/abis/WorldIDV3BadgeManager';
//import { NETWORK_SCHOOL_MEMBERSHIP_BADGE_MANAGER_ABI } from '@/lib/network-school-membership-verification-package/contracts/abis/abis';

// @dev - The deployed contract address of the WorldIDV3BadgeManager.sol
export const WORLD_ID_V3_BADGE_MANAGER_ADDRESS = process.env.NEXT_PUBLIC_WORLD_ID_V3_BADGE_MANAGER_ON_WORLD_CHAIN_SEPOLIA as `0x${string}`;
console.log("WORLD_ID_V3_BADGE_MANAGER_ADDRESS: ", WORLD_ID_V3_BADGE_MANAGER_ADDRESS);

/** 
 * @notice - The verifyWorldIDV3ProofAndStoreIntoOnChainStorage() function of the WorldIDV3BadgeManager.sol
 * @dev - Doc: https://wagmi.sh/core/api/actions/writeContract
 */
export async function verifyWorldIDV3ProofAndStoreIntoOnChainStorage(
  appId: string,
  actionId: string,
  root: BigInt,
  signalHash: BigInt,
  nullifierHash: BigInt,
  //externalNullifierHash: bigint,
  proof: Array<BigInt>
): Promise<any> {
  try {
    const txResult = await writeContract(wagmiConfig, {
      address: WORLD_ID_V3_BADGE_MANAGER_ADDRESS, // World Chain Sepolia
      abi: WORLD_ID_V3_BADGE_MANAGER_ABI,
      functionName: 'verifyWorldIDV3ProofAndStoreIntoOnChainStorage',
      args: [
        appId,
        actionId,
        root,
        signalHash,
        nullifierHash,
        //externalNullifierHash,
        proof
      ],
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
 * @notice - The hasWorldIDV3Badge() function of the WorldIDV3BadgeManager.sol
 * @dev - Doc: https://wagmi.sh/core/api/actions/readContract
 */
export async function hasWorldIDV3Badge(walletAddress: `0x${string}`): Promise<boolean> {
  try {
    const result = await readContract(wagmiConfig, {
      address: WORLD_ID_V3_BADGE_MANAGER_ADDRESS, // World Chain Sepolia
      abi: WORLD_ID_V3_BADGE_MANAGER_ABI,
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
 * @notice - The verifyWorldIDV3Proof() function of the WorldIDV3BadgeManager.sol
 * @dev - Doc: https://wagmi.sh/core/api/actions/readContract
 */
export async function verifyWorldIDV3Proof(
  appId: string,
  actionId: string,
  root: BigInt,
  signalHash: BigInt,
  nullifierHash: BigInt,
  //externalNullifierHash: bigint,
  proof: Array<BigInt>
) {
  try {
    await readContract(wagmiConfig, {
      address: WORLD_ID_V3_BADGE_MANAGER_ADDRESS, // World Chain Sepolia
      abi: WORLD_ID_V3_BADGE_MANAGER_ABI,
      functionName: 'verifyWorldIDV3Proof',
      args: [
        appId as `app_${string}`,
        actionId as string,
        root,
        signalHash,
        nullifierHash,
        //externalNullifierHash,
        proof
      ],
      chainId: WORLD_CHAIN_SEPOLIA_CHAIN_ID
      //chainId: wagmiConfig.chains[5].id, 
    });

    console.log("✅ Successful to pass the verifyWorldIDV3Proof()");
  } catch(error) {
    console.error(error);
    throw error; // Ensures function never returns undefined
  }
}

// @notice - Here is the verifyWorldIDV3Proof() in the WorldIDV3BadgeManager.sol
//
// function verifyWorldIDV3Proof(
//     uint256 root,
//     uint256 signalHash,
//     uint256 nullifierHash,
//     uint256 externalNullifierHash,
//     uint256[8] calldata proof
// ) external view {
