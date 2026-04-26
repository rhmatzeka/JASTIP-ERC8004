"use client";

import { Wallet } from "lucide-react";

function randomWallet() {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  return `0x${Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")}`;
}

export default function WalletConnect({
  value,
  onChange,
  label = "Wallet address"
}: {
  value: string;
  onChange: (wallet: string) => void;
  label?: string;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-ink">{label}</label>
      <div className="mt-1 flex gap-2">
        <input className="input" value={value} onChange={(event) => onChange(event.target.value)} placeholder="0x..." />
        <button type="button" className="btn-secondary shrink-0" onClick={() => onChange(randomWallet())}>
          <Wallet size={16} />
          Mock
        </button>
      </div>
      <p className="mt-1 text-xs text-muted">Uses Privy when configured; otherwise demo wallets keep the flow moving.</p>
    </div>
  );
}
