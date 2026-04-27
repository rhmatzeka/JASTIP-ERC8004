import { NextResponse } from "next/server";
import { ApiError, fail, ok } from "@/lib/api";
import { getOrder, getVerificationReport, updateOrder, updateReputation } from "@/lib/db";
import { releaseEscrowOnChain, updateAgentReputationOnChain } from "@/lib/web3";

export const runtime = "nodejs";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) throw new ApiError(404, "Order not found");
  if (!order.jastiperWallet) throw new ApiError(400, "Order has no jastiper");
  if (order.status !== "VERIFIED") throw new ApiError(409, "Order must be verified before funds can be released");

  const report = await getVerificationReport(order.verificationReportId);
  if (!report) throw new ApiError(409, "Verification report is required before release");
  if (report.overallStatus === "REJECTED") throw new ApiError(409, "Rejected verification report cannot be released");
  const verificationScore = report?.itemMatchConfidence || 80;
  const releaseTx = await releaseEscrowOnChain(order.chainOrderId);
  const reputation = await updateReputation(order.jastiperWallet, true, verificationScore);
  const repTx = await updateAgentReputationOnChain(order.jastiperWallet, true, verificationScore);

  const updated = await updateOrder(order.id, {
    status: "RELEASED",
    txHashes: {
      ...order.txHashes,
      release: releaseTx,
      reputation: repTx
    }
  });

  return ok({ order: updated, reputation });
  } catch (error) {
    return fail(error);
  }
}
