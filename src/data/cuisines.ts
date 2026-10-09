export interface CuisineItem {
  id: string;
  name: string;
  region: 'Asia' | 'Europe' | 'Americas' | 'Middle East & Africa' | 'Global & Fusion';
  flag: string;
  flavorNotes: string;
  popular?: boolean;
}

export const WORLD_CUISINES: CuisineItem[] = [
  // Popular / Global Staples
  { id: 'indian', name: 'Indian', region: 'Asia', flag: '🇮🇳', flavorNotes: 'Aromatic spices, cumin, garam masala, turmeric, ginger', popular: true },
  { id: 'italian', name: 'Italian', region: 'Europe', flag: '🇮🇹', flavorNotes: 'Olive oil, garlic, basil, oregano, tomatoes, parmesan', popular: true },
  { id: 'mexican', name: 'Mexican', region: 'Americas', flag: '🇲🇽', flavorNotes: 'Chiles, cilantro, lime, cumin, oregano, corn', popular: true },
  { id: 'asian-stirfry', name: 'Asian Stir-fry', region: 'Asia', flag: '🥢', flavorNotes: 'Soy sauce, sesame oil, ginger, scallions, garlic', popular: true },
  { id: 'mediterranean', name: 'Mediterranean', region: 'Europe', flag: '🫒', flavorNotes: 'Lemon, olive oil, fresh herbs, garlic, sea salt', popular: true },

  // East & Southeast Asia
  { id: 'japanese', name: 'Japanese', region: 'Asia', flag: '🇯🇵', flavorNotes: 'Dashi, mirin, soy, miso, nori, wasabi', popular: true },
  { id: 'chinese-szechuan', name: 'Chinese (Szechuan)', region: 'Asia', flag: '🇨🇳', flavorNotes: 'Sichuan peppercorn, chili oil, garlic, black vinegar', popular: true },
  { id: 'chinese-cantonese', name: 'Chinese (Cantonese)', region: 'Asia', flag: '🥟', flavorNotes: 'Light soy, oyster sauce, ginger, white pepper, subtle umami' },
  { id: 'korean', name: 'Korean', region: 'Asia', flag: '🇰🇷', flavorNotes: 'Gochujang, toasted sesame, garlic, kimchi, gochugaru', popular: true },
  { id: 'thai', name: 'Thai', region: 'Asia', flag: '🇹🇭', flavorNotes: 'Lemongrass, lime leaves, galangal, chili, fish sauce/tamari, coconut', popular: true },
  { id: 'vietnamese', name: 'Vietnamese', region: 'Asia', flag: '🇻🇳', flavorNotes: 'Mint, cilantro, star anise, lime, crispy shallots, nuoc cham', popular: true },
  { id: 'indonesian', name: 'Indonesian', region: 'Asia', flag: '🇮🇩', flavorNotes: 'Kecap manis, sambal, shallots, lemongrass, turmeric' },
  { id: 'malaysian', name: 'Malaysian', region: 'Asia', flag: '🇲🇾', flavorNotes: 'Rendang spices, coconut milk, belacan/chili, tamarind' },
  { id: 'filipino', name: 'Filipino', region: 'Asia', flag: '🇵🇭', flavorNotes: 'Cane vinegar, garlic, black peppercorn, bay leaf, calamansi' },
  { id: 'taiwanese', name: 'Taiwanese', region: 'Asia', flag: '🇹🇼', flavorNotes: 'Five-spice, basil, rice wine, shallot crisp, sweet soy' },

  // South Asia
  { id: 'south-indian', name: 'South Indian', region: 'Asia', flag: '🥥', flavorNotes: 'Mustard seeds, curry leaves, tamarind, coconut, black pepper' },
  { id: 'pakistani', name: 'Pakistani', region: 'Asia', flag: '🇵🇰', flavorNotes: 'Coriander seeds, cloves, cardamom, ginger, roasted cumin' },
  { id: 'sri-lankan', name: 'Sri Lankan', region: 'Asia', flag: '🇱🇰', flavorNotes: 'Roasted curry powder, coconut milk, pandan, fiery chilies' },
  { id: 'nepalese', name: 'Nepalese', region: 'Asia', flag: '🇳🇵', flavorNotes: 'Jimbu, timur pepper, mustard oil, fenugreek, coriander' },

  // Middle East & North Africa
  { id: 'lebanese', name: 'Lebanese', region: 'Middle East & Africa', flag: '🇱🇧', flavorNotes: 'Za\'atar, sumac, tahini, lemon juice, mint, garlic', popular: true },
  { id: 'turkish', name: 'Turkish', region: 'Middle East & Africa', flag: '🇹🇷', flavorNotes: 'Aleppo pepper, cumin, mint, pomegranate molasses, yogurt', popular: true },
  { id: 'moroccan', name: 'Moroccan', region: 'Middle East & Africa', flag: '🇲🇦', flavorNotes: 'Ras el hanout, cinnamon, preserved lemon, saffron, cumin', popular: true },
  { id: 'persian', name: 'Persian (Iranian)', region: 'Middle East & Africa', flag: '🇮🇷', flavorNotes: 'Saffron, barberries, dried lime, turmeric, rose water' },
  { id: 'egyptian', name: 'Egyptian', region: 'Middle East & Africa', flag: '🇪🇬', flavorNotes: 'Dukkah, cumin, coriander, fried onions, lentils, garlic' },

  // Sub-Saharan Africa
  { id: 'ethiopian', name: 'Ethiopian & Eritrean', region: 'Middle East & Africa', flag: '🇪🇹', flavorNotes: 'Berbere spice blend, niter kibbeh, cardamom, korarima', popular: true },
  { id: 'nigerian', name: 'Nigerian (West African)', region: 'Middle East & Africa', flag: '🇳🇬', flavorNotes: 'Scotch bonnet, locust beans (iru), smoked paprika, thyme' },
  { id: 'ghanaian', name: 'Ghanaian', region: 'Middle East & Africa', flag: '🇬🇭', flavorNotes: 'Shito pepper, ginger, garlic, tomatoes, peanut groundnut stew' },
  { id: 'kenyan', name: 'Kenyan (East African)', region: 'Middle East & Africa', flag: '🇰🇪', flavorNotes: 'Sukuma wiki spices, coriander, tomatoes, cumin, coconut' },
  { id: 'south-african', name: 'South African', region: 'Middle East & Africa', flag: '🇿🇦', flavorNotes: 'Chutney, curry leaf, peri-peri, bay leaf, coriander' },

  // Southern Europe
  { id: 'spanish', name: 'Spanish', region: 'Europe', flag: '🇪🇸', flavorNotes: 'Smoked paprika (pimentón), saffron, olive oil, garlic, parsley', popular: true },
  { id: 'greek', name: 'Greek', region: 'Europe', flag: '🇬🇷', flavorNotes: 'Oregano, lemon, extra virgin olive oil, feta, dill, garlic', popular: true },
  { id: 'portuguese', name: 'Portuguese', region: 'Europe', flag: '🇵🇹', flavorNotes: 'Piri-piri, bay leaves, garlic, white wine, sweet paprika' },

  // Western & Central Europe
  { id: 'french', name: 'French', region: 'Europe', flag: '🇫🇷', flavorNotes: 'Butter, shallots, thyme, tarragon, white wine, dijon', popular: true },
  { id: 'german', name: 'German', region: 'Europe', flag: '🇩🇪', flavorNotes: 'Caraway, mustard, dill, vinegar, bay leaves, nutmeg' },
  { id: 'swiss-austrian', name: 'Swiss & Austrian', region: 'Europe', flag: '🇨🇭', flavorNotes: 'Gruyere, nutmeg, chives, white pepper, mountain herbs' },
  { id: 'british-irish', name: 'British & Irish', region: 'Europe', flag: '🇬🇧', flavorNotes: 'Malt vinegar, mustard, thyme, rosemary, parsley, black pepper' },

  // Eastern & Northern Europe
  { id: 'georgian', name: 'Georgian (Caucasus)', region: 'Europe', flag: '🇬🇪', flavorNotes: 'Blue fenugreek, crushed walnuts, coriander, marigold, garlic', popular: true },
  { id: 'polish', name: 'Polish & Eastern European', region: 'Europe', flag: '🇵🇱', flavorNotes: 'Dill, marjoram, allspice, sour cream, sauerkraut, caraway' },
  { id: 'nordic', name: 'Nordic / Scandinavian', region: 'Europe', flag: '🇸🇪', flavorNotes: 'Dill, lingonberry, juniper, sea salt, pickled mustard seeds' },

  // North America
  { id: 'cajun-creole', name: 'Cajun & Creole', region: 'Americas', flag: '🦞', flavorNotes: 'Holy trinity (bell pepper, celery, onion), cayenne, thyme, paprika', popular: true },
  { id: 'american-bbq', name: 'American BBQ & Soul Food', region: 'Americas', flag: '🇺🇸', flavorNotes: 'Brown sugar rub, smoked paprika, black pepper, apple cider vinegar', popular: true },
  { id: 'tex-mex', name: 'Tex-Mex', region: 'Americas', flag: '🤠', flavorNotes: 'Cumin, chili powder, cheddar, jalapeño, cilantro' },

  // Latin America & Caribbean
  { id: 'brazilian', name: 'Brazilian', region: 'Americas', flag: '🇧🇷', flavorNotes: 'Dendê oil, lime, garlic, coriander, malagueta peppers', popular: true },
  { id: 'peruvian', name: 'Peruvian', region: 'Americas', flag: '🇵🇪', flavorNotes: 'Ají amarillo, lime juice, red onion, choclo, cilantro', popular: true },
  { id: 'caribbean-jamaican', name: 'Jamaican & Caribbean', region: 'Americas', flag: '🇯🇲', flavorNotes: 'Allspice (pimento), scotch bonnet, thyme, scallions, ginger', popular: true },
  { id: 'cuban', name: 'Cuban', region: 'Americas', flag: '🇨🇺', flavorNotes: 'Mojo marinade, bitter orange, oregano, cumin, garlic' },
  { id: 'argentine', name: 'Argentine & Chimichurri', region: 'Americas', flag: '🇦🇷', flavorNotes: 'Parsley, oregano, garlic, red wine vinegar, olive oil, red pepper flakes' },

  // Fusion & Modern
  { id: 'california-fresh', name: 'California Fresh', region: 'Global & Fusion', flag: '🥗', flavorNotes: 'Avocado, citrus zest, microgreens, cold-pressed oils, grains' },
  { id: 'hawaiian', name: 'Hawaiian & Polynesian', region: 'Global & Fusion', flag: '🌺', flavorNotes: 'Soy ginger glaze, pineapple, scallion, macadamia, sesame' },
];

export const CUISINE_REGIONS = [
  'All',
  'Popular',
  'Asia',
  'Europe',
  'Americas',
  'Middle East & Africa',
  'Global & Fusion',
] as const;
