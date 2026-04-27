import {
  createOrder as createLocalOrder,
  createVerificationReport as createLocalVerificationReport,
  getOrder as getLocalOrder,
  getOrders as getLocalOrders,
  getReputation as getLocalReputation,
  getReputations as getLocalReputations,
  getVerificationReport as getLocalVerificationReport,
  getVerificationReportByOrder as getLocalVerificationReportByOrder,
  makeReportJson,
  registerAgent as registerLocalAgent,
  resetDemoData as resetLocalDemoData,
  seedDemoBuyerOrder as seedLocalDemoBuyerOrder,
  seedDemoJastiper as seedLocalDemoJastiper,
  updateOrder as updateLocalOrder,
  updateReputation as updateLocalReputation
} from "./mockDb";
import { DEMO_BUYER_WALLET, DEMO_JASTIPER_WALLET, MOCK_REFERENCE_PHOTO, PLATFORM_FEE_PERCENT } from "./constants";
import { calculateEscrowAmount, calculateTrustScore } from "./escrowMath";
import { getSupabaseServerClient, isSupabaseConfigured } from "./supabase";
import type { AgentReputation, Country, Order, OrderStatus, VerificationReport } from "./types";

export { makeReportJson };

function useSupabase() {
  return isSupabaseConfigured();
}

function mustSupabase() {
  const supabase = getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase is not configured");
  return supabase;
}

