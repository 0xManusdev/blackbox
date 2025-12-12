"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Mic, X, MapPin, Clock, UploadIcon, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { useZones, useSubmitReport } from "@/hooks/use-reports"
import { removeMetadataFromFiles } from "@/lib/remove-metadata"

interface ReportFormScreenProps {
	onBack: () => void
	onSubmit: (reportId: number) => void
}

export function ReportFormScreen({ onBack, onSubmit }: ReportFormScreenProps) {
	const [zone, setZone] = useState("")
	const [customZone, setCustomZone] = useState("")
	const [incidentTime, setIncidentTime] = useState(() => {
		const now = new Date()
		return now.toTimeString().slice(0, 5)
	})
	const [description, setDescription] = useState("")
	const [files, setFiles] = useState<File[]>([])
	const [isProcessingFiles, setIsProcessingFiles] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const { data: zones, isLoading: zonesLoading } = useZones()
	const submitMutation = useSubmitReport()

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setIsProcessingFiles(true)
			try {
				const selectedFiles = Array.from(e.target.files).slice(0, 3)
				const validFiles = selectedFiles.filter(file => {
					if (file.size > 5 * 1024 * 1024) {
						alert(`Le fichier ${file.name} dépasse 5MB`)
						return false
					}
					return true
				})
				
				// Remove metadata from images before setting state
				const cleanedFiles = await removeMetadataFromFiles(validFiles)
				setFiles(cleanedFiles)
			} catch (error) {
				console.error('Error processing files:', error)
				alert('Erreur lors du traitement des fichiers')
			} finally {
				setIsProcessingFiles(false)
			}
		}
	}

	const handleRemoveFile = (index: number) => {
		setFiles(files.filter((_, i) => i !== index))
	}

	const handleUploadClick = () => {
		fileInputRef.current?.click()
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!zone) {
			alert("Veuillez sélectionner une zone")
			return
		}

		if (zone === "AUTRE" && !customZone.trim()) {
			alert("Veuillez préciser la zone personnalisée")
			return
		}

		if (!incidentTime) {
			alert("Veuillez sélectionner l'heure de l'incident")
			return
		}

		if (!description.trim()) {
			alert("Veuillez décrire l'incident")
			return
		}

		submitMutation.mutate(
			{
				zone,
				customZone: zone === "AUTRE" ? customZone : undefined,
				incidentTime,
				description,
				attachments: files.length > 0 ? files : undefined,
			},
			{
				onSuccess: (data) => {
					onSubmit(data.id)
				},
				onError: (error: any) => {
					alert(error.response?.data?.message || "Une erreur est survenue lors de la soumission")
				},
			}
		)
	}

	const showCustomInput = zone === "AUTRE"
	const isSubmitting = submitMutation.isPending || isProcessingFiles
	const isSuccess = submitMutation.isSuccess

	return (
		<div className="flex flex-col min-h-screen bg-background">
			<header className="flex items-center gap-4 px-4 py-2 border-b border-border">
				<button 
					onClick={onBack} 
					className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors" 
					aria-label="Retour"
					disabled={isSubmitting}
				>
					<ArrowLeft className="w-5 h-5 text-foreground" />
				</button>
				<h1 className="text-xs font-semibold text-foreground">Nouveau signalement</h1>
			</header>

			<form onSubmit={handleSubmit} className="flex-1 flex flex-col p-6 gap-6">
				{isSuccess && (
					<Alert className="bg-green-50 border-green-200">
						<CheckCircle2 className="h-4 w-4 text-green-600" />
						<AlertDescription className="text-green-800">
							Votre signalement a été soumis avec succès et enregistré sur la blockchain.
						</AlertDescription>
					</Alert>
				)}

				{submitMutation.isError && (
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>
							{(submitMutation.error as any)?.response?.data?.message || 
							 "Une erreur est survenue lors de la soumission"}
						</AlertDescription>
					</Alert>
				)}

				<div className="space-y-2">
					<Label htmlFor="zone" className="text-xs font-bold flex items-center gap-2">
						<MapPin className="w-4 h-4 text-primary" />
						Zone / Lieu *
					</Label>
					<p className="text-xs text-muted-foreground">Sélectionnez le lieu de l'incident.</p>
					
					<Select value={zone} onValueChange={setZone} disabled={isSubmitting || zonesLoading}>
						<SelectTrigger className="h-12 rounded-sm border border-border w-full">
							<SelectValue placeholder={zonesLoading ? "Chargement des zones..." : "Sélectionner un lieu"} />
						</SelectTrigger>
						<SelectContent>
							{zones && zones.length > 0 ? (
								zones.map((z) => (
									<SelectItem key={z.value} value={z.value}>
										{z.label}
									</SelectItem>
								))
							) : (
								<div className="p-2 text-xs text-muted-foreground text-center">
									Aucune zone disponible
								</div>
							)}
						</SelectContent>
					</Select>
					{showCustomInput && (
						<Input
							placeholder="Précisez le lieu..."
							value={customZone}
							onChange={(e) => setCustomZone(e.target.value)}
							className="h-12 rounded-sm border border-border w-full mt-2"
							disabled={isSubmitting}
							required
						/>
					)}
				</div>

				<div className="space-y-2">
					<Label htmlFor="incidentTime" className="text-xs font-bold flex items-center gap-2">
						<Clock className="w-4 h-4 text-primary" />
						Heure *
					</Label>
					<p className="text-xs text-muted-foreground">Sélectionnez l'heure de l'incident.</p>
					<Input
						id="incidentTime"
						type="time"
						value={incidentTime}
						onChange={(e) => setIncidentTime(e.target.value)}
						className="h-12 text-xs rounded-sm border border-border w-full"
						disabled={isSubmitting}
						required
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="description" className="text-xs font-bold">
						Description *
					</Label>
					<p className="text-xs text-muted-foreground">Donnez une description détaillée de l'incident.</p>
					<div className="relative">
						<Textarea
							id="description"
							placeholder="Décrivez l'incident de manière détaillée..."
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="min-h-32 rounded-sm border border-border w-full text-xs resize-none pr-12"
							disabled={isSubmitting}
							required
						/>
						<button
							type="button"
							className="absolute right-0 top-0 p-2 rounded-lg hover:bg-secondary transition-colors"
							aria-label="Dictée vocale"
							disabled={isSubmitting}
						>
							<Mic className="w-5 h-5 text-primary" />
						</button>
					</div>
				</div>

				<div className="space-y-3">
					<Label className="text-xs font-bold">Pièces jointes (optionnel)</Label>

					<input
						ref={fileInputRef}
						type="file"
						multiple
						accept="image/*,application/pdf"
						onChange={handleFileChange}
						className="hidden"
						disabled={isSubmitting}
					/>

					<button
						type="button"
						onClick={handleUploadClick}
						disabled={isSubmitting || files.length >= 3}
						className="flex border-2 border-dashed border-border hover:border-primary hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed w-full rounded-sm items-center justify-center h-24 gap-3 transition-colors"
					>
						{isProcessingFiles ? (
							<>
								<Loader2 className="w-6 h-6 text-primary animate-spin" />
								<span className="text-xs text-muted-foreground">
									Traitement des images...
								</span>
							</>
						) : (
							<>
								<UploadIcon className="w-6 h-6 text-muted-foreground" />
								<span className="text-xs text-muted-foreground">
									{files.length >= 3 ? "Maximum 3 fichiers" : "Cliquez pour ajouter des fichiers"}
								</span>
							</>
						)}
					</button>

					{files.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{files.map((file, index) => (
								<div key={index} className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg max-w-full">
									<span className="text-xs text-secondary-foreground truncate flex-1">
										{file.name}
									</span>
									<span className="text-xs text-muted-foreground">
										{(file.size / 1024).toFixed(0)}KB
									</span>
									<button
										type="button"
										onClick={() => handleRemoveFile(index)}
										className="p-0.5 rounded hover:bg-primary/10"
										disabled={isSubmitting}
									>
										<X className="w-3 h-3 text-muted-foreground" />
									</button>
								</div>
							))}
						</div>
					)}

					<p className="text-xs text-muted-foreground">
						Maximum 3 fichiers, 5MB par fichier. Formats acceptés: images, PDF. Les métadonnées des images sont automatiquement supprimées.
					</p>
				</div>

				<div className="flex-1" />

				<Button 
					type="submit" 
					size="lg" 
					className="w-full py-2 bg-[#005AFF] hover:bg-[#005AFF]/90 rounded-full h-10 text-sm font-semibold"
					disabled={isSubmitting || isSuccess}
				>
					{isSubmitting ? (
						<>
							<Loader2 className="w-4 h-4 mr-2 animate-spin" />
							Envoi en cours...
						</>
					) : isSuccess ? (
						<>
							<CheckCircle2 className="w-4 h-4 mr-2" />
							Envoyé avec succès
						</>
					) : (
						"Envoyer anonymement"
					)}
				</Button>

				<p className="text-xs text-muted-foreground text-center">
					Votre signalement sera analysé automatiquement et enregistré sur la blockchain.
				</p>
			</form>
		</div>
	)
}
