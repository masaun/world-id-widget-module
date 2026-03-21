import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { readContract } from '@wagmi/core';
import { wagmiConfig } from '@/lib/blockchains/evm/smart-contracts/wagmi/config';

// @dev - ABI of the WorldIDV3BadgeManager.sol
import { WORLD_ID_V3_BADGE_MANAGER_ABI } from '@/lib/world-id-badge-manager/contracts/abis/WorldIDV3BadgeManager';
//import { NETWORK_SCHOOL_MEMBERSHIP_BADGE_MANAGER_ABI } from '@/lib/network-school-membership-verification-package/contracts/abis/abis';

import { base } from '@wagmi/core/chains';

const WORLD_ID_V3_BADGE_MANAGER_ADDRESS = process.env.WORLD_ID_V3_BADGE_MANAGER_ON_WORLD_CHAIN_SEPOLIA as `0x${string}`;

export interface NSMembershipBadgeData {
  hasVerifiedBadge: boolean;
  walletAddress: string;
  verifiedAt: string | null;
}

/**
 * @title - useWorldIDV3BadgeManager.ts
 */
export const useWorldIDV3BadgeManager = () => {
  const { address } = useAccount();
  const [badgeData, setBadgeData] = useState<NSMembershipBadgeData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refetchCounter, setRefetchCounter] = useState(0);

  const refetchNSBadge = useCallback(() => {
    setRefetchCounter(c => c + 1);
  }, []);

  // Listen for custom event dispatched after successful proof submission
  useEffect(() => {
    const handler = () => refetchNSBadge();
    window.addEventListener('ns-badge-verified', handler);
    return () => window.removeEventListener('ns-badge-verified', handler);
  }, [refetchNSBadge]);

  useEffect(() => {
    const checkBadge = async () => {
      if (!address) {
        setBadgeData(null);
        return;
      }

      if (!NS_BADGE_MANAGER_ADDRESS) {
        setBadgeData(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const hasProof = await readContract(wagmiConfig, {
          address: NS_BADGE_MANAGER_ADDRESS,
          abi: NETWORK_SCHOOL_MEMBERSHIP_BADGE_MANAGER_ABI,
          functionName: 'hasStoredProof',
          args: [address],
          chainId: base.id,
        }) as boolean;

        let verifiedAt: string | null = null;
        if (hasProof) {
          try {
            const tsRes = await fetch(`/api/badges/verification-timestamp?walletAddress=${address}&badgeType=ns-membership`);
            if (tsRes.ok) {
              const tsData = await tsRes.json();
              verifiedAt = tsData.verifiedAt || null;
            }
          } catch {
            // Timestamp fetch is non-critical
          }
        }

        setBadgeData({
          hasVerifiedBadge: hasProof,
          walletAddress: address,
          verifiedAt,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setBadgeData(null);
      } finally {
        setLoading(false);
      }
    };

    checkBadge();
  }, [address, refetchCounter]);

  return {
    nsMembershipBadge: badgeData,
    nsLoading: loading,
    nsError: error,
    refetchNSBadge,
  };
};
