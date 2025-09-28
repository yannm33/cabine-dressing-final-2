/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { RotateCcwIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';
import Spinner from './Spinner';
import { AnimatePresence, motion, MotionProps } from 'framer-motion';
import { useLocalization } from '../contexts/LocalizationContext';

interface CanvasProps {
  displayImageUrl: string | null;
  poseImages: Partial<Record<string, string>> | null;
  currentPoseKey: string;
  onSelectPose: (key: string) => void;
  isLoading: boolean;
  loadingMessage: string;
  onStartOver: () => void;
}

const Canvas: React.FC<CanvasProps> = ({
  displayImageUrl,
  poseImages,
  currentPoseKey,
  onSelectPose,
  isLoading,
  loadingMessage,
  onStartOver
}) => {
  const { t } = useLocalization();
  const [isPoseMenuOpen, setIsPoseMenuOpen] = useState(false);

  const availablePoseKeys = poseImages ? Object.keys(poseImages) : [];

  const handlePreviousPose = () => {
    if (isLoading || availablePoseKeys.length <= 1) return;
    const currentIndex = availablePoseKeys.indexOf(currentPoseKey);
    const prevIndex = (currentIndex - 1 + availablePoseKeys.length) % availablePoseKeys.length;
    onSelectPose(availablePoseKeys[prevIndex]);
  };

  const handleNextPose = () => {
    if (isLoading || availablePoseKeys.length <= 1) return;
    const currentIndex = availablePoseKeys.indexOf(currentPoseKey);
    const nextIndex = (currentIndex + 1) % availablePoseKeys.length;
    onSelectPose(availablePoseKeys[nextIndex]);
  };

  const loadingOverlayAnimation: MotionProps = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const poseMenuAnimation: MotionProps = {
    initial: { opacity: 0, y: 10, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 10, scale: 0.95 },
    transition: { duration: 0.2, ease: "easeOut" },
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4 relative animate-zoom-in group">
      <button
        onClick={onStartOver}
        className="absolute top-4 left-4 z-30 flex items-center justify-center text-center bg-white/60 border border-gray-300/80 text-gray-700 font-semibold py-2 px-4 rounded-full transition-all duration-200 ease-in-out hover:bg-white hover:border-gray-400 active:scale-95 text-sm backdrop-blur-sm"
      >
        <RotateCcwIcon className="w-4 h-4 mr-2" />
        {t('startOver')}
      </button>

      <div className="relative w-full h-full flex items-center justify-center">
        {displayImageUrl ? (
          <img
            key={displayImageUrl}
            src={displayImageUrl}
            alt="Virtual try-on model"
            className="max-w-full max-h-full object-contain transition-opacity duration-500 animate-fade-in rounded-lg"
          />
        ) : (
          <div className="w-[400px] h-[600px] bg-gray-100 border border-gray-200 rounded-lg flex flex-col items-center justify-center">
            <Spinner />
            <p className="text-md font-serif text-gray-600 mt-4">{t('loadingModel')}</p>
          </div>
        )}

        <AnimatePresence>
          {isLoading && (
            <motion.div
              className="absolute inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center z-20 rounded-lg"
              {...loadingOverlayAnimation}
            >
              <Spinner />
              {loadingMessage && (
                <p className="text-lg font-serif text-gray-700 mt-4 text-center px-4">{loadingMessage}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {displayImageUrl && !isLoading && availablePoseKeys.length > 1 && (
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onMouseEnter={() => setIsPoseMenuOpen(true)}
          onMouseLeave={() => setIsPoseMenuOpen(false)}
        >
          <AnimatePresence>
            {isPoseMenuOpen && (
              <motion.div
                {...poseMenuAnimation}
                className="absolute bottom-full mb-3 w-64 bg-white/80 backdrop-blur-lg rounded-xl p-2 border border-gray-200/80"
              >
                <div className="grid grid-cols-2 gap-2">
                  {availablePoseKeys.map((poseKey) => (
                    <button
                      key={poseKey}
                      onClick={() => onSelectPose(poseKey)}
                      disabled={isLoading || poseKey === currentPoseKey}
                      className="w-full text-left text-sm font-medium text-gray-800 p-2 rounded-md hover:bg-gray-200/70 disabled:opacity-50 disabled:bg-gray-200/70 disabled:font-bold disabled:cursor-not-allowed"
                    >
                      {poseKey}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-center gap-2 bg-white/60 backdrop-blur-md rounded-full p-2 border border-gray-300/50">
            <button
              onClick={handlePreviousPose}
              aria-label={t('previousPose')}
              className="p-2 rounded-full hover:bg-white/80 active:scale-90 transition-all disabled:opacity-50"
              disabled={isLoading}
            >
              <ChevronLeftIcon className="w-5 h-5 text-gray-800" />
            </button>
            <span
              className="text-sm font-semibold text-gray-800 w-48 text-center truncate"
              title={currentPoseKey}
            >
              {currentPoseKey}
            </span>
            <button
              onClick={handleNextPose}
              aria-label={t('nextPose')}
              className="p-2 rounded-full hover:bg-white/80 active:scale-90 transition-all disabled:opacity-50"
              disabled={isLoading}
            >
              <ChevronRightIcon className="w-5 h-5 text-gray-800" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Canvas;
