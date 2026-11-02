import type { Metadata } from "next";
import Bastidores from "@/components/bastidores/Bastidores";

export const metadata: Metadata = {
  title: "ICARUS · Bastidores do cruzamento",
  robots: { index: false, follow: false },
};

export default function PaginaBastidores() {
  return <Bastidores />;
}
