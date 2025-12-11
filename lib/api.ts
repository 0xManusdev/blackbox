// Axios instance configuration for API calls
import axios from 'axios';

export const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Response interceptor for global error handling
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// Redirect to admin login on unauthorized (but not if already on login page)
			if (typeof window !== 'undefined' &&
				window.location.pathname !== '/admin' &&
				window.location.pathname.startsWith('/admin')) {
				window.location.href = '/admin';
			}
		}
		return Promise.reject(error);
	}
);


export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';