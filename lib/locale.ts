"use server"

import { cookies } from 'next/headers'
import { defaultLocale, type Locale, locales } from '@/i18n'

export async function setLocale(locale: Locale) {
  const cookieStore = await cookies()
  
  if (!locales.includes(locale)) {
    return { success: false, error: 'Invalid locale' }
  }

  cookieStore.set('NEXT_LOCALE', locale, {
    expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    sameSite: 'lax',
    path: '/'
  })

  return { success: true }
}

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const locale = cookieStore.get('NEXT_LOCALE')?.value as Locale
  
  return locales.includes(locale) ? locale : defaultLocale
}
