/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import { UploadCloudIcon } from './icons';
import { Compare } from './ui/compare';
import { generateModelImage } from '../services/geminiService';
import Spinner from './Spinner';
import { getFriendlyErrorMessage } from '../lib/utils';
import { useLocalization } from '../contexts/LocalizationContext';

interface StartScreenProps {
  onModelFinalized: (modelUrl: string) => void;
}

const screenVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

const screenAnimation: MotionProps = {
  variants: screenVariants,
  initial: "initial",
  animate: "animate",
  exit: "exit",
  transition: { duration: 0.4, ease: "easeInOut" },
};

const StartScreen: React.FC<StartScreenProps> = ({ onModelFinalized }) => {
  const { t } = useLocalization();
  const [userImageUrl, setUserImageUrl] = useState<string | null>(null);
  const [generatedModelUrl, setGeneratedModelUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
        setError(t('pleaseSelectImage'));
        return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        setUserImageUrl(dataUrl);
        setIsGenerating(true);
        setGeneratedModelUrl(null);
        setError(null);
        try {
            const result = await generateModelImage(file);
            setGeneratedModelUrl(result);
        } catch (err) {
            setError(getFriendlyErrorMessage(err, t));
            setUserImageUrl(null);
        } finally {
            setIsGenerating(false);
        }
    };
    reader.readAsDataURL(file);
  }, [t]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const reset = () => {
    setUserImageUrl(null);
    setGeneratedModelUrl(null);
    setIsGenerating(false);
    setError(null);
  };

  const buttonsAnimation: MotionProps = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
    transition: { duration: 0.5 },
  };

  const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.currentTarget;
    target.classList.add('animate-glow');
    setTimeout(() => {
        target.classList.remove('animate-glow');
    }, 700);
  };


  return (
    <AnimatePresence mode="wait">
      {!userImageUrl ? (
        <motion.div
          key="uploader"
          className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12"
          {...screenAnimation}
        >
          <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="max-w-lg">
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 leading-tight">
                {t('createYourModel')}
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                {t('wonderedWhatItLooksLike')}
              </p>
              <hr className="my-8 border-gray-200" />
              <div className="flex flex-col items-center lg:items-start w-full gap-3">
                <motion.label
                  htmlFor="image-upload-start"
                  className="w-full relative flex items-center justify-center px-8 py-3 text-base font-semibold text-white bg-gray-900 rounded-md cursor-pointer group hover:bg-gray-700 transition-colors"
                  whileTap={{ scale: 0.98 }}
                  onClick={handleButtonClick}
                >
                  <UploadCloudIcon className="w-5 h-5 mr-3" />
                  {t('uploadAPhoto')}
                </motion.label>
                <input id="image-upload-start" type="file" className="hidden" accept="image/png, image/jpeg, image/webp, image/avif, image/heic, image/heif" onChange={handleFileChange} />
                <p className="text-gray-500 text-sm">{t('photoGuidelines')}</p>
                <p className="text-gray-500 text-xs mt-1">{t('legalDisclaimer')}</p>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
            <Compare
              firstImage="https://rrwauosncrxdziomhxoq.supabase.co/storage/v1/object/public/dressingimages/3ea8ab82-10ae-494c-abad-72f6013bed56.jpg"
              secondImage="https://rrwauosncrxdziomhxoq.supabase.co/storage/v1/object/public/dressingimages/37b6ba67-557d-4c38-b393-aee640fcbd8f.jpg"
              slideMode="drag"
              className="w-full max-w-sm aspect-[2/3] rounded-2xl bg-gray-200"
            />
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="compare"
          className="w-full max-w-6xl mx-auto h-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12"
          {...screenAnimation}
        >
          <div className="md:w-1/2 flex-shrink-0 flex flex-col items-center md:items-start">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
                {t('theNewYou')}
              </h1>
              <p className="mt-2 text-md text-gray-600">
                {t('dragToSeeTransform')}
              </p>
            </div>
            
            {isGenerating && (
              <div className="flex items-center gap-3 text-lg text-gray-700 font-serif mt-6">
                <Spinner />
                <span>{t('generatingModel')}...</span>
              </div>
            )}

            {error && 
              <div className="text-center md:text-left text-red-600 max-w-md mt-6">
                <p className="font-semibold">{t('generationFailed')}</p>
                <p className="text-sm mb-4">{error}</p>
                <button onClick={reset} className="text-sm font-semibold text-gray-700 hover:underline">{t('tryAgain')}</button>
              </div>
            }
            
            <AnimatePresence>
              {generatedModelUrl && !isGenerating && !error && (
                <motion.div
                  {...buttonsAnimation}
                  className="flex flex-col sm:flex-row items-center gap-4 mt-8"
                >
                  <motion.button 
                    onClick={reset}
                    className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-gray-700 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300 transition-colors"
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {t('useDifferentPhoto')}
                  </motion.button>
                  <motion.button 
                    onClick={(e) => {
                        handleButtonClick(e);
                        // Delay finalization to allow animation to be visible
                        setTimeout(() => onModelFinalized(generatedModelUrl), 200);
                    }}
                    className="w-full sm:w-auto relative inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white bg-gray-900 rounded-md cursor-pointer group hover:bg-gray-700 transition-colors"
                    whileTap={{ scale: 0.98 }}
                  >
                    {t('proceedToStyling')} &rarr;
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="md:w-1/2 w-full flex items-center justify-center">
            <div 
              className={`relative rounded-[1.25rem] transition-all duration-700 ease-in-out ${isGenerating ? 'border border-gray-300 animate-pulse' : 'border border-transparent'}`}
            >
              <Compare
                firstImage={userImageUrl}
                secondImage={generatedModelUrl ?? userImageUrl}
                slideMode="drag"
                className="w-[280px] h-[420px] sm:w-[320px] sm:h-[480px] lg:w-[400px] lg:h-[600px] rounded-2xl bg-gray-200"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StartScreen;