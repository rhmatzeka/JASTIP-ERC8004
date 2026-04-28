"use client";

import Link from "next/link";
import { useDemoProfile } from "@/lib/useDemoProfile";

function dashboardHref(role: string) {
  if (role === "JASTIPER") return "/marketplace";
  if (role === "ADMIN") return "/demo";
  return "/orders/new";
}

export default function MainNav() {
  const { isLoggedIn, role } = useDemoProfile();

  return (
    <nav className="hidden items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.02] p-1 text-[13px] font-medium text-muted md:flex">
      <Link href="/" className="rounded-full px-4 py-2 transition-colors hover:bg-white/[0.06] hover:text-white">
        Beranda
      </Link>
      <Link href="/#cara-kerja" className="rounded-full px-4 py-2 transition-colors hover:bg-white/[0.06] hover:text-white">
        Cara Kerja
      </Link>
      <Link href="/reputation" className="rounded-full px-4 py-2 transition-colors hover:bg-white/[0.06] hover:text-white">
        Reputasi
      </Link>
      {isLoggedIn && (
        <Link href={dashboardHref(role)} className="rounded-full px-4 py-2 transition-colors hover:bg-accent/10 hover:text-accent">
          Dashboard
        </Link>
      )}
    </nav>
  );
}
