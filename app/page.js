"use client";

import { useState } from "react";

const DOMAINS = {
  finances: {
    label: "Finances",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      { key: "situation_financiere", label: "Situation financière globale" },
      { key: "gestion_budget", label: "Gestion du budget" },
      { key: "poids_dettes", label: "Poids des dettes" },
    ],
  },
  travail: {
    label: "Travail / activité",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      {
        key: "confiance_travail",
        label: "Confiance dans ton travail / activité",
      },
      { key: "sens_activite", label: "Sens de ton activité" },
    ],
  },
  sante: {
    label: "Santé / énergie",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      { key: "energie_globale", label: "Niveau d'énergie global" },
      { key: "hygiene_vie", label: "Qualité de ton hygiène de vie" },
    ],
  },
  organisation: {
    label: "Organisation / administratif",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      { key: "organisation_quotidien", label: "Organisation de ton quotidien" },
      {
        key: "gestion_admin",
        label: "Gestion de l'administratif",
      },
    ],
  },
  relations: {
    label: "Relations / entourage",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      {
        key: "soutien_entourage",
        label: "Soutien ressenti de la part de ton entourage",
      },
      {
        key: "temps_qualite",
        label: "Temps de qualité partagé avec les proches",
      },
    ],
  },
  mental: {
    label: "État mental / ressenti",
    description: "1 = très mauvais, 10 = excellent.",
    questions: [
      { key: "humeur_generale", label: "Humeur générale en ce moment" },
      {
        key: "motivation_projets",
        label: "Motivation pour avancer dans tes projets",
      },
    ],
  },
};

const ALL_QUESTIONS = Object.values(DOMAINS).flatMap((domain) =>
  domain.questions.map((q) => q.key)
);

const buildInitialAnswers = () => {
  const obj = {};
  for (const key of ALL_QUESTIONS) {
    obj[key] = 5;
  }
  return obj;
};

