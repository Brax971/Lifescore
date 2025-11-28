"use client";

import { useState } from "react";

const SLIDER_OPTIONS = [1, 2, 3, 4, 5];

const blocks = [
  {
    id: "finances",
    label: "Finances",
    questions: [
      "Sur une échelle de 1 à 5, comment évalues-tu ta situation financière globale ?",
      "À quel point tu maîtrises tes dépenses et ton budget ?",
      "À quel point tes dettes / crédits te pèsent mentalement ?"
    ]
  },
  {
    id: "travail",
    label: "Travail / activité",
    questions: [
      "Comment tu te sens dans ton travail ou activité actuelle ?",
      "À quel point ce que tu fais a du sens pour toi ?",
      "Ton niveau d’énergie moyen lié au travail ?"
    ]
  },
  {
    id: "sante",
    label: "Santé / énergie",
    questions: [
      "Ton niveau d’énergie physique sur une semaine moyenne ?",
      "La qualité de ton sommeil ?",
      "À quel point tes habitudes (alimentation, mouvement) te semblent saines ?"
    ]
  },
  {
    id: "orga",
    label: "Organisation / administratif",
    questions: [
      "À quel point tu te sens organisé dans ta vie (planning, tâches, projets) ?",
      "Comment tu évalues la gestion de ton administratif (factures, impôts, dossiers…) ?",
      "À quel point tu as l’impression d’être à jour sur ce que tu dois faire ?"
    ]
  },
  {
    id: "relations",
    label: "Relations / entourage",
    questions: [
      "Comment tu évalues la qualité globale de tes relations importantes (amis, famille, couple) ?",
      "À quel point tu te sens soutenu si tu as un problème ?",
      "À quel point tu te sens seul au quotidien ? (1 = très seul, 5 = pas du tout seul)"
    ]
  },
  {
    id: "mental",
    label: "État mental / ressenti",
    questions: [
      "Ton niveau de stress moyen ces dernières semaines ? (1 = extrêmement stressé, 5 = très serein)",
      "Comment tu te sens globalement dans ta vie en ce moment ?"
    ]
  }
];

const initialNumericState = () => {
  const state = {};
  blocks.forEach((block) => {
    block.questions.forEach((_, index) => {
      const key = `${block.id}_${index}`;
      state[key] = 3; // valeur par défaut
    });
  });
  return state;
};

function computeScores(numericAnswers) {
  const categoryScores = {};
  const categoryAverages = {};

  blocks.forEach((block) => {
    let sum = 0;
    let count = 0;
    block.questions.forEach((_, index) => {
      const key = `${block.id}_${index}`;
      const val = Number(numericAnswers[key] || 0);
      if (val > 0) {
        sum += val;
        count += 1;
      }
    });
    const avg = count > 0 ? sum / count : 0;
    const score = Math.round((avg / 5) * 100);
    categoryScores[block.id] = score;
    categoryAverages[block.id] = avg;
  });

  const allScores = Object.values(categoryScores);
  const global =
    allScores.length > 0
      ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
      : 0;

  return { global, categoryScores, categoryAverages };
}

