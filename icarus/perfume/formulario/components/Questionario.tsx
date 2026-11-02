"use client";

import { useEffect, useState } from "react";
import { sections, type AnswerValue, type Answers, type Question } from "@/lib/questions";

const STORAGE_KEY = "icarus-perfume-questionario-v0";

function isAnswered(q: Question, v: AnswerValue | undefined): boolean {
  if (v === undefined) return false;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "string") return v.trim().length > 0;
  if (typeof v === "boolean") return v;
  return true;
}

const inputBase =
  "w-full rounded-lg border border-cinza/40 bg-marinho-claro px-4 py-3 text-prata placeholder:text-cinza/70 focus:border-prata";

function choiceClass(selected: boolean) {
  return `flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
    selected ? "border-prata bg-prata/10" : "border-cinza/40 hover:border-cinza"
  }`;
}

export default function Questionario() {
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved && typeof saved === "object") {
          setAnswers(saved.answers ?? {});
          setStep(Math.min(saved.step ?? 0, sections.length - 1));
        }
      }
    } catch {
      /* sem armazenamento local: o formulário funciona do mesmo jeito */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, step }));
    } catch {
      /* ignora */
    }
  }, [answers, step, hydrated]);

  const section = sections[step];
  const isLast = step === sections.length - 1;
  const missing = section.questions.filter((q) => q.required && !isAnswered(q, answers[q.id]));

  function set(id: string, value: AnswerValue) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function toggleMulti(q: Question & { type: "multi" }, value: string) {
    const current = (answers[q.id] as string[] | undefined) ?? [];
    if (current.includes(value)) {
      set(q.id, current.filter((v) => v !== value));
    } else if (!q.maxSelect || current.length < q.maxSelect) {
      set(q.id, [...current, value]);
    }
  }

  function goTo(next: number) {
    setStep(next);
    setShowErrors(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function onNext() {
    if (missing.length > 0) {
      setShowErrors(true);
      document.getElementById(`q-${missing[0].id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (isLast) {
      setDone(true);
      window.scrollTo({ top: 0 });
    } else {
      goTo(step + 1);
    }
  }

  function download() {
    const payload = { versao: "v0", criadoEm: new Date().toISOString(), respostas: answers };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "icarus-respostas.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function restart() {
    setAnswers({});
    setStep(0);
    setDone(false);
    setShowErrors(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignora */
    }
  }

  if (!hydrated) return null;

  if (done) {
    return (
      <section aria-live="polite">
        <h1 className="font-serif text-3xl">Respostas registradas</h1>
        <p className="mt-3 text-cinza">
          Obrigado, {String(answers.nome ?? "").trim() || "viajante"}. Esta é a versão de teste do questionário: suas respostas
          ficaram guardadas somente neste navegador e ainda não foram enviadas a nenhum servidor.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button onClick={download} className="rounded-lg bg-prata px-6 py-3 font-medium text-marinho">
            Baixar respostas (JSON)
          </button>
          <button onClick={restart} className="rounded-lg border border-cinza/50 px-6 py-3">
            Responder de novo
          </button>
        </div>
      </section>
    );
  }

  const pct = Math.round(((step + 1) / sections.length) * 100);

  return (
    <div>
      <div className="mb-6">
        <div className="mb-2 flex justify-between text-sm text-cinza">
          <span>
            Etapa {step + 1} de {sections.length}
          </span>
          <span>{pct}%</span>
        </div>
        <div
          className="h-1 w-full overflow-hidden rounded bg-cinza/25"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progresso do questionário"
        >
          <div className="h-full bg-prata transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <h1 className="font-serif text-3xl">{section.title}</h1>
      {section.intro && <p className="mt-2 text-cinza">{section.intro}</p>}

      <div className="mt-8 space-y-10">
        {section.questions.map((q) => {
          const value = answers[q.id];
          const error = showErrors && q.required && !isAnswered(q, value);
          return (
            <fieldset key={q.id} id={`q-${q.id}`} className="min-w-0">
              <legend className="mb-1 text-lg">
                {q.label}
                {q.required && q.type !== "consent" && <span className="ml-1 text-cinza" aria-hidden="true">*</span>}
              </legend>
              {q.type !== "consent" && q.help && <p className="mb-3 text-sm text-cinza">{q.help}</p>}

              {q.type === "text" && (
                <input
                  type="text"
                  className={inputBase}
                  value={(value as string) ?? ""}
                  placeholder={q.placeholder}
                  onChange={(e) => set(q.id, e.target.value)}
                  aria-label={q.label}
                />
              )}

              {q.type === "longtext" && (
                <textarea
                  rows={3}
                  className={inputBase}
                  value={(value as string) ?? ""}
                  placeholder={q.placeholder}
                  onChange={(e) => set(q.id, e.target.value)}
                  aria-label={q.label}
                />
              )}

              {q.type === "single" && (
                <div className="space-y-2">
                  {q.options.map((o) => (
                    <label key={o.value} className={choiceClass(value === o.value)}>
                      <input
                        type="radio"
                        name={q.id}
                        className="accent-prata"
                        checked={value === o.value}
                        onChange={() => set(q.id, o.value)}
                      />
                      <span>{o.label}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.type === "multi" && (
                <div className="space-y-2">
                  {q.options.map((o) => {
                    const list = (value as string[] | undefined) ?? [];
                    const checked = list.includes(o.value);
                    const blocked = !checked && !!q.maxSelect && list.length >= q.maxSelect;
                    return (
                      <label key={o.value} className={`${choiceClass(checked)} ${blocked ? "opacity-50" : ""}`}>
                        <input
                          type="checkbox"
                          className="accent-prata"
                          checked={checked}
                          disabled={blocked}
                          onChange={() => toggleMulti(q, o.value)}
                        />
                        <span>{o.label}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {q.type === "scale" && (
                <div>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <label
                        key={n}
                        className={`${choiceClass(value === n)} justify-center px-0`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          className="sr-only"
                          checked={value === n}
                          onChange={() => set(q.id, n)}
                        />
                        <span>{n}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-2 flex justify-between text-sm text-cinza">
                    <span>{q.min}</span>
                    <span className="text-right">{q.max}</span>
                  </div>
                </div>
              )}

              {q.type === "consent" && (
                <label className={choiceClass(value === true)}>
                  <input
                    type="checkbox"
                    className="accent-prata"
                    checked={value === true}
                    onChange={(e) => set(q.id, e.target.checked)}
                  />
                  <span className="text-sm">Li e concordo</span>
                </label>
              )}

              {error && (
                <p className="mt-2 text-sm text-prata" role="alert">
                  {q.type === "consent" ? "Para continuar, é preciso aceitar." : "Esta pergunta é obrigatória."}
                </p>
              )}
            </fieldset>
          );
        })}
      </div>

      <div className="mt-12 flex items-center justify-between gap-4">
        <button
          onClick={() => goTo(step - 1)}
          disabled={step === 0}
          className="rounded-lg border border-cinza/50 px-6 py-3 disabled:invisible"
        >
          Voltar
        </button>
        <button onClick={onNext} className="rounded-lg bg-prata px-8 py-3 font-medium text-marinho">
          {isLast ? "Finalizar" : "Continuar"}
        </button>
      </div>
    </div>
  );
}
