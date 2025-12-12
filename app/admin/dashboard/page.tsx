"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { CheckCircle2, Trash2, AlertTriangle, Shield, Clock, MapPin, Calendar, FileText, LogOut, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useCurrentUser, useLogout } from "@/hooks/use-auth"
import { useAllReports, useResolveReport, useDeleteReport } from "@/hooks/use-admin"
import type { Report } from "@/lib/types"

const getSeverityColor = (severity: string) => {
	switch (severity) {
		case "critical":
			return "destructive"
		case "high":
			return "destructive"
		case "medium":
			return "default"
		case "low":
			return "secondary"
		default:
			return "outline"
	}
}

const getSeverityLabel = (severity: string) => {
	switch (severity) {
		case "critical":
			return "Critique"
		case "high":
			return "Élevée"
		case "medium":
			return "Moyenne"
		case "low":
			return "Faible"
		default:
			return severity
	}
}

const getCategoryLabel = (category: string) => {
	switch (category) {
		case "SECURITE_PHYSIQUE":
			return "Sécurité Physique"
		case "SECURITE_AERIENNE":
			return "Sécurité Aérienne"
		case "INCIDENT_TECHNIQUE":
			return "Incident Technique"
		case "PROCEDURE_NON_RESPECTEE":
			return "Procédure Non Respectée"
		case "COMPORTEMENT_SUSPECT":
			return "Comportement Suspect"
		case "ACCES_NON_AUTORISE":
			return "Accès Non Autorisé"
		default:
			return category.replace(/_/g, ' ')
	}
}

const getZoneLabel = (zone: string) => {
	switch (zone) {
		case "TERMINAL_1":
			return "Terminal 1"
		case "TERMINAL_2":
			return "Terminal 2"
		case "PORTES_EMBARQUEMENT":
			return "Portes d'embarquement"
		case "ZONE_DOUANES":
			return "Zone de douanes"
		case "PARKING":
			return "Parking"
		case "HALL_ARRIVEE":
			return "Hall d'arrivée"
		case "HALL_DEPART":
			return "Hall de départ"
		case "ZONE_TRANSIT":
			return "Zone de transit"
		default:
			return zone
	}
}

