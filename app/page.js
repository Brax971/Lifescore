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
      { id: "fin_dettes", label: "Poids des dettes" },
    ],
  },
  {
    id: "travail",
    label: "Travail / activité",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      {
        id: "job_confiance",
        label: "Confiance dans ton travail / activité",
      },
      { id: "job_sens", label: "Sens de ton activité" },
    ],
  },
  {
    id: "sante",
    label: "Santé / énergie",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      { id: "sante_energie", label: "Niveau d'énergie global" },
      {
        id: "sante_hygiene",
        label: "Qualité de ton hygiène de vie",
      },
    ],
  },
  {
    id: "orga",
    label: "Organisation / administratif",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      {
        id: "orga_quotidien",
        label: "Organisation de ton quotidien",
      },
      {
        id: "orga_admin",
        label: "Gestion de l'administratif",
      },
    ],
  },
  {
    id: "relations",
    label: "Relations / entourage",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      {
        id: "rel_soutien",
        label: "Soutien ressenti de la part de ton entourage",
      },
      {
        id: "rel_temps",
        label: "Temps de qualité partagé avec les proches",
      },
    ],
  },
  {
    id: "mental",
    label: "État mental / ressenti",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      {
        id: "mental_humeur",
        label: "Humeur générale en ce moment",
      },
      {
        id: "mental_motivation",
        label: "Motivation pour avancer dans tes projets",
      },
    ],
  },
];

