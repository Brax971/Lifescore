// app/page.js
"use client";

import { useState } from "react";

const DOMAINS = [
  { id: "finances", label: "Finances" },
  { id: "travail", label: "Travail / activité" },
  { id: "sante", label: "Santé / énergie" },
  { id: "organisation", label: "Organisation / administratif" },
  { id: "relations", label: "Relations / entourage" },
  { id: "mental", label: "État mental / ressenti" },
];

const QUESTIONS = [
  // Finances
  {
    id: "finances_1",
    domainId: "finances",
    label: "Situation financière globale",
  },
  {
    id: "finances_2",
    domainId: "finances",
    label: "Gestion du budget",
  },
  {
    id: "finances_3",
    domainId: "finances",
    label: "Poids des dettes",
  },

  // Travail / activité
  {
    id: "travail_1",
    domainId: "travail",
    label: "Confiance dans ton travail / activité",
  },
  {
    id: "travail_2",
    domainId: "travail",
    label: "Sens de ton activité",
  },
  {
    id: "travail_3",
    domainId: "travail",
    label: "Niveau d'énergie au travail",
  },

  // Santé / énergie
  {
    id: "sante_1",
    domainId: "sante",
    label: "Niveau d'énergie sur une semaine moyenne",
  },
  {
    id: "sante_2",
    domainId: "sante",
    label: "Qualité du sommeil",
  },
  {
    id: "sante_3",
    domainId: "sante",
    label: "Habitudes de santé (alimentation, activité physique…)",
  },

  // Organisation / administratif
  {
    id: "organisation_1",
    domainId: "organisation",
    label: "Organisation du quotidien",
  },
  {
    id: "organisation_2",
    domainId: "organisation",
    label: "Gestion des tâches administratives",
  },
  {
    id: "organisation_3",
    domainId: "organisation",
    label: "Clarté de tes priorités",
  },

  // Relations / entourage
  {
    id: "relations_1",
    domainId: "relations",
    label: "Qualité des relations proches",
  },
  {
    id: "relations_2",
    domainId: "relations",
    label: "Soutien ressenti de ton entourage",
  },
  {
    id: "relations_3",
    domainId: "relations",
    label: "Temps accordé à tes relations importantes",
  },

  // État mental / ressenti
  {
    id: "mental_1",
    domainId: "mental",
    label: "Humeur générale en ce moment",
  },
  {
    id: "mental_2",
    domainId: "mental",
    label: "Motivation pour avancer dans tes projets",
  },
  {
    id: "mental_3",
    domainId: "mental",
    label: "Niveau de stress ressenti",
  },
];

function createInitialAnswers() {
  const obj = {};
  QUESTIONS.forEach((q) => {
    obj[q.id] = 5; // valeur par défaut : 5/10
  });
  return obj;
}