export default function AdminDashboardPage() {
	const router = useRouter()
	const { data: user, isLoading: userLoading, isError: userError } = useCurrentUser()
	const { data: reportsData, isLoading: reportsLoading, isFetching: reportsFetching } = useAllReports()
	const resolveMutation = useResolveReport()
	const deleteMutation = useDeleteReport()
	const logoutMutation = useLogout()

	const [selectedReport, setSelectedReport] = useState<Report | null>(null)
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [reportToDelete, setReportToDelete] = useState<number | null>(null)

	// Filtres
	const [statusFilter, setStatusFilter] = useState<string>("all")
	const [severityFilter, setSeverityFilter] = useState<string>("all")
	const [categoryFilter, setCategoryFilter] = useState<string>("all")
	const [searchQuery, setSearchQuery] = useState("")

	// Pagination
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 10

	// Redirect if not authenticated
	useEffect(() => {
		if (!userLoading && (userError || !user)) {
			router.replace("/admin")
		}
	}, [user, userLoading, userError, router])

	// Get reports and calculate stats
	const reports = reportsData?.data || []
	
	const stats = useMemo(() => ({
		total: reports.length,
		pending: reports.filter((r: Report) => !r.resolvedAt).length,
		resolved: reports.filter((r: Report) => !!r.resolvedAt).length,
		highSeverity: reports.filter((r: Report) => r.severity === "high").length,
		critical: reports.filter((r: Report) => r.severity === "critical").length,
	}), [reports])

	// Apply filters
	const filteredReports = useMemo(() => {
		let filtered = [...reports]

		if (statusFilter !== "all") {
			filtered = filtered.filter((r) => 
				statusFilter === "resolved" ? !!r.resolvedAt : !r.resolvedAt
			)
		}

		if (severityFilter !== "all") {
			filtered = filtered.filter((r) => r.severity === severityFilter)
		}

		if (categoryFilter !== "all") {
			filtered = filtered.filter((r) => r.category === categoryFilter)
		}

		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase()
			filtered = filtered.filter((r) => 
				r.id.toString().includes(query) ||
				r.zone.toLowerCase().includes(query) ||
				r.customZone?.toLowerCase().includes(query) ||
				r.anonymizedContent.toLowerCase().includes(query) ||
				r.category.toLowerCase().includes(query)
			)
		}

		return filtered
	}, [reports, statusFilter, severityFilter, categoryFilter, searchQuery])

	// Reset page when filters change
	useEffect(() => {
		setCurrentPage(1)
	}, [statusFilter, severityFilter, categoryFilter, searchQuery])

	const handleResolve = (id: number) => {
		resolveMutation.mutate(id)
	}

	const handleDelete = () => {
		if (!reportToDelete) return
		
		deleteMutation.mutate(reportToDelete, {
			onSuccess: () => {
				setDeleteDialogOpen(false)
				setReportToDelete(null)
			}
		})
	}

	const handleLogout = () => {
		logoutMutation.mutate(undefined, {
			onSuccess: () => {
				router.push("/admin")
			}
		})
	}

	const openDeleteDialog = (id: number) => {
		setReportToDelete(id)
		setDeleteDialogOpen(true)
	}

	const resetFilters = () => {
		setStatusFilter("all")
		setSeverityFilter("all")
		setCategoryFilter("all")
		setSearchQuery("")
	}

	// Pagination
	const totalPages = Math.ceil(filteredReports.length / itemsPerPage)
	const startIndex = (currentPage - 1) * itemsPerPage
	const endIndex = startIndex + itemsPerPage
	const currentReports = filteredReports.slice(startIndex, endIndex)

	const categories = useMemo(() => 
		Array.from(new Set(reports.map((r: Report) => r.category))),
		[reports]
	)

	if (userLoading || reportsLoading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
					<p className="text-muted-foreground">Chargement...</p>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto p-6 space-y-6">
				{/* Header with Logout */}
				<div className="flex items-center justify-between">
					<div className="space-y-2">
						<div className="flex items-center gap-3">
							<h1 className="text-3xl font-bold tracking-tight">Tableau de bord Admin</h1>
							{reportsFetching && !reportsLoading && (
								<div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
									<div className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
									Actualisation...
								</div>
							)}
						</div>
						<p className="text-muted-foreground">
							Gestion des signalements de la plateforme Blackbox • Mise à jour automatique toutes les 5 secondes
						</p>
					</div>
					<Button variant="outline" onClick={handleLogout} disabled={logoutMutation.isPending}>
						<LogOut className="h-4 w-4 mr-2" />
						Déconnexion
					</Button>
				</div>

				{/* Stats Cards */}
				<div className="grid gap-4 md:grid-cols-5">
					<Card className={reportsFetching ? "ring-2 ring-primary/20 transition-all" : "transition-all"}>
						<CardHeader className="pb-3">
							<CardDescription>Total</CardDescription>
							<CardTitle className="text-3xl transition-all duration-300">{stats.total}</CardTitle>
						</CardHeader>
						<CardContent>
							<FileText className="h-4 w-4 text-muted-foreground" />
						</CardContent>
					</Card>

					<Card className={reportsFetching ? "ring-2 ring-primary/20 transition-all" : "transition-all"}>
						<CardHeader className="pb-3">
							<CardDescription>En attente</CardDescription>
							<CardTitle className="text-3xl transition-all duration-300">{stats.pending}</CardTitle>
						</CardHeader>
						<CardContent>
							<Clock className="h-4 w-4 text-yellow-500" />
						</CardContent>
					</Card>

					<Card className={reportsFetching ? "ring-2 ring-primary/20 transition-all" : "transition-all"}>
						<CardHeader className="pb-3">
							<CardDescription>Résolus</CardDescription>
							<CardTitle className="text-3xl transition-all duration-300">{stats.resolved}</CardTitle>
						</CardHeader>
						<CardContent>
							<CheckCircle2 className="h-4 w-4 text-green-500" />
						</CardContent>
					</Card>

					<Card className={reportsFetching ? "ring-2 ring-primary/20 transition-all" : "transition-all"}>
						<CardHeader className="pb-3">
							<CardDescription>Priorité élevée</CardDescription>
							<CardTitle className="text-3xl transition-all duration-300">{stats.highSeverity}</CardTitle>
						</CardHeader>
						<CardContent>
							<AlertTriangle className="h-4 w-4 text-orange-500" />
						</CardContent>
					</Card>

					<Card className={reportsFetching ? "ring-2 ring-primary/20 transition-all" : "transition-all"}>
						<CardHeader className="pb-3">
							<CardDescription>Critiques</CardDescription>
							<CardTitle className="text-3xl transition-all duration-300">{stats.critical}</CardTitle>
						</CardHeader>
						<CardContent>
							<AlertTriangle className="h-4 w-4 text-red-500" />
						</CardContent>
					</Card>
				</div>

				{/* Filters */}
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle>Filtres</CardTitle>
								<CardDescription>Affinez votre recherche</CardDescription>
							</div>
							<Button variant="ghost" size="sm" onClick={resetFilters}>
								Réinitialiser
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4 md:grid-cols-4">
							<div className="space-y-2">
								<label className="text-sm font-medium">Recherche</label>
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										placeholder="ID, zone, description..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="pl-9"
									/>
								</div>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium">Statut</label>
								<Select value={statusFilter} onValueChange={setStatusFilter}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">Tous</SelectItem>
										<SelectItem value="pending">En attente</SelectItem>
										<SelectItem value="resolved">Résolus</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium">Sévérité</label>
								<Select value={severityFilter} onValueChange={setSeverityFilter}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">Toutes</SelectItem>
										<SelectItem value="critical">Critique</SelectItem>
										<SelectItem value="high">Élevée</SelectItem>
										<SelectItem value="medium">Moyenne</SelectItem>
										<SelectItem value="low">Faible</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium">Catégorie</label>
								<Select value={categoryFilter} onValueChange={setCategoryFilter}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">Toutes</SelectItem>
										{categories.map((category) => (
											<SelectItem key={category} value={category}>
												{getCategoryLabel(category)}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Reports Table */}
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle>Signalements</CardTitle>
								<CardDescription>
									{filteredReports.length} résultat{filteredReports.length > 1 ? "s" : ""}
									{filteredReports.length !== reports.length && ` sur ${reports.length}`}
								</CardDescription>
							</div>
							{totalPages > 1 && (
								<div className="flex items-center gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
										disabled={currentPage === 1}
									>
										<ChevronLeft className="h-4 w-4" />
									</Button>
									<span className="text-sm text-muted-foreground">
										Page {currentPage} sur {totalPages}
									</span>
									<Button
										variant="outline"
										size="sm"
										onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
										disabled={currentPage === totalPages}
									>
										<ChevronRight className="h-4 w-4" />
									</Button>
								</div>
							)}
						</div>
					</CardHeader>
					<CardContent>
						{currentReports.length === 0 ? (
							<div className="text-center py-12">
								<Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
								<h3 className="text-lg font-semibold mb-2">Aucun signalement</h3>
								<p className="text-muted-foreground text-sm">
									{filteredReports.length === 0 && reports.length > 0
										? "Aucun résultat ne correspond à vos critères"
										: "Les signalements apparaîtront ici"}
								</p>
							</div>
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>ID</TableHead>
										<TableHead>Zone</TableHead>
										<TableHead>Catégorie</TableHead>
										<TableHead>Sévérité</TableHead>
										<TableHead>Date</TableHead>
										<TableHead>Statut</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{currentReports.map((report) => (
										<TableRow 
											key={report.id}
											className="cursor-pointer"
											onClick={() => setSelectedReport(report)}
										>
											<TableCell className="font-medium">
												<div className="flex items-center gap-2">
													#{report.id}
													{/* Badge "Nouveau" si créé il y a moins de 1 minute */}
													{new Date(report.createdAt).getTime() > Date.now() - 60000 && (
														<Badge variant="default" className="bg-green-500 text-white text-xs">
															Nouveau
														</Badge>
													)}
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													<MapPin className="h-4 w-4 text-muted-foreground" />
													{report.customZone || getZoneLabel(report.zone)}
												</div>
											</TableCell>
											<TableCell>{getCategoryLabel(report.category)}</TableCell>
											<TableCell>
												<Badge variant={getSeverityColor(report.severity) as any}>
													{getSeverityLabel(report.severity)}
												</Badge>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													<Calendar className="h-4 w-4 text-muted-foreground" />
													{format(new Date(report.createdAt), "dd MMM yyyy", { locale: fr })}
												</div>
											</TableCell>
											<TableCell>
												{report.resolvedAt ? (
													<Badge variant="secondary">
														<CheckCircle2 className="h-3 w-3" />
														Résolu
													</Badge>
												) : (
													<Badge variant="outline">
														<Clock className="h-3 w-3" />
														En attente
													</Badge>
												)}
											</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
													{!report.resolvedAt && (
														<Button
															size="sm"
															variant="outline"
															onClick={() => handleResolve(report.id)}
															disabled={resolveMutation.isPending}
														>
															<CheckCircle2 className="h-4 w-4" />
														</Button>
													)}
													<Button
														size="sm"
														variant="outline"
														onClick={() => openDeleteDialog(report.id)}
														disabled={deleteMutation.isPending}
													>
														<Trash2 className="h-4 w-4 text-destructive" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}
					</CardContent>
				</Card>

				{/* Report Detail Dialog */}
				{selectedReport && (
					<AlertDialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
						<AlertDialogContent className="max-w-2xl">
							<AlertDialogHeader>
								<AlertDialogTitle>Détails du signalement #{selectedReport.id}</AlertDialogTitle>
								<AlertDialogDescription asChild>
									<div className="space-y-4 pt-4">
										<div className="grid grid-cols-2 gap-4">
											<div>
												<p className="text-sm font-medium text-foreground">Zone</p>
												<p className="text-sm text-muted-foreground">{selectedReport.customZone || getZoneLabel(selectedReport.zone)}</p>
											</div>
											<div>
												<p className="text-sm font-medium text-foreground">Heure de l&apos;incident</p>
												<p className="text-sm text-muted-foreground">{selectedReport.incidentTime}</p>
											</div>
											<div>
												<p className="text-sm font-medium text-foreground">Catégorie</p>
												<p className="text-sm text-muted-foreground">{getCategoryLabel(selectedReport.category)}</p>
											</div>
											<div>
												<p className="text-sm font-medium text-foreground">Sévérité</p>
												<Badge variant={getSeverityColor(selectedReport.severity) as any}>
													{getSeverityLabel(selectedReport.severity)}
												</Badge>
											</div>
										</div>
										
										<div>
											<p className="text-sm font-medium text-foreground mb-2">Description</p>
											<div className="bg-muted/50 rounded-md p-4">
												<p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedReport.anonymizedContent}</p>
											</div>
										</div>

										{selectedReport.blockchainTxHash && (
											<div>
												<p className="text-sm font-medium text-foreground">Hash Blockchain</p>
												<code className="text-xs text-muted-foreground bg-muted/50 p-2 rounded block mt-1 break-all">
													{selectedReport.blockchainTxHash}
												</code>
											</div>
										)}

										<div>
											<p className="text-sm font-medium text-foreground">Date de création</p>
											<p className="text-sm text-muted-foreground">
												{format(new Date(selectedReport.createdAt), "dd MMMM yyyy à HH:mm", { locale: fr })}
											</p>
										</div>
									</div>
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Fermer</AlertDialogCancel>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				)}

				{/* Delete Confirmation Dialog */}
				<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
							<AlertDialogDescription>
								Êtes-vous sûr de vouloir supprimer ce signalement ? Cette action est irréversible.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel onClick={() => setReportToDelete(null)}>Annuler</AlertDialogCancel>
							<AlertDialogAction 
								onClick={handleDelete} 
								disabled={deleteMutation.isPending}
								className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							>
								{deleteMutation.isPending ? "Suppression..." : "Supprimer"}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</div>
	)
}
