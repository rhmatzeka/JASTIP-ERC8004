import { promises as fs } from "fs";
import path from "path";
import {
  DEMO_BUYER_WALLET,
  DEMO_JASTIPER_WALLET,
  MOCK_REFERENCE_PHOTO,
  PLATFORM_FEE_PERCENT
} from "./constants";
import { calculateEscrowAmount, calculateTrustScore } from "./escrowMath";
import type { AgentReputation, Country, Order, OrderStatus, User, VerificationReport, VerificationStatus } from "./types";

type DbShape = {
  users: User[];
  orders: Order[];
  verificationReports: VerificationReport[];
  reputations: AgentReputation[];
};

const DATA_FILE = path.join(process.cwd(), ".jastip-agent-db.json");

function emptyDb(): DbShape {
  return {
    users: [],
    orders: [],
    verificationReports: [],
    reputations: []
  };
}

async function readDb(): Promise<DbShape> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(raw) as DbShape;
  } catch {
    return emptyDb();
  }
}

async function writeDb(db: DbShape) {
  await fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2), "utf8");
}

function id(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`;
}

export async function getOrders(status?: OrderStatus) {
  const db = await readDb();
  const orders = status ? db.orders.filter((order) => order.status === status) : db.orders;
  return orders.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export async function getOrder(orderId: string) {
  const db = await readDb();
  return db.orders.find((order) => order.id === orderId) || null;
}

export async function createOrder(input: Omit<Order, "id" | "status" | "createdAt"> & Partial<Pick<Order, "id" | "status" | "createdAt">>) {
  const db = await readDb();
  const order: Order = {
    ...input,
    id: input.id || id("ord"),
    status: input.status || "CREATED",
    createdAt: input.createdAt || new Date().toISOString()
  };
  db.orders.unshift(order);
  await writeDb(db);
  return order;
}

export async function updateOrder(orderId: string, patch: Partial<Order>) {
  const db = await readDb();
  const index = db.orders.findIndex((order) => order.id === orderId);
  if (index === -1) return null;
  db.orders[index] = { ...db.orders[index], ...patch };
  await writeDb(db);
  return db.orders[index];
}

export async function createVerificationReport(input: Omit<VerificationReport, "id" | "createdAt">) {
  const db = await readDb();
  const report: VerificationReport = {
    ...input,
    id: id("ver"),
    createdAt: new Date().toISOString()
  };
  db.verificationReports.unshift(report);
  await writeDb(db);
  return report;
}

export async function getVerificationReport(reportId?: string) {
  if (!reportId) return null;
  const db = await readDb();
  return db.verificationReports.find((report) => report.id === reportId) || null;
}

export async function getVerificationReportByOrder(orderId: string) {
  const db = await readDb();
  return db.verificationReports.find((report) => report.orderId === orderId) || null;
}

export async function registerAgent(walletAddress: string, metadataURI = "ipfs://demo-jastip-agent") {
  const db = await readDb();
  const normalized = walletAddress.toLowerCase();
  const existing = db.reputations.find((rep) => rep.walletAddress.toLowerCase() === normalized);
  if (existing) return existing;

  const reputation: AgentReputation = {
    id: id("rep"),
    walletAddress,
    agentId: `erc8004-sepolia-${walletAddress.slice(2, 10).toLowerCase()}`,
    metadataURI,
    completedOrders: 0,
    disputedOrders: 0,
    averageVerificationScore: 0,
    trustScore: 0
  };
  db.reputations.unshift(reputation);
  await writeDb(db);
  return reputation;
}

export async function updateReputation(walletAddress: string, completed: boolean, verificationScore: number) {
  const db = await readDb();
  const normalized = walletAddress.toLowerCase();
  let reputation = db.reputations.find((rep) => rep.walletAddress.toLowerCase() === normalized);
  if (!reputation) {
    reputation = await registerAgent(walletAddress);
    return updateReputation(walletAddress, completed, verificationScore);
  }

  if (completed) {
    const previousCompleted = reputation.completedOrders;
    reputation.completedOrders += 1;
    reputation.averageVerificationScore = Math.round(
      (reputation.averageVerificationScore * previousCompleted + verificationScore) / reputation.completedOrders
    );
  } else {
    reputation.disputedOrders += 1;
  }
  reputation.trustScore = calculateTrustScore(
    reputation.completedOrders,
    reputation.averageVerificationScore,
    reputation.disputedOrders
  );

  db.reputations = db.reputations.map((rep) => (rep.walletAddress.toLowerCase() === normalized ? reputation : rep));
  await writeDb(db);
  return reputation;
}

export async function getReputation(walletAddress: string) {
  const db = await readDb();
  const normalized = walletAddress.toLowerCase();
  return db.reputations.find((rep) => rep.walletAddress.toLowerCase() === normalized) || null;
}

export async function getReputations() {
  const db = await readDb();
  return db.reputations.sort((a, b) => b.trustScore - a.trustScore);
}

export async function resetDemoData() {
  await writeDb(emptyDb());
}

export async function seedDemoJastiper() {
  return registerAgent(DEMO_JASTIPER_WALLET, "ipfs://jastip-agent/demo/jastiper-8004");
}

export async function seedDemoBuyerOrder() {
  const existing = (await getOrders()).find((order) => order.itemName.includes("Nike Japan Limited Edition Bag"));
  if (existing) return existing;

  const destinationCountry: Country = "Japan";
  const estimatedLocalPrice = 7000;
  const serviceFeePercent = 12;
  const breakdown = calculateEscrowAmount({ destinationCountry, estimatedLocalPrice, serviceFeePercent });
  return createOrder({
    buyerWallet: DEMO_BUYER_WALLET,
    itemName: "Nike Japan Limited Edition Bag",
    brand: "Nike",
    model: "Japan Limited Edition Bag",
    color: "Black and white",
    size: "One size",
    destinationCountry,
    targetStore: "Nike Harajuku",
    estimatedLocalPrice,
    estimatedIdrPrice: breakdown.estimatedIdrPrice,
    maxBudgetIdr: 950000,
    serviceFeePercent,
    platformFeePercent: PLATFORM_FEE_PERCENT,
    escrowAmountIdr: breakdown.escrowAmount,
    escrowBreakdown: breakdown,
    referencePhotoUrl: MOCK_REFERENCE_PHOTO,
    txHashes: {
      create: "mock-create-demo"
    }
  });
}

export function makeReportJson(status: VerificationStatus, order?: Order) {
  const approved = status === "APPROVED";
  const flagged = status === "FLAGGED";
  const price = order ? Math.round(order.estimatedIdrPrice * (flagged ? 1.12 : approved ? 0.96 : 1.35)) : 735000;
  const risk = approved ? 12 : flagged ? 48 : 86;
  const confidence = approved ? 92 : flagged ? 74 : 42;
  const flags = approved
    ? []
    : flagged
      ? ["Price is more than 10% above original estimate", "Receipt photo is slightly blurry"]
      : ["Missing clear item match", "Receipt total exceeds buyer budget", "Fraud risk above threshold"];

  return {
    store: {
      verified: status !== "REJECTED",
      name: order?.targetStore || "Don Quijote Shibuya"
    },
    item: {
      match_confidence: confidence,
      notes: approved
        ? "Brand, color, and model appear consistent with buyer reference."
        : flagged
          ? "Item resembles the reference, but model details are not fully visible."
          : "Uploaded item does not reliably match the buyer reference photo."
    },
    price: {
      amount_idr: price,
      within_budget: order ? price <= order.maxBudgetIdr : status !== "REJECTED"
    },
    date: {
      valid: status !== "REJECTED"
    },
    fraud_risk: {
      score: risk,
      flags
    },
    overall_status: status
  };
}
