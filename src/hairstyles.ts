export interface Hairstyle {
  key: string;
  label: string;
  description: string;
}

export const hairstyleOptions: Hairstyle[] = [
  // Classiques
  {
    key: 'hairstyle_bob_cut',
    label: 'Bob cut',
    description: 'Carré droit au niveau du menton, simple et chic.'
  },
  {
    key: 'hairstyle_pixie_cut',
    label: 'Pixie cut',
    description: 'Très court, nuque dégagée, effilé, look audacieux.'
  },
  {
    key: 'hairstyle_lob',
    label: 'Lob',
    description: 'Long bob, carré mi-long qui tombe sur les épaules.'
  },
  {
    key: 'hairstyle_layered',
    label: 'Layered',
    description: 'Coupe dégradée, apporte volume et mouvement.'
  },
  {
    key: 'hairstyle_shag',
    label: 'Shag',
    description: 'Coupe effilée avec beaucoup de dégradés, look rock.'
  },
  {
    key: 'hairstyle_rachel',
    label: 'Rachel',
    description: 'Coupe volumineuse et dégradée, popularisée par Friends.'
  },
  {
    key: 'hairstyle_french_bob',
    label: 'French bob',
    description: 'Carré court à la française, chic et intemporel.'
  },
  {
    key: 'hairstyle_pageboy',
    label: 'Pageboy',
    description: 'Coupe droite avec frange arrondie, look rétro.'
  },
  {
    key: 'hairstyle_pompadour',
    label: 'Pompadour',
    description: 'Volume important sur le dessus, cheveux tirés en arrière.'
  },
  {
    key: 'hairstyle_bangs',
    label: 'Bangs',
    description: 'Frange droite classique, au-dessus des sourcils.'
  },
  {
    key: 'hairstyle_textured_short',
    label: 'Textured short',
    description: 'Coupe courte avec mèches texturées pour plus de mouvement.'
  },
  {
    key: 'hairstyle_undone_waves',
    label: 'Undone waves',
    description: 'Ondulations naturelles, effet coiffé-décoiffé.'
  },
  {
    key: 'hairstyle_natural_afro',
    label: 'Natural afro',
    description: 'Cheveux crépus portés au naturel avec volume.'
  },
  {
    key: 'hairstyle_braids',
    label: 'Braids',
    description: 'Nattes classiques, tressage simple ou multiple.'
  },
  {
    key: 'hairstyle_low_bun',
    label: 'Low bun',
    description: 'Chignon bas, élégant et discret.'
  },
  {
    key: 'hairstyle_ponytail',
    label: 'Ponytail',
    description: 'Queue de cheval simple et pratique.'
  },
  {
    key: 'hairstyle_modern_mullet',
    label: 'Modern mullet',
    description: 'Version actuelle du mulet : court devant, long derrière.'
  },
  {
    key: 'hairstyle_buzz_cut',
    label: 'Buzz cut',
    description: 'Très court, tondeuse, look minimaliste.'
  },
  {
    key: 'hairstyle_coloration',
    label: 'Coloration',
    description: 'Effet coloré général, sans coupe particulière.'
  },
  {
    key: 'hairstyle_long_natural',
    label: 'Long natural',
    description: 'Cheveux longs, laissés au naturel.'
  },

  // Nouvelles tendances 2023–2025
  {
    key: 'hairstyle_clavicut',
    label: 'Clavicut',
    description: 'Carré mi-long qui s’arrête aux clavicules.'
  },
  {
    key: 'hairstyle_curtain_bangs',
    label: 'Curtain bangs',
    description: 'Frange rideau ouverte au milieu, encadre le visage.'
  },
  {
    key: 'hairstyle_bottleneck_bangs',
    label: 'Bottleneck bangs',
    description: 'Frange effilée fine, version moderne de la rideau.'
  },
  {
    key: 'hairstyle_wolf_cut',
    label: 'Wolf cut',
    description: 'Hybride shag + mullet, volume et dégradé sauvage.'
  },
  {
    key: 'hairstyle_octopus_cut',
    label: 'Octopus cut',
    description: 'Coupe dégradée inspirée de la wolf cut, plus longue.'
  },
  {
    key: 'hairstyle_italian_bob',
    label: 'Italian bob',
    description: 'Carré épais et dense, chic à l’italienne.'
  },
  {
    key: 'hairstyle_long_glossy',
    label: 'Long glossy',
    description: 'Cheveux longs ultra-lisses avec brillance miroir.'
  },
  {
    key: 'hairstyle_wet_look',
    label: 'Wet look',
    description: 'Effet mouillé brillant, vu sur les podiums.'
  },
  {
    key: 'hairstyle_micro_bob',
    label: 'Micro bob',
    description: 'Carré très court, coupe au niveau de la mâchoire.'
  },
  {
    key: 'hairstyle_box_braids',
    label: 'Box braids',
    description: 'Nattes épaisses régulières, très tendance.'
  },
  {
    key: 'hairstyle_cornrows',
    label: 'Cornrows',
    description: 'Tresses plaquées près du cuir chevelu.'
  },
  {
    key: 'hairstyle_half_up_claw_clip',
    label: 'Half-up claw clip',
    description: 'Attache mi-hauteur avec pince crab, viral sur TikTok.'
  },
  {
    key: 'hairstyle_high_ponytail_sleek',
    label: 'High ponytail sleek',
    description: 'Queue de cheval haute, ultra-lissée (style Ariana Grande).'
  },
  {
    key: 'hairstyle_long_beach_waves',
    label: 'Long beach waves',
    description: 'Ondulations de plage souples et naturelles.'
  },
  {
    key: 'hairstyle_soft_layers',
    label: 'Soft layers',
    description: 'Dégradé doux, subtile modernisation des longueurs.'
  },
  {
    key: 'hairstyle_glam_curls',
    label: 'Glam curls',
    description: 'Boucles larges et brillantes, effet glamour.'
  },
  {
    key: 'hairstyle_glass_bob',
    label: 'Glass bob',
    description: 'Carré lisse avec brillance “effet verre”.'
  },
  {
    key: 'hairstyle_high_bun_messy',
    label: 'Messy high bun',
    description: 'Chignon haut, coiffé-décoiffé, casual chic.'
  },
  {
    key: 'hairstyle_french_twist',
    label: 'French twist',
    description: 'Torsade élégante, revisitée pour 2025.'
  },
  {
    key: 'hairstyle_balayage_blonde',
    label: 'Balayage blonde',
    description: 'Coloration blond dégradé naturel.'
  },
  {
    key: 'hairstyle_peach_tint',
    label: 'Peach tint',
    description: 'Teinte pastel pêche, coloration tendance 2025.'
  },
  {
    key: 'hairstyle_cherry_cola',
    label: 'Cherry cola',
    description: 'Marron-rouge profond, couleur virale TikTok 2024.'
  },
  {
    key: 'hairstyle_platinum_blonde',
    label: 'Platinum blonde',
    description: 'Blond glacé platine, look sophistiqué.'
  },
  {
    key: 'hairstyle_money_piece',
    label: 'Money piece',
    description: 'Mèches claires encadrant le visage.'
  },
  {
    key: 'hairstyle_skunk_stripe',
    label: 'Skunk stripe',
    description: 'Contraste noir/blanc ou foncé/clair marqué.'
  },
  {
    key: 'hairstyle_v_cut_layers',
    label: 'V-cut layers',
    description: 'Longueurs coupées en forme de V.'
  },
  {
    key: 'hairstyle_u_cut_layers',
    label: 'U-cut layers',
    description: 'Longueurs coupées en forme de U.'
  },
  {
    key: 'hairstyle_straight_midpart',
    label: 'Straight midpart',
    description: 'Cheveux raie au milieu, ultra droits.'
  },
  {
    key: 'hairstyle_casual_updo',
    label: 'Casual updo',
    description: 'Chignon décontracté moderne.'
  }
];

export type HairstyleKey = typeof hairstyleOptions[number]['key'];
