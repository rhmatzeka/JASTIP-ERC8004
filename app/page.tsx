import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  CheckCircle2,
  Landmark,
  LockKeyhole,
  ReceiptText,
  ShieldCheck,
  Star,
  Users,
  WalletCards,
  Zap
} from "lucide-react";
import RoleEntryCards from "@/components/RoleEntryCards";
import SplineHeroBackground from "@/components/SplineHeroBackground";

const stats = [
  ["3%", "Platform Fee"],
  ["72h", "Auto Release"],
  ["AI", "Proof Scan"],
  ["ERC-8004", "Trust Layer"]
];

const steps = [
  { num: "01", title: "Customer lock order", body: "Barang, budget, store, dan wallet masuk ke escrow request." },
  { num: "02", title: "Jastiper claim route", body: "Jastiper ambil order dari marketplace dan mulai procurement." },
  { num: "03", title: "AI scans evidence", body: "Receipt, foto barang, store, harga, dan risk signal dibandingkan." },
  { num: "04", title: "Funds settle cleanly", body: "Customer release, dispute, atau sistem auto-release sesuai status." }
];

const cards = [
  {
    title: "Customer protected",
    body: "Dana tidak langsung terbang ke seller sampai bukti belanja lolos verifikasi.",
    icon: ShieldCheck
  },
  {
    title: "Jastiper discoverable",
    body: "Wallet dengan riwayat order bagus punya trust score yang bisa ditunjukkan.",
    icon: Users
  },
  {
    title: "Revenue visible",
    body: "Setiap order selesai punya fee split yang mudah dijelaskan saat demo.",
    icon: BadgeDollarSign
  }
];

const qualifies = [
  { title: "Real-world use case", body: "Jastip sering masih hidup di chat. Nexus memberi escrow, bukti, dan reputasi di satu alur.", Icon: CheckCircle2 },
  { title: "Payment integration", body: "Customer-funded escrow membuat transaksi lebih rapi dan defensible.", Icon: Landmark },
  { title: "AI verification", body: "AI membantu menilai receipt, item photo, store, budget, dan fraud risk.", Icon: Zap },
  { title: "On-chain reputation", body: "Agent identity dan score dapat menjadi lapisan reputasi jastiper.", Icon: WalletCards }
];

const flowHighlights = [
  { title: "Dana dikunci", body: "Customer bayar ke escrow, bukan langsung ke jastiper.", Icon: LockKeyhole },
  { title: "Proof discan", body: "Receipt, item photo, harga, dan store dibandingkan dengan order.", Icon: ReceiptText },
  { title: "Trust naik", body: "Order selesai memperkuat reputasi wallet jastiper.", Icon: Star }
];