function buildTextSummary(scores, textAnswers) {
  const { global, categoryScores } = scores;
  const forces = [];
  const axes = [];

  if (categoryScores.finances >= 70) {
    forces.push("Tu sembles avoir une base financière plutôt solide ou maîtrisée.");
  } else if (categoryScores.finances <= 40) {
    axes.push("Stabiliser ta situation financière et clarifier ton budget sera une priorité.");
  }

  if (categoryScores.travail >= 70) {
    forces.push("Ton activité ou ton travail actuel te porte plutôt vers le haut.");
  } else if (categoryScores.travail <= 40) {
    axes.push("Clarifier ta direction professionnelle ou ton activité pourrait beaucoup t’aider.");
  }

  if (categoryScores.sante >= 70) {
    forces.push("Ton niveau d’énergie et tes habitudes de vie sont plutôt favorables.");
  } else if (categoryScores.sante <= 40) {
    axes.push("Revenir à des bases simples (sommeil, alimentation, mouvement) peut grandement améliorer ton quotidien.");
  }

  if (categoryScores.orga >= 70) {
    forces.push("Tu sembles avoir une organisation de vie structurée et plutôt maîtrisée.");
  } else if (categoryScores.orga <= 40) {
    axes.push("Mettre de l’ordre dans ton administratif et ton organisation te fera gagner de la sérénité.");
  }

  if (categoryScores.relations >= 70) {
    forces.push("Tes relations et ton entourage représentent un vrai soutien dans ta vie.");
  } else if (categoryScores.relations <= 40) {
    axes.push("Renforcer la qualité de tes relations ou t’entourer différemment peut changer beaucoup de choses.");
  }

  if (categoryScores.mental >= 70) {
    forces.push("Ton état mental global semble plutôt stable et constructif.");
  } else if (categoryScores.mental <= 40) {
    axes.push("Ton niveau de stress et ton ressenti global méritent une attention bienveillante et structurée.");
  }

  if (forces.length === 0) {
    forces.push("Tu as déjà une base intéressante sur laquelle construire, même si tout n’est pas encore stabilisé.");
  }
  if (axes.length === 0) {
    axes.push("Tu peux désormais affiner certains domaines spécifiques pour continuer à faire progresser ton LifeScore.");
  }

  const resumeParts = [];
  if (global >= 75) {
    resumeParts.push(
      "Ton LifeScore global est déjà bon : tu sembles dans une phase plutôt stable, avec de vraies forces sur lesquelles t’appuyer."
    );
  } else if (global >= 50) {
    resumeParts.push(
      "Ton LifeScore global est intermédiaire : tu traverses une phase où tout n’est pas simple, mais tu as de vraies marges de progression."
    );
  } else {
    resumeParts.push(
      "Ton LifeScore global est pour l’instant plutôt bas : tu vis probablement une période de tension, de fatigue ou de transition importante."
    );
  }

  if (textAnswers.shortTerm) {
    resumeParts.push(
      "Ton objectif principal à court terme est : « " + textAnswers.shortTerm + " »."
    );
  }
  if (textAnswers.midTerm) {
    resumeParts.push(
      "À moyen terme, tu aimerais : « " + textAnswers.midTerm + " »."
    );
  }
  if (textAnswers.blocker) {
    resumeParts.push(
      "Tu identifies comme frein principal : « " + textAnswers.blocker + " »."
    );
  }

  resumeParts.push(
    "Le but de ce LifeScore n’est pas de te juger, mais de te donner un repère de départ pour organiser ta progression."
  );

  return {
    forces,
    axes,
    resume: resumeParts,
  };
}

