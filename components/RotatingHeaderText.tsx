import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocalization } from "../contexts/LocalizationContext";

export default function RotatingHeaderText() {
  const { t } = useLocalization();
  const texts = [
    t("rotating_slogan_1"),
    t("rotating_slogan_2"),
    t("rotating_slogan_3"),
    t("rotating_slogan_4"),
    t("rotating_slogan_5"),
    t("rotating_slogan_6"),
    t("rotating_slogan_7"),
    t("rotating_slogan_8"),
    t("rotating_slogan_9"),
    t("rotating_slogan_10"),
    t("rotating_slogan_11"),
    t("rotating_slogan_12"),
    t("rotating_slogan_13"),
    t("rotating_slogan_14"),
    t("rotating_slogan_15"),
  ];

  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let currentText = texts[index];
    let i = 0;

    const typeInterval = setInterval(() => {
      setDisplayText(currentText.slice(0, i + 1));
      i++;
      if (i === currentText.length) {
        clearInterval(typeInterval);
        setTimeout(() => {
          setIndex((prev) => (prev + 1) % texts.length);
          setDisplayText("");
        }, 3000); // pause après avoir écrit tout le texte
      }
    }, 50); // vitesse d’écriture

    return () => clearInterval(typeInterval);
  }, [index, texts]);

  return (
    <div className="relative w-full text-center text-base md:text-lg lg:text-xl font-medium text-gray-800 h-14 flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          className="whitespace-pre-line font-mono" // 👈 police machine à écrire
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {displayText}
          <span className="animate-blink">|</span>
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
