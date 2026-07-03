# Donation Feature

Direct **USDC SPL donations on Solana** with a **1% platform commission**, recorded in Supabase and optionally rewarded with a POD NFT.

## Overview

| Piece | Location | Role |
|-------|----------|------|
| Transaction builder | `lib/solana/donation.ts` | 99% campaign / 1% platform split |
| Donation hook | `hooks/useDonation.ts` | Wallet sign + send |
| UI | `components/sticky-donation-widget.tsx` | Campaign page widget |
| Recording | `app/api/donation/record/route.ts` | Supabase persistence |
| Config | `lib/solana/config.ts` | Network, USDC mint, platform wallet |

There is **no on-chain donation registry contract**. Donations are native SPL transfers; Supabase indexes them for the UI.

## Donation split

```typescript
// lib/solana/donation.ts
PLATFORM_COMMISSION_RATE = 0.01  // 1%

$100 donation → $99.00 campaign + $1.00 platform
```

`calculateDonationSplit()` and `buildDonationTransaction()` handle the math and instruction building.

## Flow

```
1. Donor connects wallet (Reown AppKit)
2. useDonation.donate(campaignSolanaAddress, amount)
3. buildDonationTransaction():
   - createAssociatedTokenAccountIdempotent (campaign ATA)
   - createAssociatedTokenAccountIdempotent (platform ATA)
   - transfer 99% USDC → campaign
   - transfer 1% USDC → platform
4. Wallet signs → transaction confirmed on Solana
5. /donation-success → POST /api/donation/record
6. Optional: mint POD NFT via /api/nft/mint-for-donation
```

## Hook usage

```typescript
import { useDonation } from "@/hooks/useDonation";

const { donate, isLoading, isConnected } = useDonation();

const result = await donate(campaignSolanaAddress, "25");
// result.hash — Solana transaction signature
// result.campaignAmount — net to campaign
// result.platformFee — 1% commission
```

## UI components

### StickyDonationWidget

Primary donation UI on `/donate/[dogId]`. Requires:

- Connected wallet
- Campaign `solana_address` configured in Supabase

### DonationButton / DonationModal

Reusable donate CTAs used elsewhere in the app.

## API: record donation

**POST** `/api/donation/record`

```json
{
  "donorId": "uuid",
  "dogId": "uuid",
  "campaignId": "uuid",
  "txHash": "solana-signature",
  "amount": 25,
  "donorAddress": "donor-wallet-pubkey",
  "platformFee": 0.25
}
```

Inserts into `transactions` with `donation_type: "direct"` and `token_symbol: "USDC"`. Idempotent on `tx_hash`.

## Configuration

### Environment variables

```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_USDC_MINT=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
NEXT_PUBLIC_PLATFORM_WALLET=<platform-solana-pubkey>
```

### Campaign wallet

Each active campaign needs `campaigns.solana_address` set to the care provider's receiving wallet.

## Verification

Always verify donations on Solana Explorer using `tx_hash`:

- Devnet: `https://explorer.solana.com/tx/{signature}?cluster=devnet`
- Mainnet: `https://explorer.solana.com/tx/{signature}`

See [Donation Tracking & Verification](./DONATION_TRACKING_VERIFICATION.md).

## Troubleshooting

| Error | Fix |
|-------|-----|
| "Wallet not connected" | Connect via navbar / donation widget |
| "Platform wallet not configured" | Set `NEXT_PUBLIC_PLATFORM_WALLET` |
| "Campaign wallet not configured" | Set `solana_address` on the campaign |
| Insufficient funds | Donor needs USDC (and SOL for tx fees) |
| Transaction simulation failed | Check USDC ATA exists or RPC health |

## Related docs

- [Architecture](./ARCHITECTURE.md)
- [NFT Setup](../apps/web/NFT_SETUP.md)
- [Database Schema](./backend/DATABASE_SCHEMA.md)
