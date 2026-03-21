import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { writeContract, readContract } from '@wagmi/core';

// @dev - Type of the contract ABI, which is imported from the 'viem' library
import type { Abi, Address } from 'viem';

// @dev - TODO: We should replace this depends on project
import { 
  wagmiConfig,
  //base, baseSepolia, worldchain, worldchainSepolia
} from '@/lib/world-id-badge-manager/contracts/functions/wagmi/config';
//import { wagmiConfig } from '@/lib/blockchains/evm/smart-contracts/wagmi/config';

// @dev - ABI of the WorldIDV3BadgeManager.sol
import { WORLD_ID_V3_BADGE_MANAGER_ABI } from '@/lib/world-id-badge-manager/contracts/abis/WorldIDV3BadgeManager';
//import { NETWORK_SCHOOL_MEMBERSHIP_BADGE_MANAGER_ABI } from '@/lib/network-school-membership-verification-package/contracts/abis/abis';

// @dev - The deployed contract address of the WorldIDV3BadgeManager.sol
const WORLD_ID_V3_BADGE_MANAGER_ADDRESS = process.env.WORLD_ID_V3_BADGE_MANAGER_ON_WORLD_CHAIN_SEPOLIA as `0x${string}`;

/** 
 * @notice - The verifyWorldIDV3ProofAndStoreIntoOnChainStorage() function of the WorldIDV3BadgeManager.sol
 * @dev - Doc: https://wagmi.sh/core/api/actions/writeContract
 */
export async function verifyWorldIDV3ProofAndStoreIntoOnChainStorage(
  root: Number,
  signalHash: Number,
  nullifierHash: Number,
  externalNullifierHash: Number,
  proof: Array<Number>
): Promise<any> {
  try {
    const txResult = await writeContract(wagmiConfig, {
      address: WORLD_ID_V3_BADGE_MANAGER_ADDRESS, // World Chain Sepolia
      abi: WORLD_ID_V3_BADGE_MANAGER_ABI,
      functionName: 'verifyWorldIDV3ProofAndStoreIntoOnChainStorage',
      args: [
        root,
        signalHash,
        nullifierHash,
        externalNullifierHash,
        proof
      ],
      chainId: wagmiConfig.chains[5].id, // World Chain Sepolia
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
export async function hasWorldIDV3Badge(walletAddress: Address): Promise<boolean> {
  try {
    const result = await readContract(wagmiConfig, {
      address: WORLD_ID_V3_BADGE_MANAGER_ADDRESS, // World Chain Sepolia
      abi: WORLD_ID_V3_BADGE_MANAGER_ABI,
      functionName: 'hasWorldIDV3Badge',
      args: [walletAddress],
      chainId: wagmiConfig.chains[5].id, // World Chain Sepolia
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
  root: Number,
  signalHash: Number,
  nullifierHash: Number,
  externalNullifierHash: Number,
  proof: Array<Number>
): Promise<boolean> {
  try {
    const hasProof = await readContract(wagmiConfig, {
      address: WORLD_ID_V3_BADGE_MANAGER_ADDRESS, // World Chain Sepolia
      abi: WORLD_ID_V3_BADGE_MANAGER_ABI,
      functionName: 'hasWorldIDV3Badge',
      args: [
        root,
        signalHash,
        nullifierHash,
        externalNullifierHash,
        proof
      ],
      chainId: wagmiConfig.chains[5].id, 
    });

    return hasProof as boolean;
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
