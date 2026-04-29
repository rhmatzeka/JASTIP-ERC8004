"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { LoaderCircle } from "lucide-react";

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

export default function NavigationLoading() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const startedAtRef = useRef(0);

  useEffect(() => {
    function clearTimer() {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    function startLoading() {
      clearTimer();
      startedAtRef.current = Date.now();
      setIsLoading(true);
      timeoutRef.current = window.setTimeout(() => setIsLoading(false), 7000);
    }

    function handleClick(event: MouseEvent) {
      if (isModifiedClick(event)) return;

      const target = event.target instanceof Element ? event.target.closest("a") : null;
      if (!(target instanceof HTMLAnchorElement)) return;
      if (target.target && target.target !== "_self") return;
      if (target.hasAttribute("download")) return;

      const nextUrl = new URL(target.href, window.location.href);
      const currentUrl = new URL(window.location.href);
      if (nextUrl.origin !== currentUrl.origin) return;
      if (nextUrl.pathname === currentUrl.pathname && nextUrl.search === currentUrl.search) return;

      startLoading();
    }

    function handlePageShow() {
      setIsLoading(false);
    }

    document.addEventListener("click", handleClick);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      clearTimer();
      document.removeEventListener("click", handleClick);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  useEffect(() => {
    if (!isLoading) return;

    const elapsed = Date.now() - startedAtRef.current;
    const remaining = Math.max(180 - elapsed, 0);
    const timer = window.setTimeout(() => setIsLoading(false), remaining);
    return () => window.clearTimeout(timer);
  }, [pathname, isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/75 backdrop-blur-md">
      <div className="flex items-center gap-3 rounded-full border border-white/[0.06] bg-[#050505] px-5 py-3 text-[13px] font-semibold text-white" style={{ boxShadow: '0 4px 40px rgba(0,0,0,0.6)' }}>
        <LoaderCircle className="animate-spin text-[#d4ff00]" size={16} />
        Loading page
      </div>
    </div>
  );
}
