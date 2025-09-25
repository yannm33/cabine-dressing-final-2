/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { UploadCloudIcon } from './icons';
import Spinner from './Spinner';
import { getFriendlyErrorMessage } from '../lib/utils';
import { useLocalization } from '../contexts/LocalizationContext';
import CustomImageSlider from './CustomImageSlider';
import type { PoseKey } from '../lib/translations';

// Define the order of pose generation
const POSE_KEYS_TO_GENERATE: PoseKey[] = [
  'pose_3_4',
  'pose_profile',
  'pose_hips',
  'pose_leaning',
  'pose_walking',
  'pose_bust_closeup'
];

interface StartScreenProps {
  onModelFinalized: (allPoseImages: Partial<Record<PoseKey, string>>) => void;
  apiService: {
    generateModelImage: (userImage: File) => Promise<string>;
    generatePoseVariation: (baseImage: string, poseInstruction: string) => Promise<string>;
  };
}

const screenVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

const StartScreen: React.FC<StartScreenProps> = ({ onModelFinalized, apiService }) => {
  const { t } = useLocalization();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
        setError(t('pleaseSelectImage'));
        return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
        // Step 1: Generate the base model
        setLoadingMessage(t('generatingModel'));
        const baseModelUrl = await apiService.generateModelImage(file);

        // Step 2: Generate all other poses in parallel
        setLoadingMessage(t('generatingVariations'));
        const allPoseImages: Partial<Record<PoseKey, string>> = { 'pose_default': baseModelUrl };

        const posePrompts = POSE_KEYS_TO_GENERATE.map(key => t(key));
        const promises = posePrompts.map(prompt => apiService.generatePoseVariation(baseModelUrl, prompt));
        
        const results = await Promise.allSettled(promises);

        results.forEach((result, index) => {
            const key = POSE_KEYS_TO_GENERATE[index];
            if (result.status === 'fulfilled') {
                allPoseImages[key] = result.value;
            } else {
                console.warn(`Failed to generate pose for ${key}:`, result.reason);
                // We don't block the user, just log the warning. The pose will be missing.
            }
        });
        
        onModelFinalized(allPoseImages);
        // The component will unmount, so no need to reset state here.

    } catch (err) {
        setError(getFriendlyErrorMessage(err, t));
        setIsLoading(false);
        setLoadingMessage('');
    }
  }, [t, apiService, onModelFinalized]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  return (
    <motion.div
      key="uploader"
      className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12"
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
        <div className="max-w-lg">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-gray-900 leading-tight">
            {t('createYourModel')}
          </h1>
          <p className="mt-4 text-sm md:text-base text-gray-600 font-light tracking-wider whitespace-pre-line">
            {t('wonderedWhatItLooksLike')}
          </p>
          <hr className="my-8 border-gray-200" />
          <div className="flex flex-col items-center lg:items-start w-full gap-3">
            <motion.label
              htmlFor="image-upload-start"
              className={`w-full relative flex items-center justify-center px-8 py-3 text-base font-semibold text-white bg-gray-900 rounded-md transition-colors ${isLoading ? 'cursor-not-allowed bg-gray-600' : 'cursor-pointer group hover:bg-gray-700'}`}
              whileTap={isLoading ? {} : { scale: 0.98 }}
            >
                <UploadCloudIcon className="w-5 h-5 mr-3" />
                {t('uploadAPhoto')}
            </motion.label>
            <input 
              id="image-upload-start" 
              type="file" 
              className="hidden" 
              accept="image/png, image/jpeg, image/webp, image/avif, image/heic, image/heif" 
              onChange={handleFileChange} 
              disabled={isLoading}
            />
            <p className="text-gray-500 text-[10px] md:text-xs font-light tracking-wider leading-relaxed">{t('photoGuidelines')}</p>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
        <CustomImageSlider
          leftImage="https://rrwauosncrxdziomhxoq.supabase.co/storage/v1/object/public/dressingimages/3ea8ab82-10ae-494c-abad-72f6013bed56.jpg"
          rightImage="https://rrwauosncrxdziomhxoq.supabase.co/storage/v1/object/public/dressingimages/37b6ba67-557d-4c38-b393-aee640fcbd8f.jpg"
          className="w-full max-w-sm aspect-[2/3] rounded-2xl bg-gray-200"
          isLoading={isLoading}
          loadingMessage={loadingMessage}
        />
      </div>
    </motion.div>
  );
};

export default StartScreen;
