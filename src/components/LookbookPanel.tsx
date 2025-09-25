/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { DownloadIcon, Trash2Icon, FileTextIcon } from './icons';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import Spinner from './Spinner';
import { LookbookItemRecord } from '../lib/db';

interface LookbookPanelProps {
  items: LookbookItemRecord[];
  onDeleteItem: (itemId: number) => void;
}

const LookbookPanel: React.FC<LookbookPanelProps> = ({ items, onDeleteItem }) => {
    const { t } = useLocalization();
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    const handleGeneratePdf = async () => {
        if (items.length === 0) return;
        setIsGeneratingPdf(true);
        
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("My Virtual Try-On Lookbook", 10, 20);

        const addImageToPdf = (imgData: string, y: number) => {
            return new Promise<number>((resolve) => {
                const img = new Image();
                img.src = imgData;
                img.onload = () => {
                    const pageWidth = doc.internal.pageSize.getWidth();
                    const pageHeight = doc.internal.pageSize.getHeight();
                    const margin = 10;
                    const availableWidth = pageWidth - margin * 2;
                    const availableHeight = 250;
                    
                    let newY = y;
                    if (y > pageHeight - margin - availableHeight) {
                        doc.addPage();
                        newY = margin;
                    }

                    const aspect = img.width / img.height;
                    const imgWidth = Math.min(availableWidth, availableHeight * aspect);
                    const imgHeight = imgWidth / aspect;
                    
                    const x = (pageWidth - imgWidth) / 2;

                    doc.addImage(imgData, 'PNG', x, newY, imgWidth, imgHeight);
                    resolve(newY + imgHeight + 10);
                };
            });
        };

        let currentY = 30;
        for (const item of items) {
            currentY = await addImageToPdf(item.dataUrl, currentY);
        }

        doc.save('virtual-try-on-lookbook.pdf');
        setIsGeneratingPdf(false);
    };

    return (
        <div>
            {items.length > 0 && (
                 <button
                    onClick={handleGeneratePdf}
                    disabled={isGeneratingPdf}
                    className="w-full mb-4 flex items-center justify-center text-center bg-gray-900 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 ease-in-out hover:bg-gray-700 active:scale-95 text-base disabled:bg-gray-500 disabled:cursor-wait"
                >
                    {isGeneratingPdf ? (
                        <>
                            <Spinner className="h-5 w-5 mr-2" />
                            <span>{t('generatingPDF')}</span>
                        </>
                    ) : (
                        <>
                            <FileTextIcon className="w-5 h-5 mr-2" />
                            {t('downloadLookbookPDF')}
                        </>
                    )}
                </button>
            )}
            
            {items.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500">{t('lookbookEmpty')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3">
                    <AnimatePresence>
                    {items.map((item, index) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            className="relative group aspect-[2/3] border rounded-lg overflow-hidden"
                        >
                            <img src={item.dataUrl} alt={`Lookbook item ${index + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 gap-2">
                                <a
                                    href={item.dataUrl}
                                    download={`outfit-${index + 1}.png`}
                                    className="w-full flex items-center justify-center text-center bg-white/80 text-gray-800 font-semibold py-2 px-2 rounded-md transition-colors duration-200 ease-in-out hover:bg-white text-xs"
                                >
                                    <DownloadIcon className="w-4 h-4 mr-1.5" />
                                    {t('download')}
                                </a>
                                <button
                                    onClick={() => onDeleteItem(item.id)}
                                    className="w-full flex items-center justify-center text-center bg-red-500/80 text-white font-semibold py-2 px-2 rounded-md transition-colors duration-200 ease-in-out hover:bg-red-500 text-xs"
                                    aria-label={t('deleteFromLookbook')}
                                >
                                    <Trash2Icon className="w-4 h-4 mr-1.5" />
                                    {t('deleteAction')}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default LookbookPanel;
