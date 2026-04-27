import { NextRequest, NextResponse } from "next/server";
import { ApiError, fail, ok, parseJson } from "@/lib/api";
import { getOrder, registerAgent, updateOrder } from "@/lib/db";
import { acceptOrderSchema } from "@/lib/validation";
import { acceptEscrowOnChain, registerAgentOnChain } from "@/lib/web3";

export const runtime = "nodejs";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
  const { id } = await params;
  const body = await parseJson(request, acceptOrderSchema);
  const order = await getOrder(id);
  if (!order) throw new ApiError(404, "Order not found");
  if (order.status !== "CREATED") throw new ApiError(409, "Order is not open");

  const jastiperWallet = body.jastiperWallet;
  if (jastiperWallet.toLowerCase() === order.buyerWallet.toLowerCase()) {
    throw new ApiError(400, "Buyer wallet cannot accept its own order");
  }
  const reputation = await registerAgent(jastiperWallet, "ipfs://jastip-agent/jastiper-profile");
  const acceptTx = await acceptEscrowOnChain(order.chainOrderId);
  const registryTx = await registerAgentOnChain(jastiperWallet, reputation.metadataURI || "ipfs://jastip-agent/jastiper-profile");

  const updated = await updateOrder(order.id, {
    jastiperWallet,
    status: "ACCEPTED",
    acceptedAt: new Date().toISOString(),
    txHashes: {
      ...order.txHashes,
      accept: acceptTx,
      agentRegister: registryTx
    }
  });

  return ok({ order: updated, reputation });
  } catch (error) {
    return fail(error);
  }
}
