export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest) {
  return NextResponse.json(
    {
      ok: false,
      error: "POD POAP minting on Solana is not yet available.",
    },
    { status: 501 }
  );
}
