/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { RotateCcwIcon, Share2Icon, BookmarkIcon } from './icons';
import { useLocalization } from '../contexts/LocalizationContext';

interface ToolbarProps {
  onStartOver: () => void;
  onOpenShareModal: () => void;
  onSave: () => void;
  isActionDisabled: boolean;
  isSaveDisabled: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onStartOver,
  onOpenShareModal,
  onSave,
  isActionDisabled,
  isSaveDisabled
}) => {
  const { t } = useLocalization();
  const buttonClasses = "flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-xl bg-black/5 backdrop-blur-xl border border-white/20 text-gray-800 font-medium shadow-sm transition-all hover:bg-black/10 hover:shadow-md hover:shadow-gray-900/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm";

  return (
    <div className="flex-shrink-0 flex items-center justify-center w-full">
      <div className="flex items-center justify-center gap-2">
        <button 
            onClick={onStartOver}
            className={buttonClasses}
        >
            <RotateCcwIcon className="w-4 h-4" />
            <span>{t('startOver')}</span>
        </button>
        <button 
            onClick={onOpenShareModal}
            disabled={isActionDisabled}
            className={buttonClasses}
        >
            <Share2Icon className="w-4 h-4" />
            <span>{t('share')}</span>
        </button>
         <button
            onClick={onSave}
            disabled={isSaveDisabled}
            className={buttonClasses}
        >
            <BookmarkIcon className="w-4 h-4" />
            <span>{t('saveOutfit')}</span>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
