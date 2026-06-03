export const CURRENCY_RATES = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  SOS: 570.00,
  AED: 3.67,
};

export const CURRENCY_SYMBOLS = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  SOS: "Sh.So.",
  AED: "د.إ",
};

export const CURRENCY_FLAGS = {
  USD: "🇺🇸",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
  SOS: "🇸🇴",
  AED: "🇦🇪",
};

export const LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "so", name: "Soomaali", flag: "🇸🇴" },
  { code: "ar", name: "العربية", flag: "🇦🇪" },
  { code: "fr", name: "Français", flag: "🇪🇺" },
];

export const convertPrice = (usdAmount, targetCurrency = "USD") => {
  const rate = CURRENCY_RATES[targetCurrency] || 1.0;
  return usdAmount * rate;
};

export const formatPrice = (usdAmount, currency = "USD") => {
  const converted = convertPrice(usdAmount, currency);
  const symbol = CURRENCY_SYMBOLS[currency] || "$";
  
  if (currency === "SOS") {
    return `${symbol} ${Math.round(converted).toLocaleString()}`;
  }
  if (currency === "AED") {
    return `${symbol} ${converted.toFixed(2)}`;
  }
  return `${symbol}${converted.toFixed(2)}`;
};
