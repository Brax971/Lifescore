"use client";

import { useState } from "react";

// --- Configuration des questions par domaine ---

const DOMAINS = {
  finances: {
    label: "Finances",
    questions: [
      {
        key: "finances_overall",
        label: "Situation financière globale",
      },
      {
        key: "finances_budget",
        label: "Gestion du budget",
      },
      {
        key: "finances_debt",
        label: "Poids des dettes",
      },
    ],
  },
  work: {
    label: "Travail / activité",
    questions: [
      {
        key: "work_confidence",
        label: "Confiance dans ton travail / activité",
      },
      {
        key: "work_meaning",
        label: "Sens de ton activité",
      },
    ],
  },
  health: {
    label: "Santé / énergie",
    questions: [
      {
        key: "health_energy",
        label: "Niveau d'énergie global",
      },
      {
        key: "health_habits",
        label: "Qualité de ton hygiène de vie",
      },
    ],
  },
  organisation: {
    label: "Organisation / administratif",
    questions: [
      {
        key: "orga_daily",
        label: "Organisation de ton quotidien",
      },
      {
        key: "orga_admin",
        label: "Gestion de l'administratif",
      },
    ],
  },
  relations: {
    label: "Relations / entourage",
    questions: [
      {
        key: "relations_support",
        label: "Soutien ressenti de la part de ton entourage",
      },
      {
        key: "relations_quality",
        label: "Temps de qualité partagé avec les proches",
      },
    ],
  },
  mental: {
    label: "État mental / ressenti",
    questions: [
      {
        key: "mental_mood",
        label: "Humeur générale en ce moment",
      },
      {
        key: "mental_motivation",
        label: "Motivation pour avancer dans tes projets",
      },
    ],
  },
};

// Valeurs initiales des sliders (5/10 partout)
const INITIAL_ANSWERS = Object.values(DOMAINS).reduce((acc, domain) => {
  domain.questions.forEach((q) => {
    acc[q.key] = 5;
  });
  return acc;
}, {});

// --- Fonctions de calcul ---

function calculateScores(answers) {
  const domainScores = {};
  let domainSum = 0;
  let domainCount = 0;

  Object.entries(DOMAINS).forEach(([domainKey, domainConfig]) => {
    const values = domainConfig.questions.map((q) => answers[q.key] || 1);
    const avg10 = values.reduce((s, v) => s + v, 0) / values.length; // échelle 1–10
    const score100 = Math.round(avg10 * 10); // échelle 0–100
    domainScores[domainKey] = score100;
    domainSum += score100;
    domainCount += 1;
  });

  const globalScore =
    domainCount > 0 ? Math.round(domainSum / domainCount) : 0;

  const strengths = getStrengthDomains(domainScores);
  const priorities = getPriorityDomains(domainScores);
  const globalMessage = getGlobalMessage(globalScore);

  return {
    globalScore,
    domainScores,
    strengths,
    priorities,
    globalMessage,
  };
}

function getStrengthDomains(domainScores) {
  const entries = Object.entries(domainScores);
  if (!entries.length) return [];

  const maxScore = Math.max(...entries.map(([, v]) => v));
  // On considère "force" ≥ 70/100
  return entries
    .filter(([, v]) => v >= 70 && v >= maxScore - 5)
    .map(([k]) => DOMAINS[k].label);
}

function getPriorityDomains(domainScores) {
  const entries = Object.entries(domainScores);
  if (!entries.length) return [];

  const minScore = Math.min(...entries.map(([, v]) => v));
  // On considère "prioritaire" ≤ 50/100
  return entries
    .filter(([, v]) => v <= 50 && v <= minScore + 5)
    .map(([k]) => DOMAINS[k].label);
}

function getGlobalMessage(score) {
  if (score <= 30) {
    return "Ton LifeScore global est fragile : la période n’est pas simple, mais le fait de regarder ta situation en face est déjà un premier pas important.";
  }
  if (score <= 60) {
    return "Ton LifeScore global est intermédiaire : tout n’est pas simple, mais tu as déjà des bases solides sur lesquelles t’appuyer pour progresser.";
  }
  if (score <= 80) {
    return "Ton LifeScore global est solide : tu as déjà beaucoup de choses en place. L’objectif est maintenant d’affiner certains domaines pour te rapprocher de ton potentiel maximum.";
  }
  return "Ton LifeScore global est élevé : tu es dans une phase globalement favorable. Le but est de consolider cet équilibre et d’anticiper les zones qui pourraient se fragiliser.";
}

// --- Composants UI ---

function DomainSlider({ question, value, onChange }) {
  return (
    <div className="mb-5">
      <div className="flex items-baseline justify-between gap-3">
        <label className="font-medium text-slate-800">
          {question.label}
        </label>
        <span className="text-sm font-semibold text-sky-600">
          {value}/10
        </span>
      </div>

      <input
        type="range"
        min={1}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(question.key, Number(e.target.value))}
        className="w-full accent-sky-600"
      />

      <div className="mt-1 flex justify-between text-[11px] text-slate-400">
        <span>1</span>
        <span>5</span>
        <span>10</span>
      </div>
    </div>
  );
}

