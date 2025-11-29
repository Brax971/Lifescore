"use client";

import { useState } from "react";

const QUESTIONS = [
  // Finances
  {
    id: "finances_global",
    domainKey: "finances",
    domainLabel: "Finances",
    label: "Situation financière globale",
  },
  {
    id: "finances_budget",
    domainKey: "finances",
    domainLabel: "Finances",
    label: "Gestion du budget",
  },
  {
    id: "finances_dettes",
    domainKey: "finances",
    domainLabel: "Finances",
    label: "Poids des dettes",
  },

  // Travail / activité
  {
    id: "travail_confiance",
    domainKey: "travail",
    domainLabel: "Travail / activité",
    label: "Confiance dans ton travail / activité",
  },
  {
    id: "travail_sens",
    domainKey: "travail",
    domainLabel: "Travail / activité",
    label: "Sens de ton activité",
  },

  // Santé / énergie
  {
    id: "sante_energie",
    domainKey: "sante",
    domainLabel: "Santé / énergie",
    label: "Niveau d'énergie global",
  },
  {
    id: "sante_hygiene",
    domainKey: "sante",
    domainLabel: "Santé / énergie",
    label: "Qualité de ton hygiène de vie",
  },

  // Organisation / administratif
  {
    id: "orga_quotidien",
    domainKey: "organisation",
    domainLabel: "Organisation / administratif",
    label: "Organisation de ton quotidien",
  },
  {
    id: "orga_admin",
    domainKey: "organisation",
    domainLabel: "Organisation / administratif",
    label: "Gestion de l'administratif",
  },

  // Relations / entourage
  {
    id: "relations_soutien",
    domainKey: "relations",
    domainLabel: "Relations / entourage",
    label: "Soutien ressenti de la part de ton entourage",
  },
  {
    id: "relations_temps",
    domainKey: "relations",
    domainLabel: "Relations / entourage",
    label: "Temps de qualité partagé avec les proches",
  },

  // État mental / ressenti
  {
    id: "mental_humeur",
    domainKey: "mental",
    domainLabel: "État mental / ressenti",
    label: "Humeur générale en ce moment",
  },
  {
    id: "mental_motivation",
    domainKey: "mental",
    domainLabel: "État mental / ressenti",
    label: "Motivation pour avancer dans tes projets",
  },
];

const DOMAINS_ORDER = [
  "finances",
  "travail",
  "sante",
  "organisation",
  "relations",
  "mental",
];

const DOMAIN_LABELS = {
  finances: "Finances",
  travail: "Travail / activité",
  sante: "Santé / énergie",
  organisation: "Organisation / administratif",
  relations: "Relations / entourage",
  mental: "État mental / ressenti",
};

function getGlobalMessage(score) {
  if (score <= 40) {
    return {
      title: "Ton LifeScore global est fragile.",
      text: "Plusieurs domaines tirent ton niveau de vie vers le bas. L'idée n'est pas de tout révolutionner d'un coup, mais d'identifier 1 ou 2 axes prioritaires pour reprendre la main doucement.",
    };
  }
  if (score <= 70) {
    return {
      title: "Ton LifeScore global est intermédiaire.",
      text: "Tout n'est pas simple, mais tu as déjà des bases solides. Le but n'est pas d'atteindre 100/100, mais de repérer ce qui mérite un coup de pouce pour améliorer concrètement ton quotidien.",
    };
  }
  return {
    title: "Ton LifeScore global est élevé.",
    text: "Globalement, ta vie est bien alignée sur ce que tu souhaites. Tu peux utiliser ce score pour repérer les zones à consolider et éviter que certains domaines ne se dégradent avec le temps.",
  };
}

