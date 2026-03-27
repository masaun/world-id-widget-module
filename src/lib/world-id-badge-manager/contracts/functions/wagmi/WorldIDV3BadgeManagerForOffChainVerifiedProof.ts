import { useState, useEffect, useCallback } from 'react';
//import { useAccount } from 'wagmi';
import { getConnection, writeContract, readContract } from '@wagmi/core';

// @dev - Type of the contract ABI, which is imported from the 'viem' library
import type { Abi, Address } from 'viem';

// @dev - ABI of the WorldIDV3BadgeManagerForOffChainVerifiedProof.sol
import { WORLD_ID_V3_BADGE_MANAGER_FOR_OFFCHAIIN_VERIFIED_PROOF_ABI } from '@/lib/world-id-badge-manager/contracts/abis/WorldIDV3BadgeManagerForOffChainVerifiedProof';

// @dev - TODO: We should replace this depends on project
import { 
  //wagmiConfig,
  //base, baseSepolia, worldchain, worldchainSepolia,
  WORLD_CHAIN_MAINNET_CHAIN_ID, WORLD_CHAIN_SEPOLIA_CHAIN_ID
} from '@/lib/blockchains/evm/smart-contracts/wagmi/config';
//import { wagmiConfig } from '@/lib/blockchains/evm/smart-contracts/wagmi/config';

// @dev - AppKit based wagmiConfig
import { wagmiAdapter, projectId, networks } from '@/config/wagmi'
export const wagmiConfig = wagmiAdapter.wagmiConfig;

/**
 * @notice - Get the wallet connection
 */
export function getWalletConnection() {
  const connection = getConnection(wagmiConfig);

  if (!connection?.address || !connection?.chainId) {
    throw new Error('Wallet not connected');
  }

  return {
    callerAddress: connection.address,
    chainId: connection.chainId,
  };
}

/**
 * @notice - Get the contract address of the WorldIDV3BadgeManagerForOffChainVerifiedProof.sol on World Chain mainnet or sepolia
 */
export function getContractAddress(chainId: number): `0x${string}` {
  if (chainId === WORLD_CHAIN_MAINNET_CHAIN_ID) {
    return process.env
      .NEXT_PUBLIC_WORLD_ID_V3_BADGE_MANAGER_FOR_OFFCHAIIN_VERIFIED_PROOF_ON_WORLD_CHAIN_MAINNET as `0x${string}`;
  }

  if (chainId === WORLD_CHAIN_SEPOLIA_CHAIN_ID) {
    return process.env
      .NEXT_PUBLIC_WORLD_ID_V3_BADGE_MANAGER_FOR_OFFCHAIIN_VERIFIED_PROOF_ON_WORLD_CHAIN_SEPOLIA as `0x${string}`;
  }

  throw new Error(`Unsupported chainId: ${chainId}`);
}

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
  protocolVersion: string  // "3.0"
): Promise<any> {
  const { callerAddress, chainId } = getWalletConnection();
  const WORLD_ID_V3_BADGE_MANAGER_FOR_OFFCHAIIN_VERIFIED_PROOF_ADDRESS = getContractAddress(chainId);

  try {
    const txResult = await writeContract(wagmiConfig, {
      address: WORLD_ID_V3_BADGE_MANAGER_FOR_OFFCHAIIN_VERIFIED_PROOF_ADDRESS, // on World Chain mainnet or sepolia
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
      chainId: chainId,   // World Chain mainnet or sepolia
      //chainId: WORLD_CHAIN_SEPOLIA_CHAIN_ID, // World Chain Sepolia
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
export async function hasWorldIDV3Badge(
  walletAddress: `0x${string}`
): Promise<boolean> {
  const { chainId } = getWalletConnection();
  const WORLD_ID_V3_BADGE_MANAGER_FOR_OFFCHAIIN_VERIFIED_PROOF_ADDRESS = getContractAddress(chainId);

  try {
    const result = await readContract(wagmiConfig, {
      address: WORLD_ID_V3_BADGE_MANAGER_FOR_OFFCHAIIN_VERIFIED_PROOF_ADDRESS, // on World Chain mainnet or sepolia
      abi: WORLD_ID_V3_BADGE_MANAGER_FOR_OFFCHAIIN_VERIFIED_PROOF_ABI,
      functionName: 'hasWorldIDV3Badge',
      args: [walletAddress],
      chainId: chainId,   // World Chain mainnet or sepolia
      //chainId: WORLD_CHAIN_SEPOLIA_CHAIN_ID, // World Chain Sepolia
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
export async function getVerifiedWorldIDV3ProofData(
  walletAddress: `0x${string}`,
): Promise<any> {
  const { chainId } = getWalletConnection();
  const WORLD_ID_V3_BADGE_MANAGER_FOR_OFFCHAIIN_VERIFIED_PROOF_ADDRESS = getContractAddress(chainId);

  let verifiedWorldIDV3ProofData;
  try {
    verifiedWorldIDV3ProofData = await readContract(wagmiConfig, {
      address: WORLD_ID_V3_BADGE_MANAGER_FOR_OFFCHAIIN_VERIFIED_PROOF_ADDRESS, // on World Chain mainnet or sepolia
      abi: WORLD_ID_V3_BADGE_MANAGER_FOR_OFFCHAIIN_VERIFIED_PROOF_ABI,
      functionName: 'getVerifiedWorldIDV3ProofData',
      args: [walletAddress],
      chainId: chainId,   // World Chain mainnet or sepolia
      //chainId: WORLD_CHAIN_SEPOLIA_CHAIN_ID, // World Chain Sepolia
    });
    console.log("verifiedWorldIDV3ProofData: ", verifiedWorldIDV3ProofData);

    return verifiedWorldIDV3ProofData;
  } catch(error) {
    console.error(error);
    throw error; // Ensures function never returns undefined
  }
}

