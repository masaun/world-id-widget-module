'use client'
import { useState, useEffect } from 'react'
//import { IDKitWidget, VerificationLevel, ISuccessResult } from '@worldcoin/idkit'
import {
  IDKitRequestWidget,
  orbLegacy,
  type RpContext
} from '@worldcoin/idkit';
import { hashSignal } from "@worldcoin/idkit-core/hashing";

// @dev - Import the "@wagmi/core"
//import { useAccount } from 'wagmi';

// @dev - Type of the contract ABI, which is imported from the 'viem' library
import type { Abi, Address, decodeAbiParameters } from 'viem';

// @dev - The functions, which is defined in the WorldIDV3BadgeManager.sol
import { useHasWorldIDV3Badge } from '@/lib/world-id-badge-manager/hooks/useWorldIDV3BadgeManager'

// @dev - Functions in the WorldIDV3BadgeManager.sol
import {
  verifyWorldIDV3ProofAndStoreIntoOnChainStorage,
  verifyWorldIDV3Proof,
  hasWorldIDV3Badge,
  WORLD_ID_V3_BADGE_MANAGER_ADDRESS
} from '@/lib/world-id-badge-manager/contracts/functions/wagmi/WorldIDV3BadgeManager'

interface WorldIdProps {
  onSuccess?: (result: ISuccessResult) => void;
  onError?: (error: Error) => void;
}


/**
 * @title - Generate the connect URL and collect proof
 * @dev - This API request for backend will be sent to the /app/api/rp-signature/route.ts through Next.js App Router 
 * @dev - Doc: https://docs.world.org/world-id/idkit/integrate#step-4-generate-the-connect-url-and-collect-proof
 */
// const rpSig = await fetch("/api/rp-signature", {
//   method: "POST",
//   headers: { "content-type": "application/json" },
//   body: JSON.stringify({ action: "my-action" }),
// }).then((r) => r.json());

// const rp_context: RpContext = {
//   rp_id: process.env.NEXT_PUBLIC_WORLDCOIN_RP_ID, // Your app's `rp_id` from the Developer Portal
//   nonce: rpSig.nonce,
//   created_at: rpSig.created_at,
//   expires_at: rpSig.expires_at,
//   signature: rpSig.sig,
// };


/**
 * @title - The WorldIdVerification function
 */
