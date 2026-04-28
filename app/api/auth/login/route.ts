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

    if (body.role === "ADMIN" && (process.env.NODE_ENV === "production" || process.env.ADMIN_INVITE_CODE)) {
      if (!process.env.ADMIN_INVITE_CODE) {
        throw new Error("ADMIN_INVITE_CODE is required for production admin login");
      }
      if (body.adminCode !== process.env.ADMIN_INVITE_CODE) {
        return Response.json({ error: "Invalid admin invite code" }, { status: 403 });
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
