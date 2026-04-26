import { NextResponse } from "next/server";
import { getOrder, getVerificationReport, updateOrder, updateReputation } from "@/lib/mockDb";
import { releaseEscrowOnChain, updateAgentReputationOnChain } from "@/lib/web3";

export const runtime = "nodejs";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const order = await getOrder(params.id);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (!order.jastiperWallet) return NextResponse.json({ error: "Order has no jastiper" }, { status: 400 });

  const report = await getVerificationReport(order.verificationReportId);
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

  return NextResponse.json({ order: updated, reputation });
}
