export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest) {
  return NextResponse.json(
    {
      ok: false,
      error:
        "Proof of Donation NFT minting on Solana is not yet available. Your donation has been recorded.",
    },
    { status: 501 }
  );
}
