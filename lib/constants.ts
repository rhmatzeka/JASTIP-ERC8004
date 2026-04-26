import type { Country } from "./types";

export const PLATFORM_FEE_PERCENT = 3;
export const FX_BUFFER_PERCENT = 5;

export const COUNTRY_RATES: Record<Country, number> = {
  Japan: 105,
  Korea: 1.05,
  Singapore: 11500
};

export const COUNTRY_CURRENCY: Record<Country, string> = {
  Japan: "JPY",
  Korea: "KRW",
  Singapore: "SGD"
};

export const ORDER_STEPS = ["CREATED", "ACCEPTED", "VERIFIED", "RELEASED"] as const;

export const DEMO_BUYER_WALLET = "0xB0B0000000000000000000000000000000001001";
export const DEMO_JASTIPER_WALLET = "0xA6E0000000000000000000000000000000008004";
export const MOCK_REFERENCE_PHOTO =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='620' viewBox='0 0 900 620'%3E%3Crect width='900' height='620' fill='%23eef7ff'/%3E%3Crect x='230' y='105' width='420' height='400' rx='46' fill='%230f6fdc'/%3E%3Crect x='300' y='175' width='280' height='245' rx='28' fill='%23ffffff' opacity='.96'/%3E%3Cpath d='M330 180c20-76 200-76 220 0' fill='none' stroke='%23102033' stroke-width='25' stroke-linecap='round'/%3E%3Ctext x='450' y='325' text-anchor='middle' font-family='Arial' font-size='58' font-weight='700' fill='%23102033'%3ENIKE%3C/text%3E%3Ctext x='450' y='375' text-anchor='middle' font-family='Arial' font-size='26' fill='%23102033'%3EJapan Limited Bag%3C/text%3E%3C/svg%3E";
