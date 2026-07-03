export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { createServerClient } from "@/lib/supabase/server";
import { uploadMetadataToIPFS } from "@/lib/utils/ipfs";
import { getPODImageIPFS, getOrUploadPODImageIPFS } from "@/lib/utils/pod-ipfs";
import { isPodNftMintConfigured, mintPodNft } from "@/lib/solana/nft";
import { getTransactionExplorerUrl } from "@/lib/utils/solana-explorer";

type MintForDonationPayload = {
  donorId: string;
  transactionId: string;
  donorAddress: string;
};

const TOKEN_DEFINITIONS = [
  { image: "Gemini_Generated_Image_10xvng10xvng10xv.png", label: "Aurora" },
  { image: "Gemini_Generated_Image_nkcuupnkcuupnkcu.png", label: "Harbor" },
  { image: "Gemini_Generated_Image_g0gwjeg0gwjeg0gw.png", label: "Summit" },
  { image: "Gemini_Generated_Image_y32s4ty32s4ty32s.png", label: "Bloom" },
  { image: "Gemini_Generated_Image_6xd9r26xd9r26xd9.png", label: "Solaris" },
  { image: "Gemini_Generated_Image_d7uouzd7uouzd7uo.png", label: "Nebula" },
  { image: "Gemini_Generated_Image_lcjl9mlcjl9mlcjl.png", label: "Horizon" },
  { image: "Gemini_Generated_Image_5aqvll5aqvll5aqv.png", label: "Mirage" },
  { image: "Gemini_Generated_Image_59h21f59h21f59h2.png", label: "Cascade" },
  { image: "Gemini_Generated_Image_d9axvtd9axvtd9ax.png", label: "Pulse" },
  { image: "Gemini_Generated_Image_5tgc995tgc995tgc.png", label: "Echo" },
  { image: "Gemini_Generated_Image_63cf1y63cf1y63cf.png", label: "Nova" },
  { image: "Gemini_Generated_Image_b5dmcb5dmcb5dmcb.png", label: "Vortex" },
  { image: "Gemini_Generated_Image_ki9m2iki9m2iki9m.png", label: "Prism" },
  { image: "Gemini_Generated_Image_kx2xczkx2xczkx2x.png", label: "Zenith" },
  { image: "Gemini_Generated_Image_pz0obspz0obspz0o.png", label: "Apex" },
  { image: "Gemini_Generated_Image_sl6rrmsl6rrmsl6r.png", label: "Crest" },
] as const;

