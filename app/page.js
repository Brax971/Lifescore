// app/page.js
"use client";

import { useState } from "react";

// Valeurs initiales des curseurs (1 à 10)
const INITIAL_DATA = {
  // Finances
  finances_situation: 5,
  finances_budget: 5,
  finances_debt: 5,
  // Travail / activité
  work_satisfaction: 5,
  work_meaning: 5,
  work_energy: 5,
  // Santé / énergie
  health_energy: 5,
  health_sleep: 5,
  health_stress: 5,
  // Organisation / administratif
  admin_organisation: 5,
  admin_papers: 5,
  // Relations / entourage
  relations_support: 5,
  relations_time: 5,
  // État mental / ressenti
  mood_general: 5,
  mood_motivation: 5,
};

const DOMAINS = {
  finances: {
    label: "Finances",
    fields: ["finances_situation", "finances_budget", "finances_debt"],
  },
  work: {
    label: "Travail / activité",
    fields: ["work_satisfaction", "work_meaning", "work_energy"],
  },
  health: {
    label: "Santé / énergie",
    fields: ["health_energy", "health_sleep", "health_stress"],
  },
  admin: {
    label: "Organisation / administratif",
    fields: ["admin_organisation", "admin_papers"],
  },
  relations: {
    label: "Relations / entourage",
    fields: ["relations_support", "relations_time"],
  },
  mood: {
    label: "État mental / ressenti",
    fields: ["mood_general", "mood_motivation"],
  },
};

function computeScores(data) {
  const domainScores = {};

  Object.entries(DOMAINS).forEach(([key, domain]) => {
    const values = domain.fields.map((f) => Number(data[f] || 0));
    const avg = values.reduce((a, b) => a + b, 0) / values.length || 0;
    domainScores[key] = Math.round(avg * 10); // /100
  });

  const allValues = Object.values(data).map((v) => Number(v || 0));
  const globalAvg =
    allValues.reduce((a, b) => a + b, 0) / (allValues.length || 1);
  const globalScore = Math.round(globalAvg * 10);

  return { globalScore, domainScores };
}

function getSummary(globalScore) {
  if (globalScore < 40) {
    return {
      title: "Phase compliquée mais pas figée.",
      text:
        "Ton LifeScore global indique une période difficile. L’objectif n’est pas de te juger, mais de t’aider à identifier les points les plus urgents et les premières actions concrètes pour remonter progressivement.",
    };
  }
  if (globalScore < 70) {
    return {
      title: "Situation intermédiaire, avec une vraie marge de progression.",
      text:
        "Tu vis une phase où tout n’est pas simple, mais tu as déjà des bases solides. En travaillant sur quelques domaines clés, tu peux rapidement améliorer ton confort de vie global.",
    };
  }
  return {
    title: "Base de vie plutôt solide.",
    text:
      "Ton LifeScore global est élevé. Tu sembles avoir trouvé un certain équilibre, même si certains domaines peuvent encore être affinés pour consolider cette stabilité.",
  };
}

function getStrengthsAndPriorities(domainScores) {
  const entries = Object.entries(domainScores);
  // tri du plus élevé au plus faible
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);

  const top = sorted.slice(0, 2);
  const bottom = sorted.slice(-2);

  const strengths = top.map(
    ([key, score]) => `${DOMAINS[key].label} : ${score}/100`
  );
  const priorities = bottom.map(
    ([key, score]) => `${DOMAINS[key].label} : ${score}/100`
  );

  return { strengths, priorities };
}

