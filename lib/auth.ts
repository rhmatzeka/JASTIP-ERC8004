import { createHmac, timingSafeEqual } from "crypto";
import type { NextRequest, NextResponse } from "next/server";
import { ApiError } from "./api";
import type { AppRole } from "./demoProfiles";

export const AUTH_COOKIE = "jastip_session";

export type AuthSession = {
  userId: string;
  role: AppRole;
  name: string;
  walletAddress: string;
};

function authSecret() {
  return process.env.AUTH_SECRET || "dev-only-change-this-secret";
}

function sign(payload: string) {
  return createHmac("sha256", authSecret()).update(payload).digest("base64url");
}

export function sealSession(session: AuthSession) {
  const payload = Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function unsealSession(value?: string | null): AuthSession | null {
  if (!value) return null;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as AuthSession;
    if (!parsed.userId || !parsed.role || !parsed.walletAddress) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setSessionCookie(response: NextResponse, session: AuthSession) {
  response.cookies.set(AUTH_COOKIE, sealSession(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(AUTH_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
}

export function getAuthSession(request: NextRequest) {
  return unsealSession(request.cookies.get(AUTH_COOKIE)?.value);
}

export function requireSession(request: NextRequest, roles?: AppRole[]) {
  const session = getAuthSession(request);
  if (!session) throw new ApiError(401, "Login required");
  if (roles && !roles.includes(session.role)) throw new ApiError(403, "Role is not allowed");
  return session;
}

export function requireMatchingWallet(session: AuthSession, walletAddress?: string, label = "wallet") {
  if (!walletAddress || walletAddress.toLowerCase() !== session.walletAddress.toLowerCase()) {
    throw new ApiError(403, `${label} does not match logged-in account`);
  }
}
