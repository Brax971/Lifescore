"use client";

import React, { useState } from "react";

/* --- DÉFINITION DES DOMAINES ET QUESTIONS --- */
const domains = [
  {
    id: "finances",
    label: "Finances",
    questions: [
      { id: "fin_global", label: "Situation financière globale" },
      { id: "fin_budget", label: "Gestion du budget" },
      { id: "fin_dettes", label: "Poids des dettes" },
    ],
  },
  {
    id: "travail",
    label: "Travail / activité",
    questions: [
      { id: "job_confiance", label: "Confiance dans ton travail / activité" },
      { id: "job_sens", label: "Sens de ton activité" },
    ],
  },
  {
    id: "sante",
    label: "Santé / énergie",
    questions: [
      { id: "san_energie", label: "Niveau d'énergie global" },
      { id: "san_hygiene", label: "Qualité de ton hygiène de vie" },
    ],
  },
  {
    id: "orga",
    label: "Organisation / administratif",
    questions: [
      { id: "org_quoti", label: "Organisation de ton quotidien" },
      { id: "org_admin", label: "Gestion de l'administratif" },
    ],
  },
  {
    id: "relations",
    label: "Relations / entourage",
    questions: [
      {
        id: "rel_soutien",
        label: "Soutien ressenti de la part de ton entourage",
      },
      {
        id: "rel_qualite",
        label: "Temps de qualité partagé avec les proches",
      },
    ],
  },
  {
    id: "mental",
    label: "État mental / ressenti",
    questions: [
      { id: "men_humeur", label: "Humeur générale en ce moment" },
      { id: "men_stress", label: "Niveau de stress ressenti" },
    ],
  },
];

/* --- SCORES INITIAUX (5/10 PARTOUT) --- */
const getInitialScores = () => {
  const base = {};
  domains.forEach((domain) => {
    domain.questions.forEach((q) => {
      base[q.id] = 5;
    });
  });
  return base;
};

