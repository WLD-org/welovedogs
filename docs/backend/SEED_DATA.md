# Seed Data Documentation

This document describes the seed data that has been populated in the database for development and testing purposes.

## Overview

The seed data includes:

- 3 care providers (1 rescuer, 1 shelter, 1 veterinarian)
- 4 dogs with various conditions
- 3 active campaigns
- 2 campaign updates
- 2 campaign expenses
- 3 quests for gamification

## Care Providers

### 1. Sarah Johnson (Rescuer)

- **ID**: `11111111-1111-1111-1111-111111111111`
- **Type**: Rescuer
- **Location**: San Francisco, USA
- **Dogs Helped**: 2
- **Rating**: 4.8
- **Stellar Address**: `GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF` (placeholder)

### 2. Hope Animal Shelter

- **ID**: `22222222-2222-2222-2222-222222222222`
- **Type**: Shelter
- **Location**: Los Angeles, USA
- **Dogs Helped**: 1
- **Rating**: 4.9
- **Stellar Address**: `GBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB` (placeholder)

### 3. Dr. Michael Chen (Veterinarian)

- **ID**: `33333333-3333-3333-3333-333333333333`
- **Type**: Veterinarian
- **Location**: New York, USA
- **Dogs Helped**: 1
- **Rating**: 5.0
- **Stellar Address**: `GCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC` (placeholder)

## Dogs

### 1. Buddy

- **ID**: `aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa`
- **Care Provider**: Sarah Johnson (Rescuer)
- **Status**: Recovering, needs ongoing care
- **Needs Surgery**: No
- **Ready for Adoption**: No

### 2. Luna (Emergency)

- **ID**: `bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb`
- **Care Provider**: Hope Animal Shelter
- **Status**: Emergency case, recovering from surgery
- **Needs Surgery**: Yes (completed)
- **Ready for Adoption**: No

### 3. Max

- **ID**: `cccccccc-cccc-cccc-cccc-cccccccccccc`
- **Care Provider**: Dr. Michael Chen (Veterinarian)
- **Status**: Needs hip dysplasia surgery
- **Needs Surgery**: Yes (pending)
- **Ready for Adoption**: No

### 4. Bella

- **ID**: `dddddddd-dddd-dddd-dddd-dddddddddddd`
- **Care Provider**: Sarah Johnson (Rescuer)
- **Status**: Fully recovered
- **Needs Surgery**: No
- **Ready for Adoption**: Yes

## Campaigns

### 1. Luna's Recovery Campaign

- **ID**: `eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee`
- **Dog**: Luna
- **Goal**: $5,000
- **Raised**: $3,200 (64%)
- **Spent**: $2,800
- **Status**: Active

### 2. Max's Surgery Campaign

- **ID**: `ffffffff-ffff-ffff-ffff-ffffffffffff`
- **Dog**: Max
- **Goal**: $8,000
- **Raised**: $1,200 (15%)
- **Spent**: $0
- **Status**: Active

### 3. Buddy's Care Campaign

- **ID**: `gggggggg-gggg-gggg-gggg-gggggggggggg`
- **Dog**: Buddy
- **Goal**: $2,000
- **Raised**: $1,850 (93%)
- **Spent**: $1,200
- **Status**: Active

## Campaign Updates

1. **Luna's Surgery Successful** - Update on Luna's successful emergency surgery
2. **Max's Pre-Surgery Update** - Update on Max's pre-operative testing completion

## Campaign Expenses

1. **Emergency Surgery** - $2,500 for Luna's emergency surgery
2. **Post-Surgical Medications** - $300 for Luna's medications

## Quests

1. **First Donation** - Make your first donation (Badge reward)
2. **Hero Donor** - Donate $100 or more (NFT reward)
3. **Dog Supporter** - Support 5 different dogs (Title reward)

## Important Notes

⚠️ **Auth Users**: The seed data uses placeholder `auth_user_id` values (`00000000-0000-0000-0000-000000000001`, etc.). In production, you would need to:

1. Create actual auth users in Supabase Auth
2. Link the care providers to real auth user IDs
3. Or use the application's registration flow to create real users

⚠️ **Stellar Addresses**: The Stellar addresses in the seed data are placeholders. Replace them with real Stellar addresses when testing with actual blockchain transactions.

⚠️ **Images**: The image URLs use Unsplash placeholder images. Replace with actual image URLs or upload images to Supabase Storage.

## Resetting Seed Data

To reset and re-seed the database:

```bash
cd apps/backend
npm run reset
```

This will reset the database and re-run all migrations including the seed data.

## Adding More Seed Data

To add more seed data, you can:

1. Create a new migration: `npx supabase migration new add_more_seed_data`
2. Add INSERT statements to the migration file
3. Apply the migration: `npm run migrate`

Or modify the existing `seed_initial_data` migration file and reset the database.
