-- Migration: Stellar to Solana
-- Renames wallet address columns and removes escrow references

-- Care providers
ALTER TABLE care_providers RENAME COLUMN stellar_address TO solana_address;

-- Donors
ALTER TABLE donors RENAME COLUMN stellar_address TO solana_address;

-- Campaigns
ALTER TABLE campaigns RENAME COLUMN stellar_address TO solana_address;
ALTER TABLE campaigns DROP COLUMN IF EXISTS escrow_id;

-- Transactions: remove escrow-specific fields
ALTER TABLE transactions DROP COLUMN IF EXISTS escrow_contract_id;

-- Update donation_type values for existing records
UPDATE transactions SET donation_type = 'direct' WHERE donation_type IN ('instant', 'escrow');
