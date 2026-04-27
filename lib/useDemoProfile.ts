"use client";

import { useEffect, useState } from "react";
import { DEFAULT_ROLE, DEMO_PROFILES, type AppRole } from "./demoProfiles";

const STORAGE_KEY = "jastip-agent-role";

function readRole(): AppRole {
  if (typeof window === "undefined") return DEFAULT_ROLE;
  const saved = window.localStorage.getItem(STORAGE_KEY) as AppRole | null;
  return saved && saved in DEMO_PROFILES ? saved : DEFAULT_ROLE;
}

export function useDemoProfile() {
  const [role, setRoleState] = useState<AppRole>(DEFAULT_ROLE);

  useEffect(() => {
    setRoleState(readRole());

    const onStorage = () => setRoleState(readRole());
    window.addEventListener("storage", onStorage);
    window.addEventListener("jastip-role-change", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("jastip-role-change", onStorage);
    };
  }, []);

  function setRole(nextRole: AppRole) {
    window.localStorage.setItem(STORAGE_KEY, nextRole);
    setRoleState(nextRole);
    window.dispatchEvent(new Event("jastip-role-change"));
  }

  return {
    role,
    profile: DEMO_PROFILES[role],
    setRole
  };
}
