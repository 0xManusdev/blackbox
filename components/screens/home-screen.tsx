"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, ShieldCheck } from "lucide-react"
import Image from "next/image"
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from '@/components/language-switcher'
import type { Locale } from '@/i18n'

interface HomeScreenProps {
	onStartReport: () => void
	currentLocale: Locale
}

export function HomeScreen({ onStartReport, currentLocale }: HomeScreenProps) {
	const t = useTranslations('home')

	return (
		<div className="h-full px-4">
			<div className="flex flex-col items-center justify-center min-h-screen bg-white bg-cover bg-center h-screen gap-6">
				<div className="flex items-center justify-center pt-12 ">
					<div className="flex items-center gap-2">
						<div className="w-10 h-10 flex items-center justify-center">
							<Image
								src="/box.png"
								alt="Logo"
								width={50}
								height={50}
							/>
						</div>
						<span className="font-semibold text-xl  text-foreground">{t('logo')}</span>
					</div>
					<div className="ml-4">
						<LanguageSwitcher currentLocale={currentLocale} />
					</div>
				</div>
				<div className="flex flex-col items-center gap-4 justify-center">
					<div className="flex items-center justify-center">
						<ShieldCheck className="w-24 h-24 text-[#005AFF] bg-accent p-4 rounded-full"/>
					</div>

					<div className="w-full flex flex-col items-center justify-center text-center gap-4 pb-20">
						<div className="space-y-4 max-w-md">
							<p className="text-2xl text-[#2A2A2A] dark:text-foreground font-bold">
								{t.rich('title', {
									anonymous: (chunks) => <span className="text-white bg-[#000DFF] px-2 rounded">{chunks}</span>
								})}
							</p>
							<p className="text-[13px] text-muted-foreground leading-relaxed">
								{t('subtitle')}
							</p>
						</div>

						<Button onClick={onStartReport} size="lg" className="w-full max-w-md py-6 rounded-full h-10 text-base font-semibold bg-[#005AFF] group cursor-pointer hover:bg-[#005AFF]/90">
							{t('startReport')} <ArrowRight className="group-hover:translate-x-1 transition"/>
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
