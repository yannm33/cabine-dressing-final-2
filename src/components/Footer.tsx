/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { useLocalization } from '../contexts/LocalizationContext';

interface FooterProps {
  isOnDressingScreen?: boolean;
}

const Footer: React.FC<FooterProps> = ({ isOnDressingScreen = false }) => {
  const { t } = useLocalization();

  return (
    <footer className={`fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200/60 p-3 z-50 ${isOnDressingScreen ? 'hidden sm:block' : ''}`}>
      <div className="mx-auto flex items-center justify-center text-xs text-gray-600 max-w-7xl px-4">
        <p>
          {t('footerCredit')}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
