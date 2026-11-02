// Gera db/seed.sql a partir dos arquivos TypeScript do projeto (fonte única).
// Uso, na pasta do projeto (icarus/perfume/formulario): npx tsx db/ferramentas/gerar-seed.mts
// Nada é digitado à mão: perguntas, opções, matérias-primas, grupos, concentrações,
// modalidades, lacunas e o texto de consentimento vêm dos módulos; os catálogos de
// traços e regras saem da execução do próprio motor.

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

import { fileURLToPath } from "node:url";

// Raiz do projeto, calculada a partir deste arquivo (db/ferramentas/ fica dois níveis abaixo).
const RAIZ = fileURLToPath(new URL("../../", import.meta.url)).replace(/\/$/, "");
const SAIDA = `${RAIZ}/db/seed.sql`;

const { perguntas, VERSAO_QUESTIONARIO } = await import(`${RAIZ}/lib/questionario/perguntas.ts`);
const { capitulos, MINUTOS_ESTIMADOS } = await import(`${RAIZ}/lib/questionario/capitulos.ts`);
const { validarEstrutura } = await import(`${RAIZ}/lib/questionario/progresso.ts`);
const { materiasPrimas, VERSAO_CATALOGO } = await import(`${RAIZ}/lib/conhecimento/materias-primas.ts`);
const { GRUPOS, CONCENTRACOES, MODALIDADES, LACUNAS_NATURAIS } = await import(`${RAIZ}/lib/conhecimento/referencias.ts`);
const { VERSAO_MOTOR, VERSAO_REGRAS } = await import(`${RAIZ}/lib/motor/tipos.ts`);
const { calcularTracos } = await import(`${RAIZ}/lib/motor/tracos.ts`);
const { aplicarRegras } = await import(`${RAIZ}/lib/motor/regras.ts`);
const { bancoVazio, iniciarSessao, concluirSessao } = await import(`${RAIZ}/lib/armazenamento.ts`);

const FONTES = [
  "lib/questionario/perguntas.ts",
  "lib/questionario/capitulos.ts",
  "lib/conhecimento/materias-primas.ts",
  "lib/conhecimento/referencias.ts",
  "lib/motor/tipos.ts",
  "lib/motor/tracos.ts",
  "lib/motor/regras.ts",
  "lib/armazenamento.ts",
];

// ── Utilitários de SQL ─────────────────────────────────────────────────────────

function falhar(msg: string): never {
  throw new Error(`gerar-seed: ${msg}`);
}

function texto(v: string): string {
  if (v.includes("\u0000")) falhar(`texto com caractere nulo: ${v.slice(0, 40)}`);
  return `'${v.replace(/'/g, "''")}'`;
}

function lit(v: unknown): string {
  if (v === null || v === undefined) return "null";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number") {
    if (!Number.isFinite(v)) falhar(`número inválido: ${v}`);
    return String(v);
  }
  if (typeof v === "string") return texto(v);
  return falhar(`tipo sem conversão: ${typeof v}`);
}

const arrTexto = (xs: readonly string[]) => (xs.length ? `array[${xs.map(texto).join(", ")}]::text[]` : "'{}'::text[]");
const json = (v: unknown) => (v === null || v === undefined ? "null" : `${texto(JSON.stringify(v))}::jsonb`);

type Atualizar = string[] | "nada";

function upsert(tabela: string, colunas: string[], linhas: string[][], conflito: string[], atualizar: Atualizar): string {
  for (const l of linhas) if (l.length !== colunas.length) falhar(`${tabela}: linha com ${l.length} valores para ${colunas.length} colunas`);
  const valores = linhas.map((l) => `  (${l.join(", ")})`).join(",\n");
  const acao =
    atualizar === "nada"
      ? "do nothing"
      : "do update set\n  " + atualizar.map((c) => (c.includes("=") ? c : `${c} = excluded.${c}`)).join(",\n  ");
  return `insert into ${tabela} (${colunas.join(", ")}) values\n${valores}\non conflict (${conflito.join(", ")}) ${acao};\n`;
}

