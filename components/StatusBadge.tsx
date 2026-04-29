import type { OrderStatus, VerificationStatus } from "@/lib/types";

const statusStyle: Record<string, string> = {
  CREATED: "bg-[#d4ff00]/10 text-[#d4ff00] border-[#d4ff00]/15",
  ACCEPTED: "bg-[#f59e0b]/10 text-[#f5c842] border-[#f59e0b]/15",
  VERIFIED: "bg-[#22c55e]/10 text-[#4ade80] border-[#22c55e]/15",
  RELEASED: "bg-[#22c55e]/10 text-[#4ade80] border-[#22c55e]/15",
  DISPUTED: "bg-[#ef4444]/10 text-[#f87171] border-[#ef4444]/15",
  REFUNDED: "bg-white/[0.03] text-[#888] border-white/[0.06]",
  APPROVED: "bg-[#22c55e]/10 text-[#4ade80] border-[#22c55e]/15",
  FLAGGED: "bg-[#f59e0b]/10 text-[#f5c842] border-[#f59e0b]/15",
  REJECTED: "bg-[#ef4444]/10 text-[#f87171] border-[#ef4444]/15"
};

export default function StatusBadge({ status }: { status: OrderStatus | VerificationStatus | string }) {
  return (
    <span
      className={`inline-flex shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase ${statusStyle[status] || statusStyle.CREATED}`}
    >
      {status}
    </span>
  );
}
