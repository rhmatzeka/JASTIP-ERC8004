import { BadgeCheck, ShieldCheck, ShieldQuestion } from "lucide-react";
import type { AgentReputation } from "@/lib/types";

function tier(score: number) {
  if (score >= 100) return { label: "Excellent", style: "bg-emerald-50 text-emerald-700", Icon: BadgeCheck };
  if (score >= 60) return { label: "Good", style: "bg-blue-50 text-blue-700", Icon: ShieldCheck };
  return { label: "Risky", style: "bg-rose-50 text-rose-700", Icon: ShieldQuestion };
}

export default function ReputationCard({ reputation }: { reputation: AgentReputation }) {
  const current = tier(reputation.trustScore);
  const Icon = current.Icon;

  return (
    <article className="panel p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-muted">{reputation.walletAddress}</p>
          <h3 className="mt-1 text-lg font-bold text-ink">{reputation.agentId}</h3>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${current.style}`}>
          <Icon size={14} />
          {current.label}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
        <div className="rounded-lg bg-cloud p-3">
          <p className="text-muted">Completed</p>
          <p className="mt-1 text-xl font-bold text-ink">{reputation.completedOrders}</p>
        </div>
        <div className="rounded-lg bg-cloud p-3">
          <p className="text-muted">Disputed</p>
          <p className="mt-1 text-xl font-bold text-ink">{reputation.disputedOrders}</p>
        </div>
        <div className="rounded-lg bg-cloud p-3">
          <p className="text-muted">Avg score</p>
          <p className="mt-1 text-xl font-bold text-ink">{reputation.averageVerificationScore}</p>
        </div>
        <div className="rounded-lg bg-cloud p-3">
          <p className="text-muted">Trust score</p>
          <p className="mt-1 text-xl font-bold text-ink">{reputation.trustScore}</p>
        </div>
      </div>
    </article>
  );
}
