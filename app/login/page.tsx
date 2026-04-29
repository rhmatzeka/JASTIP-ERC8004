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
    subtitle: "Daftar sebagai agent, setujui onboarding, lalu ambil order dan bangun reputasi wallet.",
    Icon: UsersRound,
    redirect: "/marketplace"
  },
  ADMIN: {
    title: "Admin Invite",
    subtitle: "Akses internal untuk seed data dan kontrol demo. Wajib invite code atau wallet allowlist.",
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
  const [jastiperAccepted, setJastiperAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");

  const selected = useMemo(() => roleMeta[selectedRole], [selectedRole]);

  function chooseRole(role: AppRole) {
    setSelectedRole(role);
    setAdminCode("");
    setJastiperAccepted(false);
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
    if (selectedRole === "JASTIPER" && !jastiperAccepted) {
      setError("Setujui onboarding Jastiper dulu sebelum menerima order.");
      return;
    }
    if (selectedRole === "ADMIN" && !adminCode.trim()) {
      setError("Admin wajib memakai invite code atau wallet yang sudah di-allowlist.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await login(selectedRole, {
        name,
        walletAddress,
        adminCode,
        jastiperOnboardingAccepted: selectedRole === "JASTIPER" ? jastiperAccepted : undefined
      });
      router.push(selected.redirect);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-72px)] items-center justify-center p-6">
      <div className="w-full max-w-[840px] rounded-2xl border border-white/[0.05] bg-[#080808] overflow-hidden grid lg:grid-cols-[1fr_1.1fr]" style={{ boxShadow: '0 4px 60px rgba(0,0,0,0.6)' }}>
        {/* Left — Role selector */}
        <section className="border-r border-white/[0.04] bg-white/[0.01] p-7">
          <p className="eyebrow">Authentication</p>
          <h1 className="mt-3 text-xl text-white">Pilih Akses Anda</h1>
          <p className="mt-2 text-[13px] leading-[1.7] text-[#777]" style={{ fontFamily: 'var(--font-sans)', fontStyle: 'normal' }}>
            Session dibuat setelah wallet terhubung dan menandatangani pesan login.
          </p>

          <div className="mt-7 grid gap-2.5">
            {(Object.keys(DEMO_PROFILES) as AppRole[]).map((role) => {
              const meta = roleMeta[role];
              const Icon = meta.Icon;
              const active = selectedRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition-all duration-300 ${
                    active
                      ? "border-[#d4ff00]/20 bg-[#d4ff00]/[0.04]"
                      : "border-white/[0.05] bg-white/[0.01] hover:border-white/[0.08] hover:bg-white/[0.02]"
                  }`}
                  onClick={() => chooseRole(role)}
                >
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-colors ${
                    active ? "bg-[#d4ff00]/10 text-[#d4ff00]" : "bg-white/[0.03] text-[#888]"
                  }`}>
                    <Icon size={15} strokeWidth={1.5} />
                  </span>
                  <div className="min-w-0">
                    <span className="block text-[13px] font-semibold text-white">{meta.title}</span>
                    <span className="mt-0.5 block text-[11px] leading-relaxed text-[#777] line-clamp-1" style={{ fontFamily: 'var(--font-sans)', fontStyle: 'normal' }}>{meta.subtitle}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Right — Form */}
        <section className="p-7 flex flex-col justify-center">
          <p className="eyebrow">Akses Portal</p>
          <h2 className="mt-2 text-xl text-white">{selected.title}</h2>
          <p className="mt-1.5 text-[13px] leading-[1.7] text-[#777]" style={{ fontFamily: 'var(--font-sans)', fontStyle: 'normal' }}>{selected.subtitle}</p>

          <div className="mt-7 grid gap-4">
            <label className="block">
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#888]" style={{ fontFamily: 'var(--font-sans)', fontStyle: 'normal' }}>Identitas</span>
              <input
                className="input mt-1.5 h-10 text-[13px]"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (error) setError("");
                }}
                placeholder="Masukkan nama tampilan"
              />
            </label>

            <label className="block">
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#888]" style={{ fontFamily: 'var(--font-sans)', fontStyle: 'normal' }}>Wallet address</span>
              <div className="mt-1.5 flex gap-2">
                <input
                  className="input h-10 font-mono text-[11px] truncate"
                  value={walletAddress}
                  readOnly
                  placeholder="Connect wallet untuk mengisi address"
                />
                <button type="button" className="btn-secondary shrink-0 px-3 text-[11px] min-h-[40px]" onClick={connectWallet} disabled={connecting}>
                  <Wallet size={13} className="mr-1" strokeWidth={1.5} />
                  {connecting ? "Connecting" : walletAddress ? "Ganti" : "Connect"}
                </button>
              </div>
            </label>

            {selectedRole === "ADMIN" ? (
              <label className="block">
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#888]" style={{ fontFamily: 'var(--font-sans)', fontStyle: 'normal' }}>Admin Invite Code</span>
                <input
                  className="input mt-1.5 h-10 text-[13px]"
                  type="password"
                  value={adminCode}
                  onChange={(event) => setAdminCode(event.target.value)}
                  placeholder="Masukkan invite code admin"
                />
                <span className="mt-2 block text-[11px] leading-relaxed text-[#666]" style={{ fontFamily: 'var(--font-sans)', fontStyle: 'normal' }}>
                  Admin tidak bisa self-select. Wallet harus masuk allowlist atau memakai invite code.
                </span>
              </label>
            ) : null}
            {selectedRole === "JASTIPER" ? (
              <label className="flex gap-3 rounded-xl border border-white/[0.05] bg-white/[0.015] p-3.5 text-[12px] leading-[1.7] text-[#777]" style={{ fontFamily: 'var(--font-sans)', fontStyle: 'normal' }}>
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 shrink-0 accent-[#d4ff00]"
                  checked={jastiperAccepted}
                  onChange={(event) => setJastiperAccepted(event.target.checked)}
                />
                <span>
                  Saya menyetujui onboarding Jastiper: bukti pembelian wajib valid, reputasi wallet akan tercatat, dan
                  akses order bisa dibatasi jika terjadi dispute/fraud.
                </span>
              </label>
            ) : null}
          </div>

          <button className="btn-primary mt-8 w-full py-3 text-[13px]" onClick={submit} disabled={loading}>
            {loading ? "Menunggu signature..." : `Lanjutkan sebagai ${selected.title}`}
          </button>
          {error ? (
            <p className="mt-3 rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/15 p-3 text-[12px] font-medium text-[#f87171] text-center">{error}</p>
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
          <div className="panel p-10 text-center text-[13px] text-[#777]">Loading login...</div>
        </main>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
