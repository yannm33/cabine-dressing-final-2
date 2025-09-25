/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import StartScreen from './components/StartScreen';
import Canvas from './components/Canvas';
import WardrobePanel from './components/WardrobeModal';
import OutfitStack from './components/OutfitStack';
import { OutfitLayer, WardrobeItem, WardrobeCategory } from './types';
import { defaultWardrobe } from './wardrobe';
import Footer from './components/Footer';
import { getFriendlyErrorMessage, urlToFile } from './lib/utils';
import { useLocalization } from './contexts/LocalizationContext';
import Header from './components/Header';
import ShareModal from './components/ShareModal';
import OccasionStylingPanel from './components/OccasionStylingPanel';
import LookbookPanel from './components/LookbookPanel';
import { OccasionKey } from './occasions';
import { translations } from './lib/translations';
import type { TranslationKey, PoseKey } from './lib/translations';
import ImageModificationPanel from './components/ImageModificationPanel';
import { addLookbookItem, getLookbookItems, deleteLookbookItem, LookbookItemRecord, getWardrobeItems, addWardrobeItem, deleteWardrobeItem as deleteWardrobeItemFromDb } from './lib/db';
import Toolbar from './components/Toolbar';
import AddWardrobeItemModal from './components/AddProductModal';
import HairstylePanel from './components/HairstylePanel';
import { HairstyleKey } from './hairstyles';


// Import both real and mock services
import * as realGeminiService from './services/geminiService';
import * as mockGeminiService from './services/geminiService.mock';

// --- MOCK API TOGGLE ---
const USE_MOCK_API = false;

const apiService = USE_MOCK_API ? mockGeminiService : realGeminiService;

const viewVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
};

const viewAnimation: MotionProps = {
  variants: viewVariants,
  initial: "initial",
  animate: "animate",
  exit: "exit",
  transition: { duration: 0.5, ease: 'easeInOut' },
};

type Tab = 'stylist' | 'outfit' | 'wardrobe' | 'lookbook';
type GeneratorType = 'occasion' | 'modification' | 'hairstyle';

type WardrobeItemDetails = {
  name: string;
  category: WardrobeCategory;
  subcategory?: string;
  color?: string;
  material?: string;
  description?: string;
};

const POSE_KEYS_TO_GENERATE: PoseKey[] = [
  'pose_3_4',
  'pose_profile',
  'pose_hips',
  'pose_leaning',
  'pose_walking',
  'pose_bust_closeup'
];

