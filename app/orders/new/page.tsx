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

type OrderForm = {
  itemName: string;
  brand: string;
  model: string;
  color: string;
  size: string;
  destinationCountry: Country | "";
  targetStore: string;
  estimatedLocalPrice: string;
  maxBudgetIdr: string;
  serviceFeePercent: string;
  buyerWallet: string;
  referencePhotoUrl: string;
};

export default function NewOrderPage() {
  const router = useRouter();
  const { isReady, isLoggedIn, role, profile, setRole } = useDemoProfile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<OrderForm>({
    itemName: "",
    brand: "",
    model: "",
    color: "",
    size: "",
    destinationCountry: "",
    targetStore: "",
    estimatedLocalPrice: "",
    maxBudgetIdr: "",
    serviceFeePercent: "",
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
        destinationCountry: form.destinationCountry || "Japan",
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
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="eyebrow">Titip barang</p>
          <h1 className="page-title">Buat Order Jastip</h1>
        </div>

        {role !== "BUYER" ? (
          <section className="panel mb-6 p-5 border-danger/20">
            <p className="text-sm font-semibold text-white">Halaman ini untuk Customer.</p>
            <p className="mt-1 text-xs text-muted">
              Kamu sedang memakai mode {profile.label}. Pindah ke Customer untuk membuat order jastip.
            </p>
            <button className="btn-primary mt-4 text-xs py-2 px-4" onClick={() => setRole("BUYER")}>
              Switch to Customer
            </button>
          </section>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-[1fr_350px] items-start">
          <section className="panel p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["itemName", "Item name"],
                ["brand", "Brand"],
                ["model", "Model"],
                ["color", "Color"],
                ["size", "Size"],
                ["targetStore", "Target store"]
              ].map(([key, label]) => (
                <label key={key} className="block">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-accent">{label}</span>
                  <input
                    className="input mt-1.5 h-10 text-sm"
                    value={form[key as keyof OrderForm]}
                    onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                  />
                </label>
              ))}

              <label className="block">
                <span className="text-[11px] font-medium uppercase tracking-wider text-accent">Destination country</span>
                <select
                  className="input mt-1.5 h-10 text-sm appearance-none cursor-pointer"
                  value={form.destinationCountry}
                  onChange={(event) => setForm({ ...form, destinationCountry: event.target.value as Country })}
                >
                  <option value="" disabled className="bg-[#141419]">Select country</option>
                  <option value="Japan" className="bg-[#141419]">Japan</option>
                  <option value="Korea" className="bg-[#141419]">Korea</option>
                  <option value="Singapore" className="bg-[#141419]">Singapore</option>
                </select>
              </label>

              <label className="block">
                <span className="text-[11px] font-medium uppercase tracking-wider text-accent">Estimated local price</span>
                <input
                  className="input mt-1.5 h-10 text-sm"
                  type="number"
                  value={form.estimatedLocalPrice}
                  placeholder="e.g., 7000"
                  onChange={(event) => setForm({ ...form, estimatedLocalPrice: event.target.value })}
                />
              </label>

              <label className="block">
                <span className="text-[11px] font-medium uppercase tracking-wider text-accent">Max budget (IDR)</span>
                <input
                  className="input mt-1.5 h-10 text-sm"
                  type="number"
                  value={form.maxBudgetIdr}
                  placeholder="e.g., 950000"
                  onChange={(event) => setForm({ ...form, maxBudgetIdr: event.target.value })}
                />
              </label>

              <label className="block">
                <span className="text-[11px] font-medium uppercase tracking-wider text-accent">Service fee (%)</span>
                <input
                  className="input mt-1.5 h-10 text-sm"
                  type="number"
                  value={form.serviceFeePercent}
                  placeholder="e.g., 12"
                  onChange={(event) => setForm({ ...form, serviceFeePercent: event.target.value })}
                />
              </label>
            </div>

            <div className="mt-6 border-t border-white/[0.04] pt-6 grid gap-5 sm:grid-cols-2 items-end">
              <UploadBox
                label="Reference photo"
                value={form.referencePhotoUrl}
                onChange={(referencePhotoUrl) => setForm({ ...form, referencePhotoUrl })}
              />
              <WalletConnect value={form.buyerWallet} onChange={(buyerWallet) => setForm({ ...form, buyerWallet })} label="Customer Wallet" />
            </div>

            <div className="mt-8">
              <button className="btn-primary w-full py-3" onClick={submit} disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : <ArrowRight className="mr-2" size={16} />}
                Create Escrow Order
              </button>
              {error ? <p className="mt-3 rounded-xl bg-danger/10 border border-danger/20 p-3 text-xs font-medium text-rose-200 text-center">{error}</p> : null}
            </div>
          </section>

          <EscrowBreakdown breakdown={breakdown} />
        </div>
      </div>
    </main>
  );
}