export default function HomePage() {
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);

  const handleChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleReset = () => {
    setAnswers({});
    setResults(null);
    const el = document.getElementById("lk-home");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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

      const avgDomain =
        values.reduce((sum, v) => sum + v, 0) / values.length || 0;

      domainScores[domain.label] = Math.round(avgDomain * 10);
    });

    const globalAvg =
      allValues.length > 0
        ? allValues.reduce((sum, v) => sum + v, 0) / allValues.length
        : 0;

    const globalScore = Math.round(globalAvg * 10);

    setResults({
      globalScore,
      domainScores,
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

  const scrollHome = () => {
    const el = document.getElementById("lk-home");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="lk-app">
      {/* HEADER */}
      <header className="lk-header">
        <div className="lk-header-inner">
          {/* Logo + marque */}
          <button type="button" className="lk-brand" onClick={scrollHome}>
            <div className="lk-logo-pill">
              <span className="lk-logo-inner" />
            </div>
            <div className="lk-brand-text">
              <span className="lk-brand-name">
                <span className="lk-brand-name-l">L</span>
                <span className="lk-brand-name-rest">ifecore</span>
              </span>
              <span className="lk-brand-tagline">
                Ta vie a un potentiel, mesure-la.
              </span>
            </div>
          </button>

          {/* Boutons auth */}
          <div className="lk-header-actions">
            <button
              type="button"
              className="lk-button lk-button-primary lk-button-header"
            >
              Se connecter
            </button>
            <button
              type="button"
              className="lk-button lk-button-primary lk-button-header"
            >
              Créer un compte
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="lk-main">
        <section id="lk-home" className="lk-section">
          {/* Intro */}
          <div className="lk-card lk-card-main lk-card-intro">
            <h1>Évalues ton équilibre de vie en 2 minutes</h1>
            <p>
              <strong>Lifecore</strong> t’aide à obtenir une vision claire de
              ton équilibre de vie.
            </p>
            <p>
              En quelques questions, tu obtiens un{" "}
              <strong>score global</strong> et des{" "}
              <strong>scores par domaine</strong> (finances, travail, santé,
              relations, etc.), calculés de manière cohérente.
            </p>
            <p>
              Répond <strong>honnêtement</strong>, sans te juger. Il n’existe
              pas de « bonne » réponse : l’important, c’est ce que toi tu
              ressens aujourd’hui.
            </p>
            <p className="lk-scale-info">
              Échelle utilisée : <strong>1 = très faible, 10 = excellent.</strong>
            </p>
          </div>

          {/* FORMULAIRE */}
          <form
            onSubmit={handleSubmit}
            className="lk-card lk-card-main lk-form-card"
          >
            {domains.map((domain) => (
              <div key={domain.id} className="lk-domain-block">
                <div className="lk-domain-header">
                  <h2>{domain.label}</h2>
                  <p className="lk-domain-description">
                    {domain.description}
                  </p>
                </div>

                <div className="lk-domain-questions">
                  {domain.questions.map((question) => {
                    const value = answers[question.id] ?? 5;
                    return (
                      <div
                        key={question.id}
                        className="lk-question-row"
                      >
                        <div className="lk-question-label-row">
                          <p className="lk-question-label">
                            {question.label}
                          </p>
                          <span className="lk-question-value">
                            {value}/10
                          </span>
                        </div>

                        <div className="lk-slider-wrapper">
                          <input
                            type="range"
                            min={1}
                            max={10}
                            step={1}
                            value={value}
                            onChange={(e) =>
                              handleChange(
                                question.id,
                                Number(e.target.value)
                              )
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
              </div>
            ))}

            <div className="lk-actions-row lk-actions-row-main">
              <button
                type="button"
                className="lk-button lk-button-secondary"
                onClick={handleReset}
              >
                Réinitialiser
              </button>
              <button
                type="submit"
                className="lk-button lk-button-primary lk-button-cta"
              >
                Calculer mon LifeScore
              </button>
            </div>
          </form>

          {/* RÉSULTATS */}
          {results && (
            <div
              id="lk-results"
              className="lk-card lk-card-main lk-results-card"
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
                  <h2>Ton LifeScore global</h2>
                  <p>
                    Ce score est la moyenne de l’ensemble de tes réponses,
                    ramenée sur 100. Ce n’est pas une note absolue, mais une
                    photographie de ta situation actuelle.
                  </p>
                  <p>
                    Ton LifeScore global est{" "}
                    <strong>{getScoreText(results.globalScore)}</strong>.
                  </p>
                  <p>
                    Utilise ce score comme un point de départ : tu peux refaire
                    le questionnaire régulièrement pour suivre l’évolution de
                    ton LifeScore au fil des semaines ou des mois.
                  </p>
                </div>
              </div>

              <div className="lk-results-block">
                <h3>Scores par domaine</h3>
                <p>
                  Chaque score est la moyenne de tes réponses dans le domaine,
                  ramenée sur 100.
                </p>
                <div className="lk-domain-scores">
                  {Object.entries(results.domainScores).map(
                    ([label, score]) => (
                      <div
                        key={label}
                        className="lk-domain-score-row"
                      >
                        <div className="lk-domain-score-header">
                          <span className="lk-domain-score-label">
                            {label}
                          </span>
                          <span className="lk-domain-score-value">
                            {score}/100
                          </span>
                        </div>
                        <div className="lk-domain-score-bar">
                          <div
                            className="lk-domain-score-bar-fill"
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="lk-results-block">
                <h3>Ce que ton LifeScore suggère</h3>
                <ul className="lk-list">
                  <li>
                    Au-dessus de 70/100 : tes points forts actuels.
                  </li>
                  <li>
                    Entre 40 et 70/100 : zone « stable » mais perfectible.
                  </li>
                  <li>
                    En dessous de 40/100 : domaines prioritaires.
                  </li>
                </ul>
              </div>

              <div className="lk-results-block">
                <h3>Et maintenant ?</h3>
                <ul className="lk-list">
                  <li>
                    Choisis <strong>un seul domaine</strong> à travailler en
                    priorité.
                  </li>
                  <li>
                    Note <strong>1 à 3 actions simples</strong> que tu peux
                    faire cette semaine.
                  </li>
                  <li>
                    Reviens faire le test dans 1 à 2 semaines pour voir
                    l’évolution.
                  </li>
                </ul>

                <div className="lk-actions-row" style={{ marginTop: 16 }}>
                  <button
                    type="button"
                    className="lk-button lk-button-secondary"
                    onClick={handleReset}
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