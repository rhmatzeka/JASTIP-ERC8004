import Link from "next/link";
import { ArrowRight, BadgeDollarSign, Bot, ShieldCheck, Star, Users } from "lucide-react";
import RoleEntryCards from "@/components/RoleEntryCards";

const cards = [
  {
    title: "For buyers",
    body: "Safer upfront payment with escrow, AI proof checks, and dispute path.",
    icon: ShieldCheck
  },
  {
    title: "For jastipers",
    body: "Trusted public reputation that follows each jastiper wallet across orders.",
    icon: Star
  },
  {
    title: "For platform",
    body: "Sustainable 3% transaction fee from every released escrow.",
    icon: BadgeDollarSign
  }
];

const qualifies = [
  ["Real-world use case", "Indonesia's jastip market still depends on WhatsApp and Instagram trust. Jastip Agent adds a trust layer."],
  ["Payment integration", "Buyer funds are locked in smart escrow and released only after verification."],
  ["Sustainable revenue model", "The platform takes 3% fee from every completed transaction."],
  [
    "ERC-8004 deployment",
    "Jastiper identities and reputation are registered on Ethereum Sepolia testnet using ERC-8004-style agent registry."
  ]
];

export default function LandingPage() {
  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-16">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-sm font-bold text-ocean">
            <Bot size={16} />
            AI-powered escrow and reputation layer
          </div>
          <h1 className="max-w-3xl text-4xl font-black leading-tight text-ink md:text-6xl">Jastip Agent</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
            Indonesia's jastip economy runs on blind trust in WhatsApp, Instagram DM, and Twitter. Jastip Agent turns that
            informal flow into smart escrow, AI receipt verification, and on-chain jastiper reputation.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/orders/new" className="btn-primary">
              Create Order
              <ArrowRight size={17} />
            </Link>
            <Link href="/marketplace" className="btn-secondary">
              View Marketplace
            </Link>
          </div>
        </div>

        <div className="panel overflow-hidden">
          <div className="bg-[linear-gradient(135deg,#1268db,#10b981)] p-6 text-white">
            <p className="text-sm font-bold uppercase tracking-wide text-white/80">Live demo flow</p>
            <h2 className="mt-2 text-2xl font-black">Nike Japan Limited Edition Bag</h2>
            <p className="mt-2 text-sm text-white/85">Escrow funded, receipt verified, funds released, reputation updated.</p>
          </div>
          <div className="grid gap-4 p-6">
            {[
              ["1", "Buyer funds escrow", "Mock stablecoin payment represented as ETH escrow."],
              ["2", "AI verifies proof", "Receipt, item, budget, and fraud risk checked."],
              ["3", "Reputation updates", "ERC-8004-style agent registry records performance."]
            ].map(([step, title, body]) => (
              <div key={step} className="flex gap-4 rounded-lg border border-line bg-cloud/70 p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white font-black text-ocean">{step}</span>
                <div>
                  <p className="font-bold text-ink">{title}</p>
                  <p className="mt-1 text-sm text-muted">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4">
        <RoleEntryCards />
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-6 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.title} className="panel p-5">
              <Icon className="mb-4 text-ocean" size={28} />
              <h3 className="text-xl font-bold text-ink">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{card.body}</p>
            </article>
          );
        })}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-5 flex items-center gap-2">
          <Users className="text-ocean" />
          <h2 className="text-2xl font-black text-ink">Why this qualifies</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {qualifies.map(([title, body]) => (
            <div key={title} className="rounded-lg border border-line bg-white p-5">
              <p className="font-bold text-ink">{title}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
