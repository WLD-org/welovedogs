# We Love Dogs

A transparent donations platform that connects people who want to help with the rescuers, shelters, and veterinarians saving dogs on the ground. Built on **Next.js**, **Supabase**, and the **Stellar** blockchain.

WeLoveDogs started in **Costa Rica** and is designed to scale across Latin America — making every donation traceable, every story visible, and every hero on the front lines easier to support.

## Why it exists

Millions of dogs are abandoned every year, faster than rescuers can save them. Donors want to help, but often lack visibility into where their money goes. Care providers do the hardest work with too little funding and recognition.

WeLoveDogs closes that gap:

- **Donors** discover real dogs, read their stories, and give with confidence.
- **Care providers** run campaigns, report expenses, and show impact.
- **The platform** combines Web2 UX with on-chain transparency (Stellar USDC, escrow, Proof of Donation NFTs).

## Product experience

### Landing page

The homepage tells the full story before asking for a donation:

1. **Hero** — mission, trust stats, and calls to action
2. **The crisis** — stray-dog population data by country (animated ticker)
3. **Bridge** — how transparent donations connect to real rescue work
4. **Dog cards** — live campaigns you can support today

### For donors

- Browse and filter dogs on `/donate`
- **Match Me** — random dog matcher for undecided donors
- Donate via **Escrow** (funds released with expense proof) or **Instant** (direct to campaign wallet)
- Collect **Proof of Donation (POD)** NFTs
- Track giving history on the donor profile

### For care providers

- Register as a **rescuer**, **shelter**, or **veterinarian**
- Create dog profiles with photos, stories, and medical status
- Launch fundraising campaigns with goal amounts and fund categories
- Post campaign updates and report expenses with proof
- Optional **Trustless Work** escrow per campaign

### Other pages

| Route | Purpose |
|-------|---------|
| `/how-we-work` | How donations flow from gift to recovery |
| `/care-providers` | Directory of heroes and organizations |
| `/donate/[dogId]` | Individual dog campaign and donation flow |
| `/about` | Founders and mission |

## Features

- **Dog campaigns** — goals, categories (surgery, food, shelter, etc.), progress tracking
- **Stellar USDC donations** — testnet and mainnet via **Stellar Wallets Kit** (Freighter, xBull, WalletConnect)
- **Escrow donations** — **Trustless Work** smart contracts; funds released after verified expenses
- **Cross-chain donations** *(planned)* — **Rozo** intent-based payments from any supported chain
- **Cash fiat ramps** *(planned)* — **MoneyGram Ramps** SEP-24 cash in/out for USDC on Stellar
- **Bank fiat ramps** *(planned)* — **Etherfuse** MXN ↔ USDC and stablebond swaps (Latin America)
- **Treasury yield** *(planned)* — **DeFindex** vaults and/or Etherfuse stablebonds for idle campaign USDC
- **Instant donations** — direct transfer to campaign Stellar address
- **POD POAP NFTs** — Soroban minted commemorative tokens for donors
- **Care provider dashboards** — dogs, campaigns, updates, expenses, wallet connection
- **Supabase auth & storage** — profiles, images, RLS-protected data
- **On-chain + off-chain** — blockchain for money movement; database for stories and UX

## Monorepo structure

```
welovedogs/
├── apps/
│   └── web/                 # Next.js 16 app (App Router, React 19)
├── contracts/               # Soroban smart contracts (donation, pod-poap)
├── packages/
│   └── tsconfig/            # Shared TypeScript config
├── supabase/
│   └── seed/                # SQL seed scripts (care providers, dogs)
└── docs/                    # Architecture, setup, and feature docs
```

## Quick start

### Prerequisites

