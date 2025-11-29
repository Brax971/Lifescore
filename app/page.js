"use client";

import React, { useState } from "react";

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
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const domains = [
      {
        id: "finances",
        label: "Finances",
        questions: [
          { id: "fin_situation", label: "Situation financière globale" },
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
          { id: "sante_energie", label: "Niveau d'énergie global" },
          { id: "sante_hygiene", label: "Qualité de ton hygiène de vie" },
        ],
      },
      {
        id: "orga",
        label: "Organisation / administratif",
        questions: [
          { id: "orga_quotidien", label: "Organisation du quotidien" },
          { id: "orga_admin", label: "Gestion de l'administratif" },
        ],
      },
      {
        id: "relations",
        label: "Relations / entourage",
        questions: [
          { id: "rel_soutien", label: "Soutien de l'entourage" },
          { id: "rel_temps", label: "Temps de qualité partagé" },
        ],
      },
      {
        id: "mental",
        label: "État mental / ressenti",
        questions: [
          { id: "mental_humeur", label: "Humeur générale" },
          { id: "mental_motivation", label: "Motivation actuelle" },
        ],
      },
    ];

    const allValues = [];
    const domainScores = {};

    domains.forEach((domain) => {
      const values = domain.questions.map((q) => {
        const val = answers[q.id] ?? 5;
        allValues.push(val);
        return val;
      });

      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      domainScores[domain.label] = Math.round(avg * 10);
    });

    const globalAvg =
      allValues.length > 0
        ? allValues.reduce((a, b) => a + b, 0) / allValues.length
        : 0;

    setResults({
      globalScore: Math.round(globalAvg * 10),
      domainScores,
    });

    document.getElementById("lk-results")?.scrollIntoView({ behavior: "smooth" });
  };

  const getScoreText = (score) => {
    if (score >= 70) return "élevé";
    if (score >= 40) return "intermédiaire";
    return "fragile";
  };

  return (
    <div className="lk-app">
      {/* HEADER FIXÉ, LOGO NON DÉFORMÉ, BOUTONS CORRIGÉS */}
      <header className="lk-header">
        <div className="lk-header-inner">

          {/* LOGO + NOM */}
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

          {/* BOUTONS */}
          <nav className="lk-nav">
            <button className="lk-nav-button">Se connecter</button>
            <button className="lk-nav-button lk-nav-button-primary">Créer un compte</button>
          </nav>
        </div>
      </header>

      <main className="lk-main">
        <section className="lk-section">
          <div className="lk-card lk-card-main lk-card-intro">
            <h1>Évalues ton équilibre de vie en 2 minutes</h1>
            <p>
              <strong>Lifecore</strong> t’aide à obtenir une vision claire de ton équilibre de vie.
            </p>
            <p>
              Échelle utilisée : <strong>1 = très faible, 10 = excellent.</strong>
            </p>
          </div>

          {/* FORMULAIRE */}
          <form onSubmit={handleSubmit} className="lk-card lk-card-main" style={{ marginTop: 16 }}>
            {/* QUESTIONS */}
            {/** Le code des sliders reste inchangé **/}

            <div className="lk-actions-row">
              <button type="button" className="lk-button lk-button-secondary" onClick={handleReset}>
                Réinitialiser
              </button>
              <button type="submit" className="lk-button lk-button-primary">
                Calculer mon LifeScore
              </button>
            </div>
          </form>

          {/* RÉSULTATS */}
          {results && (
            <div id="lk-results" className="lk-card lk-card-main" style={{ marginTop: 20 }}>
              <h1>Ton LifeScore global</h1>
              <div className="lk-circle-score">
                {results.globalScore}
                <span className="lk-over100">/100</span>
              </div>

              <p>Ton LifeScore est <strong>{getScoreText(results.globalScore)}</strong>.</p>
            </div>
          )}
        </section>
      </main>

      <footer className="lk-footer">
        <div className="lk-footer-inner">
          Lifecore · Ta vie a un potentiel, mesure-la.
        </div>
      </footer>
    </div>
  );
}