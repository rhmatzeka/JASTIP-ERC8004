"use client";

import { useEffect, useState } from "react";
import OrderCard from "@/components/OrderCard";
import { useDemoProfile } from "@/lib/useDemoProfile";
import type { Order } from "@/lib/types";

export default function MarketplacePage() {
  const { role, profile, setRole } = useDemoProfile();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((response) => response.json())
      .then((data) => setOrders(data.orders || []));
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold text-ocean">Open jastip marketplace</p>
          <h1 className="mt-1 text-3xl font-black text-ink">View Marketplace</h1>
        </div>
        <p className="max-w-xl text-sm leading-6 text-muted">
          {role === "JASTIPER"
            ? "You are browsing as a jastiper. Accept buyer-funded orders, upload proof, and build reputation."
            : "Marketplace is the jastiper workspace. Switch role before accepting buyer orders."}
        </p>
      </div>
      {role !== "JASTIPER" ? (
        <section className="panel mb-6 p-5">
          <p className="font-bold text-ink">Halaman ini untuk Jastiper.</p>
          <p className="mt-2 text-sm text-muted">
            Kamu sedang memakai mode {profile.label}. Buyer bisa lihat order, tapi hanya jastiper yang bisa accept.
          </p>
          <button className="btn-primary mt-4" onClick={() => setRole("JASTIPER")}>
            Switch to Jastiper
          </button>
        </section>
      ) : null}
      {orders.length === 0 ? (
        <div className="panel p-8 text-center">
          <p className="font-bold text-ink">No orders yet.</p>
          <p className="mt-2 text-sm text-muted">Use Demo Admin to seed a judge-ready order.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} actionLabel={order.status === "CREATED" ? "Accept Order" : "Open details"} />
          ))}
        </div>
      )}
    </main>
  );
}
