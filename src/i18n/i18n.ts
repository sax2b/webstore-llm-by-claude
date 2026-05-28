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
    localStorage.lang = DEFAULT_LOCALE;
  }

  try {
    const response = await fetch(`/locales/${locale}/translation.json`);
    if (!response.ok) throw new Error('Failed to fetch translations');
    return await response.json();
  } catch (error) {
    console.error('Error fetching translations:', error);
    // Fallback to English if fetch fails
    const fallbackResponse = await fetch(`/locales/${DEFAULT_LOCALE}/translation.json`);
    return await fallbackResponse.json();
  }
}
