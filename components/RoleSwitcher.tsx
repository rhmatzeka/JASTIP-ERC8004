"use client";

import Link from "next/link";
import { LogOut, ShieldCheck, UserRound, UsersRound } from "lucide-react";
import { DEMO_PROFILES, type AppRole } from "@/lib/demoProfiles";
import { useDemoProfile } from "@/lib/useDemoProfile";

const roleIcons: Record<AppRole, typeof UserRound> = {
  BUYER: UserRound,
  JASTIPER: UsersRound,
  ADMIN: ShieldCheck
};

export default function RoleSwitcher() {
  const { isLoggedIn, role, profile, logout, setRole } = useDemoProfile();
  const ActiveIcon = roleIcons[role];

  if (!isLoggedIn) {
    return (
      <Link href="/login" className="btn-primary shrink-0">
        Login
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-line bg-white px-2 py-1 shadow-sm">
      <div className="hidden min-w-0 items-center gap-2 px-2 text-xs font-bold text-ink sm:flex">
        <ActiveIcon size={15} className="shrink-0 text-ocean" />
        <span className="truncate">{profile.name}</span>
      </div>
      <select
        aria-label="Current account role"
        className="rounded-md border border-line bg-cloud px-2 py-1 text-xs font-bold text-ink outline-none focus:border-ocean"
        value={role}
        onChange={(event) => void setRole(event.target.value as AppRole)}
      >
        {Object.values(DEMO_PROFILES).map((item) => (
          <option key={item.role} value={item.role}>
            {item.label}
          </option>
        ))}
      </select>
      <button type="button" className="grid h-8 w-8 place-items-center rounded-md text-muted hover:bg-cloud hover:text-rose-600" onClick={logout}>
        <LogOut size={15} />
      </button>
    </div>
  );
}
