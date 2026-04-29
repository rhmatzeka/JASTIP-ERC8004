import { BadgeCheck, ShieldCheck, ShieldQuestion } from "lucide-react";
import type { AgentReputation } from "@/lib/types";

function tier(score: number) {
  if (score >= 100) return { label: "Excellent", style: "bg-[#22c55e]/10 text-[#4ade80] border-[#22c55e]/15", Icon: BadgeCheck };
  if (score >= 60) return { label: "Good", style: "bg-[#d4ff00]/10 text-[#d4ff00] border-[#d4ff00]/15", Icon: ShieldCheck };
  return { label: "Risky", style: "bg-[#ef4444]/10 text-[#f87171] border-[#ef4444]/15", Icon: ShieldQuestion };
}

export default function ReputationCard({ reputation }: { reputation: AgentReputation }) {
  const current = tier(reputation.trustScore);
  const Icon = current.Icon;

  return (
    <article className="panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 group">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${current.style}`}>
          <Icon size={17} strokeWidth={1.5} />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-[13px] font-semibold text-white">{reputation.agentId}</h3>
          <p className="truncate text-[11px] text-[#666] mt-0.5 font-mono">{reputation.walletAddress}</p>
        </div>
      </div>

      <div className="flex items-center gap-5 md:gap-6 overflow-x-auto pb-1 md:pb-0">
        <div className="flex flex-col items-start md:items-end min-w-[60px]">
          <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#666]">Completed</span>
          <span className="text-[13px] font-semibold text-white">{reputation.completedOrders}</span>
        </div>
        <div className="flex flex-col items-start md:items-end min-w-[60px]">
          <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#666]">Disputed</span>
          <span className="text-[13px] font-semibold text-white">{reputation.disputedOrders}</span>
        </div>
        <div className="flex flex-col items-start md:items-end min-w-[60px]">
          <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#666]">Avg Score</span>
          <span className="text-[13px] font-semibold text-white">{reputation.averageVerificationScore}</span>
        </div>
        <div className="flex flex-col items-start md:items-end min-w-[60px] md:pl-5 md:border-l border-white/[0.05]">
          <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#d4ff00]">Trust Score</span>
          <span className="text-base font-bold text-white">{reputation.trustScore}</span>
        </div>
        <div className="ml-1">
          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${current.style}`}>
            {current.label}
          </span>
        </div>
      </div>
    </article>
  );
}
