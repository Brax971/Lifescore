"use client";

import { useState, useMemo } from "react";

// --- CONFIG DU QUESTIONNAIRE ------------------------------------------

const QUESTION_GROUPS = [
  {
    id: "finances",
    title: "Finances",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      { id: "fin_situation", label: "Situation financière globale" },
      { id: "fin_budget", label: "Gestion du budget" },
      { id: "fin_dettes", label: "Poids des dettes" },
    ],
  },
  {
    id: "travail",
    title: "Travail / activité",
    description: "1 = très insatisfaisant, 10 = très satisfaisant.",
    questions: [
      { id: "trav_confiance", label: "Confiance dans ton travail / activité" },
      { id: "trav_sens", label: "Sens de ton activité" },
      { id: "trav_energie", label: "Niveau d’énergie au travail" },
    ],
  },
  {
    id: "sante",
    title: "Santé / énergie",
    description: "1 = très faible, 10 = excellente.",
    questions: [
      { id: "sante_energie", label: "Niveau d’énergie sur une semaine moyenne" },
      { id: "sante_sommeil", label: "Qualité globale du sommeil" },
      { id: "sante_habitudes", label: "Habitudes de vie (alimentation, mouvement…)" },
    ],
  },
  {
    id: "organisation",
    title: "Organisation / administratif",
    description: "1 = chaotique, 10 = très structuré.",
    questions: [
      { id: "orga_papiers", label: "Gestion des papiers / obligations" },
      { id: "orga_planning", label: "Organisation de ton planning" },
      { id: "orga_priorites", label: "Clarté sur tes priorités actuelles" },
    ],
  },
  {
    id: "relations",
    title: "Relations / entourage",
    description: "1 = très insatisfaisant, 10 = très satisfaisant.",
    questions: [
      { id: "rel_soutien", label: "Soutien ressenti de la part de ton entourage" },
      { id: "rel_temps", label: "Temps de qualité partagé avec les proches" },
      { id: "rel_reseau", label: "Sentiment d’être bien entouré" },
    ],
  },
  {
    id: "mental",
    title: "État mental / ressenti",
    description: "1 = très difficile, 10 = très serein.",
    questions: [
      { id: "ment_humeur", label: "Humeur générale en ce moment" },
      { id: "ment_motivation", label: "Motivation pour avancer dans tes projets" },
      { id: "ment_stress", label: "Niveau de stress perçu" },
    ],
  },
];

// Valeurs par défaut : tout à 5/10
const buildInitialAnswers = () => {
  const defaults = {};
  QUESTION_GROUPS.forEach((group) => {
    group.questions.forEach((q) => {
      defaults[q.id] = 5;
    });
  });
  return defaults;
};

// --- COMPOSANT PRINCIPAL ----------------------------------------------