export default function HomePage() {
  // réponses du questionnaire
  const initialAnswers = {};
  QUESTIONS.forEach((q) => {
    initialAnswers[q.id] = 5;
  });

  const [answers, setAnswers] = useState(initialAnswers);

  // résultats calculés
  const [hasResults, setHasResults] = useState(false);
  const [globalScore, setGlobalScore] = useState(0);
  const [domainScores, setDomainScores] = useState({});

  const handleChange = (id, value) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: Number(value),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // score global (moyenne de toutes les réponses * 10)
    const allValues = Object.values(answers);
    const avg =
      allValues.reduce((sum, v) => sum + v, 0) / allValues.length || 0;
    const global = Math.round(avg * 10);

    // scores par domaine
    const domainBuckets = {};
    QUESTIONS.forEach((q) => {
      if (!domainBuckets[q.domainKey]) {
        domainBuckets[q.domainKey] = [];
      }
      domainBuckets[q.domainKey].push(answers[q.id]);
    });

    const perDomain = {};
    Object.keys(domainBuckets).forEach((key) => {
      const list = domainBuckets[key];
      const dAvg = list.reduce((s, v) => s + v, 0) / list.length || 0;
      perDomain[key] = Math.round(dAvg * 10);
    });

    setGlobalScore(global);
    setDomainScores(perDomain);
    setHasResults(true);

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const globalMessage = getGlobalMessage(globalScore);

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <div className="max-w-4xl mx-auto px-4 pt-8 sm:pt-12">
        {/* FORMULAIRE */}
        {!hasResults && (
          <section className="bg-white rounded-3xl shadow-lg p-6 sm:p-10 mb-10">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-4">
              Calcule ton LifeScore en 2 minutes.
            </h1>
            <p className="text-slate-600 mb-3">
              Ce questionnaire a été conçu pour t&apos;aider à prendre du recul
              sur ta situation. En quelques questions, tu obtiens un{" "}
              <span className="font-semibold">score global</span> et des{" "}
              <span className="font-semibold">scores par domaine</span>{" "}
              (finances, travail, santé, relations, etc.).
            </p>
            <p className="text-slate-600 mb-3">
              Répond <span className="font-semibold">honnêtement</span>, sans te
              juger. Il n&apos;existe pas de « bonne » réponse&nbsp;: l&apos;important,
              c&apos;est ce que toi tu ressens aujourd&apos;hui.
            </p>
            <p className="text-slate-600 mb-6">
              Échelle utilisée&nbsp;:{" "}
              <span className="font-semibold">
                1 = très faible, 10 = excellent.
              </span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-10">
              {DOMAINS_ORDER.map((domainKey) => {
                const domainQuestions = QUESTIONS.filter(
                  (q) => q.domainKey === domainKey
                );
                return (
                  <div key={domainKey}>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-1">
                      {DOMAIN_LABELS[domainKey]}
                    </h2>
                    <p className="text-slate-600 text-sm mb-4">
                      1 = très mauvaise, 10 = excellente.
                    </p>

                    <div className="space-y-5">
                      {domainQuestions.map((q) => (
                        <div key={q.id}>
                          <label className="block text-sm sm:text-base font-medium text-slate-800 mb-1.5">
                            {q.label}
                            <span className="font-semibold">
                              {" "}
                              {answers[q.id]}/10
                            </span>
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="range"
                              min={1}
                              max={10}
                              step={1}
                              value={answers[q.id]}
                              onChange={(e) =>
                                handleChange(q.id, e.target.value)
                              }
                              className="flex-1 accent-blue-600"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              <div className="pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-colors w-full sm:w-auto"
                >
                  Calculer mon LifeScore
                </button>
              </div>
            </form>
          </section>
        )}

        {/* RÉSULTATS */}
        {hasResults && (
          <section className="bg-white rounded-3xl shadow-lg p-6 sm:p-10 space-y-8">
            {/* Score global */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="relative w-28 h-28">
                  {/* cercle de fond */}
                  <svg
                    viewBox="0 0 120 120"
                    className="w-28 h-28 transform -rotate-90"
                  >
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      className="stroke-slate-200"
                      strokeWidth="10"
                      fill="none"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      className="stroke-blue-600"
                      strokeWidth="10"
                      fill="none"
                      strokeDasharray={2 * Math.PI * 52}
                      strokeDashoffset={
                        ((100 - globalScore) / 100) * (2 * Math.PI * 52)
                      }
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-3xl font-extrabold text-slate-900">
                      {globalScore}
                    </div>
                    <div className="text-xs text-slate-500">/100</div>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-1">
                    Ton LifeScore global
                  </h2>
                  <p className="text-slate-600 text-sm sm:text-base">
                    Ce score est la moyenne de l&apos;ensemble de tes réponses,
                    ramenée sur 100. Ce n&apos;est pas une note absolue, mais une{" "}
                    <span className="font-semibold">
                      photographie de ta situation actuelle.
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Comment lire tes résultats */}
            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Comment lire tes résultats ?
              </h3>
              <p className="text-slate-700 font-semibold">
                {globalMessage.title}
              </p>
              <p className="text-slate-600">{globalMessage.text}</p>
              <p className="text-slate-600">
                Utilise ce score comme un{" "}
                <span className="font-semibold">point de départ</span> : tu peux
                refaire le questionnaire régulièrement pour suivre l&apos;évolution
                de ton LifeScore au fil des semaines ou des mois.
              </p>
            </div>

            {/* Scores par domaine sous forme de barres */}
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Scores par domaine
              </h3>
              <div className="space-y-3">
                {DOMAINS_ORDER.map((key) => (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center justify-between text-sm sm:text-base">
                      <span className="font-medium text-slate-800">
                        {DOMAIN_LABELS[key]}
                      </span>
                      <span className="font-semibold text-slate-900">
                        {domainScores[key] ?? 0}/100
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(0, domainScores[key] ?? 0)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setHasResults(false);
                  setAnswers(initialAnswers);
                }}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Refaire le questionnaire
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}