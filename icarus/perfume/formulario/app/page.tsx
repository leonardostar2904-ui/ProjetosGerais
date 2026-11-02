import Questionario from "@/components/Questionario";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 pb-24 pt-8 sm:px-6">
      <header className="mb-8 border-b border-cinza/30 pb-6">
        <p className="font-serif text-2xl tracking-[0.35em]">ICARUS</p>
        <p className="mt-1 text-sm text-cinza">Voe mais alto. Sem cair.</p>
      </header>
      <Questionario />
    </main>
  );
}
