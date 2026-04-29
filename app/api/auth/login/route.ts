import { NextRequest } from "next/server";
import { ApiError, fail, ok, parseJson } from "@/lib/api";
import { setSessionCookie } from "@/lib/auth";
import { registerAgent, upsertUser } from "@/lib/db";
import { rateLimit } from "@/lib/rateLimit";
import { loginSchema } from "@/lib/validation";
import { verifyWalletLogin } from "@/lib/walletAuth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    rateLimit(request, "login", 12, 60_000);
    const body = await parseJson(request, loginSchema);
    const walletVerified = verifyWalletLogin({
      walletAddress: body.walletAddress,
      role: body.role,
      message: body.message,
      signature: body.signature
    });

    if (!walletVerified) {
      throw new ApiError(401, "Wallet signature is invalid or expired");
    }

    if (body.role === "JASTIPER" && body.jastiperOnboardingAccepted !== true) {
      return Response.json(
        { error: "Jastiper onboarding approval is required before accepting orders" },
        { status: 403 }
      );
    }

    if (body.role === "ADMIN") {
      const allowedWallets = (process.env.ADMIN_WALLET_ALLOWLIST || "")
        .split(",")
        .map((wallet) => wallet.trim().toLowerCase())
        .filter(Boolean);
      const walletAllowed = allowedWallets.includes(body.walletAddress.toLowerCase());
      const inviteCodeAllowed = Boolean(process.env.ADMIN_INVITE_CODE && body.adminCode === process.env.ADMIN_INVITE_CODE);

      if (!walletAllowed && !inviteCodeAllowed) {
        return Response.json({ error: "Admin access is invite-only" }, { status: 403 });
      }
    }

    const user = await upsertUser({
      role: body.role,
      name: body.name,
      walletAddress: body.walletAddress
    });

    const reputation =
      body.role === "JASTIPER" ? await registerAgent(body.walletAddress, "ipfs://jastip-agent/jastiper-profile") : null;

    const session = {
      userId: user.id,
      role: user.role,
      name: user.name,
      walletAddress: user.walletAddress
    };
    const response = ok({
      user,
      reputation,
      session
    });
    setSessionCookie(response, session);
    return response;
  } catch (error) {
    return fail(error);
  }
}
