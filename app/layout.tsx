import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cha de Panela | Joao e Mary",
  description: "Confirme sua presenca e reserve um presente para o cha de panela.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