export default function Home() {
  const [view, setView] = useState<"form" | "result">("form");
  const [answers, setAnswers] = useState(createInitialAnswers);
  const [globalScore, setGlobalScore] = useState(0);
  const [domainScores, setDomainScores] = useState({});
  const [summaryText, setSummaryText] = useState("");

  const handleChange = (id, value) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: Number(value),
    }));
  };

  const handleReset = () => {
    setAnswers(createInitialAnswers());
    setView("form");
    setGlobalScore(0);
    setDomainScores({});
    setSummaryText("");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const computeScores = () => {
    const domainTotals = {};
    const domainCounts = {};

    QUESTIONS.forEach((q) => {
      const v = answers[q.id] ?? 5;
      if (!domainTotals[q.domainId]) {
        domainTotals[q.domainId] = 0;
        domainCounts[q.domainId] = 0;
      }
      domainTotals[q.domainId] += v;
      domainCounts[q.domainId] += 1;
    });

    const domainScoresComputed = {};
    let sum = 0;
    let count = 0;

    DOMAINS.forEach((d) => {
      if (domainTotals[d.id]) {
        const avg = domainTotals[d.id] / domainCounts[d.id]; // 1–10
        const score100 = Math.round(avg * 10); // 1–100
        domainScoresComputed[d.id] = score100;
        sum += score100;
        count += 1;
      }
    });

    const global = count > 0 ? Math.round(sum / count) : 0;

    // petit résumé simple (on fera la version “premium” à l’étape B)
    let summary = "";
    if (global >= 80) {
      summary =
        "Ton LifeScore global est élevé : tu traverses une phase plutôt positive, avec de bons repères dans la plupart des domaines.";
    } else if (global >= 60) {
      summary =
        "Ton LifeScore global est correct : il y a une certaine stabilité, avec des marges de progression intéressantes.";
    } else if (global >= 40) {
      summary =
        "Ton LifeScore global est intermédiaire : la période n’est pas simple, mais plusieurs leviers peuvent être améliorés.";
    } else {
      summary =
        "Ton LifeScore global est bas en ce moment : tu traverses sans doute une phase difficile. Ce bilan sert de point de départ pour organiser une progression, pas de jugement.";
    }

    setGlobalScore(global);
    setDomainScores(domainScoresComputed);
    setSummaryText(summary);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    computeScores();
    setView("result");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleClickAccueil = () => {
    handleReset();
  };

  const handleClickAPropos = () => {
    // Navigation simple vers la page À propos (route /a-propos)
    if (typeof window !== "undefined") {
      window.location.href = "/a-propos";
    }
  };

  const renderScaleTicks = () => {
    // graduations 1 à 10 sous chaque slider
    return (
      <div className="scale-ticks">
        {Array.from({ length: 10 }).map((_, index) => (
          <span key={index}>{index + 1}</span>
        ))}
      </div>
    );
  };

  const renderQuestion = (question) => {
    const value = answers[question.id] ?? 5;
    return (
      <div key={question.id} className="question-row">
        <div className="question-label">
          <span>{question.label}</span>
          <span className="question-value">{value}/10</span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          step="1"
          value={value}
          onChange={(e) => handleChange(question.id, e.target.value)}
          className="slider"
        />
        {renderScaleTicks()}
      </div>
    );
  };

  const questionsByDomain = DOMAINS.map((domain) => ({
    domain,
    questions: QUESTIONS.filter((q) => q.domainId === domain.id),
  }));

  return (
    <div className="page-wrapper">
      {/* HEADER */}
      <header className="top-nav">
        <div className="top-nav-inner">
          <div className="logo">LifeScore.ai</div>
          <nav className="nav-links">
            <button
              type="button"
              className="nav-link-button"
              onClick={handleClickAccueil}
            >
              Accueil
            </button>
            <button
              type="button"
              className="nav-link-button"
              onClick={handleClickAPropos}
            >
              À propos
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN */}
      <main className="main-shell">
        {view === "form" && (
          <section className="card">
            <h1 className="page-title">Calcule ton LifeScore en 2 minutes.</h1>

            {/* ⚡ Intro plus claire */}
            <div className="intro-block">
              <p className="intro-text">
                Ce questionnaire a été conçu pour t&apos;aider à prendre du
                recul sur ta situation. En quelques questions, tu obtiens :
              </p>
              <ul className="intro-list">
                <li>un score global de ta vie actuelle ;</li>
                <li>des scores par domaine (finances, travail, santé, etc.) ;</li>
                <li>un résumé simple pour clarifier tes priorités.</li>
              </ul>
              <p className="intro-scale">
                Réponds honnêtement, sans te juger. Il n&apos;y a pas de
                &laquo; bonne &raquo; réponse : l&apos;important, c&apos;est ce
                que tu ressens aujourd&apos;hui.
                <br />
                <strong>Échelle utilisée : 1 = très faible, 10 = excellent.</strong>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="lifescore-form">
              {questionsByDomain.map(({ domain, questions }) => (
                <section key={domain.id} className="domain-section">
                  <h2 className="domain-title">{domain.label}</h2>
                  <p className="domain-subtitle">
                    Note chaque affirmation de 1 à 10 en fonction de ton
                    ressenti actuel.
                  </p>
                  {questions.map(renderQuestion)}
                </section>
              ))}

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleReset}
                >
                  Réinitialiser les réponses
                </button>
                <button type="submit" className="btn-primary">
                  Calculer mon LifeScore
                </button>
              </div>
            </form>
          </section>
        )}

        {view === "result" && (
          <section className="card">
            <h1 className="page-title">Ton LifeScore</h1>

            <div className="result-header">
              <div className="circle-score">
                <span className="circle-score-main">{globalScore}</span>
                <span className="circle-score-sub">/100</span>
              </div>
              <div className="result-header-text">
                <h2>LifeScore global</h2>
                <p>
                  Ce score est la moyenne de tous les domaines évalués. Il ne
                  s&apos;agit pas d&apos;un jugement, mais d&apos;un{" "}
                  <strong>indicateur</strong> de ton niveau de satisfaction
                  global aujourd&apos;hui.
                </p>
              </div>
            </div>

            <section className="domain-scores">
              <h2>Scores par domaine</h2>
              {DOMAINS.map((domain) => {
                const score = domainScores[domain.id] ?? 0;
                return (
                  <div key={domain.id} className="domain-score-row">
                    <div className="domain-score-header">
                      <span>{domain.label}</span>
                      <span className="domain-score-value">{score}/100</span>
                    </div>
                    <div className="domain-score-bar">
                      <div
                        className="domain-score-fill"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </section>

            <section className="summary-block">
              <h2>Résumé rapide</h2>
              <p>{summaryText}</p>
              <p className="summary-note">
                Ce LifeScore est un point de départ. Tu peux revenir le refaire
                régulièrement pour suivre ton évolution.
              </p>
            </section>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleReset}
              >
                Refaire le questionnaire
              </button>
            </div>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="site-footer-inner">
          <p>© 2025 LifeScore.ai – Bilan de vie expérimental.</p>
          <p className="footer-note">
            Les réponses ne sont pas enregistrées côté serveur. Ce site est un
            outil d&apos;auto-évaluation, pas un avis médical ou financier.
          </p>
        </div>
      </footer>
    </div>
  );
}