import type { OrderStatus, VerificationStatus } from "@/lib/types";

const statusStyle: Record<string, string> = {
  CREATED: "bg-blue-50 text-blue-700 border-blue-200",
  ACCEPTED: "bg-amber-50 text-amber-700 border-amber-200",
  VERIFIED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  RELEASED: "bg-mint/10 text-emerald-700 border-emerald-200",
  DISPUTED: "bg-rose-50 text-rose-700 border-rose-200",
  REFUNDED: "bg-slate-100 text-slate-700 border-slate-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  FLAGGED: "bg-amber-50 text-amber-700 border-amber-200",
  REJECTED: "bg-rose-50 text-rose-700 border-rose-200"
};

export default function StatusBadge({ status }: { status: OrderStatus | VerificationStatus | string }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${statusStyle[status] || statusStyle.CREATED}`}>
      {status}
    </span>
  );
}
