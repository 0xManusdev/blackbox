"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, ShieldCheck } from "lucide-react"
import Image from "next/image"

interface HomeScreenProps {
	onStartReport: () => void
}

export function HomeScreen({ onStartReport }: HomeScreenProps) {
	return (
		<div className="h-full px-4">
			<div className="flex flex-col items-center justify-center min-h-screen bg-white bg-cover bg-center h-screen gap-6">
				{/* Header */}
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
						<span className="font-semibold text-xl  text-foreground">Blackbox</span>
					</div>
					{/* <Button variant="outline" size="sm" className="text-xs px-3 py-1 h-8 bg-transparent">
					FR | EN | Ewe
				</Button> */}
				</div>
				<div className="flex flex-col items-center gap-4 justify-center">
					<div className="flex items-center justify-center">
						<ShieldCheck className="w-24 h-24 text-[#005AFF] bg-accent p-4 rounded-full"/>
					</div>

					{/* Main Content */}
					<div className="w-full flex flex-col items-center justify-center text-center gap-4 pb-20">
						{/* Title & Description */}
						<div className="space-y-4 max-w-md">
							<p className="text-2xl text-[#2A2A2A] dark:text-foreground font-bold">Plateforme <span className="text-white bg-[#000DFF] px-2 rounded">anonyme</span> de signalement de l'AIGE.</p>
							<p className="text-[13px] text-muted-foreground leading-relaxed">
								Signalez un incident en toute confidentialité. Nous ne stockons aucune information sur votre identité.
							</p>
						</div>

						{/* CTA Button */}
						<Button onClick={onStartReport} size="lg" className="w-full max-w-md py-6 rounded-full h-10 text-base font-semibold bg-[#005AFF] group cursor-pointer hover:bg-[#005AFF]/90">
							Faire un signalement <ArrowRight className="group-hover:translate-x-1 transition"/>
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
