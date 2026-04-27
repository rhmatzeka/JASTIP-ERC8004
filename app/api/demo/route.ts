import { NextRequest, NextResponse } from "next/server";
import {
  createVerificationReport,
  getOrders,
  makeReportJson,
  resetDemoData,
  seedDemoBuyerOrder,
  seedDemoJastiper,
  updateOrder
} from "@/lib/db";
import type { VerificationStatus } from "@/lib/types";

export const runtime = "nodejs";

async function generateReport(status: VerificationStatus) {
  const order = (await getOrders())[0] || (await seedDemoBuyerOrder());
  const rawJson = makeReportJson(status, order);
  const report = await createVerificationReport({
    orderId: order.id,
    storeVerified: rawJson.store.verified,
    storeName: rawJson.store.name,
    itemMatchConfidence: rawJson.item.match_confidence,
    itemNotes: rawJson.item.notes,
    priceAmountIdr: rawJson.price.amount_idr,
    priceWithinBudget: rawJson.price.within_budget,
    dateValid: rawJson.date.valid,
    fraudRiskScore: rawJson.fraud_risk.score,
    fraudFlags: rawJson.fraud_risk.flags,
    overallStatus: rawJson.overall_status,
    rawJson
  });
  const updated = await updateOrder(order.id, {
    status: "VERIFIED",
    verificationReportId: report.id,
    verifiedAt: new Date().toISOString(),
    autoReleaseAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString()
  });
  return { order: updated, report };
}

export async function POST(request: NextRequest) {
  const { action } = await request.json();

  if (action === "reset") {
    await resetDemoData();
    return NextResponse.json({ message: "Local demo data reset." });
  }

  if (action === "seed-order") {
    const order = await seedDemoBuyerOrder();
    return NextResponse.json({ message: "Demo buyer order is ready.", order });
  }

  if (action === "seed-jastiper") {
    const reputation = await seedDemoJastiper();
    return NextResponse.json({ message: "Demo jastiper registered.", reputation });
  }

  if (action === "approved-report") {
    const result = await generateReport("APPROVED");
    return NextResponse.json({ message: "Mock approved AI report generated.", ...result });
  }

  if (action === "flagged-report") {
    const result = await generateReport("FLAGGED");
    return NextResponse.json({ message: "Mock flagged AI report generated.", ...result });
  }

  if (action === "rejected-report") {
    const result = await generateReport("REJECTED");
    return NextResponse.json({ message: "Mock rejected AI report generated.", ...result });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