export const WorldIdVerification = ({ onSuccess, onError }: WorldIdProps) => {
  // @dev - Retrieve a connected wallet address
  //const { address } = useAccount();
  //const connectedAddress = address;

  const [isVerified, setIsVerified] = useState(false);
  const [verificationResult, setVerificationResult] = useState<ISuccessResult | null>(null);

  // @dev - @worldcoin/idkit-core v4.0.15
  const [open, setOpen] = useState(false);
  const [rpContext, setRpContext] = useState<RpContext | null>(null);

  // @dev - app_id and action (Source: World ID Developer Portal)
  const app_id = process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID || "WORLDCOIN_APP_ID is not set"; // Replace with your app_id
  const action_id = process.env.NEXT_PUBLIC_WORLDCOIN_ACTION || "WORLDCOIN_ACTION is not set"; // Replace with your action
  const rp_id = process.env.NEXT_PUBLIC_WORLDCOIN_RP_ID || "WORLDCOIN_RP_ID is not set";;   // Replace with your rp_id
  const userWalletAddress = process.env.NEXT_PUBLIC_TEST_WALLET_ADDRESS;
  console.log("app_id", app_id);
  console.log("action_id", action_id);
  console.log("rp_id", rp_id);

  // const rpSig = await fetch("/api/rp-signature", {
  //   method: "POST",
  //   headers: { "content-type": "application/json" },
  //   body: JSON.stringify({ action: "my-action" }),
  // }).then((r) => r.json());

  // const rp_context: RpContext = {
  //   rp_id: rp_id, // Your app's `rp_id` from the Developer Portal
  //   nonce: rpSig.nonce,
  //   created_at: rpSig.created_at,
  //   expires_at: rpSig.expires_at,
  //   signature: rpSig.sig,
  // };

  useEffect(() => {
    const fetchRp = async () => {
      const rpSig = await fetch("/api/rp-signature", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: action_id }),
      }).then((r) => r.json());

      setRpContext({
        rp_id: rp_id!,
        nonce: rpSig.nonce,
        created_at: rpSig.created_at,
        expires_at: rpSig.expires_at,
        signature: rpSig.sig,
      });
    };

    fetchRp();
  }, []);

  console.log("rpContext", rpContext);

  // // @dev - The process if a World ID verification is successful.
  // const handleVerify = async (result: ISuccessResult) => {
  //   console.log("World ID verification successful:", result);
  //   setIsVerified(true);
  //   setVerificationResult(result);
  //   if (onSuccess) {
  //     onSuccess(result);
  //   }

  //   // TODO: Implement the on-chain logic

  //   // @dev - Retrieve a connected wallet address
  //   //const { address } = useAccount();
  //   //const connectedAddress: Address = address;
  //   const connectedAddress = process.env.NEXT_PUBLIC_TEST_WALLET_ADDRESS as `0x${string}`; // @dev - TEMPORARY

  //   // @dev - Invoke the verifyWorldIDV3ProofAndStoreIntoOnChainStorage() in the WorldIDV3BadgeManager.sol 
  //   const root: bigint = result.merkle_root;
  //   const signalHash: bigint = 0; 
  //   const nullifierHash: bigint = result.nullifier_hash; 
  //   const externalNullifierHash: bigint = 0; 

  //   const unpackedProof = decodeAbiParameters([{ type: 'uint256[8]' }], result.proof);
  //   const proof: Array<bigint> = unpackedProof;

  //   const txResult = await verifyWorldIDV3ProofAndStoreIntoOnChainStorage(
  //     root,
  //     signalHash,
  //     nullifierHash,
  //     externalNullifierHash,
  //     proof
  //   );

  //   // @dev - Invoke the hasWorldIDV3Badge() in the WorldIDV3BadgeManager.sol 
  //   const _hasWorldIDV3Badge = await hasWorldIDV3Badge(connectedAddress);
  //   //const hasWorldIDV3Badge = useHasWorldIDV3Badge();
  //   console.log("_hasWorldIDV3Badge:", _hasWorldIDV3Badge);
  // };

  // @dev - The process if a World ID verification is failed.
  const handleError = (error: Error) => {
    console.error("World ID verification failed:", error);
    if (onError) {
      onError(error);
    }
  };

  return (
    <div className="world-id-container">
      {!isVerified ? (
        <>
          {/* ✅ Your button */}
          <button
            onClick={() => setOpen(true)}
            className="world-id-button"
            style={{
              backgroundColor: '#000000',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            🌍 Verify with World ID
          </button>

          {/* ✅ The widget (modal only) */}
          <IDKitRequestWidget
            open={open}
            onOpenChange={setOpen}
            app_id={app_id} // Your app's `app_id` from the Developer Portal
            // Action: Context that scopes what the user is proving uniqueness for
            // e.g., "verify-account-2026" or "claim-airdrop-2026".
            action={action_id}
            rp_context={rpContext}
            allow_legacy_proofs={true}
            // Signal (optional): Bind specific context into the requested proof.
            // Examples: user ID, wallet address. Your backend should enforce the same value.
            preset={orbLegacy({ signal: userWalletAddress })}

            handleVerify={async (result) => {
              // @dev - Debugging
              console.log("result: ", result);
              console.log("merkle_root: ", result.responses[0].merkle_root);
              console.log("signal_hash: ", result.responses[0].signal_hash);
              console.log("nullifier: ", result.responses[0].nullifier);
              console.log("proof: ", result.responses[0].proof);

              // TODO: Implement the "on-chain" verification code here for World ID "v3" Proof
              try {
                const response = result.responses[0];
                console.log("response:", response);

                const root = response.merkle_root;
                console.log("root:", root);

                const signalHash = response.signal_hash;
                console.log("signalHash:", signalHash);

                const nullifierHash = response.nullifier;
                console.log("nullifierHash:", nullifierHash);

                const proof = response.proof;
                console.log("proof:", proof);

                //const externalNullifierHash: bigint = 0; 
                const unpackedProof = decodeAbiParameters(
                  [{ type: 'uint256[8]' }],
                  proof
                )[0];

                // @dev - Debugging
                console.log("root: ", root);
                console.log("signalHash: ", signalHash);
                console.log("nullifierHash: ", nullifierHash);
                console.log("proof: ", proof);
                console.log("unpackedProof: ", unpackedProof);

                // @dev - Invoke the verifyWorldIDV3Proof() in the WorldIDV3BadgeManager.sol 
                await verifyWorldIDV3Proof(
                  app_id,
                  action_id,
                  root,
                  signalHash,
                  nullifierHash,
                  //externalNullifierHash,
                  unpackedProof
                );

                // @dev - Invoke the verifyWorldIDV3ProofAndStoreIntoOnChainStorage() in the WorldIDV3BadgeManager.sol 
                const txResult = await verifyWorldIDV3ProofAndStoreIntoOnChainStorage(
                  app_id,
                  action_id,
                  //root,
                  result.responses[0].merkle_root,
                  //signalHash,
                  result.responses[0].signal_hash,
                  //nullifierHash,
                  result.responses[0].nullifier,
                  //externalNullifierHash,
                  //unpackedProof
                  result.responses[0].proof
                );

                // @dev - Invoke the hasWorldIDV3Badge() in the WorldIDV3BadgeManager.sol 
                const _hasWorldIDV3Badge = await hasWorldIDV3Badge(userWalletAddress);
                //const hasWorldIDV3Badge = useHasWorldIDV3Badge();
                console.log("_hasWorldIDV3Badge:", _hasWorldIDV3Badge);
              } catch (err) {
                console.error("🔥 ERROR inside handleVerify:", err);
              }



              // COMMENT OUT - The code below are "off-chain" verification code for World ID "v4" Proof.  
              //
              // const response = await fetch("/api/verify-proof", {
              //   method: "POST",
              //   headers: { "content-type": "application/json" },
              //   body: JSON.stringify({
              //     //app_id: app_id,
              //     rp_id: rpContext.rp_id,
              //     idkitResponse: result,
              //   }),
              // });

              // if (!response.ok) {
              //   throw new Error("Backend verification failed");
              // }
            }}

            onSuccess={(result) => {
              // Runs after `handleVerify` succeeds. Update app state/UI here.
            }}
          />
        </>

        // <IDKitWidget
        //   app_id={app_id}
        //   action={action_id}
        //   verification_level={VerificationLevel.SecureDocument}
        //   onSuccess={handleVerify}
        //   onError={handleError}
        //   credential_types={["secure document"]}
        //   //credential_types={["orb", "phone"]}
        //   enableTelemetry
        // >
        //   {({ open }: { open: () => void }) => (
        //     <button 
        //       onClick={open}
        //       className="world-id-button"
        //       style={{
        //         backgroundColor: '#000000',
        //         color: 'white',
        //         border: 'none',
        //         borderRadius: '8px',
        //         padding: '12px 24px',
        //         fontSize: '16px',
        //         fontWeight: '600',
        //         cursor: 'pointer',
        //         transition: 'all 0.2s ease',
        //         marginTop: '10px'
        //       }}
        //     >
        //       🌍 Verify with World ID
        //     </button>
        //   )}
        // </IDKitWidget>
      ) : (
        <div className="verification-success" style={{ 
          padding: '16px', 
          backgroundColor: '#f0f9ff', 
          border: '1px solid #0ea5e9', 
          borderRadius: '8px',
          marginTop: '10px'
        }}>
          <p style={{ margin: 0, color: '#0c4a6e', fontWeight: '600' }}>
            ✅ World ID Verified Successfully!
          </p>
          {verificationResult && (
            <details style={{ marginTop: '8px' }}>
              <summary style={{ cursor: 'pointer', color: '#0369a1' }}>
                View Verification Details
              </summary>
              <pre style={{ 
                fontSize: '12px', 
                backgroundColor: '#e0f2fe', 
                padding: '8px', 
                borderRadius: '4px',
                overflow: 'auto',
                marginTop: '8px'
              }}>
                {JSON.stringify(verificationResult, null, 2)}
              </pre>
            </details>
          )}
          <button 
            onClick={() => {
              setIsVerified(false);
              setVerificationResult(null);
            }}
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '14px',
              cursor: 'pointer',
              marginTop: '8px'
            }}
          >
            Reset Verification
          </button>
        </div>
      )}
    </div>
  );
};
