"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Loader2 } from "lucide-react"
import { useLogin } from "@/hooks/use-auth"

export default function AdminLoginPage() {
	const router = useRouter()
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const loginMutation = useLogin()

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault()
		
		loginMutation.mutate({ email, password }, {
			onSuccess: () => {
				router.push("/admin/dashboard")
			},
		})
	}

	return (
		<div className="min-h-screen bg-background flex items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
						<Shield className="h-6 w-6 text-primary" />
					</div>
					<CardTitle className="text-2xl">Blackbox</CardTitle>
					<CardDescription>
						Connectez-vous pour accéder au tableau de bord
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleLogin} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="admin@airport.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								disabled={loginMutation.isPending}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Mot de passe</Label>
							<Input
								id="password"
								type="password"
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								disabled={loginMutation.isPending}
							/>
						</div>
						{loginMutation.isError && (
							<div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
								{(loginMutation.error as any)?.response?.data?.message || "Identifiants incorrects"}
							</div>
						)}
						<Button type="submit" className="w-full" disabled={loginMutation.isPending}>
							{loginMutation.isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Connexion...
								</>
							) : (
								"Se connecter"
							)}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
