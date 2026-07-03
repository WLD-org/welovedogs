# Database Schema Documentation

## Design Philosophy

This schema supports a **Web2-like UX** with **Solana on-chain payments** and NFT references. The database stores:

1. **User profiles and content** — not on-chain
2. **UI metadata and caching** — for performance
3. **References to on-chain data** — transaction signatures, NFT mint addresses

## On-Chain vs Off-Chain Data

### Stored on Solana (source of truth)

- **USDC donation transfers** — SPL token instructions in the transaction
- **POD NFTs** — Metaplex mint addresses and metadata URIs
- **Transaction signatures** — immutable on Solana

### Stored off-chain (Supabase)

- **User profiles** — care providers, donors
- **Dog profiles** — stories, images, metadata
- **Campaigns** — goals, descriptions, status, `solana_address`
- **Campaign updates & expenses** — content and proof documents
- **Quest system** — gamification metadata
- **Transaction index** — cache of on-chain donations for UI queries
- **Achievement index** — NFT mint addresses + IPFS metadata URLs

## Tables Overview

### 1. `care_providers`

**Purpose**: Care provider profiles (rescuer, shelter, veterinarian)

**Key Fields**:

- `auth_user_id` — links to Supabase auth
- `type` — rescuer, shelter, or veterinarian
- `solana_address` — wallet for receiving donations
- Profile info, social media, location

**RLS**: Public read, owners can write

### 2. `donors`

**Purpose**: Donor profiles

**Key Fields**:

- `auth_user_id` — links to Supabase auth
- `solana_address` — connected donation wallet (optional)
- Profile info

**RLS**: Public read, owners can write

### 3. `dogs`

**Purpose**: Dog profiles and metadata

**Key Fields**:

- `care_provider_id` — owner
- `images` — array of image URLs
- `story`, `current_condition` — content

**RLS**: Public read, care providers can write

### 4. `campaigns`

**Purpose**: Fundraising campaign metadata

**Key Fields**:

- `dog_id` — associated dog
- `care_provider_id` — campaign owner
- `goal`, `raised`, `spent` — cached aggregates (updated from transactions)
- `solana_address` — campaign wallet receiving USDC

**RLS**: Public read, care providers can write

### 5. `transactions`

**Purpose**: Index of on-chain donations for UI and analytics

**Key Fields**:

- `tx_hash` — **Solana transaction signature** (unique, source of truth)
- `donor_id`, `campaign_id`, `dog_id` — references
- `usd_value`, `donation_type` — `direct` for Solana USDC donations
- `donor_address` — donor wallet pubkey
- `explorer_url` — Solana Explorer link
- `token_symbol` — `USDC`

**RLS**: Public read, authenticated insert

**Important**: Verify amounts on Solana Explorer via `tx_hash`. Legacy `escrow_contract_id` may exist on older rows but is unused.

### 6. `donor_achievements`

**Purpose**: POD NFT references for donor profiles

**Key Fields**:

- `donor_id` — owner
- `nft_token_id` — **Solana mint address** (source of truth)
- `blockchain_tx_hash` — mint transaction signature
- `metadata` — IPFS URLs, dog name, donation amount (cached)
- `nft_minted` — boolean flag

**RLS**: Public read, authenticated insert/update

NFTs live on Solana; this table is the app index. `fetchPodNftsByOwner()` can sync from chain.

### 7. `campaign_updates` / `campaign_expenses`

Off-chain campaign content and expense proofs. Not stored on Solana.

### 8. `quests` / `donor_quest_progress`

Gamification system. Quest completion can trigger NFT eligibility.

## Storage Buckets

| Bucket | Purpose |
|--------|---------|
| `dog-images` | Dog profile images |
| `profile-photos` | User avatars |
| `campaign-updates` | Update post images |
| `expense-proofs` | Expense documentation |

## Data Flow

### Donation flow

1. Donor signs USDC SPL transfer on Solana (99% campaign / 1% platform)
2. `POST /api/donation/record` inserts row in `transactions`
3. UI displays donation history with Solana Explorer links

### NFT flow

1. Donor mints POD NFT via `/api/nft/mint-for-donation`
2. Metaplex mint created on Solana; IPFS metadata uploaded
3. `donor_achievements` updated with `nft_token_id` = mint address
4. Profile gallery reads DB + optional on-chain sync

## Migration

`supabase/migrations/001_stellar_to_solana.sql`:

- Renames `stellar_address` → `solana_address` on `care_providers`, `donors`, `campaigns`
- Drops legacy escrow columns

## Best Practices

1. **Verify on-chain** — use `tx_hash` on Solana Explorer before trusting cached values
2. **Unique signatures** — never duplicate `transactions.tx_hash`
3. **Mint addresses as strings** — `nft_token_id` is a Solana pubkey, not a numeric ID
4. **RLS** — all tables use Row Level Security
5. **Network consistency** — explorer URLs must match `NEXT_PUBLIC_SOLANA_NETWORK`

## Related docs

- [Architecture](../ARCHITECTURE.md)
- [Donation Feature](../DONATION_FEATURE.md)
- [NFT Setup](../../apps/web/NFT_SETUP.md)