export default function Home() {
  const [mode, setMode] = useState("form"); // "form" | "result" | "about"
  const [formData, setFormData] = useState(INITIAL_DATA);
  const [result, setResult] = useState(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Number(value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const scores = computeScores(formData);
    setResult(scores);
    setMode("result");
  };

  const handleReset = () => {
    setFormData(INITIAL_DATA);
    setResult(null);
    setMode("form");
  };

  const handleGoHome = () => {
    setMode("form");
  };

  // Contenu principal selon le mode
  let mainContent;

  if (mode === "about") {
    mainContent = (
      <main className="ls-main">
        <section className="ls-card">
          <h1>À propos de LifeScore.ai</h1>
          <p>
            LifeScore.ai est un outil expérimental qui calcule un{" "}
            <strong>score de vie global</strong> à partir de différentes
            dimensions du quotidien : finances, travail, santé, organisation,
            relations et état mental.
          </p>
          <p>
            L’objectif n’est pas de coller une « note » à ta vie, mais de te
            donner un <strong>repère chiffré</strong> et un{" "}
            <strong>langage simple</strong> pour analyser ta situation et
            décider des prochaines actions.
          </p>
          <p>
            Les réponses ne sont pas enregistrées côté serveur. Tout se calcule
            directement dans ton navigateur, pour te permettre d’expérimenter
            librement, sans pression.
          </p>
          <p>
            Ce projet est une <strong>V1 de démonstration</strong>. La vision à
            terme : un tableau de bord personnel, des suivis dans le temps, et
            des pistes d’amélioration plus détaillées, générées par
            l’intelligence artificielle.
          </p>
        </section>
      </main>
    );
  } else if (mode === "result" && result) {
    const { globalScore, domainScores } = result;
    const summary = getSummary(globalScore);
    const { strengths, priorities } = getStrengthsAndPriorities(domainScores);

    mainContent = (
      <main className="ls-main">
        <section className="ls-card">
          <header className="ls-result-header">
            <div className="ls-score-circle">
              <div className="ls-score-value">{globalScore}</div>
              <div className="ls-score-max">/100</div>
            </div>
            <div className="ls-result-text">
              <h1>Ton LifeScore global</h1>
              <p>
                Ce score est la moyenne de l’ensemble de tes réponses, convertie
                sur 100. Il ne représente pas une vérité absolue, mais une
                <strong> photographie de ta situation actuelle</strong> à
                partir de ton ressenti.
              </p>
              <p>
                Utilise-le comme un <strong>point de départ</strong> : tu peux
                refaire le questionnaire régulièrement pour suivre l’évolution
                de ton LifeScore au fil des semaines ou des mois.
              </p>
            </div>
          </header>

          <section className="ls-section">
            <h2>Scores par domaine</h2>
            <div className="ls-domain-list">
              {Object.entries(DOMAINS).map(([key, domain]) => (
                <div key={key} className="ls-domain-row">
                  <div className="ls-domain-header">
                    <span className="ls-domain-label">{domain.label}</span>
                    <span className="ls-domain-score">
                      {domainScores[key]}/100
                    </span>
                  </div>
                  <div className="ls-bar-outer">
                    <div
                      className="ls-bar-inner"
                      style={{ width: `${domainScores[key]}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="ls-section ls-section-grid">
            <div>
              <h3>Tes forces actuelles</h3>
              <ul>
                {strengths.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Axes prioritaires</h3>
              <ul>
                {priorities.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="ls-section">
            <h2>{summary.title}</h2>
            <p>{summary.text}</p>
            <p>
              Pour aller plus loin, tu peux te fixer{" "}
              <strong>1 ou 2 objectifs simples</strong> sur les prochains
              jours&nbsp;:
            </p>
            <ul>
              <li>
                choisir un domaine prioritaire et noter une première action
                concrète ;
              </li>
              <li>
                refaire le questionnaire après quelques semaines pour voir si
                ton ressenti a évolué ;
              </li>
              <li>
                utiliser ce score comme base pour en parler avec une personne
                de confiance ou un professionnel si besoin.
              </li>
            </ul>
          </section>

          <div className="ls-actions">
            <button type="button" className="ls-button-secondary" onClick={handleGoHome}>
              Retour à l’accueil
            </button>
            <button type="button" className="ls-button-primary" onClick={handleReset}>
              Refaire le questionnaire
            </button>
          </div>
        </section>
      </main>
    );
  } else {
    // MODE FORM (accueil)
    mainContent = (
      <main className="ls-main">
        <section className="ls-card">
          <header className="ls-hero-header">
            <h1>Calcule ton LifeScore en 2 minutes.</h1>
            <p className="ls-hero-intro">
              Ce questionnaire a été conçu pour t’aider à prendre du recul sur
              ta situation. En quelques questions, tu obtiens un{" "}
              <strong>score global</strong> et des{" "}
              <strong>scores par domaine</strong> (finances, travail, santé,
              relations, etc.).
            </p>
            <p className="ls-hero-intro">
              Réponds <strong>honnêtement</strong>, sans te juger. Il n’existe
              pas de « bonne » réponse : l’important, c’est ce que{" "}
              <strong>toi</strong> tu ressens aujourd’hui.
            </p>
            <p className="ls-hero-note">
              Échelle utilisée : <strong>1 = très faible</strong>,{" "}
              <strong>10 = excellent</strong>.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="ls-form">
            {/* FINANCES */}
            <section className="ls-section">
              <h2>Finances</h2>
              <p className="ls-scale-help">
                1 = très mauvaise, 10 = excellente.
              </p>

              <QuestionSlider
                label="Situation financière globale"
                field="finances_situation"
                value={formData.finances_situation}
                onChange={handleChange}
              />
              <QuestionSlider
                label="Gestion du budget"
                field="finances_budget"
                value={formData.finances_budget}
                onChange={handleChange}
              />
              <QuestionSlider
                label="Poids des dettes"
                field="finances_debt"
                value={formData.finances_debt}
                onChange={handleChange}
              />
            </section>

            {/* TRAVAIL / ACTIVITÉ */}
            <section className="ls-section">
              <h2>Travail / activité</h2>
              <p className="ls-scale-help">
                1 = très insatisfaisant, 10 = très satisfaisant.
              </p>

              <QuestionSlider
                label="Confiance dans ton travail / activité"
                field="work_satisfaction"
                value={formData.work_satisfaction}
                onChange={handleChange}
              />
              <QuestionSlider
                label="Sens de ton activité"
                field="work_meaning"
                value={formData.work_meaning}
                onChange={handleChange}
              />
              <QuestionSlider
                label="Niveau d’énergie au travail"
                field="work_energy"
                value={formData.work_energy}
                onChange={handleChange}
              />
            </section>

            {/* SANTÉ / ÉNERGIE */}
            <section className="ls-section">
              <h2>Santé / énergie</h2>
              <p className="ls-scale-help">
                1 = très faible, 10 = très bon.
              </p>

              <QuestionSlider
                label="Niveau d’énergie sur une semaine moyenne"
                field="health_energy"
                value={formData.health_energy}
                onChange={handleChange}
              />
              <QuestionSlider
                label="Qualité moyenne du sommeil"
                field="health_sleep"
                value={formData.health_sleep}
                onChange={handleChange}
              />
              <QuestionSlider
                label="Niveau de stress ressenti"
                field="health_stress"
                value={formData.health_stress}
                onChange={handleChange}
              />
            </section>

            {/* ORGANISATION / ADMIN */}
            <section className="ls-section">
              <h2>Organisation / administratif</h2>

              <QuestionSlider
                label="Sentiment d’organisation au quotidien"
                field="admin_organisation"
                value={formData.admin_organisation}
                onChange={handleChange}
              />
              <QuestionSlider
                label="Gestion des papiers, factures, démarches"
                field="admin_papers"
                value={formData.admin_papers}
                onChange={handleChange}
              />
            </section>

            {/* RELATIONS */}
            <section className="ls-section">
              <h2>Relations / entourage</h2>

              <QuestionSlider
                label="Soutien ressenti de la part de ton entourage"
                field="relations_support"
                value={formData.relations_support}
                onChange={handleChange}
              />
              <QuestionSlider
                label="Temps de qualité partagé avec les proches"
                field="relations_time"
                value={formData.relations_time}
                onChange={handleChange}
              />
            </section>

            {/* ÉTAT MENTAL */}
            <section className="ls-section">
              <h2>État mental / ressenti</h2>

              <QuestionSlider
                label="Humeur générale en ce moment"
                field="mood_general"
                value={formData.mood_general}
                onChange={handleChange}
              />
              <QuestionSlider
                label="Motivation pour avancer dans tes projets"
                field="mood_motivation"
                value={formData.mood_motivation}
                onChange={handleChange}
              />
            </section>

            <div className="ls-actions">
              <button type="button" className="ls-button-secondary" onClick={handleReset}>
                Réinitialiser les réponses
              </button>
              <button type="submit" className="ls-button-primary">
                Calculer mon LifeScore
              </button>
            </div>
          </form>
        </section>
      </main>
    );
  }

  return (
    <div className="ls-page">
      {/* HEADER */}
      <header className="ls-header">
        <div className="ls-header-inner">
          <div className="ls-logo">LifeScore.ai</div>
          <nav className="ls-nav">
            <button
              type="button"
              className={`ls-nav-link ${mode === "form" ? "is-active" : ""}`}
              onClick={handleGoHome}
            >
              Accueil
            </button>
            <button
              type="button"
              className={`ls-nav-link ${mode === "about" ? "is-active" : ""}`}
              onClick={() => setMode("about")}
            >
              À propos
            </button>
          </nav>
        </div>
      </header>

      {mainContent}

      {/* FOOTER */}
      <footer className="ls-footer">
        <div className="ls-footer-inner">
          <span>© {new Date().getFullYear()} LifeScore.ai – Bilan de vie expérimental.</span>
          <span className="ls-footer-note">
            Les réponses ne sont pas enregistrées côté serveur. Ce site ne fournit pas de conseil
            médical, financier ou psychologique.
          </span>
        </div>
      </footer>
    </div>
  );
}

// Composant curseur 1 → 10 avec graduations visibles
function QuestionSlider({ label, field, value, onChange }) {
  return (
    <div className="ls-question">
      <label className="ls-question-label">
        {label}
        <span className="ls-question-value">{value}/10</span>
      </label>
      <input
        type="range"
        min="1"
        max="10"
        step="1"
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        className="ls-slider"
      />
      <div className="ls-slider-scale">
        {[1,2,3,4,5,6,7,8,9,10].map((n) => (
          <span key={n}>{n}</span>
        ))}
      </div>
    </div>
  );
}