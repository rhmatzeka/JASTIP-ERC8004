"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, UserRound, UsersRound, Wallet } from "lucide-react";
import { DEMO_PROFILES, type AppRole } from "@/lib/demoProfiles";
import { useDemoProfile } from "@/lib/useDemoProfile";
import { connectInjectedWallet } from "@/lib/walletClient";

const roleMeta: Record<AppRole, { title: string; subtitle: string; Icon: typeof UserRound; redirect: string }> = {
  BUYER: {
    title: "Customer / Buyer",
    subtitle: "Buat order, kunci dana escrow, review hasil AI, lalu release atau dispute.",
    Icon: UserRound,
    redirect: "/orders/new"
  },
  JASTIPER: {
    title: "Jastiper",
    subtitle: "Ambil order, upload bukti pembelian, dan bangun reputasi wallet.",
    Icon: UsersRound,
    redirect: "/marketplace"
  },
  ADMIN: {
    title: "Admin Demo",
    subtitle: "Seed data, generate report, dan siapkan alur presentasi hackathon.",
    Icon: ShieldCheck,
    redirect: "/demo"
  }
};

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useDemoProfile();
  const initialRole = (params.get("role") || "BUYER") as AppRole;
  const safeInitialRole = initialRole in DEMO_PROFILES ? initialRole : "BUYER";
  const [selectedRole, setSelectedRole] = useState<AppRole>(safeInitialRole);
  const [name, setName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");

  const selected = useMemo(() => roleMeta[selectedRole], [selectedRole]);

  function chooseRole(role: AppRole) {
    setSelectedRole(role);
    setAdminCode("");
  }

  async function connectWallet() {
    setConnecting(true);
    setError("");
    try {
      const nextAddress = await connectInjectedWallet({ forceAccountSelection: Boolean(walletAddress) });
      setWalletAddress(nextAddress);
      if (walletAddress && nextAddress.toLowerCase() === walletAddress.toLowerCase()) {
        setError("Wallet masih sama. Pilih akun lain dari popup wallet, atau ganti akun aktif di extension wallet.");
      }
    } catch (connectError) {
      setError(connectError instanceof Error ? connectError.message : "Wallet gagal tersambung.");
    } finally {
      setConnecting(false);
    }
  }

  async function submit() {
    if (!name.trim()) {
      setError("Identitas wajib diisi dulu.");
      return;
    }
    if (!walletAddress.trim()) {
      setError("Connect wallet dulu sebelum lanjut.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await login(selectedRole, { name, walletAddress, adminCode });
      router.push(selected.redirect);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center p-5">
      <div className="w-full max-w-[820px] rounded-2xl border border-white/[0.06] bg-[#141419] shadow-elevated overflow-hidden grid lg:grid-cols-[1fr_1.1fr]">
        {/* Left — Role selector */}
        <section className="border-r border-white/[0.04] bg-white/[0.01] p-6 lg:p-7">
          <p className="eyebrow">Authentication</p>
          <h1 className="mt-2 text-xl font-bold text-white">Pilih Akses Anda</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Session dibuat setelah wallet terhubung dan menandatangani pesan login.
          </p>

          <div className="mt-6 grid gap-2.5">
            {(Object.keys(DEMO_PROFILES) as AppRole[]).map((role) => {
              const meta = roleMeta[role];
              const Icon = meta.Icon;
              const active = selectedRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 ${
                    active
                      ? "border-accent/30 bg-accent/[0.06]"
                      : "border-white/[0.06] bg-white/[0.01] hover:border-white/[0.1] hover:bg-white/[0.03]"
                  }`}
                  onClick={() => chooseRole(role)}
                >
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-colors ${
                    active ? "bg-accent/15 text-accent" : "bg-white/[0.04] text-muted"
                  }`}>
                    <Icon size={16} />
                  </span>
                  <div className="min-w-0">
                    <span className="block text-sm font-semibold text-white">{meta.title}</span>
                    <span className="mt-0.5 block text-[11px] leading-relaxed text-muted line-clamp-1">{meta.subtitle}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Right — Form */}
        <section className="p-6 lg:p-7 flex flex-col justify-center">
          <p className="eyebrow">Akses Portal</p>
          <h2 className="mt-1.5 text-xl font-bold text-white">{selected.title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted">{selected.subtitle}</p>

          <div className="mt-6 grid gap-4">
            <label className="block">
              <span className="text-[11px] font-medium uppercase tracking-wider text-accent">Identitas</span>
              <input
                className="input mt-1.5 h-10 text-sm"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (error) setError("");
                }}
                placeholder="Masukkan nama tampilan"
              />
            </label>

            <label className="block">
              <span className="text-[11px] font-medium uppercase tracking-wider text-accent">Wallet address</span>
              <div className="mt-1.5 flex gap-2">
                <input
                  className="input h-10 font-mono text-[11px] truncate"
                  value={walletAddress}
                  readOnly
                  placeholder="Connect wallet untuk mengisi address"
                />
                <button type="button" className="btn-secondary shrink-0 px-3 text-xs" onClick={connectWallet} disabled={connecting}>
                  <Wallet size={14} className="mr-1" />
                  {connecting ? "Connecting" : walletAddress ? "Ganti" : "Connect"}
                </button>
              </div>
            </label>

            {selectedRole === "ADMIN" ? (
              <label className="block">
                <span className="text-[11px] font-medium uppercase tracking-wider text-accent">Admin Invite Code</span>
                <input
                  className="input mt-1.5 h-10 text-sm"
                  type="password"
                  value={adminCode}
                  onChange={(event) => setAdminCode(event.target.value)}
                  placeholder="Required in production"
                />
              </label>
            ) : null}
          </div>

          <button className="btn-primary mt-8 w-full py-3 text-sm" onClick={submit} disabled={loading}>
            {loading ? "Menunggu signature..." : `Lanjutkan sebagai ${selected.title}`}
          </button>
          {error ? (
            <p className="mt-3 rounded-xl bg-danger/10 border border-danger/20 p-3 text-xs font-medium text-rose-200 text-center">{error}</p>
          ) : null}
        </section>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="page-shell">
          <div className="panel p-8 text-center text-muted">Loading login...</div>
        </main>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
