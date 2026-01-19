# Documentation

Welcome to the We Love Dogs documentation! This directory contains all project documentation organized by topic.

## 📖 Documentation Index

### Architecture
- **[Architecture Documentation](./ARCHITECTURE.md)** - Complete system architecture, integrations, connections, and data flows

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

### Contracts Documentation

Smart contract documentation is in the [`contracts/`](./contracts/) directory:

- **[Donation Contract Setup](./contracts/DONATION_CONTRACT_SETUP.md)** - Guide for deploying and configuring the donation smart contract

## 📁 Directory Structure

```
docs/
├── README.md (this file)
├── ARCHITECTURE.md
├── GETTING_STARTED.md
├── DONATION_FEATURE.md
├── DONATION_TRACKING_VERIFICATION.md
├── backend/
│   ├── DATABASE_SCHEMA.md
│   ├── STORAGE_SETUP.md
│   └── SEED_DATA.md
└── contracts/
    └── DONATION_CONTRACT_SETUP.md
```

## 🚀 Quick Links

- **Main Project README**: [../README.md](../README.md)
- **Backend README**: [../apps/backend/README.md](../apps/backend/README.md)
- **Web App**: [../apps/web/README.md](../apps/web/README.md) (if exists)

## 📝 Contributing to Documentation

When adding new documentation:

1. Place files in the appropriate subdirectory (`backend/`, `contracts/`, or root `docs/`)
2. Update this README with links to new documentation
3. Update the main project README if the documentation is important for getting started
4. Use clear, descriptive filenames in UPPER_SNAKE_CASE.md format

## 🔍 Finding Documentation

- **System Architecture**: Start with [ARCHITECTURE.md](./ARCHITECTURE.md) - Complete system overview
- **Setup & Installation**: See [GETTING_STARTED.md](./GETTING_STARTED.md)
- **Database Questions**: See [backend/DATABASE_SCHEMA.md](./backend/DATABASE_SCHEMA.md)
- **Donation System**: See [DONATION_FEATURE.md](./DONATION_FEATURE.md)
- **Storage Issues**: See [backend/STORAGE_SETUP.md](./backend/STORAGE_SETUP.md)
- **Contract Deployment**: See [contracts/DONATION_CONTRACT_SETUP.md](./contracts/DONATION_CONTRACT_SETUP.md)
