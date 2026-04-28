import { CheckCircle2, CircleAlert, ReceiptText, ShieldAlert, type LucideIcon } from "lucide-react";
import { formatIdr } from "@/lib/escrowMath";
import type { VerificationReport as VerificationReportType } from "@/lib/types";
import StatusBadge from "./StatusBadge";

export default function VerificationReport({ report }: { report: VerificationReportType }) {
  const metrics: Array<[string, string, LucideIcon]> = [
    ["Store", report.storeVerified ? `Verified: ${report.storeName}` : "Not verified", ReceiptText],
    ["Item match", `${report.itemMatchConfidence}% confidence`, CheckCircle2],
    ["Price", `${formatIdr(report.priceAmountIdr)} - ${report.priceWithinBudget ? "within budget" : "over budget"}`, CircleAlert],
    ["Fraud risk", `${report.fraudRiskScore}/100`, ShieldAlert]
  ];

  return (
    <section className="panel p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Laporan verifikasi AI</p>
          <h2 className="mt-2 text-xl font-bold text-white">Final status</h2>
        </div>
        <StatusBadge status={report.overallStatus} />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {metrics.map(([label, value, Icon]) => (
          <div key={String(label)} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
              <Icon size={16} className="text-accent/70" />
              {label}
            </div>
            <p className="text-sm text-muted">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <p className="text-sm font-semibold text-white">AI notes</p>
        <p className="mt-1.5 text-sm leading-6 text-muted">{report.itemNotes}</p>
      </div>
      <div className="mt-4">
        <p className="text-sm font-semibold text-white">Fraud flags</p>
        {report.fraudFlags.length === 0 ? (
          <p className="mt-1.5 text-sm text-muted">No flags detected.</p>
        ) : (
          <div className="mt-2 flex flex-wrap gap-2">
            {report.fraudFlags.map((flag) => (
              <span key={flag} className="rounded-full bg-warn/10 px-3 py-1 text-xs font-medium text-amber-200">
                {flag}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
