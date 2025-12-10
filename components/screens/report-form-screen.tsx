"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Mic, Camera, Video, X, MapPin, Clock, UploadIcon } from "lucide-react"

interface ReportFormScreenProps {
	onBack: () => void
	onSubmit: () => void
}

const LOCATIONS = [
	"Terminal 1",
	"Terminal 2",
	"Portes d'embarquement",
	"Zone de douanes",
	"Parking",
	"Hall d'arrivée",
	"Hall de départ",
	"Zone de transit",
	"Autre (saisir manuellement)",
]

export function ReportFormScreen({ onBack, onSubmit }: ReportFormScreenProps) {
	const [location, setLocation] = useState("")
	const [customLocation, setCustomLocation] = useState("")
	const [time, setTime] = useState(() => {
		const now = new Date()
		return now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
	})
	const [description, setDescription] = useState("")
	const [attachments, setAttachments] = useState<{ type: "photo" | "video"; name: string }[]>([])

	const handleAddAttachment = (type: "photo" | "video") => {
		if (attachments.length < 3) {
			setAttachments([...attachments, { type, name: `${type}_${attachments.length + 1}` }])
		}
	}

	const handleRemoveAttachment = (index: number) => {
		setAttachments(attachments.filter((_, i) => i !== index))
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		onSubmit()
	}

	const showCustomInput = location === "Autre (saisir manuellement)"

	return (
		<div className="flex flex-col min-h-screen bg-background">
			{/* Header */}
			<header className="flex items-center gap-4 px-4 py-2 border-b border-border">
				<button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors" aria-label="Retour">
					<ArrowLeft className="w-5 h-5 text-foreground" />
				</button>
				<h1 className="text-xs font-semibold text-foreground">Nouveau signalement</h1>
				{/* <div className="ml-auto">
					<Button variant="outline" size="sm" className="text-xs px-3 py-1 h-8 bg-transparent">
						FR
					</Button>
				</div> */}
			</header>

			{/* Form */}
			<form onSubmit={handleSubmit} className="flex-1 flex flex-col p-6 gap-6">
				{/* Location */}
				<div className="space-y-2">
					<Label htmlFor="location" className="text-xs font-bold flex items-center gap-2">
						<MapPin className="w-4 h-4 text-primary" />
						Zone / Lieu
					</Label>
					<p className="text-xs text-muted-foreground">Sélectionnez le lieu de l'incident.</p>
					<Select value={location} onValueChange={setLocation}>
						<SelectTrigger className="h-12 rounded-sm border border-border w-full">
							<SelectValue placeholder="Sélectionner un lieu" />
						</SelectTrigger>
						<SelectContent>
							{LOCATIONS.map((loc) => (
								<SelectItem key={loc} value={loc}>
									{loc}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{showCustomInput && (
						<Input
							placeholder="Précisez le lieu..."
							value={customLocation}
							onChange={(e) => setCustomLocation(e.target.value)}
							className="h-12 rounded-sm border border-border w-full mt-2"
						/>
					)}
				</div>

				{/* Time */}
				<div className="space-y-2">
					<Label htmlFor="time" className="text-xs font-bold flex items-center gap-2">
						<Clock className="w-4 h-4 text-primary" />
						Heure
					</Label>
					<p className="text-xs text-muted-foreground">Sélectionnez l'heure de l'incident.</p>
					<Input
						id="time"
						type="time"
						value={time}
						onChange={(e) => setTime(e.target.value)}
						className="h-12 text-xs rounded-sm border border-border w-full"
					/>
				</div>

				{/* Description */}
				<div className="space-y-2">
					<Label htmlFor="description" className="text-xs font-bold">
						Description
					</Label>
					<p className="text-xs text-muted-foreground">Donnez une description de l'incident.</p>
					<div className="relative">
						<Textarea
							id="description"
							placeholder="Décrivez l'incident..."
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="min-h-32 rounded-sm border border-border w-full text-xs resize-none pr-12"
						/>
						<button
							type="button"
							className="absolute right-0 top-0 p-2 rounded-lg hover:bg-secondary transition-colors"
							aria-label="Dictée vocale"
						>
							<Mic className="w-5 h-5 text-primary" />
						</button>
					</div>
				</div>

				{/* Attachments */}
				<div className="space-y-3">
					<Label className="text-xs font-bold">Pièces jointes</Label>

					{/* Attachment buttons */}
					<div className="flex border border-dashed border-border w-full rounded-sm flex-1 items-center justify-center h-24 gap-3">
						<UploadIcon/>
						{/* <p className="text-xs text-muted-foreground">Ajouter des pièces jointes</p> */}
					</div>

					{/* Attachment previews */}
					{attachments.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{attachments.map((att, index) => (
								<div key={index} className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
									{att.type === "photo" ? (
										<Camera className="w-4 h-4 text-primary" />
									) : (
										<Video className="w-4 h-4 text-primary" />
									)}
									<span className="text-xs text-secondary-foreground">{att.name}</span>
									<button
										type="button"
										onClick={() => handleRemoveAttachment(index)}
										className="p-0.5 rounded hover:bg-primary/10"
									>
										<X className="w-3 h-3 text-muted-foreground" />
									</button>
								</div>
							))}
						</div>
					)}

					<p className="text-xs text-muted-foreground">Maximum 3 fichiers, 5MB par fichier</p>
				</div>

				{/* Spacer */}
				<div className="flex-1" />

				{/* Submit Button */}
				<Button type="submit" size="lg" className="w-full py-2  bg-[#005AFF] hover:bg-[#005AFF]/90 rounded-full h-10 text-sm font-semibold">
					Envoyer anonymement
				</Button>
			</form>
		</div>
	)
}
