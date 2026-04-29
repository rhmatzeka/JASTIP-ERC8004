import Link from "next/link";
import { ArrowRight, MapPin, Store } from "lucide-react";
import { formatIdr } from "@/lib/escrowMath";
import type { Order } from "@/lib/types";
import StatusBadge from "./StatusBadge";

export default function OrderCard({ order, actionLabel = "View order" }: { order: Order; actionLabel?: string }) {
  return (
    <article className="panel flex h-full flex-col justify-between overflow-hidden group">
      <div>
        {order.referencePhotoUrl ? (
          <img src={order.referencePhotoUrl} alt={order.itemName} className="h-44 w-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
        ) : (
          <div className="grid h-44 place-items-center bg-[#060606]">
            <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#888]">{order.destinationCountry}</p>
              <p className="mt-2 text-xl font-semibold text-white tracking-tight">{order.brand}</p>
            </div>
          </div>
        )}

        <div className="p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="line-clamp-2 text-[14px] font-semibold text-white">{order.itemName}</h3>
              <p className="mt-1 text-[12px] text-[#777]">
                {order.brand} {order.model}
                <span className="divider-dot" />
                {order.color}
              </p>
            </div>
            <StatusBadge status={order.status} />
          </div>

          <div className="grid gap-2 text-[12px] text-[#888]">
            <div className="flex items-center gap-2">
              <MapPin size={13} className="text-[#666]" strokeWidth={1.5} />
              {order.destinationCountry}
            </div>
            <div className="flex items-center gap-2">
              <Store size={13} className="text-[#666]" strokeWidth={1.5} />
              {order.targetStore}
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-white/[0.05] bg-white/[0.015] p-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#666]">Escrow amount</p>
            <p className="mt-1 text-lg font-semibold text-white tracking-tight">{formatIdr(order.escrowAmountIdr)}</p>
          </div>
        </div>
      </div>

      <Link href={`/orders/${order.id}`} className="btn-secondary mx-5 mb-5 text-[12px]">
        {actionLabel}
        <ArrowRight size={14} />
      </Link>
    </article>
  );
}
