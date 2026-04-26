import { NextRequest, NextResponse } from "next/server";
import { verifyJastipOrder } from "@/lib/aiVerification";
import { createVerificationReport, getOrder, updateOrder } from "@/lib/mockDb";
import { markVerifiedOnChain } from "@/lib/web3";

export const runtime = "nodejs";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();
  const order = await getOrder(params.id);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const rawJson = await verifyJastipOrder({
    order,
    receiptPhotoUrl: body.receiptPhotoUrl,
    itemPhotoUrl: body.itemPhotoUrl,
    additionalItemPhotoUrl: body.additionalItemPhotoUrl
  });

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

  const verifyTx = await markVerifiedOnChain(order.chainOrderId, report.itemMatchConfidence);
  const autoReleaseAt = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString();
  const updated = await updateOrder(order.id, {
    receiptPhotoUrl: body.receiptPhotoUrl,
    itemPhotoUrl: body.itemPhotoUrl,
    additionalItemPhotoUrl: body.additionalItemPhotoUrl,
    status: "VERIFIED",
    verificationReportId: report.id,
    verifiedAt: new Date().toISOString(),
    autoReleaseAt,
    txHashes: {
      ...order.txHashes,
      verified: verifyTx
    }
  });

  return NextResponse.json({ order: updated, report });
}
