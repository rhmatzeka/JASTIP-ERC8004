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
          <p className="eyebrow">Dana aman di escrow</p>
          <h3 className="mt-1.5 text-2xl font-bold text-white">{formatIdr(breakdown.escrowAmount)}</h3>
        </div>
        <span className="rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-success">3% fee</span>
      </div>
      <div className="space-y-0">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 border-t border-white/[0.04] py-3 text-sm">
            <span className="text-muted">{label}</span>
            <span className="font-medium text-white">{formatIdr(Number(value))}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
