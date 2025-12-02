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
      { id: "job_confiance", label: "Confiance dans ton travail / activité" },
      { id: "job_sens", label: "Sens de ton activité" },
    ],
  },
  {
    id: "sante",
    label: "Santé / énergie",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      { id: "sante_energie", label: "Niveau d'énergie global" },
      { id: "sante_hygiene", label: "Qualité de ton hygiène de vie" },
    ],
  },
  {
    id: "orga",
    label: "Organisation / administratif",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      { id: "orga_quotidien", label: "Organisation de ton quotidien" },
      { id: "orga_admin", label: "Gestion de l'administratif" },
    ],
  },
  {
    id: "relations",
    label: "Relations / entourage",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      { id: "rel_soutien", label: "Soutien ressenti de la part ton entourage" },
      { id: "rel_temps", label: "Temps de qualité partagé avec les proches" },
    ],
  },
  {
    id: "mental",
    label: "État mental / ressenti",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      { id: "mental_humeur", label: "Humeur générale en ce moment" },
      { id: "mental_motivation", label: "Motivation pour avancer dans tes projets" },
    ],
  },
];

export default function HomePage() {
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);

  const handleChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
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

      const avgDomain =
        values.reduce((sum, v) => sum + v, 0) / values.length || 0;

      domainScores[domain.label] = Math.round(avgDomain * 10);
    });

    const globalAvg =
      allValues.length > 0
        ? allValues.reduce((sum, v) => sum + v, 0) / allValues.length
        : 0;

    const globalScore = Math.round(globalAvg * 10);

    setResults({ globalScore, domainScores });

    const el = document.getElementById("lk-results");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
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
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("lk-home");
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
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
              style={{ height: 240, width: "auto", display: "block" }}
            />
          </button>

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

          <nav className="lk-nav">
            <button type="button" className="lk-button lk-button-primary lk-button-small">
              Se connecter
            </button>
            <button type="button" className="lk-button lk-button-primary lk-button-small">
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

            <p style={{ textAlign: "center" }}>
              Lifekore t'aide à obtenir une photographie honnête et structurée de ton
              équilibre actuel.
            </p>

            <p style={{ textAlign: "center" }}>
              En quelques questions, tu obtiens un <strong>score global</strong> et des{" "}
              <strong>scores détaillés</strong> dans six domaines essentiels.
            </p>

            <p style={{ textAlign: "center" }}>
              Il n'existe pas de bonne ou de mauvaise réponse : seulement une vision
              claire pour avancer.
            </p>

            <div
              className="lk-scale-info"
              style={{
                backgroundColor: "#0A2A43",
                color: "#FFFFFF",
                textAlign: "center",
              }}
            >
              Échelle utilisée : <strong>1 = très faible, 10 = excellent.</strong>
            </div>
          </div>

          {/* FORMULAIRE PRINCIPAL */}
          <form onSubmit={handleSubmit} className="lk-card lk-card-main" style={{ marginTop: 16 }}>
            {domains.map((domain) => (
              <div key={domain.id} className="lk-domain-block">
                <div className="lk-domain-header">
                  <h2>{domain.label}</h2>
                  <p className="lk-domain-description">{domain.description}</p>
                </div>

                <div className="lk-domain-questions">
                  {domain.questions.map((question) => {
                    const value = answers[question.id] ?? 5;
                    return (
                      <div key={question.id} className="lk-question-row">
                        <div className="lk-question-label-row">
                          <p className="lk-question-label">{question.label}</p>
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
                              handleChange(question.id, Number(e.target.value))
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
              <div className="lk-results-header">
                <div className="lk-circle-score">
                  <div className="lk-circle-score-inner">
                    <div className="lk-circle-score-value">{results.globalScore}</div>
                    <div className="lk-circle-score-label">/100</div>
                  </div>
                </div>

                <div className="lk-results-title">
                  <h1>Ton LifeScore global</h1>
                  <p>
                    Ce score est la moyenne de l’ensemble de tes réponses, ramenée sur 100.
                  </p>
                  <p>
                    Ton LifeScore global est <strong>{getScoreText(results.globalScore)}</strong>.
                  </p>
                </div>
              </div>

              <div className="lk-results-block">
                <h2>Scores par domaine</h2>
                <div className="lk-domain-scores">
                  {Object.entries(results.domainScores).map(([label, score]) => (
                    <div key={label} className="lk-domain-score-row">
                      <div className="lk-domain-score-header">
                        <span className="lk-domain-score-label">{label}</span>
                        <span className="lk-domain-score-value">{score}/100</span>
                      </div>
                      <div className="lk-domain-score-bar">
                        <div
                          className="lk-domain-score-bar-fill"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lk-results-block">
                <h2>Ce que ton LifeScore suggère</h2>
                <ul className="lk-list">
                  <li>Les domaines au-dessus de 70/100 sont tes points forts.</li>
                  <li>Entre 40 et 70/100 : domaines stables mais perfectibles.</li>
                  <li>En dessous de 40/100 : priorité d'amélioration.</li>
                </ul>
              </div>

              <div className="lk-results-block">
                <h2>Et maintenant ?</h2>
                <ul className="lk-list">
                  <li>Choisis un seul domaine à travailler.</li>
                  <li>Note 1 à 3 actions simples pour cette semaine.</li>
                  <li>Refais le test dans 1 à 2 semaines.</li>
                </ul>

                <div className="lk-actions-row" style={{ marginTop: 16 }}>
                  <button
                    type="button"
                    className="lk-button lk-button-secondary"
                    onClick={() => {
                      const el = document.getElementById("lk-home");
                      if (el)
                        el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                  >
                    Refaire le questionnaire
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* À PROPOS — VERSION CENTRÉE */}
        <section id="lk-about" className="lk-section">
          <div className="lk-card lk-card-main" style={{ marginTop: 20 }}>
            
            <h2 style={{ textAlign: "center" }}>À propos de Lifekore</h2>

            <p style={{ textAlign: "center" }}>
              Lifekore est une plateforme conçue pour t'aider à comprendre ton 
              <strong> LifeKore Identity™</strong> : la structure réelle de ton équilibre de vie.
            </p>

            <p style={{ textAlign: "center" }}>
              En évaluant six domaines essentiels, Lifekore t’offre une vision claire 
              et honnête de ta situation actuelle :
            </p>

            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "16px 0",
                textAlign: "center",
                lineHeight: 1.6,
                fontWeight: 600,
                color: "#0A2A43",
              }}
            >
              <li>1 — Finances</li>
              <li>2 — Travail / activité</li>
              <li>3 — Santé / énergie</li>
              <li>4 — Organisation / administratif</li>
              <li>5 — Relations / entourage</li>
              <li>6 — État mental / ressenti</li>
            </ul>

            <p style={{ textAlign: "center" }}>
              L'objectif n’est pas la perfection, mais la compréhension : identifier 
              ce qui va bien, ce qui peut être amélioré, et avancer étape par étape.
            </p>

            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "16px 0",
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              <li>• suivre ton ressenti au fil du temps ;</li>
              <li>• voir si tes actions ont un impact réel ;</li>
              <li>• te focaliser sur un seul domaine à la fois.</li>
            </ul>

            <p style={{ textAlign: "center" }}>
              Tu peux recalculer ton LifeKore Identity™ aussi souvent que tu le souhaites 
              pour suivre ton évolution. Ton identité évolue : Lifekore t’aide à la maîtriser.
            </p>

          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="lk-footer">
        <div
          className="lk-footer-inner"
          style={{ width: "100%", textAlign: "center", fontSize: 12 }}
        >
          <strong>Lifekore</strong> · LifeKore Identity™ – Mesure gratuite de ton équilibre de vie.
          <br />
          © {new Date().getFullYear()} Lifekore. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}