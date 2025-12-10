"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

interface ConfirmationScreenProps {
	onBackHome: () => void
}

export function ConfirmationScreen({ onBackHome }: ConfirmationScreenProps) {
	return (
		<div className="flex flex-col min-h-screen px-6 py-8">
			{/* Header */}
			<header className="flex items-center justify-center">
				<div className="flex items-center gap-2">
					<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
						<span className="text-primary-foreground font-bold text-sm">B</span>
					</div>
					<span className="font-semibold text-foreground">Blackbox</span>
				</div>
			</header>

			{/* Main Content */}
			<div className="flex-1 flex flex-col items-center justify-center text-center gap-8 py-12">
				{/* Success Icon */}
				<div className="w-24 h-24 bg-[#E8F5ED] rounded-full flex items-center justify-center">
					<CheckCircle2 className="w-12 h-12 text-[#2E8C4F]" strokeWidth={1.5} />
				</div>

				{/* Message */}
				<div className="space-y-4 max-w-xs">
					<h1 className="text-2xl font-bold text-foreground leading-tight text-balance">Signalement envoyé</h1>
					<p className="text-base text-muted-foreground leading-relaxed">Votre signalement a été envoyé avec succès.</p>
					<p className="text-sm text-muted-foreground leading-relaxed">
						Merci pour votre contribution à la sécurité de l'AIGE.
					</p>
				</div>

				{/* Back Button */}
				<Button
					onClick={onBackHome}
					variant="outline"
					size="lg"
					className="w-full rounded-full h-10 text-base font-semibold border-primary text-primary hover:bg-secondary bg-transparent"
				>
					Retour à l'accueil
				</Button>
			</div>

			{/* Footer */}
			<footer className="text-center">
				<p className="text-xs text-muted-foreground">Aéroport International Gnassingbé Eyadéma</p>
			</footer>
		</div>
	)
}
