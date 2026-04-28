import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";

export const runtime = "nodejs";

function present(value?: string) {
  return Boolean(value && value.trim().length > 0);
}

export async function GET() {
  const chainWrites = process.env.ENABLE_SERVER_CHAIN_WRITES === "true";
  const checks = {
    authSecret: present(process.env.AUTH_SECRET),
    adminInviteCode: present(process.env.ADMIN_INVITE_CODE),
    database: isSupabaseConfigured(),
    openai: present(process.env.OPENAI_API_KEY),
    appUrl: present(process.env.NEXT_PUBLIC_APP_URL),
    mockToolsDisabled: process.env.NEXT_PUBLIC_ENABLE_MOCK_TOOLS === "false",
    demoToolsDisabled: process.env.ENABLE_DEMO_TOOLS !== "true",
    chain:
      !chainWrites ||
      (present(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL) &&
        present(process.env.PRIVATE_KEY) &&
        present(process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS) &&
        present(process.env.NEXT_PUBLIC_AGENT_REGISTRY_CONTRACT_ADDRESS))
  };

  const missing = Object.entries(checks)
    .filter(([, ok]) => !ok)
    .map(([name]) => name);
  const ready = missing.length === 0;

  return NextResponse.json(
    {
      ready,
      mode: process.env.NODE_ENV,
      checks,
      missing
    },
    { status: ready ? 200 : 503 }
  );
}
