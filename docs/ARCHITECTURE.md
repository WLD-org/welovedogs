# Architecture Documentation

This document describes the overall architecture, integrations, connections, and data flows of the We Love Dogs application.

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Layers](#architecture-layers)
3. [Technology Stack](#technology-stack)
4. [Integrations Overview](#integrations-overview)
5. [Integration Points](#integration-points)
6. [Integration Roadmap](#integration-roadmap)
7. [Data Flow](#data-flow)
8. [User Flows](#user-flows)
9. [Component Architecture](#component-architecture)
10. [Security Architecture](#security-architecture)
11. [Deployment Architecture](#deployment-architecture)

## System Overview

We Love Dogs is a **transparent donations platform** that combines the user experience of Web2 applications with the transparency and trust of blockchain technology. The system integrates multiple Stellar-native services to provide a seamless experience for care providers and donors.

Starting in **Costa Rica**, the platform is designed to scale across Latin America — connecting donors to real rescue stories while keeping every dollar traceable.

### Core Principles

- **Web2 UX, Web3 Trust**: Familiar user interface with blockchain-backed transparency
- **Hybrid Architecture**: Off-chain data for performance, on-chain data for trust
- **Multi-Service Integration**: Supabase (backend), Stellar Wallets Kit (wallet UX), Trustless Work (escrow), MoneyGram Ramps *(planned)*, Etherfuse *(planned)*, Rozo *(planned)*, DeFindex *(planned)*
- **Real-time Updates**: Live campaign progress and donation tracking
- **Security First**: Row Level Security, wallet-based authentication, smart contract escrow
- **Fiat On/Off Ramps** *(planned)*: MoneyGram (SEP-24 cash in/out) and Etherfuse (FX API, MXN ↔ USDC, stablebond swaps) for donors and care providers without prior crypto
- **Intent-Based Payments** *(planned)*: Donors declare outcomes (support a dog); Rozo handles chain/token routing
- **Idle Treasury Yield** *(planned)*: Campaign reserves earn yield via DeFindex vaults or Etherfuse stablebond swaps until disbursed

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  Next.js 16 (React 19) + Tailwind CSS + shadcn/ui         │
│  - Server Components (SEO, Performance)                    │
│  - Client Components (Interactivity)                        │
│  - API Routes (Backend Integration)                        │
│  - RozoPayButton (planned — cross-chain checkout)          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  - Context Providers (Supabase, Wallets, Trustless Work)   │
│  - Custom Hooks (useDonation, useEscrow, useWalletsKit)    │
│  - Server Actions (updateQuestProgress, generateAbout)     │
│  - Middleware/Proxy (Auth, Route Protection)               │
│  - DeFindex SDK (planned — server-side vault operations)   │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────┬───────────┬───────────┬───────────┬───────────┐
        ▼           ▼           ▼           ▼           ▼           ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Supabase │ │ Stellar  │ │ Wallets  │ │Trustless │ │   Rozo   │ │ DeFindex │
│ Backend  │ │ Network  │ │   Kit    │ │   Work   │ │(planned) │ │(planned) │
├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤
│PostgreSQL│ │ Horizon  │ │ Freighter│ │ Escrow   │ │ Intents  │ │ Vault    │
│ Auth     │ │ Soroban  │ │ xBull    │ │ API      │ │ API      │ │ API/SDK  │
│ Storage  │ │ Stellar  │ │ Wallet-  │ │ Indexer  │ │ Intent   │ │ dfTokens │
│ Realtime │ │ SDK      │ │ Connect  │ │ Hooks    │ │ Pay SDK  │ │ APY      │
└──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
        │           │           │           │           │           │
        └───────────┴───────────┴───────────┴───────────┴───────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────┐
│                    Smart Contracts Layer                     │
│  - Donation Contract (Transaction Tracking)                 │
│  - POD POAP Contract (NFT Minting)                         │
│  - Trustless Work Escrow Contracts                          │
│  - Rozo Intent Contracts (Stellar pay-in wrapper)          │
│  - DeFindex Vault Contracts (yield — planned)              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              DeFindex Protocol (planned)                     │
│  - USDC vaults with composable yield strategies            │
│  - dfTokens (vault share tokens) on Soroban                │
│  - Rebalance, rescue, partner fee distribution             │
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
  - Contract building, deployment, invocation, and key management
  - See: [Stellar CLI Documentation](https://developers.stellar.org/docs/tools/cli/stellar-cli)

### Wallet & Signing *(live)*

- **[Stellar Wallets Kit](https://github.com/Creit-Tech/Stellar-Wallets-Kit)** (`@creit.tech/stellar-wallets-kit`): Unified wallet connection and transaction signing
  - Freighter, xBull, Albedo, WalletConnect, and other Stellar wallets
  - Modal-based wallet picker, persistent selection, auto-reconnect
  - Used by all on-chain flows: donations, escrow, POD minting, profile wallet linking

### Escrow *(live)*

- **[Trustless Work](https://trustless.work/)** (`@trustless-work/escrow`): Soroban escrow platform for verified fund release
  - Single-release escrow contracts per campaign
  - Multi-party roles: approver, release signer, dispute resolver, platform
  - React hooks for deploy, fund, query, and send transactions

### Smart Contracts *(live)*

### Payment Abstraction *(planned)*

- **[Rozo](https://rozo.ai/)**: Intent-based stablecoin payment layer
  - Cross-chain checkout — donors pay from Base, Ethereum, Solana, Stellar, etc.
  - [Rozo Intents API](https://apidoc.rozo.ai/) — server-side payment intent creation
  - [Rozo Intent Pay SDK](https://docs.rozo.ai/integration/rozointentpay) — `@rozoai/intent-pay` React component
  - Stellar Soroban pay-in contracts (`stellar_payin_contracts` intent)
  - Liquidity solvers settle to campaign USDC addresses in 1–3 seconds

### Treasury Yield *(planned)*

- **[DeFindex](https://www.defindex.io/)**: Decentralized yield vault protocol on Soroban
  - Plug-and-play USDC vault strategies
  - [DeFindex TypeScript SDK](https://docs.defindex.io/advanced-documentation/sdks/02-defindex-sdk) — vault create, deposit, withdraw, APY
  - [DeFindex API](https://docs.defindex.io/api-integration-guide/api.md) — `https://api.defindex.io`
  - dfTokens — vault share tokens implementing Stellar token interface
  - Partner fee model aligned with platform incentives

### Fiat Ramps *(planned)*

- **[MoneyGram Ramps](https://developers.moneygram.com/)**: SEP-10/SEP-24 USDC cash on-ramp and off-ramp on Stellar
  - `@stellar/typescript-wallet-sdk` — wallet SDK with SEP-10 auth and SEP-24 interactive flows
  - Non-custodial path: `stellar.toml` home domain + signing key; custodial path: registered platform accounts
  - MoneyGram webview for KYC and transaction details; poll `pending_user_transfer_start` → send/receive USDC with memo
  - Testnet USDC issuer: `GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5`
  - Mainnet USDC issuer: `GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN`
  - Production limits: on-ramp 5–950 USDC/tx; off-ramp 5–2,500 USDC/tx; off-ramp in 174 countries

- **[Etherfuse](https://www.etherfuse.com/)**: FX API for fiat on/off ramps and crypto swaps on Stellar
  - [Ramp API](https://docs.etherfuse.com/overview) — onramp (fiat → USDC/stablebonds), offramp, swap (USDC → stablebonds e.g. CETES)
  - Sandbox: `https://api.sand.etherfuse.com` · Production: `https://api.etherfuse.com`
  - Stellar testnet/mainnet; automatic trustline handling on first onramp via `stellarClaimTransaction` XDR
  - Webhooks (`order_updated`, `swap_updated`) with HMAC-SHA256 verification
  - Strong fit for **Mexico / Latin America** (MXN) and tokenized sovereign bond yield (stablebonds)

### Build & Tools

- **Turborepo**: Monorepo build system
- **Stellar CLI**: Smart contract development and deployment
  - Builds Rust contracts to WASM (`stellar contract build`)
  - Deploys contracts to networks (`stellar contract deploy`)
  - Generates TypeScript bindings (`stellar contract bindings typescript`)
- **ESLint & Prettier**: Code quality
- **Husky**: Git hooks

## Integrations Overview

We Love Dogs is built on a **composable stack of Stellar-ecosystem integrations**. Each partner service owns a distinct concern; the app orchestrates them through React context providers, hooks, and API routes.

| Integration | Package / Service | Status | Role in We Love Dogs |
|-------------|-------------------|--------|----------------------|
| **Supabase** | `@supabase/supabase-js` | Live | Auth, Postgres, Storage, Realtime — campaigns, profiles, transaction cache |
| **Stellar Wallets Kit** | `@creit.tech/stellar-wallets-kit` | Live | Wallet connect, address persistence, transaction signing for all on-chain actions |
| **Trustless Work** | `@trustless-work/escrow` | Live | Escrow donation rail — funds held until expense proof and release signer approval |
| **Stellar Network** | `@stellar/stellar-sdk`, Soroban RPC | Live | USDC payments, contract invocations, on-chain verification |
| **Rozo** | `@rozoai/intent-pay`, Intents API | Planned | Cross-chain donations — pay from any chain, settle USDC on Stellar |
| **MoneyGram Ramps** | `@stellar/typescript-wallet-sdk`, SEP-10/SEP-24 | Planned | Cash on-ramp/off-ramp — buy or sell USDC at MoneyGram locations (174 countries off-ramp) |
| **Etherfuse** | FX API (`api.etherfuse.com`) | Planned | Fiat ramps (MXN ↔ USDC), stablebond swaps (e.g. CETES), Latin America focus |
| **DeFindex** | DeFindex SDK / API | Planned | Treasury yield on idle campaign USDC via Soroban vaults |

**Provider tree** (see `components/Providers.tsx`):

```
SupabaseProvider
  └─ SorobanProvider
       └─ WalletsKitProvider      ← Stellar Wallets Kit
            └─ TrustlessWorkProvider   ← Trustless Work
                 └─ {app}
```

Rozo, MoneyGram, and Etherfuse plug in at the **donor funding layer**; DeFindex at the **care provider treasury layer**. All fiat and cross-chain rails settle to Stellar USDC before reaching campaigns or escrow.

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

### 2. Stellar Network Integration

**Purpose:** Public blockchain layer for USDC transfers, Soroban smart contract calls, and on-chain verification.

**Surfaces**

| Surface | Location | Use |
|---------|----------|-----|
| Horizon API | Server + client via Stellar SDK | Submit and query payment transactions |
| Soroban RPC | `contexts/SorobanContext.tsx`, contract hooks | Donation contract, POD POAP minting |
| Stellar SDK | `hooks/useDonation.ts`, API routes | Build and parse transaction XDR |
| Stellar CLI | `contracts/` workspace | Build and deploy own Soroban contracts |

**Connection Flow:**

```
Transaction build → Stellar SDK / API route
Sign → Stellar Wallets Kit (see §3)
Submit → Horizon API → Stellar Network
Contract call → Soroban RPC → Donation / POD POAP contracts
```

**Environment Variables:**

```env
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_STELLAR_HORIZON_URL=
NEXT_PUBLIC_STELLAR_SOROBAN_RPC_URL=
DONATION_BINDING=donation
POD_POAP_BINDING=pod_poap
```

### 3. Stellar Wallets Kit Integration *(live)*

**Purpose in We Love Dogs**

Every on-chain action requires a connected Stellar wallet. Stellar Wallets Kit provides a single abstraction over Freighter, xBull, WalletConnect, Albedo, and other wallets — so donors and care providers connect once and sign donations, escrow operations, and NFT mints without wallet-specific code.

**Package:** `@creit.tech/stellar-wallets-kit` (^1.5.0)

**Concepts**

| Concept | Description |
|---------|-------------|
| **StellarWalletsKit** | Core SDK instance — network, modules, selected wallet |
| **allowAllModules()** | Registers all supported wallet adapters |
| **openModal** | Wallet picker UI for connect flow |
| **signTransaction** | Signs XDR with connected wallet extension |
| **WalletNetwork** | TESTNET vs PUBLIC mapped from `NEXT_PUBLIC_STELLAR_NETWORK` |

**Integration Surfaces**

| Surface | Location | Use |
|---------|----------|-----|
| **WalletsKitProvider** | `contexts/WalletsKitContext.tsx` | App-wide kit instance, address state, sign helper |
| **useWalletsKit** | `hooks/useWalletsKit.ts` | `isConnected`, `shortAddress`, connect/disconnect |
| **WalletConnection** | `profile/care-provider/components/WalletConnection.tsx` | Link wallet to care provider profile |
| **Header / WalletMenu** | `components/header.tsx`, `WalletMenu.tsx` | Connect button, address display, disconnect |
| **Donation flows** | `DonationModal`, `DonationButton`, `sticky-donation-widget` | Gate donate on wallet connection |
| **Escrow flows** | `useEscrow`, `CreateEscrowModal` | Sign deploy and fund escrow transactions |
| **NFT flows** | `usePodPoap`, `useDonationNFT` | Sign Soroban mint transactions |

**Connection Flow:**

```
User clicks "Connect Wallet"
  → kit.openModal({ onWalletSelected })
  → kit.setWallet(walletId)
  → kit.getAddress() → address stored in state + localStorage
  → Auto-reconnect on next visit via stellar.wallet.selected

User donates / creates escrow / mints NFT
  → Hook builds unsigned XDR (API or Trustless Work)
  → signTransaction(xdr) → Wallets Kit → wallet extension popup
  → signed XDR returned → submit via Horizon or Trustless Work sendTransaction
```

**Persistence**

| Key | Purpose |
|-----|---------|
| `stellar.wallet.selected` | Last chosen wallet module ID |
| `stellar.wallet.address` | Cached public key for faster UI render |

**Environment Variables:**

```env
NEXT_PUBLIC_STELLAR_NETWORK=testnet   # drives WalletNetwork.TESTNET | PUBLIC
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=   # WalletConnect module (mobile wallets)
```

**Documentation:** [Stellar Wallets Kit](https://github.com/Creit-Tech/Stellar-Wallets-Kit) · [Stellar Wallets Kit docs](https://stellarwalletskit.dev/)

**Dependency note:** Rozo Intent Pay SDK also lists `@creit.tech/stellar-wallets-kit` as a peer dependency — both integrations share the same wallet layer when Rozo is added.

### 4. Trustless Work Integration *(live)*

**Purpose in We Love Dogs**

Escrow donations give donors confidence: USDC is held in a Soroban escrow contract until the care provider submits verified expense proof and the release signer approves disbursement. Trustless Work provides the escrow API, contract deployment, indexer, and React hooks — We Love Dogs configures roles and trustlines per campaign.

**Package:** `@trustless-work/escrow` (^3.0.5)

**Concepts**

| Concept | Description |
|---------|-------------|
| **Single-release escrow** | One milestone — funds released in full after approval |
| **Roles** | approver, serviceProvider, platformAddress, releaseSigner, disputeResolver, receiver |
| **Trustline** | USDC asset config (`address` + `symbol`) required on every escrow payload |
| **Indexer** | Query escrow state and balances by contract ID |
| **Deploy → Sign → Send** | API returns unsigned XDR; Wallets Kit signs; `sendTransaction` submits |

**Integration Surfaces**

| Surface | Location | Use |
|---------|----------|-----|
| **TrustlessWorkProvider** | `contexts/TrustlessWorkContext.tsx` | Wraps `TrustlessWorkConfig` with API key and network |
| **useEscrow** | `hooks/useEscrow.ts` | `initializeCampaignEscrow`, `fundCampaignEscrow`, balance queries |
| **CreateEscrowModal** | `components/CreateEscrowModal.tsx` | Care provider creates escrow for a campaign |
| **sticky-donation-widget** | `components/sticky-donation-widget.tsx` | Escrow vs instant choice; `useGetMultipleEscrowBalances` |
| **useCampaignBalances** | `hooks/useCampaignBalances.ts` | Campaign funding progress from escrow indexer |

**Trustless Work Hooks Used**

```typescript
useInitializeEscrow()      // deployEscrow(payload, "single-release")
useFundEscrow()            // fundEscrow(payload)
useGetEscrowFromIndexerByContractIds()
useGetMultipleEscrowBalances()
useSendTransaction()       // submit signed XDR
```

**Escrow Payload (campaign create)**

```
signer: connected wallet
engagementId: campaignId
roles.receiver: campaign Stellar USDC address
roles.approver / serviceProvider: care provider address
roles.platformAddress, releaseSigner, disputeResolver: env-configured
trustline: { symbol: "USDC", address: NEXT_PUBLIC_TRUSTLINE_ADDRESS }
milestones: [{ description: "Funds for {dogName}'s care..." }]
```

**Connection Flow:**

```
Care provider creates campaign escrow
  → useEscrow.initializeCampaignEscrow()
  → Trustless Work API → unsigned deploy XDR
  → Wallets Kit signTransaction → sendTransaction
  → contractId stored on campaign (Supabase)

Donor chooses escrow donation
  → useEscrow.fundCampaignEscrow(contractId, amount)
  → fund XDR → sign → send
  → POST /api/donation/record (donation_type: "escrow")

Expense approved → release flow (Trustless Work API + release signer)
  → USDC released to campaign receiver address
```

**Environment Variables:**

```env
NEXT_PUBLIC_TRUSTLESS_WORK_API_KEY=
NEXT_PUBLIC_PLATFORM_ADDRESS=
NEXT_PUBLIC_DISPUTE_RESOLVER_ADDRESS=
NEXT_PUBLIC_RELEASE_SIGNER_ADDRESS=
NEXT_PUBLIC_TRUSTLINE_ADDRESS=
NEXT_PUBLIC_TRUSTLINE_SYMBOL=USDC    # optional, default USDC
```

**Network routing:** `TrustlessWorkProvider` selects `development` base URL for testnet and `mainNet` for production based on `NEXT_PUBLIC_STELLAR_NETWORK`.

**Documentation:** [Trustless Work](https://trustless.work/) · [@trustless-work/escrow](https://www.npmjs.com/package/@trustless-work/escrow)

### 5. Smart Contract Integration

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

### 6. Rozo Integration *(planned)*

**Purpose in We Love Dogs**

Many donors hold stablecoins on non-Stellar chains or use wallets like MetaMask and Phantom. Rozo removes that friction: donors declare an outcome (“donate $25 to this campaign”) and Rozo handles token, chain, and routing abstraction.

**Rozo Concepts**

| Concept | Description |
|---------|-------------|
| **ROZO Intents** | Outcome-based payments — user specifies result, not process |
| **Intent Address** | Deterministic pay-in address (Soroban `C…` contract or chain-specific deposit address) |
| **Liquidity Solvers** | Third parties detect incoming payment and front settlement to merchant |
| **exactIn** | Fixed amount payment |
| **anyAmount** | Flexible amount ($0.02–$3,000 USDC); system detects received amount |

**Integration Surfaces**

| Surface | Use in We Love Dogs |
|---------|---------------------|
| **RozoPayButton** (`@rozoai/intent-pay`) | “Pay with any crypto” option in donation modal |
| **Intents API** (`POST /payment-api`) | Server creates payment intents with campaign as destination |
| **stellar_payin_contracts** | Pay-in to Soroban contract; no memo required |
| **Wallet top-up (`anyAmount`)** | Cross-chain top-up to campaign or escrow Stellar address |
| **Webhooks / polling** | Confirm payment → record donation in Supabase |

**API Host:** `https://intentapiv4.rozo.ai/functions/v1`

**Stellar V1 Contract (mainnet):** `CAC5SKP5FJT2ZZ7YLV4UCOM6Z5SQCCVPZWHLLLVQNQG2RWWOOSP3IYRL` — payment wrapper with destination + memo routing ([rozo-intents-contracts](https://github.com/RozoAI/rozo-intents-contracts))

**Planned Connection Flow:**

```
Donor selects campaign → Frontend
  ├─ Path A: Stellar wallet (existing) → useDonation → Horizon
  └─ Path B: Any-chain (Rozo) → RozoPayButton or Intents API
        ├─ Create intent (destination = campaign Stellar USDC address)
        ├─ Donor pays from preferred chain/wallet
        ├─ Solver detects payment → settles USDC on Stellar
        └─ Webhook/poll → /api/donation/record → Supabase
```

**Planned Environment Variables:**

```env
NEXT_PUBLIC_ROZO_APP_ID=
ROZO_API_TOKEN=              # server-side only
ROZO_WEBHOOK_SECRET=         # verify payment callbacks
```

**Documentation:** [Rozo Lite Paper](https://docs.rozo.ai/start/litepaper.md) · [Stellar Contract Payments](https://docs.rozo.ai/integration/api-doc/api-for-advanced-used/stellar-contract-payments) · [Intent Pay SDK](https://docs.rozo.ai/integration/rozointentpay)

### 7. DeFindex Integration *(planned)*

**Purpose in We Love Dogs**

Campaign treasuries often hold idle USDC between donations and verified expense disbursements. DeFindex lets care providers (or the platform on their behalf) deposit reserves into audited Soroban vaults to earn yield while maintaining withdraw-on-demand access for approved expenses.

**DeFindex Concepts**

| Concept | Description |
|---------|-------------|
| **Vault** | Soroban smart contract accepting USDC deposits, minting dfTokens |
| **dfTokens** | Vault share tokens — proportional claim on vault assets + accrued yield |
| **Strategies** | Composable yield sources (e.g., Blend on testnet, production strategies on mainnet) |
| **invest: true** | Auto-allocate deposited funds into yield strategies |
| **Rebalance** | Manager moves funds between strategies |
| **Rescue** | Emergency withdrawal safeguard |
| **Partner fees** | Platform earns when users earn |

**Integration Surfaces**

| Surface | Use in We Love Dogs |
|---------|---------------------|
| **DefindexSDK** (server) | Build deposit/withdraw XDR, query APY and balances |
| **DeFindex API** | `POST /vault/{address}/deposit`, `/withdraw`, `/rebalance` |
| **Fee-bump transactions** | Sponsor gas so care providers don't need XLM for vault ops |
| **Care provider dashboard** | “Treasury yield” panel — balance, APY, deposit/withdraw actions |

**Planned Connection Flow:**

```
Campaign receives donations → USDC in campaign/escrow wallet
Care provider (or automated rule) → deposit idle USDC to DeFindex vault
  ├─ SDK.depositToVault({ amounts, caller, invest: true })
  ├─ Sign XDR (wallet or fee-bump sponsor)
  └─ dfTokens minted → track vault position in Supabase

Expense approved → withdraw from vault
  ├─ SDK.withdrawFromVault({ amounts, caller })
  ├─ USDC returned to campaign wallet
  └─ Disburse via instant payment or escrow release
```

**Vault Scope Options (implementation decision)**

1. **Per-campaign vault** — isolated yield per dog campaign (higher operational overhead)
2. **Per care-provider vault** — one vault per shelter/rescuer, tagged allocations in Supabase *(recommended starting point)*
3. **Platform treasury vault** — yield on platform fees only

**Planned Environment Variables:**

```env
DEFINDEX_API_KEY=            # server-side only
NEXT_PUBLIC_DEFINDEX_VAULT_ADDRESS=   # default vault for treasury ops
DEFINDEX_SPONSOR_SECRET=     # fee-bump sponsor account (optional)
```

**Documentation:** [DeFindex API Guide](https://docs.defindex.io/api-integration-guide/api.md) · [TypeScript SDK](https://docs.defindex.io/advanced-documentation/sdks/02-defindex-sdk) · [Deposit & dfTokens](https://docs.defindex.io/api-integration-guide/guides-and-tutorials/deposit-and-transfer-dftokens) · [Sponsored Transactions](https://docs.defindex.io/api-integration-guide/guides-and-tutorials/sponsored-transactions)

### 8. MoneyGram Ramps Integration *(planned)*

**Purpose in We Love Dogs**

Many donors and care providers in Costa Rica and across Latin America do not hold USDC or use crypto wallets today. MoneyGram Ramps lets them **deposit cash (on-ramp)** to receive USDC on Stellar, or **withdraw cash (off-ramp)** by selling USDC at MoneyGram locations — bridging traditional finance and on-chain donations.

We Love Dogs fits the **non-custodial Stellar wallet** path: each user connects via Stellar Wallets Kit; MoneyGram authenticates via SEP-10 using the platform’s `stellar.toml` home domain.

**Package:** `@stellar/typescript-wallet-sdk` (Stellar Wallet SDK)

**Concepts**

| Concept | Description |
|---------|-------------|
| **SEP-10** | Stellar authentication — prove control of a Stellar account to MoneyGram |
| **SEP-24** | Interactive deposit/withdrawal — opens MoneyGram UI in webview for KYC and instructions |
| **Home domain** | Non-custodial wallets pass domain from `stellar.toml` during SEP-10 |
| **Memo** | Ties inbound/outbound USDC transfers to MoneyGram transaction records |
| **Trustline** | Account must trust USDC issuer before holding USDC |
| **pending_user_transfer_start** | Poll until user must send (withdraw) or receive (deposit) USDC |

**Onboarding (platform prerequisite)**

1. Host `stellar.toml` at platform domain with **SIGNING_KEY** for testnet/mainnet
2. Verify via [Stellar TOML Checker](https://stellar.org/tools/toml-checker)
3. Email **ramps@moneygram.com** with TOML domain (non-custodial) for allowlisting
4. For custodial model: provide auth/deposit/withdraw wallet addresses instead

**Integration Surfaces (planned)**

| Surface | Use in We Love Dogs |
|---------|---------------------|
| **DonationModal / widget** | “Add funds with MoneyGram” before donating |
| **Care provider dashboard** | Off-ramp USDC to local cash after campaign disbursement |
| **`lib/moneygram/client.ts`** | SEP-10 auth + SEP-24 deposit/withdraw initiation |
| **`/api/moneygram/webhook` or poll** | Transaction status → update user balance / trigger donate flow |
| **`public/.well-known/stellar.toml`** | Platform home domain for SEP-10 (non-custodial) |

**Connection Flow (deposit → donate):**

```
Donor without USDC → "Fund wallet with MoneyGram"
  → SEP-10 authenticate (user pubkey + platform home domain)
  → SEP-24 initiate deposit → MoneyGram webview (KYC, amount)
  → Poll until pending_user_transfer_start
  → USDC credited to user's Stellar wallet (with memo)
  → Donor completes donation via useDonation or escrow (existing flow)
```

**Connection Flow (withdraw — care provider):**

```
Care provider has USDC in wallet → "Cash out via MoneyGram"
  → SEP-10 → SEP-24 initiate withdrawal
  → MoneyGram webview → poll pending_user_transfer_start
  → User sends USDC to MoneyGram address with provided memo
  → Fetch reference number for cash pickup at MoneyGram location
```

**USDC Asset Details**

| Network | Issuing Account |
|---------|-----------------|
| Testnet | `GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5` |
| Mainnet | `GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN` |

**Production Limits**

| Direction | Per transaction | Notes |
|-----------|-----------------|-------|
| On-ramp | 5 – 950 USDC | Cash → USDC |
| Off-ramp | 5 – 2,500 USDC | USDC → cash; **174 countries** |

**Go-live path:** Sandbox (TestNet) → Production Preview (real funds, low limits) → full Production (certification + KYB via business.moneygram.com).

**Planned Environment Variables:**

```env
NEXT_PUBLIC_MONEYGRAM_HOME_DOMAIN=welovedogs.org
MONEYGRAM_STELLAR_SIGNING_KEY=     # server-side; matches stellar.toml SIGNING_KEY
NEXT_PUBLIC_STELLAR_TOML_URL=      # e.g. https://welovedogs.org/.well-known/stellar.toml
```

**Documentation:** MoneyGram Ramps integration guide · [Stellar Wallet SDK](https://github.com/stellar/typescript-wallet-sdk) · [SEP-10](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0010.md) · [SEP-24](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0024.md)

### 9. Etherfuse Integration *(planned)*

**Purpose in We Love Dogs**

Etherfuse extends fiat access beyond MoneyGram’s cash network — especially **MXN on/off ramps** and **stablebond swaps** (tokenized sovereign bonds like CETES that accrue on-chain yield). This supports Mexican and broader Latin American donors who prefer bank transfer rails, and gives care providers an alternative yield path alongside DeFindex.

**Service:** [Etherfuse FX API](https://docs.etherfuse.com/overview)

**Concepts**

| Concept | Description |
|---------|-------------|
| **Onramp** | Fiat (MXN) → crypto (USDC, stablebonds) |
| **Offramp** | Crypto → fiat (MXN) to linked CLABE bank account |
| **Swap** | Crypto → crypto (typically USDC → stablebond for yield) |
| **Stablebonds** | Tokenized sovereign bonds (e.g. CETES) — fractional, yield-bearing |
| **Quote** | `POST /ramp/quote` — 2-minute expiry; returns fees and destination amount |
| **Order / Swap** | `POST /ramp/order` or `POST /ramp/swap` — execute quote |
| **stellarClaimTransaction** | Unsigned XDR for first-time Stellar onramp (trustline + claim) |

**Integration Flow (API pattern)**

```
1. Onboard customer → presigned URL or programmatic KYC (customerId, bankAccountId)
2. Register wallet → POST /ramp/wallet (Stellar publicKey)
3. GET /ramp/assets?blockchain=stellar → available USDC, stablebonds
4. POST /ramp/quote → onramp | offramp | swap pricing
5. POST /ramp/order or POST /ramp/swap → execute
6. User signs on-chain tx when required (Wallets Kit)
7. Webhooks (order_updated / swap_updated) → update UI + trigger donation
```

**Integration Surfaces (planned)**

| Surface | Use in We Love Dogs |
|---------|---------------------|
| **`lib/etherfuse/client.ts`** | Server-side API client; `Authorization: {api-key}` (no Bearer prefix) |
| **`/api/etherfuse/quote`, `/order`, `/webhook`** | Quote, order creation, HMAC webhook verification |
| **Donor flow** | MXN → USDC onramp → donate to campaign |
| **Care provider flow** | USDC offramp to MXN bank; or USDC → CETES swap for treasury yield |
| **Hosted onboarding** | Etherfuse presigned KYC URL embedded in registration |

**Stellar-specific notes**

- Pass `walletAddress` in quote for automatic trustline onboarding fee calculation
- First onramp returns `stellarClaimTransaction` — user signs via Wallets Kit to claim USDC
- Offramps and swaps require trustline already established
- Sandbox Stellar USDC: `USDC:GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5`
- Production Stellar USDC: `USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN`

**Relation to DeFindex**

| | DeFindex | Etherfuse stablebond swap |
|--|----------|---------------------------|
| Yield source | Soroban vault strategies | Tokenized sovereign bonds (CETES, etc.) |
| Primary market | Global Stellar DeFi | Mexico / LATAM fiat rails |
| Token | dfTokens (vault shares) | Stablebond tokens |
| Best for | Idle USDC in campaign treasury | MXN donors + bond-based yield preference |

Both can coexist — DeFindex for USDC vault yield; Etherfuse for fiat ramps and stablebond allocation.

**Planned Environment Variables:**

```env
ETHERFUSE_API_KEY=                 # server-side only
ETHERFUSE_API_URL=https://api.sand.etherfuse.com   # sandbox; prod: https://api.etherfuse.com
ETHERFUSE_WEBHOOK_SECRET=          # HMAC verification for X-Signature header
```

**Documentation:** [Initial Setup](https://docs.etherfuse.com/initial-setup) · [Overview](https://docs.etherfuse.com/overview) · [Testing Onramps](https://docs.etherfuse.com/guides/testing-onramps) · [Testing Swaps](https://docs.etherfuse.com/guides/testing-swaps) · [Verifying Webhooks](https://docs.etherfuse.com/guides/verifying-webhooks)

## Integration Roadmap

We Love Dogs uses **four live integrations today** (Supabase, Stellar Wallets Kit, Trustless Work, Stellar/Soroban) and is adding **four Stellar-ecosystem partners** next.

### Current stack (live)

| Integration | Donation impact |
|-------------|-----------------|
| **Stellar Wallets Kit** | Connect wallet → sign instant USDC payments and escrow txs |
| **Trustless Work** | Escrow rail — hold funds until verified expense release |
| **Stellar + Soroban** | On-chain USDC, donation contract, POD POAP NFTs |
| **Supabase** | Campaign data, auth, off-chain transaction cache |

### Near-term additions (planned)

| Integration | Donation impact |
|-------------|-----------------|
| **MoneyGram Ramps** | Cash on/off-ramp — donors buy USDC with cash; care providers cash out locally |
| **Etherfuse** | Bank fiat ramps (MXN ↔ USDC), stablebond swaps for LATAM users |
| **Rozo** | Cross-chain checkout — donors with crypto on other chains |
| **DeFindex** | Soroban vault yield on idle campaign treasury |

### Phased rollout

```
Phase 1 (live)              Phase 2 (fiat + cross-chain)        Phase 3 (yield)
────────────────            ────────────────────────────        ───────────────
Wallets Kit + TW escrow →   MoneyGram SEP-24 cash ramps    →   DeFindex vaults
Instant USDC donations      Etherfuse MXN ↔ USDC               Etherfuse stablebond swaps
POD POAP + Supabase           Rozo cross-chain pay               Treasury APY dashboard
```

### Rozo — Cross-Chain Donations

**Problem:** Donors without Stellar wallets or USDC on Stellar cannot easily support campaigns.

**Solution:** Rozo intent-based abstraction — pay from any supported chain/token; campaign receives USDC on Stellar.

**We Love Dogs touchpoints:**

| Layer | Planned change |
|-------|----------------|
| UI | Add “Pay with any crypto” alongside existing Stellar wallet flow in `DonationModal` / `DonationButton` |
| API | New `/api/rozo/create-payment` — creates intent with campaign address as destination |
| API | New `/api/rozo/webhook` — payment confirmation → triggers `/api/donation/record` |
| DB | Extend `transactions` with `payment_provider` (`stellar` \| `rozo`) and `rozo_payment_id` |
| NFT | POD minting unchanged — triggered after confirmed donation regardless of payment rail |

**Donation flow (Rozo — planned):**

```
1. Donor opens campaign → /donate/[dogId]
2. Donor chooses "Pay with any crypto" → RozoPayButton
3. Frontend/server creates payment intent
   ├─ destination: campaign Stellar USDC address (or escrow contract)
   ├─ type: exactIn (fixed) or anyAmount (flexible)
   └─ display.title: "Support {dogName}"
4. Donor pays from MetaMask / Phantom / Coinbase / Stellar wallet
5. Rozo solver detects payment → settles USDC on Stellar (1–3s)
6. Webhook or poll confirms → POST /api/donation/record
7. Campaign raised amount updated → Realtime UI
8. Quest progress + optional POD NFT (existing flow)
```

**Privacy note:** Rozo uses single-use intent addresses and ephemeral flows — aligns with donors who prefer not to link wallet history to identity.

### MoneyGram Ramps — Cash Fiat On/Off Ramp

**Problem:** Many donors in Costa Rica and Latin America use cash, not crypto wallets or bank-linked stablecoins.

**Solution:** SEP-24 MoneyGram integration — deposit cash → receive USDC on Stellar → donate; or off-ramp campaign proceeds to cash pickup.

**We Love Dogs touchpoints:**

| Layer | Planned change |
|-------|----------------|
| Platform | Host `stellar.toml` with SIGNING_KEY; allowlist via ramps@moneygram.com |
| UI | “Fund with MoneyGram” in donation flow; “Cash out” on care provider wallet |
| Lib | `lib/moneygram/client.ts` — SEP-10 + SEP-24 via `@stellar/typescript-wallet-sdk` |
| Signing | Wallets Kit signs USDC transfer when withdrawal reaches `pending_user_transfer_start` |

**Donation flow (MoneyGram — planned):**

```
1. Donor connects Stellar wallet (Wallets Kit) or creates one
2. Donor selects "Add funds with MoneyGram"
3. SEP-10 auth → SEP-24 deposit → MoneyGram webview (KYC, cash deposit)
4. Poll status → USDC arrives in donor wallet
5. Donor donates via existing instant or escrow flow
```

### Etherfuse — Bank Fiat Ramps & Stablebonds

**Problem:** Bank-based donors (especially Mexico) need MXN ↔ USDC without visiting MoneyGram; some treasuries may prefer sovereign bond yield.

**Solution:** Etherfuse FX API — programmatic on/off ramp and USDC → stablebond swaps with webhook-driven status.

**We Love Dogs touchpoints:**

| Layer | Planned change |
|-------|----------------|
| API | `/api/etherfuse/quote`, `/order`, `/webhook` with HMAC verification |
| Lib | `lib/etherfuse/client.ts` — sandbox then production API |
| UI | "Buy USDC with bank transfer (MXN)" in donor onboarding |
| Treasury | Optional USDC → CETES swap alongside DeFindex vault panel |
| KYC | Hosted Etherfuse onboarding URL or programmatic customer API |

**Onramp flow (Etherfuse — planned):**

```
1. Donor completes Etherfuse KYC (hosted or in-app)
2. POST /ramp/quote (onramp: MXN → USDC, blockchain: stellar)
3. POST /ramp/order → donor deposits MXN to depositClabe
4. Webhook order_updated: funded → completed
5. First-time Stellar user signs stellarClaimTransaction (Wallets Kit)
6. USDC in wallet → donate to campaign
```

### DeFindex — Campaign Treasury Yield

**Problem:** USDC sitting in campaign wallets earns nothing while waiting for verified expenses.

**Solution:** Deposit idle reserves into DeFindex vaults; withdraw when expense proof is approved.

**We Love Dogs touchpoints:**

| Layer | Planned change |
|-------|----------------|
| UI | Treasury panel on care provider campaign dashboard |
| API | New `/api/treasury/deposit`, `/api/treasury/withdraw`, `/api/treasury/apy` |
| Service | `lib/defindex/client.ts` — DefindexSDK wrapper with API key auth |
| DB | New `treasury_positions` table — vault address, dfToken balance, last APY snapshot |
| Hooks | `useTreasuryYield` — APY display, deposit/withdraw actions |

**Treasury flow (DeFindex — planned):**

```
1. Campaign accumulates USDC (instant donations or escrow releases)
2. Care provider views treasury → sees idle balance + current DeFindex APY
3. Care provider deposits idle USDC (above minimum reserve threshold)
   ├─ Server builds deposit XDR via DeFindex SDK
   ├─ Care provider signs (or fee-bump sponsor pays gas)
   └─ invest: true → funds allocated to vault strategies
4. dfToken balance tracked in Supabase
5. Expense approved → withdraw USDC from vault → pay vendor
6. Yield earned stays in vault share price (donor-visible in transparency report)
```

**Safeguards:**

- Minimum liquid reserve always kept outside vault for urgent expenses
- Withdrawals require authenticated care provider + campaign ownership (RLS)
- DeFindex `rescue` function available for protocol-level emergencies
- Escrow funds governed by Trustless Work release rules — yield only on released/non-escrowed balances unless escrow contract supports it

### Combined Architecture (target state)

```
                    ┌─────────────────────────────────┐
                    │         Donor Entry             │
                    └───────────────┬─────────────────┘
                                    │
    ┌───────────────┬───────────────┼───────────────┬───────────────┐
    ▼               ▼               ▼               ▼               ▼
Wallets Kit    MoneyGram       Etherfuse         Rozo          (future)
(instant)      (cash SEP-24)   (MXN bank)    (cross-chain)
    │               │               │               │
    └───────────────┴───────────────┴───────────────┘
                         ▼
              USDC on Stellar (user or campaign wallet)
              or Trustless Work Escrow (live)
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
   Expense payout   DeFindex /        On-chain record
   (TW release)     Etherfuse bonds   (Donation contract)
   MoneyGram/Etherfuse off-ramp
                         │
                         ▼
              Yield + fiat exit (care provider dashboard)
```

## Data Flow

### On-Chain vs Off-Chain Data

**On-Chain (Source of Truth)**

- Donation transactions (via Donation Contract)
- NFT ownership (via POD POAP Contract)
- Escrow contracts (via Trustless Work)
- Transaction hashes (immutable on Stellar)
- Rozo intent settlements (planned — cross-chain pay-in → Stellar USDC)
- MoneyGram SEP-24 deposit/withdrawal records (planned)
- Etherfuse order/swap on-chain signatures (planned)
- DeFindex vault positions and dfToken balances (planned)

**Off-Chain (Performance Cache)**

- User profiles (care_providers, donors)
- Dog profiles and campaigns
- Campaign updates and expenses
- Transaction cache (for UI performance)
- NFT metadata cache
- Rozo payment intent IDs and webhook status (planned)
- MoneyGram transaction IDs and reference numbers (planned)
- Etherfuse customerId, orderId, webhook events (planned)
- Treasury APY snapshots and vault allocation metadata (planned)

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

#### Donation Flow (Rozo — planned)

```
1. Donor selects campaign → Frontend
2. Donor chooses "Pay with any crypto" → RozoPayButton
3. Create payment intent → POST /api/rozo/create-payment
   ├─ appId, type (exactIn | anyAmount)
   ├─ destination.receiverAddress = campaign Stellar address
   └─ display.title = campaign/dog name
4. Donor pays from source chain → Rozo Intent UI
5. Solver detects payment → settles USDC on Stellar
6. Payment confirmed → webhook or poll → POST /api/donation/record
   ├─ payment_provider: "rozo"
   └─ rozo_payment_id stored
7. Update UI → Realtime subscription → Frontend
8. Quest progress + POD NFT (same as instant flow)
```

#### Donation Flow (MoneyGram — planned)

```
1. Donor connects wallet → Wallets Kit
2. Donor selects "Fund with MoneyGram" → SEP-10 authenticate
3. SEP-24 initiate deposit → MoneyGram webview (KYC, cash-in)
4. Poll transaction → pending_user_transfer_start → USDC credited
5. Donor donates → useDonation or escrow (existing flow)
6. POST /api/donation/record (payment_provider: "moneygram_funded")
```

#### Donation Flow (Etherfuse — planned)

```
1. Donor completes Etherfuse KYC → customerId stored (Supabase)
2. POST /api/etherfuse/quote (onramp: MXN → USDC, blockchain: stellar)
3. POST /api/etherfuse/order → donor sends MXN to depositClabe
4. Webhook order_updated → completed
5. If first Stellar onramp → sign stellarClaimTransaction via Wallets Kit
6. Donor donates → existing instant/escrow flow
7. POST /api/donation/record (payment_provider: "etherfuse")
```

#### Treasury Yield Flow (DeFindex — planned)

```
1. Campaign has idle USDC above reserve threshold → Care provider dashboard
2. Care provider initiates deposit → POST /api/treasury/deposit
3. Server builds XDR → DefindexSDK.depositToVault({ invest: true })
4. Care provider signs (or fee-bump sponsor) → submit to Soroban RPC
5. dfTokens minted → record in treasury_positions table
6. APY polled periodically → display on dashboard
7. Expense approved → POST /api/treasury/withdraw
8. USDC returned to campaign wallet → expense disbursement
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
├─ Track expenses → Supabase query
├─ Manage treasury yield (planned) → DeFindex vault / Etherfuse stablebond swap
└─ Cash out proceeds (planned) → MoneyGram off-ramp or Etherfuse MXN off-ramp
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
├─ Fund wallet (if needed — planned)
│   ├─ MoneyGram cash on-ramp (SEP-24)
│   └─ Etherfuse bank on-ramp (MXN → USDC)
├─ Choose payment method
│   ├─ Stellar wallet → Wallet Kit → useDonation (current)
│   └─ Any crypto → RozoPayButton → Intents API (planned)
├─ Choose donation type (escrow/instant) — Stellar path
├─ Enter amount → Frontend
├─ Sign transaction or complete Rozo / ramp checkout
├─ Transaction confirmed → Stellar Network / partner settlement
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

**WalletsKitProvider** (`contexts/WalletsKitContext.tsx`) — *Stellar Wallets Kit*

- Initializes `StellarWalletsKit` with network and `allowAllModules()`
- Manages wallet connection, address, and `signTransaction`
- Persists wallet selection in `localStorage`; auto-reconnect on mount

**TrustlessWorkProvider** (`contexts/TrustlessWorkContext.tsx`) — *Trustless Work*

- Wraps `@trustless-work/escrow` `TrustlessWorkConfig`
- Configures API key and testnet/mainnet base URL
- Enables escrow hooks throughout the app tree

**SorobanProvider** (`contexts/SorobanContext.tsx`)

- Soroban RPC client for POD POAP and donation contract calls

### Custom Hooks

**useDonation** (`hooks/useDonation.ts`)

- Builds donation transactions via API route
- Signs with Stellar Wallets Kit; submits via Horizon

**useEscrow** (`hooks/useEscrow.ts`) — *Trustless Work*

- Creates and funds Trustless Work single-release escrows
- Uses Wallets Kit for signing; Trustless Work `sendTransaction` for submit
- Queries escrow balances from Trustless Work indexer

**useWalletsKit** (`hooks/useWalletsKit.ts`) — *Stellar Wallets Kit*

- Wallet connection management, `isConnected`, `shortAddress`
- Delegates to `WalletsKitContext` for sign and connect

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

### Planned Components *(MoneyGram, Etherfuse, Rozo, DeFindex)*

**MoneyGramRampButton** *(planned — `components/MoneyGramFundButton.tsx`)*

- SEP-10 auth + SEP-24 deposit/withdraw via `@stellar/typescript-wallet-sdk`
- Opens MoneyGram webview; polls transaction status
- Used before donate when donor wallet lacks USDC

**`/api/moneygram/*`** *(planned)*

- SEP-10 challenge generation, SEP-24 transaction initiation, status polling

**EtherfuseClient** *(planned — `lib/etherfuse/client.ts`)*

- Server-side FX API wrapper; quotes, orders, swap execution
- Webhook HMAC verification (`X-Signature`)

**`/api/etherfuse/*`** *(planned)*

- Quote, order, onboarding URL proxy; webhook handler for `order_updated` / `swap_updated`

**RozoPayButton** *(planned — `components/RozoDonationButton.tsx`)*

- Wraps `@rozoai/intent-pay` for cross-chain checkout
- Props: `appId`, campaign Stellar address, amount, `onPaymentCompleted`
- Fallback to Stellar wallet flow if Rozo unavailable

**`/api/rozo/create-payment`** *(planned)*

- Server-side intent creation via Rozo Intents API
- Maps campaign ID → destination address, order ID, display metadata

**`/api/rozo/webhook`** *(planned)*

- Verifies Rozo payment callbacks
- Idempotent donation recording

**DefindexClient** *(planned — `lib/defindex/client.ts`)*

- DefindexSDK singleton with `DEFINDEX_API_KEY`
- Methods: `deposit`, `withdraw`, `getAPY`, `getVaultBalance`

**`/api/treasury/*`** *(planned)*

- Deposit, withdraw, APY endpoints for care provider dashboard
- Fee-bump sponsorship for gasless vault operations

**useTreasuryYield** *(planned — `hooks/useTreasuryYield.ts`)*

- Fetches APY and dfToken balance for connected care provider
- Deposit/withdraw action handlers

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
- `NEXT_PUBLIC_ROZO_APP_ID`, `ROZO_API_TOKEN` (Rozo — planned)
- `NEXT_PUBLIC_MONEYGRAM_HOME_DOMAIN`, `MONEYGRAM_STELLAR_SIGNING_KEY` (MoneyGram — planned)
- `ETHERFUSE_API_KEY`, `ETHERFUSE_WEBHOOK_SECRET` (Etherfuse — planned)
- `DEFINDEX_API_KEY`, `NEXT_PUBLIC_DEFINDEX_VAULT_ADDRESS` (DeFindex — planned)

## Integration Summary

### Service Connections

```
Frontend (Next.js)
├─→ Supabase (PostgreSQL, Auth, Storage)
│   └─→ Real-time subscriptions
├─→ Stellar Wallets Kit (live)
│   ├─→ Freighter, xBull, WalletConnect, Albedo, …
│   └─→ signTransaction → all on-chain flows
├─→ Trustless Work (live)
│   ├─→ Escrow API + React hooks
│   ├─→ Indexer (balances, contract state)
│   └─→ Soroban escrow contracts on Stellar
├─→ Stellar Network
│   ├─→ Horizon API (instant USDC payments)
│   ├─→ Soroban RPC (donation + POD POAP contracts)
│   └─→ Own Soroban contracts (donation, pod_poap)
├─→ Rozo (planned)
│   ├─→ Intents API (cross-chain payment creation)
│   ├─→ Intent Pay SDK (checkout UI)
│   └─→ Liquidity solvers → Stellar USDC settlement
├─→ MoneyGram Ramps (planned)
│   ├─→ SEP-10 authentication
│   ├─→ SEP-24 deposit/withdraw (cash ↔ USDC)
│   └─→ stellar.toml home domain (non-custodial)
├─→ Etherfuse (planned)
│   ├─→ FX API (MXN on/off ramp, stablebond swaps)
│   └─→ Webhooks → order/swap status
└─→ DeFindex (planned)
    ├─→ DeFindex API / SDK (vault operations)
    └─→ Soroban vault contracts (yield strategies)
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

### Beyond planned partner integrations

- **Analytics**: Campaign analytics with ramp, cross-chain, and yield breakdown
- **Notifications**: Real-time push notifications for donations and treasury events
- **Email**: Transactional emails for donations and expense approvals
- **Social**: Social media sharing integration
- **x402 / AI agents**: Rozo-compatible HTTP 402 flows for programmatic micro-donations

### Scalability Considerations

- **Database Indexing**: Optimize queries with proper indexes
- **Caching**: Redis for frequently accessed data (APY snapshots, campaign stats)
- **CDN**: Image and static asset delivery
- **Load Balancing**: Multiple Next.js instances
- **Database Replication**: Read replicas for Supabase

## Related Documentation

- [Getting Started Guide](./GETTING_STARTED.md) — Setup instructions
- [Database Schema](./backend/DATABASE_SCHEMA.md) — Database structure
- [Donation Feature](./DONATION_FEATURE.md) — Donation system details
- [Web App README](../apps/web/README.md) — Routes, API, and features
- [Stellar Wallets Kit](https://github.com/Creit-Tech/Stellar-Wallets-Kit) — Wallet connection and signing
- [Trustless Work](https://trustless.work/) — Escrow integration
- [MoneyGram Ramps](https://developers.moneygram.com/) — SEP-24 cash on/off ramp *(planned)*
- [Etherfuse Documentation](https://docs.etherfuse.com/) — Fiat FX API & stablebonds *(planned)*
- [Rozo Documentation](https://docs.rozo.ai/) — Cross-chain intent payments *(planned)*
- [DeFindex Documentation](https://docs.defindex.io/) — Yield vault integration *(planned)*

---

**Last Updated**: May 2026
