// app/page.js
"use client";

import { useState, useMemo } from "react";

// --- Configuration des domaines + questions -------------------------

const DOMAINS = [
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
    description: "1 = très insatisfaisant, 10 = très satisfaisant.",
    questions: [
      { id: "trav_confiance", label: "Confiance dans ton travail / activité" },
      { id: "trav_sens", label: "Sens de ton activité" },
      { id: "trav_energie", label: "Niveau d'énergie au travail" },
    ],
  },
  {
    id: "sante",
    label: "Santé / énergie",
    description: "1 = très faible, 10 = excellente.",
    questions: [
      { id: "sante_energie", label: "Niveau d'énergie sur une semaine moyenne" },
      { id: "sante_sommeil", label: "Qualité du sommeil" },
      { id: "sante_hygiene", label: "Hygiène de vie globale" },
    ],
  },
  {
    id: "orga",
    label: "Organisation / administratif",
    description: "1 = très désorganisé, 10 = très organisé.",
    questions: [
      { id: "orga_papiers", label: "Gestion des papiers / administratif" },
      { id: "orga_planning", label: "Organisation du planning" },
      { id: "orga_priorites", label: "Clarté sur tes priorités" },
    ],
  },
  {
    id: "relations",
    label: "Relations / entourage",
    description: "1 = très insatisfaisant, 10 = très satisfaisant.",
    questions: [
      { id: "rel_soutien", label: "Soutien ressenti de la part de ton entourage" },
      { id: "rel_temps", label: "Temps de qualité partagé avec les proches" },
    ],
  },
  {
    id: "mental",
    label: "État mental / ressenti",
    description: "1 = très difficile, 10 = très serein.",
    questions: [
      { id: "ment_humeur", label: "Humeur générale en ce moment" },
      { id: "ment_motivation", label: "Motivation pour avancer dans tes projets" },
    ],
  },
];

// Sert à init / reset tous les sliders à 5/10
function getInitialAnswers() {
  const base = {};
  DOMAINS.forEach((d) =>
    d.questions.forEach((q) => {
      base[q.id] = 5;
    })
  );
  return base;
}

// Messages dynamiques pour le score global
function getGlobalMessage(score) {
  if (score <= 30) {
    return {
      niveau: "Très bas",
      texte:
        "Tu traverses une période compliquée. Ce n'est pas une fatalité : l'objectif est d'identifier 1 ou 2 domaines sur lesquels tu peux agir rapidement pour remonter la pente.",
    };
  }
  if (score <= 50) {
    return {
      niveau: "Intermédiaire",
      texte:
        "Tout n'est pas simple, mais tu as déjà des bases solides. Le but n'est pas d'atteindre 100/100, mais d'améliorer concrètement ton quotidien, étape par étape.",
    };
  }
  if (score <= 70) {
    return {
      niveau: "Plutôt bon",
      texte:
        "Globalement, tu es sur une dynamique positive. Tu peux maintenant affiner certains domaines pour te rapprocher d'une vie vraiment alignée avec ce que tu veux.",
    };
  }
  return {
    niveau: "Très bon",
    texte:
      "Tu sembles dans une période globalement stable et constructive. L'idée est surtout de consolider ce qui fonctionne et d'éviter de te laisser déstabiliser par les imprévus.",
  };
}

// -------------------------------------------------------------------

