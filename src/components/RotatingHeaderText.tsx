// src/components/RotatingHeaderText.tsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
];

export default function RotatingHeaderText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setIndex((prev) => (prev + 1) % texts.length),
      4000 // ⏱️5 secondes entre chaque phrase
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <AnimatePresence mode="wait">
        <motion.h2
          key={index}
          className="text-3xl md:text-4xl font-bold text-center px-4 leading-snug"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.8 }}
        >
          {texts[index]}
        </motion.h2>
      </AnimatePresence>
    </div>
  );
}
