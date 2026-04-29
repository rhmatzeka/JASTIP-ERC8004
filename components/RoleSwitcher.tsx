"use client";

import Link from "next/link";
import { ArrowUpRight, FlaskConical, LogOut, ShieldCheck, UserRound, UsersRound } from "lucide-react";
import clsx from "clsx";
import type { AppRole } from "@/lib/demoProfiles";
import { useDemoProfile } from "@/lib/useDemoProfile";

const roleIcons: Record<AppRole, typeof UserRound> = {
  BUYER: UserRound,
  JASTIPER: UsersRound,
  ADMIN: ShieldCheck
};

function dashboardHref(role: AppRole) {
  if (role === "JASTIPER") return "/marketplace";
  if (role === "ADMIN") return "/demo";
  return "/orders/new";
}

export default function RoleSwitcher({ compact = false }: { compact?: boolean }) {
  const { isLoggedIn, role, profile, logout } = useDemoProfile();
  const ActiveIcon = roleIcons[role];

  if (!isLoggedIn) {
    return (
      <div className={clsx("flex shrink-0 items-center transition-all duration-300", compact ? "gap-1.5" : "gap-2")}>
        <Link
          href="/demo"
          aria-label="Buka demo"
          title="Demo"
          className={clsx(
            "grid place-items-center rounded-full border border-white/[0.06] bg-white/[0.02] text-[#888] transition-all duration-300 hover:border-white/[0.12] hover:text-white",
            compact ? "h-8 w-8" : "h-9 w-9"
          )}
        >
          <FlaskConical size={compact ? 14 : 15} strokeWidth={1.5} />
        </Link>
        <Link
          href="/login"
          aria-label="Masuk aplikasi"
          title="Masuk"
          className={clsx(
            "grid place-items-center rounded-full bg-[#d4ff00] text-black transition-all duration-300 hover:bg-[#e0ff40] hover:shadow-[0_0_15px_rgba(212,255,0,0.2)]",
            compact ? "h-8 w-8" : "h-9 w-9"
          )}
        >
          <ArrowUpRight size={compact ? 14 : 16} strokeWidth={2} />
        </Link>
      </div>
    );
  }

  return (
    <div className={clsx("flex shrink-0 items-center transition-all duration-300", compact ? "gap-1.5" : "gap-2")}>
      <div className="hidden items-center gap-1.5 rounded-full border border-white/[0.04] bg-white/[0.02] px-1.5 py-1 transition-colors sm:flex">
        <div
          className={clsx(
            "hidden min-w-0 items-center gap-2 px-3 text-[12px] font-medium text-white transition-all duration-300 lg:flex",
            compact && "max-w-0 overflow-hidden border-r-0 px-0 pr-0 opacity-0"
          )}
        >
          <ActiveIcon size={13} className="shrink-0 text-[#d4ff00]" strokeWidth={1.5} />
          <span className="truncate max-w-[120px]">{profile.name}</span>
        </div>
        <span className="rounded-full px-2.5 py-1.5 text-[11px] font-medium text-[#888]">{profile.label}</span>
      </div>
      <Link
        href={dashboardHref(role)}
        aria-label="Buka dashboard"
        title="Dashboard"
        className={clsx(
          "grid place-items-center rounded-full bg-[#d4ff00] text-black transition-all duration-300 hover:bg-[#e0ff40] hover:shadow-[0_0_15px_rgba(212,255,0,0.2)]",
          compact ? "h-8 w-8" : "h-9 w-9"
        )}
      >
        <ArrowUpRight size={compact ? 14 : 16} strokeWidth={2} />
      </Link>
      <button
        type="button"
        aria-label="Logout"
        title="Logout"
        className={clsx(
          "grid place-items-center rounded-full border border-white/[0.06] bg-white/[0.02] text-[#888] transition-all duration-300 hover:border-[#ff4444]/30 hover:text-[#ff4444]",
          compact ? "h-8 w-8" : "h-9 w-9"
        )}
        onClick={logout}
      >
        <LogOut size={compact ? 13 : 15} strokeWidth={1.5} />
      </button>
    </div>
  );
}
