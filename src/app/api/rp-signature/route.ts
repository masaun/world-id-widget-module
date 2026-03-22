// app/api/rp-signature/route.ts

import { NextResponse } from "next/server";
import type { IDKitResult } from "@worldcoin/idkit";
//import { signRequest } from "@worldcoin/idkit/signing";
import { signRequest } from "@worldcoin/idkit-core/signing";

export async function POST(request: Request) {
  const { action } = await request.json();

  const signingKey = process.env.NEXT_PUBLIC_WORLDCOIN_RP_SIGNING_KEY!;
  if (!signingKey) {
    return NextResponse.json(
      { error: "Missing RP_SIGNING_KEY" },
      { status: 500 }
    );
  }

  const { sig, nonce, createdAt, expiresAt } = signRequest(
    action,
    signingKey
  );

  return NextResponse.json({
    sig,
    nonce,
    created_at: createdAt,
    expires_at: expiresAt,
  });
}
