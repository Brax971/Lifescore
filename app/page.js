"use client";

import React, { useState } from "react";

const domains = [
  {
    id: "finances",
    label: "Finances",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      { id: "fin_situation", label: "Situation financière globale" },
      { id: "fin_budget", label: "Gestion du budget" },
      { id: "fin_dettes", label: "Poids des dettes" }
    ]
  },
  {
    id: "travail",
    label: "Travail / activité",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      { id: "job_confiance", label: "Confiance dans ton travail / activité" },
      { id: "job_sens", label: "Sens de ton activité" }
    ]
  },
  {
    id: "sante",
    label: "Santé / énergie",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      { id: "sante_energie", label: "Niveau d'énergie global" },
      { id: "sante_hygiene", label: "Qualité de ton hygiène de vie" }
    ]
  },
  {
    id: "orga",
    label: "Organisation / administratif",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      { id: "orga_quotidien", label: "Organisation de ton quotidien" },
      { id: "orga_admin", label: "Gestion de l'administratif" }
    ]
  },
  {
    id: "relations",
    label: "Relations / entourage",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      { id: "rel_soutien", label: "Soutien ressenti de la part ton entourage" },
      { id: "rel_temps", label: "Temps de qualité partagé avec les proches" }
    ]
  },
  {
    id: "mental",
    label: "État mental / ressenti",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      { id: "mental_humeur", label: "Humeur générale en ce moment" },
      { id: "mental_motivation", label: "Motivation pour avancer dans tes projets" }
    ]
  }
];

export default function HomePage() {
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);

  const handleChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleReset = () => {
    setAnswers({});
    setResults(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const allValues = [];
    const domainScores = {};

    domains.forEach((domain) => {
      const values = domain.questions.map((q) => {
        const val = answers[q.id] ?? 5;
        allValues.push(val);
        return val;
      });

      const avg = values.reduce((s, v) => s + v, 0) / values.length;
      domainScores[domain.label] = Math.round(avg * 10);
    });

    const globalAvg =
      allValues.reduce((s, v) => s + v, 0) / allValues.length;

    const globalScore = Math.round(globalAvg * 10);

    setResults({
      globalScore,
      domainScores
    });

    const el = document.getElementById("lk-results");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const getScoreText = (score) => {
    if (score >= 70) return "élevé";
    if (score >= 40) return "intermédiaire";
    return "fragile";
  };

  return (
    <div className="lk-app">
      {/* HEADER */}
      <header className="lk-header">
        <div className="lk-header-inner">
          <div className="lk-brand">
            <div className="lk-brand-mark"></div>
            <div className="lk-brand-text">
              <span className="lk-brand-name">
                <span className="lk-letter-l">L</span>ifecore
              </span>
              <span className="lk-brand-tagline">
                Ta vie a un potentiel, mesure-la.
              </span>
            </div>
          </div>

          <nav className="lk-nav">
            <button className="lk-nav-button">Se connecter</button>
            <button className="lk-nav-button-primary">Créer un compte</button>
          </nav>
        </div>
      </header>

      {/* MAIN */}
      <main className="lk-main">

        {/* INTRO */}
        <section id="lk-home" className="lk-section">
          <div className="lk-card lk-card-main lk-card-intro">
            <h1>Évalues ton équilibre de vie en 2 minutes</h1>
            <p>
              <strong>Lifecore</strong> t’aide à obtenir une vision claire de ton
              équilibre de vie en répondant à quelques questions.
            </p>
            <p>
              Tu obtiens un <strong>score global</strong> et des{" "}
              <strong>scores par domaine</strong> pour comprendre où tu te sens
              solide et où tu peux progresser.
            </p>
            <p>
              Échelle utilisée :{" "}
              <strong>1 = très faible, 10 = excellent.</strong>
            </p>
          </div>

          {/* FORMULAIRE */}
          <form
            onSubmit={handleSubmit}
            className="lk-card lk-card-main"
            style={{ marginTop: 16 }}
          >
            {domains.map((domain) => (
              <div key={domain.id} className="lk-domain-block">
                <div className="lk-domain-header">
                  <h2>{domain.label}</h2>
                  <p className="lk-domain-description">{domain.description}</p>
                </div>

                {domain.questions.map((q) => {
                  const value = answers[q.id] ?? 5;
                  return (
                    <div key={q.id} className="lk-question-row">
                      <div className="lk-question-label-row">
                        <p className="lk-question-label">{q.label}</p>
                        <span className="lk-question-value">{value}/10</span>
                      </div>

                      <div className="lk-slider-wrapper">
                        <input
                          type="range"
                          min={1}
                          max={10}
                          step={1}
                          value={value}
                          onChange={(e) =>
                            handleChange(q.id, Number(e.target.value))
                          }
                          className="lk-slider"
                        />

                        <div className="lk-slider-ticks">
                          {Array.from({ length: 10 }, (_, i) => (
                            <span key={i + 1}>{i + 1}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            <div className="lk-actions-row">
              <button
                type="button"
                className="lk-button lk-button-secondary"
                onClick={handleReset}
              >
                Réinitialiser
              </button>

              <button type="submit" className="lk-button lk-button-primary">
                Calculer mon LifeScore
              </button>
            </div>
          </form>

          {/* RÉSULTATS */}
          {results && (
            <div
              id="lk-results"
              className="lk-card lk-card-main"
              style={{ marginTop: 20 }}
            >
              <div className="lk-results-header">
                <div className="lk-circle-score">
                  <div className="lk-circle-score-inner">
                    <div className="lk-circle-score-value">
                      {results.globalScore}
                    </div>
                    <div className="lk-circle-score-label">/100</div>
                  </div>
                </div>

                <div className="lk-results-title">
                  <h1>Ton LifeScore global</h1>
                  <p>
                    Ce score reflète ton ressenti général aujourd’hui.
                    Ton équilibre est actuellement{" "}
                    <strong>{getScoreText(results.globalScore)}</strong>.
                  </p>
                </div>
              </div>

              <div className="lk-results-block">
                <h2>Scores par domaine</h2>
                <p>Moyenne de tes réponses dans chaque domaine (sur 100).</p>

                <div className="lk-domain-scores">
                  {Object.entries(results.domainScores).map(
                    ([label, score]) => (
                      <div key={label} className="lk-domain-score-row">
                        <div className="lk-domain-score-header">
                          <span>{label}</span>
                          <span>{score}/100</span>
                        </div>

                        <div className="lk-domain-score-bar">
                          <div
                            className="lk-domain-score-bar-fill"
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="lk-results-block">
                <h2>Et maintenant ?</h2>
                <ul className="lk-list">
                  <li>Choisis un domaine à améliorer cette semaine.</li>
                  <li>Identifie 1 à 3 actions simples.</li>
                  <li>Refais le test dans 2 semaines pour suivre ton évolution.</li>
                </ul>

                <div className="lk-actions-row" style={{ marginTop: 16 }}>
                  <button
                    type="button"
                    className="lk-button lk-button-secondary"
                    onClick={() => {
                      const el = document.getElementById("lk-home");
                      if (el) {
                        el.scrollIntoView({
                          behavior: "smooth",
                          block: "start"
                        });
                      }
                    }}
                  >
                    Refaire le questionnaire
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="lk-footer">
        <div className="lk-footer-inner">
          Lifecore · Ta vie a un potentiel, mesure-la.
        </div>
      </footer>
    </div>
  );
}