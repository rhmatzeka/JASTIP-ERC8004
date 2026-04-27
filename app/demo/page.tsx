"use client";

import Link from "next/link";
import { useState } from "react";
import { Database, FlaskConical, RefreshCw, Sparkles, UserPlus } from "lucide-react";
import { useDemoProfile } from "@/lib/useDemoProfile";

const actions = [
  ["seed-order", "Seed demo buyer order", Database],
  ["seed-jastiper", "Seed demo jastiper", UserPlus],
  ["approved-report", "Generate mock approved AI report", Sparkles],
  ["flagged-report", "Generate mock flagged AI report", FlaskConical],
  ["rejected-report", "Generate mock rejected AI report", FlaskConical],
  ["reset", "Reset local demo data", RefreshCw]
] as const;

export default function DemoPage() {
  const { role, profile, setRole } = useDemoProfile();
  const [message, setMessage] = useState("");
  const [orderId, setOrderId] = useState("");

  async function run(action: string) {
    setMessage("Running...");
    const response = await fetch("/api/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action })
    });
    const data = await response.json();
    setMessage(data.message || "Done");
    if (data.order?.id) setOrderId(data.order.id);
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <p className="text-sm font-bold text-ocean">Hackathon-only controls</p>
        <h1 className="mt-1 text-3xl font-black text-ink">Demo Admin</h1>
      </div>
      {role !== "ADMIN" ? (
        <section className="panel mb-6 p-5">
          <p className="font-bold text-ink">Halaman ini untuk Admin.</p>
          <p className="mt-2 text-sm text-muted">
            Kamu sedang memakai mode {profile.label}. Pindah ke Admin untuk seed data dan generate report demo.
          </p>
          <button className="btn-primary mt-4" onClick={() => setRole("ADMIN")}>
            Switch to Admin
          </button>
        </section>
      ) : null}
      <section className="panel p-5">
        <div className="grid gap-3 md:grid-cols-2">
          {actions.map(([action, label, Icon]) => (
            <button
              key={action}
              className={action === "reset" ? "btn-danger" : "btn-secondary"}
              onClick={() => run(action)}
              disabled={role !== "ADMIN"}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
        {message ? <p className="mt-5 rounded-lg bg-cloud p-3 text-sm font-semibold text-ink">{message}</p> : null}
        <div className="mt-5 flex flex-wrap gap-3">
          <Link className="btn-primary" href="/marketplace">
            Open marketplace
          </Link>
          {orderId ? (
            <Link className="btn-secondary" href={`/orders/${orderId}`}>
              Open seeded order
            </Link>
          ) : null}
        </div>
      </section>
      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {["Create order", "Accept as jastiper", "Upload proof and release"].map((title, index) => (
          <div key={title} className="rounded-lg border border-line bg-white p-5">
            <p className="text-sm font-black text-ocean">0{index + 1}</p>
            <h2 className="mt-2 text-lg font-bold text-ink">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              {index === 0
                ? "Seed the Nike Japan order or create a custom buyer order."
                : index === 1
                  ? "Attach a jastiper wallet and registry identity."
                  : "Generate AI verification, release escrow, then show reputation."}
            </p>
          </div>
        ))}
      </section>
    </main>
  );
}
