/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { useLocalization } from '../contexts/LocalizationContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLocalization();

  const handleLanguageChange = (lang: 'fr' | 'en') => {
    setLanguage(lang);
  };

  return (
    <div className="flex items-center space-x-2">
      {(['fr', 'en'] as const).map((lang) => (
        <button
          key={lang}
          onClick={() => handleLanguageChange(lang)}
          className={`px-3 py-1 text-sm font-bold rounded-md transition-colors relative ${
            language === lang
              ? 'bg-gray-800 text-white'
              : 'text-gray-600 hover:bg-gray-200'
          }`}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
