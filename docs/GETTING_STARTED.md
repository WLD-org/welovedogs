# Getting Started

Developer setup for **We Love Dogs** — Next.js, Supabase, and **Solana**.

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Bun | 1.2+ | Package manager and script runner ([install](https://bun.sh)) |
| Node.js | 22+ | Required by Next.js at runtime |
| Docker Desktop | latest | Optional — local Supabase |

## Quick setup

### 1. Install dependencies

```bash
git clone <repository-url>
cd welovedogs
bun install
```

### 2. Configure environment

Environment variables load from the **monorepo root** `.env` (see `apps/web/next.config.ts`). You can also use `apps/web/.env.local`.

```bash
cp apps/web/.env.example .env
```

Minimum for local development:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_USDC_MINT=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
NEXT_PUBLIC_PLATFORM_WALLET=<your-platform-solana-address>

NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<from dashboard.reown.com>

NEXT_PUBLIC_APP_NAME=We Love Dogs
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For NFT minting in development, also set:

```env
POD_NFT_MINT_AUTHORITY_SECRET=<base58-secret-key>
PINATA_API_KEY=
PINATA_SECRET_API_KEY=
```

See [apps/web/.env.example](../apps/web/.env.example) and the [root README](../README.md#environment-variables).

### 3. Start the web app

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Seed sample data (optional)

Costa Rica sample data lives in `supabase/seed/`:

```bash
cd apps/web
bun scripts/seed-costa-rica-dogs.ts --upload-only
```

Apply seed SQL via Supabase Dashboard or CLI, then verify campaigns on `/donate`.

## Project structure

```
welovedogs/
├── apps/web/           # Next.js 16 app
├── packages/tsconfig/  # Shared TypeScript config
├── supabase/           # Migrations + seed SQL
└── docs/               # Documentation
```

## Common commands

### Root

```bash
bun run dev      # Start web app (Turborepo)
bun run build    # Production build
bun run lint     # Lint workspaces
bun run format   # Prettier
```

### Web app (`apps/web`)

```bash
bun run dev      # http://localhost:3000 (Turbopack)
bun run build    # Production build
bun run lint     # ESLint
bun run upload-pod-images   # Pre-upload POD images to IPFS
```

## First tasks

### Browse the product

1. **Landing** — `/`
2. **Donate** — `/donate`
3. **How we work** — `/how-we-work`
4. **Care providers** — `/care-providers`

### Connect a Solana wallet

1. Set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
2. Click **Connect Wallet** in the navbar
3. Choose Phantom, Solflare, or another WalletConnect-compatible wallet
4. Use devnet USDC in the donor wallet for test donations

### Test a donation

1. Ensure a campaign has a `solana_address` configured
2. Set `NEXT_PUBLIC_PLATFORM_WALLET` to your platform fee recipient
3. Donate from a campaign page → confirm in wallet
4. Verify the transaction on [Solana Explorer (devnet)](https://explorer.solana.com/?cluster=devnet)

## Local Supabase (optional)

```bash
supabase start
supabase status   # copy URL and anon key to .env
```

Studio: [http://localhost:54323](http://localhost:54323)

Apply migration `supabase/migrations/001_stellar_to_solana.sql` if upgrading an existing database.

## Troubleshooting

### Port 3000 in use

```bash
cd apps/web
PORT=3001 bun run dev
```

### Wallet connect fails

- Confirm `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set
- Check browser console for AppKit errors

### Donation fails

- Donor needs devnet USDC in their wallet ATA
- Campaign and platform wallets must be valid Solana addresses
- RPC URL must match `NEXT_PUBLIC_SOLANA_NETWORK`

### NFT mint returns 503

- Set `POD_NFT_MINT_AUTHORITY_SECRET` on the server
- Fund the mint authority wallet with devnet SOL

## Next steps

- [Architecture](./ARCHITECTURE.md) — system design
- [Donation feature](./DONATION_FEATURE.md) — USDC flow
- [Donation verification](./DONATION_TRACKING_VERIFICATION.md) — on-chain checks
- [Database schema](./backend/DATABASE_SCHEMA.md)
- [NFT setup](../apps/web/NFT_SETUP.md)

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Solana Docs](https://solana.com/docs)
- [Reown AppKit](https://docs.reown.com/appkit/overview)
