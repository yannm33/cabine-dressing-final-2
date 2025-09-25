/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { ShirtIcon } from './icons';
import { useLocalization } from '../contexts/LocalizationContext';
import LanguageSwitcher from './LanguageSwitcher';

const Header: React.FC = () => {
  const { t } = useLocalization();
  return (
    <header className="w-full py-4 px-4 md:px-8 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-200/60">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <ShirtIcon className="w-6 h-6 text-gray-700" />
            <h1 className="text-2xl font-serif tracking-widest text-gray-800">
              {t('virtualTryOn')}
            </h1>
        </div>
        <LanguageSwitcher />
      </div>
    </header>
  );
};

export default Header;