export async function POST(req: NextRequest) {
  try {
    if (!isPodNftMintConfigured()) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "NFT minting is not configured. Set POD_NFT_MINT_AUTHORITY_SECRET on the server.",
        },
        { status: 503 }
      );
    }

    const body = (await req.json().catch(() => ({}))) as MintForDonationPayload;
    const { donorId, transactionId, donorAddress } = body;

    if (!donorId || !transactionId || !donorAddress) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields: donorId, transactionId, donorAddress" },
        { status: 400 }
      );
    }

    const supabase = await createServerClient();

    const { data: transaction, error: txError } = await supabase
      .from("transactions")
      .select("*, dogs(name), campaigns(dog_name)")
      .eq("id", transactionId)
      .eq("donor_id", donorId)
      .single();

    if (txError || !transaction) {
      return NextResponse.json(
        { ok: false, error: "Transaction not found or access denied" },
        { status: 404 }
      );
    }

    const { data: quest } = await supabase
      .from("quests")
      .select("id")
      .eq("name", "First Donation")
      .maybeSingle();

    const { data: existingNft } = await supabase
      .from("donor_achievements")
      .select("nft_token_id, nft_minted")
      .eq("donor_id", donorId)
      .eq("quest_id", quest?.id || "")
      .eq("metadata->>transactionId", transactionId)
      .maybeSingle();

    if (existingNft?.nft_minted && existingNft.nft_token_id) {
      return NextResponse.json({
        ok: true,
        message: "NFT already minted for this donation",
        tokenId: existingNft.nft_token_id,
        mintAddress: existingNft.nft_token_id,
      });
    }

    const donationAmount = Number(transaction.usd_value || 0);
    const imageIndex = Math.min(
      Math.floor(donationAmount / 10) % TOKEN_DEFINITIONS.length,
      TOKEN_DEFINITIONS.length - 1
    );
    const tokenDefinition = TOKEN_DEFINITIONS[imageIndex];

    const imagePath = path.join("images", "POD", tokenDefinition.image);
    let imageIpfsUrl: string;
    try {
      const existingIPFS = getPODImageIPFS(tokenDefinition.image);
      if (existingIPFS) {
        imageIpfsUrl = existingIPFS.ipfsUrl;
      } else {
        const imageResult = await getOrUploadPODImageIPFS(imagePath, tokenDefinition.image);
        imageIpfsUrl = imageResult.ipfsUrl;
      }
    } catch (ipfsError) {
      console.warn("Failed to upload image to IPFS, using HTTP fallback:", ipfsError);
      const baseUrl = req.nextUrl.origin.replace(/\/$/, "");
      imageIpfsUrl = `${baseUrl}/images/POD/${tokenDefinition.image}`;
    }

    const dogName = transaction.dogs?.name || transaction.campaigns?.dog_name || "a dog in need";
    const metadata = {
      name: `Proof of Donation - ${dogName}`,
      description: `Commemorative Proof of Donation NFT celebrating your $${donationAmount} contribution to help ${dogName}. This NFT represents your generosity and support for animal rescue.`,
      image: imageIpfsUrl,
      attributes: [
        { trait_type: "Collection", value: "Proof of Donation" },
        { trait_type: "Series", value: tokenDefinition.label },
        { trait_type: "Donation Amount", value: `$${donationAmount.toFixed(2)}` },
        { trait_type: "Dog", value: dogName },
        { trait_type: "Transaction Hash", value: transaction.tx_hash || "" },
        { trait_type: "Donation Type", value: transaction.donation_type || "direct" },
        { trait_type: "Network", value: "Solana" },
      ],
      external_url: `${req.nextUrl.origin}/profile/donor`,
    };

    let metadataIpfsUrl: string;
    try {
      const metadataResult = await uploadMetadataToIPFS(metadata);
      metadataIpfsUrl = metadataResult.ipfsUrl;
    } catch (ipfsError) {
      console.warn("Failed to upload metadata to IPFS, using HTTP fallback:", ipfsError);
      metadataIpfsUrl = `${req.nextUrl.origin}/api/pod-poap/metadata/${imageIndex}`;
    }

    const mintResult = await mintPodNft({
      recipientAddress: donorAddress,
      name: metadata.name,
      uri: metadataIpfsUrl,
      symbol: "POD",
    });

    const txExplorerUrl = getTransactionExplorerUrl(mintResult.signature);

    if (quest) {
      await supabase.from("donor_achievements").upsert(
        {
          donor_id: donorId,
          quest_id: quest.id,
          nft_minted: true,
          nft_token_id: mintResult.mintAddress,
          blockchain_tx_hash: mintResult.signature,
          metadata: {
            transactionId,
            donationAmount,
            dogName,
            imageIpfsUrl,
            metadataIpfsUrl,
            mintAddress: mintResult.mintAddress,
            explorerUrl: txExplorerUrl,
          },
        },
        { onConflict: "donor_id,quest_id" }
      );
    }

    return NextResponse.json({
      ok: true,
      hash: mintResult.signature,
      mintAddress: mintResult.mintAddress,
      tokenId: mintResult.mintAddress,
      tokenUri: metadataIpfsUrl,
      explorerUrl: txExplorerUrl,
      metadata,
    });
  } catch (error: unknown) {
    console.error("Error minting NFT for donation:", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to mint NFT" },
      { status: 500 }
    );
  }
}
