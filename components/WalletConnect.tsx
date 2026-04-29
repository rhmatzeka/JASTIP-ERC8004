"use client";

import { useState } from "react";
import { Wallet } from "lucide-react";
import { connectInjectedWallet } from "@/lib/walletClient";

export default function WalletConnect({
  value,
  onChange,
  label = "Wallet address"
}: {
  value: string;
  onChange: (wallet: string) => void;
  label?: string;
}) {
  const [error, setError] = useState("");

  async function connect() {
    setError("");
    try {
      onChange(await connectInjectedWallet());
    } catch (connectError) {
      setError(connectError instanceof Error ? connectError.message : "Wallet gagal tersambung.");
    }
  }

  return (
    <div className="w-full">
      <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#888] block mb-1.5" style={{ fontFamily: 'var(--font-sans)', fontStyle: 'normal' }}>{label}</label>
      <div className="flex gap-2">
        <input className="input h-10 font-mono text-[11px] truncate" value={value} readOnly placeholder="Connect wallet" />
        {value ? (
          <span className="btn-secondary pointer-events-none shrink-0 bg-[#22c55e]/10 text-[#4ade80] border-[#22c55e]/15 px-3 text-[11px] h-10">
            <Wallet size={13} className="mr-1" strokeWidth={1.5} />
            Connected
          </span>
        ) : (
          <button type="button" className="btn-secondary shrink-0 px-3 text-[11px] h-10" onClick={connect}>
            <Wallet size={13} className="mr-1" strokeWidth={1.5} />
            Connect
          </button>
        )}
      </div>
      <p className="mt-2 text-[10px] leading-relaxed text-[#666]">Address mengikuti wallet yang login. Logout untuk ganti wallet.</p>
      {error ? <p className="mt-2 text-[11px] font-medium text-[#f87171]">{error}</p> : null}
    </div>
  );
}
