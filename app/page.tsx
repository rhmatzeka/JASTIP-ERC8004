import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  Bot,
  CheckCircle2,
  Landmark,
  LockKeyhole,
  PackageCheck,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  WalletCards
} from "lucide-react";
import RoleEntryCards from "@/components/RoleEntryCards";
import { MOCK_REFERENCE_PHOTO } from "@/lib/constants";

const stats = [
  ["3%", "platform fee"],
  ["72h", "auto-release window"],
  ["AI", "receipt verification"],
  ["ERC-8004", "agent reputation"]
];

const flowHighlights = [
  {
    title: "Dana dikunci",
    body: "Customer bayar ke escrow, bukan langsung ke jastiper.",
    Icon: LockKeyhole
  },
  {
    title: "Bukti dicek AI",
    body: "Receipt, foto barang, harga, dan store dibandingkan dengan order.",
    Icon: ReceiptText
  },
  {
    title: "Reputasi naik",
    body: "Order selesai memperkuat trust score jastiper.",
    Icon: Star
  }
];

const steps = [
  ["01", "Customer buat order", "Isi barang, negara tujuan, toko target, budget, dan wallet."],
  ["02", "Jastiper ambil order", "Jastiper accept order dari marketplace dan upload bukti pembelian."],
  ["03", "AI memberi keputusan", "APPROVED, FLAGGED, atau REJECTED berdasarkan foto dan metadata."],
  ["04", "Dana release atau dispute", "Customer melepas dana, membuka sengketa, atau sistem auto-release."]
];

const cards = [
  {
    title: "Customer aman",
    body: "Dana tidak langsung lepas sebelum bukti pembelian diverifikasi.",
    icon: ShieldCheck
  },
  {
    title: "Jastiper kredibel",
    body: "Reputasi wallet membantu jastiper bagus terlihat lebih dipercaya.",
    icon: Users
  },
  {
    title: "Bisnis jalan",
    body: "Platform punya revenue jelas dari 3% fee tiap order selesai.",
    icon: BadgeDollarSign
  }
];

const qualifies = [
  ["Real-world use case", "Jastip masih banyak berjalan di chat dan DM. App ini menambah trust layer yang jelas."],
  ["Payment integration", "Dana customer dikunci di escrow dan baru dilepas setelah verifikasi."],
  ["AI verification", "AI memeriksa receipt, item photo, budget, store, dan fraud risk."],
  ["On-chain reputation", "Jastiper identity dan score tersimpan sebagai agent reputation layer."]
];

