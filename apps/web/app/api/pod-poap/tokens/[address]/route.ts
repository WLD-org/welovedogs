export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

type RouteParams = { address: string };

export async function GET(_req: NextRequest, context: { params: Promise<RouteParams> }) {
  const { address } = await context.params;
  if (!address) {
    return NextResponse.json(
      { ok: false, error: "Address parameter is required." },
      { status: 400 }
    );
  }

  return NextResponse.json({
    ok: true,
    address,
    balance: 0,
    tokens: [],
  });
}
