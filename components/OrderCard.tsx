import Link from "next/link";
import { ArrowRight, MapPin, Store } from "lucide-react";
import { formatIdr } from "@/lib/escrowMath";
import type { Order } from "@/lib/types";
import StatusBadge from "./StatusBadge";

export default function OrderCard({ order, actionLabel = "View order" }: { order: Order; actionLabel?: string }) {
  return (
    <article className="panel flex h-full flex-col justify-between overflow-hidden transition-all hover:border-white/[0.1]">
      <div>
        {order.referencePhotoUrl ? (
          <img src={order.referencePhotoUrl} alt={order.itemName} className="h-44 w-full object-cover" />
        ) : (
          <div className="grid h-44 place-items-center bg-[#111117]">
            <div className="text-center">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-accent">{order.destinationCountry}</p>
              <p className="mt-2 text-xl font-bold text-white">{order.brand}</p>
            </div>
          </div>
        )}

        <div className="p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="line-clamp-2 text-base font-semibold text-white">{order.itemName}</h3>
              <p className="mt-1 text-sm text-muted">
                {order.brand} {order.model}
                <span className="divider-dot" />
                {order.color}
              </p>
            </div>
            <StatusBadge status={order.status} />
          </div>

          <div className="grid gap-2.5 text-sm text-muted">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-accent/70" />
              {order.destinationCountry}
            </div>
            <div className="flex items-center gap-2">
              <Store size={14} className="text-accent/70" />
              {order.targetStore}
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted">Escrow amount</p>
            <p className="mt-1 text-lg font-bold text-white">{formatIdr(order.escrowAmountIdr)}</p>
          </div>
        </div>
      </div>

      <Link href={`/orders/${order.id}`} className="btn-secondary mx-5 mb-5">
        {actionLabel}
        <ArrowRight size={15} />
      </Link>
    </article>
  );
}
