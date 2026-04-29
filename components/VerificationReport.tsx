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
    <section className="panel p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#888]" style={{ fontFamily: 'var(--font-sans)', fontStyle: 'normal' }}>Laporan verifikasi AI</p>
          <h2 className="mt-2 text-xl text-white">Final status</h2>
        </div>
        <StatusBadge status={report.overallStatus} />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {metrics.map(([label, value, Icon]) => (
          <div key={String(label)} className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-4">
            <div className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-white">
              <Icon size={15} className="text-[#888]" strokeWidth={1.5} />
              {label}
            </div>
            <p className="text-[12px] text-[#777]">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-white/[0.05] bg-white/[0.015] p-4">
        <p className="text-[13px] font-semibold text-white">AI notes</p>
        <p className="mt-1.5 text-[12px] leading-[1.7] text-[#777]">{report.itemNotes}</p>
      </div>
      <div className="mt-4">
        <p className="text-[13px] font-semibold text-white">Fraud flags</p>
        {report.fraudFlags.length === 0 ? (
          <p className="mt-1.5 text-[12px] text-[#777]">No flags detected.</p>
        ) : (
          <div className="mt-2 flex flex-wrap gap-2">
            {report.fraudFlags.map((flag) => (
              <span key={flag} className="rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/15 px-3 py-1 text-[11px] font-medium text-[#f5c842]">
                {flag}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
