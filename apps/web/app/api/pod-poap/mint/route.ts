export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { isPodNftMintConfigured, mintPodNft } from "@/lib/solana/nft";
import { uploadMetadataToIPFS } from "@/lib/utils/ipfs";
import { getPODImageIPFS, getOrUploadPODImageIPFS } from "@/lib/utils/pod-ipfs";

type MintPayload = {
  recipientAddress: string;
  name?: string;
  imageIndex?: number;
};

const TOKEN_DEFINITIONS = [
  { image: "Gemini_Generated_Image_10xvng10xvng10xv.png", label: "Aurora" },
  { image: "Gemini_Generated_Image_nkcuupnkcuupnkcu.png", label: "Harbor" },
  { image: "Gemini_Generated_Image_g0gwjeg0gwjeg0gw.png", label: "Summit" },
  { image: "Gemini_Generated_Image_y32s4ty32s4ty32s.png", label: "Bloom" },
  { image: "Gemini_Generated_Image_6xd9r26xd9r26xd9.png", label: "Solaris" },
] as const;

export async function POST(req: NextRequest) {
  try {
    if (!isPodNftMintConfigured()) {
      return NextResponse.json(
        { ok: false, error: "NFT minting is not configured." },
        { status: 503 }
      );
    }

    const body = (await req.json().catch(() => ({}))) as MintPayload;
    const { recipientAddress, name, imageIndex = 0 } = body;

    if (!recipientAddress) {
      return NextResponse.json(
        { ok: false, error: "recipientAddress is required" },
        { status: 400 }
      );
    }

    const definition = TOKEN_DEFINITIONS[imageIndex % TOKEN_DEFINITIONS.length];
    const imagePath = path.join("images", "POD", definition.image);

    let imageIpfsUrl: string;
    const existing = getPODImageIPFS(definition.image);
    if (existing) {
      imageIpfsUrl = existing.ipfsUrl;
    } else {
      const uploaded = await getOrUploadPODImageIPFS(imagePath, definition.image);
      imageIpfsUrl = uploaded.ipfsUrl;
    }

    const metadata = {
      name: name || `Proof of Donation - ${definition.label}`,
      description: "Proof of Donation commemorative NFT on Solana.",
      image: imageIpfsUrl,
      attributes: [
        { trait_type: "Collection", value: "Proof of Donation" },
        { trait_type: "Series", value: definition.label },
        { trait_type: "Network", value: "Solana" },
      ],
    };

    let metadataIpfsUrl: string;
    try {
      const result = await uploadMetadataToIPFS(metadata);
      metadataIpfsUrl = result.ipfsUrl;
    } catch {
      metadataIpfsUrl = `${req.nextUrl.origin}/api/pod-poap/metadata/${imageIndex}`;
    }

    const mintResult = await mintPodNft({
      recipientAddress,
      name: metadata.name,
      uri: metadataIpfsUrl,
      symbol: "POD",
    });

    return NextResponse.json({
      ok: true,
      hash: mintResult.signature,
      mintAddress: mintResult.mintAddress,
      tokenUri: metadataIpfsUrl,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to mint NFT" },
      { status: 500 }
    );
  }
}
