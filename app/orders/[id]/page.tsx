"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Check, ExternalLink, Loader2, UploadCloud } from "lucide-react";
import EscrowBreakdown from "@/components/EscrowBreakdown";
import StatusBadge from "@/components/StatusBadge";
import VerificationReport from "@/components/VerificationReport";
import WalletConnect from "@/components/WalletConnect";
import { ORDER_STEPS } from "@/lib/constants";
import { formatIdr } from "@/lib/escrowMath";
import { useDemoProfile } from "@/lib/useDemoProfile";
import { sepoliaTxUrl } from "@/lib/web3";
import type { Order, VerificationReport as VerificationReportType } from "@/lib/types";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { isReady, isLoggedIn, role, profile, setRole } = useDemoProfile();
  const [order, setOrder] = useState<Order | null>(null);
  const [report, setReport] = useState<VerificationReportType | null>(null);
  const [wallet, setWallet] = useState(profile.walletAddress);
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const response = await fetch(`/api/orders/${params.id}`);
    const data = await response.json();
    setOrder(data.order);
    setReport(data.report || null);
  }

  useEffect(() => {
    load();
  }, [params.id]);

  useEffect(() => {
    if (isReady && !isLoggedIn) router.push("/login");
  }, [isReady, isLoggedIn, router]);

  useEffect(() => {
    setWallet(profile.walletAddress);
  }, [profile.walletAddress]);

  const activeStep = useMemo(() => {
    if (!order) return 0;
    return Math.max(0, ORDER_STEPS.findIndex((step) => step === order.status));
  }, [order]);

  async function accept() {
    setLoading("accept");
    setError("");
    const response = await fetch(`/api/orders/${params.id}/accept`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jastiperWallet: wallet })
    });
    const data = await response.json();
    setLoading("");
    if (!response.ok) {
      setError(data.error || "Failed to accept order");
      return;
    }
    await load();
  }

  async function release() {
    setLoading("release");
    setError("");
    const response = await fetch(`/api/orders/${params.id}/release`, { method: "POST" });
    const data = await response.json();
    setLoading("");
    if (!response.ok) {
      setError(data.error || "Failed to release funds");
      return;
    }
    await load();
  }

  async function dispute() {
    setLoading("dispute");
    setError("");
    const response = await fetch(`/api/orders/${params.id}/dispute`, { method: "POST" });
    const data = await response.json();
    setLoading("");
    if (!response.ok) {
      setError(data.error || "Failed to open dispute");
      return;
    }
    await load();
  }

  if (!order) {
    return (
      <main className="page-shell">
        <div className="panel p-8 text-center text-muted">Loading order...</div>
      </main>
    );
  }

  const isBuyer = order.buyerWallet.toLowerCase() === profile.walletAddress.toLowerCase();
  const isAssignedJastiper = order.jastiperWallet?.toLowerCase() === profile.walletAddress.toLowerCase();
  const canAccept = role === "JASTIPER" && order.status === "CREATED";
  const canUploadProof = role === "JASTIPER" && isAssignedJastiper && (order.status === "ACCEPTED" || order.status === "VERIFIED");
  const canDecideFunds = role === "BUYER" && isBuyer && order.status === "VERIFIED";

  return (
    <main className="page-shell">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <StatusBadge status={order.status} />
            <span className="text-sm text-muted">Order ID {order.id}</span>
          </div>
          <h1 className="page-title">{order.itemName}</h1>
          <p className="mt-2 text-muted">
            {order.brand} · {order.model} · {order.color} · {order.size}
          </p>
        </div>
        {canUploadProof ? (
          <Link href={`/orders/${order.id}/verify`} className="btn-secondary">
            <UploadCloud size={16} />
            Upload Bukti Pembelian
          </Link>
        ) : null}
      </div>

      <section className="panel mb-6 p-5">
        <div className="grid gap-3 md:grid-cols-4">
          {ORDER_STEPS.map((step, index) => (
            <div key={step} className="flex items-center gap-3 rounded-lg bg-cloud p-3">
              <span
                className={`grid h-8 w-8 place-items-center rounded-full text-sm font-black ${
                  index <= activeStep ? "bg-ocean text-white" : "bg-white text-muted"
                }`}
              >
                {index < activeStep || order.status === "RELEASED" ? <Check size={16} /> : index + 1}
              </span>
              <span className="text-sm font-bold text-ink">{step}</span>
            </div>
          ))}
        </div>
      </section>
      {error ? <p className="mb-6 rounded-lg bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</p> : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="panel p-5">
            <h2 className="mb-4 text-xl font-black text-ink">Order details</h2>
            <div className="grid gap-3 text-sm md:grid-cols-2">
              {[
                ["Country", order.destinationCountry],
                ["Target store", order.targetStore],
                ["Max budget", formatIdr(order.maxBudgetIdr)],
                ["Customer address", order.buyerWallet],
                ["Jastiper address", order.jastiperWallet || "Not accepted yet"],
                ["Chain order ID", order.chainOrderId || "Mock pending"]
              ].map(([label, value]) => (
                <div key={label} className="metric-tile">
                  <p className="font-black text-ink">{label}</p>
                  <p className="mt-1 break-all text-muted">{value}</p>
                </div>
              ))}
            </div>
            {order.txHashes ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {Object.entries(order.txHashes).map(([label, hash]) => {
                  const url = sepoliaTxUrl(hash);
                  return url ? (
                    <a key={label} href={url} target="_blank" className="btn-secondary" rel="noreferrer">
                      {label} tx
                      <ExternalLink size={14} />
                    </a>
                  ) : (
                    <span key={label} className="rounded-full bg-cloud px-3 py-1 text-xs font-bold text-muted">
                      {label}: {hash}
                    </span>
                  );
                })}
              </div>
            ) : null}
          </section>

          {order.status === "CREATED" ? (
            <section className="panel p-5">
              {canAccept ? (
                <>
                  <h2 className="mb-4 text-xl font-black text-ink">Terima Order</h2>
                  <WalletConnect value={wallet} onChange={setWallet} label="Jastiper wallet address" />
                  <button className="btn-primary mt-4" onClick={accept} disabled={loading === "accept"}>
                    {loading === "accept" ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                    Accept Order
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-black text-ink">Order masih terbuka</h2>
                  <p className="mt-2 text-sm text-muted">
                    Kamu sedang mode {profile.label}. Pindah ke Jastiper untuk menerima order ini.
                  </p>
                  <button className="btn-primary mt-4" onClick={() => setRole("JASTIPER")}>
                    Switch to Jastiper
                  </button>
                </>
              )}
            </section>
          ) : null}

          {report ? (
            <>
              <VerificationReport report={report} />
              {canDecideFunds ? (
                <div className="panel flex flex-col gap-3 p-5 sm:flex-row">
                  <button className="btn-primary" onClick={release} disabled={loading === "release"}>
                    {loading === "release" ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                    Lepas Dana
                  </button>
                  <button className="btn-danger" onClick={dispute} disabled={loading === "dispute"}>
                    Buka Sengketa
                  </button>
                </div>
              ) : report && order.status === "VERIFIED" ? (
                <div className="panel p-5">
                  <p className="font-bold text-ink">Menunggu keputusan Customer</p>
                  <p className="mt-2 text-sm text-muted">
                    Hanya wallet customer order ini yang bisa melepas dana atau membuka sengketa.
                  </p>
                  {!isBuyer ? (
                    <button className="btn-secondary mt-4" onClick={() => setRole("BUYER")}>
                      Switch to Customer
                    </button>
                  ) : null}
                </div>
              ) : null}
            </>
          ) : null}
        </div>

        <div className="space-y-6">
          <EscrowBreakdown breakdown={order.escrowBreakdown} />
          <section className="panel p-5">
            <h2 className="text-xl font-black text-ink">Platform fee split</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Jastiper payout 97%</span>
                <span className="font-bold text-ink">{formatIdr(order.escrowAmountIdr * 0.97)}</span>
              </div>
              <div className="flex justify-between border-t border-line pt-3">
                <span className="text-muted">Treasury fee 3%</span>
                <span className="font-bold text-ink">{formatIdr(order.escrowAmountIdr * 0.03)}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
