"use client";

import { useState, useMemo } from "react";

const DOMAINS = [
  {
    id: "finances",
    label: "Finances",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      {
        id: "finances_global",
        label: "Situation financière globale",
      },
      {
        id: "finances_budget",
        label: "Gestion du budget",
      },
      {
        id: "finances_dettes",
        label: "Poids des dettes",
      },
    ],
  },
  {
    id: "travail",
    label: "Travail / activité",
    description: "1 = très insatisfaisant, 10 = très satisfaisant.",
    questions: [
      {
        id: "travail_confiance",
        label: "Confiance dans ton travail / activité",
      },
      {
        id: "travail_sens",
        label: "Sens de ton activité",
      },
      {
        id: "travail_energie",
        label: "Niveau d’énergie au travail",
      },
    ],
  },
  {
    id: "sante",
    label: "Santé / énergie",
    description: "1 = très faible, 10 = excellente.",
    questions: [
      {
        id: "sante_energie",
        label: "Niveau d’énergie sur une semaine moyenne",
      },
      {
        id: "sante_sommeil",
        label: "Qualité moyenne de ton sommeil",
      },
      {
        id: "sante_habitudes",
        label: "Habitudes de vie (alimentation, activité physique, rythme)",
      },
    ],
  },
  {
    id: "organisation",
    label: "Organisation / administratif",
    description: "1 = très chaotique, 10 = très structuré.",
    questions: [
      {
        id: "orga_papiers",
        label: "Gestion des papiers et tâches administratives",
      },
      {
        id: "orga_temps",
        label: "Organisation de ton temps (priorités, planning)",
      },
      {
        id: "orga_avancement",
        label: "Sentiment d’avancer sur tes sujets importants",
      },
    ],
  },
  {
    id: "relations",
    label: "Relations / entourage",
    description: "1 = très insatisfaisant, 10 = très satisfaisant.",
    questions: [
      {
        id: "rel_soutien",
        label: "Soutien ressenti de la part de ton entourage",
      },
      {
        id: "rel_qualite",
        label: "Qualité de tes relations proches",
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
    description: "1 = très bas, 10 = très élevé.",
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

const INITIAL_VALUE = 5;

function buildInitialAnswers() {
  const initial = {};
  DOMAINS.forEach((domain) => {
    domain.questions.forEach((q) => {
      initial[q.id] = INITIAL_VALUE;
    });
  });
  return initial;
}

export default function HomePage() {
  const [activeView, setActiveView] = useState<"quiz" | "results">("quiz");
  const [showAbout, setShowAbout] = useState(false);
  const [answers, setAnswers] = useState(buildInitialAnswers);
  const [results, setResults] = useState<null | {
    globalScore: number;
    domainScores: Record<string, number>;
  }>(null);

  const handleSliderChange = (id: string, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleReset = () => {
    setAnswers(buildInitialAnswers());
    setResults(null);
    setActiveView("quiz");
  };

  const handleCalculate = () => {
    const domainScores: Record<string, number> = {};

    DOMAINS.forEach((domain) => {
      const values = domain.questions.map((q) => answers[q.id] || INITIAL_VALUE);
      const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
      domainScores[domain.id] = Math.round(avg * 10);
    });

    const allValues = DOMAINS.flatMap((domain) =>
      domain.questions.map((q) => answers[q.id] || INITIAL_VALUE)
    );
    const globalAvg =
      allValues.reduce((sum, v) => sum + v, 0) / allValues.length;

    const globalScore = Math.round(globalAvg * 10);

    setResults({ globalScore, domainScores });
    setActiveView("results");
    setShowAbout(false);
  };

  const strengths = useMemo(() => {
    if (!results) return [];
    return DOMAINS.filter((d) => results.domainScores[d.id] >= 70);
  }, [results]);

  const priorities = useMemo(() => {
    if (!results) return [];
    return DOMAINS.filter((d) => results.domainScores[d.id] <= 50);
  }, [results]);

  const globalMessage = useMemo(() => {
    if (!results) return "";
    const s = results.globalScore;
    if (s <= 40)
      return "Ton LifeScore global est bas : tu traverses une phase exigeante. Le but n’est pas de culpabiliser, mais de poser un diagnostic honnête pour enclencher des améliorations concrètes.";
    if (s <= 60)
      return "Ton LifeScore global est intermédiaire : tout n’est pas simple, mais tu as déjà des bases solides. Tu peux gagner en confort de vie en travaillant quelques domaines clés.";
    if (s <= 80)
      return "Ton LifeScore global est bon : globalement, ta vie tient debout. Tu peux désormais affiner certains domaines pour te rapprocher d’un niveau d’excellence.";
    return "Ton LifeScore global est très élevé : tu as construit un équilibre de vie solide. L’objectif est maintenant de le préserver dans le temps sans tomber dans la pression du “toujours plus”.";
  }, [results]);

  const adviceIntro = useMemo(() => {
    if (!results) return "";
    if (priorities.length === 0)
      return "Aucun domaine ne ressort comme critique : tu peux te servir de ce LifeScore comme un tableau de bord pour garder ton équilibre actuel.";
    if (priorities.length === 1)
      return `Le domaine qui mérite le plus d’attention est : ${priorities[0].label}. Commencer par là aura le plus d’impact sur ton quotidien.`;
    return `Plusieurs domaines méritent une attention particulière : ${priorities
      .map((d) => d.label)
      .join(", ")}. L’idée n’est pas de tout changer d’un coup, mais d’avancer étape par étape.`;
  }, [results, priorities]);

  const handleShowQuiz = () => {
    setActiveView("quiz");
    setShowAbout(false);
  };

  const handleShowAbout = () => {
    setShowAbout(true);
    setActiveView("quiz");
  };

  return (
    <div className="lk-app">
      <header className="lk-header">
        <div className="lk-header-inner">
          <div className="lk-brand">
            <div className="lk-brand-mark">
              <span className="lk-brand-pulse" />
            </div>
            <div className="lk-brand-text">
              <span className="lk-brand-name">Lifekore</span>
              <span className="lk-brand-tagline">Score de vie intelligent</span>
            </div>
          </div>
          <nav className="lk-nav">
            <button
              type="button"
              className={`lk-nav-link ${
                !showAbout ? "lk-nav-link-active" : ""
              }`}
              onClick={handleShowQuiz}
            >
              Accueil
            </button>
            <button
              type="button"
              className={`lk-nav-link ${
                showAbout ? "lk-nav-link-active" : ""
              }`}
              onClick={handleShowAbout}
            >
              À propos
            </button>
          </nav>
        </div>
      </header>

      <main className="lk-main">
        {!showAbout && activeView === "quiz" && (
          <section className="lk-section">
            <div className="lk-card lk-card-main">
              <div className="lk-card-intro">
                <h1>Calcule ton LifeScore en 2 minutes.</h1>
                <p>
                  Ce questionnaire a été conçu pour t’aider à prendre du recul
                  sur ta situation. En quelques questions, tu obtiens un{" "}
                  <strong>score global</strong> et des{" "}
                  <strong>scores par domaine</strong> (finances, travail,
                  santé, relations, etc.).
                </p>
                <p>
                  Répond <strong>honnêtement</strong>, sans te juger. Il n’existe
                  pas de « bonne » réponse : l’important, c’est ce que{" "}
                  <strong>toi</strong> tu ressens aujourd’hui.
                </p>
                <p className="lk-scale-info">
                  Échelle utilisée : <strong>1 = très faible, 10 = excellent.</strong>
                </p>
              </div>

              {DOMAINS.map((domain) => (
                <div key={domain.id} className="lk-domain-block">
                  <div className="lk-domain-header">
                    <h2>{domain.label}</h2>
                    <p className="lk-domain-description">
                      {domain.description}
                    </p>
                  </div>
                  <div className="lk-domain-questions">
                    {domain.questions.map((q) => {
                      const value = answers[q.id] || INITIAL_VALUE;
                      return (
                        <div key={q.id} className="lk-question-row">
                          <div className="lk-question-label-row">
                            <p className="lk-question-label">{q.label}</p>
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
                                handleSliderChange(
                                  q.id,
                                  Number(e.target.value)
                                )
                              }
                              className="lk-slider"
                            />
                            <div className="lk-slider-ticks">
                              {Array.from({ length: 10 }).map((_, i) => (
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
                  Réinitialiser les réponses
                </button>
                <button
                  type="button"
                  className="lk-button lk-button-primary"
                  onClick={handleCalculate}
                >
                  Calculer mon LifeScore
                </button>
              </div>
            </div>
          </section>
        )}

        {showAbout && (
          <section className="lk-section">
            <div className="lk-card lk-card-main">
              <h1>À propos de Lifekore</h1>
              <p>
                Lifekore est un outil simple qui t’aide à{" "}
                <strong>mesurer le potentiel de ta vie</strong> à travers un
                LifeScore global et des scores par domaine.
              </p>
              <p>
                L’objectif n’est pas de te mettre une note, mais de te donner
                un <strong>tableau de bord clair</strong> pour savoir où tu en
                es, repérer tes points forts et tes axes de progression.
              </p>
              <p>
                Tu peux utiliser Lifekore ponctuellement pour faire un bilan, ou
                régulièrement pour <strong>suivre ton évolution</strong> au fil
                des mois.
              </p>
            </div>
          </section>
        )}

        {!showAbout && activeView === "results" && results && (
          <section className="lk-section">
            <div className="lk-card lk-card-main">
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
                  <p className="lk-results-intro">
                    Ce score est la moyenne de l’ensemble de tes réponses,
                    ramenée sur 100. Ce n’est pas une note absolue, mais une{" "}
                    <strong>photographie de ta situation actuelle</strong>.
                  </p>
                  <p>
                    Utilise-le comme un <strong>point de départ</strong> : tu
                    peux refaire le questionnaire régulièrement pour suivre
                    l’évolution de ton LifeScore au fil des semaines ou des
                    mois.
                  </p>
                </div>
              </div>

              <div className="lk-results-block">
                <h2>Comment lire tes résultats ?</h2>
                <p>{globalMessage}</p>
              </div>

              <div className="lk-results-block">
                <h2>Scores par domaine</h2>
                <div className="lk-domain-scores">
                  {DOMAINS.map((domain) => {
                    const score = results.domainScores[domain.id] || 0;
                    return (
                      <div key={domain.id} className="lk-domain-score-row">
                        <div className="lk-domain-score-header">
                          <span className="lk-domain-score-label">
                            {domain.label}
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
                    );
                  })}
                </div>
              </div>

              <div className="lk-results-columns">
                <div className="lk-results-block">
                  <h2>Tes forces actuelles</h2>
                  {strengths.length === 0 && (
                    <p>
                      Aucun domaine ne ressort particulièrement fort pour le
                      moment, mais c’est justement l’occasion de{" "}
                      <strong>consolider des bases solides</strong> dans tous
                      les aspects de ta vie.
                    </p>
                  )}
                  {strengths.length > 0 && (
                    <>
                      <p>
                        Tu peux t’appuyer sur ces domaines pour{" "}
                        <strong>garder de l’énergie</strong> et de la
                        motivation&nbsp;:
                      </p>
                      <ul className="lk-list">
                        {strengths.map((d) => (
                          <li key={d.id}>
                            <strong>{d.label}</strong> : score solide sur ce
                            domaine. Continue à entretenir ce qui fonctionne
                            déjà.
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                <div className="lk-results-block">
                  <h2>Axes prioritaires</h2>
                  <p>{adviceIntro}</p>
                  {priorities.length > 0 && (
                    <ul className="lk-list">
                      {priorities.map((d) => (
                        <li key={d.id}>
                          <strong>{d.label}</strong> : commence par identifier{" "}
                          <strong>1 à 2 actions simples</strong> que tu peux
                          mettre en place dans les 7 prochains jours (prise de
                          rendez-vous, appel, petite action concrète, etc.).
                        </li>
                      ))}
                    </ul>
                  )}
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
            </div>
          </section>
        )}
      </main>

      <footer className="lk-footer">
        <div className="lk-footer-inner">
          <span>
            © 2025 Lifekore – Bilan de vie expérimental. Les réponses ne sont
            pas enregistrées côté serveur. Ce site ne fournit pas de conseil
            médical, financier ou psychologique.
          </span>
        </div>
      </footer>
    </div>
  );
}