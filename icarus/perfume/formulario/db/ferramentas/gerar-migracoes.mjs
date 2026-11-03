// Copia db/schema.sql e db/seed.sql para supabase/migrations, no formato da CLI do Supabase.
// Rodar na pasta do formulário depois de mudar o schema ou gerar o seed de novo:
//   node db/ferramentas/gerar-migracoes.mjs
// As migrações tiram o "begin;" e o "commit;": o Supabase já roda cada migração numa transação.
// Mudança em tabela que já existe em produção pede uma migração NOVA (alter table), não reescrever estas.
import { readFileSync, writeFileSync } from "node:fs";

const alvos = [
  ["db/schema.sql", "supabase/migrations/20261103120000_esquema_inicial.sql"],
  ["db/seed.sql", "supabase/migrations/20261103120100_dados_de_referencia.sql"],
];
for (const [origem, destino] of alvos) {
  const sql = readFileSync(origem, "utf8")
    .split("\n")
    .filter((l) => l.trim() !== "begin;" && l.trim() !== "commit;")
    .join("\n");
  writeFileSync(destino, `-- GERADO de ${origem} por db/ferramentas/gerar-migracoes.mjs. Não editar à mão.\n${sql}`);
  console.log(`${origem} -> ${destino}`);
}
