import Link from "next/link";
import { ArrowRight, MapPin, Store } from "lucide-react";
import { formatIdr } from "@/lib/escrowMath";
import type { Order } from "@/lib/types";
import StatusBadge from "./StatusBadge";

export default function OrderCard({ order, actionLabel = "View order" }: { order: Order; actionLabel?: string }) {
  return (
    <article className="panel flex h-full flex-col justify-between overflow-hidden transition hover:-translate-y-1 hover:shadow-button">
      <div>
        {order.referencePhotoUrl ? (
          <img src={order.referencePhotoUrl} alt={order.itemName} className="h-44 w-full object-cover" />
        ) : (
          <div className="grid h-44 place-items-center bg-[linear-gradient(135deg,#17202a,#1d6fd9)] text-white">
            <div className="text-center">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-white/60">{order.destinationCountry}</p>
              <p className="mt-2 text-2xl font-black">{order.brand}</p>
            </div>
          </div>
        )}

        <div className="p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="line-clamp-2 text-lg font-black text-ink">{order.itemName}</h3>
              <p className="mt-1 text-sm text-muted">
                {order.brand} {order.model}
                <span className="divider-dot" />
                {order.color}
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

          <div className="mt-4 rounded-lg border border-line bg-cloud p-3">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-muted">Escrow amount</p>
            <p className="mt-1 text-xl font-black text-ink">{formatIdr(order.escrowAmountIdr)}</p>
          </div>
        </div>
      </div>

      <Link href={`/orders/${order.id}`} className="btn-secondary mx-5 mb-5">
        {actionLabel}
        <ArrowRight size={16} />
      </Link>
    </article>
  );
}
