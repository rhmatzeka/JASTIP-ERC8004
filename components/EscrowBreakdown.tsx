import { formatIdr } from "@/lib/escrowMath";
import type { EscrowBreakdown as EscrowBreakdownType } from "@/lib/types";

export default function EscrowBreakdown({ breakdown }: { breakdown: EscrowBreakdownType }) {
  const rows = [
    ["Converted item price", breakdown.estimatedIdrPrice],
    ["Jastiper service fee", breakdown.serviceFee],
    ["5% FX buffer", breakdown.fxBuffer],
    ["3% platform fee", breakdown.platformFee]
  ];

  return (
    <div className="panel p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#888]">Dana aman di escrow</p>
          <h3 className="mt-2 text-2xl font-semibold text-white tracking-tight">{formatIdr(breakdown.escrowAmount)}</h3>
        </div>
        <span className="rounded-full bg-[#22c55e]/10 px-2.5 py-1 text-[10px] font-semibold text-[#4ade80] border border-[#22c55e]/15">3% fee</span>
      </div>
      <div className="space-y-0">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 border-t border-white/[0.04] py-3 text-[13px]">
            <span className="text-[#777]">{label}</span>
            <span className="font-medium text-white">{formatIdr(Number(value))}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