export default function LandingPage() {
  return (
    <main>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center">
        {/* Subtle ambient glow behind hero */}
        <div className="absolute inset-0 z-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(200, 160, 40, 0.06), transparent 70%)'
        }} />
        <div className="absolute inset-0 z-0 opacity-30 mix-blend-screen pointer-events-none">
          <SplineHeroBackground />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto">
          {/* Pill badge */}
          <div className="mb-8 flex items-center gap-2.5 rounded-full border border-white/[0.06] bg-white/[0.02] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#999]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#d4ff00] opacity-75"></span>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#d4ff00]"></span>
            </span>
            AI-powered escrow
          </div>

          {/* Main heading */}
          <h1 className="font-display text-6xl leading-[1.02] text-white md:text-7xl lg:text-[88px] tracking-[-0.03em]">
            Handle everything that
            <br />
            <span className="text-gradient">happens after you order</span>
          </h1>

          <p className="mx-auto mt-7 max-w-lg text-[16px] leading-[1.7] text-[#777]" style={{ fontFamily: 'var(--font-sans)' }}>
            Escrow, proof scan, dan reputasi wallet dalam satu flow transaksi. Trusted jastip, powered by AI.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <Link href="/login" className="btn-primary text-sm px-8 py-3">
              Book a demo
            </Link>
            <Link href="#cara-kerja" className="btn-secondary text-sm px-8 py-3">
              See how it works
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats strip ───────────────────────────────────────── */}
      <section className="relative px-6 sm:px-8 lg:px-10 max-w-6xl mx-auto -mt-12 pb-20">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map(([value, label]) => (
            <div key={label} className="glass-strip px-5 py-4 text-center">
              <p className="text-xl font-semibold text-white tracking-tight">{value}</p>
              <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#666]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Ship more, break less (How it works) ─────────────── */}
      <section id="cara-kerja" className="section-glow relative py-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="mb-14 max-w-xl">
            <p className="eyebrow">Cara Kerja</p>
            <h2 className="page-title">Ship more, break less</h2>
            <p className="page-copy mt-4">Masuk sebagai role berbeda untuk menjalankan alur customer, jastiper, dan admin demo.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <article key={step.num} className="panel p-6 relative group">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#555] mb-4">{step.num}</p>
                <h3 className="text-[15px] font-semibold text-white leading-snug mb-2">{step.title}</h3>
                <p className="text-[13px] leading-[1.6] text-[#777]">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Flow highlights (3 icon cards) ─────────────────────── */}
      <section className="py-16 bg-glow-amber">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 grid gap-4 md:grid-cols-3">
          {flowHighlights.map(({ title, body, Icon }) => (
            <article key={title} className="panel p-7 text-center flex flex-col items-center group">
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-white/[0.03] text-[#999] transition-colors group-hover:text-white group-hover:bg-white/[0.05]">
                <Icon size={22} strokeWidth={1.5} />
              </div>
              <h3 className="text-[15px] font-semibold text-white mb-2">{title}</h3>
              <p className="text-[13px] leading-[1.6] text-[#777]">{body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Workspace picker ──────────────────────────────────── */}
      <section className="section-glow relative py-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="mb-14 max-w-xl">
            <p className="eyebrow">Masuk Aplikasi</p>
            <h2 className="page-title">Scale your knowledge</h2>
            <p className="page-copy mt-4">Setiap role punya dashboard sendiri supaya flow demo tetap cepat dan jelas.</p>
          </div>
          <RoleEntryCards />
        </div>
      </section>

      {/* ── Connect your stack (value props) ────────────────────── */}
      <section className="py-16 bg-glow-top">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="mb-14 text-center max-w-2xl mx-auto">
            <p className="eyebrow">Connect your stack</p>
            <h2 className="page-title mx-auto">Monitoring, escrow, verification, and trust</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <article key={card.title} className="panel p-7 group">
                  <div className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-white/[0.03] text-[#888] transition-colors group-hover:text-white group-hover:bg-white/[0.05]">
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[15px] font-semibold text-white mb-2">{card.title}</h3>
                  <p className="text-[13px] leading-[1.6] text-[#777]">{card.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Why demo-worthy ───────────────────────────────────── */}
      <section className="section-glow relative py-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="mb-14 max-w-xl">
            <h2 className="page-title">Be ready for whatever<br/>you launch next</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {qualifies.map(({ title, body, Icon }) => (
              <div key={title} className="panel p-6 flex gap-5 items-start group">
                <div className="shrink-0 grid h-10 w-10 place-items-center rounded-xl bg-white/[0.03] text-[#888] transition-colors group-hover:text-white group-hover:bg-white/[0.05]">
                  <Icon size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-white mb-1.5">{title}</p>
                  <p className="text-[13px] leading-[1.6] text-[#777]">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ──────────────────────────────────────── */}
      <section className="relative py-32 overflow-hidden">
        {/* Amber glow behind footer text */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 50% 60% at 50% 80%, rgba(180, 140, 30, 0.08), transparent)'
        }} />
        <div className="relative z-10 text-center px-6">
          <h2 className="font-display text-5xl md:text-7xl lg:text-[100px] leading-[0.95] text-white tracking-[-0.03em]">
            Jastip Nexus
          </h2>
          <p className="mt-8 text-[15px] text-[#666] max-w-md mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-sans)', fontStyle: 'normal' }}>
            AI-powered escrow and reputation layer for Indonesia's jastip economy.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link href="/login" className="btn-primary px-8 py-3">
              Get started
              <ArrowRight size={16} />
            </Link>
            <Link href="/demo" className="btn-secondary px-8 py-3">
              Book a demo
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.04] py-12">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#d4ff00]/10 text-[#d4ff00] text-xs font-bold">JN</span>
            <span className="font-semibold text-white text-sm tracking-tight">Jastip Nexus</span>
          </div>
          <div className="flex items-center gap-8 text-[12px] text-[#555]">
            <Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link>
            <Link href="/reputation" className="hover:text-white transition-colors">Reputasi</Link>
            <Link href="/demo" className="hover:text-white transition-colors">Demo</Link>
            <Link href="/login" className="hover:text-white transition-colors">Login</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
