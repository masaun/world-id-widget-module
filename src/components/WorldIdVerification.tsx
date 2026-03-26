'use client'
import { useState, useEffect, useRef } from 'react'

// @dev - ID Kit SDK (@worldcoin/idkit) powered by World ID
import {
  IDKitRequestWidget,
  orbLegacy,
  type RpContext
} from '@worldcoin/idkit';
//import { IDKitWidget, VerificationLevel, ISuccessResult } from '@worldcoin/idkit'

// // @dev - Hashing module for a signal
// import { hashSignal } from "@worldcoin/idkit-core/hashing";

// @dev - Library to decode ABI parameters, which is imported from the 'viem' library
// import { decodeAbiParameters, parseAbiParameters } from 'viem';

// // @dev - Type of the contract ABI, which is imported from the 'viem' library
// import type { Abi, Address } from 'viem';

// // @dev - The functions, which is defined in the WorldIDV3BadgeManager.sol
// import { useHasWorldIDV3Badge } from '@/lib/world-id-badge-manager/hooks/useWorldIDV3BadgeManager'

// // @dev - Functions in the WorldIDV3BadgeManager.sol
// import {
//   verifyWorldIDV3ProofAndStoreIntoOnChainStorage,
//   verifyWorldIDV3Proof,
//   hasWorldIDV3Badge,
//   WORLD_ID_V3_BADGE_MANAGER_ADDRESS
// } from '@/lib/world-id-badge-manager/contracts/functions/wagmi/WorldIDV3BadgeManager'

// @dev - Functions in the WorldIDV3BadgeManagerForOffChainVerifiedProof.sol
import {
  storeVerifiedWorldIDV3ProofData,
  getVerifiedWorldIDV3ProofData,
  hasWorldIDV3Badge,
  WORLD_ID_V3_BADGE_MANAGER_FOR_OFFCHAIIN_VERIFIED_PROOF_ADDRESS
} from '@/lib/world-id-badge-manager/contracts/functions/wagmi/WorldIDV3BadgeManagerForOffChainVerifiedProof'

// // @dev - TEMPORARY: ABI of the WorldIDV3BadgeManager.sol
// import { WORLD_ID_V3_BADGE_MANAGER_ABI } from '@/lib/world-id-badge-manager/contracts/abis/WorldIDV3BadgeManager';

// // @dev - TEMPORARY: Import the "wagmiConfig" 
// import { 
//   wagmiConfig,
//   //base, baseSepolia, worldchain, worldchainSepolia,
//   WORLD_CHAIN_MAINNET_CHAIN_ID, WORLD_CHAIN_SEPOLIA_CHAIN_ID
// } from '@/lib/blockchains/evm/smart-contracts/wagmi/config';

// @dev - Create the "wagmiConfig" using the "wagmiAdapter" of AppKit
import { wagmiAdapter, projectId, networks } from '@/config/wagmi'
export const wagmiConfig = wagmiAdapter.wagmiConfig;

// @dev - Get a caller address via the @wagmi/core v2 (Source: https://wagmi.sh/core/api/actions/getConnection)
import { getConnection } from '@wagmi/core';

// @dev - CSS
import '@/lib/world-id-badge-manager/styles/world-id.css';
import '@/lib/world-id-badge-manager/styles/spinner.css';

interface WorldIdProps {
  onSuccess?: (result: ISuccessResult) => void;
  onError?: (error: Error) => void;
}

/**
 * @title - The WorldId Verification function
 * @dev - At this point, the World ID v3 Proof can be verified here with the World ID v4 SDK. 
 * @dev - The World ID v3 Proof verification is done off-chain using the World ID v4 SDK. 
 */
