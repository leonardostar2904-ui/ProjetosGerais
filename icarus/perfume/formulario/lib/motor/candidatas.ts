import { materiasPrimas, type MateriaPrima } from "../conhecimento/materias-primas";
import type { SaidaRegras } from "./regras";
import type { Candidata, Candidatas } from "./tipos";

// Banco 04. Ordena as matérias-primas do catálogo pela direção calculada.
// Resultado: CANDIDATAS para o perfumista e para a futura IA. Não é fórmula, não tem proporção.

const POR_CAMADA = 6;
const FUNDO_PESADO = ["Âmbar", "Gourmand", "Gourmand balsâmica", "Gourmand cumarínica", "Balsâmica", "Resinosa (incenso)", "Resinosa balsâmica"];

function camadaPrincipal(m: MateriaPrima): Candidata["camada"] {
  const c = m.camadas[0];
  if (c === "Topo") return "topo";
  if (c === "Coração") return "coracao";
  return "fundo";
}

function sinais(m: MateriaPrima): string[] {
  const s: string[] = [];
  const f = m.flags;
  if (f.proibidaForma) s.push("Usar só a forma permitida");
  if (f.fototoxica === "confirmada") s.push("Fototóxica");
  if (f.fototoxica === "verificar") s.push("Fototóxica se prensada a frio");
  if (f.fototoxica === "pedir-laudo") s.push("Pedir laudo de furocumarinas");
  if (f.cites) s.push(f.cites === "confirmado" ? "CITES" : "CITES a verificar");
  if (f.nativaBR) s.push("Nativa BR · Lei 13.123");
  if (f.limiteUso) s.push("Limite IFRA ou de uso");
  if (f.custoAlto) s.push("Custo alto");
  if (f.disponibilidadeRara) s.push("Natural raro");
  if (f.praticamenteInviavel) s.push("Praticamente inviável");
  return s;
}

export function selecionarCandidatas(saida: SaidaRegras): Candidatas {
  const { direcao, bonusMaterias, exclusoes } = saida;
  const temDirecao = Object.values(direcao.pesos).some((v) => v > 0);
  // Materiais transversais (ex.: ambreta) só entram quando já existe alguma família com peso.
  const pesoGrupo = (g: MateriaPrima["grupo"] | null) =>
    !g ? 0 : g === "transversal" ? (temDirecao ? 0.5 : 0) : direcao.pesos[g as keyof typeof direcao.pesos] ?? 0;

  const excluidas: Candidatas["excluidas"] = [];
  const observacoes: string[] = [];
  const pontuadas: Candidata[] = [];

  for (const m of materiasPrimas) {
    if (m.flags.ehAcorde) continue; // #100 é acorde, não matéria-prima
    const motivoExclusao = exclusoes.get(m.n);
    if (motivoExclusao) {
      excluidas.push({ n: m.n, nome: m.nome, motivo: motivoExclusao });
      continue;
    }
    const motivos: string[] = [];
    let pts = 0;
    const pg = pesoGrupo(m.grupo);
    if (pg) { pts += pg * 3; motivos.push(`família ${m.grupo} (peso ${pg})`); }
    const pg2 = pesoGrupo(m.grupoSecundario);
    if (pg2) { pts += pg2 * 1.5; motivos.push(`família secundária ${m.grupoSecundario}`); }
    for (const b of bonusMaterias.get(m.n) ?? []) { pts += b.pontos; motivos.push(b.motivo); }
    if (pts <= 0) continue; // sem relação com a direção desta pessoa

    const fundo = m.camadas.includes("Fundo");
    if (fundo && direcao.ajustes.fundo) { pts += direcao.ajustes.fundo; motivos.push(`fixação +${direcao.ajustes.fundo}`); }
    if (fundo && direcao.ajustes.fundoPesadoCalor && FUNDO_PESADO.includes(m.familia)) {
      pts -= direcao.ajustes.fundoPesadoCalor; motivos.push("clima quente: fundo pesado −0,5");
    }
    if (direcao.ajustes.citricosSaida && m.familia.startsWith("Cítrica") && m.camadas.includes("Topo")) {
      pts -= direcao.ajustes.citricosSaida; motivos.push(`cítrico de saída −${direcao.ajustes.citricosSaida}`);
    }
    if (m.flags.praticamenteInviavel) { pts -= 5; motivos.push("praticamente inviável −5"); }
    if (m.flags.cites === "confirmado") { pts -= 1; motivos.push("CITES −1"); }
    if (m.flags.custoAlto) { pts -= 0.5; motivos.push("custo alto −0,5"); }
    if (m.flags.disponibilidadeRara) { pts -= 0.5; motivos.push("natural raro −0,5"); }
    if (pts <= 0) continue;

    pontuadas.push({ n: m.n, nome: m.nome, camada: camadaPrincipal(m), pontuacao: Math.round(pts * 10) / 10, motivos, sinais: sinais(m) });
  }

  const porCamada = (c: Candidata["camada"]) => {
    const lista = pontuadas.filter((x) => x.camada === c).sort((a, b) => b.pontuacao - a.pontuacao || a.n - b.n);
    const escolhidas: Candidata[] = [];
    for (const item of lista) {
      const dup = materiasPrimas.find((m) => m.n === item.n)?.flags.duplicidadeCom;
      if (dup && escolhidas.some((e) => e.n === dup)) {
        observacoes.push(`#${item.n} omitida: possível duplicidade com #${dup}.`);
        continue;
      }
      escolhidas.push(item);
      if (escolhidas.length === POR_CAMADA) break;
    }
    return escolhidas;
  };

  if (!pontuadas.length) observacoes.push("Sem direção suficiente para ordenar candidatas. Falta a #19 (famílias).");

  // Citadas pela pessoa: aparecem sempre, com o motivo, mesmo fora das 6 primeiras da camada.
  const citadas: Candidata[] = [];
  for (const [n, bonus] of bonusMaterias) {
    const m = materiasPrimas.find((x) => x.n === n);
    if (!m || m.flags.ehAcorde || exclusoes.has(n)) continue;
    const ranqueada = pontuadas.find((p) => p.n === n);
    citadas.push({
      n, nome: m.nome, camada: camadaPrincipal(m),
      pontuacao: ranqueada?.pontuacao ?? Math.round(bonus.reduce((a, b) => a + b.pontos, 0) * 10) / 10,
      motivos: bonus.map((b) => b.motivo),
      sinais: sinais(m),
    });
  }
  citadas.sort((a, b) => b.pontuacao - a.pontuacao || a.n - b.n);

  return { topo: porCamada("topo"), coracao: porCamada("coracao"), fundo: porCamada("fundo"), citadas, excluidas, observacoes };
}
