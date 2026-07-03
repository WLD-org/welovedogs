# We Love Dogs — Web App

Next.js 16 application for the WeLoveDogs donations platform: campaign discovery, Stellar USDC donations, Trustless Work escrow, Proof of Donation NFTs, and care provider dashboards.

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
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=

NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_STELLAR_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org

NEXT_PUBLIC_APP_NAME=We Love Dogs
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=

DONATION_BINDING=donation
POD_POAP_BINDING=pod_poap

NEXT_PUBLIC_TRUSTLESS_WORK_API_KEY=
NEXT_PUBLIC_PLATFORM_ADDRESS=
NEXT_PUBLIC_DISPUTE_RESOLVER_ADDRESS=
NEXT_PUBLIC_RELEASE_SIGNER_ADDRESS=
NEXT_PUBLIC_TRUSTLINE_ADDRESS=
```

See [`.env.example`](./.env.example) and the [root README](../../README.md) for the full list.

## Features

### Donations

- **Escrow** — funds held until expense proof is verified (Trustless Work)
- **Instant** — USDC sent directly to campaign Stellar address
- Sticky donation widget, wallet connect, on-chain recording via donation contract

### Campaigns & dogs

- Care providers create dog profiles and fundraising campaigns
- Categories: surgery, medication, food, shelter, rehabilitation, etc.
- Campaign updates, expense reporting, progress tracking

### POD NFTs

- Proof of Donation POAPs minted on Soroban after donations
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
│   └── api/                # Donation, POD, IPFS routes
├── components/             # UI and feature components
├── contexts/               # Wallet, Supabase, Soroban providers
├── hooks/                  # Donation, escrow, campaign hooks
├── lib/                    # Supabase, contracts, utilities
├── scripts/                # Seed and IPFS upload scripts
└── public/images/dogs/     # Local dog photo assets (also in Supabase Storage)
```

## Wallets

[`contexts/WalletsKitContext.tsx`](./contexts/WalletsKitContext.tsx) wraps Stellar Wallets Kit:

- Freighter, xBull, WalletConnect, and others
- Persists wallet selection in `localStorage`
- Auto-reconnect on page load

## Supabase

- **Auth** — email/password for donors and care providers
- **Tables** — `dogs`, `campaigns`, `care_providers`, `donors`, `transactions`, etc.
- **Storage** — `dog-images`, `profile-photos`, `campaign-updates`, `expense-proofs`
- **RLS** — public read for campaigns; owners write their own data

Client setup loads env from monorepo root and includes a dev mock when Supabase is not configured. See [`lib/supabase/`](./lib/supabase/).

## Smart contracts

| Contract | Purpose |
|----------|---------|
| `donation` | On-chain donation recording |
| `pod_poap` | Proof of Donation NFT minting |

Integration details: [`CONTRACTS_GUIDE.md`](./CONTRACTS_GUIDE.md) and [`NFT_SETUP.md`](./NFT_SETUP.md).

## API routes

| Route | Purpose |
|-------|---------|
| `/api/donation/record` | Record donation transaction |
| `/api/donation/stats` | Campaign donation statistics |
| `/api/pod-poap/mint` | Mint POD NFT |
| `/api/pod-poap/metadata` | NFT metadata |
| `/api/ipfs/upload-metadata` | Upload metadata to IPFS |

## Further reading

- [Root README](../../README.md) — product overview and monorepo setup
- [docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md) — system architecture
- [docs/backend/DATABASE_SCHEMA.md](../../docs/backend/DATABASE_SCHEMA.md) — database schema

---

_This application can be whitelabeled._