const App: React.FC = () => {
  const { t } = useLocalization();

  const [outfitHistory, setOutfitHistory] = useState<OutfitLayer[]>([]);
  const [currentOutfitIndex, setCurrentOutfitIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [activeGenerator, setActiveGenerator] = useState<GeneratorType | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [currentPoseKey, setCurrentPoseKey] = useState<PoseKey>('pose_default');
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('stylist');
  const [lookbookItems, setLookbookItems] = useState<LookbookItemRecord[]>([]);
  const [numImagesToGenerate, setNumImagesToGenerate] = useState<number>(1);
  
  // State for the AddProductModal, lifted up from WardrobePanel
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [itemFileForModal, setItemFileForModal] = useState<{ file: File, previewUrl: string } | null>(null);
  const [initialModalDetails, setInitialModalDetails] = useState<Partial<WardrobeItemDetails> | null>(null);

  const hasModel = useMemo(() => outfitHistory.length > 0, [outfitHistory]);
  
  const existingCategories = useMemo(() => {
      const allCats = wardrobe.map(item => item.category).filter((c): c is WardrobeCategory => !!c);
      return [...new Set(allCats)];
  }, [wardrobe]);

  useEffect(() => {
    const loadItems = async () => {
        try {
            const savedLookbookItems = await getLookbookItems();
            setLookbookItems(savedLookbookItems);
            const savedWardrobeItems = await getWardrobeItems();
            const transformedItems: WardrobeItem[] = savedWardrobeItems.map(item => ({
                id: `custom-${item.createdAt.getTime()}`,
                dbId: item.id,
                name: item.name,
                category: item.category,
                subcategory: item.subcategory,
                color: item.color,
                material: item.material,
                description: item.description,
                file: item.file,
                url: URL.createObjectURL(item.file),
                isCustom: true,
            }));
            setWardrobe([...transformedItems, ...defaultWardrobe]);
        } catch (e) {
            console.error("Failed to load items from IndexedDB", e);
            setWardrobe(defaultWardrobe);
        }
    };
    loadItems();
    return () => {
        wardrobe.forEach(item => {
            if (item.isCustom && item.url.startsWith('blob:')) {
                URL.revokeObjectURL(item.url);
            }
        });
    };
  }, []);

  const activeOutfitLayers = useMemo(() => 
    outfitHistory.slice(0, currentOutfitIndex + 1), 
    [outfitHistory, currentOutfitIndex]
  );
  
  const activeGarmentIds = useMemo(() => 
    activeOutfitLayers.map(layer => layer.garment?.id).filter(Boolean) as string[], 
    [activeOutfitLayers]
  );

  const currentPoseImages = useMemo(() => {
    if (!hasModel) return null;
    return outfitHistory[currentOutfitIndex].poseImages;
  }, [outfitHistory, currentOutfitIndex, hasModel]);
  
  const displayImageUrl = useMemo(() => {
    if (!currentPoseImages) return null;
    return currentPoseImages[currentPoseKey] ?? Object.values(currentPoseImages)[0];
  }, [currentPoseImages, currentPoseKey]);

  const handleModelFinalized = (allPoseImages: Partial<Record<PoseKey, string>>) => {
    setOutfitHistory([{
      garment: null,
      poseImages: allPoseImages,
      generationPrompt: undefined,
    }]);
    setCurrentOutfitIndex(0);
    setCurrentPoseKey('pose_default');
  };

  const handleStartOver = () => {
    setOutfitHistory([]);
    setCurrentOutfitIndex(0);
    setIsLoading(false);
    setLoadingMessage('');
    setError(null);
    setCurrentPoseKey('pose_default');
  };

  const handleOpenShareModal = () => {
    if (displayImageUrl) {
        setIsShareModalOpen(true);
    }
  };
  const handleCloseShareModal = () => setIsShareModalOpen(false);

  const generateAllPoseVariationsForNewLook = useCallback(async (baseImageUrl: string, numToGenerate: number): Promise<Partial<Record<PoseKey, string>>> => {
      if (numToGenerate <= 1) {
          return { 'pose_default': baseImageUrl };
      }
      
      const allPoseImages: Partial<Record<PoseKey, string>> = { 'pose_default': baseImageUrl };
      
      const posesToGenerate = POSE_KEYS_TO_GENERATE.slice(0, numToGenerate - 1);

      const posePrompts = posesToGenerate.map(key => t(key));
      const promises = posePrompts.map(prompt => apiService.generatePoseVariation(baseImageUrl, prompt));
      
      const results = await Promise.allSettled(promises);

      results.forEach((result, index) => {
          const key = posesToGenerate[index];
          if (result.status === 'fulfilled') {
              allPoseImages[key] = result.value;
          } else {
              console.warn(`Failed to generate pose variation for ${key}:`, result.reason);
          }
      });

      return allPoseImages;
  }, [t]);

  const handleGarmentSelect = useCallback(async (garmentFile: File, garmentInfo: WardrobeItem) => {
    const baseImageForTryOn = outfitHistory[currentOutfitIndex]?.poseImages['pose_default'];

    if (!baseImageForTryOn || isLoading) {
      console.warn("Garment selected but no default pose image is available on the current layer.");
      return;
    }

    const nextLayer = outfitHistory[currentOutfitIndex + 1];
    if (nextLayer && nextLayer.garment?.id === garmentInfo.id) {
        setCurrentOutfitIndex(prev => prev + 1);
        setCurrentPoseKey('pose_default');
        return;
    }

    setError(null);
    setIsLoading(true);
    const garmentName = garmentInfo.isCustom ? garmentInfo.name : t(garmentInfo.name as TranslationKey);
    setLoadingMessage(t('addingGarment', { garmentName }));

    try {
      const newDefaultPoseUrl = await apiService.generateVirtualTryOnImage(baseImageForTryOn, garmentFile);
      
      setLoadingMessage(t('generatingVariations'));
      const allPoseImages = await generateAllPoseVariationsForNewLook(newDefaultPoseUrl, numImagesToGenerate);

      const newLayer: OutfitLayer = { 
        garment: garmentInfo, 
        poseImages: allPoseImages
      };

      setOutfitHistory(prevHistory => {
        const newHistory = prevHistory.slice(0, currentOutfitIndex + 1);
        return [...newHistory, newLayer];
      });
      setCurrentOutfitIndex(prev => prev + 1);
      setCurrentPoseKey('pose_default');
      
    } catch (err) {
      setError(getFriendlyErrorMessage(err, t));
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [isLoading, outfitHistory, currentOutfitIndex, t, generateAllPoseVariationsForNewLook, numImagesToGenerate]);
  
  const handleOpenAddModalFromWardrobe = useCallback((file: File, previewUrl: string) => {
      setItemFileForModal({ file, previewUrl });
      setInitialModalDetails(null); // Clear previous details
      setIsAddModalOpen(true);
  }, []);

  const handleAddNewItemToWardrobe = useCallback(async (details: WardrobeItemDetails, file: File) => {
      try {
        const newItemFromDb = await addWardrobeItem({ ...details, file });
        const newItem: WardrobeItem = {
            id: `custom-${newItemFromDb.createdAt.getTime()}`,
            dbId: newItemFromDb.id,
            name: newItemFromDb.name,
            category: newItemFromDb.category,
            subcategory: newItemFromDb.subcategory,
            color: newItemFromDb.color,
            material: newItemFromDb.material,
            description: newItemFromDb.description,
            file: newItemFromDb.file,
            url: URL.createObjectURL(newItemFromDb.file),
            isCustom: true,
        };
        setWardrobe(prev => [newItem, ...prev]);
      } catch (e) {
          console.error("Failed to save wardrobe item to IndexedDB", e);
          setError(getFriendlyErrorMessage(e, t));
      }
  }, [t]);

  const handleRemoveLastGarment = () => {
    if (currentOutfitIndex > 0) {
      setCurrentOutfitIndex(prevIndex => prevIndex - 1);
      setCurrentPoseKey('pose_default');
    }
  };
  
  const handlePoseSelect = (newPoseKey: PoseKey) => {
    if (isLoading || newPoseKey === currentPoseKey || !currentPoseImages?.[newPoseKey]) return;
    setCurrentPoseKey(newPoseKey);
  };

  const handleGenerateOutfitForOccasion = useCallback(async (occasionKey: OccasionKey) => {
    if (isLoading || outfitHistory.length === 0) return;

    const baseModelLayer = outfitHistory[0];
    const baseModelImage = baseModelLayer.poseImages['pose_default'];
    if (!baseModelImage) return;

    setError(null);
    setIsLoading(true);
    setActiveGenerator('occasion');
    setLoadingMessage(t('generatingLook'));

    try {
        const occasionInEnglish = translations.en[occasionKey];
        const newDefaultPoseUrl = await apiService.generateOutfitForOccasion(baseModelImage, occasionInEnglish);
        
        setLoadingMessage(t('generatingVariations'));
        const allPoseImages = await generateAllPoseVariationsForNewLook(newDefaultPoseUrl, numImagesToGenerate);

        const newLayer: OutfitLayer = {
            garment: {
                id: `generated-${Date.now()}`,
                name: t('generatedLook'),
                url: newDefaultPoseUrl,
                isCustom: true,
            },
            poseImages: allPoseImages,
            generationPrompt: t(occasionKey),
        };

        setOutfitHistory([baseModelLayer, newLayer]);
        setCurrentOutfitIndex(1);
        setCurrentPoseKey('pose_default');
        setActiveTab('outfit');

    } catch (err) {
        setError(getFriendlyErrorMessage(err, t));
    } finally {
        setIsLoading(false);
        setLoadingMessage('');
        setActiveGenerator(null);
    }
  }, [isLoading, outfitHistory, t, generateAllPoseVariationsForNewLook, numImagesToGenerate]);

  const performImageModification = useCallback(async (prompt: string, loadingMessageKey: TranslationKey, newLayerName: string) => {
    const imageToModify = outfitHistory[currentOutfitIndex]?.poseImages['pose_default'];
    if (isLoading || !imageToModify) return;

    setError(null);
    setIsLoading(true);
    setLoadingMessage(t(loadingMessageKey));

    try {
        const modifiedDefaultUrl = await apiService.editImageWithText(imageToModify, prompt);
        
        setLoadingMessage(t('generatingVariations'));
        const allPoseImages = await generateAllPoseVariationsForNewLook(modifiedDefaultUrl, numImagesToGenerate);

        const newLayer: OutfitLayer = {
            garment: {
                id: `modified-${Date.now()}`,
                name: newLayerName,
                url: modifiedDefaultUrl,
                isCustom: true,
            },
            poseImages: allPoseImages,
            generationPrompt: newLayerName,
        };

        setOutfitHistory(prev => [...prev.slice(0, currentOutfitIndex + 1), newLayer]);
        setCurrentOutfitIndex(prev => prev + 1);
        setCurrentPoseKey('pose_default');

    } catch (err) {
        setError(getFriendlyErrorMessage(err, t));
    } finally {
        setIsLoading(false);
        setLoadingMessage('');
    }
  }, [isLoading, t, currentOutfitIndex, outfitHistory, generateAllPoseVariationsForNewLook, numImagesToGenerate]);

  const handleImageModification = useCallback(async (prompt: string) => {
      setActiveGenerator('modification');
      await performImageModification(prompt, 'modifyingLook', t('modifiedLook'));
      setActiveGenerator(null);
  }, [performImageModification, t]);

  const handleApplyHairstyle = useCallback(async (hairstyleKey: HairstyleKey) => {
      setActiveGenerator('hairstyle');
      const hairstyleInEnglish = translations.en[hairstyleKey];
      const prompt = `Change the hairstyle to a "${hairstyleInEnglish}". CRITICAL: Do NOT change the person's face, hair color, outfit, or the background. Only modify the hairstyle shape and cut.`;
      await performImageModification(prompt, 'modifyingLook', t(hairstyleKey));
      setActiveGenerator(null);
  }, [performImageModification, t]);

  const handleSavePoseToLookbook = useCallback(async (imageUrlToSave: string) => {
    if (!lookbookItems.some(item => item.dataUrl === imageUrlToSave)) {
      try {
        const newItem = await addLookbookItem(imageUrlToSave);
        setLookbookItems(prevItems => [newItem, ...prevItems]);
        return true; // Indicate success
      } catch (e) {
        console.error("Failed to save lookbook to IndexedDB", e);
        setError(getFriendlyErrorMessage(e, t));
        return false; // Indicate failure
      }
    }
    return true; // Already saved, considered a success
  }, [lookbookItems, t]);
  
  const handleOpenAddToDressingModal = useCallback(async () => {
    if (!displayImageUrl) return;
    const currentLayer = outfitHistory[currentOutfitIndex];
    if (!currentLayer || !currentLayer.garment || (!currentLayer.garment.id.startsWith('generated-') && !currentLayer.garment.id.startsWith('modified-'))) return;

    setIsLoading(true);
    setLoadingMessage(t('preparingItem'));
    try {
      const file = await urlToFile(displayImageUrl, 'generated-look.png');
      setItemFileForModal({ file, previewUrl: displayImageUrl });

      let name = 'Generated Outfit';
      if(currentLayer.generationPrompt) {
          if(currentLayer.garment.id.startsWith('generated-')){
              name = t('generatedOutfitName', { prompt: currentLayer.generationPrompt });
          } else {
              name = t('modifiedOutfitName', { prompt: currentLayer.generationPrompt });
          }
      }
      setInitialModalDetails({ name, description: currentLayer.generationPrompt });
      setIsAddModalOpen(true);

    } catch(e) {
      setError(getFriendlyErrorMessage(e, t));
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [displayImageUrl, outfitHistory, currentOutfitIndex, t]);

  const handleDeleteFromLookbook = useCallback(async (itemId: number) => {
    try {
        await deleteLookbookItem(itemId);
        setLookbookItems(prevItems => prevItems.filter(item => item.id !== itemId));
    } catch (e) {
        console.error("Failed to delete from lookbook in IndexedDB", e);
        setError(getFriendlyErrorMessage(e, t));
    }
  }, [t]);

  const handleDeleteWardrobeItem = useCallback(async (itemId: number) => {
      try {
          const itemToDelete = wardrobe.find(item => item.dbId === itemId);
          if (itemToDelete?.isCustom) {
              URL.revokeObjectURL(itemToDelete.url);
          }
          await deleteWardrobeItemFromDb(itemId);
          setWardrobe(prev => prev.filter(item => item.dbId !== itemId));
      } catch(e) {
          console.error("Failed to delete from wardrobe in IndexedDB", e);
          setError(getFriendlyErrorMessage(e, t));
      }
  }, [wardrobe, t]);
  
  const lookbookUrls = useMemo(() => new Set(lookbookItems.map(item => item.dataUrl)), [lookbookItems]);

  const TABS: { id: Tab, label: TranslationKey }[] = [
      { id: 'stylist', label: 'aiStylist' },
      { id: 'outfit', label: 'myOutfit' },
      { id: 'wardrobe', label: 'wardrobe' },
      { id: 'lookbook', label: 'lookbook' },
  ];
  
  const currentLayer = outfitHistory[currentOutfitIndex];
  const canAddToDressing = currentLayer && currentLayer.garment && (currentLayer.garment.id.startsWith('generated-') || currentLayer.garment.id.startsWith('modified-'));

  return (
    <div className="font-sans">
      <AnimatePresence mode="wait">
        {!hasModel ? (
          <motion.div
            key="start-screen"
            className="w-screen min-h-screen flex flex-col justify-start sm:justify-center bg-gray-50 p-4 pb-20"
            {...viewAnimation}
          >
            <div className="w-full">
               <Header isMockMode={USE_MOCK_API} />
            </div>
            <div className="flex-grow flex items-center justify-center">
              <StartScreen onModelFinalized={handleModelFinalized} apiService={apiService} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="main-app"
            className="relative flex flex-col h-screen bg-gray-50"
            {...viewAnimation}
          >
            <Header isMockMode={USE_MOCK_API} />
            <main className="flex-grow flex flex-col lg:flex-row gap-4 p-4 overflow-y-auto lg:overflow-hidden">
              {/* Canvas Side */}
              <div className="flex lg:flex-1 flex-col items-center justify-start gap-4">
                 <Toolbar
                    onStartOver={handleStartOver}
                    onOpenShareModal={handleOpenShareModal}
                    onSave={() => displayImageUrl && handleSavePoseToLookbook(displayImageUrl)}
                    isActionDisabled={!displayImageUrl}
                    isSaveDisabled={isLoading || !displayImageUrl || lookbookUrls.has(displayImageUrl ?? '')}
                 />
                <Canvas 
                  displayImageUrl={displayImageUrl}
                  poseImages={currentPoseImages}
                  currentPoseKey={currentPoseKey}
                  onSelectPose={handlePoseSelect}
                  isLoading={isLoading}
                  loadingMessage={loadingMessage}
                  onSavePoseToLookbook={handleSavePoseToLookbook}
                  lookbookItems={lookbookItems}
                />
                {canAddToDressing && !isLoading && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-shrink-0"
                  >
                    <button
                      onClick={handleOpenAddToDressingModal}
                      className="w-full flex items-center justify-center text-center bg-gray-900 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors duration-200 ease-in-out hover:bg-gray-700 active:scale-95 text-sm"
                    >
                      {t('addToDressing')}
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Control Panel Side */}
              <aside className="w-full lg:w-[400px] lg:flex-shrink-0 bg-white border border-gray-200/80 rounded-xl flex flex-col overflow-hidden shadow-sm lg:h-full">
                  <div className='flex items-center border-b border-gray-300/60 overflow-x-auto'>
                    {TABS.map(tab => (
                      <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`relative px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? 'text-gray-900 font-semibold' : 'text-gray-500 hover:text-gray-800'}`}>
                          <span>{t(tab.label)}</span>
                          {activeTab === tab.id && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" layoutId="tab-underline" />}
                      </button>
                    ))}
                  </div>
                  <div className="p-6 overflow-y-auto flex-grow">
                    {error && (
                      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md" role="alert">
                        <p className="font-bold">{t('error')}</p>
                        <p>{error}</p>
                      </div>
                    )}
                     <AnimatePresence mode="wait">
                        <motion.div
                          key={activeTab}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          {activeTab === 'stylist' && <OccasionStylingPanel onGenerateOutfit={handleGenerateOutfitForOccasion} isLoading={isLoading && activeGenerator === 'occasion'} numImagesToGenerate={numImagesToGenerate} onNumImagesChange={setNumImagesToGenerate} />}
                          {activeTab === 'outfit' && (
                            <>
                              <OutfitStack outfitHistory={activeOutfitLayers} onRemoveLastGarment={handleRemoveLastGarment} />
                              {outfitHistory.length > 0 && (
                                <>
                                  <ImageModificationPanel
                                    onApplyModification={handleImageModification}
                                    isLoading={isLoading && activeGenerator === 'modification'}
                                    numImagesToGenerate={numImagesToGenerate}
                                    onNumImagesChange={setNumImagesToGenerate}
                                  />
                                  <HairstylePanel
                                    onApplyHairstyle={handleApplyHairstyle}
                                    isLoading={isLoading && activeGenerator === 'hairstyle'}
                                  />
                                </>
                              )}
                            </>
                          )}
                          {activeTab === 'wardrobe' && <WardrobePanel onGarmentSelect={handleGarmentSelect} onOpenAddModal={handleOpenAddModalFromWardrobe} onDeleteItem={handleDeleteWardrobeItem} activeGarmentIds={activeGarmentIds} isLoading={isLoading} wardrobe={wardrobe} />}
                          {activeTab === 'lookbook' && <LookbookPanel items={lookbookItems} onDeleteItem={handleDeleteFromLookbook} />}
                        </motion.div>
                     </AnimatePresence>
                  </div>
              </aside>
            </main>
            <ShareModal
                isOpen={isShareModalOpen}
                onClose={handleCloseShareModal}
                imageUrl={displayImageUrl}
            />
            <AddWardrobeItemModal
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              onSave={(details) => {
                if (itemFileForModal) {
                  handleAddNewItemToWardrobe(details, itemFileForModal.file);
                }
              }}
              imagePreviewUrl={itemFileForModal?.previewUrl || null}
              existingCategories={existingCategories}
              initialDetails={initialModalDetails || {}}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <Footer isOnDressingScreen={hasModel} />
    </div>
  );
};

export default App;
