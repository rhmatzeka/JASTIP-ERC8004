"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import clsx from "clsx";
import MainNav from "@/components/MainNav";
import RoleSwitcher from "@/components/RoleSwitcher";

export default function SiteHeader() {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    function updateHeader() {
      setIsCompact(window.scrollY > 80);
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  return (
    <header className="sticky top-4 z-50 px-4">
      <div
        className={clsx(
          "mx-auto flex items-center justify-between gap-4 rounded-full border border-white/[0.04] bg-[#050505]/80 backdrop-blur-2xl transition-all duration-500 ease-out sm:px-4",
          isCompact ? "max-w-3xl px-3 py-2" : "max-w-5xl px-4 py-2.5"
        )}
        style={{ boxShadow: '0 4px 40px rgba(0,0,0,0.6)' }}
      >
        <Link
          href="/"
          className={clsx(
            "flex items-center rounded-full tracking-tight text-white transition-all duration-300",
            isCompact ? "gap-0 py-1 pr-0" : "gap-2.5 py-1 pr-2"
          )}
        >
          <span
            className={clsx(
              "grid shrink-0 place-items-center rounded-full bg-[#d4ff00]/10 font-bold text-[#d4ff00] transition-all duration-300",
              isCompact ? "h-7 w-7 text-[10px]" : "h-8 w-8 text-xs"
            )}
          >
            JN
          </span>
          <span
            className={clsx(
              "hidden overflow-hidden whitespace-nowrap text-[13px] font-semibold transition-all duration-300 sm:inline",
              isCompact ? "ml-0 max-w-0 opacity-0" : "ml-0 max-w-32 opacity-100"
            )}
          >
            Jastip Nexus
          </span>
        </Link>
        <MainNav compact={isCompact} />
        <RoleSwitcher compact={isCompact} />
      </div>
    </header>
  );
}
