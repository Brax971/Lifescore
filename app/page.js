// app/page.js
"use client";

import { useState } from "react";

// Définition du questionnaire
const DOMAINS = [
  {
    id: "finances",
    title: "Finances",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      { key: "fin_situation", label: "Situation financière globale" },
      { key: "fin_budget", label: "Gestion du budget" },
      { key: "fin_dettes", label: "Poids des dettes" },
    ],
  },
  {
    id: "travail",
    title: "Travail / activité",
    description: "1 = très insatisfaisant, 10 = très satisfaisant.",
    questions: [
      {
        key: "job_confiance",
        label: "Confiance dans ton travail / activité",
      },
      { key: "job_sens", label: "Sens de ton activité" },
      { key: "job_energie", label: "Niveau d'énergie au travail" },
    ],
  },
  {
    id: "sante",
    title: "Santé / énergie",
    description: "1 = très faible, 10 = excellente.",
    questions: [
      {
        key: "health_energie",
        label: "Niveau d'énergie sur une semaine moyenne",
      },
      { key: "health_sommeil", label: "Qualité du sommeil" },
      { key: "health_habitudes", label: "Habitudes de santé (alimentation, sport…)" },
    ],
  },
  {
    id: "organisation",
    title: "Organisation / administratif",
    description: "1 = très chaotique, 10 = très clair et maîtrisé.",
    questions: [
      { key: "org_papiers", label: "Gestion des papiers / administratif" },
      { key: "org_temps", label: "Organisation du temps et des priorités" },
      { key: "org_logement", label: "Gestion du logement / foyer" },
    ],
  },
  {
    id: "relations",
    title: "Relations / entourage",
    description: "1 = très isolé, 10 = très bien entouré.",
    questions: [
      {
        key: "rel_soutien",
        label: "Soutien ressenti de la part de ton entourage",
      },
      {
        key: "rel_temps",
        label: "Temps de qualité partagé avec les proches",
      },
      {
        key: "rel_conflits",
        label: "Niveau de sérénité (peu de conflits, tensions…)",
      },
    ],
  },
  {
    id: "mental",
    title: "État mental / ressenti",
    description: "1 = très bas, 10 = très bon.",
    questions: [
      { key: "mind_humeur", label: "Humeur générale en ce moment" },
      {
        key: "mind_motivation",
        label: "Motivation pour avancer dans tes projets",
      },
      {
        key: "mind_stress",
        label: "Niveau de stress ressenti au quotidien",
      },
    ],
  },
];

// Valeurs initiales : tout à 5/10
function buildInitialAnswers() {
  const initial = {};
  DOMAINS.forEach((domain) => {
    domain.questions.forEach((q) => {
      initial[q.key] = 5;
    });
  });
  return initial;
}

