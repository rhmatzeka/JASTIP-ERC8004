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
      <label className="text-[11px] font-medium uppercase tracking-wider text-accent block mb-1.5">{label}</label>
      <div className="flex gap-2">
        <input className="input bg-white/[0.02] h-10 font-mono text-[11px] truncate" value={value} readOnly placeholder="Connect wallet" />
        {value ? (
          <span className="btn-secondary pointer-events-none shrink-0 bg-success/10 text-success border-success/20 px-3 text-xs h-10">
            <Wallet size={14} className="mr-1" />
            Connected
          </span>
        ) : (
          <button type="button" className="btn-secondary shrink-0 px-3 text-xs h-10" onClick={connect}>
            <Wallet size={14} className="mr-1" />
            Connect
          </button>
        )}
      </div>
      <p className="mt-2 text-[10px] leading-relaxed text-muted">Address mengikuti wallet yang login. Logout untuk ganti wallet.</p>
      {error ? <p className="mt-2 text-[11px] font-medium text-rose-300">{error}</p> : null}
    </div>
  );
}