const exceto = (colunas: string[], chave: string[]) => colunas.filter((c) => !chave.includes(c));

// ── Conferências da fonte ──────────────────────────────────────────────────────

const errosEstrutura = validarEstrutura();
if (errosEstrutura.length) falhar(`validarEstrutura(): ${errosEstrutura.join("; ")}`);

const ns = materiasPrimas.map((m: any) => m.n);
if (ns.join(",") !== Array.from({ length: materiasPrimas.length }, (_, i) => i + 1).join(","))
  falhar("matérias-primas fora da sequência 1..N");

const q19 = perguntas.find((p: any) => p.id === "q19");
const codigosQ19 = (q19?.opcoes ?? []).map((o: any) => o.valor).sort().join(",");
if (codigosQ19 !== Object.keys(GRUPOS).sort().join(",")) falhar("opções da q19 diferentes de GRUPOS");

for (const p of perguntas) {
  const codigos = (p.opcoes ?? []).map((o: any) => o.valor);
  if (new Set(codigos).size !== codigos.length) falhar(`${p.id}: código de opção repetido`);
}

// ── Questionário ───────────────────────────────────────────────────────────────

const V = VERSAO_QUESTIONARIO as string;
const totalOpcoes = perguntas.reduce((a: number, p: any) => a + (p.opcoes?.length ?? 0), 0);

const colCap = ["questionario_versao", "numero", "id", "nome", "titulo", "titulo_italico", "descricao", "arte", "acento", "grupos"];
const linhasCap = capitulos.map((c: any) => [
  lit(V), lit(c.numero), lit(c.id), lit(c.nome), lit(c.titulo), lit(c.tituloItalico), lit(c.descricao),
  lit(c.arte), lit(c.acento), json(c.grupos ?? null),
]);

const colPerg = ["questionario_versao", "id", "numero", "capitulo", "enunciado", "ajuda", "tipo", "obrigatoria", "sensivel",
  "destino", "condicao", "max_selecoes", "escala_min", "escala_max", "placeholder", "variante", "grupo", "pilar"];
const linhasPerg = [...perguntas].sort((a: any, b: any) => a.numero - b.numero).map((p: any) => [
  lit(V), lit(p.id), lit(p.numero), lit(p.capitulo), lit(p.enunciado), lit(p.ajuda), lit(p.tipo), lit(p.obrigatoria),
  lit(p.sensivel), lit(p.destino), json(p.condicao ?? null), lit(p.maxSelecoes), lit(p.escala?.min), lit(p.escala?.max),
  lit(p.placeholder), lit(p.variante), lit(p.grupo), lit(p.pilar),
]);

const colOp = ["questionario_versao", "pergunta_id", "valor", "ordem", "rotulo", "descricao", "exclusiva", "imagem", "imagem_alt"];
const linhasOp = perguntas.flatMap((p: any) =>
  (p.opcoes ?? []).map((o: any, i: number) => [
    lit(V), lit(p.id), lit(o.valor), lit(i + 1), lit(o.rotulo), lit(o.descricao), lit(o.exclusiva ?? false),
    lit(o.imagem), lit(o.imagemAlt),
  ]),
);

// ── Banco 02: traços (do motor, com respostas sintéticas completas) ───────────

const cheia: Record<string, unknown> = {};
for (const p of perguntas) {
  if (p.tipo === "escala") cheia[p.id] = 3;
  else if (p.tipo === "escolha-unica") cheia[p.id] = p.opcoes[0].valor;
  else if (p.tipo === "escolha-multipla") cheia[p.id] = [p.opcoes[0].valor];
  else if (p.tipo === "tres-palavras") cheia[p.id] = ["a", "b", "c"];
  else cheia[p.id] = "texto";
}
const tracos = calcularTracos(cheia);
if (!tracos.length) falhar("motor não devolveu traços");
const colTr = ["codigo", "nome", "tipo", "metodo", "perguntas_origem", "depende_ia", "versao_motor"];
const linhasTr = tracos.map((t: any) => [
  lit(t.codigo), lit(t.nome), lit(t.tipo), lit(t.metodo), arrTexto(t.origens.map((o: any) => o.perguntaId)),
  lit(t.status !== "calculado"), lit(VERSAO_MOTOR),
]);

