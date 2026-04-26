import { COUNTRY_RATES, FX_BUFFER_PERCENT, PLATFORM_FEE_PERCENT } from "./constants";
import type { Country, EscrowBreakdown } from "./types";

export function calculateEscrowAmount({
  destinationCountry,
  estimatedLocalPrice,
  serviceFeePercent
}: {
  destinationCountry: Country;
  estimatedLocalPrice: number;
  serviceFeePercent: number;
}): EscrowBreakdown {
  const rate = COUNTRY_RATES[destinationCountry];
  const estimatedIdrPrice = estimatedLocalPrice * rate;
  const serviceFee = (estimatedIdrPrice * serviceFeePercent) / 100;
  const fxBuffer = (estimatedIdrPrice * FX_BUFFER_PERCENT) / 100;
  const platformFee = ((estimatedIdrPrice + serviceFee + fxBuffer) * PLATFORM_FEE_PERCENT) / 100;
  const escrowAmount = estimatedIdrPrice + serviceFee + fxBuffer + platformFee;

  return {
    rate,
    estimatedIdrPrice: Math.round(estimatedIdrPrice),
    serviceFee: Math.round(serviceFee),
    fxBuffer: Math.round(fxBuffer),
    platformFee: Math.round(platformFee),
    escrowAmount: Math.round(escrowAmount)
  };
}

export function formatIdr(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(value || 0);
}

export function calculateTrustScore(completedOrders: number, averageVerificationScore: number, disputedOrders: number): number {
  return Math.round(completedOrders * 10 + averageVerificationScore - disputedOrders * 20);
}
