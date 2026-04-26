import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jastip Agent",
  description: "AI-powered escrow and reputation layer for Indonesia's jastip economy."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2 font-bold text-ink">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-ocean text-white">
                <ShieldCheck size={19} />
              </span>
              Jastip Agent
            </Link>
            <nav className="hidden items-center gap-5 text-sm font-semibold text-muted md:flex">
              <Link href="/orders/new" className="hover:text-ocean">
                Buat Order
              </Link>
              <Link href="/marketplace" className="hover:text-ocean">
                Marketplace
              </Link>
              <Link href="/reputation" className="hover:text-ocean">
                Reputasi
              </Link>
              <Link href="/demo" className="hover:text-ocean">
                Demo Admin
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