// ── Banco 02: regras (cenários que disparam todas as regras) ──────────────────

const cenarios: Record<string, unknown>[] = [
  {
    q19: ["quentes", "doces"], q24: "verao", q23: ["praia"], q25: ["cafe", "vinho"], q21: "cheiro de baunilha", q20: "canela",
    q28: 5, q29: 5, q27: "dia-todo", q06: ["quente-umido"], q35: "seca", q37: "somem", q36: "quase-nunca",
    q38: "quase-sempre", q39: "quase-todo-dia", q40: 5, q33: "dor-cabeca", q34: ["alcool", "sinteticos"], q31: "sim",
    q41: "sim", q42: "hormonal", q26: ["treino", "noite"], q04: "feminino", q05: "mulher",
  },
  { q06: ["frio"], q34: ["origem-animal"], q33: "incomoda-pouco", q38: "as-vezes", q28: 2, q29: 2, q24: "inverno", q25: ["gin", "cha"] },
  { q34: ["testados-animais"], q31: "nao-sei", q42: "as-duas", q28: 4, q29: 2, q25: ["champagne"], q26: ["encontros", "trabalho", "eventos"] },
];
const disparos = new Map<string, any[]>();
for (const r of cenarios) for (const x of aplicarRegras(r).regras) disparos.set(x.codigo, [...(disparos.get(x.codigo) ?? []), x]);

const fonteRegras = readFileSync(`${RAIZ}/lib/motor/regras.ts`, "utf8");
const cabecalhos = new Map<string, string>();
for (const m of fonteRegras.matchAll(/^\s*\/\/ (R\d{2})(?: a (R\d{2}))? · (.+)$/gm)) {
  const ini = Number(m[1].slice(1));
  const fim = m[2] ? Number(m[2].slice(1)) : ini;
  for (let i = ini; i <= fim; i++) cabecalhos.set(`R${String(i).padStart(2, "0")}`, m[3].trim());
}
const codigosCab = [...cabecalhos.keys()].sort().join(",");
const codigosDisp = [...disparos.keys()].sort().join(",");
if (codigosCab !== codigosDisp)
  falhar(`regras no código-fonte (${codigosCab}) diferentes das disparadas pelos cenários (${codigosDisp}); ajuste os cenários`);

const unicos = <T>(xs: T[]) => [...new Set(xs)];
const regras = [...disparos.keys()].sort().map((codigo) => {
  const xs = disparos.get(codigo)!;
  const tipos = unicos(xs.map((x) => x.tipo));
  const evid = unicos(xs.map((x) => x.evidencia));
  if (tipos.length !== 1 || evid.length !== 1) falhar(`${codigo}: tipo ou evidência variam entre cenários`);
  return {
    codigo, nome: unicos(xs.map((x) => x.nome)).join(" / "), descricao: cabecalhos.get(codigo)!,
    tipo: tipos[0], evidencia: evid[0], origens: unicos(xs.flatMap((x) => x.origens)) as string[],
  };
});
const colRg = ["codigo", "versao", "nome", "descricao", "tipo", "evidencia", "perguntas_origem"];
const linhasRg = regras.map((r) => [
  lit(r.codigo), lit(VERSAO_REGRAS), lit(r.nome), lit(r.descricao), lit(r.tipo), lit(r.evidencia), arrTexto(r.origens),
]);

// ── Banco 03 ───────────────────────────────────────────────────────────────────

const gruposQ19 = Object.entries(GRUPOS as Record<string, { nome: string; exemplos: string }>);
const outrosGrupos = unicos(materiasPrimas.flatMap((m: any) => [m.grupo, m.grupoSecundario]).filter(Boolean) as string[])
  .filter((g) => !(g in GRUPOS))
  .sort();
