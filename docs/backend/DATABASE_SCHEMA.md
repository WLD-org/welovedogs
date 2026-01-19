# Database Schema Documentation

## Design Philosophy

This database schema is designed to support a **Web2-like user experience** while leveraging **Web3 smart contracts** for on-chain data. The database stores:

1. **User profiles and content** - Not tracked on-chain
2. **UI metadata and caching** - For performance
3. **References to on-chain data** - Not the source of truth

## On-Chain vs Off-Chain Data

### ✅ Stored On-Chain (Smart Contracts)
- **Donations** - Tracked via `donation` Soroban contract
- **NFTs** - Tracked via `pod-poap` Soroban contract  
- **Escrow contracts** - Managed by Trustless Work
- **Transaction hashes** - Immutable on Stellar blockchain

### ✅ Stored Off-Chain (Database)
- **User profiles** - Care providers, donors (Web2 UX)
- **Dog profiles** - Stories, images, metadata
- **Campaigns** - Goals, descriptions, status
- **Campaign updates** - Posts, images, progress reports
- **Campaign expenses** - Proof documents, descriptions
- **Quest system** - Gamification metadata
- **Transaction cache** - References to on-chain transactions (for UI performance)

## Tables Overview

### 1. `care_providers`
**Purpose**: Care provider profiles (rescuer, shelter, veterinarian)

**Key Fields**:
- `auth_user_id` - Links to Supabase auth
- `type` - rescuer, shelter, or veterinarian
- `stellar_address` - For receiving donations
- Profile info, social media, location

**RLS**: Public read, owners can write

### 2. `donors`
**Purpose**: Donor profiles for Web2 UX

**Key Fields**:
- `auth_user_id` - Links to Supabase auth
- `stellar_address` - For making donations
- Profile info

**RLS**: Public read, owners can write

### 3. `dogs`
**Purpose**: Dog profiles and metadata

**Key Fields**:
- `care_provider_id` - Owner
- `images` - Array of image URLs
- `story`, `current_condition` - Content
- Medical info, adoption status

**RLS**: Public read, care providers can write

### 4. `campaigns`
**Purpose**: Fundraising campaign metadata

**Key Fields**:
- `dog_id` - Associated dog
- `care_provider_id` - Campaign owner
- `goal`, `raised`, `spent` - **Cached from on-chain** (not source of truth)
- `stellar_address` - Campaign wallet
- `escrow_id` - Reference to escrow contract

**RLS**: Public read, care providers can write

**Note**: `raised` and `spent` are cached values. The source of truth is on-chain via the donation contract and escrow contracts.

### 5. `transactions` ⚠️ CACHE ONLY
**Purpose**: Cache/index of on-chain transactions for UI performance

**Key Fields**:
- `tx_hash` - **Source of truth** (unique, on-chain)
- `donor_id`, `campaign_id`, `dog_id` - References
- `usd_value`, `donation_type` - Cached metadata
- `explorer_url` - Link to Stellar Explorer

**RLS**: Public read, authenticated insert

**Important**: This table is a **cache/index only**. The source of truth is on-chain. Always verify transactions via `tx_hash` on Stellar Explorer.

### 6. `campaign_updates`
**Purpose**: Campaign progress posts (not on-chain)

**Key Fields**:
- `campaign_id`, `dog_id` - References
- `title`, `description`, `image` - Content

**RLS**: Public read, care providers can write

### 7. `campaign_expenses`
**Purpose**: Expense tracking with proof documents

**Key Fields**:
- `campaign_id` - Reference
- `amount`, `proof` - Expense details
- `title`, `description` - Context

**RLS**: Public read, care providers can write

### 8. `donor_achievements` ⚠️ NFT REFERENCES ONLY
**Purpose**: Cache of NFT references for UI

**Key Fields**:
- `donor_id` - Owner
- `nft_token_id` - **On-chain token ID** (source of truth)
- `blockchain_tx_hash` - Mint transaction hash
- `metadata` - IPFS URLs, images (cached)

**RLS**: Public read, authenticated insert/update

**Important**: NFTs are tracked on-chain via POD POAP contract. This table only stores references for UI performance.

### 9. `quests`
**Purpose**: Gamification quest system

**Key Fields**:
- `requirement_type`, `requirement_value` - Quest criteria
- `reward_type` - NFT, badge, or title
- `is_active` - Quest status

**RLS**: Public read

### 10. `donor_quest_progress`
**Purpose**: Quest progress tracking

**Key Fields**:
- `donor_id`, `quest_id` - References
- `progress_value`, `completed` - Progress state

**RLS**: Donors can read their own, authenticated write

## Storage Buckets

The following Supabase Storage buckets should be created:

1. **`dog-images`** - Dog profile images
   - Public: Yes
   - Allowed MIME types: image/*

2. **`profile-photos`** - User profile photos
   - Public: Yes
   - Allowed MIME types: image/*

3. **`campaign-updates`** - Campaign update images
   - Public: Yes
   - Allowed MIME types: image/*

4. **`expense-proofs`** - Expense proof documents
   - Public: Yes (for transparency)
   - Allowed MIME types: image/*, application/pdf

## Data Flow

### Donation Flow
1. User makes donation via wallet → Transaction on Stellar blockchain
2. Donation contract records transaction on-chain
3. API endpoint (`/api/donation/record`) caches transaction in `transactions` table
4. UI displays cached data, links to on-chain via `tx_hash`

### NFT Flow
1. Donor completes quest → NFT minted via POD POAP contract
2. NFT stored on-chain with `token_id`
3. Achievement cached in `donor_achievements` table with `nft_token_id`
4. UI displays NFT gallery, syncs with blockchain if needed

### Campaign Flow
1. Care provider creates campaign → Stored in `campaigns` table
2. Donations tracked on-chain → `raised` value cached/updated
3. Expenses tracked in `campaign_expenses` → `spent` value updated
4. Updates posted in `campaign_updates` → Not on-chain

## Best Practices

1. **Always verify on-chain** - Use `tx_hash` to verify transactions on Stellar Explorer
2. **Cache is for performance** - Don't rely on cached values for critical operations
3. **Sync periodically** - Update cached values from blockchain when needed
4. **RLS is critical** - All tables have RLS enabled for security
5. **Indexes for performance** - Foreign keys and common queries are indexed

## Migration Notes

- All tables use UUID primary keys
- Foreign keys cascade on delete appropriately
- RLS policies enforce data access rules
- Indexes optimize common query patterns
- Timestamps use `TIMESTAMPTZ` for timezone awareness

## Next Steps

1. Create storage buckets via Supabase Dashboard
2. Set up Realtime subscriptions for live updates
3. Configure Edge Functions if needed for background sync
4. Generate TypeScript types: `cd apps/backend && npm run types`
