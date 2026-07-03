export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { getSolanaConfig } from "@/lib/solana/config";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json(
      { ok: false, error: "Missing required query param: address" },
      { status: 400 }
    );
  }

  try {
    const config = getSolanaConfig();
    const connection = new Connection(config.rpcUrl, "confirmed");
    const pubkey = new PublicKey(address);

    const [solLamports, tokenBalance] = await Promise.all([
      connection.getBalance(pubkey),
      connection
        .getTokenAccountBalance(
          getAssociatedTokenAddressSync(new PublicKey(config.usdcMint), pubkey)
        )
        .catch(() => null),
    ]);

    return NextResponse.json({
      ok: true,
      address,
      solBalance: solLamports / 1e9,
      usdcBalance: tokenBalance?.value.uiAmount ?? 0,
      tokenSymbol: "USDC",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
