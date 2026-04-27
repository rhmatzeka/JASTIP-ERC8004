import { NextRequest, NextResponse } from "next/server";
import { ApiError, fail, ok, parseJson } from "@/lib/api";
import { PLATFORM_FEE_PERCENT } from "@/lib/constants";
import { calculateEscrowAmount } from "@/lib/escrowMath";
import { createOrder, getOrders } from "@/lib/db";
import type { Country, OrderStatus } from "@/lib/types";
import { createOrderSchema } from "@/lib/validation";
import { createEscrowOnChain } from "@/lib/web3";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get("status") as OrderStatus | null;
  const orders = await getOrders(status || undefined);
  return ok({ orders });
}

export async function POST(request: NextRequest) {
  try {
  const body = await parseJson(request, createOrderSchema);
  const destinationCountry = body.destinationCountry as Country;
  const breakdown = calculateEscrowAmount({
    destinationCountry,
    estimatedLocalPrice: Number(body.estimatedLocalPrice || 0),
    serviceFeePercent: Number(body.serviceFeePercent || 0)
  });
  const chain = await createEscrowOnChain(breakdown.escrowAmount);

  if (body.maxBudgetIdr < breakdown.estimatedIdrPrice) {
    throw new ApiError(400, "Max budget must be at least the converted estimated item price");
  }

  const order = await createOrder({
    chainOrderId: chain.chainOrderId,
    buyerWallet: body.buyerWallet,
    itemName: body.itemName,
    brand: body.brand,
    model: body.model,
    color: body.color,
    size: body.size,
    destinationCountry,
    targetStore: body.targetStore,
    estimatedLocalPrice: Number(body.estimatedLocalPrice || 0),
    estimatedIdrPrice: breakdown.estimatedIdrPrice,
    maxBudgetIdr: Number(body.maxBudgetIdr || 0),
    serviceFeePercent: Number(body.serviceFeePercent || 0),
    platformFeePercent: PLATFORM_FEE_PERCENT,
    escrowAmountIdr: breakdown.escrowAmount,
    escrowBreakdown: breakdown,
    referencePhotoUrl: body.referencePhotoUrl,
    txHashes: {
      create: chain.txHash
    }
  });

  return ok({ order });
  } catch (error) {
    return fail(error);
  }
}
