"use client";

import React, { useState } from "react";

const domains = [
  {
    id: "finances",
    label: "Finances",
    icon: "/icons/finances.svg",
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
    icon: "/icons/travail.svg",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      { id: "job_confiance", label: "Confiance dans ton travail / activité" },
      { id: "job_sens", label: "Sens de ton activité" },
    ],
  },
  {
    id: "sante",
    label: "Santé / énergie",
    icon: "/icons/sante.svg",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      { id: "sante_energie", label: "Niveau d'énergie global" },
      { id: "sante_hygiene", label: "Qualité de ton hygiène de vie" },
    ],
  },
  {
    id: "orga",
    label: "Organisation / administratif",
    icon: "/icons/orga.svg",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      { id: "orga_quotidien", label: "Organisation de ton quotidien" },
      { id: "orga_admin", label: "Gestion de l'administratif" },
    ],
  },
  {
    id: "relations",
    label: "Relations / entourage",
    icon: "/icons/relations.svg",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      { id: "rel_soutien", label: "Soutien ressenti de la part ton entourage" },
      { id: "rel_temps", label: "Temps de qualité partagé avec les proches" },
    ],
  },
  {
    id: "mental",
    label: "État mental / ressenti",
    icon: "/icons/mental.svg",
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

  const handleChange = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
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

      const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
      domainScores[domain.label] = Math.round(avg * 10);
    });

    const globalAvg =
      allValues.reduce((sum, v) => sum + v, 0) / allValues.length;

    setResults({
      globalScore: Math.round(globalAvg * 10),
      domainScores,
    });

    document.getElementById("lk-results")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const getScoreText = (s) => {
    if (s >= 70) return "élevé";
    if (s >= 40) return "intermédiaire";
    return "fragile";
  };

  return (
    <div className="lk-app">
      {/* HEADER */}
      <header className="lk-header">
        <div className="lk-header-inner">
          <img
            src="/logo.png"
            alt="LifeKore"
            style={{
              height: 240,
              cursor: "pointer",
            }}
            onClick={() =>
              document.getElementById("lk-home")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          />

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
            }}
          >
            Découvre ton LifeKore Identity™.<br />
            Comprends où tu te trouves, avance vers où tu veux aller.
          </div>

          <nav className="lk-nav">
            <button className="lk-button lk-button-primary lk-button-small">
              Se connecter
            </button>
            <button className="lk-button lk-button-primary lk-button-small">
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

            <p>Lifekore t'aide à obtenir une photographie honnête et structurée de ton équilibre actuel.</p>
            <p>
              En quelques questions, tu obtiens un <strong>score global</strong> et des
              <strong> scores détaillés</strong> dans six domaines essentiels.
            </p>
            <div className="lk-scale-info">
              Échelle utilisée : <strong>1 = très faible, 10 = excellent.</strong>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="lk-card lk-card-main" style={{ marginTop: 16 }}>
            {domains.map((domain) => (
              <div key={domain.id} className="lk-domain-block">
                <div className="lk-domain-header">
                  <h2>
                    <img
                      src={domain.icon}
                      alt=""
                      className="lk-domain-icon"
                    />
                    {domain.label}
                  </h2>
                  <p className="lk-domain-description">{domain.description}</p>
                </div>

                <div className="lk-domain-questions">
                  {domain.questions.map((q) => {
                    const val = answers[q.id] ?? 5;
                    return (
                      <div key={q.id} className="lk-question-row">
                        <div className="lk-question-label-row">
                          <p className="lk-question-label">{q.label}</p>
                          <span className="lk-question-value">{val}/10</span>
                        </div>

                        <div className="lk-slider-wrapper">
                          <input
                            type="range"
                            min={1}
                            max={10}
                            value={val}
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

          {results && (
            <div id="lk-results" className="lk-card lk-card-main" style={{ marginTop: 20 }}>
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
                  <p>Ce score reflète ton état global actuel.</p>
                  <p>
                    Ton LifeScore est <strong>{getScoreText(results.globalScore)}</strong>.
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
                        <div className="lk-domain-score-bar-fill" style={{ width: `${score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lk-results-block">
                <h2>Ce que ton LifeScore suggère</h2>
                <ul className="lk-list">
                  <li>+70 = points forts.</li>
                  <li>40–70 = stables mais à travailler.</li>
                  <li>-40 = prioritaire.</li>
                </ul>
              </div>

              <div className="lk-results-block">
                <h2>Et maintenant ?</h2>
                <ul className="lk-list">
                  <li>Choisis un domaine prioritaire.</li>
                  <li>Note 1 à 3 actions simples.</li>
                  <li>Refais le test dans 1–2 semaines.</li>
                </ul>
              </div>
            </div>
          )}
        </section>

        {/* ABOUT */}
        <section id="lk-about" className="lk-section">
          <div className="lk-card lk-card-main" style={{ marginTop: 20 }}>
            <h2 style={{ textAlign: "center" }}>À propos de Lifekore</h2>

            <p>Lifekore est une plateforme conçue pour t’aider à comprendre ton <strong>LifeKore Identity™</strong>.</p>

            <p>En évaluant six domaines — finances, activité, santé/énergie, organisation, relations, mental — tu obtiens une vision claire de ton équilibre.</p>

            <p>L’objectif : comprendre ce qui va bien, ce qui peut être amélioré, et avancer étape par étape.</p>

            <ul className="lk-list">
              <li>Suivre ton ressenti au fil du temps.</li>
              <li>Voir l’impact réel de tes actions.</li>
              <li>Te concentrer sur un domaine à la fois.</li>
            </ul>

            <p>Tu peux recalculer ton LifeKore Identity™ aussi souvent que tu le souhaites. Ton identité évolue. Lifekore t’aide à la maîtriser.</p>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="lk-footer">
        <div className="lk-footer-inner" style={{ textAlign: "center", width: "100%" }}>
          <p style={{ margin: 0 }}>Lifekore · Ta vie a un potentiel, mesure-la.</p>
          <p style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
            © {new Date().getFullYear()} Lifekore — Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}