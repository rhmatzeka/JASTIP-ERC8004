import { NextResponse } from "next/server";
import { getReputation, getReputations } from "@/lib/mockDb";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: { wallet: string } }) {
  if (params.wallet === "all") {
    const reputations = await getReputations();
    return NextResponse.json({ reputations });
  }

  const reputation = await getReputation(params.wallet);
  if (!reputation) return NextResponse.json({ error: "Reputation not found" }, { status: 404 });
  return NextResponse.json({ reputation });
}
