export type AppRole = "BUYER" | "JASTIPER" | "ADMIN";

export type DemoProfile = {
  role: AppRole;
  label: string;
  name: string;
  walletAddress: string;
  description: string;
};

export const DEMO_PROFILES: Record<AppRole, DemoProfile> = {
  BUYER: {
    role: "BUYER",
    label: "Customer",
    name: "Nadia Customer",
    walletAddress: "0xB0B0000000000000000000000000000000001001",
    description: "Create jastip orders, review AI reports, release funds, or open disputes."
  },
  JASTIPER: {
    role: "JASTIPER",
    label: "Jastiper",
    name: "Raka Jastiper",
    walletAddress: "0xA6E0000000000000000000000000000000008004",
    description: "Accept buyer orders, upload receipts, and build public reputation."
  },
  ADMIN: {
    role: "ADMIN",
    label: "Admin",
    name: "Demo Admin",
    walletAddress: "0xAD00000000000000000000000000000000008004",
    description: "Seed demo data and generate judge-ready verification reports."
  }
};

export const DEFAULT_ROLE: AppRole = "BUYER";
