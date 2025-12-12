"use client"

import { useState } from "react"
import { HomeScreen } from "@/components/screens/home-screen"
import { ReportFormScreen } from "@/components/screens/report-form-screen"
import { ConfirmationScreen } from "@/components/screens/confirmation-screen"

type Screen = "home" | "form" | "confirmation"

export default function Page() {
	const [currentScreen, setCurrentScreen] = useState<Screen>("home")
	const [reportId, setReportId] = useState<number | null>(null)

	const handleReportSubmit = (id: number) => {
		setReportId(id)
		setCurrentScreen("confirmation")
	}

	const handleBackHome = () => {
		setCurrentScreen("home")
		setReportId(null)
	}

	return (
		<main className="min-h-screen bg-background max-w-4xl mx-auto">
			{currentScreen === "home" && (
				<HomeScreen onStartReport={() => setCurrentScreen("form")} />
			)}
			{currentScreen === "form" && (
				<ReportFormScreen 
					onBack={handleBackHome} 
					onSubmit={handleReportSubmit} 
				/>
			)}
			{currentScreen === "confirmation" && reportId && (
				<ConfirmationScreen 
					reportId={reportId}
					onBackHome={handleBackHome} 
				/>
			)}
		</main>
	)
}