const colGr = ["codigo", "nome", "exemplos", "ordem", "na_pergunta_19"];
const linhasGr = [
  ...gruposQ19.map(([codigo, g], i) => [lit(codigo), lit(g.nome), lit(g.exemplos), lit(i + 1), "true"]),
  ...outrosGrupos.map((codigo, i) => [
    lit(codigo), lit(codigo[0].toUpperCase() + codigo.slice(1)),
    lit(materiasPrimas.filter((m: any) => m.grupo === codigo || m.grupoSecundario === codigo).map((m: any) => m.nome).join(", ")),
    lit(gruposQ19.length + i + 1), "false",
  ]),
];
const todosGrupos = new Set([...Object.keys(GRUPOS), ...outrosGrupos]);

function faixa(txt: string): [number, number] {
  const m = txt.match(/^(\d+(?:[.,]\d+)?)% a (\d+(?:[.,]\d+)?)%$/);
  if (!m) falhar(`faixa de concentrado sem formato "X% a Y%": ${txt}`);
  return [Number(m[1].replace(",", ".")), Number(m[2].replace(",", "."))];
}
const colCo = ["codigo", "nome", "concentrado", "concentrado_min_pct", "concentrado_max_pct", "duracao", "comportamento", "ordem"];
const linhasCo = Object.entries(CONCENTRACOES as Record<string, any>).map(([codigo, c], i) => {
  const [min, max] = faixa(c.concentrado);
  return [lit(codigo), lit(c.nome), lit(c.concentrado), lit(min), lit(max), lit(c.duracao), lit(c.comportamento), lit(i + 1)];
});

const colLa = ["codigo", "texto"];
const linhasLa = Object.entries(LACUNAS_NATURAIS as Record<string, string>).map(([codigo, t]) => [lit(codigo), lit(t)]);

// ── Banco 04 ───────────────────────────────────────────────────────────────────

const colMp = ["n", "nome", "camada_manual", "camadas", "familia", "grupo", "grupo_secundario", "descricao_manual", "alertas",
  "pagina", "proibida_forma", "fototoxica", "cites", "nativa_br", "custo_alto", "disponibilidade_rara", "limite_uso",
  "praticamente_inviavel", "eh_acorde", "duplicidade_com", "sintetica", "versao_catalogo"];
const linhasMp = materiasPrimas.map((m: any) => {
  if (!todosGrupos.has(m.grupo) || (m.grupoSecundario && !todosGrupos.has(m.grupoSecundario))) falhar(`#${m.n}: grupo desconhecido`);
  const d = m.flags.duplicidadeCom ?? null;
  if (d !== null && !ns.includes(d)) falhar(`#${m.n}: duplicidadeCom aponta para #${d}, que não existe`);
  return [
    lit(m.n), lit(m.nome), lit(m.camadaManual), arrTexto(m.camadas), lit(m.familia), lit(m.grupo), lit(m.grupoSecundario),
    lit(m.descricaoManual), arrTexto(m.alertas), lit(m.pagina), lit(m.flags.proibidaForma), lit(m.flags.fototoxica),
    lit(m.flags.cites), lit(m.flags.nativaBR), lit(m.flags.custoAlto), lit(m.flags.disponibilidadeRara), lit(m.flags.limiteUso),
    lit(m.flags.praticamenteInviavel), lit(m.flags.ehAcorde), lit(d), "false", lit(VERSAO_CATALOGO),
  ];
});

// ── Banco 06 ───────────────────────────────────────────────────────────────────

const colMo = ["codigo", "nome", "preco", "moeda", "condicao", "status_preco", "ordem"];
const linhasMo = (MODALIDADES as readonly any[]).map((m, i) => [
  lit(m.codigo), lit(m.nome), lit(m.preco), lit("BRL"), lit(m.condicao), lit("a_confirmar"), lit(i + 1),
]);

// ── Banco 08: texto de consentimento (saído do fluxo real do app) ─────────────

let banco = iniciarSessao(bancoVazio());
banco = concluirSessao(banco, banco.sessaoAtualId!);
const consentimento = banco.consentimentos[0];
if (!consentimento) falhar("concluirSessao não gerou consentimento");
const linhasTc = [[lit(consentimento.tipo), lit(consentimento.versaoTexto), lit(consentimento.texto)]];

