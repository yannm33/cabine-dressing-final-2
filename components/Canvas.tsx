/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useMemo } from 'react';
import { BookmarkIcon, CheckCircleIcon } from './icons';
import Spinner from './Spinner';
import { AnimatePresence, motion, MotionProps } from 'framer-motion';
import { useLocalization } from '../contexts/LocalizationContext';
import type { PoseKey } from '../lib/translations';
import { LookbookItemRecord } from '../lib/db';

interface CanvasProps {
  displayImageUrl: string | null;
  poseImages: Partial<Record<PoseKey, string>> | null;
  currentPoseKey: PoseKey;
  onSelectPose: (poseKey: PoseKey) => void;
  isLoading: boolean;
  loadingMessage: string;
  onSavePoseToLookbook: (imageUrl: string) => Promise<boolean>;
  lookbookItems: LookbookItemRecord[];
}

const POSE_ORDER: PoseKey[] = [
  'pose_default',
  'pose_3_4',
  'pose_profile',
  'pose_hips',
  'pose_leaning',
  'pose_walking',
  'pose_bust_closeup'
];

const Canvas: React.FC<CanvasProps> = ({ 
  displayImageUrl, 
  poseImages, 
  currentPoseKey, 
  onSelectPose, 
  isLoading, 
  loadingMessage, 
  onSavePoseToLookbook,
  lookbookItems 
}) => {
  const { t } = useLocalization();
  const [savedStates, setSavedStates] = useState<Record<string, boolean>>({});

  const lookbookUrls = useMemo(() => new Set(lookbookItems.map(item => item.dataUrl)), [lookbookItems]);

  const handleSaveClick = async (imageUrl: string) => {
    if (isLoading || savedStates[imageUrl] || lookbookUrls.has(imageUrl)) return;
    
    const success = await onSavePoseToLookbook(imageUrl);
    if (success) {
      setSavedStates(prev => ({ ...prev, [imageUrl]: true }));
      setTimeout(() => {
        setSavedStates(prev => ({ ...prev, [imageUrl]: false }));
      }, 2000);
    }
  };
  
  const loadingOverlayAnimation: MotionProps = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const sortedPoseEntries = useMemo(() => {
    if (!poseImages) return [];
    return Object.entries(poseImages).sort(([keyA], [keyB]) => {
      return POSE_ORDER.indexOf(keyA as PoseKey) - POSE_ORDER.indexOf(keyB as PoseKey);
    }) as [PoseKey, string][];
  }, [poseImages]);

  return (
    <div className="w-full h-full flex items-start justify-center gap-4 min-h-0">
      
      {/* Vertical Pose Thumbnails */}
      {displayImageUrl && !isLoading && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex-shrink-0 self-start flex flex-col gap-2 bg-white/60 backdrop-blur-md rounded-xl p-2 border border-gray-300/50 shadow-sm overflow-y-auto max-h-full"
        >
          {sortedPoseEntries.map(([key, url]) => {
            const isSaved = lookbookUrls.has(url);
            const showSavedConfirmation = savedStates[url];
            return (
              <div key={key} className="relative group">
                <button
                  onClick={() => onSelectPose(key)}
                  className={`w-20 h-20 aspect-square rounded-md overflow-hidden transition-all duration-200 border-2 ${
                    key === currentPoseKey 
                      ? 'border-gray-800' 
                      : 'border-transparent hover:border-gray-400'
                  }`}
                  title={t(key as PoseKey)}
                >
                  <img src={url} alt={t(key as PoseKey)} className="w-full h-full object-cover"/>
                </button>
                <button
                  onClick={() => handleSaveClick(url)}
                  disabled={isSaved}
                  className={`absolute bottom-1 right-1 p-1 rounded-full transition-all text-white backdrop-blur-sm ${isSaved ? 'bg-green-500 cursor-default' : 'bg-black/40 group-hover:opacity-100 opacity-0 hover:bg-blue-500'}`}
                  aria-label={isSaved ? t('outfitSaved') : t('saveOutfit')}
                >
                  {showSavedConfirmation ? <CheckCircleIcon className="w-4 h-4" /> : <BookmarkIcon className="w-4 h-4" />}
                </button>
              </div>
            )
          })}
        </motion.div>
      )}

      {/* Image Canvas */}
      <div className="relative w-full h-full flex items-center justify-center min-h-0">
        <div className="w-full h-full aspect-square flex items-center justify-center">
          {displayImageUrl ? (
            <img
              key={displayImageUrl}
              src={displayImageUrl}
              alt="Virtual try-on model"
              className="max-w-full max-h-full object-contain transition-opacity duration-500 animate-fade-in rounded-lg"
            />
          ) : (
              <div className="w-full h-full bg-gray-100 border border-gray-200 rounded-lg flex flex-col items-center justify-center">
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
      </div>
    </div>
  );
};

export default Canvas;