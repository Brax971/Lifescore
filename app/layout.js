import "./globals.css";

export const metadata = {
  title: "Lifecore – Ta vie a un potentiel, mesure-la",
  description: "Calcule ton LifeScore et obtiens un bilan de vie structuré en quelques questions.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <div className="ls-page">
          {children}
        </div>
      </body>
    </html>
  );
}