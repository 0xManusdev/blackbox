"use client"

import { Button } from "@/components/ui/button"
import { ShieldCheck } from "lucide-react"
import Image from "next/image"

interface HomeScreenProps {
	onStartReport: () => void
}

export function HomeScreen({ onStartReport }: HomeScreenProps) {
	return (
		<div className="h-full px-4">
			<div className="flex flex-col justify-between min-h-screen bg-white bg-cover bg-center h-screen">
				{/* Header */}
				<div className="flex items-center justify-center">
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 flex items-center justify-center">
							<Image
								src="/box.png"
								alt="Logo"
								width={32}
								height={32}
							/>
						</div>
						<span className="font-semibold text-foreground">Blackbox</span>
					</div>
					{/* <Button variant="outline" size="sm" className="text-xs px-3 py-1 h-8 bg-transparent">
					FR | EN | Ewe
				</Button> */}
				</div>

				<div className="w-full flex items-center justify-center rounded-2xl overflow-hidden">
					<Image
						src="/bg.jpg"
						alt="Background"
						width={500}
						height={500}
						className="object-cover"
					/>
				</div>

				{/* Main Content */}
				<div className="w-full flex flex-col items-center justify-center text-center gap-4 pb-20">
					{/* Title & Description */}
					<div className="space-y-4 max-w-xs">
						<p className="text-2xl text-[#2A2A2A] dark:text-foreground font-bold">Plateforme <span className="text-white bg-[#000DFF] px-2 rounded">anonyme</span> de signalement de l'AIGE.</p>
						<p className="text-[13px] text-muted-foreground leading-relaxed">
							Signalez un incident en toute confidentialité. Nous ne stockons aucune information sur votre identité.
						</p>
					</div>

					{/* CTA Button */}
					<Button onClick={onStartReport} size="lg" className="w-full py-6 rounded-full h-10 text-base font-semibold bg-[#005AFF] hover:bg-[#005AFF]/90">
						Faire un signalement
					</Button>
				</div>
			</div>
		</div>
	)
}
