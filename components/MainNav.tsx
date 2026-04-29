"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useDemoProfile } from "@/lib/useDemoProfile";

function dashboardHref(role: string) {
  if (role === "JASTIPER") return "/marketplace";
  if (role === "ADMIN") return "/demo";
  return "/orders/new";
}

export default function MainNav({ compact = false }: { compact?: boolean }) {
  const { isLoggedIn, role } = useDemoProfile();
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Beranda", active: pathname === "/" },
    { href: "/#cara-kerja", label: "Cara Kerja", active: false },
    { href: "/marketplace", label: "Marketplace", active: pathname.startsWith("/marketplace") },
    { href: "/reputation", label: "Reputasi", active: pathname.startsWith("/reputation") },
    ...(isLoggedIn ? [{ href: dashboardHref(role), label: "Dashboard", active: pathname === dashboardHref(role) }] : [])
  ];

  return (
    <nav className="hidden items-center justify-center gap-0.5 rounded-full border border-white/[0.04] bg-white/[0.02] p-1 text-[12px] font-medium text-[#888] md:flex">
      {links.map((link) => (
        <Link
          key={`${link.href}-${link.label}`}
          href={link.href}
          className={clsx(
            "rounded-full transition-all duration-300 hover:text-white",
            compact ? "px-3 py-1.5 text-[11px]" : "px-4 py-2",
            link.active && "bg-white/[0.06] text-white"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
