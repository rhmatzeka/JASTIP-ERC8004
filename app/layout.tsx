import type { Metadata } from "next";
import Link from "next/link";
import { PackageCheck } from "lucide-react";
import RoleSwitcher from "@/components/RoleSwitcher";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jastip Agent",
  description: "AI-powered escrow and reputation layer for Indonesia's jastip economy."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-30 border-b border-line bg-white/92 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <Link href="/" className="flex min-w-0 items-center gap-3 font-black text-ink">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-ink text-white shadow-button">
                <PackageCheck size={20} />
              </span>
              <span className="truncate">Jastip Agent</span>
            </Link>
            <nav className="hidden items-center rounded-lg border border-line bg-cloud/80 p-1 text-sm font-bold text-muted md:flex">
              <Link href="/" className="rounded-md px-3 py-2 hover:bg-white hover:text-ocean">
                Beranda
              </Link>
              <Link href="/#cara-kerja" className="rounded-md px-3 py-2 hover:bg-white hover:text-ocean">
                Cara Kerja
              </Link>
              <Link href="/reputation" className="rounded-md px-3 py-2 hover:bg-white hover:text-ocean">
                Reputasi
              </Link>
              <Link href="/login" className="rounded-md px-3 py-2 hover:bg-white hover:text-ocean">
                Login
              </Link>
            </nav>
            <RoleSwitcher />
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