function DomainBar({ label, value }) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between text-sm font-medium text-slate-800">
        <span>{label}</span>
        <span className="tabular-nums text-slate-900">{value}/100</span>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-sky-500 via-emerald-500 to-fuchsia-500 transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

// --- Page principale ---

export default function HomePage() {
  const [answers, setAnswers] = useState(INITIAL_ANSWERS);
  const [results, setResults] = useState(null);
  const [showAbout, setShowAbout] = useState(false);

  function handleChange(key, value) {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const computed = calculateScores(answers);
    setResults(computed);

    // Remonte en haut sur mobile pour voir le score
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleReset() {
    setAnswers(INITIAL_ANSWERS);
    setResults(null);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        {/* HERO + éventuellement logo dans le layout, ici juste le contenu */}
        <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                Calcule ton LifeScore en 2 minutes.
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                Ce questionnaire a été conçu pour t&apos;aider à prendre du
                recul sur ta situation. En quelques questions, tu obtiens un{" "}
                <span className="font-semibold text-slate-900">
                  score global
                </span>{" "}
                et des{" "}
                <span className="font-semibold text-slate-900">
                  scores par domaine
                </span>{" "}
                (finances, travail, santé, relations, etc.).
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Répond{" "}
                <span className="font-semibold text-slate-900">
                  honnêtement
                </span>
                , sans te juger. Il n&apos;existe pas de « bonne » réponse :
                l&apos;important, c&apos;est ce que{" "}
                <span className="font-semibold text-slate-900">toi</span> tu
                ressens aujourd&apos;hui.
              </p>
              <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                Échelle utilisée :{" "}
                <span className="font-bold text-slate-900">
                  1 = très faible, 10 = excellent.
                </span>
              </p>
            </div>

            {results && (
              <div className="flex flex-col items-center justify-center">
                <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-tr from-sky-500 via-emerald-500 to-fuchsia-500 p-[3px] shadow-md">
                  <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white">
                    <span className="text-3xl font-black text-slate-900 tabular-nums">
                      {results.globalScore}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      /100
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-center text-xs font-medium uppercase tracking-wide text-slate-500">
                  Ton LifeScore global
                </p>
              </div>
            )}
          </div>
        </section>

        {/* FORMULAIRE */}
        <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {Object.entries(DOMAINS).map(([domainKey, domain]) => (
              <div key={domainKey} className="border-t border-slate-100 pt-6 first:border-0 first:pt-0">
                <h2 className="text-lg font-bold text-slate-900">
                  {domain.label}
                </h2>
                <p className="mb-4 mt-1 text-xs text-slate-500">
                  1 = très mauvaise, 10 = excellente.
                </p>
                {domain.questions.map((q) => (
                  <DomainSlider
                    key={q.key}
                    question={q}
                    value={answers[q.key]}
                    onChange={handleChange}
                  />
                ))}
              </div>
            ))}

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 via-emerald-500 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-white"
              >
                Calculer mon LifeScore
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Réinitialiser les réponses
              </button>
              <button
                type="button"
                onClick={() => setShowAbout((v) => !v)}
                className="ml-auto inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50"
              >
                {showAbout ? "Masquer l'explication" : "Comment lire les résultats ?"}
              </button>
            </div>
          </form>
        </section>

        {/* RÉSULTATS */}
        {results && (
          <section className="space-y-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Comment lire tes résultats ?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {results.globalMessage}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Scores par domaine
              </h3>
              <div className="mt-4">
                {Object.entries(results.domainScores).map(
                  ([domainKey, value]) => (
                    <DomainBar
                      key={domainKey}
                      label={DOMAINS[domainKey].label}
                      value={value}
                    />
                  )
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <h4 className="text-sm font-semibold text-slate-900">
                  Tes forces actuelles
                </h4>
                {results.strengths.length === 0 ? (
                  <p className="mt-2 text-sm text-slate-600">
                    Aucun domaine ne ressort particulièrement fort pour le
                    moment, mais c&apos;est justement l&apos;occasion de
                    construire des bases solides.
                  </p>
                ) : (
                  <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
                    {results.strengths.map((label) => (
                      <li key={label}>{label}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <h4 className="text-sm font-semibold text-slate-900">
                  Axes prioritaires
                </h4>
                {results.priorities.length === 0 ? (
                  <p className="mt-2 text-sm text-slate-600">
                    Aucun domaine n&apos;est identifié comme critique. Tu peux
                    choisir un domaine qui compte le plus pour toi et chercher à
                    l&apos;améliorer progressivement.
                  </p>
                ) : (
                  <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
                    {results.priorities.map((label) => (
                      <li key={label}>{label}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {showAbout && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-4 text-sm text-slate-600">
                <p>
                  Ce bilan est une{" "}
                  <span className="font-semibold">
                    photographie de ta situation actuelle
                  </span>
                  , pas un verdict définitif. Tu peux refaire le questionnaire
                  régulièrement (par exemple une fois par mois) pour suivre
                  l&apos;évolution de ton LifeScore et voir concrètement les
                  progrès réalisés.
                </p>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}