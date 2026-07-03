# Documentation

Welcome to the We Love Dogs documentation! This directory contains all project documentation organized by topic.

## 📖 Documentation Index

### Architecture

- **[Architecture Documentation](./ARCHITECTURE.md)** — System architecture, Solana integration, data flows, and deployment

### Getting Started

- **[Getting Started Guide](./GETTING_STARTED.md)** - Complete setup guide for developers, including prerequisites, installation, and first steps

### Features

- **[Donation Feature](./DONATION_FEATURE.md)** - Comprehensive guide to the donation system implementation
- **[Donation Tracking & Verification](./DONATION_TRACKING_VERIFICATION.md)** - How to verify on-chain donations and troubleshoot issues

### Backend Documentation

All backend-related documentation is in the [`backend/`](./backend/) directory:

- **[Database Schema](./backend/DATABASE_SCHEMA.md)** - Complete database schema documentation with table descriptions, relationships, and RLS policies
- **[Storage Setup](./backend/STORAGE_SETUP.md)** - Guide for setting up Supabase Storage buckets
- **[Seed Data](./backend/SEED_DATA.md)** - Documentation for seed data used in development

### Solana Integration

| Component | Location |
|-----------|----------|
| USDC donations | `apps/web/lib/solana/donation.ts` |
| POD NFTs (Metaplex) | `apps/web/lib/solana/nft.ts` |
| WalletConnect | `apps/web/lib/solana/appkit.ts` |
| NFT setup guide | [apps/web/NFT_SETUP.md](../apps/web/NFT_SETUP.md) |
| Deployment checklist | [apps/web/DEPLOYMENT_CHECK.md](../apps/web/DEPLOYMENT_CHECK.md) |

## 📁 Directory Structure

```
docs/
├── README.md (this file)
├── ARCHITECTURE.md
├── GETTING_STARTED.md
├── DONATION_FEATURE.md
├── DONATION_TRACKING_VERIFICATION.md
└── backend/
    ├── DATABASE_SCHEMA.md
    ├── STORAGE_SETUP.md
    └── SEED_DATA.md
```

## Quick links

- **Main project README**: [../README.md](../README.md)
- **Web app README**: [../apps/web/README.md](../apps/web/README.md)
- **Seed scripts**: [../supabase/seed/](../supabase/seed/)

## 📝 Contributing to Documentation

When adding new documentation:

1. Place files in the appropriate subdirectory (`backend/` or root `docs/`)
2. Update this README with links to new documentation
3. Update the main project README if the documentation is important for getting started
4. Use clear, descriptive filenames in UPPER_SNAKE_CASE.md format

## 🔍 Finding Documentation

- **System Architecture**: Start with [ARCHITECTURE.md](./ARCHITECTURE.md) - Complete system overview
- **Setup & Installation**: See [GETTING_STARTED.md](./GETTING_STARTED.md)
- **Database Questions**: See [backend/DATABASE_SCHEMA.md](./backend/DATABASE_SCHEMA.md)
- **Donation System**: See [DONATION_FEATURE.md](./DONATION_FEATURE.md)
- **Storage Issues**: See [backend/STORAGE_SETUP.md](./backend/STORAGE_SETUP.md)
- **NFT setup**: See [apps/web/NFT_SETUP.md](../apps/web/NFT_SETUP.md)
