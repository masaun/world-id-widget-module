// app/api/verify-proof/route.ts

import { NextResponse } from "next/server";
import type { IDKitResult } from "@worldcoin/idkit";

export async function POST(request: Request): Promise<Response> {
  const { 
    //app_id, 
    rp_id, 
    idkitResponse 
  } = (await request.json()) as {
    //app_id: string;
    rp_id: string;
    idkitResponse: IDKitResult;
  };

  // @dev - Debugging
  //console.log("app_id", app_id);
  console.log("rp_id", rp_id);

  const response = await fetch(
    //`https://developer.world.org/api/v2/verify/${app_id}`,
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
