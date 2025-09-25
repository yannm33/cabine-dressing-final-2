/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { occasionOptions, OccasionKey } from '../occasions';
import Spinner from './Spinner';
import { motion } from 'framer-motion';

interface OccasionStylingPanelProps {
  onGenerateOutfit: (occasionKey: OccasionKey) => void;
  isLoading: boolean;
  numImagesToGenerate: number;
  onNumImagesChange: (num: number) => void;
}

const OccasionStylingPanel: React.FC<OccasionStylingPanelProps> = ({ onGenerateOutfit, isLoading, numImagesToGenerate, onNumImagesChange }) => {
    const { t } = useLocalization();
    const [selectedOccasion, setSelectedOccasion] = useState<OccasionKey>(occasionOptions[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGenerateOutfit(selectedOccasion);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <h2 className="text-xl font-serif tracking-wider text-gray-800 border-b border-gray-400/50 pb-2 mb-3">{t('generateByOccasion')}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div>
                    <label htmlFor="occasion-select" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('selectAnOccasion')}
                    </label>
                    <select
                        id="occasion-select"
                        value={selectedOccasion}
                        onChange={(e) => setSelectedOccasion(e.target.value as OccasionKey)}
                        disabled={isLoading}
                        className="block w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        {occasionOptions.map((key) => (
                            <option key={key} value={key}>{t(key)}</option>
                        ))}
                    </select>
                </div>
                 <div>
                    <label htmlFor="num-images-select" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('numImagesToGenerate')}
                    </label>
                    <select
                        id="num-images-select"
                        value={numImagesToGenerate}
                        onChange={(e) => onNumImagesChange(Number(e.target.value))}
                        disabled={isLoading}
                        className="block w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        {Array.from({ length: 7 }, (_, i) => i + 1).map(n => (
                            <option key={n} value={n}>{n} {n > 1 ? t('image_plural') : t('image_singular')}</option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center text-center bg-gray-900 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 ease-in-out hover:bg-gray-700 active:scale-95 text-base disabled:bg-gray-500 disabled:cursor-wait"
                >
                    {isLoading ? (
                        <>
                            <Spinner className="h-5 w-5 mr-2" />
                            <span>{t('generatingLook')}</span>
                        </>
                    ) : (
                       t('generateLook')
                    )}
                </button>
            </form>
        </motion.div>
    );
};

export default OccasionStylingPanel;
