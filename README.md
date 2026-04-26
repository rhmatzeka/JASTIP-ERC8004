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

1. Buyer creates a jastip order.
2. Buyer funds escrow.
3. Jastiper accepts the order.
4. Jastiper buys the item.
5. Jastiper uploads receipt photo and product photo.
6. AI verifies receipt, item match, price, date, and fraud risk.
7. Buyer reviews the verification report.
8. Buyer releases funds or opens a dispute.
9. Platform receives 3% fee.
10. Jastiper reputation is updated.

## Tech Stack

- Next.js 14
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
OPENAI_API_KEY=
NEXT_PUBLIC_PRIVY_APP_ID=
NEXT_PUBLIC_SEPOLIA_RPC_URL=
PRIVATE_KEY=
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

- `OPENAI_API_KEY`: enables real GPT-4o Vision verification
- `NEXT_PUBLIC_SEPOLIA_RPC_URL`: Sepolia RPC endpoint
- `PRIVATE_KEY`: deployer/operator private key
- `PLATFORM_TREASURY_ADDRESS`: receives the 3% platform fee
- `NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS`: deployed `JastipEscrow`
- `NEXT_PUBLIC_AGENT_REGISTRY_CONTRACT_ADDRESS`: deployed `JastipAgentRegistry`

Never commit `.env.local`.

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

1. Open `/demo`.
2. Click `Seed demo buyer order`.
3. Click `Seed demo jastiper`.
4. Open `/marketplace`.
5. Select the Nike Japan order.
6. Accept the order as jastiper.
7. Upload receipt and item photos, or use `/demo` to generate a mock approved AI report.
8. Review `Laporan Verifikasi AI`.
9. Click `Lepas Dana`.
10. Open `/reputation` and show the jastiper's trust score increase.

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

## Current MVP Status

Built for hackathon demo readiness. The app works locally without external services, while still including real integration paths for OpenAI, Sepolia, Supabase, Privy, and Cloudinary.
