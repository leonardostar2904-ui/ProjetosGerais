import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Três vozes da marca, empacotadas no projeto (OFL). Ver app/fonts/LICENCAS.md.
const archivo = localFont({
  src: "./fonts/archivo-variavel.woff2",
  variable: "--font-archivo",
  weight: "100 900",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
});

const instrument = localFont({
  src: [
    { path: "./fonts/instrument-serif-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/instrument-serif-400-italico.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-instrument",
  display: "swap",
});

const plex = localFont({
  src: [
    { path: "./fonts/ibm-plex-mono-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ibm-plex-mono-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-plex",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ICARUS · Olfactory Experience",
  description: "Conte a sua história. Ela é o ponto de partida de uma fragrância criada só para você.",
};

export const viewport: Viewport = {
  themeColor: "#EAE6DF",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${instrument.variable} ${plex.variable}`}>
      <body className="min-h-screen bg-papel font-sans text-grafite antialiased">{children}</body>
    </html>
  );
}
