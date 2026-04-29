"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, UserRound, UsersRound } from "lucide-react";
import { DEMO_PROFILES, type AppRole } from "@/lib/demoProfiles";
import { useDemoProfile } from "@/lib/useDemoProfile";

const roleMeta: Record<AppRole, { href: string; cta: string; Icon: typeof UserRound }> = {
  BUYER: {
    href: "/orders/new",
    cta: "Masuk sebagai Customer",
    Icon: UserRound
  },
  JASTIPER: {
    href: "/marketplace",
    cta: "Masuk sebagai Jastiper",
    Icon: UsersRound
  },
  ADMIN: {
    href: "/login?role=ADMIN",
    cta: "Admin invite",
    Icon: ShieldCheck
  }
};

export default function RoleEntryCards() {
  const { isLoggedIn, role, setRole } = useDemoProfile();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Object.values(DEMO_PROFILES).map((profile) => {
        const meta = roleMeta[profile.role];
        const Icon = meta.Icon;
        const active = role === profile.role;
        const href =
          profile.role === "ADMIN"
            ? "/login?role=ADMIN"
            : isLoggedIn && active
              ? meta.href
              : `/login?role=${profile.role}`;
        return (
          <article
            key={profile.role}
            className={`panel p-7 flex flex-col justify-between group ${active ? "border-[#d4ff00]/15" : ""}`}
          >
            <div>
              <div className="mb-6 flex items-start justify-between gap-3">
                <span className={`grid h-11 w-11 place-items-center rounded-xl transition-colors ${
                  active
                    ? "bg-[#d4ff00]/10 text-[#d4ff00]"
                    : "bg-white/[0.03] text-[#888] group-hover:text-white group-hover:bg-white/[0.05]"
                }`}>
                  <Icon size={20} strokeWidth={1.5} />
                </span>
                {active ? (
                  <span className="rounded-full bg-[#d4ff00]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#d4ff00]">
                    Active
                  </span>
                ) : null}
              </div>
              <h3 className="text-[15px] font-semibold text-white mb-2">{profile.name}</h3>
              <p className="text-[13px] leading-[1.6] text-[#777]">{profile.description}</p>
            </div>
            <Link
              href={href}
              className={`${active ? "btn-primary" : "btn-secondary"} mt-6 w-full text-[13px]`}
              onClick={() => {
                if (isLoggedIn && profile.role === "BUYER" && !active) void setRole(profile.role);
              }}
            >
              {profile.role === "ADMIN" ? "Masuk via invite" : active ? meta.cta : `Login sebagai ${profile.label}`}
              <ArrowRight size={14} className="ml-1" />
            </Link>
          </article>
        );
      })}
    </div>
  );
}
