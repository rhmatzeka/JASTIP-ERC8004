"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { LoaderCircle } from "lucide-react";

export default function SplineHeroBackground() {
  const [isVisible, setIsVisible] = useState(true);
  const [isSceneReady, setIsSceneReady] = useState(false);

  useEffect(() => {
    let frame = 0;

    function updateVisibility() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const hideAfter = window.innerHeight * 0.82;
        setIsVisible(window.scrollY < hideAfter);
      });
    }

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  return (
    <>
      <div
        className={clsx(
          "fixed inset-0 z-0 transition-opacity duration-200",
          isVisible ? "visible opacity-100" : "invisible opacity-0"
        )}
        aria-hidden={!isVisible}
      >
        <iframe
          src="https://my.spline.design/prismcoin-iso1JivQVPIwFiJ9BQtLQK7Q/"
          title="Jastip Nexus 3D coin background"
          frameBorder="0"
          width="100%"
          height="100%"
          className="h-[128%] w-[118%] -translate-x-[9%] -translate-y-[16%] scale-[1.02]"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          onLoad={() => {
            window.setTimeout(() => setIsSceneReady(true), 650);
          }}
        />
      </div>
      {/* Bottom gradient fade to black */}
      <div
        className={clsx(
          "pointer-events-none fixed inset-0 z-[1] transition-opacity duration-200",
          isVisible ? "visible opacity-100" : "invisible opacity-0"
        )}
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.08) 38%, rgba(0,0,0,0.75) 74%, rgba(0,0,0,0.98) 100%)'
        }}
      />
      {/* Top gradient fade */}
      <div
        className={clsx(
          "pointer-events-none fixed inset-x-0 top-0 z-[1] h-28 bg-gradient-to-b from-black/70 to-transparent transition-opacity duration-200",
          isVisible ? "visible opacity-100" : "invisible opacity-0"
        )}
      />
      {/* Cover spline watermark */}
      <div
        className={clsx(
          "pointer-events-none fixed bottom-4 right-4 z-[2] h-12 w-52 rounded-2xl bg-black transition-opacity duration-200",
          isVisible ? "visible opacity-100" : "invisible opacity-0"
        )}
      />
      {/* Loading overlay */}
      <div
        className={clsx(
          "fixed inset-0 z-20 grid place-items-center bg-black/85 backdrop-blur-md transition-opacity duration-300",
          isVisible && !isSceneReady ? "visible opacity-100" : "invisible opacity-0"
        )}
      >
        <div className="flex items-center gap-3 rounded-full border border-white/[0.06] bg-[#050505] px-5 py-3 text-[13px] font-semibold text-white" style={{ boxShadow: '0 4px 40px rgba(0,0,0,0.6)' }}>
          <LoaderCircle className="animate-spin text-[#d4ff00]" size={16} />
          Loading 3D scene
        </div>
      </div>
    </>
  );
}
