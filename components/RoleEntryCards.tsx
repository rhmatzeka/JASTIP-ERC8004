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
            className={`panel p-5 transition hover:-translate-y-1 hover:shadow-button ${active ? "border-ocean ring-2 ring-ocean/15" : ""}`}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-ink text-white">
                <Icon size={20} />
              </span>
              {active ? (
                <span className="rounded-full border border-emerald-200 bg-mint/10 px-3 py-1 text-xs font-black text-emerald-700">
                  Active
                </span>
              ) : null}
            </div>
            <h3 className="text-lg font-black text-ink">{profile.name}</h3>
            <p className="mt-2 min-h-12 text-sm leading-6 text-muted">{profile.description}</p>
            <Link
              href={isLoggedIn ? meta.href : `/login?role=${profile.role}`}
              className="btn-primary mt-5 w-full"
              onClick={() => {
                if (isLoggedIn) void setRole(profile.role);
              }}
            >
              {isLoggedIn ? meta.cta : `Login sebagai ${profile.label}`}
              <ArrowRight size={16} />
            </Link>
          </article>
        );
      })}
    </div>
  );
}
