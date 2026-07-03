# We Love Dogs — Web App

Next.js 16 application for the WeLoveDogs donations platform: campaign discovery, Solana USDC donations, Proof of Donation NFTs, and care provider dashboards.

## Getting started

```bash
# From repo root
bun install
cp apps/web/.env.example .env   # or use an existing root .env
bun run dev
```

Environment variables are loaded from the **monorepo root** `.env` (see `next.config.ts`). You can also use `apps/web/.env.local`.

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
bun run dev      # Development server (Turbopack + Bun runtime)
bun run build    # Production build
bun run start    # Production server
bun run lint     # ESLint

# Seed helpers
bun scripts/seed-costa-rica-dogs.ts --upload-only
```

## Key routes

| Route | Description |
|-------|-------------|
| `/` | Landing — hero, crisis stats, bridge, dog cards |
| `/donate` | All active dog campaigns |
| `/donate/[dogId]` | Campaign page + donation widget |
| `/how-we-work` | Donation impact and transparency explainer |
| `/care-providers` | Heroes and organizations directory |
| `/profile/care-provider` | Care provider dashboard |
| `/profile/donor` | Donor profile and POD gallery |
| `/register/donor` | Donor registration |
| `/register/care-provider` | Care provider registration |

## Environment

Required variables (set in root `.env` or `apps/web/.env.local`):

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_USDC_MINT=
NEXT_PUBLIC_PLATFORM_WALLET=

NEXT_PUBLIC_APP_NAME=We Love Dogs
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=

POD_NFT_MINT_AUTHORITY_SECRET=
PINATA_API_KEY=
PINATA_SECRET_API_KEY=
```

See [`.env.example`](./.env.example) and the [root README](../../README.md) for the full list.

## Features

### Donations

- **Direct USDC** — SPL transfers to campaign wallets (99% campaign / 1% platform fee)
- Sticky donation widget, WalletConnect wallet connect, on-chain recording in Supabase

### Campaigns & dogs

- Care providers create dog profiles and fundraising campaigns
- Categories: surgery, medication, food, shelter, rehabilitation, etc.
- Campaign updates, expense reporting, progress tracking

### POD NFTs

- Proof of Donation NFTs minted on Solana (Metaplex) after donations
- Donor gallery with achievements and metadata from IPFS

### Landing & narrative

- `components/hero.tsx` — centered hero with trust stats and CTAs
- `components/landing/crisis-section.tsx` — country stray-dog statistics
- `components/landing/bridge.tsx` — problem → solution bridge
- `components/landing/hero-paws.tsx` — floating paw particle effect
- `components/how-we-work/` — transparency and donation impact pages

## Project layout

```
apps/web/
├── app/                    # Next.js App Router pages and API routes
│   ├── page.tsx            # Landing page
│   ├── donate/             # Campaign listing and detail
│   ├── how-we-work/
│   ├── care-providers/
│   ├── profile/            # Donor & care provider dashboards
│   └── api/                # Donation, POD NFT, IPFS routes
├── components/             # UI and feature components
├── contexts/               # Solana wallet, Supabase providers
├── hooks/                  # Donation, wallet, campaign hooks
├── lib/                    # Supabase, Solana, utilities
├── scripts/                # Seed and IPFS upload scripts
└── public/images/dogs/     # Local dog photo assets (also in Supabase Storage)
```

## Wallets

[`contexts/SolanaWalletContext.tsx`](./contexts/SolanaWalletContext.tsx) initializes **Reown AppKit** (WalletConnect) for Solana:

- Phantom, Solflare, and any WalletConnect-compatible Solana wallet
- Wallet Standard auto-detection
- Connect via navbar, donation widget, and profile pages

## Supabase

- **Auth** — email/password for donors and care providers
- **Tables** — `dogs`, `campaigns`, `care_providers`, `donors`, `transactions`, etc.
- **Storage** — `dog-images`, `profile-photos`, `campaign-updates`, `expense-proofs`
- **RLS** — public read for campaigns; owners write their own data

Client setup loads env from monorepo root and includes a dev mock when Supabase is not configured. See [`lib/supabase/`](./lib/supabase/).

## Solana integration

| Module | Purpose |
|--------|---------|
| `lib/solana/donation.ts` | USDC SPL transfer builder (99%/1% split) |
| `lib/solana/nft.ts` | Metaplex POD NFT mint + fetch by owner |
| `lib/solana/appkit.ts` | WalletConnect / Reown AppKit config |

NFT setup: [`NFT_SETUP.md`](./NFT_SETUP.md).  
Pre-launch checklist: [`DEPLOYMENT_CHECK.md`](./DEPLOYMENT_CHECK.md).

## API routes

| Route | Purpose |
|-------|---------|
| `/api/donation/record` | Record donation transaction |
| `/api/donation/stats` | Campaign donation statistics |
| `/api/nft/mint-for-donation` | Mint POD NFT after donation |
| `/api/pod-poap/mint` | Generic POD NFT mint |
| `/api/pod-poap/tokens/[address]` | List POD NFTs by wallet |
| `/api/ipfs/upload-metadata` | Upload metadata to IPFS |

## Further reading

- [Root README](../../README.md) — product overview and monorepo setup
- [docs/backend/DATABASE_SCHEMA.md](../../docs/backend/DATABASE_SCHEMA.md) — database schema

---

_This application can be whitelabeled._
