"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, UserRound, UsersRound, Wallet } from "lucide-react";
import { DEMO_PROFILES, type AppRole } from "@/lib/demoProfiles";
import { useDemoProfile } from "@/lib/useDemoProfile";

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

function randomWallet() {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  return `0x${Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")}`;
}

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useDemoProfile();
  const initialRole = (params.get("role") || "BUYER") as AppRole;
  const safeInitialRole = initialRole in DEMO_PROFILES ? initialRole : "BUYER";
  const [selectedRole, setSelectedRole] = useState<AppRole>(safeInitialRole);
  const [name, setName] = useState(DEMO_PROFILES[safeInitialRole].name);
  const [walletAddress, setWalletAddress] = useState(DEMO_PROFILES[safeInitialRole].walletAddress);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selected = useMemo(() => roleMeta[selectedRole], [selectedRole]);

  function chooseRole(role: AppRole) {
    setSelectedRole(role);
    setName(DEMO_PROFILES[role].name);
    setWalletAddress(DEMO_PROFILES[role].walletAddress);
  }

  async function submit() {
    setLoading(true);
    setError("");
    try {
      await login(selectedRole, { name, walletAddress });
      router.push(selected.redirect);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <section className="panel overflow-hidden">
          <div className="bg-ink p-6 text-white">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-white/55">Jastip Agent Login</p>
            <h1 className="mt-3 text-3xl font-black leading-tight md:text-5xl">Masuk sesuai peran kamu</h1>
            <p className="mt-4 text-sm leading-6 text-white/70">
              Ini auth demo lokal untuk hackathon: session disimpan di browser, wallet bisa pakai mock, dan setiap role punya flow sendiri.
            </p>
          </div>
          <div className="grid gap-3 p-5">
            {(Object.keys(DEMO_PROFILES) as AppRole[]).map((role) => {
              const meta = roleMeta[role];
              const Icon = meta.Icon;
              const active = selectedRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  className={`flex items-start gap-3 rounded-lg border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-button ${
                    active ? "border-ocean bg-blue-50 ring-2 ring-ocean/15" : "border-line bg-white"
                  }`}
                  onClick={() => chooseRole(role)}
                >
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg ${active ? "bg-ocean text-white" : "bg-cloud text-ocean"}`}>
                    <Icon size={20} />
                  </span>
                  <span>
                    <span className="block font-black text-ink">{meta.title}</span>
                    <span className="mt-1 block text-sm leading-6 text-muted">{meta.subtitle}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="panel p-5">
          <p className="eyebrow">Detail akun</p>
          <h2 className="mt-2 text-2xl font-black text-ink">{selected.title}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">{selected.subtitle}</p>

          <div className="mt-6 grid gap-4">
            <label className="text-sm font-black text-ink">
              Nama
              <input className="input mt-1" value={name} onChange={(event) => setName(event.target.value)} />
            </label>

            <label className="text-sm font-black text-ink">
              Wallet address
              <div className="mt-1 flex gap-2">
                <input className="input" value={walletAddress} onChange={(event) => setWalletAddress(event.target.value)} placeholder="0x..." />
                <button type="button" className="btn-secondary shrink-0" onClick={() => setWalletAddress(randomWallet())}>
                  <Wallet size={16} />
                  Mock
                </button>
              </div>
            </label>
          </div>

          <button className="btn-primary mt-6 w-full" onClick={submit} disabled={loading || !name.trim() || !walletAddress.trim()}>
            {loading ? "Masuk..." : `Masuk sebagai ${selected.title}`}
          </button>
          {error ? <p className="mt-3 rounded-lg bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</p> : null}
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