// ── Montagem do arquivo ────────────────────────────────────────────────────────

const hashes = FONTES.map((f) => `--   ${createHash("sha256").update(readFileSync(`${RAIZ}/${f}`)).digest("hex").slice(0, 16)}  ${f}`);

const contagens = {
  capitulos: capitulos.length, perguntas: perguntas.length, opcoes: totalOpcoes, tracos: tracos.length, regras: regras.length,
  grupos: linhasGr.length, concentracoes: linhasCo.length, lacunas: linhasLa.length, materias: materiasPrimas.length,
  modalidades: linhasMo.length,
};

const partes: string[] = [];
partes.push(`-- =============================================================================
-- ICARUS · Vertical de perfume · Dados iniciais (seed)
--
-- GERADO a partir dos arquivos TypeScript do projeto. Não editar à mão: mudanças
-- vão para os arquivos .ts e o seed é gerado de novo. Rodar depois de schema.sql.
-- Idempotente: pode rodar de novo; atualiza os catálogos e nunca apaga linhas.
--
-- Versões: questionário ${V} · catálogo ${VERSAO_CATALOGO} · motor ${VERSAO_MOTOR} · regras ${VERSAO_REGRAS}
--
-- SHA-256 (16 primeiros dígitos) dos arquivos-fonte usados. Se algum arquivo
-- mudou e o hash não bate, este seed está desatualizado:
${hashes.join("\n")}
--
-- Conteúdo: ${contagens.capitulos} capítulos, ${contagens.perguntas} perguntas, ${contagens.opcoes} opções,
-- ${contagens.tracos} traços, ${contagens.regras} regras, ${contagens.grupos} grupos olfativos (${gruposQ19.length} da pergunta 19 + ${outrosGrupos.length} transversal),
-- ${contagens.concentracoes} concentrações, ${contagens.lacunas} lacunas naturais, ${contagens.materias} matérias-primas, ${contagens.modalidades} modalidades
-- e 1 texto de consentimento.
-- =============================================================================

begin;

set local standard_conforming_strings = on;
`);

partes.push(`-- Banco 01 · Questionário ${V}. A versão do TS passa a ser a ativa.
update questionarios set status = 'arquivado' where status = 'ativo' and versao <> ${lit(V)};
${upsert("questionarios", ["versao", "total_capitulos", "total_perguntas", "minutos_estimados", "status"],
  [[lit(V), lit(capitulos.length), lit(perguntas.length), lit(MINUTOS_ESTIMADOS), lit("ativo")]],
  ["versao"], ["total_capitulos", "total_perguntas", "minutos_estimados", "status"])}`);
