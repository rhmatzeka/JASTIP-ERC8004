import { z } from "zod";

const walletRegex = /^0x[a-fA-F0-9]{40}$/;
const imageRegex = /^(data:image\/(png|jpeg|jpg|webp|svg\+xml);base64,|data:image\/svg\+xml,|https?:\/\/)/;

export const walletSchema = z.string().regex(walletRegex, "Must be a valid EVM wallet address");

export const optionalImageSchema = z
  .string()
  .trim()
  .refine((value) => value === "" || imageRegex.test(value), "Must be an image data URL or http(s) URL")
  .optional()
  .transform((value) => (value ? value : undefined));

export const createOrderSchema = z.object({
  itemName: z.string().trim().min(2).max(120),
  brand: z.string().trim().min(1).max(80),
  model: z.string().trim().min(1).max(100),
  color: z.string().trim().min(1).max(60),
  size: z.string().trim().min(1).max(60),
  destinationCountry: z.enum(["Japan", "Korea", "Singapore"]),
  targetStore: z.string().trim().min(2).max(120),
  estimatedLocalPrice: z.coerce.number().positive().max(1_000_000_000),
  maxBudgetIdr: z.coerce.number().positive().max(5_000_000_000),
  serviceFeePercent: z.coerce.number().min(0).max(40),
  buyerWallet: walletSchema,
  referencePhotoUrl: optionalImageSchema
});

export const acceptOrderSchema = z.object({
  jastiperWallet: walletSchema
});

export const verifyOrderSchema = z.object({
  receiptPhotoUrl: optionalImageSchema,
  itemPhotoUrl: optionalImageSchema,
  additionalItemPhotoUrl: optionalImageSchema
});

export const registerAgentSchema = z.object({
  walletAddress: walletSchema.optional(),
  wallet: walletSchema.optional(),
  metadataURI: z.string().trim().min(3).max(300).optional()
});

export const loginSchema = z.object({
  role: z.enum(["BUYER", "JASTIPER", "ADMIN"]),
  name: z.string().trim().min(2).max(80),
  walletAddress: walletSchema,
  message: z.string().trim().min(20).max(1000),
  signature: z.string().trim().min(20).max(300),
  adminCode: z.string().trim().max(120).optional(),
  jastiperOnboardingAccepted: z.boolean().optional()
});
