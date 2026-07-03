# Solana Deployment Checklist

Use this checklist before testing donations or POD NFT minting on devnet or mainnet.

## Prerequisites

- [ ] Bun installed (`bun --version`)
- [ ] Dependencies installed (`bun install` from repo root)
- [ ] Supabase project configured (URL + anon key in root `.env`)
- [ ] Solana wallet with USDC for test donations
- [ ] [WalletConnect Cloud](https://cloud.reown.com/) project ID for wallet connection

## Environment variables

Copy `apps/web/.env.example` to the monorepo root `.env` and verify:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SOLANA_NETWORK` | `devnet` or `mainnet-beta` |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | RPC endpoint (Helius, QuickNode, or public) |
| `NEXT_PUBLIC_USDC_MINT` | USDC SPL mint for the selected network |
| `NEXT_PUBLIC_PLATFORM_WALLET` | Platform pubkey receiving 1% commission |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Reown AppKit / WalletConnect |
| `POD_NFT_MINT_AUTHORITY_SECRET` | Server keypair for Metaplex minting |
| `PINATA_API_KEY` / `PINATA_SECRET_API_KEY` | IPFS metadata storage |

See [`.env.example`](./.env.example) and [NFT_SETUP.md](./NFT_SETUP.md) for the full list.

## Database

- [ ] Migration applied: `supabase/migrations/001_stellar_to_solana.sql`
- [ ] Campaigns and care providers have valid `solana_address` values
- [ ] Seed data loaded if using local Supabase (`supabase db reset` or remote SQL)

## POD NFT mint authority

1. Generate or import a Solana keypair for the mint authority.
2. Set `POD_NFT_MINT_AUTHORITY_SECRET` (base58 or JSON byte array).
3. Fund the authority wallet with **SOL** for transaction fees on your target network.
4. Optionally set `POD_NFT_MINT_AUTHORITY_PUBLIC_KEY` for display in the donor profile.

```bash
# Check mint authority balance (devnet example)
solana balance <MINT_AUTHORITY_PUBKEY> --url devnet
```

## Pre-upload POD images (recommended)

```bash
cd apps/web
bun run upload-pod-images
```

Writes IPFS hashes to `lib/utils/pod-ipfs-mapping.json` for faster minting.

## Smoke tests

### 1. App starts

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 2. Wallet connects

- Open a campaign page or the donation widget.
- Connect via Phantom, Solflare, or WalletConnect.
- Confirm the connected address matches your wallet.

### 3. Donation flow

- Donate a small USDC amount on devnet.
- Confirm the transaction on [Solana Explorer](https://explorer.solana.com/?cluster=devnet).
- Verify 99% reached the campaign wallet and 1% reached the platform wallet.
- Confirm `/api/donation/record` created a row in `transactions` with `tx_hash`.

### 4. POD NFT mint (optional)

- Complete a donation and use **Mint Proof of Donation NFT** on the success page.
- Confirm NFT appears in the donor profile gallery.
- Verify metadata resolves via your IPFS gateway.

## Production (mainnet) extras

- [ ] Use a dedicated RPC provider (rate limits on public endpoints)
- [ ] Fund mint authority with sufficient SOL
- [ ] Set `NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta` and mainnet USDC mint
- [ ] Use production WalletConnect project with allowed domains
- [ ] Rotate and secure `POD_NFT_MINT_AUTHORITY_SECRET` (never commit secrets)

## Troubleshooting

| Issue | Check |
|-------|--------|
| Wallet won't connect | `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` set; browser console for AppKit errors |
| USDC transfer fails | Wallet has USDC + SOL; correct `NEXT_PUBLIC_USDC_MINT` for network |
| Donation not in DB | Network tab on `/api/donation/record`; Supabase RLS and auth |
| NFT mint fails | Mint authority funded with SOL; Pinata keys valid; server logs |
| Wrong recipient | Campaign `solana_address` in database matches intended wallet |

## Related docs

- [NFT_SETUP.md](./NFT_SETUP.md) — POD NFT configuration
- [docs/DONATION_FEATURE.md](../../docs/DONATION_FEATURE.md) — donation flow
- [docs/DONATION_TRACKING_VERIFICATION.md](../../docs/DONATION_TRACKING_VERIFICATION.md) — on-chain verification
- [docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md) — system overview
