'use client'
import { useState, useEffect, useRef } from 'react'

// @dev - ID Kit SDK (@worldcoin/idkit) powered by World ID
import {
  IDKitRequestWidget,
  passport, // World ID v4 NFC Passport credential (9303) preset
  type RpContext
} from '@worldcoin/idkit';

// @dev - Create the "wagmiConfig" using the "wagmiAdapter" of AppKit
import { wagmiAdapter } from '@/config/wagmi'
export const wagmiConfig = wagmiAdapter.wagmiConfig;

// @dev - Get a caller address via the @wagmi/core v2
import { getConnection } from '@wagmi/core';

// @dev - CSS
import '@/lib/world-id-badge-manager/styles/world-id.css';
import '@/lib/world-id-badge-manager/styles/spinner.css';

interface WorldIdV4PassportProps {
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
}

/**
 * @title - World ID v4 Passport Verification
 * @dev - Verifies an NFC passport credential (credential ID: 9303) using the World ID v4 SDK.
 * @dev - Uses the passport() preset which requests the World ID 4.0 Passport credential.
 */
export const WorldIdV4PassportVerification = ({ onSuccess, onError }: WorldIdV4PassportProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [rpContext, setRpContext] = useState<RpContext | null>(null);

  const app_id = process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID || "WORLDCOIN_APP_ID is not set";
  const action_id = process.env.NEXT_PUBLIC_WORLDCOIN_ACTION || "WORLDCOIN_ACTION is not set";
  const rp_id = process.env.NEXT_PUBLIC_WORLDCOIN_RP_ID || "WORLDCOIN_RP_ID is not set";

  let connection = getConnection(wagmiConfig);
  let callerAddress = connection.address;

  useEffect(() => {
    const fetchRp = async () => {
      const rpSig = await fetch("/api/world-id/rp-signature", {
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

      connection = getConnection(wagmiConfig);
      callerAddress = connection.address;
    };

    fetchRp();
  }, []);

  const handleVerify = async (result: any) => {
    console.log("[Passport] handleVerify result:", result);
    console.log("[Passport] merkle_root:", result.responses[0].merkle_root);
    console.log("[Passport] nullifier:", result.responses[0].nullifier);
    console.log("[Passport] proof:", result.responses[0].proof);

    const response = await fetch("/api/world-id/verify-proof", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        rp_id: rpContext?.rp_id,
        idkitResponse: result,
      }),
    });

    if (!response.ok) {
      throw new Error("Backend passport verification failed");
    }
  };

  const hasHandledSuccess = useRef(false);

  const handleSuccess = async (result: any) => {
    setIsLoading(true);

    if (hasHandledSuccess.current) return;
    hasHandledSuccess.current = true;

    try {
      console.log("[Passport] handleSuccess result:", result);
      setIsVerified(true);
      setVerificationResult(result);

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      console.error("[Passport] ERROR inside handleSuccess:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (error: Error) => {
    console.error("[Passport] Verification failed:", error);
    if (onError) {
      onError(error);
    }
  };

  return (
    <div className="world-id-container">
      <h2>World ID v4 — Passport Verification (NFC Credential)</h2>

      {callerAddress && (
        !isVerified ? (
          <>
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
                <>🛂 Verify Passport with World ID</>
              )}
            </button>

            {/* World ID widget (modal) — passport() preset requests NFC credential (9303) */}
            <IDKitRequestWidget
              open={open}
              onOpenChange={setOpen}
              app_id={app_id}
              action={action_id}
              rp_context={rpContext}
              
              //allow_legacy_proofs={false}  // v4 Proof only
              allow_legacy_proofs={true}     // v3 Proof is also allowed 
              
              preset={passport({ signal: callerAddress })}

              environment="production"
              //environment="staging"

              handleVerify={handleVerify}
              onSuccess={handleSuccess}
              onError={handleError}
            />
          </>
        ) : (
          <div className="verification-success">
            <p className="verification-text">
              ✅ Passport credential verified with World ID v4!
            </p>

            {verificationResult && (
              <details className="verification-details">
                <summary>View Verification Details</summary>
                <pre>
                  <strong>Verified Passport Credential data:</strong>
                  {JSON.stringify(verificationResult, null, 2)}
                </pre>
              </details>
            )}

            <button
              className="reset-button"
              onClick={() => {
                setIsVerified(false);
                setVerificationResult(null);
                hasHandledSuccess.current = false;
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
