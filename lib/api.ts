// Axios instance configuration for API calls
import axios from 'axios';

export const api = axios.create({
	// Utiliser le proxy Next.js pour éviter les problèmes CORS
	baseURL: typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'),
	withCredentials: true, // Important: permet l'envoi des cookies
	headers: {
		'Content-Type': 'application/json',
	},
});

// Response interceptor for global error handling
api.interceptors.response.use(
	(response) => response,
	(error) => {
		// Ne rien faire sur 401, laisser les composants gérer la redirection
		return Promise.reject(error);
	}
);

export const API_URL = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');