function id(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`;
}

function orderFromRow(row: Record<string, unknown>): Order {
  return {
    id: String(row.id),
    chainOrderId: optionalString(row.chain_order_id),
    buyerWallet: String(row.buyer_wallet),
    jastiperWallet: optionalString(row.jastiper_wallet),
    itemName: String(row.item_name),
    brand: String(row.brand),
    model: String(row.model),
    color: String(row.color),
    size: String(row.size),
    destinationCountry: row.destination_country as Country,
    targetStore: String(row.target_store),
    estimatedLocalPrice: Number(row.estimated_local_price),
    estimatedIdrPrice: Number(row.estimated_idr_price),
    maxBudgetIdr: Number(row.max_budget_idr),
    serviceFeePercent: Number(row.service_fee_percent),
    platformFeePercent: Number(row.platform_fee_percent),
    escrowAmountIdr: Number(row.escrow_amount_idr),
    escrowBreakdown: row.escrow_breakdown as Order["escrowBreakdown"],
    referencePhotoUrl: optionalString(row.reference_photo_url),
    receiptPhotoUrl: optionalString(row.receipt_photo_url),
    itemPhotoUrl: optionalString(row.item_photo_url),
    additionalItemPhotoUrl: optionalString(row.additional_item_photo_url),
    status: row.status as OrderStatus,
    verificationReportId: optionalString(row.verification_report_id),
    createdAt: String(row.created_at),
    acceptedAt: optionalString(row.accepted_at),
    verifiedAt: optionalString(row.verified_at),
    autoReleaseAt: optionalString(row.auto_release_at),
    txHashes: (row.tx_hashes as Order["txHashes"]) || undefined
  };
}

function orderToRow(order: Order) {
  return {
    id: order.id,
    chain_order_id: order.chainOrderId,
    buyer_wallet: order.buyerWallet,
    jastiper_wallet: order.jastiperWallet,
    item_name: order.itemName,
    brand: order.brand,
    model: order.model,
    color: order.color,
    size: order.size,
    destination_country: order.destinationCountry,
    target_store: order.targetStore,
    estimated_local_price: order.estimatedLocalPrice,
    estimated_idr_price: order.estimatedIdrPrice,
    max_budget_idr: order.maxBudgetIdr,
    service_fee_percent: order.serviceFeePercent,
    platform_fee_percent: order.platformFeePercent,
    escrow_amount_idr: order.escrowAmountIdr,
    escrow_breakdown: order.escrowBreakdown,
    reference_photo_url: order.referencePhotoUrl,
    receipt_photo_url: order.receiptPhotoUrl,
    item_photo_url: order.itemPhotoUrl,
    additional_item_photo_url: order.additionalItemPhotoUrl,
    status: order.status,
    verification_report_id: order.verificationReportId,
    tx_hashes: order.txHashes,
    created_at: order.createdAt,
    accepted_at: order.acceptedAt,
    verified_at: order.verifiedAt,
    auto_release_at: order.autoReleaseAt
  };
}

function orderPatchToRow(patch: Partial<Order>) {
  const row: Record<string, unknown> = {};
  const map: Array<[keyof Order, string]> = [
    ["chainOrderId", "chain_order_id"],
    ["jastiperWallet", "jastiper_wallet"],
    ["receiptPhotoUrl", "receipt_photo_url"],
    ["itemPhotoUrl", "item_photo_url"],
    ["additionalItemPhotoUrl", "additional_item_photo_url"],
    ["status", "status"],
    ["verificationReportId", "verification_report_id"],
    ["acceptedAt", "accepted_at"],
    ["verifiedAt", "verified_at"],
    ["autoReleaseAt", "auto_release_at"],
    ["txHashes", "tx_hashes"]
  ];
  map.forEach(([key, column]) => {
    if (key in patch) row[column] = patch[key];
  });
  return row;
}

function reportFromRow(row: Record<string, unknown>): VerificationReport {
  return {
    id: String(row.id),
    orderId: String(row.order_id),
    storeVerified: Boolean(row.store_verified),
    storeName: String(row.store_name),
    itemMatchConfidence: Number(row.item_match_confidence),
    itemNotes: String(row.item_notes),
    priceAmountIdr: Number(row.price_amount_idr),
    priceWithinBudget: Boolean(row.price_within_budget),
    dateValid: Boolean(row.date_valid),
    fraudRiskScore: Number(row.fraud_risk_score),
    fraudFlags: (row.fraud_flags as string[]) || [],
    overallStatus: row.overall_status as VerificationReport["overallStatus"],
    rawJson: row.raw_json as VerificationReport["rawJson"],
    createdAt: String(row.created_at)
  };
}

function reportToRow(report: VerificationReport) {
  return {
    id: report.id,
    order_id: report.orderId,
    store_verified: report.storeVerified,
    store_name: report.storeName,
    item_match_confidence: report.itemMatchConfidence,
    item_notes: report.itemNotes,
    price_amount_idr: report.priceAmountIdr,
    price_within_budget: report.priceWithinBudget,
    date_valid: report.dateValid,
    fraud_risk_score: report.fraudRiskScore,
    fraud_flags: report.fraudFlags,
    overall_status: report.overallStatus,
    raw_json: report.rawJson,
    created_at: report.createdAt
  };
}

function reputationFromRow(row: Record<string, unknown>): AgentReputation {
  return {
    id: String(row.id),
    walletAddress: String(row.wallet_address),
    agentId: String(row.agent_id),
    metadataURI: optionalString(row.metadata_uri),
    completedOrders: Number(row.completed_orders),
    disputedOrders: Number(row.disputed_orders),
    averageVerificationScore: Number(row.average_verification_score),
    trustScore: Number(row.trust_score)
  };
}

function reputationToRow(reputation: AgentReputation) {
  return {
    id: reputation.id,
    wallet_address: reputation.walletAddress,
    agent_id: reputation.agentId,
    metadata_uri: reputation.metadataURI,
    completed_orders: reputation.completedOrders,
    disputed_orders: reputation.disputedOrders,
    average_verification_score: reputation.averageVerificationScore,
    trust_score: reputation.trustScore
  };
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

export async function getOrders(status?: OrderStatus) {
  if (!useSupabase()) return getLocalOrders(status);
  const supabase = mustSupabase();
  let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map((row) => orderFromRow(row));
}

export async function getOrder(orderId: string) {
  if (!useSupabase()) return getLocalOrder(orderId);
  const supabase = mustSupabase();
  const { data, error } = await supabase.from("orders").select("*").eq("id", orderId).maybeSingle();
  if (error) throw error;
  return data ? orderFromRow(data) : null;
}

export async function createOrder(input: Omit<Order, "id" | "status" | "createdAt"> & Partial<Pick<Order, "id" | "status" | "createdAt">>) {
  if (!useSupabase()) return createLocalOrder(input);
  const supabase = mustSupabase();
  const order: Order = {
    ...input,
    id: input.id || id("ord"),
    status: input.status || "CREATED",
    createdAt: input.createdAt || new Date().toISOString()
  };
  const { data, error } = await supabase.from("orders").insert(orderToRow(order)).select("*").single();
  if (error) throw error;
  return orderFromRow(data);
}

export async function updateOrder(orderId: string, patch: Partial<Order>) {
  if (!useSupabase()) return updateLocalOrder(orderId, patch);
  const supabase = mustSupabase();
  const { data, error } = await supabase.from("orders").update(orderPatchToRow(patch)).eq("id", orderId).select("*").maybeSingle();
  if (error) throw error;
  return data ? orderFromRow(data) : null;
}

export async function createVerificationReport(input: Omit<VerificationReport, "id" | "createdAt">) {
  if (!useSupabase()) return createLocalVerificationReport(input);
  const supabase = mustSupabase();
  await supabase.from("verification_reports").delete().eq("order_id", input.orderId);
  const report: VerificationReport = {
    ...input,
    id: id("ver"),
    createdAt: new Date().toISOString()
  };
  const { data, error } = await supabase.from("verification_reports").insert(reportToRow(report)).select("*").single();
  if (error) throw error;
  return reportFromRow(data);
}

export async function getVerificationReport(reportId?: string) {
  if (!useSupabase()) return getLocalVerificationReport(reportId);
  if (!reportId) return null;
  const supabase = mustSupabase();
  const { data, error } = await supabase.from("verification_reports").select("*").eq("id", reportId).maybeSingle();
  if (error) throw error;
  return data ? reportFromRow(data) : null;
}

export async function getVerificationReportByOrder(orderId: string) {
  if (!useSupabase()) return getLocalVerificationReportByOrder(orderId);
  const supabase = mustSupabase();
  const { data, error } = await supabase
    .from("verification_reports")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data ? reportFromRow(data) : null;
}

export async function registerAgent(walletAddress: string, metadataURI = "ipfs://demo-jastip-agent") {
  if (!useSupabase()) return registerLocalAgent(walletAddress, metadataURI);
  const existing = await getReputation(walletAddress);
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
  const supabase = mustSupabase();
  const { data, error } = await supabase.from("agent_reputations").insert(reputationToRow(reputation)).select("*").single();
  if (error) throw error;
  return reputationFromRow(data);
}

export async function updateReputation(walletAddress: string, completed: boolean, verificationScore: number) {
  if (!useSupabase()) return updateLocalReputation(walletAddress, completed, verificationScore);
  const existing = (await getReputation(walletAddress)) || (await registerAgent(walletAddress));
  const updated = { ...existing };
  if (completed) {
    const previousCompleted = updated.completedOrders;
    updated.completedOrders += 1;
    updated.averageVerificationScore = Math.round(
      (updated.averageVerificationScore * previousCompleted + verificationScore) / updated.completedOrders
    );
  } else {
    updated.disputedOrders += 1;
  }
  updated.trustScore = calculateTrustScore(updated.completedOrders, updated.averageVerificationScore, updated.disputedOrders);

  const supabase = mustSupabase();
  const { data, error } = await supabase
    .from("agent_reputations")
    .update(reputationToRow(updated))
    .eq("wallet_address", walletAddress)
    .select("*")
    .single();
  if (error) throw error;
  return reputationFromRow(data);
}

export async function getReputation(walletAddress: string) {
  if (!useSupabase()) return getLocalReputation(walletAddress);
  const supabase = mustSupabase();
  const { data, error } = await supabase
    .from("agent_reputations")
    .select("*")
    .ilike("wallet_address", walletAddress)
    .maybeSingle();
  if (error) throw error;
  return data ? reputationFromRow(data) : null;
}

export async function getReputations() {
  if (!useSupabase()) return getLocalReputations();
  const supabase = mustSupabase();
  const { data, error } = await supabase.from("agent_reputations").select("*").order("trust_score", { ascending: false });
  if (error) throw error;
  return (data || []).map((row) => reputationFromRow(row));
}

export async function resetDemoData() {
  if (!useSupabase()) return resetLocalDemoData();
  const supabase = mustSupabase();
  await supabase.from("verification_reports").delete().neq("id", "");
  await supabase.from("orders").delete().neq("id", "");
  await supabase.from("agent_reputations").delete().neq("id", "");
}

export async function seedDemoJastiper() {
  if (!useSupabase()) return seedLocalDemoJastiper();
  return registerAgent(DEMO_JASTIPER_WALLET, "ipfs://jastip-agent/demo/jastiper-8004");
}

export async function seedDemoBuyerOrder() {
  if (!useSupabase()) return seedLocalDemoBuyerOrder();
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
