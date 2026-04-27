import { NextRequest } from "next/server";
import { fail, ok, parseJson } from "@/lib/api";
import { registerAgent, upsertUser } from "@/lib/db";
import { loginSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await parseJson(request, loginSchema);
    const user = await upsertUser({
      role: body.role,
      name: body.name,
      walletAddress: body.walletAddress
    });

    const reputation =
      body.role === "JASTIPER" ? await registerAgent(body.walletAddress, "ipfs://jastip-agent/jastiper-profile") : null;

    return ok({
      user,
      reputation,
      session: {
        userId: user.id,
        role: user.role,
        name: user.name,
        walletAddress: user.walletAddress
      }
    });
  } catch (error) {
    return fail(error);
  }
}