export default function Home() {
  const [mode, setMode] = useState("form"); // "form" | "result"
  const [numericAnswers, setNumericAnswers] = useState(initialNumericState);
  const [shortTerm, setShortTerm] = useState("");
  const [midTerm, setMidTerm] = useState("");
  const [blocker, setBlocker] = useState("");
  const [result, setResult] = useState(null);

  const handleNumericChange = (key, value) => {
    setNumericAnswers((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const scores = computeScores(numericAnswers);
    const text = buildTextSummary(scores, {
      shortTerm,
      midTerm,
      blocker,
    });
    setResult({
      scores,
      text,
    });
    setMode("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setMode("form");
    setResult(null);
    setNumericAnswers(initialNumericState);
    setShortTerm("");
    setMidTerm("");
    setBlocker("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="ls-shell">
      <header className="ls-header">
        <div className="ls-header-inner">
          <div className="ls-logo">LifeScore<span>.ai</span></div>
          <nav className="ls-nav">
            <a href="#top" className="ls-nav-link">
              Accueil
            </a>
            <a href="#apropos" className="ls-nav-link">
              À propos
            </a>
          </nav>
        </div>
      </header>

      {mode === "form" && (
        <main className="ls-main">
          <section className="ls-hero" id="top">
            <h1 className="ls-hero-title">
              Calcule ton LifeScore en 2 minutes.
            </h1>
            <p className="ls-hero-subtitle">
              Réponds à quelques questions simples et obtiens un bilan de vie structuré
              avec un score global et des pistes d&apos;amélioration concrètes.
            </p>
          </section>

          <section className="ls-card">
            <form onSubmit={handleSubmit} className="ls-form">
              <p className="ls-form-note">
                Ce questionnaire est conçu pour t&apos;aider à prendre du recul sur TA situation.
                Il ne doit pas être utilisé pour évaluer ou juger d&apos;autres personnes.
              </p>

              {blocks.map((block) => (
                <div key={block.id} className="ls-block">
                  <h2 className="ls-block-title">{block.label}</h2>
                  <div className="ls-block-questions">
                    {block.questions.map((q, index) => {
                      const key = `${block.id}_${index}`;
                      return (
                        <div key={key} className="ls-question">
                          <label className="ls-question-label">
                            {q}
                          </label>
                          <div className="ls-slider-row">
                            <select
                              className="ls-select"
                              value={numericAnswers[key]}
                              onChange={(e) => handleNumericChange(key, e.target.value)}
                            >
                              {SLIDER_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                            <span className="ls-select-hint">1 = minimum, 5 = maximum</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="ls-block">
                <h2 className="ls-block-title">Objectifs et ressenti</h2>
                <div className="ls-question">
                  <label className="ls-question-label">
                    Ton objectif principal à court terme (1–3 mois)
                  </label>
                  <textarea
                    className="ls-textarea"
                    rows={2}
                    value={shortTerm}
                    onChange={(e) => setShortTerm(e.target.value)}
                    placeholder="Ex : stabiliser mes finances, retrouver de l'énergie, remettre de l'ordre dans mon administratif…"
                  />
                </div>
                <div className="ls-question">
                  <label className="ls-question-label">
                    Ton objectif principal à moyen terme (6–12 mois)
                  </label>
                  <textarea
                    className="ls-textarea"
                    rows={2}
                    value={midTerm}
                    onChange={(e) => setMidTerm(e.target.value)}
                    placeholder="Ex : changer de travail, lancer un projet, déménager, améliorer ma santé…"
                  />
                </div>
                <div className="ls-question">
                  <label className="ls-question-label">
                    Selon toi, qu&apos;est-ce qui te bloque le plus aujourd&apos;hui ?
                  </label>
                  <textarea
                    className="ls-textarea"
                    rows={2}
                    value={blocker}
                    onChange={(e) => setBlocker(e.target.value)}
                    placeholder="Ex : manque de temps, fatigue, dettes, désorganisation, entourage, peur de l'échec…"
                  />
                </div>
              </div>

              <div className="ls-submit-row">
                <button type="submit" className="ls-button-primary">
                  Générer mon LifeScore
                </button>
              </div>
            </form>
          </section>

          <section id="apropos" className="ls-about">
            <h2>À propos de LifeScore</h2>
            <p>
              LifeScore est une expérience personnelle : l&apos;objectif n&apos;est pas de te juger,
              mais de te donner un repère simple sur l&apos;état global de ta vie aujourd&apos;hui
              et des pistes concrètes pour avancer. Les réponses ne sont pas stockées dans cette
              version et restent sur ton écran.
            </p>
          </section>
        </main>
      )}

      {mode === "result" && result && (
        <main className="ls-main">
          <section className="ls-result-header">
            <h1 className="ls-hero-title">Ton LifeScore</h1>
            <p className="ls-hero-subtitle">
              Voici un bilan synthétique de ta situation actuelle, basé sur tes réponses.
            </p>
          </section>

          <section className="ls-card ls-result-card">
            <div className="ls-score-global">
              <div className="ls-score-circle">
                <span className="ls-score-value">{result.scores.global}</span>
                <span className="ls-score-max">/100</span>
              </div>
              <div className="ls-score-label">LifeScore global</div>
            </div>

            <div className="ls-score-grid">
              <h2 className="ls-block-title">Scores par domaine</h2>
              <div className="ls-score-grid-inner">
                <ScoreBar label="Finances" value={result.scores.categoryScores.finances} />
                <ScoreBar label="Travail / activité" value={result.scores.categoryScores.travail} />
                <ScoreBar label="Santé / énergie" value={result.scores.categoryScores.sante} />
                <ScoreBar label="Organisation / administratif" value={result.scores.categoryScores.orga} />
                <ScoreBar label="Relations / entourage" value={result.scores.categoryScores.relations} />
                <ScoreBar label="État mental / ressenti" value={result.scores.categoryScores.mental} />
              </div>
            </div>

            <div className="ls-flex-cols">
              <div className="ls-column">
                <h2 className="ls-block-title">Tes forces actuelles</h2>
                <ul className="ls-list">
                  {result.text.forces.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="ls-column">
                <h2 className="ls-block-title">Axes prioritaires</h2>
                <ul className="ls-list">
                  {result.text.axes.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="ls-block">
              <h2 className="ls-block-title">Résumé</h2>
              <div className="ls-resume">
                {result.text.resume.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>

            <div className="ls-submit-row">
              <button className="ls-button-secondary" onClick={handleReset}>
                Refaire le questionnaire
              </button>
            </div>
          </section>
        </main>
      )}

      <footer className="ls-footer">
        <div className="ls-footer-inner">
          <span>© {new Date().getFullYear()} LifeScore.ai – Bilan de vie expérimental.</span>
          <span>Version MVP : les réponses ne sont pas enregistrées côté serveur.</span>
        </div>
      </footer>
    </div>
  );
}

function ScoreBar({ label, value }) {
  const width = Math.max(0, Math.min(100, value || 0));
  return (
    <div className="ls-score-row">
      <div className="ls-score-row-header">
        <span className="ls-score-row-label">{label}</span>
        <span className="ls-score-row-value">{width}/100</span>
      </div>
      <div className="ls-score-row-bar">
        <div className="ls-score-row-bar-inner" style={{ width: width + "%" }} />
      </div>
    </div>
  );
}