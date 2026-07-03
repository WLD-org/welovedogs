# NFT Integration Setup Guide

This guide explains how the Proof of Donation (POD) NFT system works on Solana and how to configure it.

## Overview

The NFT system integrates with the donation tracking flow to mint commemorative POD NFTs after donors make contributions. Metadata and images are stored on IPFS (Pinata) and NFTs are minted on Solana using Metaplex Token Metadata.

## Features

- **IPFS Integration**: NFT metadata and images uploaded to IPFS via Pinata
- **Post-Donation Minting**: Donors can mint an NFT from the donation success page
- **Quest Integration**: NFTs linked to donor achievements in Supabase
- **17 Unique POD Images**: AI-generated artwork for different donation tiers
- **Metaplex NFTs**: Standard Solana NFTs with symbol `POD`

## Environment Variables

Add these to your `.env.local`:

```env
# Solana (see .env.example for full list)
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# POD NFT mint authority (server-side only — never expose the secret to the client)
POD_NFT_MINT_AUTHORITY_SECRET=<base58 or JSON array secret key>
POD_NFT_MINT_AUTHORITY_PUBLIC_KEY=<optional, for display>
NEXT_PUBLIC_POD_NFT_MINT_AUTHORITY=<optional public key for UI>
NEXT_PUBLIC_POD_COLLECTION_MINT=<optional Metaplex collection mint>

# IPFS (Pinata)
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_API_KEY=your_pinata_secret_api_key
NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs
```

### Mint authority setup

1. Generate a Solana keypair (or use an existing one).
2. Set `POD_NFT_MINT_AUTHORITY_SECRET` to the base58-encoded secret key or JSON byte array.
3. Fund the mint authority wallet with SOL on devnet/mainnet to pay mint transaction fees.
4. Optionally set `POD_NFT_MINT_AUTHORITY_PUBLIC_KEY` for display in the donor profile.

## Getting Pinata API Keys

1. Sign up at [Pinata](https://www.pinata.cloud/)
2. Go to API Keys
3. Create a key with `pinFileToIPFS` and `pinJSONToIPFS` permissions
4. Copy the API Key and Secret to `.env.local`

## Pre-uploading POD Images (Recommended)

```bash
cd apps/web
bun run upload-pod-images
```

This uploads all 17 POD images to IPFS and saves hashes to `lib/utils/pod-ipfs-mapping.json`, making minting faster.

## NFT Minting Flow

1. **Donation**: User donates USDC via direct Solana transfer (99% campaign / 1% platform).
2. **Record**: Transaction saved in Supabase via `/api/donation/record`.
3. **Mint option**: Donation success page shows "Mint Proof of Donation NFT".
4. **IPFS**: POD image and metadata JSON uploaded to IPFS.
5. **Mint**: Server mints Metaplex NFT to donor wallet via `mintPodNft()`.
6. **Achievement**: `donor_achievements` updated with mint address and tx signature.

## API Endpoints

### `POST /api/nft/mint-for-donation`

Mints an NFT for a specific donation transaction.

**Request:**

```json
{
  "donorId": "uuid",
  "transactionId": "uuid",
  "donorAddress": "Solana wallet address"
}
```

**Response:**

```json
{
  "ok": true,
  "hash": "mint_tx_signature",
  "mintAddress": "NFT_mint_address",
  "tokenId": "NFT_mint_address",
  "tokenUri": "ipfs://Qm...",
  "explorerUrl": "https://explorer.solana.com/tx/..."
}
```

### `POST /api/pod-poap/mint`

Generic admin mint endpoint (testing / manual mints).

### `GET /api/pod-poap/tokens/[address]`

Lists POD NFTs owned by a Solana wallet address.

### `GET /api/pod-poap/metadata/[tokenId]`

HTTP fallback metadata by image index (used when IPFS upload fails).

## NFT Metadata Structure

```json
{
  "name": "Proof of Donation - Dog Name",
  "description": "Commemorative Proof of Donation NFT...",
  "image": "ipfs://Qm...",
  "attributes": [
    { "trait_type": "Collection", "value": "Proof of Donation" },
    { "trait_type": "Series", "value": "Aurora" },
    { "trait_type": "Donation Amount", "value": "$50.00" },
    { "trait_type": "Dog", "value": "Dog Name" },
    { "trait_type": "Network", "value": "Solana" }
  ],
  "external_url": "https://..."
}
```

## UI Integration

- **Donation success**: Mint button via `useDonationNFT`
- **Donor profile**: `DonorNFTGallery` (DB + server blockchain sync) and `WalletPODSection` (live wallet view via `usePodPoap` + `PODGallery`)
- **Explorer links**: Solana Explorer via `lib/utils/solana-explorer.ts`

## Troubleshooting

### NFT minting returns 503

- `POD_NFT_MINT_AUTHORITY_SECRET` is not set on the server.

### Mint transaction fails

- Mint authority wallet has insufficient SOL for fees.
- Invalid secret key format (use base58 or JSON byte array).
- RPC URL unreachable or rate-limited.

### IPFS upload fails

- Check Pinata API keys and permissions.
- System falls back to HTTP metadata URLs when IPFS fails.

### Wallet shows no PODs

- NFTs are filtered by symbol `POD` on-chain.
- Ensure the donor wallet address matches the mint recipient.
- Use "Refresh" in the donor profile wallet section.

## Key Files

| File | Purpose |
|------|---------|
| `lib/solana/nft.ts` | Metaplex mint + fetch by owner |
| `app/api/nft/mint-for-donation/route.ts` | Donation-linked mint |
| `hooks/useDonationNFT.ts` | Client mint hook |
| `hooks/usePodPoap.ts` | Fetch wallet PODs |
| `components/NFT/PODGallery.tsx` | On-chain POD gallery UI |
