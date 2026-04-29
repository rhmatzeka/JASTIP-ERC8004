"use client";

import { useEffect, useState } from "react";
import { DEFAULT_ROLE, DEMO_PROFILES, type AppRole } from "./demoProfiles";
import { signWalletLogin } from "./walletClient";

const LEGACY_ROLE_KEY = "jastip-agent-role";
const SESSION_KEY = "jastip-agent-session";

type DemoSession = {
  userId?: string;
  role: AppRole;
  name: string;
  walletAddress: string;
};

type LoginOverrides = Partial<Omit<DemoSession, "role">> & {
  adminCode?: string;
  jastiperOnboardingAccepted?: boolean;
  message?: string;
  signature?: string;
};

function readSession(): DemoSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as DemoSession;
    if (!parsed.role || !(parsed.role in DEMO_PROFILES)) return null;
    const fallback = DEMO_PROFILES[parsed.role];
    return {
      userId: parsed.userId,
      role: parsed.role,
      name: parsed.name || fallback.name,
      walletAddress: parsed.walletAddress || fallback.walletAddress
    };
  } catch {
    return null;
  }
}

function writeSession(session: DemoSession) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.localStorage.setItem(LEGACY_ROLE_KEY, session.role);
  window.dispatchEvent(new Event("jastip-auth-change"));
  window.dispatchEvent(new Event("jastip-role-change"));
}

export function useDemoProfile() {
  const [session, setSession] = useState<DemoSession | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setSession(readSession());
    setIsReady(true);

    const onStorage = () => {
      setSession(readSession());
      setIsReady(true);
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("jastip-auth-change", onStorage);
    window.addEventListener("jastip-role-change", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("jastip-auth-change", onStorage);
      window.removeEventListener("jastip-role-change", onStorage);
    };
  }, []);

  async function login(nextRole: AppRole, overrides?: LoginOverrides) {
    const walletAddress = overrides?.walletAddress?.trim();
    if (!walletAddress) {
      throw new Error("Connect wallet dulu sebelum login.");
    }

    const signedLogin =
      overrides?.message && overrides.signature
        ? { message: overrides.message, signature: overrides.signature }
        : await signWalletLogin(walletAddress, nextRole);

    const requestBody = {
      role: nextRole,
      name: overrides?.name?.trim() || "Jastip User",
      walletAddress,
      message: signedLogin.message,
      signature: signedLogin.signature,
      adminCode: overrides?.adminCode,
      jastiperOnboardingAccepted: overrides?.jastiperOnboardingAccepted
    };

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }

    const nextSession: DemoSession = data.session || requestBody;
    writeSession(nextSession);
    setSession(nextSession);
    return nextSession;
  }

  function logout() {
    void fetch("/api/auth/logout", { method: "POST" });
    window.localStorage.removeItem(SESSION_KEY);
    window.localStorage.removeItem(LEGACY_ROLE_KEY);
    setSession(null);
    window.dispatchEvent(new Event("jastip-auth-change"));
    window.dispatchEvent(new Event("jastip-role-change"));
  }

  async function setRole(nextRole: AppRole) {
    if (nextRole === "ADMIN") {
      throw new Error("Admin access is invite-only. Login through the admin invite flow.");
    }

    const profile = DEMO_PROFILES[nextRole];
    return login(nextRole, {
      name: session?.role === nextRole ? session.name : profile.name,
      walletAddress: session?.walletAddress,
      jastiperOnboardingAccepted: nextRole === "JASTIPER" ? true : undefined
    });
  }

  const role = session?.role || DEFAULT_ROLE;
  const baseProfile = DEMO_PROFILES[role];
  const profile = {
    ...baseProfile,
    name: session?.name || baseProfile.name,
    walletAddress: session?.walletAddress || baseProfile.walletAddress
  };

  return {
    isReady,
    isLoggedIn: Boolean(session),
    role,
    profile,
    login,
    logout,
    setRole
  };
}
