/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalization } from "../contexts/LocalizationContext";

const RotatingText: React.FC = () => {
  const { t } = useLocalization();
  const [index, setIndex] = useState(0);

  // On récupère toutes les clés des slogans dans un tableau
  const slogans = [
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

  // Rotation automatique toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slogans.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slogans.length]);

  return (
    <div className="relative w-full text-center text-lg md:text-xl lg:text-2xl font-medium text-gray-700 h-12 flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute"
        >
          {slogans[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RotatingText;
