/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { WardrobeItem } from './types';

// Default wardrobe items hosted for easy access
export const defaultWardrobe: WardrobeItem[] = [
  // Tops
  {
    id: 'gemini-tee',
    name: 'wardrobe_gemini_tee',
    url: 'https://raw.githubusercontent.com/ammaarreshi/app-images/refs/heads/main/Gemini-tee.png',
    category: 'Tops',
  },
  {
    id: 'white-blouse',
    name: 'wardrobe_white_blouse',
    url: 'https://storage.googleapis.com/gemini-95-icons/vto-app/white-blouse.png',
    category: 'Tops',
  },
  {
    id: 'polo-shirt',
    name: 'wardrobe_polo_shirt',
    url: 'https://storage.googleapis.com/gemini-95-icons/vto-app/polo-shirt.png',
    category: 'Tops',
  },
  {
    id: 'black-tank-top',
    name: 'wardrobe_black_tank',
    url: 'https://storage.googleapis.com/gemini-95-icons/vto-app/black-tank-top.png',
    category: 'Tops',
  },
  {
    id: 'striped-long-sleeve',
    name: 'wardrobe_striped_long_sleeve',
    url: 'https://storage.googleapis.com/gemini-95-icons/vto-app/striped-long-sleeve.png',
    category: 'Tops',
  },
  // Bottoms
  {
    id: 'blue-jeans',
    name: 'wardrobe_blue_jeans',
    url: 'https://storage.googleapis.com/gemini-95-icons/vto-app/blue-jeans.png',
    category: 'Bottoms',
  },
  {
    id: 'dress-pants',
    name: 'wardrobe_dress_pants',
    url: 'https://storage.googleapis.com/gemini-95-icons/vto-app/dress-pants.png',
    category: 'Bottoms',
  },
  {
    id: 'khaki-shorts',
    name: 'wardrobe_khaki_shorts',
    url: 'https://storage.googleapis.com/gemini-95-icons/vto-app/khaki-shorts.png',
    category: 'Bottoms',
  },
  {
    id: 'pleated-skirt',
    name: 'wardrobe_pleated_skirt',
    url: 'https://storage.googleapis.com/gemini-95-icons/vto-app/pleated-skirt.png',
    category: 'Bottoms',
  },
   {
    id: 'ankle-boots',
    name: 'wardrobe_ankle_boots',
    url: 'https://storage.googleapis.com/gemini-95-icons/vto-app/ankle-boots.png',
    category: 'Bottoms', // Categorized as 'Bottoms' to represent footwear
  },
  // Outerwear
  {
    id: 'gemini-sweat',
    name: 'wardrobe_gemini_sweat',
    url: 'https://raw.githubusercontent.com/ammaarreshi/app-images/refs/heads/main/gemini-sweat-2.png',
    category: 'Outerwear',
  },
  {
    id: 'leather-jacket',
    name: 'wardrobe_leather_jacket',
    url: 'https://storage.googleapis.com/gemini-95-icons/vto-app/leather-jacket.png',
    category: 'Outerwear',
  },
  {
    id: 'denim-jacket',
    name: 'wardrobe_denim_jacket',
    url: 'https://storage.googleapis.com/gemini-95-icons/vto-app/denim-jacket.png',
    category: 'Outerwear',
  },
  {
    id: 'trench-coat',
    name: 'wardrobe_trench_coat',
    url: 'https://storage.googleapis.com/gemini-95-icons/vto-app/trench-coat.png',
    category: 'Outerwear',
  },
  {
    id: 'gray-hoodie',
    name: 'wardrobe_gray_hoodie',
    url: 'https://storage.googleapis.com/gemini-95-icons/vto-app/gray-hoodie.png',
    category: 'Outerwear',
  },
  {
    id: 'blazer-jacket',
    name: 'wardrobe_blazer_jacket',
    url: 'https://storage.googleapis.com/gemini-95-icons/vto-app/blazer.png',
    category: 'Outerwear',
  },
  // Dresses
  {
    id: 'evening-dress',
    name: 'wardrobe_evening_dress',
    url: 'https://storage.googleapis.com/prompt-gallery/vto-app/blonde-woman-black-dress.jpg',
    category: 'Dresses',
  },
  // Accessories - Hats
  {
    id: 'beanie-hat',
    name: 'wardrobe_beanie',
    url: 'https://storage.googleapis.com/gemini-95-icons/vto-app/beanie.png',
    category: 'Accessories',
    subcategory: 'Hats',
  },
  {
    id: 'baseball-cap',
    name: 'wardrobe_baseball_cap',
    url: 'https://storage.googleapis.com/gemini-95-icons/vto-app/baseball-cap.png',
    category: 'Accessories',
    subcategory: 'Hats',
  },
  {
    id: 'fedora-hat',
    name: 'wardrobe_fedora_hat',
    url: 'https://storage.googleapis.com/gemini-95-icons/vto-app/fedora-hat.png',
    category: 'Accessories',
    subcategory: 'Hats',
  },
  // Accessories - Glasses
  {
    id: 'sunglasses',
    name: 'wardrobe_sunglasses',
    url: 'https://storage.googleapis.com/gemini-95-icons/vto-app/sunglasses.png',
    category: 'Accessories',
    subcategory: 'Glasses',
  },
  {
    id: 'aviator-sunglasses',
    name: 'wardrobe_aviators',
    url: 'https://storage.googleapis.com/gemini-95-icons/vto-app/aviators.png',
    category: 'Accessories',
    subcategory: 'Glasses',
  },
  // Accessories - Bags
  {
    id: 'leather-tote',
    name: 'wardrobe_leather_tote',
    url: 'https://storage.googleapis.com/gemini-95-icons/vto-app/leather-tote.png',
    category: 'Accessories',
    subcategory: 'Bags',
  },
  {
    id: 'crossbody-bag',
    name: 'wardrobe_crossbody_bag',
    url: 'https://storage.googleapis.com/gemini-95-icons/vto-app/crossbody-bag.png',
    category: 'Accessories',
    subcategory: 'Bags',
  },
  {
    id: 'backpack',
    name: 'wardrobe_backpack',
    url: 'https://storage.googleapis.com/gemini-95-icons/vto-app/backpack.png',
    category: 'Accessories',
    subcategory: 'Bags',
  },
   // Accessories - Jewelry
  {
    id: 'gold-necklace',
    name: 'wardrobe_gold_necklace',
    url: 'https://storage.googleapis.com/gemini-95-icons/vto-app/gold-necklace.png',
    category: 'Accessories',
    subcategory: 'Jewelry',
  },
  {
    id: 'silver-hoops',
    name: 'wardrobe_silver_hoops',
    url: 'https://storage.googleapis.com/gemini-95-icons/vto-app/silver-hoops.png',
    category: 'Accessories',
    subcategory: 'Jewelry',
  },
   // Accessories - Belts
  {
    id: 'brown-leather-belt',
    name: 'wardrobe_leather_belt',
    url: 'https://storage.googleapis.com/gemini-95-icons/vto-app/leather-belt.png',
    category: 'Accessories',
    subcategory: 'Belts',
  },
  // Accessories - Watches
  {
    id: 'classic-watch',
    name: 'wardrobe_classic_watch',
    url: 'https://storage.googleapis.com/gemini-95-icons/vto-app/classic-watch.png',
    category: 'Accessories',
    subcategory: 'Watches',
  },
  // Accessories - Scarves
  {
    id: 'silk-scarf',
    name: 'wardrobe_silk_scarf',
    url: 'https://storage.googleapis.com/gemini-95-icons/vto-app/silk-scarf.png',
    category: 'Accessories',
    subcategory: 'Scarves',
  }
];