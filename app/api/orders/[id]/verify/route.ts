import { NextRequest, NextResponse } from "next/server";
import { ApiError, fail, ok, parseJson } from "@/lib/api";
import { verifyJastipOrder } from "@/lib/aiVerification";
import { createVerificationReport, getOrder, updateOrder } from "@/lib/db";
import { verifyOrderSchema } from "@/lib/validation";
import { markVerifiedOnChain } from "@/lib/web3";

export const runtime = "nodejs";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
  const { id } = await params;
  const body = await parseJson(request, verifyOrderSchema);
  const order = await getOrder(id);
  if (!order) throw new ApiError(404, "Order not found");
  if (order.status !== "ACCEPTED" && order.status !== "VERIFIED") {
    throw new ApiError(409, "Order must be accepted before verification");
  }

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

  return ok({ order: updated, report });
  } catch (error) {
    return fail(error);
  }
}
