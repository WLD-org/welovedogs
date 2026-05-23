# Getting Started

Developer setup guide for **We Love Dogs** — the transparent donations platform built with Next.js, Supabase, and Stellar.

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | 22+ | Required by root `package.json` |
| npm | 10+ | Workspaces and Turborepo |
| Stellar CLI | latest | Only for contract development |
| Rust + Cargo | latest | Only for Soroban contracts |
| Docker Desktop | latest | Optional — for local Supabase |

**Install Stellar CLI:**

```bash
cargo install --locked stellar-cli --features opt
```

**Install Supabase CLI (optional):**

```bash
brew install supabase/tap/supabase
```

## Quick setup

### 1. Install dependencies

```bash
git clone <repository-url>
cd welovedogs
npm install
```

### 2. Configure environment

Environment variables load from the **monorepo root** `.env` (see `apps/web/next.config.ts`). You can also use `apps/web/.env.local`.

```bash
cp apps/web/.env.example .env
```

Minimum variables for local development:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=

NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_STELLAR_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org

NEXT_PUBLIC_APP_NAME=We Love Dogs
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For hosted Supabase, use your project URL and publishable key from the Supabase Dashboard. For local Supabase, use `http://localhost:54321` and the anon key from `supabase status`.

See the [root README](../README.md#environment-variables) for the full list (Trustless Work, contract bindings, WalletConnect).

### 3. Start the web app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

You should see the landing page: hero, crisis statistics, bridge section, and live dog campaign cards.

### 4. Seed sample data (optional)

Costa Rica sample dogs and care providers live in `supabase/seed/`:

1. Upload dog photos to Supabase Storage:

   ```bash
   cd apps/web
   npx tsx scripts/seed-costa-rica-dogs.ts --upload-only
   ```

2. Apply seed SQL via Supabase Dashboard (SQL editor) or CLI:
   - `supabase/seed/costa_rica_care_providers.sql`
   - `supabase/seed/costa_rica_dogs.sql`

3. Verify campaigns appear on `/donate`.

## Project structure

```
welovedogs/
├── apps/
│   └── web/                 # Next.js 16 app (App Router)
├── contracts/               # Soroban contracts (donation, pod-poap)
├── packages/
│   └── tsconfig/            # Shared TypeScript config
├── supabase/
│   └── seed/                # SQL seed scripts
└── docs/                    # Documentation
```

## Common commands

### Root

```bash
npm run dev      # Start web app via Turborepo
npm run build    # Production build
npm run lint     # Lint all workspaces
npm run format   # Prettier
```

### Web app (`apps/web`)

```bash
npm run dev      # http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint
npx tsx scripts/seed-costa-rica-dogs.ts --upload-only
```

### Contracts (`contracts/`)

```bash
npm run build    # Compile Soroban WASM
npm run test     # Run contract tests
npm run optimize # Optimize WASM size
```

## First tasks

### Browse the product

1. **Landing** — `/` — hero, crisis stats, dog cards
2. **Donate** — `/donate` — filter and browse campaigns
3. **How we work** — `/how-we-work` — donation transparency explainer
4. **Care providers** — `/care-providers` — rescuers and shelters directory

### Connect a wallet

Install [Freighter](https://www.freighter.app/) or another Stellar wallet. Use testnet USDC for donation flows.

### Build contracts

```bash
cd contracts
npm run build
npm run test
```

See [contracts/DONATION_CONTRACT_SETUP.md](./contracts/DONATION_CONTRACT_SETUP.md) for deployment.

## Local Supabase (optional)

If you prefer a local database instead of a hosted project:

```bash
supabase init    # once, from repo root if not already initialized
supabase start
supabase status  # copy URL and anon key to .env
```

Supabase Studio runs at [http://localhost:54323](http://localhost:54323).

## Troubleshooting

### Port 3000 in use

```bash
cd apps/web
PORT=3001 npm run dev
```

### Supabase connection errors

- Confirm `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in root `.env`
- Without Supabase, the app falls back to a dev mock client (limited functionality)

### Contract build fails

```bash
rustup target add wasm32-unknown-unknown
cd contracts && npm run build
```

### Dogs not showing on `/donate`

- Confirm seed SQL was applied
- Check RLS policies allow public read on `dogs` and `campaigns`
- Verify dog images uploaded to `dog-images/seed/` bucket

## Next steps

- [Architecture](./ARCHITECTURE.md) — system design and data flows
- [Donation feature](./DONATION_FEATURE.md) — escrow vs instant donations
- [Database schema](./backend/DATABASE_SCHEMA.md) — tables and RLS
- [Web app README](../apps/web/README.md) — routes, API, and features

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Stellar Docs](https://developers.stellar.org/)
- [Soroban Docs](https://soroban.stellar.org/docs)
- [Trustless Work](https://trustless.work/)
