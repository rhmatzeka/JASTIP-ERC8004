import type { Metadata } from "next";
import Link from "next/link";
import MainNav from "@/components/MainNav";
import RoleSwitcher from "@/components/RoleSwitcher";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jastip Nexus",
  description: "AI-powered escrow and reputation layer for Indonesia's jastip economy."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#0c0c10]/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-white tracking-tight">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent text-white text-sm font-bold">
                JN
              </span>
              <span className="text-sm tracking-wide">Jastip Nexus</span>
            </Link>
            <MainNav />
            <RoleSwitcher />
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
