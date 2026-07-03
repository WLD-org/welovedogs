# Architecture Documentation

Solana-focused architecture for **We Love Dogs** — a transparent dog-rescue donations platform built with Next.js, Supabase, and on-chain USDC + POD NFTs.

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Layers](#architecture-layers)
3. [Technology Stack](#technology-stack)
4. [Solana Integration](#solana-integration)
5. [Data Flow](#data-flow)
6. [User Flows](#user-flows)
7. [Component Architecture](#component-architecture)
8. [API Routes](#api-routes)
9. [Security](#security)
10. [Deployment](#deployment)

## System Overview

We Love Dogs combines a familiar Web2 UX (profiles, campaigns, stories) with **Solana blockchain transparency**:

- Donors send **USDC SPL** directly to campaign wallets
- A **1% platform commission** is split in the same transaction
- Optional **Proof of Donation (POD) NFTs** are minted on Solana via Metaplex
- Campaign content, images, and progress live in **Supabase**

### Core Principles

- **Web2 UX, on-chain payments** — Supabase for stories; Solana for money movement
- **Direct donations only** — no escrow; funds reach campaigns immediately (minus platform fee)
- **Wallet choice** — Reown AppKit / WalletConnect supports Phantom, Solflare, and other Solana wallets
- **Verifiable** — every donation has a `tx_hash` linkable on Solana Explorer

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  Next.js 16 (React 19) + Tailwind CSS + shadcn/ui         │
│  - Server Components (SEO, campaign pages)                  │
│  - Client Components (wallet, donation widget, profiles)   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  - SolanaWalletProvider (Reown AppKit)                      │
│  - SupabaseProvider                                         │
│  - Hooks: useDonation, useSolanaWallet, useDonationNFT      │
│  - API routes: record donation, mint NFT, IPFS              │
└─────────────────────────────────────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
┌──────────────────────┐    ┌──────────────────────────────┐
│      Supabase        │    │         Solana               │
├──────────────────────┤    ├──────────────────────────────┤
│ PostgreSQL + RLS     │    │ USDC SPL transfers           │
│ Auth                 │    │ Metaplex POD NFTs            │
│ Storage (images)     │    │ WalletConnect (Reown AppKit) │
│ Transaction cache    │    │ Solana RPC + Explorer        │
└──────────────────────┘    └──────────────────────────────┘
```

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui |
| Package manager | Bun + Turborepo monorepo |
| Backend | Supabase (Postgres, Auth, Storage) |
| Blockchain | Solana (devnet / mainnet-beta) |
| Stablecoin | USDC SPL (`@solana/spl-token`) |
| Wallets | Reown AppKit + `@reown/appkit-adapter-solana` |
| NFTs | Metaplex Token Metadata (`@metaplex-foundation/mpl-token-metadata`) |
| Metadata storage | IPFS via Pinata |

## Solana Integration

### Configuration (`apps/web/lib/solana/config.ts`)

| Env var | Purpose |
|---------|---------|
| `NEXT_PUBLIC_SOLANA_NETWORK` | `devnet`, `testnet`, or `mainnet-beta` |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | RPC endpoint (defaults to public cluster URL) |
| `NEXT_PUBLIC_USDC_MINT` | USDC mint address for the active network |
| `NEXT_PUBLIC_PLATFORM_WALLET` | Receives 1% commission on each donation |

Default USDC mints:

- **Devnet**: `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`
- **Mainnet**: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`

### Donations (`apps/web/lib/solana/donation.ts`)

`buildDonationTransaction()` constructs a single Solana transaction that:

1. Creates associated token accounts for campaign + platform (idempotent)
2. Transfers **99%** USDC to the campaign wallet ATA
3. Transfers **1%** USDC to the platform wallet ATA

The donor signs via their connected wallet (`useSolanaWallet.signAndSendTransaction`).

### Wallets (`apps/web/lib/solana/appkit.ts`)

Reown AppKit is initialized with:

- `SolanaAdapter` + Wallet Standard detection
- Explicit Phantom and Solflare adapters
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` from [dashboard.reown.com](https://dashboard.reown.com)

`useWalletsKit` is a compatibility alias for `useSolanaWallet`.

### POD NFTs (`apps/web/lib/solana/nft.ts`)

Server-side mint authority (`POD_NFT_MINT_AUTHORITY_SECRET`) mints Metaplex NFTs:

- Symbol: `POD`
- Metadata URI: IPFS JSON (image + attributes)
- Recipient: donor's connected wallet address

`fetchPodNftsByOwner()` reads on-chain POD NFTs for profile sync.

### Explorer links (`apps/web/lib/utils/solana-explorer.ts`)

Transaction and account URLs use `explorer.solana.com` with the correct `cluster` query param.

## Data Flow

### Donation flow

```
Donor connects wallet (AppKit modal)
    → StickyDonationWidget / DonationButton
    → useDonation.donate(campaignAddress, amount)
    → buildDonationTransaction() — 99% campaign / 1% platform
    → wallet signs & sends transaction
    → /donation-success page
    → POST /api/donation/record — Supabase transactions row
    → Optional: POST /api/nft/mint-for-donation — Metaplex POD NFT
```

### NFT flow

```
Donation recorded (transactionId in Supabase)
    → useDonationNFT.mintNFTForDonation(donorId, transactionId)
    → POST /api/nft/mint-for-donation
        → Upload image + metadata to IPFS (Pinata)
        → mintPodNft() to donor wallet
        → Upsert donor_achievements (nft_token_id = mint address)
    → Donor profile: DonorNFTGallery + WalletPODSection
```

### Profile NFT sync

`getNFTAchievements()` in `apps/web/app/profile/donor/utils/nft-achievements.ts`:

1. Reads minted NFTs from `donor_achievements` (Supabase)
2. If empty, falls back to `fetchPodNftsByOwner(solana_address)` on-chain

## User Flows

### Donor

1. Browse `/donate` → select dog campaign
2. Connect Solana wallet
3. Enter USDC amount → confirm transaction
4. View success page → optionally mint POD NFT
5. Track history on `/profile/donor`

### Care provider

1. Register at `/register/care-provider`
2. Connect wallet on profile → save `solana_address`
3. Create dog + campaign with campaign `solana_address`
4. Receive USDC directly when donors contribute

## Component Architecture

### Provider tree (`apps/web/components/Providers.tsx`)

```
SupabaseProvider
  └─ SolanaWalletProvider  (Reown AppKit init)
       └─ {children}
```

### Key components

| Component | Role |
|-----------|------|
| `sticky-donation-widget.tsx` | Primary donation UI on campaign pages |
| `DonationButton` / `DonationModal` | Reusable donate CTAs |
| `WalletMenu` | Connected address, USDC/SOL balance |
| `Navbar` / `header` | Global connect button |
| `WalletConnection` | Care provider wallet save |
| `DonorNFTGallery` | DB + IPFS NFT display |
| `WalletPODSection` | Live on-chain POD list via `usePodPoap` |

### Key hooks

| Hook | Role |
|------|------|
| `useSolanaWallet` | Connect, disconnect, sign transactions |
| `useDonation` | Build and send USDC donation tx |
| `useDonationNFT` | Mint POD NFT after donation |
| `usePodPoap` | Fetch POD NFTs for connected wallet |
| `useSolanaAccount` | USDC + SOL balances |

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/donation/record` | POST | Persist donation in Supabase |
| `/api/donation/stats` | GET | Campaign donation statistics |
| `/api/nft/mint-for-donation` | POST | IPFS upload + Metaplex mint |
| `/api/pod-poap/mint` | POST | Generic POD mint (admin/testing) |
| `/api/pod-poap/tokens/[address]` | GET | List POD NFTs by wallet |
| `/api/pod-poap/metadata/[tokenId]` | GET | HTTP fallback metadata |
| `/api/ipfs/upload-metadata` | POST | Upload JSON to IPFS |

## Security

- **Supabase RLS** — public read for campaigns; owners write their data
- **Wallet signing** — donations require donor wallet approval; no server-side private keys for donations
- **NFT mint authority** — `POD_NFT_MINT_AUTHORITY_SECRET` is server-only; fund with SOL for mint fees
- **Idempotent recording** — `/api/donation/record` deduplicates by `tx_hash`
- **Address validation** — Solana `PublicKey` parsing before building transactions

## Deployment

### Vercel

- **Install**: `bun install --frozen-lockfile`
- **Build**: `bunx turbo run build --filter=web`
- **Output**: `apps/web/.next`

### Required production env vars

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Solana
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_SOLANA_RPC_URL=
NEXT_PUBLIC_USDC_MINT=
NEXT_PUBLIC_PLATFORM_WALLET=

# Wallets
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=

# NFT minting (server)
POD_NFT_MINT_AUTHORITY_SECRET=
PINATA_API_KEY=
PINATA_SECRET_API_KEY=
```

### Database migration

Apply `supabase/migrations/001_stellar_to_solana.sql` to rename `stellar_address` → `solana_address` and drop legacy escrow columns.

## Monorepo layout

```
welovedogs/
├── apps/web/           # Next.js application
├── packages/tsconfig/  # Shared TS config
├── supabase/           # Migrations + seed SQL
└── docs/               # This documentation
```

## Further reading

- [Getting Started](./GETTING_STARTED.md)
- [Donation Feature](./DONATION_FEATURE.md)
- [Donation Verification](./DONATION_TRACKING_VERIFICATION.md)
- [Database Schema](./backend/DATABASE_SCHEMA.md)
- [NFT Setup](../apps/web/NFT_SETUP.md)
