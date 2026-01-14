import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { QueryProvider } from "@/components/providers/query-provider"
import { Toaster } from "@/components/ui/toaster"
import { NextIntlClientProvider } from 'next-intl'
import { getLocale } from '@/lib/locale'
import { getMessages } from 'next-intl/server'
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const messages = await getMessages({ locale }) as any
  
  return {
    title: messages.metadata?.title || "Blackbox - Plateforme de signalement AIGE",
    description: messages.metadata?.description || "Signalez un incident en toute confidentialité. Votre identité n'est jamais enregistrée.",
    generator: "v0.app",
  }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#4C83E7",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const messages = await getMessages({ locale })

  return (
    <html lang={locale}>
      <body className={`font-sans antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <QueryProvider>
            {children}
            <Analytics />
            <Toaster />
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
