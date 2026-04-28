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
      <Link href="/login" className="btn-primary shrink-0 px-5 text-sm">
        Login
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] px-1.5 py-1 transition-colors">
      <div className="hidden min-w-0 items-center gap-2 border-r border-white/[0.06] px-3 pr-3 text-sm font-medium text-white sm:flex">
        <ActiveIcon size={14} className="shrink-0 text-accent" />
        <span className="truncate max-w-[120px]">{profile.name}</span>
      </div>
      <select
        aria-label="Current account role"
        className="rounded-full border-none bg-transparent px-2.5 py-1.5 text-xs font-medium text-muted outline-none cursor-pointer hover:text-white transition-colors appearance-none"
        value={role}
        onChange={(event) => void setRole(event.target.value as AppRole)}
      >
        {Object.values(DEMO_PROFILES).map((item) => (
          <option key={item.role} value={item.role} className="bg-[#141419] text-white">
            {item.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        className="grid h-7 w-7 place-items-center rounded-full text-muted transition-colors hover:bg-danger/10 hover:text-danger"
        onClick={logout}
      >
        <LogOut size={14} />
      </button>
    </div>
  );
}
