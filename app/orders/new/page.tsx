"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import EscrowBreakdown from "@/components/EscrowBreakdown";
import UploadBox from "@/components/UploadBox";
import WalletConnect from "@/components/WalletConnect";
import { DEMO_BUYER_WALLET } from "@/lib/constants";
import { calculateEscrowAmount } from "@/lib/escrowMath";
import type { Country } from "@/lib/types";

export default function NewOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
    buyerWallet: DEMO_BUYER_WALLET,
    referencePhotoUrl: ""
  });

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
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await response.json();
    setLoading(false);
    router.push(`/orders/${data.order.id}`);
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <p className="text-sm font-bold text-ocean">Titip Barang</p>
        <h1 className="mt-1 text-3xl font-black text-ink">Buat Order</h1>
      </div>
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
              <label key={key} className="text-sm font-bold text-ink">
                {label}
                <input
                  className="input mt-1"
                  value={String(form[key as keyof typeof form])}
                  onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                />
              </label>
            ))}
            <label className="text-sm font-bold text-ink">
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
            <label className="text-sm font-bold text-ink">
              Estimated local price
              <input
                className="input mt-1"
                type="number"
                value={form.estimatedLocalPrice}
                onChange={(event) => setForm({ ...form, estimatedLocalPrice: Number(event.target.value) })}
              />
            </label>
            <label className="text-sm font-bold text-ink">
              Max budget in IDR
              <input
                className="input mt-1"
                type="number"
                value={form.maxBudgetIdr}
                onChange={(event) => setForm({ ...form, maxBudgetIdr: Number(event.target.value) })}
              />
            </label>
            <label className="text-sm font-bold text-ink">
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
            <WalletConnect value={form.buyerWallet} onChange={(buyerWallet) => setForm({ ...form, buyerWallet })} label="Buyer wallet address" />
          </div>
          <button className="btn-primary mt-6" onClick={submit} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={16} /> : <ArrowRight size={16} />}
            Create escrow order
          </button>
        </section>
        <EscrowBreakdown breakdown={breakdown} />
      </div>
    </main>
  );
}
