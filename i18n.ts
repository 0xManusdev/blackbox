import { getRequestConfig } from 'next-intl/server';

export const locales = ['fr', 'en'] as const;
export type Locale = typeof locales[number];

export const localeNames: Record<Locale, string> = {
  fr: 'Français',
  en: 'English'
};

export const defaultLocale: Locale = 'fr';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
