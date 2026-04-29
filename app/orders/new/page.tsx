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
        <div className="mb-10">
          <p className="eyebrow">Titip barang</p>
          <h1 className="page-title">Buat Order Jastip</h1>
        </div>

        {role !== "BUYER" ? (
          <section className="panel mb-6 p-6 border-[#ef4444]/10">
            <p className="text-[13px] font-semibold text-white">Halaman ini untuk Customer.</p>
            <p className="mt-1.5 text-[12px] text-[#777]">
              Kamu sedang memakai mode {profile.label}. Pindah ke Customer untuk membuat order jastip.
            </p>
            <button className="btn-primary mt-4 text-[12px] py-2 px-5" onClick={() => setRole("BUYER")}>
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
                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#888]" style={{ fontFamily: 'var(--font-sans)', fontStyle: 'normal' }}>{label}</span>
                  <input
                    className="input mt-1.5 h-10 text-[13px]"
                    value={form[key as keyof OrderForm]}
                    onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                  />
                </label>
              ))}

              <label className="block">
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#888]" style={{ fontFamily: 'var(--font-sans)', fontStyle: 'normal' }}>Destination country</span>
                <select
                  className="input mt-1.5 h-10 text-[13px] appearance-none cursor-pointer"
                  value={form.destinationCountry}
                  onChange={(event) => setForm({ ...form, destinationCountry: event.target.value as Country })}
                >
                  <option value="" disabled className="bg-[#080808]">Select country</option>
                  <option value="Japan" className="bg-[#080808]">Japan</option>
                  <option value="Korea" className="bg-[#080808]">Korea</option>
                  <option value="Singapore" className="bg-[#080808]">Singapore</option>
                </select>
              </label>

              <label className="block">
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#888]" style={{ fontFamily: 'var(--font-sans)', fontStyle: 'normal' }}>Estimated local price</span>
                <input
                  className="input mt-1.5 h-10 text-[13px]"
                  type="number"
                  value={form.estimatedLocalPrice}
                  placeholder="e.g., 7000"
                  onChange={(event) => setForm({ ...form, estimatedLocalPrice: event.target.value })}
                />
              </label>

              <label className="block">
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#888]" style={{ fontFamily: 'var(--font-sans)', fontStyle: 'normal' }}>Max budget (IDR)</span>
                <input
                  className="input mt-1.5 h-10 text-[13px]"
                  type="number"
                  value={form.maxBudgetIdr}
                  placeholder="e.g., 950000"
                  onChange={(event) => setForm({ ...form, maxBudgetIdr: event.target.value })}
                />
              </label>

              <label className="block">
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#888]" style={{ fontFamily: 'var(--font-sans)', fontStyle: 'normal' }}>Service fee (%)</span>
                <input
                  className="input mt-1.5 h-10 text-[13px]"
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
                {loading ? <Loader2 className="animate-spin mr-2" size={15} /> : <ArrowRight className="mr-2" size={15} />}
                Create Escrow Order
              </button>
              {error ? <p className="mt-3 rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/15 p-3 text-[12px] font-medium text-[#f87171] text-center">{error}</p> : null}
            </div>
          </section>

          <EscrowBreakdown breakdown={breakdown} />
        </div>
      </div>
    </main>
  );
}
