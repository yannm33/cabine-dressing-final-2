// src/components/RotatingHeaderText.tsx

import React, { useEffect, useState } from "react";

const texts = [
  "Et si votre dressing devenait votre terrain de jeu ?",
  "La mode oublie, vous pouvez l’inventer.",
  "Chaque vêtement est une émotion déguisée.",
  "Habiller ses rêves, c’est déjà commencer à les vivre.",
  "Votre style est une histoire, à vous de l’écrire.",
  "Un look n’est pas une armure, c’est une révélation.",
  "Et si l’essentiel n’était pas de plaire, mais de se plaire ?",
  "Votre dressing est une scène, jouez votre rôle.",
  "La vraie élégance, c’est de rester soi-même.",
  "Vous êtes plus que vos vêtements, mais vos vêtements parlent pour vous.",
  "Un miroir reflète, mais un style révèle.",
  "Chaque pièce choisie est une note de votre mélodie.",
  "Habillez vos instants comme s’ils comptaient… parce qu’ils comptent.",
  "La mode passe, mais l’attitude reste.",
  "Inventez l’allure qui vous ressemble, pas celle qu’on vous impose.",
  "Vos habits ne sont pas des murs, mais des fenêtres.",
  "Et si l’audace commençait dans votre placard ?",
  "Votre dressing est un carnet de voyage : ouvrez-le.",
  "Les vêtements changent, mais l’élan reste le vôtre.",
  "Habiller l’instant, c’est lui donner une âme."
];

export default function RotatingHeaderText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setIndex((prev) => (prev + 1) % texts.length),
      4000 // ⏱️ 4 secondes entre chaque phrase
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center px-4">
      {/* Texte qui défile (carousel) */}
      <h2 className="text-xl md:text-2xl font-semibold leading-snug mb-3">
        {texts[index]}
      </h2>

      {/* Sous-texte fixe */}
      <p className="text-base md:text-lg text-gray-700">
        Créez votre dressing pour n'importe quel look suivant votre humeur.
      </p>
    </div>
  );
}
