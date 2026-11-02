import type { Config } from "tailwindcss";

// Tokens do Brand Book ICARUS (Brand OS 1.0) + paleta definida para a experiência olfativa.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        azul: "#0D1B2A", // Azul profundo: títulos, texto principal, céu
        papel: "#EAE6DF", // Papel: superfície principal (chão)
        mar: "#8EB1C7", // Azul mar (Mar Icário): progresso, seleção, interação
        "mar-claro": "#E4EAEC", // Mar a 18% sobre branco quente: superfície selecionada
        aurora: "#E7AE8E", // Aurora: detalhes das etapas emocionais e sensoriais
        branco: "#F8F7F3", // Branco quente: cartões e campos
        grafite: "#242421", // Grafite: texto corrido
        "grafite-suave": "#4A4E55", // Grafite do brand book: texto secundário
        nevoa: "#DAD5CC", // Névoa: filetes e segmentos futuros
        brasa: "#B8391F", // Brasa: só mensagens de validação
      },
      fontFamily: {
        sans: ["var(--font-archivo)", "system-ui", "sans-serif"],
        serif: ["var(--font-instrument)", "Georgia", "serif"],
        mono: ["var(--font-plex)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        rotulo: "0.14em",
      },
      keyframes: {
        entrada: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        surgir: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        entrada: "entrada 420ms cubic-bezier(0.2, 0.7, 0.2, 1) both",
        surgir: "surgir 320ms ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
