/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { ShirtIcon } from './icons';
import LanguageSwitcher from './LanguageSwitcher';
import RotatingHeaderText from './RotatingHeaderText';
import { useLocalization } from '../contexts/LocalizationContext';

interface HeaderProps {
  isMockMode?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isMockMode = false }) => {
  const { t } = useLocalization();
  return (
    <header className="relative w-full py-4 px-4 md:px-8 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-200/60">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
            <ShirtIcon className="w-6 h-6 text-gray-700" />
            <RotatingHeaderText />
        </div>
        <LanguageSwitcher />
      </div>
       {isMockMode && (
          <div className="absolute top-full left-0 right-0 bg-yellow-300 text-yellow-900 text-xs font-bold text-center py-1">
              {t('mockModeActive')}
          </div>
      )}
    </header>
  );
};

export default Header;