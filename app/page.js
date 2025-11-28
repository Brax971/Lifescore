"use client";

import { useState } from "react";

export default function Home() {
  // ÉTAT DU QUESTIONNAIRE
  const [step, setStep] = useState("form"); // form | result

  // VALEURS DU FORMULAIRE
  const [formData, setFormData] = useState({
    finances1: 0,
    finances2: 0,
    finances3: 0,

    travail1: 0,
    travail2: 0,
    travail3: 0,

    sante1: 0,
    sante2: 0,

    organisation1: 0,
    organisation2: 0,

    entourage1: 0,
    entourage2: 0,

    mental1: 0,
    mental2: 0,
  });

  // GESTION MODIFICATION FORM
  const update = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: Number(value) }));
  };

  // CALCUL DU SCORE
  const calculateScore = () => {
    const values = Object.values(formData);
    const sum = values.reduce((a, b) => a + b, 0);
    const max = values.length * 5;
    return Math.round((sum / max) * 100);
  };

  const score = calculateScore();

  // RÉINITIALISER
  const resetAll = () => {
    window.location.href = "/";
  };

  return (
    <>
      {/* HEADER FIXE */}
      <header className="ls-header">
        <div className="ls-header-inner">
          <div
            className="ls-logo"
            onClick={() => (window.location.href = "/")}
            style={{ cursor: "pointer" }}
          >
            LifeScore.ai
          </div>

          <nav className="ls-nav">
            <button
              type="button"
              className="ls-nav-link"
              onClick={() => (window.location.href = "/")}
            >
              Accueil
            </button>

            <button
              type="button"
              className="ls-nav-link"
              onClick={() => {
                const el = document.getElementById("apropos");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              À propos
            </button>
          </nav>
        </div>
      </header>

      {/* CONTENU */}
      <main className="ls-main">
        {/* PAGE FORMULAIRE */}
        {step === "form" && (
          <div className="ls-container">

            <h1 className="ls-title">Calcule ton LifeScore en 2 minutes.</h1>
            <p className="ls-subtitle">
              Réponds simplement aux questions ci-dessous.
            </p>

            <div className="ls-form">

              {/* FINANCES */}
              <h2 className="ls-block-title">Finances</h2>
              <label>Situation financière globale</label>
              <input type="range" min="0" max="5"
                onChange={(e) => update("finances1", e.target.value)} />

              <label>Gestion du budget</label>
              <input type="range" min="0" max="5"
                onChange={(e) => update("finances2", e.target.value)} />

              <label>Poids des dettes</label>
              <input type="range" min="0" max="5"
                onChange={(e) => update("finances3", e.target.value)} />

              {/* TRAVAIL */}
              <h2 className="ls-block-title">Travail / activité</h2>
              <label>Confiance dans ton travail</label>
              <input type="range" min="0" max="5"
                onChange={(e) => update("travail1", e.target.value)} />

              <label>Sens de ton activité</label>
              <input type="range" min="0" max="5"
                onChange={(e) => update("travail2", e.target.value)} />

              <label>Énergie au travail</label>
              <input type="range" min="0" max="5"
                onChange={(e) => update("travail3", e.target.value)} />

              {/* SANTÉ */}
              <h2 className="ls-block-title">Santé / énergie</h2>
              <label>Niveau d’énergie</label>
              <input type="range" min="0" max="5"
                onChange={(e) => update("sante1", e.target.value)} />

              <label>Santé globale</label>
              <input type="range" min="0" max="5"
                onChange={(e) => update("sante2", e.target.value)} />

              {/* ORGANISATION */}
              <h2 className="ls-block-title">Organisation</h2>
              <label>Gestion administrative</label>
              <input type="range" min="0" max="5"
                onChange={(e) => update("organisation1", e.target.value)} />

              <label>Gestion du temps</label>
              <input type="range" min="0" max="5"
                onChange={(e) => update("organisation2", e.target.value)} />

              {/* ENTOURAGE */}
              <h2 className="ls-block-title">Relations / entourage</h2>
              <label>Qualité des relations proches</label>
              <input type="range" min="0" max="5"
                onChange={(e) => update("entourage1", e.target.value)} />

              <label>Soutien émotionnel</label>
              <input type="range" min="0" max="5"
                onChange={(e) => update("entourage2", e.target.value)} />

              {/* MENTAL */}
              <h2 className="ls-block-title">État mental</h2>
              <label>Stress général</label>
              <input type="range" min="0" max="5"
                onChange={(e) => update("mental1", e.target.value)} />

              <label>Bien-être intérieur</label>
              <input type="range" min="0" max="5"
                onChange={(e) => update("mental2", e.target.value)} />

              <button
                className="ls-button"
                onClick={() => setStep("result")}
              >
                Voir mon LifeScore
              </button>
            </div>
          </div>
        )}

        {/* PAGE RESULTAT */}
        {step === "result" && (
          <div className="ls-container">
            <h1 className="ls-title">Ton LifeScore global</h1>

            <div className="ls-score-circle">{score}</div>

            <p className="ls-subtitle">Analyse détaillée</p>

            <button className="ls-button" onClick={resetAll}>
              Refaire le questionnaire
            </button>
          </div>
        )}

        {/* SECTION À PROPOS */}
        <section id="apropos" className="ls-about">
          <h2>À propos de LifeScore.ai</h2>
          <p>
            LifeScore.ai est un outil expérimental permettant d’obtenir
            une estimation simple de ton équilibre global de vie à partir
            de questions objectives. Aucune donnée n’est stockée.
          </p>
        </section>
      </main>

      {/* FOOTER UNIQUE */}
      <footer className="ls-footer">
        © {new Date().getFullYear()} LifeScore.ai — Bilan de vie expérimental.
      </footer>
    </>
  );
}