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

const stats = [
  ["3%", "platform fee"],
  ["72h", "auto release"],
  ["AI", "proof scan"],
  ["ERC-8004", "trust layer"]
];

const steps = [
  ["01", "Customer lock order", "Barang, budget, store, dan wallet masuk ke escrow request."],
  ["02", "Jastiper claim route", "Jastiper ambil order dari marketplace dan mulai procurement."],
  ["03", "AI scans evidence", "Receipt, foto barang, store, harga, dan risk signal dibandingkan."],
  ["04", "Funds settle cleanly", "Customer release, dispute, atau sistem auto-release sesuai status."]
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
  ["Real-world use case", "Jastip sering masih hidup di chat. Nexus memberi escrow, bukti, dan reputasi di satu alur."],
  ["Payment integration", "Customer-funded escrow membuat transaksi lebih rapi dan defensible."],
  ["AI verification", "AI membantu menilai receipt, item photo, store, budget, dan fraud risk."],
  ["On-chain reputation", "Agent identity dan score dapat menjadi lapisan reputasi jastiper."]
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
      <section className="page-shell pt-16 pb-12">
        <div className="max-w-3xl">
          <p className="eyebrow mb-4">AI-Powered Escrow Platform</p>
          <h1 className="text-4xl font-bold leading-[1.15] text-white md:text-6xl tracking-tight">
            Jastip{" "}
            <span className="text-gradient">Nexus</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Platform jastip premium untuk mengunci dana, memindai bukti pembelian dengan AI, dan membangun reputasi
            jastiper dari transaksi yang benar-benar selesai.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/login" className="btn-primary text-sm px-6 py-3">
              Masuk Aplikasi
              <ArrowRight size={16} />
            </Link>
            <Link href="#cara-kerja" className="btn-secondary text-sm px-6 py-3">
              Lihat Cara Kerja
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-4 max-w-3xl">
          {stats.map(([value, label]) => (
            <div key={label} className="glass-strip p-4 text-center sm:text-left">
              <p className="text-xl font-bold text-white">{value}</p>
              <p className="mt-1.5 text-[11px] font-medium uppercase tracking-wider text-muted">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────── */}
      <section id="cara-kerja" className="page-shell py-16">
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow">Cara kerja</p>
          <h2 className="page-title">Flow transaksi siap ditunjukkan</h2>
          <p className="page-copy mt-3">Masuk sebagai role berbeda untuk menjalankan alur customer, jastiper, dan admin demo.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map(([step, title, body]) => (
            <article key={step} className="panel p-5 relative overflow-hidden">
              <p className="eyebrow">{step}</p>
              <h3 className="mt-3 text-base font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Flow highlights ───────────────────────────────────── */}
      <section className="page-shell grid gap-4 py-8 md:grid-cols-3">
        {flowHighlights.map(({ title, body, Icon }) => (
          <article key={title} className="panel p-6 text-center flex flex-col items-center">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-accent/10 text-accent">
              <Icon size={22} />
            </div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
          </article>
        ))}
      </section>

      {/* ── Workspace picker ──────────────────────────────────── */}
      <section className="page-shell py-16">
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow">Masuk aplikasi</p>
          <h2 className="page-title">Pilih workspace</h2>
          <p className="page-copy mt-3">Setiap role punya dashboard sendiri supaya flow demo tetap cepat dan jelas.</p>
        </div>
        <RoleEntryCards />
      </section>

      {/* ── Value props ───────────────────────────────────────── */}
      <section className="page-shell grid gap-4 py-8 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.title} className="panel p-6">
              <Icon className="mb-4 text-accent" size={22} />
              <h3 className="text-lg font-semibold text-white">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{card.body}</p>
            </article>
          );
        })}
      </section>

      {/* ── Why demo-worthy ───────────────────────────────────── */}
      <section className="page-shell py-16 mb-8">
        <h2 className="text-2xl font-bold text-white mb-8">Kenapa ini layak demo</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {qualifies.map(([title, body], index) => (
            <div key={title} className="panel p-5 flex gap-4">
              <div className="shrink-0 mt-0.5">
                {index === 0 ? (
                  <CheckCircle2 size={20} className="text-success" />
                ) : index === 1 ? (
                  <Landmark size={20} className="text-accent" />
                ) : index === 2 ? (
                  <Zap size={20} className="text-warn" />
                ) : (
                  <WalletCards size={20} className="text-danger" />
                )}
              </div>
              <div>
                <p className="text-base font-semibold text-white mb-1.5">{title}</p>
                <p className="text-sm leading-relaxed text-muted">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
