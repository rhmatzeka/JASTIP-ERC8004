"use client";

import { ShieldCheck, UserRound, UsersRound } from "lucide-react";
import { DEMO_PROFILES, type AppRole } from "@/lib/demoProfiles";
import { useDemoProfile } from "@/lib/useDemoProfile";

const roleIcons: Record<AppRole, typeof UserRound> = {
  BUYER: UserRound,
  JASTIPER: UsersRound,
  ADMIN: ShieldCheck
};

export default function RoleSwitcher() {
  const { role, profile, setRole } = useDemoProfile();
  const ActiveIcon = roleIcons[role];

  return (
    <div className="flex items-center gap-2 rounded-lg border border-line bg-cloud px-2 py-1">
      <div className="hidden items-center gap-2 px-2 text-xs font-bold text-ink sm:flex">
        <ActiveIcon size={15} className="text-ocean" />
        <span>{profile.name}</span>
      </div>
      <select
        aria-label="Current role"
        className="rounded-md border border-line bg-white px-2 py-1 text-xs font-bold text-ink outline-none focus:border-ocean"
        value={role}
        onChange={(event) => setRole(event.target.value as AppRole)}
      >
        {Object.values(DEMO_PROFILES).map((item) => (
          <option key={item.role} value={item.role}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}
