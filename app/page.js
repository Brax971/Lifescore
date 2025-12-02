"use client";

import React, { useState } from "react";

const domains = [
  {
    id: "finances",
    label: "Finances",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      {
        id: "fin_situation",
        label: "Situation financière globale",
      },
      {
        id: "fin_budget",
        label: "Gestion du budget",
      },
      {
        id: "fin_dettes",
        label: "Poids des dettes",
      },
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
      {
        id: "job_sens",
        label: "Sens de ton activité",
      },
    ],
  },
  {
    id: "sante",
    label: "Santé / énergie",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      {
        id: "sante_energie",
        label: "Niveau d'énergie global",
      },
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
        label: "Soutien ressenti de la part ton entourage",
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

function DomainIcon({ id }: { id: string }) {
  switch (id) {
    case "finances":
      // Pièces + billet
      return (
        <svg
          className="lk-domain-icon"
          viewBox="0 0 32 32"
          aria-hidden="true"
        >
          <rect
            x="6"
            y="10"
            width="18"
            height="12"
            rx="3"
            fill="#0A2A43"
          />
          <rect
            x="8"
            y="12"
            width="14"
            height="8"
            rx="2"
            fill="#ffffff"
            opacity="0.9"
          />
          <circle cx="23" cy="22" r="5" fill="#FF4B8B" />
          <circle cx="23" cy="22" r="3" fill="#ffffff" />
        </svg>
      );
    case "travail":
      // Mallette de travail
      return (
        <svg
          className="lk-domain-icon"
          viewBox="0 0 32 32"
          aria-hidden="true"
        >
          <rect
            x="6"
            y="11"
            width="20"
            height="13"
            rx="3"
            fill="#0A2A43"
          />
          <rect
            x="12"
            y="7"
            width="8"
            height="4"
            rx="1"
            fill="#0A2A43"
          />
          <rect
            x="8"
            y="13"
            width="16"
            height="9"
            rx="2"
            fill="#ffffff"
            opacity="0.9"
          />
          <rect
            x="14"
            y="16"
            width="4"
            height="2"
            rx="1"
            fill="#FF4B8B"
          />
        </svg>
      );
    case "sante":
      // Croix médicale + cœur
      return (
        <svg
          className="lk-domain-icon"
          viewBox="0 0 32 32"
          aria-hidden="true"
        >
          <rect
            x="6"
            y="6"
            width="20"
            height="20"
            rx="6"
            fill="#0A2A43"
          />
          <rect x="14" y="10" width="4" height="12" fill="#ffffff" />
          <rect x="10" y="14" width="12" height="4" fill="#ffffff" />
          <path
            d="M22 23c-1.6 1.5-3 2.4-3 2.4S17.6 24.5 16 23c-1.1-1-1.6-2-1.6-3.1C14.4 18.9 15.4 18 16.6 18c0.7 0 1.4 0.3 1.9 0.8 0.5-0.5 1.2-0.8 1.9-0.8 1.2 0 2.2 0.9 2.2 1.9C22.6 21 22.1 22 22 23z"
            fill="#FF4B8B"
          />
        </svg>
      );
    case "orga":
      // Checklist / planning
      return (
        <svg
          className="lk-domain-icon"
          viewBox="0 0 32 32"
          aria-hidden="true"
        >
          <rect
            x="7"
            y="6"
            width="18"
            height="20"
            rx="3"
            fill="#0A2A43"
          />
          <rect
            x="10"
            y="9"
            width="12"
            height="14"
            rx="2"
            fill="#ffffff"
            opacity="0.95"
          />
          <path
            d="M12 13l1.5 1.5L16 12"
            stroke="#18A0FB"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="12"
            y1="17.5"
            x2="18"
            y2="17.5"
            stroke="#FF4B8B"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "relations":
      // Deux profils qui se rejoignent
      return (
        <svg
          className="lk-domain-icon"
          viewBox="0 0 32 32"
          aria-hidden="true"
        >
          <rect
            x="4"
            y="8"
            width="24"
            height="16"
            rx="8"
            fill="#0A2A43"
          />
          <circle cx="12" cy="16" r="3" fill="#ffffff" />
          <circle cx="20" cy="16" r="3" fill="#ffffff" />
          <path
            d="M9 20c1.1-1 2-1.5 3-1.5s1.9 0.5 3 1.5"
            stroke="#FF4B8B"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M17 20c1.1-1 2-1.5 3-1.5s1.9 0.5 3 1.5"
            stroke="#18A0FB"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "mental":
      // Cerveau stylisé
      return (
        <svg
          className="lk-domain-icon"
          viewBox="0 0 32 32"
          aria-hidden="true"
        >
          <rect
            x="8"
            y="8"
            width="16"
            height="16"
            rx="6"
            fill="#0A2A43"
          />
          <path
            d="M14 11c-1.5 0-2.5 1-2.5 2.3 0 0.8 0.3 1.3 0.8 1.8-0.9 0.4-1.3 1.1-1.3 2 0 1.4 1 2.4 2.5 2.4"
            stroke="#ffffff"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M18 11c1.5 0 2.5 1 2.5 2.3 0 0.8-0.3 1.3-0.8 1.8 0.9 0.4 1.3 1.1 1.3 2 0 1.4-1 2.4-2.5 2.4"
            stroke="#FF4B8B"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <line
            x1="16"
            y1="11"
            x2="16"
            y2="21"
            stroke="#18A0FB"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

export default function HomePage() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [results, setResults] = useState<{
    globalScore: number;
    domainScores: Record<string, number>;
  } | null>(null);

  const handleChange = (questionId: string, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleReset = () => {
    setAnswers({});
    setResults(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const allValues: number[] = [];
    const domainScores: Record<string, number> = {};

    domains.forEach((domain) => {
      const values = domain.questions.map((q) => {
        const val = answers[q.id] ?? 5; // par défaut 5/10
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

  const getScoreText = (score: number) => {
    if (score >= 70) return "élevé";
    if (score >= 40) return "intermédiaire";
    return "fragile";
  };

  return (
    <div className="lk-app">
      {/* HEADER */}
      <header className="lk-header">
        <div className="lk-header-inner">
          {/* Logo à gauche, cliquable pour revenir en haut */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("lk-home");
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }}
            style={{
              padding: 0,
              margin: 0,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src="/logo.png"
              alt="Lifekore – Ta vie a un potentiel, mesure-la."
              style={{
                height: 240,
                width: "auto",
                display: "block",
              }}
            />
          </button>

          {/* PHRASE ENTRE LOGO ET BOUTONS */}
          <div
            style={{
              flex: 1,
              marginLeft: 16,
              marginRight: 16,
              fontSize: 24,
              fontWeight: 700,
              lineHeight: 1.3,
              color: "#0A2A43",
              maxWidth: 420,
              textAlign: "center",
              fontFamily:
                "Poppins, Inter, system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
            }}
          >
            Découvre ton LifeKore Identity™.
            <br />
            Comprends où tu te trouves, avance vers où tu veux aller.
          </div>

          {/* Boutons à droite */}
          <nav className="lk-nav">
            <button
              type="button"
              className="lk-button lk-button-primary lk-button-small"
            >
              Se connecter
            </button>
            <button
              type="button"
              className="lk-button lk-button-primary lk-button-small"
            >
              Créer un compte
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN */}
      <main className="lk-main">
        <section id="lk-home" className="lk-section">
          <div className="lk-card lk-card-main lk-card-intro">
            <h1 className="lk-hero-title">
              Mesure ton LifeKore Identity™ et clarifie ton équilibre de vie
            </h1>
            <p>
              Lifekore t&apos;aide à obtenir une photographie honnête et
              structurée de ton équilibre actuel.
            </p>
            <p>
              En quelques questions, tu obtiens un{" "}
              <strong>score global</strong> et des{" "}
              <strong>scores détaillés</strong> dans six domaines essentiels.
            </p>
            <p>
              Il n&apos;existe pas de bonne ou de mauvaise réponse : seulement
              une vision claire pour avancer.
            </p>
            {/* ÉCHELLE UTILISÉE – on garde le style bleu actuel via CSS */}
            <div className="lk-scale-info">
              Échelle utilisée :{" "}
              <strong>1 = très faible, 10 = excellent.</strong>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="lk-card lk-card-main"
            style={{ marginTop: 16 }}
          >
            {domains.map((domain) => (
              <div key={domain.id} className="lk-domain-block">
                <div className="lk-domain-header">
                  <div className="lk-domain-title-row">
                    <DomainIcon id={domain.id} />
                    <h2>{domain.label}</h2>
                  </div>
                  <p className="lk-domain-description">
                    {domain.description}
                  </p>
                </div>

                <div className="lk-domain-questions">
                  {domain.questions.map((question) => {
                    const value = answers[question.id] ?? 5;
                    return (
                      <div key={question.id} className="lk-question-row">
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
                    Ce score est la moyenne de l&apos;ensemble de tes réponses,
                    ramenée sur 100. Ce n&apos;est pas une note absolue, mais
                    une photographie de ta situation actuelle.
                  </p>
                  <p>
                    Ton LifeScore global est{" "}
                    <strong>{getScoreText(results.globalScore)}</strong>.
                  </p>
                  <p>
                    Utilise ce score comme un point de départ : tu peux refaire
                    le questionnaire régulièrement pour suivre l&apos;évolution
                    de ton LifeScore au fil des semaines ou des mois.
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
                <h2>Ce que ton LifeScore suggère</h2>
                <ul className="lk-list">
                  <li>
                    Les domaines au-dessus de 70/100 sont tes points forts
                    actuels.
                  </li>
                  <li>
                    Les domaines entre 40 et 70/100 sont « stables » mais
                    pourraient être améliorés.
                  </li>
                  <li>
                    Les domaines en dessous de 40/100 méritent une attention
                    prioritaire.
                  </li>
                </ul>
              </div>

              <div className="lk-results-block">
                <h2>Et maintenant, concrètement ?</h2>
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
                    l&apos;évolution.
                  </li>
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
                          block: "start",
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

        {/* À PROPOS */}
        <section id="lk-about" className="lk-section">
          <div className="lk-card lk-card-main" style={{ marginTop: 20 }}>
            <h2 style={{ textAlign: "center" }}>À propos de Lifekore</h2>
            <p>
              Lifekore est une plateforme conçue pour t&apos;aider à comprendre
              ton <strong>LifeKore Identity™</strong> : la structure réelle de
              ton équilibre de vie.
            </p>
            <p>
              En évaluant six domaines essentiels — finances, activité,
              santé/énergie, organisation, relations et état mental — Lifekore
              offre une vision claire de ta situation actuelle.
            </p>
            <p>
              L&apos;objectif n&apos;est pas la perfection, mais la
              compréhension : identifier ce qui va bien, ce qui peut être
              amélioré, et avancer étape par étape.
            </p>
            <ul className="lk-list">
              <li>suivre ton ressenti et ton équilibre au fil du temps ;</li>
              <li>
                voir si tes actions ont un impact réel sur ton quotidien ;
              </li>
              <li>
                te concentrer sur un seul domaine à la fois, sans te disperser.
              </li>
            </ul>
            <p>
              Tu peux recalculer ton LifeKore Identity™ aussi souvent que tu le
              souhaites pour suivre ton évolution. Ton identité évolue. Lifekore
              t&apos;aide à la maîtriser.
            </p>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="lk-footer">
        <div className="lk-footer-inner">
          Lifekore · Ta vie a un potentiel, mesure-la.
        </div>
      </footer>
    </div>
  );
}