export default function Home() {
  const [view, setView] = useState("home"); // "home" | "results" | "about"
  const [answers, setAnswers] = useState(buildInitialAnswers);
  const [results, setResults] = useState(null);

  // Calcul des scores (global + par domaine)
  const computed = useMemo(() => {
    const allValues = Object.values(answers);
    const globalAvg =
      allValues.reduce((sum, value) => sum + value, 0) / allValues.length || 0;
    const globalScore = Math.round(globalAvg * 10); // sur 100

    const domainScores = QUESTION_GROUPS.map((group) => {
      const vals = group.questions.map((q) => answers[q.id]);
      const avg = vals.reduce((s, v) => s + v, 0) / vals.length || 0;
      return {
        id: group.id,
        title: group.title,
        score: Math.round(avg * 10),
      };
    });

    const sorted = [...domainScores].sort((a, b) => b.score - a.score);
    const strengths = sorted.slice(0, 2);
    const priorities = sorted.slice(-2).sort((a, b) => a.score - b.score);

    let level = "moyen"; // "bas" | "moyen" | "haut"
    if (globalScore < 40) level = "bas";
    else if (globalScore > 70) level = "haut";

    return { globalScore, domainScores, strengths, priorities, level };
  }, [answers]);

  const handleSliderChange = (id, value) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleReset = () => {
    setAnswers(buildInitialAnswers());
    setResults(null);
    setView("home");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setResults(computed);
    setView("results");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goHome = () => {
    setView("home");
    setResults(null);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Texte dynamique selon le score global
  const renderGlobalMessage = () => {
    if (!results) return null;

    if (results.level === "bas") {
      return (
        <>
          <p>
            Ton LifeScore global est <strong>bas</strong> : tu traverses
            probablement une période compliquée ou chargée. Ce n’est pas un
            jugement, mais un signal utile pour prendre soin de toi.
          </p>
          <p>
            Commence par <strong>un seul domaine prioritaire</strong> (finances,
            santé, travail, etc.) et note une petite action simple à faire cette
            semaine. L’objectif n’est pas d’être parfait, mais de{" "}
            <strong>remonter doucement la moyenne</strong>.
          </p>
        </>
      );
    }

    if (results.level === "haut") {
      return (
        <>
          <p>
            Ton LifeScore global est <strong>élevé</strong> : tu sembles avoir un
            équilibre global plutôt solide en ce moment.
          </p>
          <p>
            Garde en tête que la situation peut évoluer. Identifie ce qui
            fonctionne le mieux aujourd’hui et{" "}
            <strong>renforce ces habitudes</strong> pour rester sur cette
            dynamique positive.
          </p>
        </>
      );
    }

    return (
      <>
        <p>
          Ton LifeScore global est <strong>intermédiaire</strong> : tout n’est pas
          simple, mais tu as déjà des bases sur lesquelles t’appuyer.
        </p>
        <p>
          Le but n’est pas d’atteindre 100/100, mais de{" "}
          <strong>repérer 1 ou 2 domaines</strong> où quelques ajustements
          pourraient améliorer concrètement ton quotidien.
        </p>
      </>
    );
  };

  const renderForcesAxes = () => {
    if (!results) return null;
    const { strengths, priorities } = results;

    return (
      <div className="results-two-columns">
        <div>
          <h3>Tes forces actuelles</h3>
          <ul>
            {strengths.map((d) => (
              <li key={d.id}>
                <strong>{d.title}</strong> : ton score est de {d.score}/100, ce
                domaine t’aide actuellement à tenir le cap.
              </li>
            ))}
            <li>
              Tu peux t’appuyer sur ces domaines pour{" "}
              <strong>garder de l’énergie</strong> pendant que tu améliores le
              reste.
            </li>
          </ul>
        </div>
        <div>
          <h3>Axes prioritaires</h3>
          <ul>
            {priorities.map((d) => (
              <li key={d.id}>
                <strong>{d.title}</strong> : avec un score de {d.score}/100,
                c’est un bon candidat pour travailler des actions concrètes.
              </li>
            ))}
            <li>
              Choisis <strong>une première action simple</strong> à mettre en
              place cette semaine (prendre un rendez-vous, faire un point budget,
              organiser ta semaine, etc.).
            </li>
          </ul>
        </div>
      </div>
    );
  };

  // GRAPH : barres horizontales
  const renderChart = () => {
    if (!results) return null;

    return (
      <div className="results-chart">
        {results.domainScores.map((d) => (
          <div className="chart-row" key={d.id}>
            <div className="chart-label">{d.title}</div>
            <div className="chart-bar-wrapper">
              <div
                className="chart-bar-fill"
                style={{ width: `${d.score}%` }}
              />
            </div>
            <div className="chart-value">{d.score}/100</div>
          </div>
        ))}
      </div>
    );
  };

  // --- RENDUS DES VUES -------------------------------------------------

  const renderHome = () => (
    <main className="ls-main">
      <div className="ls-card">
        <header className="ls-card-header">
          <h1>Calcule ton LifeScore en 2 minutes.</h1>

          <p>
            Ce questionnaire a été conçu pour t'aider à prendre du recul sur ta
            situation. En quelques questions, tu obtiens un{" "}
            <strong>score global</strong> et des{" "}
            <strong>scores par domaine</strong> (finances, travail, santé,
            relations, etc.).
          </p>

          <p>
            Répond <strong>honnêtement</strong>, sans te juger. Il n'existe pas de
            « bonne » réponse : l'important, c'est ce que{" "}
            <strong>toi</strong> tu ressens aujourd'hui.
          </p>

          <p>
            Échelle utilisée : <strong>1 = très faible, 10 = excellent.</strong>
          </p>
        </header>

        <form onSubmit={handleSubmit} className="ls-form">
          {QUESTION_GROUPS.map((group) => (
            <section key={group.id} className="ls-group">
              <h2>{group.title}</h2>
              <p className="ls-group-desc">{group.description}</p>

              {group.questions.map((q) => {
                const value = answers[q.id];
                return (
                  <div key={q.id} className="ls-question">
                    <div className="ls-question-header">
                      <label>{q.label}</label>
                      <span className="ls-question-value">{value}/10</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      step={1}
                      value={value}
                      onChange={(e) =>
                        handleSliderChange(q.id, Number(e.target.value))
                      }
                    />
                    <div className="ls-ticks">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <span key={i}>{i + 1}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </section>
          ))}

          <div className="ls-actions">
            <button
              type="button"
              className="ls-btn ls-btn-secondary"
              onClick={handleReset}
            >
              Réinitialiser les réponses
            </button>
            <button type="submit" className="ls-btn ls-btn-primary">
              Calculer mon LifeScore
            </button>
          </div>
        </form>
      </div>

      <footer className="ls-footer">
        <p>© 2025 LifeScore.ai – Bilan de vie expérimental.</p>
        <p>
          Les réponses ne sont pas enregistrées côté serveur. Ce site ne fournit
          pas de conseil médical, financier ou psychologique.
        </p>
      </footer>
    </main>
  );

  const renderResults = () => {
    if (!results) return null;

    return (
      <main className="ls-main">
        <div className="ls-card ls-card-results">
          <div className="ls-results-header">
            <div className="ls-score-circle">
              <span className="ls-score-value">{results.globalScore}</span>
              <span className="ls-score-max">/100</span>
            </div>

            <div className="ls-results-intro">
              <h1>Ton LifeScore global</h1>
              <p>
                Ce score est la moyenne de l'ensemble de tes réponses, ramenée
                sur 100. Ce n'est pas une note absolue, mais une{" "}
                <strong>photographie de ta situation actuelle</strong>.
              </p>
              <p>
                Utilise-le comme un <strong>point de départ</strong> : tu peux
                refaire le questionnaire régulièrement pour suivre l'évolution de
                ton LifeScore au fil des semaines ou des mois.
              </p>
            </div>
          </div>

          <section className="ls-section">
            <h2>Comment lire tes résultats&nbsp;?</h2>
            {renderGlobalMessage()}
          </section>

          <section className="ls-section">
            <h2>Scores par domaine</h2>
            {renderChart()}
          </section>

          <section className="ls-section">{renderForcesAxes()}</section>

          <div className="ls-actions results-actions">
            <button
              type="button"
              className="ls-btn ls-btn-secondary"
              onClick={goHome}
            >
              Refaire le questionnaire
            </button>
          </div>
        </div>

        <footer className="ls-footer">
          <p>© 2025 LifeScore.ai – Bilan de vie expérimental.</p>
          <p>
            Les réponses ne sont pas enregistrées côté serveur. Ce site ne
            fournit pas de conseil médical, financier ou psychologique.
          </p>
        </footer>
      </main>
    );
  };

  const renderAbout = () => (
    <main className="ls-main">
      <div className="ls-card">
        <h1>À propos de LifeScore.ai</h1>
        <p>
          LifeScore.ai est un outil expérimental qui t’aide à prendre une{" "}
          <strong>photo instantanée</strong> de ta situation de vie : finances,
          travail, santé, relations, organisation et ressenti mental.
        </p>
        <p>
          L’objectif n’est pas de te juger ni de te classer, mais de te donner un{" "}
          <strong>repère simple</strong> pour suivre ton évolution dans le temps
          et identifier des pistes d’amélioration concrètes.
        </p>
        <p>
          Tu peux refaire le questionnaire aussi souvent que tu veux et comparer
          ton LifeScore global et tes scores par domaine au fil des semaines ou
          des mois.
        </p>
      </div>

      <footer className="ls-footer">
        <p>© 2025 LifeScore.ai – Bilan de vie expérimental.</p>
        <p>
          Les réponses ne sont pas enregistrées côté serveur. Ce site ne fournit
          pas de conseil médical, financier ou psychologique.
        </p>
      </footer>
    </main>
  );

  return (
    <>
      {/* HEADER GLOBAL */}
      <header className="ls-header">
        <div className="ls-header-inner">
          <div className="ls-logo">LifeScore.ai</div>
          <nav className="ls-nav">
            <button
              type="button"
              className={`ls-nav-link ${view === "home" ? "is-active" : ""}`}
              onClick={goHome}
            >
              Accueil
            </button>
            <button
              type="button"
              className={`ls-nav-link ${view === "about" ? "is-active" : ""}`}
              onClick={() => {
                setView("about");
                if (typeof window !== "undefined") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            >
              À propos
            </button>
          </nav>
        </div>
      </header>

      {/* CONTENU SELON LA VUE */}
      {view === "home" && renderHome()}
      {view === "results" && renderResults()}
      {view === "about" && renderAbout()}
    </>
  );
}