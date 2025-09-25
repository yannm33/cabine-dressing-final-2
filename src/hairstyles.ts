/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export const hairstyleOptions = [
  'hairstyle_bob_cut',
  'hairstyle_pixie_cut',
  'hairstyle_lob',
  'hairstyle_layered',
  'hairstyle_shag',
  'hairstyle_rachel',
  'hairstyle_french_bob',
  'hairstyle_pageboy',
  'hairstyle_pompadour',
  'hairstyle_bangs',
  'hairstyle_textured_short',
  'hairstyle_undone_waves',
  'hairstyle_natural_afro',
  'hairstyle_braids',
  'hairstyle_low_bun',
  'hairstyle_ponytail',
  'hairstyle_modern_mullet',
  'hairstyle_buzz_cut',
  'hairstyle_coloration',
  'hairstyle_long_natural',
] as const;

export type HairstyleKey = typeof hairstyleOptions[number];