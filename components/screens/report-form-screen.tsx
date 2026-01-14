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
import { useToast } from "@/hooks/use-toast"
import { useTranslations } from 'next-intl'

interface ReportFormScreenProps {
	onBack: () => void
	onSubmit: (reportId: number) => void
}

export function ReportFormScreen({ onBack, onSubmit }: ReportFormScreenProps) {
	const t = useTranslations('reportForm')
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
	const { toast } = useToast()

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setIsProcessingFiles(true)
			try {
				const selectedFiles = Array.from(e.target.files).slice(0, 3)
				const validFiles = selectedFiles.filter(file => {
					if (file.size > 5 * 1024 * 1024) {
						toast({
							variant: "destructive",
							title: t('attachments.tooLarge'),
							description: t('attachments.tooLargeDesc', { fileName: file.name })
						})
						return false
					}
					return true
				})
				
				const cleanedFiles = await removeMetadataFromFiles(validFiles)
				setFiles(cleanedFiles)
			} catch (error) {
				console.error('Error processing files:', error)
				toast({
					variant: "destructive",
					title: t('attachments.error'),
					description: t('attachments.errorDesc')
				})
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
			toast({
				variant: "destructive",
				title: t('validation.zoneRequired'),
				description: t('validation.zoneRequired')
			})
			return
		}

		if (zone === "AUTRE" && !customZone.trim()) {
			toast({
				variant: "destructive",
				title: t('validation.customZoneRequired'),
				description: t('validation.customZoneRequired')
			})
			return
		}

		if (!incidentTime) {
			toast({
				variant: "destructive",
				title: t('validation.timeRequired'),
				description: t('validation.timeRequired')
			})
			return
		}

		if (!description.trim()) {
			toast({
				variant: "destructive",
				title: t('validation.descriptionRequired'),
				description: t('validation.descriptionRequired')
			})
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
					toast({
						variant: "destructive",
						title: t('submit.error'),
						description: error.response?.data?.message || t('submit.error')
					})
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
					aria-label={t('back')}
					disabled={isSubmitting}
				>
					<ArrowLeft className="w-5 h-5 text-foreground" />
				</button>
				<h1 className="text-xs font-semibold text-foreground">{t('title')}</h1>
			</header>

			<form onSubmit={handleSubmit} className="flex-1 flex flex-col p-6 gap-6">
				{isSuccess && (
					<Alert className="bg-green-50 border-green-200">
						<CheckCircle2 className="h-4 w-4 text-green-600" />
						<AlertDescription className="text-green-800">
							{t('submit.success')}
						</AlertDescription>
					</Alert>
				)}

				{submitMutation.isError && (
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>
							{(submitMutation.error as any)?.response?.data?.message || t('submit.error')}
						</AlertDescription>
					</Alert>
				)}

				<div className="space-y-2">
					<Label htmlFor="zone" className="text-xs font-bold flex items-center gap-2">
						<MapPin className="w-4 h-4 text-primary" />
						{t('zone.label')} {t('zone.required')}
					</Label>
					<p className="text-xs text-muted-foreground">{t('zone.description')}</p>
					
					<Select value={zone} onValueChange={setZone} disabled={isSubmitting || zonesLoading}>
						<SelectTrigger className="h-12 rounded-sm border border-border w-full">
							<SelectValue placeholder={zonesLoading ? t('zone.loading') : t('zone.placeholder')} />
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
									{t('zone.noData')}
								</div>
							)}
						</SelectContent>
					</Select>
					{showCustomInput && (
						<Input
							placeholder={t('zone.customPlaceholder')}
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
						{t('time.label')} {t('time.required')}
					</Label>
					<p className="text-xs text-muted-foreground">{t('time.description')}</p>
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
						{t('description.label')} {t('description.required')}
					</Label>
					<p className="text-xs text-muted-foreground">{t('description.description')}</p>
					<div className="relative">
						<Textarea
							id="description"
							placeholder={t('description.placeholder')}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="min-h-32 rounded-sm border border-border w-full text-xs resize-none pr-12"
							disabled={isSubmitting}
							required
						/>
						<button
							type="button"
							className="absolute right-0 top-0 p-2 rounded-lg hover:bg-secondary transition-colors"
							aria-label={t('description.voiceLabel')}
							disabled={isSubmitting}
						>
							<Mic className="w-5 h-5 text-primary" />
						</button>
					</div>
				</div>

				<div className="space-y-3">
					<Label className="text-xs font-bold">{t('attachments.label')}</Label>

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
									{t('attachments.processing')}
								</span>
							</>
						) : (
							<>
								<UploadIcon className="w-6 h-6 text-muted-foreground" />
								<span className="text-xs text-muted-foreground">
									{files.length >= 3 ? t('attachments.maxFiles') : t('attachments.upload')}
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
						{t('attachments.info')}
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
							{t('submit.sending')}
						</>
					) : isSuccess ? (
						<>
							<CheckCircle2 className="w-4 h-4 mr-2" />
							{t('submit.sent')}
						</>
					) : (
						t('submit.sendAnonymously')
					)}
				</Button>

				<p className="text-xs text-muted-foreground text-center">
					{t('submit.info')}
				</p>
			</form>
		</div>
	)
}
