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
    <div className="panel p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Dana aman di escrow</p>
          <h3 className="mt-2 text-2xl font-black text-ink">{formatIdr(breakdown.escrowAmount)}</h3>
        </div>
        <span className="rounded-full border border-emerald-200 bg-mint/10 px-3 py-1 text-xs font-black text-emerald-700">3% fee</span>
      </div>
      <div className="space-y-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 border-t border-line pt-3">
            <span className="text-muted">{label}</span>
            <span className="font-black text-ink">{formatIdr(Number(value))}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