export default function HomePage() {
  const [view, setView] = useState("form"); // "form" | "results" | "about"
  const [answers, setAnswers] = useState(getInitialAnswers);
  const [results, setResults] = useState(null);

  const handleSliderChange = (id, value) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: Number(value),
    }));
  };

  const handleReset = () => {
    setAnswers(getInitialAnswers());
    setResults(null);
    setView("form");
  };

  // Calcul des scores
  const computedResults = useMemo(() => {
    const allValues = Object.values(answers);
    const avg10 =
      allValues.reduce((sum, v) => sum + v, 0) / (allValues.length || 1);
    const globalScore = Math.round(avg10 * 10); // /100

    const domainScores = DOMAINS.map((domain) => {
      const values = domain.questions.map((q) => answers[q.id] ?? 5);
      const domainAvg10 =
        values.reduce((s, v) => s + v, 0) / (values.length || 1);
      const score100 = Math.round(domainAvg10 * 10);
      return {
        id: domain.id,
        label: domain.label,
        score: score100,
      };
    });

    // Forces (>= 70) et axes prioritaires (<= 40)
    const forces = domainScores.filter((d) => d.score >= 70);
    const priorites = domainScores.filter((d) => d.score <= 40);

    return {
      globalScore,
      domainScores,
      forces,
      priorites,
      globalMessage: getGlobalMessage(globalScore),
    };
  }, [answers]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setResults(computedResults);
    setView("results");
  };

  const goHome = () => {
    setView("form");
  };

  const goAbout = () => {
    setView("about");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
      }}
    >
      {/* HEADER */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          backdropFilter: "blur(14px)",
          background: "rgba(255,255,255,0.9)",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontWeight: 800,
              fontSize: 22,
              color: "#1d4ed8",
              letterSpacing: "-0.03em",
            }}
          >
            LifeScore
            <span style={{ color: "#111827" }}>.ai</span>
          </div>
          <nav style={{ display: "flex", gap: 24, fontSize: 15 }}>
            <button
              type="button"
              onClick={goHome}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: view === "form" ? "#1d4ed8" : "#4b5563",
                fontWeight: view === "form" ? 700 : 500,
              }}
            >
              Accueil
            </button>
            <button
              type="button"
              onClick={goAbout}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: view === "about" ? "#1d4ed8" : "#4b5563",
                fontWeight: view === "about" ? 700 : 500,
              }}
            >
              À propos
            </button>
          </nav>
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main
        style={{
          maxWidth: 960,
          margin: "24px auto 40px",
          padding: "0 16px 40px",
        }}
      >
        {view === "about" && (
          <AboutView onBack={goHome} />
        )}

        {view === "form" && (
          <FormView
            answers={answers}
            onChange={handleSliderChange}
            onReset={handleReset}
            onSubmit={handleSubmit}
          />
        )}

        {view === "results" && results && (
          <ResultsView
            results={results}
            onRestart={goHome}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
}

// -------------------------------------------------------------------
// VUES
// -------------------------------------------------------------------

function FormView({ answers, onChange, onReset, onSubmit }) {
  return (
    <section>
      <div
        style={{
          background: "#ffffff",
          borderRadius: 24,
          padding: "24px 20px 28px",
          boxShadow: "0 18px 45px rgba(15,23,42,0.08)",
          marginBottom: 28,
        }}
      >
        <h1
          style={{
            fontSize: 28,
            lineHeight: 1.15,
            fontWeight: 800,
            marginBottom: 12,
          }}
        >
          Calcule ton LifeScore en 2 minutes.
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: "#374151" }}>
          Ce questionnaire a été conçu pour t&apos;aider à prendre du recul sur
          ta situation. En quelques questions, tu obtiens un{" "}
          <strong>score global</strong> et des{" "}
          <strong>scores par domaine</strong> (finances, travail, santé,
          relations, etc.).
          <br />
          <br />
          Répond <strong>honnêtement</strong>, sans te juger. Il n&apos;existe
          pas de « bonne » réponse : l&apos;important, c&apos;est ce que{" "}
          <strong>toi</strong> tu ressens aujourd&apos;hui.
          <br />
          <br />
          Échelle utilisée :{" "}
          <strong>1 = très faible, 10 = excellent.</strong>
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        style={{
          background: "#ffffff",
          borderRadius: 24,
          padding: "22px 20px 24px",
          boxShadow: "0 18px 45px rgba(15,23,42,0.08)",
        }}
      >
        {DOMAINS.map((domain) => (
          <div key={domain.id} style={{ marginBottom: 28 }}>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 800,
                marginBottom: 4,
              }}
            >
              {domain.label}
            </h2>
            <p
              style={{
                fontSize: 13,
                color: "#6b7280",
                marginBottom: 14,
              }}
            >
              {domain.description}
            </p>

            {domain.questions.map((q) => {
              const value = answers[q.id] ?? 5;
              return (
                <div
                  key={q.id}
                  style={{
                    marginBottom: 18,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <label
                      htmlFor={q.id}
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: "#111827",
                      }}
                    >
                      {q.label}
                    </label>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#1d4ed8",
                        minWidth: 50,
                        textAlign: "right",
                      }}
                    >
                      {value}/10
                    </span>
                  </div>

                  <input
                    id={q.id}
                    type="range"
                    min={1}
                    max={10}
                    value={value}
                    onChange={(e) => onChange(q.id, e.target.value)}
                    style={{
                      width: "100%",
                      accentColor: "#1d4ed8",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 11,
                      color: "#9ca3af",
                      marginTop: 2,
                    }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <span key={n}>{n}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginTop: 8,
          }}
        >
          <button
            type="button"
            onClick={onReset}
            style={{
              padding: "10px 18px",
              borderRadius: 999,
              border: "1px solid #d1d5db",
              background: "#f9fafb",
              color: "#374151",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Réinitialiser les réponses
          </button>

          <button
            type="submit"
            style={{
              padding: "10px 20px",
              borderRadius: 999,
              border: "none",
              background:
                "linear-gradient(135deg, #1d4ed8, #2563eb)",
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Calculer mon LifeScore
          </button>
        </div>
      </form>

      <p
        style={{
          fontSize: 12,
          color: "#9ca3af",
          marginTop: 16,
          textAlign: "center",
        }}
      >
        © 2025 LifeScore.ai – Bilan de vie expérimental. Les réponses ne sont
        pas enregistrées côté serveur. Ce site ne fournit pas de conseil
        médical, financier ou psychologique.
      </p>
    </section>
  );
}

// ------------------ VUE RÉSULTATS -----------------------------------

function ResultsView({ results, onRestart, onReset }) {
  const { globalScore, domainScores, forces, priorites, globalMessage } =
    results;

  return (
    <section>
      <div
        style={{
          background: "#ffffff",
          borderRadius: 24,
          padding: "24px 20px 28px",
          boxShadow: "0 18px 45px rgba(15,23,42,0.08)",
        }}
      >
        {/* Score global + cercle */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: "50%",
              border: "8px solid #2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              color: "#111827",
              fontWeight: 700,
              fontSize: 28,
            }}
          >
            <span>{globalScore}</span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#6b7280",
              }}
            >
              /100
            </span>
          </div>

          <div style={{ flex: 1, minWidth: 220 }}>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 800,
                marginBottom: 8,
              }}
            >
              Ton LifeScore global
            </h1>
            <p
              style={{
                fontSize: 14,
                color: "#374151",
                lineHeight: 1.6,
                marginBottom: 8,
              }}
            >
              Ce score est la moyenne de l&apos;ensemble de tes réponses,
              ramenée sur 100. Ce n&apos;est pas une note absolue, mais une{" "}
              <strong>photographie de ta situation actuelle</strong>.
            </p>
            <p
              style={{
                fontSize: 14,
                color: "#374151",
                lineHeight: 1.6,
              }}
            >
              Utilise-le comme un <strong>point de départ</strong> : tu peux
              refaire le questionnaire régulièrement pour suivre l&apos;évolution
              de ton LifeScore au fil des semaines ou des mois.
            </p>
          </div>
        </div>

        {/* Comment lire les résultats */}
        <div style={{ marginBottom: 20 }}>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 800,
              marginBottom: 4,
            }}
          >
            Comment lire tes résultats ?
          </h2>
          <p style={{ fontSize: 14, color: "#111827", marginBottom: 4 }}>
            Ton LifeScore global est{" "}
            <strong>{globalMessage.niveau.toLowerCase()}</strong>.
          </p>
          <p
            style={{
              fontSize: 14,
              color: "#374151",
              lineHeight: 1.6,
            }}
          >
            {globalMessage.texte}
          </p>
        </div>

        {/* Scores par domaine : GRAPHIQUES */}
        <div style={{ marginBottom: 20 }}>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 800,
              marginBottom: 8,
            }}
          >
            Scores par domaine
          </h2>

          {domainScores.map((d) => (
            <div key={d.id} style={{ marginBottom: 12 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                  marginBottom: 4,
                }}
              >
                <span>{d.label}</span>
                <span style={{ fontWeight: 600 }}>{d.score}/100</span>
              </div>

              {/* BARRE GRAPHIQUE */}
              <div
                style={{
                  width: "100%",
                  height: 8,
                  borderRadius: 999,
                  background: "#e5e7eb",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${d.score}%`,
                    height: "100%",
                    background:
                      d.score >= 70
                        ? "#16a34a"
                        : d.score <= 40
                        ? "#dc2626"
                        : "#2563eb",
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Forces & priorités */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            marginBottom: 20,
          }}
        >
          <div style={{ flex: 1, minWidth: 220 }}>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 800,
                marginBottom: 4,
              }}
            >
              Tes forces actuelles
            </h3>
            {forces.length === 0 ? (
              <p style={{ fontSize: 14, color: "#374151" }}>
                Aucun domaine ne ressort particulièrement fort pour le moment,
                mais c&apos;est justement l&apos;occasion de{" "}
                <strong>poser des bases solides</strong>.
              </p>
            ) : (
              <ul
                style={{
                  fontSize: 14,
                  color: "#374151",
                  paddingLeft: 18,
                }}
              >
                {forces.map((d) => (
                  <li key={d.id}>
                    <strong>{d.label}</strong> : ton score est de {d.score}
                    /100, c&apos;est un appui important sur lequel tu peux te
                    reposer.
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div style={{ flex: 1, minWidth: 220 }}>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 800,
                marginBottom: 4,
              }}
            >
              Axes prioritaires
            </h3>
            {priorites.length === 0 ? (
              <p style={{ fontSize: 14, color: "#374151" }}>
                Aucun domaine n&apos;est identifié comme critique. Tu peux
                choisir calmement 1 ou 2 domaines à améliorer en priorité pour
                faire monter ton LifeScore global.
              </p>
            ) : (
              <ul
                style={{
                  fontSize: 14,
                  color: "#374151",
                  paddingLeft: 18,
                }}
              >
                {priorites.map((d) => (
                  <li key={d.id}>
                    <strong>{d.label}</strong> : ton score est de {d.score}
                    /100. C&apos;est probablement ici que les petits progrès
                    auront le plus d&apos;impact sur ton quotidien.
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div style={{ textAlign: "right", marginTop: 10 }}>
          <button
            type="button"
            onClick={onReset}
            style={{
              padding: "9px 18px",
              borderRadius: 999,
              border: "1px solid #d1d5db",
              background: "#f9fafb",
              color: "#374151",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              marginRight: 10,
            }}
          >
            Refaire le questionnaire
          </button>
        </div>
      </div>
    </section>
  );
}

// ------------------ VUE À PROPOS ------------------------------------

function AboutView({ onBack }) {
  return (
    <section>
      <div
        style={{
          background: "#ffffff",
          borderRadius: 24,
          padding: "24px 20px 28px",
          boxShadow: "0 18px 45px rgba(15,23,42,0.08)",
        }}
      >
        <h1
          style={{
            fontSize: 24,
            fontWeight: 800,
            marginBottom: 12,
          }}
        >
          À propos de LifeScore.ai
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "#374151",
            lineHeight: 1.7,
            marginBottom: 12,
          }}
        >
          LifeScore.ai est un outil expérimental qui te permet d&apos;obtenir un{" "}
          <strong>bilan rapide de ta vie actuelle</strong> à partir de quelques
          questions simples. L&apos;objectif n&apos;est pas de te juger, mais de
          t&apos;offrir un <strong>repère clair</strong> pour décider où mettre
          ton énergie dans les prochaines semaines.
        </p>
        <p
          style={{
            fontSize: 14,
            color: "#374151",
            lineHeight: 1.7,
          }}
        >
          Les résultats ne sont pas enregistrés côté serveur :{" "}
          <strong>tout reste dans ton navigateur</strong>. Tu peux revenir
          quand tu veux, refaire le questionnaire et suivre l&apos;évolution de
          ton LifeScore au fil du temps.
        </p>

        <div style={{ marginTop: 20 }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              padding: "9px 18px",
              borderRadius: 999,
              border: "1px solid #d1d5db",
              background: "#f9fafb",
              color: "#374151",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Retour au questionnaire
          </button>
        </div>
      </div>
    </section>
  );
}