export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";
import { getSolanaConfig } from "@/lib/solana/config";

type VerifyDonationPayload = {
  signature: string;
  from: string;
  to: string;
  amount: number;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as VerifyDonationPayload;
    const { signature, from, to, amount } = body;

    if (!signature || !from || !to || !amount) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields: signature, from, to, amount" },
        { status: 400 }
      );
    }

    try {
      new PublicKey(from);
      new PublicKey(to);
    } catch {
      return NextResponse.json(
        { ok: false, error: "Invalid Solana address format" },
        { status: 400 }
      );
    }

    const config = getSolanaConfig();
    const connection = new Connection(config.rpcUrl, "confirmed");

    const status = await connection.getSignatureStatus(signature);
    if (!status?.value || status.value.err) {
      return NextResponse.json(
        { ok: false, error: "Transaction not confirmed or failed" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      hash: signature,
      successful: true,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
