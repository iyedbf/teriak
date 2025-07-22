// src/utils/flagUtils.js
export const getCountryCode = (countryName) => {
  const countryCodes = {
    "France": "fr",
    "Tunisie": "tn",
    "tunisian": "tn",
    "Afrique du Sud": "za",
    "Albanie": "al",
    "Allemagne": "de",
    "États-Unis": "us",
    "Italie": "it",
    "Espagne": "es",
    "Canada": "ca",
    "Maroc": "ma",
    "Turquie": "tr",
  };

  return countryCodes[countryName.trim()] || null;
};
