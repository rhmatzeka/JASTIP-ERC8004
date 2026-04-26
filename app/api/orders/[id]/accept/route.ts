import { NextRequest, NextResponse } from "next/server";
import { getOrder, registerAgent, updateOrder } from "@/lib/mockDb";
import { acceptEscrowOnChain, registerAgentOnChain } from "@/lib/web3";

export const runtime = "nodejs";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();
  const order = await getOrder(params.id);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (order.status !== "CREATED") return NextResponse.json({ error: "Order is not open" }, { status: 400 });

  const jastiperWallet = body.jastiperWallet;
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

  return NextResponse.json({ order: updated, reputation });
}