partes.push(`-- Banco 01 · Capítulos (capitulos.ts)\n${upsert("capitulos", colCap, linhasCap, ["questionario_versao", "numero"], exceto(colCap, ["questionario_versao", "numero"]))}`);
partes.push(`-- Banco 01 · Perguntas (perguntas.ts)\n${upsert("perguntas", colPerg, linhasPerg, ["questionario_versao", "id"], exceto(colPerg, ["questionario_versao", "id"]))}`);
partes.push(`-- Banco 01 · Opções, com o código estável em "valor" (perguntas.ts)\n${upsert("opcoes", colOp, linhasOp, ["questionario_versao", "pergunta_id", "valor"], exceto(colOp, ["questionario_versao", "pergunta_id", "valor"]))}`);
partes.push(`-- Banco 02 · Traços P001 a P012 (lib/motor/tracos.ts, ${VERSAO_MOTOR})\n${upsert("tracos", colTr, linhasTr, ["codigo"], exceto(colTr, ["codigo"]))}`);
partes.push(`-- Banco 02 · Regras de tradução (lib/motor/regras.ts, ${VERSAO_REGRAS})\n${upsert("regras_traducao", colRg, linhasRg, ["codigo", "versao"], exceto(colRg, ["codigo", "versao"]))}`);
partes.push(`-- Banco 03 · Grupos olfativos (GRUPOS em referencias.ts; "transversal" vem do catálogo)\n${upsert("grupos_olfativos", colGr, linhasGr, ["codigo"], exceto(colGr, ["codigo"]))}`);
partes.push(`-- Banco 03 · Concentrações (CONCENTRACOES em referencias.ts)\n${upsert("concentracoes", colCo, linhasCo, ["codigo"], exceto(colCo, ["codigo"]))}`);
partes.push(`-- Banco 03 · Lacunas naturais (LACUNAS_NATURAIS em referencias.ts)\n${upsert("lacunas_naturais", colLa, linhasLa, ["codigo"], ["texto"])}`);
partes.push(`-- Banco 04 · Matérias-primas (materias-primas.ts). Não toca nas colunas preenchidas
-- pelo perfumista (volatilidade, persistência, papel no acorde, ativa).
${upsert("materias_primas", colMp, linhasMp, ["n"], exceto(colMp, ["n"]))}`);
partes.push(`-- Banco 06 · Modalidades (MODALIDADES em referencias.ts). Preço a confirmar; um preço
-- já confirmado no banco não é sobrescrito.
${upsert("modalidades", colMo, linhasMo, ["codigo"], [
  "nome", "condicao", "ordem", "moeda",
  "preco = case when modalidades.status_preco = 'a_confirmar' then excluded.preco else modalidades.preco end",
])}`);
partes.push(`-- Banco 08 · Texto de consentimento (TEXTO_CONSENTIMENTO em armazenamento.ts). Só inclusão.
${upsert("textos_consentimento", ["tipo", "versao", "texto"], linhasTc, ["tipo", "versao"], "nada")}`);

partes.push(`-- Conferência: a transação inteira é desfeita se alguma contagem não bater.
-- Questionário, traços, regras e matérias-primas desta versão: contagem exata (uma
-- opção a mais no banco do que no TS indica código renomeado ou removido, o que
-- pede versão nova do questionário). Catálogos abertos: no mínimo o que veio do TS.
do $$
declare
  exatos constant jsonb := ${texto(JSON.stringify({
    capitulos: contagens.capitulos, perguntas: contagens.perguntas, opcoes: contagens.opcoes, tracos: contagens.tracos,
    regras: contagens.regras, materias: contagens.materias,
  }))}::jsonb;
  minimos constant jsonb := ${texto(JSON.stringify({
    grupos: contagens.grupos, concentracoes: contagens.concentracoes, lacunas: contagens.lacunas, modalidades: contagens.modalidades,
  }))}::jsonb;
  achado jsonb;
  item record;
begin
  select jsonb_build_object(
    'capitulos', (select count(*) from capitulos where questionario_versao = ${lit(V)}),
    'perguntas', (select count(*) from perguntas where questionario_versao = ${lit(V)}),
    'opcoes', (select count(*) from opcoes where questionario_versao = ${lit(V)}),
    'tracos', (select count(*) from tracos where versao_motor = ${lit(VERSAO_MOTOR)}),
    'regras', (select count(*) from regras_traducao where versao = ${lit(VERSAO_REGRAS)}),
    'materias', (select count(*) from materias_primas where versao_catalogo = ${lit(VERSAO_CATALOGO)}),
    'grupos', (select count(*) from grupos_olfativos),
    'concentracoes', (select count(*) from concentracoes),
    'lacunas', (select count(*) from lacunas_naturais),
    'modalidades', (select count(*) from modalidades)
  ) into achado;
  for item in select key, value from jsonb_each(exatos) loop
    if (achado ->> item.key)::int <> item.value::text::int then
      raise exception 'Seed: % tem % linhas, esperado exatamente %', item.key, achado ->> item.key, item.value;
    end if;
  end loop;
  for item in select key, value from jsonb_each(minimos) loop
    if (achado ->> item.key)::int < item.value::text::int then
      raise exception 'Seed: % tem % linhas, esperado no mínimo %', item.key, achado ->> item.key, item.value;
    end if;
  end loop;
end
$$;

commit;
`);

writeFileSync(SAIDA, partes.join("\n"));
console.log(`seed.sql gerado (${readFileSync(SAIDA).length} bytes)`, contagens);
