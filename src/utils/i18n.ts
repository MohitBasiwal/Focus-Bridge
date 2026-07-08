/**
 * i18n preparation file. 
 * Externalize strings here for future multi-language support.
 */

export const translations = {
  en: {
    app_name: "Focus Bridge",
    welcome: "Welcome to Focus Bridge",
    onboarding_desc: "The intelligent study companion that automatically blocks distractions and builds your discipline through smart timetables.",
    get_started: "Get Started",
    // Add more strings here
  },
  es: {
    app_name: "Focus Bridge",
    welcome: "Bienvenido a Focus Bridge",
    onboarding_desc: "El compañero de estudio inteligente que bloquea distracciones y construye tu disciplina.",
    get_started: "Empezar",
  }
};

export function t(key: keyof typeof translations.en, lang: 'en' | 'es' = 'en') {
  return translations[lang][key] || translations['en'][key] || key;
}
