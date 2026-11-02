import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ICARUS | Questionário",
  description: "Conte sobre você para criarmos um perfume só seu.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-marinho text-prata antialiased">{children}</body>
    </html>
  );
}
