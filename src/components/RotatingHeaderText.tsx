// src/pages/Home.tsx

import RotatingHeaderText from "../components/RotatingHeaderText";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start">
      
      {/* Bandeau langues + carousel fixé en haut */}
      <div className="absolute top-2 left-0 right-0 flex flex-col items-center">
        <RotatingHeaderText />
      </div>

      {/* Section principale */}
      <main className="flex flex-col md:flex-row items-center justify-center flex-1 w-full px-4 md:px-12 mt-24 md:mt-32">
        
        {/* Texte gauche */}
        <div className="max-w-xl text-center md:text-left">
          <h1 className="text-lg md:text-2xl font-bold leading-snug mb-4">
            Créez Votre dressing pour N’importe Quel Look suivant votre humeur.
          </h1>

          <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6">
            Essayez vos tenues sans deviner. <br />
            Téléchargez une photo et l’IA crée votre modèle personnel,
            prêt à tout essayer. <br />
            L’application classe et organise votre dressing : vêtements,
            accessoires, bijoux… <br />
            Composez vos looks en direct selon votre humeur. <br />
            Un vrai dressing virtuel, toujours à portée de main.
          </p>

          <button className="bg-black text-white px-6 py-3 rounded-lg text-base md:text-lg font-semibold">
            Télécharger une Photo
          </button>
        </div>

        {/* Image droite */}
        <div className="mt-8 md:mt-0 md:ml-12 w-full md:w-1/2 flex justify-center">
          {/* 👉 Ici ton composant de comparaison d’images */}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-4 text-xs text-gray-500">
        © 2025 PixelShoot — Développé par Pixelshoot AI
      </footer>
    </div>
  );
}
