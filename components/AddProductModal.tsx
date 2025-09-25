/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalization } from '../contexts/LocalizationContext';
import { XIcon } from './icons';
import { WardrobeCategory } from '../types';
import type { TranslationKey } from '../lib/translations';

// Fix: Define a specific type for the item details to ensure type safety.
type WardrobeItemDetails = {
  name: string;
  category: WardrobeCategory;
  subcategory?: string;
  color?: string;
  material?: string;
  description?: string;
};

interface AddWardrobeItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (details: WardrobeItemDetails) => void;
  imagePreviewUrl: string | null;
  existingCategories: WardrobeCategory[];
  initialDetails?: Partial<WardrobeItemDetails>;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const AddWardrobeItemModal: React.FC<AddWardrobeItemModalProps> = ({ isOpen, onClose, onSave, imagePreviewUrl, existingCategories, initialDetails }) => {
  const { t } = useLocalization();
  const [itemName, setItemName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [color, setColor] = useState('');
  const [material, setMaterial] = useState('');
  const [description, setDescription] = useState('');

  const defaultCats = useMemo(() => ['Tops', 'Bottoms', 'Outerwear', 'Dresses', 'Accessories'], []);

  const uniqueCategories = useMemo(() => {
    return [...new Set([...defaultCats, ...existingCategories])];
  }, [existingCategories, defaultCats]);
  
  useEffect(() => {
    if (isOpen) {
      setItemName(initialDetails?.name || '');
      setSelectedCategory(initialDetails?.category || '');
      setSubcategory(initialDetails?.subcategory || '');
      setColor(initialDetails?.color || '');
      setMaterial(initialDetails?.material || '');
      setDescription(initialDetails?.description || '');
      setNewCategory('');
    }
  }, [isOpen, initialDetails]);

  const handleSave = () => {
    const finalCategory = newCategory.trim() || selectedCategory;
    if (itemName.trim() && finalCategory) {
      // Fix: Use the explicitly defined type for the details object. This resolves the error where properties could not be added.
      const details: WardrobeItemDetails = { name: itemName.trim(), category: finalCategory };
      if (subcategory.trim()) details.subcategory = subcategory.trim();
      if (color.trim()) details.color = color.trim();
      if (material.trim()) details.material = material.trim();
      if (description.trim()) details.description = description.trim();
      
      onSave(details);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-xl w-full max-w-sm flex flex-col shadow-xl max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">{t('addItemToWardrobe')}</h2>
              <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-100">
                <XIcon className="w-5 h-5"/>
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              {imagePreviewUrl && (
                <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                  <img src={imagePreviewUrl} alt="Item preview" className="w-full h-full object-contain" />
                </div>
              )}
              <div>
                <label htmlFor="item-name" className="block text-sm font-medium text-gray-700 mb-1">{t('itemName')}</label>
                <input
                  id="item-name"
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder={t('itemNamePlaceholder')}
                  className="block w-full p-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              <div>
                <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 mb-1">{t('category')}</label>
                <select
                  id="category-select"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    if (e.target.value) setNewCategory('');
                  }}
                  className="block w-full p-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <option value="">{t('selectCategory')}</option>
                  {uniqueCategories.map(cat => {
                    const isDefault = defaultCats.includes(cat);
                    const label = isDefault ? t(`category_${cat.toLowerCase()}` as TranslationKey) : cat;
                    return <option key={cat} value={cat}>{label}</option>;
                  })}
                </select>
              </div>
               <div>
                <label htmlFor="new-category" className="block text-sm font-medium text-gray-700 mb-1">{t('createNewCategory')}</label>
                <input
                  id="new-category"
                  type="text"
                  value={newCategory}
                  onChange={(e) => {
                    setNewCategory(e.target.value);
                    if (e.target.value) setSelectedCategory('');
                  }}
                  placeholder={t('newCategoryPlaceholder')}
                  className="block w-full p-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              <div>
                <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">{t('subcategory')}</label>
                <input
                  id="subcategory"
                  type="text"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  placeholder={t('subcategoryPlaceholder')}
                  className="block w-full p-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
               <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="item-color" className="block text-sm font-medium text-gray-700 mb-1">{t('color')}</label>
                  <input
                    id="item-color"
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder={t('colorPlaceholder')}
                    className="block w-full p-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="item-material" className="block text-sm font-medium text-gray-700 mb-1">{t('material')}</label>
                  <input
                    id="item-material"
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder={t('materialPlaceholder')}
                    className="block w-full p-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="item-description" className="block text-sm font-medium text-gray-700 mb-1">{t('description')}</label>
                <textarea
                  id="item-description"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('descriptionPlaceholder')}
                  className="block w-full p-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
            </div>
            <div className="p-4 border-t bg-gray-50 rounded-b-xl">
               <button
                  onClick={handleSave}
                  disabled={!itemName.trim() || (!selectedCategory && !newCategory.trim())}
                  className="w-full flex items-center justify-center text-center bg-gray-900 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200 ease-in-out hover:bg-gray-700 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {t('saveToWardrobe')}
                </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddWardrobeItemModal;