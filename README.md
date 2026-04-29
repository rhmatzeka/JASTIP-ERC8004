# Jastip Agent

AI-powered escrow and reputation layer for Indonesia's jastip economy.

Jastip Agent is a hackathon MVP for **jastip** or **jasa titip**, a personal shopper flow where someone traveling abroad buys products for buyers in Indonesia and brings them home for a fee. Today this market mostly runs through WhatsApp, Instagram DM, and Twitter. Buyers often pay upfront without escrow, item verification, or a portable reputation system for jastipers.

This MVP adds:

- Blockchain escrow for buyer funds
- AI receipt and product verification
- ERC-8004-style jastiper identity and reputation
- A sustainable 3% platform fee model

## Hackathon Requirement Mapping

| Requirement | How Jastip Agent satisfies it |
| --- | --- |
| Real-world use case | Indonesia's jastip market depends on informal trust. This app adds a trust layer for buyers and jastipers. |
| Payment integration | Buyer funds are represented as escrow deposits and released only after verification. |
| Sustainable revenue model | The platform takes a 3% fee from every released escrow. |
| ERC-8004 deployment | Jastiper identities and reputation are represented by an ERC-8004-style registry deployable to Ethereum Sepolia. |

## Product Flow

The app has three product roles:

- `Buyer`: creates jastip orders, reviews AI reports, releases funds, or opens disputes.
- `Jastiper`: completes onboarding, accepts open marketplace orders, uploads purchase proof, and builds wallet reputation.
- `Admin`: invite-only operator access for seeding demo data and generating judge-ready reports.

Access model:

- Anyone can become a Buyer.
- Anyone can apply as a Jastiper, but the login flow requires explicit onboarding acceptance before marketplace actions.
- Admin cannot be self-selected from the app shell. Admin access requires either `ADMIN_INVITE_CODE` or a wallet listed in `ADMIN_WALLET_ALLOWLIST`.

Flow:

1. Buyer creates a jastip order.
2. Buyer funds escrow.
3. Jastiper accepts the order from Marketplace.
4. Jastiper buys the item.
5. Jastiper uploads receipt photo and product photo.
6. AI verifies receipt, item match, price, date, and fraud risk.
7. Buyer reviews the verification report.
8. Buyer releases funds or opens a dispute.
9. Platform receives 3% fee.
10. Jastiper reputation is updated.

## Tech Stack

- Next.js 16
- TypeScript
- Tailwind CSS
- Next.js API routes
- Local JSON database fallback
- Optional Supabase client
- OpenAI GPT-4o Vision with mock fallback
- ethers.js v6
- Solidity
- Hardhat
- Ethereum Sepolia testnet

## Project Structure

```text
app/
  page.tsx
  orders/new/page.tsx
  marketplace/page.tsx
  orders/[id]/page.tsx
  orders/[id]/verify/page.tsx
  reputation/page.tsx
  demo/page.tsx
  api/
components/
  EscrowBreakdown.tsx
  OrderCard.tsx
  VerificationReport.tsx
  ReputationCard.tsx
  StatusBadge.tsx
  UploadBox.tsx
  WalletConnect.tsx
lib/
  aiVerification.ts
  constants.ts
  escrowMath.ts
  mockDb.ts
  supabase.ts
  types.ts
  web3.ts
contracts/
  JastipEscrow.sol
  JastipAgentRegistry.sol
scripts/
  deploy.ts
```

## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

If port `3000` is busy:

```bash
npm run dev -- -p 3001
```

Open:

```text
http://localhost:3001
```

## Environment Setup

Copy the example file:

```bash
cp .env.example .env.local
```

For local demo mode, you can leave most values empty.

```text
NEXT_PUBLIC_APP_URL=http://localhost:3001
AUTH_SECRET=
ADMIN_INVITE_CODE=
ADMIN_WALLET_ALLOWLIST=
ENABLE_DEMO_TOOLS=false
ALLOW_MOCK_AI=false
NEXT_PUBLIC_ENABLE_MOCK_TOOLS=false
OPENAI_API_KEY=
NEXT_PUBLIC_PRIVY_APP_ID=
NEXT_PUBLIC_SEPOLIA_RPC_URL=
PRIVATE_KEY=
ENABLE_SERVER_CHAIN_WRITES=false
NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=
NEXT_PUBLIC_AGENT_REGISTRY_CONTRACT_ADDRESS=
PLATFORM_TREASURY_ADDRESS=0xA6E0000000000000000000000000000000008004
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Important values:

- `AUTH_SECRET`: signs server-side session cookies
- `ADMIN_INVITE_CODE`: enables invite-code based Admin login
- `ADMIN_WALLET_ALLOWLIST`: comma-separated Admin wallet allowlist
- `OPENAI_API_KEY`: enables real GPT-4o Vision verification
- `NEXT_PUBLIC_SEPOLIA_RPC_URL`: Sepolia RPC endpoint
- `PRIVATE_KEY`: deployer/operator private key
- `ENABLE_SERVER_CHAIN_WRITES`: set to `true` only when you intentionally want API routes to submit Sepolia writes with `PRIVATE_KEY`
- `PLATFORM_TREASURY_ADDRESS`: receives the 3% platform fee
- `NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS`: deployed `JastipEscrow`
- `NEXT_PUBLIC_AGENT_REGISTRY_CONTRACT_ADDRESS`: deployed `JastipAgentRegistry`

Never commit `.env.local`.

## Production Hardening Included

This version is stricter than a pure demo scaffold:

- API payloads are validated with `zod`
- Admin login is invite-only through invite code or wallet allowlist
- Jastiper access requires onboarding acceptance before marketplace actions
- The app shell no longer exposes a role dropdown that can jump into Admin
- EVM wallet addresses are checked before write actions
- Invalid order state transitions are rejected
- Verification cannot run before a jastiper accepts an order
- Funds cannot be released before verification
- Rejected AI reports cannot be released
- Local JSON fallback uses serialized writes to reduce demo-time race bugs
- AI output is clamped and normalized before saving
- Backend fraud rules override uncertain model output
- Server-side Sepolia writes are disabled by default to avoid accidentally using one backend wallet for buyer and jastiper roles

## AI Verification

The AI logic lives in:

```text
lib/aiVerification.ts
```

The verification route is:

```text
POST /api/orders/:id/verify
```

The AI receives:

- Receipt photo
- Item photo with receipt
- Additional item photo
- Buyer reference photo
- Order metadata such as brand, model, color, size, store, and budget

If `OPENAI_API_KEY` exists, the app calls GPT-4o Vision and asks it to return strict JSON:

```json
{
  "store": {
    "verified": true,
    "name": "Nike Harajuku"
  },
  "item": {
    "match_confidence": 92,
    "notes": "Brand, color, and model appear consistent with buyer reference."
  },
  "price": {
    "amount_idr": 735000,
    "within_budget": true
  },
  "date": {
    "valid": true
  },
  "fraud_risk": {
    "score": 12,
    "flags": []
  },
  "overall_status": "APPROVED"
}
```

The backend then applies deterministic fraud rules:

- Missing receipt photo: reject
- Missing item photo: reject
- Empty store name: flag
- Price above budget by more than 10%: flag
- Item confidence below 60: reject
- Fraud risk score 70 or above: reject
- Item confidence 60 to 84 or fraud risk 30 to 69: flag
- Otherwise: approve

If there is no OpenAI key, the app returns a realistic mock verification report so the hackathon demo still works.

## Smart Contracts

### `JastipEscrow.sol`

Escrow contract for buyer-funded orders.

Main functions:

- `createOrder()` payable
- `acceptOrder(uint256 orderId)`
- `markVerified(uint256 orderId, uint256 verificationScore)`
- `releaseFunds(uint256 orderId)`
- `openDispute(uint256 orderId)`
- `refundBuyer(uint256 orderId)`
- `autoRelease(uint256 orderId)`

Rules:

- Buyer creates an order and deposits ETH as the MVP payment rail.
- Jastiper accepts the order.
- Buyer can release funds after verification.
- Auto-release is allowed 72 hours after verification if no dispute is opened.
- Platform receives 3%.
- Jastiper receives 97%.

### `JastipAgentRegistry.sol`

ERC-8004-style agent identity and reputation registry for jastipers.

Main functions:

- `registerAgent(address wallet, string metadataURI)`
- `updateReputation(address wallet, bool completed, uint256 verificationScore)`
- `getAgent(address wallet)`
- `getTrustScore(address wallet)`

Trust score formula:

```text
trustScore = completedOrders * 10 + averageVerificationScore - disputedOrders * 20
```

## Deploy Contracts To Sepolia

Add this to `.env.local`:

```text
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://...
PRIVATE_KEY=0x...
ENABLE_SERVER_CHAIN_WRITES=true
PLATFORM_TREASURY_ADDRESS=0x...
```

Compile:

```bash
npm run compile
```

Deploy:

```bash
npm run deploy:sepolia
```

Copy the printed addresses into `.env.local`:

```text
NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_AGENT_REGISTRY_CONTRACT_ADDRESS=0x...
```

Restart the app after changing env values.

For a production wallet flow, keep role-sensitive escrow actions in the user's connected wallet:

- buyer signs `createOrder`
- jastiper signs `acceptOrder`
- buyer signs `releaseFunds` or `openDispute`

The backend/operator wallet should mainly handle controlled actions such as reputation updates or admin automation. This repo keeps mock fallback on by default so local demos cannot accidentally submit wrong-role transactions from a single server private key.

## API Routes

```text
POST /api/orders
GET  /api/orders
GET  /api/orders/:id
POST /api/orders/:id/accept
POST /api/orders/:id/verify
POST /api/orders/:id/release
POST /api/orders/:id/dispute
GET  /api/reputation/:wallet
POST /api/agents/register
POST /api/demo
```

## Demo For Judges

Fastest judge flow:

1. Set `ADMIN_INVITE_CODE` in `.env.local`.
2. Open `/login?role=ADMIN`.
3. Connect wallet, enter the invite code, and continue to `/demo`.
4. Click `Seed demo buyer order`.
5. Click `Seed demo jastiper`.
6. Open `/login?role=JASTIPER`, connect wallet, accept onboarding, and continue.
7. Open `/marketplace`.
8. Select the Nike Japan order and click `Accept Order`.
9. Upload proof photos as Jastiper, or return to Admin and generate a mock approved AI report.
10. Open `/login?role=BUYER` and continue as Customer.
11. Open the order, review `Laporan Verifikasi AI`, then click `Lepas Dana`.
12. Open `/reputation` and show the jastiper's trust score increase.

Recommended demo URL:

```text
http://localhost:3001/demo
```

## Escrow Math

Rates:

- 1 JPY = 105 IDR
- 1 KRW = 1.05 IDR
- 1 SGD = 11,500 IDR

Formula:

```text
estimatedIdrPrice = estimatedLocalPrice * rate
serviceFee = estimatedIdrPrice * serviceFeePercent / 100
fxBuffer = estimatedIdrPrice * 5 / 100
platformFee = (estimatedIdrPrice + serviceFee + fxBuffer) * 3 / 100
escrowAmount = estimatedIdrPrice + serviceFee + fxBuffer + platformFee
```

## Real vs Mock Fallback

Real when configured:

- OpenAI GPT-4o Vision via `OPENAI_API_KEY`
- Sepolia contract calls via RPC, private key, and contract addresses
- Solidity contracts deployable through Hardhat

Mock fallback:

- Local JSON database when Supabase is not configured
- Mock wallet generation when Privy is not configured
- Mock stablecoin payment represented as ETH escrow
- Mock AI verification when no OpenAI key exists
- Mock transaction hashes when web3 env vars are missing
- Local preview/data URLs when Cloudinary or Supabase Storage is not configured

## Useful Commands

```bash
npm install
npm run dev
npm run build
npm run compile
npm run deploy:sepolia
```

## Frontend Experience

The landing page uses a pinned Spline 3D hero scene. The scene stays fixed while the first content section scrolls over it, then the iframe is visually hidden once the hero is covered to reduce rendering cost. Returning to the top reveals the already-mounted scene without forcing a full iframe reload.

Navigation uses a floating pill header that compacts on scroll. Internal route transitions show a global loading overlay, and the Spline hero has its own `Loading 3D scene` state so the route does not appear ready before the 3D asset is visible.

## Supabase Schema

The local MVP stores data in `.jastip-agent-db.json`. For hosted persistence, run:

```text
supabase/schema.sql
```

in the Supabase SQL editor, then fill:

```text
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Current MVP Status

Built for hackathon demo readiness. The app works locally without external services, while still including real integration paths for OpenAI, Sepolia, Supabase, Privy, and Cloudinary.
