import { NextResponse } from "next/server";
import { ok } from "@/lib/api";
import { getOrder, getVerificationReport } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  const report = await getVerificationReport(order.verificationReportId);
  return ok({ order, report });
}
