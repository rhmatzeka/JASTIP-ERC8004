import { NextRequest, NextResponse } from "next/server";
import { registerAgent } from "@/lib/mockDb";
import { registerAgentOnChain } from "@/lib/web3";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const walletAddress = body.walletAddress || body.wallet;
  if (!walletAddress) return NextResponse.json({ error: "walletAddress is required" }, { status: 400 });

  const reputation = await registerAgent(walletAddress, body.metadataURI || "ipfs://jastip-agent/jastiper-profile");
  const txHash = await registerAgentOnChain(walletAddress, reputation.metadataURI || "ipfs://jastip-agent/jastiper-profile");
  return NextResponse.json({ reputation, txHash });
}