export const WorldIdVerification = ({ onSuccess, onError }: WorldIdProps) => {
  // @dev - Variable for spinner icon-running
  const [isLoading, setIsLoading] = useState(false);

  // @dev - Variables for the World ID Proof verification
  const [isVerified, setIsVerified] = useState(false);
  const [verificationResult, setVerificationResult] = useState<ISuccessResult | null>(null);

  // @dev - @worldcoin/idkit-core v4.0.15
  const [open, setOpen] = useState(false);
  const [rpContext, setRpContext] = useState<RpContext | null>(null);

  // @dev - app_id and action (Source: World ID Developer Portal)
  const app_id = process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID || "WORLDCOIN_APP_ID is not set"; // Replace with your app_id
  const action_id = process.env.NEXT_PUBLIC_WORLDCOIN_ACTION || "WORLDCOIN_ACTION is not set"; // Replace with your action
  const rp_id = process.env.NEXT_PUBLIC_WORLDCOIN_RP_ID || "WORLDCOIN_RP_ID is not set";;   // Replace with your rp_id
  //const userWalletAddress = process.env.NEXT_PUBLIC_TEST_WALLET_ADDRESS;
  console.log("app_id: ", app_id);
  console.log("action_id: ", action_id);
  console.log("rp_id: ", rp_id);

  // @dev - Variables for the connected wallet address
  let connection = getConnection(wagmiConfig);
  let callerAddress = connection.address;
  //const [connection, setConnection] = useState(null);
  //const [callerAddress, setCallerAddres] = useState(null);

  useEffect(() => {
    const fetchRp = async () => {
      // @dev - Call a RP signature from backend (Directory: app/api/rp-signature/route.ts)
      const rpSig = await fetch("/api/rp-signature", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: action_id }),
      }).then((r) => r.json());

      // @dev - Store a RP signature
      setRpContext({
        rp_id: rp_id!,
        nonce: rpSig.nonce,
        created_at: rpSig.created_at,
        expires_at: rpSig.expires_at,
        signature: rpSig.sig,
      });

      // @dev - Retrieve a connected wallet address
      connection = getConnection(wagmiConfig);
      callerAddress = connection.address;
      console.log("connection: ", connection);
      console.log("callerAddress: ", callerAddress);
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

  const handleVerify= async (result) => {
    // @dev - Debugging
    console.log("result: ", result);
    console.log("merkle_root: ", result.responses[0].merkle_root);
    console.log("signal_hash: ", result.responses[0].signal_hash);
    console.log("nullifier: ", result.responses[0].nullifier);
    console.log("proof: ", result.responses[0].proof);

    // --------------------------------------------------------------------------- //
    //      "Off-chain" verification code for World ID v3 & v4 Uniquness Proof     //
    // --------------------------------------------------------------------------- //
    // @dev - "Off-chain" verification code for World ID v3 & v4 Uniquness Proof  
    const response = await fetch("/api/verify-proof", { // [Result]: Successful
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        //app_id: app_id,
        rp_id: rpContext.rp_id,
        idkitResponse: result,
      }),
    });

    if (!response.ok) {
      throw new Error("Backend verification failed");
    }
  }

  // @dev - The following "hasHandledSuccess" implementation is to avoid that the same on-chain function is unintentionally called twice.
  const hasHandledSuccess = useRef(false);
  
  // @dev - Invoke the storeVerifiedWorldIDV3ProofData() in the WorldIDV3BadgeManagerForOffChainVerifiedProof.sol
  const handleSuccess = async (result: any) => {
    setIsLoading(true); // 🔥 START spinner

    // @dev - Using the "hasHandledSuccess" to avoid that the same on-chain function is unintentionally called twice.
    if (hasHandledSuccess.current) return;
    hasHandledSuccess.current = true;

    try {
      const nonce = result.nonce;
      const environment = result.environment;
      const protocolVersion = result.protocol_version;

      const response = result.responses[0];

      const identifier = response.identifier;
      const merkleRoot = response.merkle_root;
      const signalHash = response.signal_hash;
      const nullifier = response.nullifier;
      const proof = response.proof;

      // @dev - Invoke the storeVerifiedWorldIDV3ProofData() in the WorldIDV3BadgeManagerForOffChainVerifiedProof.sol
      await storeVerifiedWorldIDV3ProofData(
        app_id,
        action_id,
        rp_id,
        nonce,
        identifier,
        merkleRoot,
        nullifier,
        proof,
        signalHash,
        environment,
        protocolVersion
      );

      // @dev - hasWorldIDV3Badge() in the WorldIDV3BadgeManagerForOffChainVerifiedProof.sol
      const _hasWorldIDV3Badge = await hasWorldIDV3Badge(callerAddress);
      console.log("_hasWorldIDV3Badge:", _hasWorldIDV3Badge);

      setIsVerified(true);
      setVerificationResult(result);

    } catch (err) {
      console.error("🔥 ERROR inside handleSuccess:", err);
    } finally {
      setIsLoading(false); // 🔥 STOP spinner (always)
    }
  };

  // @dev - Invoke the hasWorldIDV3Badge() in the WorldIDV3BadgeManagerForOffChainVerifiedProof.sol
  const handleHasWorldIDV3Badge = async () => {
    try {
      const _hasWorldIDV3Badge = await hasWorldIDV3Badge(callerAddress);
      console.log("_hasWorldIDV3Badge:", _hasWorldIDV3Badge);
    } catch (err) {
      console.error("🔥 ERROR inside handleHasWorldIDV3Badge:", err);
    }
  }

  // @dev - The process if a World ID verification is failed.
  const handleError = (error: Error) => {
    console.error("World ID verification failed:", error);
    if (onError) {
      onError(error);
    }
  };

  return (
    <div className="world-id-container">
      {callerAddress && (
        !isVerified ? (
          <>
            {/* Button for the World ID v3 Proof verification */}
            <button
              onClick={() => setOpen(true)}
              disabled={!rpContext || isLoading}
              className={`world-id-button 
                ${!rpContext ? 'disabled' : ''} 
                ${isLoading ? 'loading' : ''}`}
            >
              {isLoading ? (
                <>
                  <span className="spinner" />
                  Verifying...
                </>
              ) : (
                <>🌍 Verify with World ID</>
              )}
            </button>

            {/* World ID widget (modal) */}
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
              preset={orbLegacy({ signal: callerAddress })}
              //preset={orbLegacy({ signal: userWalletAddress })}

              handleVerify={handleVerify}

              onSuccess={handleSuccess}

              onError={handleError}
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
          //       🌍 Verify with World
          //     </button>
          //   )}
          // </IDKitWidget>
        ) : (
          <div className="verification-success">
            <p className="verification-text">
              ✅ Successful to verify your World ID v3 Proof!!
            </p>

            {verificationResult && (
              <details className="verification-details">
                <summary>View Verification Details</summary>
                <pre>
                  {JSON.stringify(verificationResult, null, 2)}
                </pre>
              </details>
            )}

            <button
              className="reset-button"
              onClick={() => {
                setIsVerified(false);
                setVerificationResult(null);
              }}
            >
              Reset Verification
            </button>
          </div>
        )
      )}
    </div>
  );
};
