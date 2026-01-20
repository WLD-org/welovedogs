# Backend - Supabase

This directory contains the Supabase backend configuration for **We Love Dogs** - a Web3 crowdfunding platform built on Stellar blockchain.

## Overview

The backend uses Supabase to provide a **Web2-like user experience** while leveraging **Web3 smart contracts** for on-chain data tracking. The database stores user profiles, content, and UI metadata, while donations, NFTs, and escrow contracts are tracked on-chain via Stellar Soroban smart contracts.

## Design Philosophy

- **On-Chain**: Donations, NFTs, escrow contracts, transaction hashes (source of truth)
- **Off-Chain**: User profiles, dog profiles, campaigns, updates, expenses, quest system (Web2 UX)
- **Cache/Index**: Transaction references and NFT metadata cached for UI performance

## Database Schema

The database includes 10 tables:

### Core Tables

- **`care_providers`** - Care provider profiles (rescuer, shelter, veterinarian)
- **`donors`** - Donor profiles
- **`dogs`** - Dog profiles and metadata
- **`campaigns`** - Fundraising campaign metadata
- **`transactions`** - Cache/index of on-chain transactions (not source of truth)
- **`campaign_updates`** - Campaign progress posts
- **`campaign_expenses`** - Expense tracking with proof documents
- **`donor_achievements`** - NFT references (on-chain via POD POAP contract)
- **`quests`** - Gamification quest system
- **`donor_quest_progress`** - Quest progress tracking

All tables have **Row Level Security (RLS)** enabled with appropriate policies.

📖 **Full schema documentation**: See [DATABASE_SCHEMA.md](../../docs/backend/DATABASE_SCHEMA.md)

## Setup

### 1. Install Supabase CLI

```bash
brew install supabase/tap/supabase
```

### 2. Initialize Supabase

```bash
cd apps/backend
npx supabase init
```

### 3. Start Local Supabase

```bash
npm run dev
```

This starts a local Supabase instance with Docker.

### 4. Get Local Credentials

```bash
npm run status
```

Copy the credentials to `apps/web/.env.local`:

- API URL → `NEXT_PUBLIC_SUPABASE_URL`
- anon key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 5. Create Storage Buckets

Create the following storage buckets via Supabase Dashboard:

- **`dog-images`** - Dog profile images (public)
- **`profile-photos`** - User profile photos (public)
- **`campaign-updates`** - Campaign update images (public)
- **`expense-proofs`** - Expense proof documents (public)

### 6. Generate TypeScript Types

```bash
npm run types
```

This generates TypeScript types from the database schema in `apps/backend/types/database.types.ts`.

## Commands

| Command           | Description                                          |
| ----------------- | ---------------------------------------------------- |
| `npm run dev`     | Start local Supabase instance                        |
| `npm run stop`    | Stop local Supabase instance                         |
| `npm run status`  | Show connection details and credentials              |
| `npm run reset`   | Reset database to clean state (includes seed data)   |
| `npm run seed`    | Alias for `reset` - resets and seeds database        |
| `npm run types`   | Generate TypeScript types from database schema       |
| `npm run migrate` | Apply migrations to linked database (local or cloud) |

## Migrations

The database schema is managed through migrations. All migrations have been applied and are ready to use.

### Create a New Migration

```bash
npx supabase migration new <migration_name>
```

### Apply Migrations

```bash
npm run migrate
```

This applies migrations to your linked database (local when running `npm run dev`, or cloud if linked).

## Connecting to Production

To link to a production Supabase project:

```bash
npx supabase link --project-ref <project-ref>
```

Once linked, you can push migrations:

```bash
npm run migrate
```

## Security

- **Row Level Security (RLS)**: All tables have RLS enabled
- **Public Read**: Profiles and campaigns are publicly readable (transparency)
- **Owner Write**: Users can only modify their own data
- **Authenticated Insert**: Transaction cache requires authentication
- **Foreign Keys**: Proper cascading on delete

## Integration with Smart Contracts

### Donations

- Donations are tracked on-chain via the `donation` Soroban contract
- The `transactions` table caches transaction hashes and metadata for UI performance
- Always verify transactions via `tx_hash` on Stellar Explorer

### NFTs

- NFTs are minted on-chain via the `pod-poap` Soroban contract
- The `donor_achievements` table stores NFT references (`nft_token_id`, `blockchain_tx_hash`)
- Source of truth is on-chain; database is for UI caching

### Escrow

- Escrow contracts are managed by Trustless Work
- Campaigns store `escrow_id` as a reference
- Escrow state is tracked on-chain, not in the database

## Data Flow

1. **User Registration** → Stored in `care_providers` or `donors` table
2. **Campaign Creation** → Stored in `campaigns` table
3. **Donation Made** → Recorded on-chain → Cached in `transactions` table
4. **NFT Minted** → Minted on-chain → Reference cached in `donor_achievements` table
5. **Campaign Updates** → Stored in `campaign_updates` table (not on-chain)

## Troubleshooting

### Database Not Starting

- Ensure Docker Desktop is running
- Check if ports 54321-54325 are available
- Try `npm run stop` then `npm run dev`

### RLS Policy Errors

- Verify user is authenticated: `auth.uid()` should not be null
- Check RLS policies match your use case
- Review policies in [DATABASE_SCHEMA.md](../../docs/backend/DATABASE_SCHEMA.md)

### Type Generation Fails

- Ensure Supabase is running: `npm run status`
- Check database connection in `.env.local`
- Verify migrations are applied: `npm run migrate`

## Seed Data

The database includes seed data for development and testing. However, due to foreign key constraints with auth users, seed data is provided in two ways:

### ✅ Automatic Seed (Already Applied)

- **3 quests** for gamification - automatically seeded via migration
  - First Donation (badge reward)
  - Hero Donor (NFT reward for $100+ donations)
  - Dog Supporter (title reward for supporting 5 dogs)

### 📝 Manual Seed (Optional - For Full Demo Data)

To seed care providers, dogs, and campaigns for a complete demo experience:

1. **Create auth users** via Supabase Dashboard:
   - Go to **Authentication > Users > Add User**
   - Create users with emails: `sarah@example.com`, `info@hopeshelter.org`, `dr.chen@vetclinic.com`
   - The seed.sql file will automatically find user IDs by email

2. **Run the seed SQL file**:

   ```bash
   # Option 1: Via Supabase SQL Editor (Recommended)
   # 1. Go to Supabase Dashboard > SQL Editor > New Query
   # 2. Open apps/backend/seed.sql and copy contents
   # 3. Paste and click "Run"

   # Option 2: Via psql command line
   psql <your-connection-string> < seed.sql
   ```

The seed file (`seed.sql`) includes:

- **3 care providers** (rescuer, shelter, veterinarian)
- **4 dogs** with various conditions and needs
- **3 active campaigns** with different funding progress (64%, 15%, 93%)
- **Campaign updates** showing progress
- **Campaign expenses** with proof documents

📖 **Seed Data Documentation**: See [SEED_DATA.md](../../docs/backend/SEED_DATA.md) for details.

📄 **Seed SQL File**: See [seed.sql](./seed.sql) for the complete seed script.

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Database Schema Documentation](../../docs/backend/DATABASE_SCHEMA.md)
- [Storage Setup Guide](../../docs/backend/STORAGE_SETUP.md)
- [Seed Data Documentation](../../docs/backend/SEED_DATA.md)
