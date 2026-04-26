import Link from "next/link";
import { ArrowRight, MapPin, Store } from "lucide-react";
import { formatIdr } from "@/lib/escrowMath";
import type { Order } from "@/lib/types";
import StatusBadge from "./StatusBadge";

export default function OrderCard({ order, actionLabel = "View order" }: { order: Order; actionLabel?: string }) {
  return (
    <article className="panel flex h-full flex-col justify-between p-5">
      <div>
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-ink">{order.itemName}</h3>
            <p className="mt-1 text-sm text-muted">
              {order.brand} {order.model} · {order.color}
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>
        <div className="grid gap-3 text-sm text-muted">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-ocean" />
            {order.destinationCountry}
          </div>
          <div className="flex items-center gap-2">
            <Store size={16} className="text-ocean" />
            {order.targetStore}
          </div>
        </div>
        <div className="mt-4 rounded-lg bg-cloud p-3">
          <p className="text-xs font-semibold uppercase text-muted">Escrow amount</p>
          <p className="mt-1 text-xl font-bold text-ink">{formatIdr(order.escrowAmountIdr)}</p>
        </div>
      </div>
      <Link href={`/orders/${order.id}`} className="btn-secondary mt-5">
        {actionLabel}
        <ArrowRight size={16} />
      </Link>
    </article>
  );
}
