/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import { useLocalization } from '../contexts/LocalizationContext';

interface FooterProps {
  isOnDressingScreen?: boolean;
}

const Footer: React.FC<FooterProps> = ({ isOnDressingScreen = false }) => {
  const { t } = useLocalization();
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  const REMIX_SUGGESTIONS = useMemo(() => [
    t('remixIdea1'),
    t('remixIdea2'),
    t('remixIdea3'),
    t('remixIdea4'),
    t('remixIdea5'),
    t('remixIdea6'),
  ], [t]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSuggestionIndex((prevIndex) => (prevIndex + 1) % REMIX_SUGGESTIONS.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [REMIX_SUGGESTIONS.length]);

  const suggestionAnimation: MotionProps = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.5, ease: 'easeInOut' },
  };

  return (
    <footer className={`fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200/60 p-3 z-50 ${isOnDressingScreen ? 'hidden sm:block' : ''}`}>
      <div className="mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-gray-600 max-w-7xl px-4">
        <p>
          {t('createdBy')}{' '}
          <a 
            href="https://x.com/pixelshoot" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-semibold text-gray-800 hover:underline"
          >
            @pixelshoot
          </a>
        </p>
        <div className="h-4 mt-1 sm:mt-0 flex items-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={suggestionIndex}
                {...suggestionAnimation}
                className="text-center sm:text-right"
              >
                {REMIX_SUGGESTIONS[suggestionIndex]}
              </motion.p>
            </AnimatePresence>
        </div>
      </div>
    </footer>
  );
};

export default Footer;