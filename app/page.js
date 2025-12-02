"use client";

import React, { useState } from "react";

const domains = [
  {
    id: "finances",
    label: "Finances",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      {
        id: "fin_situation",
        label: "Situation financière globale",
      },
      {
        id: "fin_budget",
        label: "Gestion du budget",
      },
      {
        id: "fin_dettes",
        label: "Poids des dettes",
      },
    ],
  },
  {
    id: "travail",
    label: "Travail / activité",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      {
        id: "job_confiance",
        label: "Confiance dans ton travail / activité",
      },
      {
        id: "job_sens",
        label: "Sens de ton activité",
      },
    ],
  },
  {
    id: "sante",
    label: "Santé / énergie",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      {
        id: "sante_energie",
        label: "Niveau d'énergie global",
      },
      {
        id: "sante_hygiene",
        label: "Qualité de ton hygiène de vie",
      },
    ],
  },
  {
    id: "orga",
    label: "Organisation / administratif",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      {
        id: "orga_quotidien",
        label: "Organisation de ton quotidien",
      },
      {
        id: "orga_admin",
        label: "Gestion de l'administratif",
      },
    ],
  },
  {
    id: "relations",
    label: "Relations / entourage",
    description: "1 = très mauvaise, 10 = excellente.",
    questions: [
      {
        id: "rel_soutien",
        label: "Soutien ressenti de la part ton entourage",
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
    description: "1 = très mauvaise, 10 = excellente.",
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

export default function HomePage() {
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);

  const handleChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
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
        const val = answers[q.id] ?? 5; // par défaut 5/10
        allValues.push(val);
        return val;
      });

      const avgDomain =
        values.reduce((sum, v) => sum + v, 0) / values.length || 0;

      domainScores[domain.label] = Math.round(avgDomain * 10);
    });

    const globalAvg =
      allValues.length > 0
        ? allValues.reduce((sum, v) => sum + v, 0) / allValues.length
        : 0;

    const globalScore = Math.round(globalAvg * 10);

    setResults({
      globalScore,
      domainScores,
    });

    const el = document.getElementById("lk-results");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const getScoreText = (score) => {
    if (score >= 70) return "élevé";
    if (score >= 40) return "intermédiaire";
    return "fragile";
  };

  return (
    <div className="lk-app">
      {/* HEADER */}
      <header className="lk-header">
        <div className="lk-header-inner">
          {/* Logo à gauche, cliquable pour revenir en haut */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("lk-home");
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }}
            style={{
              padding: 0,
              margin: 0,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src="/logo.png"
              alt="Lifekore – Ta vie a un potentiel, mesure-la."
              style={{
                height: 240,
                width: "auto",
                display: "block",
              }}
            />
          </button>

          {/* PHRASE ENTRE LOGO ET BOUTONS */}
          <div
            style={{
              flex: 1,
              marginLeft: 16,
              marginRight: 16,
              fontSize: 24, // plus grand
              fontWeight: 700, // très lisible, épais
              lineHeight: 1.3,
              color: "#0A2A43", // bleu du logo
              maxWidth: 420,
              textAlign: "center",
              fontFamily:
                "Poppins, Inter, system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
            }}
          >
            Découvre ton LifeKore Identity™.
            <br />
            Comprends où tu te trouves, avance vers où tu veux aller.
          </div>

          {/* Boutons à droite */}
          <nav className="lk-nav">
            <button
              type="button"
              className="lk-button lk-button-primary lk-button-small"
            >
              Se connecter
            </button>
            <button
              type="button"
              className="lk-button lk-button-primary lk-button-small"
            >
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
            <p>
              Lifekore t&apos;aide à obtenir une photographie honnête et
              structurée de ton équilibre actuel.
            </p>
            <p>
              En quelques questions, tu obtiens un{" "}
              <strong>score global</strong> et des{" "}
              <strong>scores détaillés</strong> dans six domaines essentiels.
            </p>
            <p>
              Il n&apos;existe pas de bonne ou de mauvaise réponse : seulement
              une vision claire pour avancer.
            </p>
            <div
              className="lk-scale-info"
              style={{
                backgroundColor: "#0A2A43",
                color: "white",
                padding: "12px 16px",
                borderRadius: "12px",
                fontSize: "14px",
                text