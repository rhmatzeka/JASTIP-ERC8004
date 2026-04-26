import { NextResponse } from "next/server";
import { getOrder, getVerificationReport } from "@/lib/mockDb";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const order = await getOrder(params.id);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  const report = await getVerificationReport(order.verificationReportId);
  return NextResponse.json({ order, report });
}
