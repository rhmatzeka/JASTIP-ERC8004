"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import EscrowBreakdown from "@/components/EscrowBreakdown";
import UploadBox from "@/components/UploadBox";
import WalletConnect from "@/components/WalletConnect";
import { calculateEscrowAmount } from "@/lib/escrowMath";
import { useDemoProfile } from "@/lib/useDemoProfile";
import type { Country } from "@/lib/types";

export default function NewOrderPage() {
  const router = useRouter();
  const { isReady, isLoggedIn, role, profile, setRole } = useDemoProfile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    itemName: "Nike Japan Limited Edition Bag",
    brand: "Nike",
    model: "Japan Limited Edition Bag",
    color: "Black and white",
    size: "One size",
    destinationCountry: "Japan" as Country,
    targetStore: "Nike Harajuku",
    estimatedLocalPrice: 7000,
    maxBudgetIdr: 950000,
    serviceFeePercent: 12,
    buyerWallet: profile.walletAddress,
    referencePhotoUrl: ""
  });

  useEffect(() => {
    setForm((current) => ({ ...current, buyerWallet: profile.walletAddress }));
  }, [profile.walletAddress]);

  useEffect(() => {
    if (isReady && !isLoggedIn) router.push("/login?role=BUYER");
  }, [isReady, isLoggedIn, router]);

  const breakdown = useMemo(
    () =>
      calculateEscrowAmount({
        destinationCountry: form.destinationCountry,
        estimatedLocalPrice: Number(form.estimatedLocalPrice),
        serviceFeePercent: Number(form.serviceFeePercent)
      }),
    [form.destinationCountry, form.estimatedLocalPrice, form.serviceFeePercent]
  );

  async function submit() {
    setLoading(true);
    setError("");
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(data.error || "Failed to create order");
      return;
    }
    router.push(`/orders/${data.order.id}`);
  }

  return (
    <main className="page-shell">
      <div className="mb-6">
        <p className="eyebrow">Titip barang</p>
        <h1 className="page-title">Buat Order</h1>
      </div>
      {role !== "BUYER" ? (
        <section className="panel mb-6 p-5">
          <p className="font-bold text-ink">Halaman ini untuk Customer.</p>
          <p className="mt-2 text-sm text-muted">
            Kamu sedang memakai mode {profile.label}. Pindah ke Customer untuk membuat order jastip.
          </p>
          <button className="btn-primary mt-4" onClick={() => setRole("BUYER")}>
            Switch to Customer
          </button>
        </section>
      ) : null}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <section className="panel p-5">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["itemName", "Item name"],
              ["brand", "Brand"],
              ["model", "Model"],
              ["color", "Color"],
              ["size", "Size"],
              ["targetStore", "Target store"]
            ].map(([key, label]) => (
              <label key={key} className="text-sm font-black text-ink">
                {label}
                <input
                  className="input mt-1"
                  value={String(form[key as keyof typeof form])}
                  onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                />
              </label>
            ))}
            <label className="text-sm font-black text-ink">
              Destination country
              <select
                className="input mt-1"
                value={form.destinationCountry}
                onChange={(event) => setForm({ ...form, destinationCountry: event.target.value as Country })}
              >
                <option>Japan</option>
                <option>Korea</option>
                <option>Singapore</option>
              </select>
            </label>
            <label className="text-sm font-black text-ink">
              Estimated local price
              <input
                className="input mt-1"
                type="number"
                value={form.estimatedLocalPrice}
                onChange={(event) => setForm({ ...form, estimatedLocalPrice: Number(event.target.value) })}
              />
            </label>
            <label className="text-sm font-black text-ink">
              Max budget in IDR
              <input
                className="input mt-1"
                type="number"
                value={form.maxBudgetIdr}
                onChange={(event) => setForm({ ...form, maxBudgetIdr: Number(event.target.value) })}
              />
            </label>
            <label className="text-sm font-black text-ink">
              Service fee percentage
              <input
                className="input mt-1"
                type="number"
                value={form.serviceFeePercent}
                onChange={(event) => setForm({ ...form, serviceFeePercent: Number(event.target.value) })}
              />
            </label>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <UploadBox
              label="Reference photo"
              value={form.referencePhotoUrl}
              onChange={(referencePhotoUrl) => setForm({ ...form, referencePhotoUrl })}
            />
            <WalletConnect value={form.buyerWallet} onChange={(buyerWallet) => setForm({ ...form, buyerWallet })} label="Customer wallet address" />
          </div>
          <button className="btn-primary mt-6" onClick={submit} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={16} /> : <ArrowRight size={16} />}
            Create escrow order
          </button>
          {error ? <p className="mt-3 rounded-lg bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</p> : null}
        </section>
        <EscrowBreakdown breakdown={breakdown} />
      </div>
    </main>
  );
}
