export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    name: "Proof of Donation",
    symbol: "POD",
    totalSupply: 0,
  });
}
