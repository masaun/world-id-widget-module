// app/api/verify-proof/route.ts

import { NextResponse } from "next/server";
import type { IDKitResult } from "@worldcoin/idkit";

export async function POST(request: Request): Promise<Response> {
  const { rp_id, idkitResponse } = (await request.json()) as {
    rp_id: string;
    idkitResponse: IDKitResult;
  };

  // @dev - Debugging
  console.log("rp_id", rp_id);

  const response = await fetch(
    `https://developer.world.org/api/v4/verify/${rp_id}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(idkitResponse),
    },
  );

  const payload = await response.json();

  // @dev - Debugging
  console.log("payload", payload);

  return NextResponse.json(payload, { status: response.status });
}