export default function HomePage() {
  const [view, setView] = useState("home"); // "home" | "about"
  const [answers, setAnswers] = useState(buildInitialAnswers);
  const [results, setResults] = useState(null); // null ou objet résultat

  // Mise à jour d'un slider
  const handleChange = (key, value) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
  };

  // Reset des réponses
  const handleReset = () => {
    setAnswers(buildInitialAnswers());
    setResults(null);
    setView("home");
  };

  // Calcul du LifeScore
  const handleSubmit = (e) => {
    e.preventDefault();

    const domainScores = DOMAINS.map((domain) => {
      const values = domain.questions.map((q) => answers[q.key] || 1);
      const avgOn10 =
        values.reduce((sum, v) => sum + v, 0) / values.length;
      const scoreOn100 = Math.round(avgOn10 * 10); // 1–10 → 10–100

      return {
        id: domain.id,
        title: domain.title,
        score: scoreOn100,
      };
    });

    const global =
      domainScores.reduce((sum, d) => sum + d.score, 0) /
      domainScores.length;

    // Interprétation simple pour le texte
    let globalMessage;
    if (global < 40) {
      globalMessage =
        "Ton LifeScore global est bas : tu traverses probablement une période compliquée. L'idée n'est pas de te juger, mais d'identifier clairement les zones à sécuriser en priorité.";
    } else if (global < 70) {
      globalMessage =
        "Ton LifeScore global est intermédiaire : tout n'est pas simple, mais tu as déjà des bases sur lesquelles t'appuyer pour progresser.";
    } else {
      globalMessage =
        "Ton LifeScore global est plutôt élevé : ta situation générale est globalement satisfaisante, même s'il reste toujours des points à peaufiner.";
    }

    const strengths = domainScores
      .filter((d) => d.score >= 70)
      .map((d) => d.title);

    const priorities = domainScores
      .filter((d) => d.score < 50)
      .map((d) => d.title);

    setResults({
      global: Math.round(global),
      domains: domainScores,
      globalMessage,
      strengths,
      priorities,
    });
  };

  const goHome = () => {
    setView("home");
    setResults(null);
  };

  const goAbout = () => {
    setView("about");
    setResults(null);
  };

  return (
    <div className="ls-root">
      {/* HEADER */}
      <header className="ls-header">
        <div className="ls-header-inner">
          <div className="ls-logo">LifeScore.ai</div>
          <nav className="ls-nav">
            <button
              type="button"
              className={`ls-nav-link ${
                view === "home" ? "ls-nav-link-active" : ""
              }`}
              onClick={goHome}
            >
              Accueil
            </button>
            <button
              type="button"
              className={`ls-nav-link ${
                view === "about" ? "ls-nav-link-active" : ""
              }`}
              onClick={goAbout}
            >
              À propos
            </button>
          </nav>
        </div>
      </header>

      {/* CONTENU */}
      <main className="ls-main">
        {view === "about" ? (
          <AboutSection />
        ) : results ? (
          <ResultsSection results={results} onRestart={goHome} />
        ) : (
          <Questionnaire
            answers={answers}
            onChange={handleChange}
            onReset={handleReset}
            onSubmit={handleSubmit}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="ls-footer">
        <div className="ls-footer-inner">
          <div>© 2025 LifeScore.ai – Bilan de vie expérimental.</div>
          <div className="ls-footer-note">
            Les réponses ne sont pas enregistrées côté serveur. Ce site ne
            fournit pas de conseil médical, financier ou psychologique.
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------- Composant Questionnaire ---------- */

function Questionnaire({ answers, onChange, onReset, onSubmit }) {
  return (
    <section className="ls-card">
      <h1 className="ls-title">Calcule ton LifeScore en 2 minutes.</h1>

      <p className="ls-intro">
        Ce questionnaire a été conçu pour t&apos;aider à prendre du recul sur
        ta situation. En quelques questions, tu obtiens un{" "}
        <strong>score global</strong> et des <strong>scores par domaine</strong>{" "}
        (finances, travail, santé, relations, etc.).
        <br />
        <br />
        Répond <strong>honnêtement</strong>, sans te juger. Il n&apos;existe pas
        de « bonne » réponse : l&apos;important, c&apos;est ce que{" "}
        <strong>toi</strong> tu ressens aujourd&apos;hui.
        <br />
        <br />
        Échelle utilisée : <strong>1 = très faible, 10 = excellent.</strong>
      </p>

      <form onSubmit={onSubmit}>
        {DOMAINS.map((domain) => (
          <div key={domain.id} className="ls-domain-block">
            <h2 className="ls-domain-title">{domain.title}</h2>
            <p className="ls-domain-description">{domain.description}</p>

            {domain.questions.map((q) => (
              <div key={q.key} className="ls-question-row">
                <div className="ls-question-header">
                  <span className="ls-question-label">{q.label}</span>
                  <span className="ls-question-value">
                    {answers[q.key]}/10
                  </span>
                </div>
                <div className="ls-slider-wrapper">
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={answers[q.key]}
                    onChange={(e) => onChange(q.key, e.target.value)}
                    className="ls-slider"
                  />
                  <div className="ls-slider-scale">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <span key={n}>{n}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        <div
          className="ls-actions-row"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            marginTop: "24px",
          }}
        >
          <button
            type="button"
            className="ls-button ls-button-secondary"
            onClick={onReset}
          >
            Réinitialiser les réponses
          </button>
          <button
            type="submit"
            className="ls-button ls-button-primary"
          >
            Calculer mon LifeScore
          </button>
        </div>
      </form>
    </section>
  );
}

/* ---------- Composant Résultats ---------- */

function ResultsSection({ results, onRestart }) {
  const { global, domains, globalMessage, strengths, priorities } = results;

  return (
    <section className="ls-card">
      <div className="ls-results-header">
        {/* Cercle bien rond, propre */}
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "999px",
            border: "4px solid #2563eb",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ffffff",
          }}
        >
          <div
            style={{
              fontSize: "32px",
              fontWeight: 700,
              lineHeight: 1,
              color: "#111827",
            }}
          >
            {global}
          </div>
          <div
            style={{
              marginTop: "4px",
              fontSize: "14px",
              color: "#6b7280",
              fontWeight: 500,
            }}
          >
            /100
          </div>
        </div>

        <div className="ls-results-text">
          <h1 className="ls-title">Ton LifeScore global</h1>
          <p className="ls-intro">
            Ce score est la moyenne de l&apos;ensemble de tes réponses,
            ramenée sur 100. Ce n&apos;est pas une note absolue, mais une{" "}
            <strong>photographie de ta situation actuelle</strong>.
            <br />
            <br />
            Utilise-le comme un <strong>point de départ</strong> : tu peux
            refaire le questionnaire régulièrement pour suivre l&apos;évolution
            de ton LifeScore au fil des semaines ou des mois.
          </p>
        </div>
      </div>

      <p className="ls-global-message">{globalMessage}</p>

      <h2 className="ls-section-subtitle">Scores par domaine</h2>
      <div className="ls-domain-scores">
        {domains.map((d) => (
          <div key={d.id} className="ls-domain-score-row">
            <div className="ls-domain-score-header">
              <span className="ls-domain-score-label">{d.title}</span>
              <span className="ls-domain-score-value">{d.score}/100</span>
            </div>
            <div className="ls-domain-score-bar">
              <div
                className="ls-domain-score-bar-fill"
                style={{ width: `${d.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="ls-results-grid">
        <div className="ls-results-column">
          <h3>Tes forces actuelles</h3>
          {strengths.length === 0 ? (
            <p>
              Aucun domaine n&apos;ressort particulièrement fort pour le
              moment, mais c&apos;est justement l&apos;occasion de{" "}
              <strong>construire des bases solides</strong>.
            </p>
          ) : (
            <ul>
              {strengths.map((label) => (
                <li key={label}>
                  <strong>{label}</strong> apparaît comme un domaine plutôt
                  solide aujourd&apos;hui.
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="ls-results-column">
          <h3>Axes prioritaires</h3>
          {priorities.length === 0 ? (
            <p>
              Aucun domaine n&apos;est identifié comme critique. Tu peux
              maintenant travailler sur des <strong>micro-améliorations</strong>{" "}
              dans chaque zone.
            </p>
          ) : (
            <ul>
              {priorities.map((label) => (
                <li key={label}>
                  <strong>{label}</strong> mérite une attention particulière
                  dans les prochaines semaines.
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="ls-summary-block">
        <h3>Résumé</h3>
        <p>
          Le but de ce LifeScore n&apos;est pas de te juger, mais de te donner{" "}
          <strong>un repère de départ</strong> pour organiser ta progression. Tu
          peux refaire le questionnaire à tout moment pour mesurer ton
          évolution.
        </p>
      </div>

      <div
        className="ls-actions-row"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          marginTop: "24px",
        }}
      >
        <button
          type="button"
          className="ls-button ls-button-secondary"
          onClick={onRestart}
        >
          Refaire le questionnaire
        </button>
      </div>
    </section>
  );
}

/* ---------- Page À propos ---------- */

function AboutSection() {
  return (
    <section className="ls-card">
      <h1 className="ls-title">À propos de LifeScore.ai</h1>
      <p className="ls-intro">
        LifeScore.ai est un outil expérimental qui te permet de mesurer,
        en quelques minutes, un <strong>score global de qualité de vie</strong>{" "}
        et des <strong>scores par domaine</strong> (finances, travail, santé,
        relations, etc.).
      </p>
      <p className="ls-intro">
        L&apos;objectif n&apos;est pas de poser un diagnostic, mais de t&apos;
        offrir un <strong>tableau de bord simple</strong> pour voir où tu en es
        aujourd&apos;hui et où concentrer tes efforts demain.
      </p>
      <p className="ls-intro">
        Tes réponses ne sont <strong>pas enregistrées côté serveur</strong> :
        le calcul se fait directement dans ton navigateur. Tu peux donc explorer
        différents scénarios librement, sans créer de compte.
      </p>
      <p className="ls-intro">
        À terme, LifeScore.ai pourra évoluer vers un suivi dans le temps,
        des plans d&apos;action personnalisés et, peut-être, des possibilités
        de partage volontaire de certains scores avec des proches ou des
        professionnels.
      </p>
    </section>
  );
}