export default function Home() {
  const [scores, setScores] = useState(getInitialScores);
  const [results, setResults] = useState(null);

  const handleScoreChange = (id, value) => {
    setScores((prev) => ({ ...prev, [id]: Number(value) }));
  };

  const handleReset = () => {
    setScores(getInitialScores());
    setResults(null);
  };

  const handleCalculate = () => {
    const allValues = Object.values(scores);
    if (!allValues.length) return;

    const globalAvg =
      allValues.reduce((sum, v) => sum + v, 0) / allValues.length;
    const globalLifeScore = Math.round(globalAvg * 10); // /100

    const domainResults = domains.map((domain) => {
      const values = domain.questions.map((q) => scores[q.id]);
      const avg =
        values.reduce((sum, v) => sum + v, 0) / values.length;
      return {
        id: domain.id,
        label: domain.label,
        average: avg,
      };
    });

    setResults({
      global: globalLifeScore,
      domains: domainResults,
    });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* LOGO */}
      <div className="flex justify-center pt-10">
        <img src="/logo.png" alt="Lifekore" className="w-56 h-auto" />
      </div>

      {/* HEADER */}
      <div className="text-center mt-6 px-6">
        <h1 className="text-3xl font-bold leading-tight text-[#0A1C4A]">
          Découvre ton LifeKore Identity™.
          <br />
          Comprends où tu te trouves,
          <br />
          avance vers où tu veux aller.
        </h1>

        <div className="flex justify-center gap-4 mt-6">
          <button className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold shadow-md">
            Se connecter
          </button>
          <button className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-md">
            Créer un compte
          </button>
        </div>
      </div>

      {/* BLOC EXPLICATIF + CHECKLIST */}
      <div className="mx-4 mt-10 p-6 bg-white shadow-lg rounded-3xl border border-gray-100">
        <h2 className="text-xl font-bold text-[#0A1C4A] mb-4 text-center">
          Mesure ton LifeKore Identity™ et clarifie ton équilibre de vie
        </h2>

        <p className="text-gray-700 text-[15px] leading-relaxed mb-4 text-center">
          Lifekore t'aide à obtenir une vision claire, honnête et structurée de
          ton équilibre personnel.
        </p>

        <div className="space-y-3 mt-4">
          <div className="flex items-start gap-3">
            <span className="text-lg leading-[1] pt-1">✔</span>
            <p>
              Comprends ton état actuel dans{" "}
              <strong>six domaines essentiels</strong>.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-lg leading-[1] pt-1">✔</span>
            <p>
              Obtiens un <strong>score global</strong> et des{" "}
              <strong>scores détaillés</strong> faciles à interpréter.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-lg leading-[1] pt-1">✔</span>
            <p>
              Identifie immédiatement <strong>tes forces</strong> et tes axes
              d&apos;amélioration.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-lg leading-[1] pt-1">✔</span>
            <p>
              Visualise ton <strong>niveau d&apos;équilibre général</strong>{" "}
              avec simplicité et précision.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-lg leading-[1] pt-1">✔</span>
            <p>
              Avance chaque semaine avec une meilleure compréhension de{" "}
              <strong>toi-même</strong>.
            </p>
          </div>
        </div>

        <p className="text-gray-700 text-[15px] leading-relaxed mt-4 text-center">
          Il n&apos;existe pas de bonne ou de mauvaise réponse : seulement un
          point de départ pour progresser.
        </p>

        {/* ÉCHELLE UTILISÉE (conservée telle que validée) */}
        <div className="mt-6 text-center">
          <div className="inline-block px-6 py-3 rounded-full bg-[#0A1C4A] text-white font-semibold shadow-md">
            Échelle utilisée : 1 = très faible, 10 = excellent.
          </div>
        </div>
      </div>

      {/* FORMULAIRE DES DOMAINES */}
      <div className="mt-10 px-4 mb-10">
        {domains.map((domain) => (
          <div
            key={domain.id}
            className="mb-10 bg-white p-5 rounded-3xl shadow-md border border-gray-100"
          >
            <h2 className="text-xl font-bold text-[#0A1C4A]">
              {domain.label}
            </h2>
            <p className="text-sm text-gray-600">
              1 = très mauvaise, 10 = excellente.
            </p>

            {domain.questions.map((q) => (
              <div key={q.id} className="mt-6">
                <div className="flex justify-between items-center mb-1">
                  <label className="font-medium">{q.label}</label>
                  <span className="font-bold text-pink-500">
                    {scores[q.id]}/10
                  </span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="10"
                  value={scores[q.id]}
                  className="w-full accent-pink-500"
                  onChange={(e) =>
                    handleScoreChange(q.id, e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        ))}

        {/* BOUTONS CALCUL / RESET */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4 mb-8">
          <button
            onClick={handleReset}
            className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 font-semibold bg-white"
          >
            Réinitialiser
          </button>
          <button
            onClick={handleCalculate}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-md"
          >
            Calculer mon LifeScore
          </button>
        </div>

        {/* RÉSULTATS */}
        {results && (
          <div className="mb-10 bg-white p-5 rounded-3xl shadow-md border border-gray-100">
            <h2 className="text-xl font-bold text-[#0A1C4A] mb-2 text-center">
              Ton LifeScore
            </h2>
            <p className="text-center text-4xl font-extrabold text-pink-500 mb-4">
              {results.global}/100
            </p>

            <div className="space-y-2">
              {results.domains.map((d) => (
                <div
                  key={d.id}
                  className="flex justify-between text-sm text-gray-700"
                >
                  <span className="font-medium">{d.label}</span>
                  <span className="font-semibold">
                    {d.average.toFixed(1)}/10
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="text-center text-xs text-gray-500 mt-auto mb-6">
        Lifekore · Ta vie a un potentiel, mesure-la.
      </footer>
    </div>
  );
}