export default function HomePage() {
  const [showAbout, setShowAbout] = useState(false);
  const [answers, setAnswers] = useState(buildInitialAnswers);
  const [results, setResults] = useState(null);

  const handleChange = (key, value) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // scores par domaine
    const domainScores = {};
    Object.entries(DOMAINS).forEach(([domainKey, domain]) => {
      const values = domain.questions.map((q) => answers[q.key] || 0);
      const sum = values.reduce((acc, v) => acc + v, 0);
      const avg = values.length ? sum / values.length : 0;
      domainScores[domain.label] = Math.round(avg * 10); // sur 100
    });

    // score global
    const allValues = ALL_QUESTIONS.map((k) => answers[k] || 0);
    const globalAvg =
      allValues.length > 0
        ? allValues.reduce((acc, v) => acc + v, 0) / allValues.length
        : 0;

    const globalScore = Math.round(globalAvg * 10); // sur 100

    setResults({
      globalScore,
      domainScores,
    });
  };

  const handleReset = () => {
    setResults(null);
    setAnswers(buildInitialAnswers());
  };

  return (
    <div className="lk-app">
      {/* HEADER */}
      <header className="lk-header">
        <div className="lk-header-inner">
          <div className="lk-brand">
            <div className="lk-brand-mark">
              <div className="lk-brand-pulse" />
            </div>
            <div className="lk-brand-text">
              <span className="lk-brand-name">Lifekore</span>
              <span className="lk-brand-tagline">
                Ta vie a un potentiel. Mesure-le.
              </span>
            </div>
          </div>

          <nav className="lk-nav">
            <button
              type="button"
              className={`lk-nav-link ${
                !showAbout ? "lk-nav-link-active" : ""
              }`}
              onClick={() => setShowAbout(false)}
            >
              Accueil
            </button>
            <button
              type="button"
              className={`lk-nav-link ${showAbout ? "lk-nav-link-active" : ""}`}
              onClick={() => setShowAbout(true)}
            >
              À propos
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN */}
      <main className="lk-main">
        <section className="lk-section">
          <div className="lk-card lk-card-main">
            {!results ? (
              <>
                {/* INTRO */}
                <div className="lk-card-intro">
                  <h1>Calcule ton LifeScore en 2 minutes.</h1>
                  <p>
                    Ce questionnaire a été conçu pour t'aider à prendre du
                    recul sur ta situation. En quelques questions, tu obtiens un
                    score global et des scores par domaine (finances, travail,
                    santé, relations, etc.).
                  </p>
                  <p>
                    Répond honnêtement, sans te juger. Il n'existe pas de
                    «&nbsp;bonne&nbsp;» réponse : l'important, c'est ce que toi
                    tu ressens aujourd'hui.
                  </p>
                  <div className="lk-scale-info">
                    Échelle utilisée : <strong>1</strong> = très faible,{" "}
                    <strong>10</strong> = excellent.
                  </div>
                </div>

                {/* FORMULAIRE */}
                <form onSubmit={handleSubmit}>
                  {Object.entries(DOMAINS).map(
                    ([domainKey, { label, description, questions }]) => (
                      <div key={domainKey} className="lk-domain-block">
                        <div className="lk-domain-header">
                          <h2>{label}</h2>
                          <p className="lk-domain-description">
                            {description}
                          </p>
                        </div>

                        <div className="lk-domain-questions">
                          {questions.map((q) => (
                            <div key={q.key} className="lk-question-row">
                              <div className="lk-question-label-row">
                                <p className="lk-question-label">{q.label}</p>
                                <span className="lk-question-value">
                                  {answers[q.key]}/10
                                </span>
                              </div>
                              <div className="lk-slider-wrapper">
                                <input
                                  type="range"
                                  min={1}
                                  max={10}
                                  step={1}
                                  value={answers[q.key]}
                                  onChange={(e) =>
                                    handleChange(q.key, e.target.value)
                                  }
                                  className="lk-slider"
                                />
                                {/* 
                                  On n'affiche PLUS les "1 5 10" en dessous
                                  pour éviter l'effet "1510" qui t’agaçait.
                                */}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}

                  <div className="lk-actions-row">
                    <button
                      type="button"
                      className="lk-button lk-button-secondary"
                      onClick={handleReset}
                    >
                      Réinitialiser
                    </button>
                    <button
                      type="submit"
                      className="lk-button lk-button-primary"
                    >
                      Calculer mon LifeScore
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                {/* RÉSULTATS */}
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
                      Ce score est la moyenne de l'ensemble de tes réponses,
                      ramenée sur 100. Ce n'est pas une note absolue, mais une
                      photographie de ta situation actuelle.
                    </p>
                    <p className="lk-results-intro">
                      Utilise ce score comme un point de départ : tu peux
                      refaire le questionnaire régulièrement pour suivre
                      l'évolution de ton LifeScore au fil des semaines ou des
                      mois.
                    </p>
                  </div>
                </div>

                <div className="lk-results-block">
                  <h2>Scores par domaine</h2>
                  <p>
                    Chaque score est la moyenne de tes réponses dans le domaine,
                    ramenée sur 100.
                  </p>

                  <div className="lk-domain-scores">
                    {Object.entries(results.domainScores).map(
                      ([domainLabel, score]) => (
                        <div
                          key={domainLabel}
                          className="lk-domain-score-row"
                        >
                          <div className="lk-domain-score-header">
                            <span className="lk-domain-score-label">
                              {domainLabel}
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

                <div className="lk-results-columns">
                  <div>
                    <h2>Ce que ton LifeScore suggère</h2>
                    <ul className="lk-list">
                      <li>
                        Les domaines au-dessus de 70/100 sont tes points forts
                        actuels.
                      </li>
                      <li>
                        Les domaines entre 40 et 70/100 sont «&nbsp;stables&nbsp;»
                        mais pourraient être améliorés.
                      </li>
                      <li>
                        Les domaines en dessous de 40/100 méritent une attention
                        prioritaire.
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h2>Et maintenant, concrètement ?</h2>
                    <ul className="lk-list">
                      <li>
                        Choisis <strong>un seul domaine</strong> à travailler en
                        priorité.
                      </li>
                      <li>
                        Note 1 à 3 actions simples que tu peux faire cette
                        semaine.
                      </li>
                      <li>
                        Reviens faire le test dans 1 à 2 semaines pour voir
                        l'évolution.
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="lk-actions-row">
                  <button
                    type="button"
                    className="lk-button lk-button-secondary"
                    onClick={handleReset}
                  >
                    Refaire le questionnaire
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="lk-footer">
        <div className="lk-footer-inner">
          Lifekore · Ton score de vie, en un coup d’œil.
        </div>
      </footer>
    </div>
  );
}