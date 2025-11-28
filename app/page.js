"use client";

import { useState } from "react";

const initialForm = {
  // Finances
  finances_situation: 0,
  finances_budget: 0,
  finances_dettes: 0,
  // Travail / activité
  travail_plaisir: 0,
  travail_sens: 0,
  travail_energie: 0,
  // Santé / énergie
  sante_energie: 0,
  sante_sommeil: 0,
  sante_habitudes: 0,
  // Organisation / administratif
  orga_papiers: 0,
  orga_temps: 0,
  orga_priorites: 0,
  // Relations / entourage
  rel_proches: 0,
  rel_famille: 0,
  rel_social: 0,
  // État mental / ressenti
  mental_stress: 0,
  mental_humeur: 0,
  mental_motivation: 0,
};

export default function Home() {
  const [step, setStep] = useState<"form" | "result">("form");
  const [formData, setFormData] = useState(initialForm);
  const [domainScores, setDomainScores] = useState<{
    finances: number;
    travail: number;
    sante: number;
    orga: number;
    relations: number;
    mental: number;
    global: number;
  } | null>(null);

  // Mise à jour d'un slider
  const updateField = (field: keyof typeof initialForm, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Number(value),
    }));
  };

  // Calcul des scores
  const computeScores = () => {
    const avg = (keys: (keyof typeof initialForm)[]) => {
      const sum = keys.reduce((acc, k) => acc + formData[k], 0);
      return (sum / (keys.length * 5)) * 100; // converti en /100
    };

    const finances = avg([
      "finances_situation",
      "finances_budget",
      "finances_dettes",
    ]);
    const travail = avg([
      "travail_plaisir",
      "travail_sens",
      "travail_energie",
    ]);
    const sante = avg([
      "sante_energie",
      "sante_sommeil",
      "sante_habitudes",
    ]);
    const orga = avg(["orga_papiers", "orga_temps", "orga_priorites"]);
    const relations = avg(["rel_proches", "rel_famille", "rel_social"]);
    const mental = avg([
      "mental_stress",
      "mental_humeur",
      "mental_motivation",
    ]);

    const global =
      (finances + travail + sante + orga + relations + mental) / 6;

    return {
      finances: Math.round(finances),
      travail: Math.round(travail),
      sante: Math.round(sante),
      orga: Math.round(orga),
      relations: Math.round(relations),
      mental: Math.round(mental),
      global: Math.round(global),
    };
  };

  // Soumission du questionnaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const scores = computeScores();
    setDomainScores(scores);
    setStep("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Retour à l'accueil / reset
  const resetAll = () => {
    setFormData(initialForm);
    setDomainScores(null);
    setStep("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scores = domainScores;

  return (
    <>
      {/* HEADER */}
      <header className="ls-header">
        <div className="ls-header-inner">
          <button
            type="button"
            onClick={resetAll}
            className="ls-logo-button"
          >
            <span className="ls-logo">LifeScore.ai</span>
          </button>

          <nav className="ls-nav">
            <button type="button" className="ls-nav-link" onClick={resetAll}>
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

      <main className="ls-main">
        {/* === ÉTAPE 1 : QUESTIONNAIRE === */}
        {step === "form" && (
          <div className="ls-container">
            <section className="ls-hero">
              <h1 className="ls-title">Calcule ton LifeScore en 2 minutes.</h1>
              <p className="ls-subtitle">
                Réponds simplement aux questions ci-dessous. Chaque curseur va
                de 0 (très faible) à 5 (très élevé). Tes réponses ne sont pas
                enregistrées côté serveur.
              </p>
            </section>

            <form className="ls-form" onSubmit={handleSubmit}>
              {/* FINANCES */}
              <section className="ls-form-section">
                <h2 className="ls-section-title">Finances</h2>

                <div className="ls-question">
                  <label>
                    Situation financière globale <span>(0 = catastrophique, 5 = confortable)</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={formData.finances_situation}
                    onChange={(e) =>
                      updateField("finances_situation", e.target.value)
                    }
                  />
                </div>

                <div className="ls-question">
                  <label>Gestion du budget au quotidien</label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={formData.finances_budget}
                    onChange={(e) =>
                      updateField("finances_budget", e.target.value)
                    }
                  />
                </div>

                <div className="ls-question">
                  <label>
                    Poids mental de tes dettes / crédits
                    <span>(0 = très léger, 5 = très lourd)</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={formData.finances_dettes}
                    onChange={(e) =>
                      updateField("finances_dettes", e.target.value)
                    }
                  />
                </div>
              </section>

              {/* TRAVAIL / ACTIVITÉ */}
              <section className="ls-form-section">
                <h2 className="ls-section-title">Travail / activité</h2>

                <div className="ls-question">
                  <label>Confiance dans ton travail ou activité actuelle</label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={formData.travail_plaisir}
                    onChange={(e) =>
                      updateField("travail_plaisir", e.target.value)
                    }
                  />
                </div>

                <div className="ls-question">
                  <label>Sentiment que ton activité a du sens pour toi</label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={formData.travail_sens}
                    onChange={(e) =>
                      updateField("travail_sens", e.target.value)
                    }
                  />
                </div>

                <div className="ls-question">
                  <label>Niveau d&apos;énergie moyen au travail</label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={formData.travail_energie}
                    onChange={(e) =>
                      updateField("travail_energie", e.target.value)
                    }
                  />
                </div>
              </section>

              {/* SANTÉ / ÉNERGIE */}
              <section className="ls-form-section">
                <h2 className="ls-section-title">Santé / énergie</h2>

                <div className="ls-question">
                  <label>Niveau d&apos;énergie sur une semaine moyenne</label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={formData.sante_energie}
                    onChange={(e) =>
                      updateField("sante_energie", e.target.value)
                    }
                  />
                </div>

                <div className="ls-question">
                  <label>Qualité de ton sommeil récent</label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={formData.sante_sommeil}
                    onChange={(e) =>
                      updateField("sante_sommeil", e.target.value)
                    }
                  />
                </div>

                <div className="ls-question">
                  <label>Habitudes de vie (alimentation, mouvement, etc.)</label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={formData.sante_habitudes}
                    onChange={(e) =>
                      updateField("sante_habitudes", e.target.value)
                    }
                  />
                </div>
              </section>

              {/* ORGANISATION / ADMINISTRATIF */}
              <section className="ls-form-section">
                <h2 className="ls-section-title">Organisation / administratif</h2>

                <div className="ls-question">
                  <label>Suivi de tes papiers et démarches</label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={formData.orga_papiers}
                    onChange={(e) =>
                      updateField("orga_papiers", e.target.value)
                    }
                  />
                </div>

                <div className="ls-question">
                  <label>Gestion de ton temps</label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={formData.orga_temps}
                    onChange={(e) =>
                      updateField("orga_temps", e.target.value)
                    }
                  />
                </div>

                <div className="ls-question">
                  <label>Capacité à prioriser ce qui est important</label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={formData.orga_priorites}
                    onChange={(e) =>
                      updateField("orga_priorites", e.target.value)
                    }
                  />
                </div>
              </section>

              {/* RELATIONS / ENTOURAGE */}
              <section className="ls-form-section">
                <h2 className="ls-section-title">Relations / entourage</h2>

                <div className="ls-question">
                  <label>Qualité des relations très proches</label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={formData.rel_proches}
                    onChange={(e) =>
                      updateField("rel_proches", e.target.value)
                    }
                  />
                </div>

                <div className="ls-question">
                  <label>Relations familiales globales</label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={formData.rel_famille}
                    onChange={(e) =>
                      updateField("rel_famille", e.target.value)
                    }
                  />
                </div>

                <div className="ls-question">
                  <label>Vie sociale (amis, collègues, rencontres)</label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={formData.rel_social}
                    onChange={(e) =>
                      updateField("rel_social", e.target.value)
                    }
                  />
                </div>
              </section>

              {/* ÉTAT MENTAL / RESSENTI */}
              <section className="ls-form-section">
                <h2 className="ls-section-title">État mental / ressenti</h2>

                <div className="ls-question">
                  <label>Niveau de stress global</label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={formData.mental_stress}
                    onChange={(e) =>
                      updateField("mental_stress", e.target.value)
                    }
                  />
                </div>

                <div className="ls-question">
                  <label>Qualité de ton humeur la plupart du temps</label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={formData.mental_humeur}
                    onChange={(e) =>
                      updateField("mental_humeur", e.target.value)
                    }
                  />
                </div>

                <div className="ls-question">
                  <label>Motivation pour tes projets personnels</label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={formData.mental_motivation}
                    onChange={(e) =>
                      updateField("mental_motivation", e.target.value)
                    }
                  />
                </div>
              </section>

              <div className="ls-submit-row">
                <button type="submit" className="ls-button">
                  Voir mon LifeScore
                </button>
              </div>
            </form>
          </div>
        )}

        {/* === ÉTAPE 2 : RÉSULTATS === */}
        {step === "result" && scores && (
          <div className="ls-container">
            <section className="ls-result-header">
              <div className="ls-score-circle">
                <span className="ls-score-main">{scores.global}</span>
                <span className="ls-score-max">/100</span>
              </div>
              <div>
                <h1 className="ls-title">Ton LifeScore global</h1>
                <p className="ls-subtitle">
                  Ce score est une photographie rapide de ton équilibre de vie.
                  Il ne remplace pas un avis professionnel, mais te donne un
                  repère concret pour organiser la suite.
                </p>
              </div>
            </section>

            <section className="ls-result-grid">
              <div className="ls-result-block">
                <h2 className="ls-section-title">Scores par domaine</h2>

                <div className="ls-bar-row">
                  <span>Finances</span>
                  <div className="ls-bar">
                    <div
                      className="ls-bar-fill"
                      style={{ width: `${scores.finances}%` }}
                    />
                  </div>
                  <span className="ls-bar-value">{scores.finances}/100</span>
                </div>

                <div className="ls-bar-row">
                  <span>Travail / activité</span>
                  <div className="ls-bar">
                    <div
                      className="ls-bar-fill"
                      style={{ width: `${scores.travail}%` }}
                    />
                  </div>
                  <span className="ls-bar-value">{scores.travail}/100</span>
                </div>

                <div className="ls-bar-row">
                  <span>Santé / énergie</span>
                  <div className="ls-bar">
                    <div
                      className="ls-bar-fill"
                      style={{ width: `${scores.sante}%` }}
                    />
                  </div>
                  <span className="ls-bar-value">{scores.sante}/100</span>
                </div>

                <div className="ls-bar-row">
                  <span>Organisation / administratif</span>
                  <div className="ls-bar">
                    <div
                      className="ls-bar-fill"
                      style={{ width: `${scores.orga}%` }}
                    />
                  </div>
                  <span className="ls-bar-value">{scores.orga}/100</span>
                </div>

                <div className="ls-bar-row">
                  <span>Relations / entourage</span>
                  <div className="ls-bar">
                    <div
                      className="ls-bar-fill"
                      style={{ width: `${scores.relations}%` }}
                    />
                  </div>
                  <span className="ls-bar-value">{scores.relations}/100</span>
                </div>

                <div className="ls-bar-row">
                  <span>État mental / ressenti</span>
                  <div className="ls-bar">
                    <div
                      className="ls-bar-fill"
                      style={{ width: `${scores.mental}%` }}
                    />
                  </div>
                  <span className="ls-bar-value">{scores.mental}/100</span>
                </div>
              </div>

              <div className="ls-result-block">
                <h2 className="ls-section-title">Lecture rapide</h2>
                <p className="ls-text">
                  Ton LifeScore global est{" "}
                  <strong>{scores.global}/100</strong>. Tu traverses
                  probablement une phase où certains domaines tirent les autres
                  vers le haut, tandis que d&apos;autres demandent à être
                  structurés.
                </p>

                <h3 className="ls-subblock-title">Forces actuelles</h3>
                <ul className="ls-list">
                  <li>
                    Les domaines dont le score est le plus élevé sont tes
                    appuis. Tu peux t&apos;en servir comme base pour
                    progresser dans le reste.
                  </li>
                  <li>
                    Garde une trace de ce qui fonctionne bien : habitudes,
                    environnement, personnes qui t&apos;entourent.
                  </li>
                </ul>

                <h3 className="ls-subblock-title">Axes prioritaires</h3>
                <ul className="ls-list">
                  <li>
                    Commence par le domaine le plus bas (finances, organisation,
                    santé, etc.) et choisis une seule action simple à réaliser
                    dans les 7 prochains jours.
                  </li>
                  <li>
                    Concentre-toi sur des actions réalistes : régulariser un
                    papier, clarifier un budget, prendre un rendez-vous médical,
                    organiser une discussion importante, etc.
                  </li>
                </ul>

                <h3 className="ls-subblock-title">Et après ?</h3>
                <p className="ls-text">
                  L&apos;idée de LifeScore.ai n&apos;est pas de te juger, mais
                  de te donner un repère chiffré pour suivre ton évolution. Tu
                  peux revenir faire le test régulièrement pour voir si tes
                  actions concrètes font bouger les scores.
                </p>

                <div className="ls-submit-row">
                  <button type="button" className="ls-button" onClick={resetAll}>
                    Refaire le questionnaire
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* SECTION À PROPOS */}
        <section id="apropos" className="ls-about">
          <div className="ls-container">
            <h2 className="ls-section-title">À propos de LifeScore.ai</h2>
            <p className="ls-text">
              LifeScore.ai est un outil expérimental conçu pour t&apos;aider à
              prendre du recul sur ta situation globale. Le questionnaire reste
              volontairement simple&nbsp;: aucune réponse n&apos;est enregistrée
              côté serveur et tu peux refaire le test autant de fois que tu le
              souhaites.
            </p>
            <p className="ls-text">
              Ce n&apos;est pas un diagnostic médical ni un avis financier, mais
              un point de départ pour organiser tes prochaines décisions.
            </p>
          </div>
        </section>
      </main>

      {/* FOOTER UNIQUE */}
      <footer className="ls-footer">
        © {new Date().getFullYear()} LifeScore.ai — Bilan de vie expérimental.
      </footer>
    </>
  );
}