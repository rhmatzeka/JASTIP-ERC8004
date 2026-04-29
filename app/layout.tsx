import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import NavigationLoading from "@/components/NavigationLoading";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jastip Nexus",
  description: "AI-powered escrow and reputation layer for Indonesia's jastip economy."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${instrumentSerif.variable} font-sans`}>
        <SiteHeader />
        <NavigationLoading />
        {children}
      </body>
    </html>
  );
}
