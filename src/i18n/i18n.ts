export const SUPPORTED_LOCALES = ['en-US', 'th-TH'];

export const localeDisplayMap: Record<string, string> = {
  'en-US': 'EN',
  'th-TH': 'TH'
};

export const DEFAULT_LOCALE = 'en-US';

export async function fetchTranslations(requestedLocale: string, supportedLocales: string[]) {
  let locale = requestedLocale;
  if (!supportedLocales.includes(locale)) {
    locale = DEFAULT_LOCALE;
    localStorage.setItem('lang', DEFAULT_LOCALE);
  }

  try {
    const response = await fetch(`/locales/${locale}/translation.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch translations for ${locale}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Translation fetch error:', error);
    // Fallback to default locale if requested fails
    if (locale !== DEFAULT_LOCALE) {
      return fetchTranslations(DEFAULT_LOCALE, supportedLocales);
    }
    return {};
  }
}
