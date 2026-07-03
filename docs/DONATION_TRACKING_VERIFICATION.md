# Donation Tracking & Verification

How to verify **Solana USDC donations** and troubleshoot recording issues.

## Source of truth

| Data | Source of truth | App cache |
|------|-----------------|-----------|
| USDC transfer amounts | Solana transaction | `transactions.usd_value` |
| Transaction ID | Solana signature (`tx_hash`) | `transactions.tx_hash` |
| Donor wallet | On-chain signer | `transactions.donor_address` |
| Campaign recipient | Transfer instructions | `campaigns.solana_address` |

Supabase `transactions` is an **index for the UI**. Always verify on Solana Explorer.

## Verify a donation

### 1. Get the transaction signature

From the donation success page, donor profile, or Supabase `transactions.tx_hash`.

### 2. Open Solana Explorer

```
Devnet:  https://explorer.solana.com/tx/{SIGNATURE}?cluster=devnet
Mainnet: https://explorer.solana.com/tx/{SIGNATURE}
```

Or use `getTransactionExplorerUrl()` from `lib/utils/solana-explorer.ts`.

### 3. Confirm transfer instructions

A valid donation transaction should include:

1. **Create ATA** (idempotent) for campaign USDC account — if needed
2. **Create ATA** (idempotent) for platform USDC account — if needed
3. **Transfer** ~99% USDC to campaign ATA
4. **Transfer** ~1% USDC to platform ATA

Token mint should match `NEXT_PUBLIC_USDC_MINT`.

### 4. Confirm Supabase record

```sql
SELECT id, tx_hash, usd_value, donation_type, donor_address, explorer_url
FROM transactions
WHERE tx_hash = '<SIGNATURE>';
```

`donation_type` should be `direct`. Duplicate `tx_hash` inserts are rejected by the API.

## Checklist

- [ ] Wallet connected before donating
- [ ] Campaign has `solana_address` set
- [ ] `NEXT_PUBLIC_PLATFORM_WALLET` configured
- [ ] Donor has sufficient USDC (+ SOL for fees)
- [ ] Transaction confirmed on Solana Explorer
- [ ] Row exists in `transactions` with matching `tx_hash`
- [ ] Explorer URL opens correctly for the active network

## Common issues

### Donation succeeded on-chain but not in database

1. Check `/donation-success` page — recording runs after wallet confirmation
2. Inspect browser network tab for `POST /api/donation/record` errors
3. Confirm user is authenticated if `donorId` is required
4. Manually insert only after verifying on-chain (normally automatic)

### Wrong network

`NEXT_PUBLIC_SOLANA_NETWORK` must match the wallet's cluster. A devnet signature will not appear on mainnet Explorer.

### USDC balance shows zero

The donor may hold USDC in a different token account. The app uses the standard ATA for `NEXT_PUBLIC_USDC_MINT`.

### Platform fee missing

Verify `NEXT_PUBLIC_PLATFORM_WALLET` is set. Without it, `buildDonationTransaction()` throws before signing.

## NFT verification

After minting a POD NFT:

1. **Mint address** stored in `donor_achievements.nft_token_id`
2. View NFT: `https://explorer.solana.com/address/{MINT}?cluster=devnet`
3. Mint tx: `donor_achievements.blockchain_tx_hash`
4. On-chain list: `GET /api/pod-poap/tokens/{walletAddress}`

## RPC debugging

If transactions fail to confirm:

```bash
# Check RPC health
curl -X POST $NEXT_PUBLIC_SOLANA_RPC_URL \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}'
```

Consider a dedicated RPC provider (Helius, QuickNode) for production.

## Related docs

- [Donation Feature](./DONATION_FEATURE.md)
- [Architecture](./ARCHITECTURE.md)
- [NFT Setup](../apps/web/NFT_SETUP.md)
