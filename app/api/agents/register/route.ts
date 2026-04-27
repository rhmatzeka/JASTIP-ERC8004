import { NextRequest, NextResponse } from "next/server";
import { ApiError, fail, ok, parseJson } from "@/lib/api";
import { registerAgent } from "@/lib/db";
import { registerAgentSchema } from "@/lib/validation";
import { registerAgentOnChain } from "@/lib/web3";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
  const body = await parseJson(request, registerAgentSchema);
  const walletAddress = body.walletAddress || body.wallet;
  if (!walletAddress) throw new ApiError(400, "walletAddress is required");

  const reputation = await registerAgent(walletAddress, body.metadataURI || "ipfs://jastip-agent/jastiper-profile");
  const txHash = await registerAgentOnChain(walletAddress, reputation.metadataURI || "ipfs://jastip-agent/jastiper-profile");
  return ok({ reputation, txHash });
  } catch (error) {
    return fail(error);
  }
}
