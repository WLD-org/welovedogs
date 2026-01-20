# Architecture Documentation

This document describes the overall architecture, integrations, connections, and data flows of the We Love Dogs application.

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Layers](#architecture-layers)
3. [Technology Stack](#technology-stack)
4. [Integration Points](#integration-points)
5. [Data Flow](#data-flow)
6. [User Flows](#user-flows)
7. [Component Architecture](#component-architecture)
8. [Security Architecture](#security-architecture)
9. [Deployment Architecture](#deployment-architecture)

## System Overview

We Love Dogs is a **Web3 crowdfunding platform** that combines the user experience of Web2 applications with the transparency and trust of blockchain technology. The system integrates multiple services to provide a seamless experience for care providers and donors.

### Core Principles

- **Web2 UX, Web3 Trust**: Familiar user interface with blockchain-backed transparency
- **Hybrid Architecture**: Off-chain data for performance, on-chain data for trust
- **Multi-Service Integration**: Supabase (backend), Stellar (blockchain), Trustless Work (escrow)
- **Real-time Updates**: Live campaign progress and donation tracking
- **Security First**: Row Level Security, wallet-based authentication, smart contract escrow

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  Next.js 16 (React 19) + Tailwind CSS + shadcn/ui         │
│  - Server Components (SEO, Performance)                    │
│  - Client Components (Interactivity)                        │
│  - API Routes (Backend Integration)                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  - Context Providers (Supabase, Wallets, Trustless Work)   │
│  - Custom Hooks (useDonation, useEscrow, useWalletsKit)    │
│  - Server Actions (updateQuestProgress, generateAbout)     │
│  - Middleware/Proxy (Auth, Route Protection)               │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Supabase   │  │   Stellar   │  │ Trustless   │
│   Backend    │  │  Blockchain │  │    Work     │
├──────────────┤  ├──────────────┤  ├──────────────┤
│ PostgreSQL   │  │ Horizon API │  │ Escrow API  │
│ Auth         │  │ Soroban RPC  │  │ Contracts   │
│ Storage      │  │ Wallets Kit  │  │             │
│ Realtime     │  │              │  │             │
└──────────────┘  └──────────────┘  └──────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Smart Contracts Layer                     │
│  - Donation Contract (Transaction Tracking)                 │
│  - POD POAP Contract (NFT Minting)                         │
│  - Trustless Work Escrow Contracts                          │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend

- **Next.js 16**: React framework with App Router
  - Server Components for SEO and performance
  - Server Actions for mutations
  - API Routes for backend integration
  - Middleware/Proxy for route protection
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Accessible component primitives

### Backend Services

- **Supabase**: Backend-as-a-Service
  - PostgreSQL database with Row Level Security (RLS)
  - Authentication (email/password, OAuth)
  - Storage buckets (images, documents)
  - Real-time subscriptions
  - Edge Functions (serverless)

### Blockchain

- **Stellar Network**: Public blockchain for payments
  - Horizon API: Transaction queries and submission
  - Soroban RPC: Smart contract interaction
  - Stellar SDK: Core blockchain operations
- **Stellar CLI**: Command-line tool for contract development
  - Contract building (`stellar contract build`)
  - Contract deployment (`stellar contract deploy`)
  - Contract invocation and testing
  - Key management and network configuration
  - See: [Stellar CLI Documentation](https://developers.stellar.org/docs/tools/cli/stellar-cli)
- **Stellar Wallets Kit**: Multi-wallet support
  - xBull, Freighter (browser extensions)
  - WalletConnect (mobile wallets)
  - Persistent connections via localStorage

### Smart Contracts

- **Donation Contract** (Soroban): Tracks donation transactions on-chain
- **POD POAP Contract** (Soroban): Mints Proof of Donation NFTs
- **Trustless Work Escrow**: Third-party escrow contract platform

### Build & Tools

- **Turborepo**: Monorepo build system
- **Stellar CLI**: Smart contract development and deployment
  - Builds Rust contracts to WASM (`stellar contract build`)
  - Deploys contracts to networks (`stellar contract deploy`)
  - Generates TypeScript bindings (`stellar contract bindings typescript`)
- **ESLint & Prettier**: Code quality
- **Husky**: Git hooks

## Integration Points

### 1. Supabase Integration

**Client-Side (`lib/supabase/client.ts`)**
- Browser client for client components
- Handles authentication state
- Database queries and mutations
- Storage uploads/downloads

**Server-Side (`lib/supabase/server.ts`)**
- Server client for Server Components
- Cookie-based session management
- SSR-safe database queries
- Static client for build-time data fetching

**Connection Flow:**
```
Client Component → createBrowserClient() → Supabase API
Server Component → createServerClient() → Supabase API (with cookies)
API Route → createServerClient() → Supabase API
```

### 2. Stellar Blockchain Integration

**Wallet Connection (`contexts/WalletsKitContext.tsx`)**
- Multi-wallet support via Stellar Wallets Kit
- Persistent wallet selection (localStorage)
- Auto-reconnect on page load
- Transaction signing abstraction

**Transaction Building (`hooks/useDonation.ts`, `hooks/useEscrow.ts`)**
- USDC payment operations
- Smart contract invocations
- Multi-op transactions (payment + contract call)
- Transaction submission via Horizon API

**Stellar CLI Integration**
- **Contract Development**: Build Rust contracts using `stellar contract build`
  - Compiles contracts to WASM for `wasm32v1-none` target
  - Generates contract metadata and bindings
  - Optimizes WASM output for deployment
- **Contract Deployment**: Deploy contracts using `stellar contract deploy`
  - Uploads WASM to network
  - Creates contract instances
  - Manages contract aliases for easy reference
- **Contract Management**: 
  - Generate TypeScript bindings: `stellar contract bindings typescript`
  - Invoke contract functions: `stellar contract invoke`
  - Query contract data: `stellar contract read`
  - Extend contract TTL: `stellar contract extend`
- **Key Management**: 
  - Generate identities: `stellar keys generate`
  - Manage network configurations: `stellar network add`
  - Fund test accounts: `stellar keys fund`

**Connection Flow:**
```
User Action → Wallet Kit → Wallet Extension → Stellar Network
Transaction → Horizon API → Stellar Network → Blockchain
Contract Call → Soroban RPC → Smart Contract → Blockchain
Contract Build → Stellar CLI → WASM → Deploy → Network
```

### 3. Trustless Work Escrow Integration

**Escrow Provider (`contexts/TrustlessWorkContext.tsx`)**
- API key configuration (`NEXT_PUBLIC_TRUSTLESS_WORK_API_KEY`)
- Network selection (testnet/mainnet)
- Escrow contract management

**Escrow Operations (`hooks/useEscrow.ts`)**
- Create escrow accounts with trustline configuration
- Fund escrow accounts
- Release funds (with proof)
- Query escrow balances

**Trustline Configuration**
- **Address**: Required trustline address for token operations
  - Environment variable: `NEXT_PUBLIC_TRUSTLINE_ADDRESS`
  - Fallback: Connected wallet address
- **Symbol**: Token symbol (default: "USDC")
  - Environment variable: `NEXT_PUBLIC_TRUSTLINE_SYMBOL`
  - Default: "USDC"
- Trustline object is required in escrow payload (both `address` and `symbol`)

**Connection Flow:**
```
App → TrustlessWorkProvider → Trustless Work API → Escrow Contracts
Care Provider → Create Escrow → Trustless Work → Stellar Network
  └─ Configure trustline (address + symbol) → Escrow Payload
Donor → Fund Escrow → Trustless Work → Stellar Network
```

### 4. Smart Contract Integration

**Donation Contract**
- Tracks all donation transactions
- Stores donor, recipient, amount, timestamp
- Provides query functions for donation history

**POD POAP Contract**
- Mints NFTs for donations
- Stores NFT metadata (IPFS)
- Tracks NFT ownership

**Connection Flow:**
```
Donation → Contract Invocation → Soroban RPC → Donation Contract
NFT Mint → Contract Invocation → Soroban RPC → POD POAP Contract
Query → Soroban RPC → Smart Contract → Return Data
```

**Build Configuration**
- **Rust Contracts**: Built using Stellar CLI (`stellar contract build`)
  - **Prerequisites**: 
    - Stellar CLI must be installed and available in PATH
    - Rust `wasm32v1-none` target must be installed (`rustup target add wasm32v1-none`)
  - **Build Process**:
    - Build script checks for Stellar CLI availability: `command -v stellar`
    - If CLI is available, runs `stellar contract build`
    - If build fails (e.g., missing Rust target), gracefully exits with message
    - Build continues even if Rust compilation fails (TypeScript packages still build)
  - **Output**: 
    - WASM files written to `target/wasm32v1-none/release/`
    - Can be optimized with `--optimize` flag or `npm run optimize`
- **TypeScript Contracts**: Automatically built via `transpilePackages` in Next.js config
  - Generated bindings from contract WASM using `stellar contract bindings typescript`
  - Packages: `pod_poap`, `donation` (local file dependencies in `contracts/packages/`)
  - Build independently of Rust contract build status
- **Webpack Warnings**: Suppressed for Stellar SDK's native dependencies (`sodium-native`, `require-addon`)
  - These are expected: SDK uses native modules server-side but falls back to browser-compatible code client-side

**Build Script Behavior:**
```bash
# contracts/package.json build script:
command -v stellar >/dev/null 2>&1 && stellar contract build || \
  (echo 'Stellar CLI not available, skipping Rust contract build (TypeScript packages will still build)' && exit 0)
```
- Checks for Stellar CLI before attempting build
- If CLI unavailable or build fails, prints message and exits successfully (exit 0)
- Allows build pipeline to continue with TypeScript packages

**Development Workflow:**
```
1. Write Rust contract code → contracts/donation/ or contracts/pod-poap/
2. Install Rust target → rustup target add wasm32v1-none
3. Build contract → stellar contract build (or npm run build in contracts/)
4. Generate TypeScript bindings → stellar contract bindings typescript --wasm <path> --output-dir <dir>
5. Deploy contract → stellar contract deploy --wasm <path> --source <account> --network <network>
6. Use bindings in app → import from "pod_poap" or "donation" packages
```

**Build Results:**
- ✅ **Web Build**: Always succeeds (Next.js production build)
- ✅ **TypeScript Contracts**: Always build (independent of Rust build)
- ⚠️ **Rust Contracts**: May fail if:
  - Stellar CLI not installed → Build continues, message displayed
  - `wasm32v1-none` target missing → Build continues, error displayed
  - Other Rust compilation errors → Build continues, errors displayed
- **Overall Build**: Succeeds as long as web and TypeScript packages build successfully

## Data Flow

### On-Chain vs Off-Chain Data

**On-Chain (Source of Truth)**
- Donation transactions (via Donation Contract)
- NFT ownership (via POD POAP Contract)
- Escrow contracts (via Trustless Work)
- Transaction hashes (immutable on Stellar)

**Off-Chain (Performance Cache)**
- User profiles (care_providers, donors)
- Dog profiles and campaigns
- Campaign updates and expenses
- Transaction cache (for UI performance)
- NFT metadata cache

### Data Flow Diagrams

#### Donation Flow (Instant)

```
1. Donor selects campaign → Frontend
2. Donor connects wallet → Wallet Kit → Wallet Extension
3. Donor enters amount → Frontend
4. Build transaction → useDonation hook
   ├─ Payment operation (USDC transfer)
   └─ Contract invocation (record donation)
5. Sign transaction → Wallet Extension → User approval
6. Submit transaction → Horizon API → Stellar Network
7. Transaction confirmed → Blockchain
8. Record in database → API Route → Supabase
   ├─ Insert into transactions table
   └─ Update campaign raised amount
9. Update UI → Real-time subscription → Frontend
```

#### Donation Flow (Escrow)

```
1. Donor selects campaign → Frontend
2. Donor chooses escrow → Frontend
3. Check escrow exists → useEscrow hook → Trustless Work API
4. Build escrow funding transaction → useEscrow hook
5. Sign transaction → Wallet Extension → User approval
6. Submit transaction → Horizon API → Stellar Network
7. Transaction confirmed → Blockchain
8. Record in database → API Route → Supabase
   ├─ Insert into transactions table (donation_type: "escrow")
   └─ Store escrow_contract_id
9. Update UI → Real-time subscription → Frontend

[Later: Fund Release]
10. Care provider submits expense proof → Frontend → Supabase Storage
11. Request fund release → useEscrow hook → Trustless Work API
12. Release signer verifies → Trustless Work → Stellar Network
13. Funds released → Blockchain
14. Update campaign spent amount → Supabase
```

#### Campaign Creation Flow

```
1. Care provider creates dog profile → Frontend → Supabase
   ├─ Insert into dogs table
   └─ Upload images to Storage
2. Care provider creates campaign → Frontend → Supabase
   ├─ Insert into campaigns table
   └─ Optionally create escrow → Trustless Work API
3. Campaign appears on homepage → Real-time subscription → Frontend
```

#### NFT Minting Flow

```
1. Donation completed → API Route
2. Check quest completion → updateQuestProgress action
3. If quest completed → NFT mint API route
   ├─ Generate NFT metadata → IPFS
   ├─ Mint NFT → POD POAP Contract → Soroban RPC
   └─ Store NFT reference → Supabase (donor_achievements)
4. NFT appears in donor gallery → Frontend → Supabase query
```

## User Flows

### Care Provider Flow

```
Registration
├─ Sign up → Supabase Auth
├─ Select user type (rescuer/shelter/veterinarian)
├─ Complete profile → Supabase (care_providers table)
└─ Connect Stellar wallet → Save to profile

Campaign Management
├─ Create dog profile → Supabase (dogs table)
├─ Upload dog images → Supabase Storage
├─ Create campaign → Supabase (campaigns table)
├─ Optionally create escrow → Trustless Work
├─ Post campaign updates → Supabase (campaign_updates table)
├─ Record expenses → Supabase (campaign_expenses table)
└─ Upload expense proofs → Supabase Storage

Fund Management
├─ View campaign progress → Supabase query
├─ Request escrow release → Trustless Work API
└─ Track expenses → Supabase query
```

### Donor Flow

```
Registration
├─ Sign up → Supabase Auth
├─ Select user type (donor)
├─ Complete profile → Supabase (donors table)
└─ Connect Stellar wallet → Save to profile

Donation Flow
├─ Browse campaigns → Supabase query
├─ Select campaign → Frontend
├─ Connect wallet → Wallet Kit
├─ Choose donation type (escrow/instant)
├─ Enter amount → Frontend
├─ Sign transaction → Wallet Extension
├─ Transaction submitted → Stellar Network
├─ Transaction confirmed → Blockchain
├─ Recorded in database → Supabase
└─ Quest progress updated → Supabase (donor_quest_progress)

NFT Collection
├─ Complete quest → updateQuestProgress action
├─ NFT minted → POD POAP Contract
├─ NFT stored → Supabase (donor_achievements)
└─ View in gallery → Frontend → Supabase query
```

## Component Architecture

### Context Providers

**SupabaseProvider** (`contexts/SupabaseContext.tsx`)
- Provides Supabase client to all components
- Handles authentication state
- Storage operations wrapper

**WalletsKitProvider** (`contexts/WalletsKitContext.tsx`)
- Manages wallet connections
- Provides wallet address and connection status
- Transaction signing helpers

**TrustlessWorkProvider** (`contexts/TrustlessWorkContext.tsx`)
- Configures Trustless Work API
- Provides escrow functionality

### Custom Hooks

**useDonation** (`hooks/useDonation.ts`)
- Builds donation transactions
- Handles instant donations
- Submits transactions to Stellar

**useEscrow** (`hooks/useEscrow.ts`)
- Creates escrow accounts
- Funds escrow accounts
- Releases escrow funds
- Queries escrow balances

**useWalletsKit** (`hooks/useWalletsKit.ts`)
- Wallet connection management
- Address retrieval
- Transaction signing

### Server Actions

**updateQuestProgress** (`app/actions/update-quest-progress.ts`)
- Checks quest completion
- Updates progress in database
- Triggers NFT minting if quest completed

**generateAbout** (`app/actions/generate-about.ts`)
- Generates AI content for profiles

### API Routes

**`/api/donation/record`** (`app/api/donation/record/route.ts`)
- Records donation transactions in database
- Updates campaign raised amounts
- Triggers quest progress updates

**`/api/nft/mint-for-donation`** (`app/api/nft/mint-for-donation/route.ts`)
- Mints POD POAP NFTs
- Stores NFT metadata in IPFS
- Records NFT in database

## Security Architecture

### Authentication

**Supabase Auth**
- Email/password authentication
- OAuth providers (Google, GitHub, etc.)
- JWT tokens stored in HTTP-only cookies
- Session management via Supabase SSR

**Wallet Authentication**
- Wallet connection for blockchain operations
- No password required (cryptographic signatures)
- Address stored in user profile

### Authorization

**Row Level Security (RLS)**
- Database-level security policies
- Public read for profiles and campaigns (transparency)
- Owner write for user data
- Authenticated insert for transactions

**Route Protection**
- Middleware/Proxy checks authentication
- Redirects unauthenticated users
- Protects API routes with server-side auth checks

### Data Security

**On-Chain Security**
- Cryptographic signatures for transactions
- Smart contract immutability
- Escrow multi-party security (platform, resolver, signer)

**Off-Chain Security**
- RLS policies enforce data access
- Foreign key constraints prevent orphaned data
- Input validation on all user inputs
- SQL injection prevention via Supabase client

### Storage Security

**Supabase Storage**
- Public buckets for images (transparency)
- Authenticated upload only
- File type and size validation
- RLS policies on storage objects

## Deployment Architecture

### Frontend Deployment

**Next.js Application**
- Server Components (SSR)
- Static generation for public pages
- API Routes for backend integration
- Edge runtime for middleware/proxy

**Hosting Options**
- Vercel (recommended)
- Netlify
- Any Node.js host

### Backend Deployment

**Supabase**
- Cloud-hosted PostgreSQL
- Managed authentication
- CDN-backed storage
- Edge Functions (serverless)

**Local Development**
- Docker-based Supabase local instance
- Migrations applied via Supabase CLI

### Blockchain Deployment

**Stellar Network**
- Public testnet (development)
- Public mainnet (production)
- No deployment required (public network)

**Smart Contracts**
- Deployed to Stellar network via Stellar CLI
- Contract IDs stored in environment variables
- Bindings generated for TypeScript integration

### Environment Configuration

**Development**
- Local Supabase instance
- Stellar testnet
- Testnet escrow contracts
- `NEXT_PUBLIC_TRUSTLINE_ADDRESS` (optional, falls back to wallet address)
- `NEXT_PUBLIC_TRUSTLINE_SYMBOL` (optional, defaults to "USDC")

**Production**
- Supabase cloud project
- Stellar mainnet
- Mainnet escrow contracts
- Production API keys
- `NEXT_PUBLIC_TRUSTLINE_ADDRESS` (required for escrow)
- `NEXT_PUBLIC_TRUSTLINE_SYMBOL` (optional, defaults to "USDC")

## Integration Summary

### Service Connections

```
Frontend (Next.js)
├─→ Supabase (PostgreSQL, Auth, Storage)
│   └─→ Real-time subscriptions
├─→ Stellar Network
│   ├─→ Horizon API (transactions)
│   ├─→ Soroban RPC (smart contracts)
│   └─→ Wallet Extensions (signing)
└─→ Trustless Work API
    └─→ Escrow Contracts (on Stellar)
```

### Data Synchronization

**Real-time Updates**
- Campaign progress → Supabase Realtime → Frontend
- New donations → Supabase Realtime → Frontend
- Campaign updates → Supabase Realtime → Frontend

**On-Chain Verification**
- Transaction hashes stored in database
- Links to Stellar Explorer for verification
- Smart contract queries for on-chain data
- Periodic sync from blockchain to database (future)

### Error Handling

**Frontend Errors**
- User-friendly error messages
- Toast notifications
- Error boundaries for React errors

**Backend Errors**
- Supabase error handling
- Transaction rollback on errors
- Error logging for debugging

**Blockchain Errors**
- Transaction failure handling
- Network error retries
- User feedback on failures

## Future Enhancements

### Planned Integrations

- **IPFS**: Decentralized storage for NFT metadata
- **Analytics**: Campaign analytics dashboard
- **Notifications**: Real-time push notifications
- **Email**: Transactional emails for donations
- **Social**: Social media sharing integration

### Scalability Considerations

- **Database Indexing**: Optimize queries with proper indexes
- **Caching**: Redis for frequently accessed data
- **CDN**: Image and static asset delivery
- **Load Balancing**: Multiple Next.js instances
- **Database Replication**: Read replicas for Supabase

## Related Documentation

- [Getting Started Guide](./GETTING_STARTED.md) - Setup instructions
- [Database Schema](./backend/DATABASE_SCHEMA.md) - Database structure
- [Donation Feature](./DONATION_FEATURE.md) - Donation system details
- [Backend README](../apps/backend/README.md) - Supabase backend guide

---

**Last Updated**: January 2025
