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
    href: "/demo",
    cta: "Masuk sebagai Admin",
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
        return (
          <article
            key={profile.role}
            className={`panel p-6 flex flex-col justify-between group ${active ? "border-accent/30 bg-accent/[0.04]" : ""}`}
          >
            <div>
              <div className="mb-5 flex items-start justify-between gap-3">
                <span className={`grid h-11 w-11 place-items-center rounded-xl transition-colors ${
                  active
                    ? "bg-accent/15 text-accent"
                    : "bg-white/[0.04] text-muted group-hover:text-white"
                }`}>
                  <Icon size={20} />
                </span>
                {active ? (
                  <span className="rounded-full bg-success/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-success">
                    Active
                  </span>
                ) : null}
              </div>
              <h3 className="text-base font-semibold text-white">{profile.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{profile.description}</p>
            </div>
            <Link
              href={isLoggedIn ? meta.href : `/login?role=${profile.role}`}
              className={`${active ? "btn-primary" : "btn-secondary"} mt-5 w-full text-sm`}
              onClick={() => {
                if (isLoggedIn) void setRole(profile.role);
              }}
            >
              {isLoggedIn ? meta.cta : `Login sebagai ${profile.label}`}
              <ArrowRight size={15} className="ml-1" />
            </Link>
          </article>
        );
      })}
    </div>
  );
}
