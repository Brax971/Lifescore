"use client";

import { useState } from "react";

export default function Home() {
  // ÉTAT DE LA PAGE : formulaire ou résultats
  const [step, setStep] = useState("form"); // "form" | "result"

  // VALEURS DU FORMULAIRE
  const emptyForm = {
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
  };

  const [formData, setFormData] = useState(emptyForm);

  // MISE À JOUR D'UN CHAMP
  const update = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: Number(value) }));
  };

  // CALCUL DU SCORE GLOBAL
  const calculateScore = () => {
    const values = Object.values(formData);
    const sum = values.reduce((a, b) => a + b, 0);
    const max = values.length * 5;
    if (max === 0) return 0;
    return Math.round((sum / max) * 100);
  };

  const score = calculateScore();

  // REVENIR À L'ACCUEIL (FORMULAIRE VIDÉ)
  const goHome = () => {
    setFormData(emptyForm);
    setStep("form");
  };

  return (
    <>
      {/* HEADER FIXE */}
      <header className="ls-header">
        <div className="ls-header-inner">
          <div className="ls-logo" onClick={goHome} style={{ cursor: "pointer" }}>
            LifeScore.ai
          </div>

          <nav className="ls-nav">
            <button
              type="button"
              className="ls-nav-link"
              onClick={goHome}
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

      {/* CONTENU PRINCIPAL */}
      <main className="ls-main">
        {/* FORMULAIRE */}
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
              <input
                type="range"
                min="0"
                max="5"
                value={formData.finances1}
                onChange={(e) => update("finances1", e.target.value)}
              />

              <label>Gestion du budget</label>
              <input
                type="range"
                min="0"
                max="5"
                value={formData.finances2}
                onChange={(e) => update("finances2", e.target.value)}
              />

              <label>Poids des dettes</label>
              <input
                type="range"
                min="0"
                max="5"
                value={formData.finances3}
                onChange={(e) => update("finances3", e.target.value)}
              />

              {/* TRAVAIL / ACTIVITÉ */}
              <h2 className="ls-block-title">Travail / activité</h2>

              <label>Confiance dans ton travail / activité</label>
              <input
                type="range"
                min="0"
                max="5"
                value={formData.travail1}
                onChange={(e) => update("travail1", e.target.value)}
              />

              <label>Sens de ton activité</label>
              <input
                type="range"
                min="0"
                max="5"
                value={formData.travail2}
                onChange={(e) => update("travail2", e.target.value)}
              />

              <label>Niveau d’énergie au travail</label>
              <input
                type="range"
                min="0"
                max="5"
                value={formData.travail3}
                onChange={(e) => update("travail3", e.target.value)}
              />

              {/* SANTÉ / ÉNERGIE */}
              <h2 className="ls-block-title">Santé / énergie</h2>

              <label>Niveau d’énergie sur une semaine moyenne</label>
              <input
                type="range"
                min="0"
                max="5"
                value={formData.sante1}
                onChange={(e) => update("sante1", e.target.value)}
              />

              <label>Santé globale actuelle</label>
              <input
                type="range"
                min="0"
                max="5"
                value={formData.sante2}
                onChange={(e) => update("sante2", e.target.value)}
              />

              {/* ORGANISATION / ADMIN */}
              <h2 className="ls-block-title">Organisation / administratif</h2>

              <label>Suivi de tes papiers / démarches</label>
              <input
                type="range"
                min="0"
                max="5"
                value={formData.organisation1}
                onChange={(e) => update("organisation1", e.target.value)}
              />

              <label>Gestion de ton temps / priorités</label>
              <input
                type="range"
                min="0"
                max="5"
                value={formData.organisation2}
                onChange={(e) => update("organisation2", e.target.value)}
              />

              {/* RELATIONS / ENTOURAGE */}
              <h2 className="ls-block-title">Relations / entourage</h2>

              <label>Qualité de tes relations proches</label>
              <input
                type="range"
                min="0"
                max="5"
                value={formData.entourage1}
                onChange={(e) => update("entourage1", e.target.value)}
              />

              <label>Soutien que tu ressens autour de toi</label>
              <input
                type="range"
                min="0"
                max="5"
                value={formData.entourage2}
                onChange={(e) => update("entourage2", e.target.value)}
              />

              {/* ÉTAT MENTAL / RESSENTI */}
              <h2 className="ls-block-title">État mental / ressenti</h2>

              <label>Niveau de stress global</label>
              <input
                type="range"
                min="0"
                max="5"
                value={formData.mental1}
                onChange={(e) => update("mental1", e.target.value)}
              />

              <label>Sensation de bien-être intérieur</label>
              <input
                type="range"
                min="0"
                max="5"
                value={formData.mental2}
                onChange={(e) => update("mental2", e.target.value)}
              />

              <button
                className="ls-button"
                onClick={() => setStep("result")}
              >
                Voir mon LifeScore
              </button>
            </div>
          </div>
        )}

        {/* RÉSULTATS */}
        {step === "result" && (
          <div className="ls-container">
            <h1 className="ls-title">Ton LifeScore global</h1>

            <div className="ls-score-circle">
              <span className="ls-score-main">{score}</span>
              <span className="ls-score-max">/100</span>
            </div>

            <p className="ls-subtitle">
              Ce score est une photographie rapide de ton équilibre global.
            </p>

            <button className="ls-button" onClick={goHome}>
              Refaire le questionnaire
            </button>
          </div>
        )}

        {/* SECTION À PROPOS */}
        <section id="apropos" className="ls-about">
          <h2>À propos de LifeScore.ai</h2>
          <p>
            LifeScore.ai est un outil expérimental qui propose une estimation
            simple de ton équilibre de vie à partir de quelques questions.
            Aucune de tes réponses n’est enregistrée côté serveur.
          </p>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="ls-footer">
        © {new Date().getFullYear()} LifeScore.ai — Bilan de vie expérimental.
      </footer>
    </>
  );
}