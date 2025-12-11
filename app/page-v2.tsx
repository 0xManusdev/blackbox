"use client"

import { useState } from "react"
import { HomeScreen } from "@/components/screens/home-screen"
import { ReportFormScreenV2 } from "@/components/screens/report-form-screen-v2"
import { ConfirmationScreenV2 } from "@/components/screens/confirmation-screen-v2"
import { Toaster } from "@/components/ui/toaster"

type Screen = "home" | "form" | "confirmation"

export default function PageV2() {
	const [currentScreen, setCurrentScreen] = useState<Screen>("home")
	const [reportId, setReportId] = useState<number | null>(null)

	const handleSuccess = (id: number) => {
		setReportId(id)
		setCurrentScreen("confirmation")
	}

	const handleBackHome = () => {
		setCurrentScreen("home")
		setReportId(null)
	}

	return (
		<>
			<main className="min-h-screen bg-background max-w-4xl mx-auto">
				{currentScreen === "home" && (
					<HomeScreen onStartReport={() => setCurrentScreen("form")} />
				)}
				{currentScreen === "form" && (
					<ReportFormScreenV2
						onBack={() => setCurrentScreen("home")}
						onSuccess={handleSuccess}
					/>
				)}
				{currentScreen === "confirmation" && reportId && (
					<ConfirmationScreenV2
						reportId={reportId}
						onBackHome={handleBackHome}
					/>
				)}
			</main>
			<Toaster />
		</>
	)
}
