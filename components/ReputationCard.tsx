import { BadgeCheck, ShieldCheck, ShieldQuestion } from "lucide-react";
import type { AgentReputation } from "@/lib/types";

function tier(score: number) {
  if (score >= 100) return { label: "Excellent", style: "bg-success/10 text-emerald-300", Icon: BadgeCheck };
  if (score >= 60) return { label: "Good", style: "bg-accent/10 text-accentMuted", Icon: ShieldCheck };
  return { label: "Risky", style: "bg-danger/10 text-rose-300", Icon: ShieldQuestion };
}

export default function ReputationCard({ reputation }: { reputation: AgentReputation }) {
  const current = tier(reputation.trustScore);
  const Icon = current.Icon;

  return (
    <article className="panel p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${current.style}`}>
          <Icon size={18} />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-white">{reputation.agentId}</h3>
          <p className="truncate text-[11px] text-muted mt-0.5">{reputation.walletAddress}</p>
        </div>
      </div>

      <div className="flex items-center gap-5 md:gap-6 overflow-x-auto pb-1 md:pb-0">
        <div className="flex flex-col items-start md:items-end min-w-[60px]">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted">Completed</span>
          <span className="text-sm font-semibold text-white">{reputation.completedOrders}</span>
        </div>
        <div className="flex flex-col items-start md:items-end min-w-[60px]">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted">Disputed</span>
          <span className="text-sm font-semibold text-white">{reputation.disputedOrders}</span>
        </div>
        <div className="flex flex-col items-start md:items-end min-w-[60px]">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted">Avg Score</span>
          <span className="text-sm font-semibold text-white">{reputation.averageVerificationScore}</span>
        </div>
        <div className="flex flex-col items-start md:items-end min-w-[60px] md:pl-5 md:border-l border-white/[0.06]">
          <span className="text-[10px] font-medium uppercase tracking-wider text-accent">Trust Score</span>
          <span className="text-base font-bold text-white">{reputation.trustScore}</span>
        </div>
        <div className="ml-1">
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${current.style}`}>
            {current.label}
          </span>
        </div>
      </div>
    </article>
  );
}
