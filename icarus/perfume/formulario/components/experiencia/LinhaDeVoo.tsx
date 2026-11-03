// Grafismo aprovado no Brand Book: um traço que sobe, dá uma volta e segue.
// Aurora sobre azul, 5 px, pontas arredondadas, um por peça. "slice" preserva o laço redondo em qualquer largura.

export default function LinhaDeVoo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 200"
      preserveAspectRatio="xMidYMax slice"
      className={`pointer-events-none absolute inset-x-0 bottom-0 w-full ${className}`}
      aria-hidden="true"
    >
      <path
        d="M -10 182 C 240 182, 360 160, 500 116 C 570 94, 628 84, 640 110 C 652 138, 600 154, 578 128 C 552 98, 668 64, 840 58 C 990 52, 1110 36, 1210 20"
        fill="none"
        stroke="#E7AE8E"
        strokeWidth="5"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
