import type { Metadata } from "next";
import { Allura, Cormorant_Garamond, Inter_Tight } from "next/font/google";
import "./globals.css";

const allura = Allura({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-allura",
  display: "swap"
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap"
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Cha de Panela | Joao e Mary",
  description: "Confirme sua presenca e reserve um presente para o cha de panela.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${allura.variable} ${cormorant.variable} ${interTight.variable}`}>{children}</body>
    </html>
  );
}
