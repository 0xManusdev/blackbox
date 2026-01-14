"use client"

import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, ExternalLink, Shield, Clock, MapPin, FileText, Loader2, AlertCircle } from "lucide-react"
import { useReport, useVerifyReport } from "@/hooks/use-reports"
import { useTranslations } from 'next-intl'

interface ConfirmationScreenProps {
	reportId: number
	onBackHome: () => void
}

export function ConfirmationScreen({ reportId, onBackHome }: ConfirmationScreenProps) {
	const t = useTranslations('confirmation')
	const { data: report, isLoading: reportLoading, isError: reportError } = useReport(reportId)
	const { data: verification, isLoading: verifyLoading } = useVerifyReport(reportId)

	if (!reportId) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
				<Alert variant="destructive" className="max-w-md">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>
						{t('errors.invalidId')}
					</AlertDescription>
				</Alert>
				<Button onClick={onBackHome} className="mt-4">
					{t('backHome')}
				</Button>
			</div>
		)
	}

	if (reportLoading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
				<Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
				<p className="text-sm text-muted-foreground">{t('blockchain.verifying')}</p>
			</div>
		)
	}

	if (reportError || !report) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
				<Alert variant="destructive" className="max-w-md">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>
						{t('errors.loadError')}
					</AlertDescription>
				</Alert>
				<Button onClick={onBackHome} className="mt-4">
					{t('backHome')}
				</Button>
			</div>
		)
	}

	const getSeverityColor = (severity: string) => {
		switch (severity) {
			case "high": return "bg-red-500"
			case "medium": return "bg-orange-500"
			case "low": return "bg-yellow-500"
			default: return "bg-gray-500"
		}
	}

	return (
		<div className="flex flex-col min-h-screen bg-background">
			<header className="flex flex-col items-center gap-4 px-6 py-8 border-b border-border bg-gradient-to-b from-green-50 to-background dark:from-green-950/20">
				<div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
					<CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
				</div>
				<div className="text-center space-y-2">
					<h1 className="text-lg font-bold text-foreground">{t('title')}</h1>
					<p className="text-xs text-muted-foreground max-w-sm">
						{t('subtitle')}
					</p>
				</div>
			</header>

			<div className="flex-1 p-6 space-y-6">
				<div className="bg-muted/50 rounded-lg p-4 text-center">
					<p className="text-xs text-muted-foreground mb-1">{t('reportNumber')}</p>
					<p className="text-2xl font-bold text-foreground">#{report.id}</p>
					<p className="text-xs text-muted-foreground mt-1">
						{t('saveNumber')}
					</p>
				</div>

				<div className="space-y-4">
					<h2 className="text-sm font-bold text-foreground">{t('details')}</h2>

					<div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
						<MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
						<div className="flex-1 min-w-0">
							<p className="text-xs font-medium text-foreground">{t('zone')}</p>
							<p className="text-xs text-muted-foreground">
								{report.zone}
								{report.customZone && ` - ${report.customZone}`}
							</p>
						</div>
					</div>

					<div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
						<Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
						<div className="flex-1 min-w-0">
							<p className="text-xs font-medium text-foreground">{t('incidentTime')}</p>
							<p className="text-xs text-muted-foreground">{report.incidentTime}</p>
						</div>
					</div>

					<div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
						<FileText className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
						<div className="flex-1 min-w-0">
							<p className="text-xs font-medium text-foreground mb-2">{t('classification')}</p>
							<div className="flex gap-2 flex-wrap">
								<Badge variant="secondary" className="text-xs">
									{report.category}
								</Badge>
								<Badge className={`text-xs text-white ${getSeverityColor(report.severity)}`}>
									{t('severity')}: {t(`severityLevels.${report.severity}` as any) || report.severity}
								</Badge>
							</div>
						</div>
					</div>

					{report.attachments && report.attachments.length > 0 && (
						<div className="p-3 bg-muted/30 rounded-lg">
							<p className="text-xs font-medium text-foreground mb-2">
								{t('attachments', { count: report.attachments.length })}
							</p>
							<div className="grid grid-cols-3 gap-2">
								{report.attachments.map((url, index) => (
									<a
										key={index}
										href={url}
										target="_blank"
										rel="noopener noreferrer"
										className="aspect-square rounded bg-muted hover:bg-muted/80 transition-colors overflow-hidden"
									>
										<img 
											src={url} 
											alt={t('attachmentAlt', { index: index + 1 })}
											className="w-full h-full object-cover"
										/>
									</a>
								))}
							</div>
						</div>
					)}
				</div>

				<div className="space-y-4">
					<h2 className="text-sm font-bold text-foreground flex items-center gap-2">
						<Shield className="w-4 h-4 text-primary" />
						{t('blockchain.title')}
					</h2>

					{verifyLoading ? (
						<div className="p-4 bg-muted/30 rounded-lg flex items-center gap-3">
							<Loader2 className="w-5 h-5 text-primary animate-spin" />
							<p className="text-xs text-muted-foreground">{t('blockchain.verifying')}</p>
						</div>
					) : verification ? (
						<div className="space-y-3">
							<div className={`p-4 rounded-lg ${
								verification.integrityValid 
									? "bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900" 
									: "bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900"
							}`}>
								<div className="flex items-center gap-2 mb-2">
									{verification.integrityValid ? (
										<CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
									) : (
										<AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
									)}
									<p className={`text-sm font-medium ${
										verification.integrityValid 
											? "text-green-800 dark:text-green-300" 
											: "text-red-800 dark:text-red-300"
									}`}>
										{verification.integrityValid 
											? t('blockchain.integrityValid') 
											: t('blockchain.integrityInvalid')}
									</p>
								</div>
								<p className="text-xs text-muted-foreground">
									{verification.integrityValid
										? t('blockchain.validDesc')
										: t('blockchain.invalidDesc')}
								</p>
							</div>

							<div className="p-4 bg-muted/30 rounded-lg space-y-3">
								<div>
									<p className="text-xs font-medium text-foreground mb-1">{t('blockchain.txHash')}</p>
									<p className="text-xs text-muted-foreground font-mono break-all">
										{report.blockchain?.txHash || verification.blockchainTxHash}
									</p>
								</div>
								<div>
									<p className="text-xs font-medium text-foreground mb-1">{t('blockchain.contentHash')}</p>
									<p className="text-xs text-muted-foreground font-mono break-all">
										{verification.storedHash}
									</p>
								</div>
								{report.blockchain?.blockNumber && (
									<div>
										<p className="text-xs font-medium text-foreground mb-1">{t('blockchain.blockNumber')}</p>
										<p className="text-xs text-muted-foreground">
											{report.blockchain.blockNumber}
										</p>
									</div>
								)}
							</div>

							{report.blockchain?.explorerUrl && (
								<a
									href={report.blockchain.explorerUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center justify-center gap-2 p-3 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
								>
									<ExternalLink className="w-4 h-4 text-primary" />
									<span className="text-xs font-medium text-primary">
										{t('blockchain.viewOnEtherscan')}
									</span>
								</a>
							)}
						</div>
					) : report.blockchain?.explorerUrl && (
						<div className="p-4 bg-muted/30 rounded-lg">
							<a
								href={report.blockchain.explorerUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2 text-xs text-primary hover:underline"
							>
								<ExternalLink className="w-3 h-3" />
								{t('blockchain.viewOnEtherscan')}
							</a>
						</div>
					)}
				</div>

				<Alert>
					<AlertDescription className="text-xs">
						{t('info')}
					</AlertDescription>
				</Alert>
			</div>

			<footer className="p-6 border-t border-border space-y-3">
				<Button 
					size="lg" 
					onClick={onBackHome}
					className="w-full bg-[#005AFF] hover:bg-[#005AFF]/90 rounded-full"
				>
					{t('backHome')}
				</Button>
				<p className="text-xs text-muted-foreground text-center">
					{t('thanks')}
				</p>
			</footer>
		</div>
	)
}

