import type { OrderStatus, VerificationStatus } from "@/lib/types";

const statusStyle: Record<string, string> = {
  CREATED: "bg-accent/10 text-accentMuted border-accent/20",
  ACCEPTED: "bg-warn/10 text-amber-300 border-warn/20",
  VERIFIED: "bg-success/10 text-emerald-300 border-success/20",
  RELEASED: "bg-success/10 text-emerald-300 border-success/20",
  DISPUTED: "bg-danger/10 text-rose-300 border-danger/20",
  REFUNDED: "bg-white/[0.04] text-muted border-white/[0.08]",
  APPROVED: "bg-success/10 text-emerald-300 border-success/20",
  FLAGGED: "bg-warn/10 text-amber-300 border-warn/20",
  REJECTED: "bg-danger/10 text-rose-300 border-danger/20"
};

export default function StatusBadge({ status }: { status: OrderStatus | VerificationStatus | string }) {
  return (
    <span
      className={`inline-flex shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide ${statusStyle[status] || statusStyle.CREATED}`}
    >
      {status}
    </span>
  );
}
