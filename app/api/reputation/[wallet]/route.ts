import { NextResponse } from "next/server";
import { getReputation, getReputations } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: Promise<{ wallet: string }> }) {
  const { wallet } = await params;
  if (wallet === "all") {
    const reputations = await getReputations();
    return NextResponse.json({ reputations });
  }

  const reputation = await getReputation(wallet);
  if (!reputation) return NextResponse.json({ error: "Reputation not found" }, { status: 404 });
  return NextResponse.json({ reputation });
}