- **Bun 1.2+** ([install](https://bun.sh)) — package manager and script runner
- **Node.js 22+** — required by Next.js at runtime
- Supabase project (hosted or local CLI)

### Install and run

```bash
git clone <repository-url>
cd welovedogs
bun install

# Configure environment (monorepo root — loaded by apps/web/next.config.ts)
cp apps/web/.env.example .env
# Edit .env with Supabase, Solana, and WalletConnect values

# Start the web app
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Seed sample data (Costa Rica)

SQL seeds live in `supabase/seed/`:

- `costa_rica_care_providers.sql` — shelters and rescuers
- `costa_rica_dogs.sql` — dog profiles and active campaigns

Upload dog photos to Supabase Storage:

```bash
cd apps/web
bun scripts/seed-costa-rica-dogs.ts --upload-only
```

Apply the dog seed migration via Supabase (Dashboard SQL editor or MCP/CLI), then verify dogs appear on `/donate`.

## Environment variables

Create a `.env` file at the **repository root** (or `apps/web/.env.local`). The web app loads the monorepo root env automatically.

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
# or NEXT_PUBLIC_SUPABASE_ANON_KEY / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

# Stellar
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_STELLAR_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org

# App
NEXT_PUBLIC_APP_NAME=We Love Dogs
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Wallets
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=

# Contract bindings
DONATION_BINDING=donation
POD_POAP_BINDING=pod_poap

# Trustless Work (escrow)
NEXT_PUBLIC_TRUSTLESS_WORK_API_KEY=
NEXT_PUBLIC_PLATFORM_ADDRESS=
NEXT_PUBLIC_DISPUTE_RESOLVER_ADDRESS=
NEXT_PUBLIC_RELEASE_SIGNER_ADDRESS=
NEXT_PUBLIC_TRUSTLINE_ADDRESS=
```

See [`apps/web/README.md`](./apps/web/README.md) and [`docs/GETTING_STARTED.md`](./docs/GETTING_STARTED.md) for full details.

## Scripts

From the repo root:

```bash
bun run dev      # Start web app (Turborepo)
bun run build    # Production build
bun run lint     # Lint all workspaces
bun run format   # Prettier
```

From `apps/web`:

```bash
bun run dev      # Next.js dev server (Turbopack + Bun runtime)
bun run build    # Production build
bun run lint     # ESLint
bun scripts/seed-costa-rica-dogs.ts --upload-only
```

From `contracts/`:

```bash
npm run build    # Build Soroban WASM
npm run test     # Contract tests
```

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui |
| Backend | Supabase (Postgres, Auth, Storage, Realtime) |
| Wallets | Stellar Wallets Kit (`@creit.tech/stellar-wallets-kit`) |
| Blockchain | Stellar, Soroban, USDC |
| Escrow | Trustless Work (`@trustless-work/escrow`) |
| Fiat ramps *(planned)* | MoneyGram Ramps (SEP-24), Etherfuse (FX API) |
| Payments *(planned)* | Rozo (cross-chain intents) |
| Yield *(planned)* | DeFindex (Soroban vaults), Etherfuse stablebonds |
| NFTs | POD POAP Soroban contract + IPFS metadata |
| Monorepo | Turborepo, Bun workspaces |

## Documentation

| Doc | Description |
|-----|-------------|
| [docs/README.md](./docs/README.md) | Documentation index |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System architecture and data flows |
| [docs/GETTING_STARTED.md](./docs/GETTING_STARTED.md) | Developer setup guide |
| [docs/DONATION_FEATURE.md](./docs/DONATION_FEATURE.md) | Donation system |
| [docs/backend/DATABASE_SCHEMA.md](./docs/backend/DATABASE_SCHEMA.md) | Database schema |
| [apps/web/README.md](./apps/web/README.md) | Web app details |
| [apps/web/CONTRACTS_GUIDE.md](./apps/web/CONTRACTS_GUIDE.md) | Smart contract integration |

## Donation flow (summary)

**Escrow:** Donor → escrow contract → care provider submits expense proof → release signer approves → funds released → optional POD NFT.

**Instant:** Donor → USDC directly to campaign Stellar address → optional POD NFT.

All transactions are verifiable on the Stellar network. Campaign metadata, stories, and images live in Supabase.

## Deployment

The web app deploys to **Vercel** (or any Node.js host). Required production env vars: Supabase URL/keys, Stellar network config, contract bindings, Trustless Work addresses, WalletConnect project ID.

```bash
cd apps/web && bun run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and run `bun run lint`
4. Open a pull request

## License

ISC

## Acknowledgments

- [Stellar Development Foundation](https://www.stellar.org/)
- [Supabase](https://supabase.com/)
- [Trustless Work](https://trustless.work/)
- [OpenZeppelin Stellar Contracts](https://github.com/OpenZeppelin/stellar-contracts)

---

**Built with care for dogs — and the people who rescue them.**
