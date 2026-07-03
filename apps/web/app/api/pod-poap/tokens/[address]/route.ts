export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { fetchPodNftsByOwner } from "@/lib/solana/nft";

type RouteParams = { address: string };

export async function GET(_req: NextRequest, context: { params: Promise<RouteParams> }) {
  try {
    const { address } = await context.params;
    if (!address) {
      return NextResponse.json(
        { ok: false, error: "Address parameter is required." },
        { status: 400 }
      );
    }

    const nfts = await fetchPodNftsByOwner(address);

    return NextResponse.json({
      ok: true,
      address,
      balance: nfts.length,
      tokens: nfts.map((nft, index) => ({
        tokenId: index,
        mintAddress: nft.mintAddress,
        tokenUri: nft.tokenUri,
        name: nft.name,
      })),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
