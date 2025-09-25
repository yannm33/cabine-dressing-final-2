/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { hairstyleOptions, HairstyleKey } from '../hairstyles';
import Spinner from './Spinner';
import { motion } from 'framer-motion';

interface HairstylePanelProps {
  onApplyHairstyle: (hairstyleKey: HairstyleKey) => void;
  isLoading: boolean;
}

const HairstylePanel: React.FC<HairstylePanelProps> = ({ onApplyHairstyle, isLoading }) => {
    const { t } = useLocalization();
    const [selectedHairstyle, setSelectedHairstyle] = useState<HairstyleKey>(hairstyleOptions[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onApplyHairstyle(selectedHairstyle);
    };

    return (
        <motion.div 
          className="pt-4 mt-4 border-t border-gray-400/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
            <h3 className="text-md font-semibold text-gray-800 mb-2">{t('hairstylePanelTitle')}</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <div>
                    <label htmlFor="hairstyle-select" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('selectHairstyle')}
                    </label>
                    <select
                        id="hairstyle-select"
                        value={selectedHairstyle}
                        onChange={(e) => setSelectedHairstyle(e.target.value as HairstyleKey)}
                        disabled={isLoading}
                        className="block w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        {hairstyleOptions.map((key) => (
                            <option key={key} value={key}>{t(key)}</option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center text-center bg-gray-900 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 ease-in-out hover:bg-gray-700 active:scale-95 text-base disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <Spinner className="h-5 w-5 mr-2" />
                            <span>{t('modifyingLook')}</span>
                        </>
                    ) : (
                       t('applyHairstyle')
                    )}
                </button>
            </form>
        </motion.div>
    );
};

export default HairstylePanel;
