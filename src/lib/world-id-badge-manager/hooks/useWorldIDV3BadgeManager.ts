import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { readContract } from '@wagmi/core';

// @dev - TODO: Fix the import path depends on the project
import { wagmiConfig } from '@/lib/world-id-badge-manager/contracts/functions/wagmi/config';
//import { wagmiConfig } from '@/lib/blockchains/evm/smart-contracts/wagmi/config';

// @dev - Functions in the WorldIDV3BadgeManager.sol
import {
  verifyWorldIDV3ProofAndStoreIntoOnChainStorage,
  verifyWorldIDV3Proof,
  hasWorldIDV3Badge,
  WORLD_ID_V3_BADGE_MANAGER_ADDRESS
} from '@/lib/world-id-badge-manager/contracts/functions/wagmi/WorldIDV3BadgeManager'

export interface WorldIDV3BadgeData {
  hasVerifiedBadge: boolean;
  walletAddress: string;
  verifiedAt: string | null;
}

/**
 * @notice - Invoke the hasWorldIDV3Badge() in the WorldIDV3BadgeManager.sol
 */
export const useHasWorldIDV3Badge = () => {
  // @dev - Retrieve a connected wallet address
  const { address } = useAccount();
  const connectedAddress: Address = address;
  //const connectedAddress: Address = process.env.TEST_WALLET_ADDRESS;

  const [badgeData, setBadgeData] = useState<WorldIDV3BadgeData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refetchCounter, setRefetchCounter] = useState(0);

  const refetchWorldIDV3Badge = useCallback(() => {
    setRefetchCounter(c => c + 1);
  }, []);

  // Listen for custom event dispatched after successful proof submission
  useEffect(() => {
    const handler = () => refetchWorldIDV3Badge();
    window.addEventListener('world-id-v3-badge-verified', handler);
    return () => window.removeEventListener('world-id-v3-badge-verified', handler);
  }, [refetchWorldIDV3Badge]);

  useEffect(() => {
    // @dev - Check whether a user has a WorldIDV3Badge or not
    const checkBadge = async () => {
      if (!connectedAddress) {
        setBadgeData(null);
        return;
      }

      if (!WORLD_ID_V3_BADGE_MANAGER_ADDRESS) {
        setBadgeData(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // @dev - Call the hasWorldIDV3Badge() in the WorldIDV3BadgeManager.sol
        const hasWorldIDV3Proof = await hasWorldIDV3Badge(connectedAddress);

        let verifiedAt: string | null = null;
        if (hasWorldIDV3Proof) {
          try {
            const tsRes = await fetch(`/api/badges/verification-timestamp?walletAddress=${connectedAddress}&badgeType=world-id-v3`);
            if (tsRes.ok) {
              const tsData = await tsRes.json();
              verifiedAt = tsData.verifiedAt || null;
            }
          } catch {
            // Timestamp fetch is non-critical
          }
        }

        setBadgeData({
          hasVerifiedBadge: hasWorldIDV3Proof,
          walletAddress: connectedAddress, // address is the connected-wallet address
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
  }, [connectedAddress, refetchCounter]);

  return {
    worldIDV3Badge: badgeData,
    nsLoading: loading,
    nsError: error,
    refetchWorldIDV3Badge,
  };
};