export default function LandingPage() {
  return (
    <main>
      <section className="page-shell pb-4">
        <div className="grid gap-5 lg:grid-cols-[1fr_430px]">
          <div className="panel overflow-hidden">
            <div className="grid min-h-[520px] gap-8 p-6 md:grid-cols-[1fr_300px] md:p-8 lg:p-10">
              <div className="flex flex-col justify-center">
                <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-lg border border-line bg-cloud px-3 py-2 text-sm font-black text-ocean">
                  <Bot size={16} />
                  AI escrow and trust layer
                </div>
                <h1 className="max-w-3xl text-4xl font-black leading-tight text-ink md:text-6xl">Jastip Agent</h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-muted md:text-lg">
                  Platform awal untuk customer dan jastiper: dana dikunci di escrow, bukti pembelian dicek AI, lalu reputasi
                  jastiper terbentuk dari order yang benar-benar selesai.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link href="/login" className="btn-primary">
                    Masuk ke Aplikasi
                    <ArrowRight size={17} />
                  </Link>
                  <Link href="#cara-kerja" className="btn-secondary">
                    Lihat Cara Kerja
                  </Link>
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <div className="rounded-lg border border-line bg-ink p-3 text-white shadow-soft">
                  <img src={MOCK_REFERENCE_PHOTO} alt="Nike Japan reference bag" className="h-44 w-full rounded-md object-cover" />
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">Preview order</p>
                        <p className="mt-1 font-black">Nike Harajuku</p>
                      </div>
                      <span className="rounded-md bg-mint px-2.5 py-1 text-xs font-black text-white">VERIFIED</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-md bg-white/10 p-3">
                        <p className="text-white/55">Escrow</p>
                        <p className="mt-1 font-black">Rp950k</p>
                      </div>
                      <div className="rounded-md bg-white/10 p-3">
                        <p className="text-white/55">Trust score</p>
                        <p className="mt-1 font-black">108</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid border-t border-line bg-cloud/70 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map(([value, label]) => (
                <div key={label} className="border-t border-line p-5 first:border-t-0 sm:border-l sm:border-t-0 sm:first:border-l-0">
                  <p className="text-2xl font-black text-ink">{value}</p>
                  <p className="mt-1 text-sm font-bold text-muted">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="panel p-5">
            <p className="eyebrow">Dashboard preview</p>
            <h2 className="mt-2 text-2xl font-black text-ink">Satu sistem, tiga workspace</h2>
            <div className="mt-5 space-y-3">
              {[
                ["Customer", "Buat order, review AI report, release dana."],
                ["Jastiper", "Ambil order, upload receipt, bangun reputasi."],
                ["Admin", "Seed demo, cek flow, dan manage presentasi."]
              ].map(([title, body]) => (
                <div key={title} className="rounded-lg border border-line bg-cloud/70 p-4">
                  <p className="font-black text-ink">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted">{body}</p>
                </div>
              ))}
            </div>
            <Link href="/login" className="btn-primary mt-5 w-full">
              Pilih Role Login
              <ArrowRight size={16} />
            </Link>
          </aside>
        </div>
      </section>

      <section id="cara-kerja" className="page-shell py-5">
        <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Cara kerja</p>
            <h2 className="page-title">Dari titip barang sampai dana cair</h2>
          </div>
          <p className="page-copy">Halaman ini cuma pintu awal. Flow transaksi sebenarnya dimulai setelah user login sesuai role.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-4">
          {steps.map(([step, title, body]) => (
            <article key={step} className="panel p-5">
              <p className="eyebrow">{step}</p>
              <h3 className="mt-3 text-lg font-black text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-shell grid gap-4 py-5 md:grid-cols-3">
        {flowHighlights.map(({ title, body, Icon }) => (
          <article key={title} className="panel p-5">
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-cloud text-ocean">
              <Icon size={23} />
            </div>
            <h3 className="text-xl font-black text-ink">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
          </article>
        ))}
      </section>

      <section className="page-shell py-5">
        <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Masuk aplikasi</p>
            <h2 className="page-title">Pilih dashboard kamu</h2>
          </div>
          <p className="page-copy">Login akan membuat user di database lokal dan menyimpan session dari hasil API.</p>
        </div>
        <RoleEntryCards />
      </section>

      <section className="page-shell grid gap-4 py-5 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.title} className="panel p-5">
              <Icon className="mb-4 text-ocean" size={26} />
              <h3 className="text-xl font-black text-ink">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{card.body}</p>
            </article>
          );
        })}
      </section>

      <section className="page-shell pt-5">
        <div className="mb-5 flex items-center gap-2">
          <Sparkles className="text-ocean" />
          <h2 className="text-2xl font-black text-ink">Kenapa ini layak demo</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {qualifies.map(([title, body], index) => (
            <div key={title} className="panel p-5">
              <div className="mb-3 flex items-center gap-2 text-ocean">
                {index === 0 ? (
                  <CheckCircle2 size={18} />
                ) : index === 1 ? (
                  <Landmark size={18} />
                ) : index === 2 ? (
                  <Bot size={18} />
                ) : (
                  <WalletCards size={18} />
                )}
                <p className="font-black text-ink">{title}</p>
              </div>
              <p className="text-sm leading-6 text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
