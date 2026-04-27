export type UserRole = "BUYER" | "JASTIPER" | "ADMIN";

export type OrderStatus =
  | "CREATED"
  | "ACCEPTED"
  | "VERIFIED"
  | "RELEASED"
  | "DISPUTED"
  | "REFUNDED";

export type Country = "Japan" | "Korea" | "Singapore";

export type VerificationStatus = "APPROVED" | "FLAGGED" | "REJECTED";

export type EscrowBreakdown = {
  rate: number;
  estimatedIdrPrice: number;
  serviceFee: number;
  fxBuffer: number;
  platformFee: number;
  escrowAmount: number;
};

export type User = {
  id: string;
  role: UserRole;
  name: string;
  walletAddress: string;
  createdAt: string;
};

export type Order = {
  id: string;
  chainOrderId?: string;
  buyerWallet: string;
  jastiperWallet?: string;
  itemName: string;
  brand: string;
  model: string;
  color: string;
  size: string;
  destinationCountry: Country;
  targetStore: string;
  estimatedLocalPrice: number;
  estimatedIdrPrice: number;
  maxBudgetIdr: number;
  serviceFeePercent: number;
  platformFeePercent: number;
  escrowAmountIdr: number;
  escrowBreakdown: EscrowBreakdown;
  referencePhotoUrl?: string;
  receiptPhotoUrl?: string;
  itemPhotoUrl?: string;
  additionalItemPhotoUrl?: string;
  status: OrderStatus;
  verificationReportId?: string;
  createdAt: string;
  acceptedAt?: string;
  verifiedAt?: string;
  autoReleaseAt?: string;
  txHashes?: Record<string, string>;
};

export type VerificationReport = {
  id: string;
  orderId: string;
  storeVerified: boolean;
  storeName: string;
  itemMatchConfidence: number;
  itemNotes: string;
  priceAmountIdr: number;
  priceWithinBudget: boolean;
  dateValid: boolean;
  fraudRiskScore: number;
  fraudFlags: string[];
  overallStatus: VerificationStatus;
  rawJson: VerificationReportJson;
  createdAt: string;
};

export type VerificationReportJson = {
  store: {
    verified: boolean;
    name: string;
  };
  item: {
    match_confidence: number;
    notes: string;
  };
  price: {
    amount_idr: number;
    within_budget: boolean;
  };
  date: {
    valid: boolean;
  };
  fraud_risk: {
    score: number;
    flags: string[];
  };
  overall_status: VerificationStatus;
};

export type AgentReputation = {
  id: string;
  walletAddress: string;
  agentId: string;
  metadataURI?: string;
  completedOrders: number;
  disputedOrders: number;
  averageVerificationScore: number;
  trustScore: number;
};
