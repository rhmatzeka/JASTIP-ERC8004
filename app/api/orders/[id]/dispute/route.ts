import { NextResponse } from "next/server";
import { disputeEscrowOnChain, updateAgentReputationOnChain } from "@/lib/web3";
import { getOrder, updateOrder, updateReputation } from "@/lib/mockDb";

export const runtime = "nodejs";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const order = await getOrder(params.id);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (!order.jastiperWallet) return NextResponse.json({ error: "Order has no jastiper" }, { status: 400 });

  const disputeTx = await disputeEscrowOnChain(order.chainOrderId);
  const reputation = await updateReputation(order.jastiperWallet, false, 0);
  const repTx = await updateAgentReputationOnChain(order.jastiperWallet, false, 0);

  const updated = await updateOrder(order.id, {
    status: "DISPUTED",
    txHashes: {
      ...order.txHashes,
      dispute: disputeTx,
      reputation: repTx
    }
  });

  return NextResponse.json({ order: updated, reputation });
}
