import { NextResponse } from "next/server";
import { ApiError, fail, ok } from "@/lib/api";
import { disputeEscrowOnChain, updateAgentReputationOnChain } from "@/lib/web3";
import { getOrder, updateOrder, updateReputation } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) throw new ApiError(404, "Order not found");
  if (!order.jastiperWallet) throw new ApiError(400, "Order has no jastiper");
  if (order.status !== "ACCEPTED" && order.status !== "VERIFIED") {
    throw new ApiError(409, "Only accepted or verified orders can be disputed");
  }

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

  return ok({ order: updated, reputation });
  } catch (error) {
    return fail(error);
  }
}
