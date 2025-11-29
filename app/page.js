"use client";

import { useState } from "react";

// Définition des sections et des questions
const sections = [
  {
    id: "finances",
    title: "Finances",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      { id: "situation_financiere", label: "Situation financière globale" },
      { id: "gestion_budget", label: "Gestion du budget" },
      { id: "poids_dettes", label: "Poids des dettes" },
    ],
  },
  {
    id: "travail",
    title: "Travail / activité",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      { id: "confiance_travail", label: "Confiance dans ton travail / activité" },
      { id: "sens_activite", label: "Sens de ton activité" },
    ],
  },
  {
    id: "sante",
    title: "Santé / énergie",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      { id: "energie_globale", label: "Niveau d'énergie global" },
      { id: "hygiene_vie", label: "Qualité de ton hygiène de vie" },
    ],
  },
  {
    id: "organisation",
    title: "Organisation / administratif",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      { id: "organisation_quotidien", label: "Organisation de ton quotidien" },
      { id: "gestion_admin", label: "Gestion de l'administratif" },
    ],
  },
  {
    id: "relations",
    title: "Relations / entourage",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      {
        id: "soutien_entourage",
        label: "Soutien ressenti de la part ton entourage",
      },
      {
        id: "temps_qualite_proches",
        label: "Temps de qualité partagé avec les proches",
      },
    ],
  },
  {
    id: "mental",
    title: "État mental / ressenti",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      { id: "humeur_generale", label: "Humeur générale en ce moment" },
      {
        id: "motivation_projets",
        label: "Motivation pour avancer dans tes projets",
      },
    ],
  },
];

// Valeurs initiales (toutes à 5/10)
function buildInitialAnswers() {
  const obj = {};
  sections.forEach((section) => {
    section.questions.forEach((q) => {
      obj[q.id] = 5;
    });
  });
  return obj;
}

// Calcul des scores
function calculateScores(answers) {
  // Score global
  const allValues = Object.values(answers);
  const globalAverage =
    allValues.reduce((sum, v) => sum + v, 0) / allValues.length;
  const globalScore = Math.round(globalAverage * 10); // /100

  // Scores par domaine
  const domainScores = {};
  sections.forEach((section) => {
    const values = section.questions.map((q) => answers[q.id]);
    const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
    domainScores[section.title] = Math.round(avg * 10);
  });

  return { globalScore, domainScores };
}

// Texte dynamique pour le score global
function getGlobalMessage(globalScore) {
  if (globalScore < 40) {
    return {
      niveau: "plutôt fragile",
      texte:
        "Ta situation actuelle est compliquée sur plusieurs plans. Ce n'est pas un jugement, mais un point de départ pour identifier ce qui a besoin d'attention en priorité.",
    };
  }
  if (globalScore < 70) {
    return {
      niveau: "intermédiaire",
      texte:
        "Tout n'est pas simple, mais tu as déjà des bases solides. Le but n'est pas d'atteindre 100/100, mais de repérer ce qui mérite un coup de pouce pour améliorer concrètement ton quotidien.",
    };
  }
  return {
    niveau: "élevé",
    texte:
      "Ton LifeScore global est déjà très bon. L'idée n'est pas de tout révolutionner, mais d'identifier quelques ajustements pour consolider ce qui fonctionne et éviter l'usure.",
  };
}

export default function Home() {
  const [answers, setAnswers] = useState(buildInitialAnswers);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  const handleChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: Number(value),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const scores = calculateScores(answers);
    setResults(scores);
    setShowResults(true);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleReset = () => {
    setAnswers(buildInitialAnswers());
    setResults(null);
    setShowResults(false);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const globalMessage =
    results && results.globalScore != null
      ? getGlobalMessage(results.globalScore)
      : null;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Titre / intro */}
        <section className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
            Calcule ton LifeScore en 2 minutes.
          </h1>
          <p className="mb-3">
            Ce questionnaire a été conçu pour t&apos;aider à prendre du recul
            sur ta situation. En quelques questions, tu obtiens un{" "}
            <strong>score global</strong> et des{" "}
            <strong>scores par domaine</strong> (finances, travail, santé,
            relations, etc.).
          </p>
          <p className="mb-3">
            Répond <strong>honnêtement</strong>, sans te juger. Il n&apos;existe
            pas de « bonne » réponse : l&apos;important, c&apos;est ce que toi
            tu ressens aujourd&apos;hui.
          </p>
          <p className="font-semibold">
            Échelle utilisée : <strong>1 = très faible, 10 = excellent.</strong>
          </p>
        </section>

        {/* FORMULAIRE */}
        {!showResults && (
          <form onSubmit={handleSubmit} className="space-y-8">
            {sections.map((section) => (
              <section key={section.id} className="bg-white rounded-2xl p-5 shadow-sm">
                <h2 className="text-2xl font-extrabold mb-1">
                  {section.title}
                </h2>
                <p className="text-sm text-slate-600 mb-4">
                  {section.description}
                </p>

                <div className="space-y-4">
                  {section.questions.map((q) => (
                    <div key={q.id}>
                      <label className="block font-semibold mb-1">
                        {q.label}{" "}
                        <span className="font-normal">
                          {answers[q.id]}/10
                        </span>
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={answers[q.id]}
                        onChange={(e) => handleChange(q.id, e.target.value)}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </section>
            ))}

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition"
              >
                Calculer mon LifeScore
              </button>
            </div>
          </form>
        )}

        {/* RÉSULTATS */}
        {showResults && results && (
          <section className="mt-6 bg-white rounded-2xl p-6 shadow-sm">
            {/* Cercle LifeScore global */}
            <div className="flex flex-col items-center mb-6">
              <div
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: "50%",
                  border: "10px solid #2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "3rem",
                  fontWeight: 800,
                  color: "#0f172a",
                }}
              >
                {results.globalScore}
              </div>
              <div className="mt-1 text-slate-700 font-semibold">/100</div>
            </div>

            <h2 className="text-2xl font-extrabold mb-3">
              Ton LifeScore global
            </h2>
            {globalMessage && (
              <>
                <p className="mb-2">
                  Ton LifeScore global est{" "}
                  <strong>{globalMessage.niveau}</strong>.
                </p>
                <p className="mb-4">{globalMessage.texte}</p>
              </>
            )}

            {/* Scores par domaine */}
            <h3 className="text-xl font-extrabold mt-4 mb-3">
              Scores par domaine
            </h3>

            <div className="space-y-3 mb-6">
              {Object.entries(results.domainScores).map(
                ([domainTitle, score]) => (
                  <div key={domainTitle}>
                    <div className="flex justify-between text-sm font-semibold mb-1">
                      <span>{domainTitle}</span>
                      <span>{score}/100</span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: 10,
                        borderRadius: 9999,
                        backgroundColor: "#e5e7eb",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${score}%`,
                          height: "100%",
                          borderRadius: 9999,
                          background:
                            "linear-gradient(90deg,#2563eb,#7c3aed)",
                        }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2 rounded-full bg-slate-100 text-slate-800 font-semibold hover:bg-slate-200 transition"
            >
              Refaire le questionnaire
            </button>
          </section>
        )}
      </div>
    </main>
  );
}