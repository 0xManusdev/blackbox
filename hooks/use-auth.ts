// Authentication hooks
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type {
	Admin,
	RegisterInput,
	LoginInput,
	LoginResponse,
	ApiResponse,
} from '@/lib/types';

// Register new admin
export function useRegister() {
	return useMutation({
		mutationFn: async (data: RegisterInput) => {
			const response = await api.post<ApiResponse<Admin>>(
				'/api/auth/register',
				data
			);
			return response.data;
		},
	});
}

// Login admin
export function useLogin() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (credentials: LoginInput) => {
			const response = await api.post<LoginResponse>(
				'/api/auth/login',
				credentials
			);
			return response.data;
		},
		onSuccess: async (data) => {
			// Set the user data immediately in cache
			queryClient.setQueryData(['currentUser'], data.data.admin);
			// Refetch to ensure we have the latest data from server with proper cookies
			await queryClient.refetchQueries({ queryKey: ['currentUser'] });
		},
	});
}

// Get current authenticated admin
export function useCurrentUser() {
	return useQuery({
		queryKey: ['currentUser'],
		queryFn: async () => {
			const response = await api.get<ApiResponse<Admin>>('/api/auth/me');
			return response.data.data;
		},
		retry: 1,
		retryDelay: 500,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
}

// Check if user is authenticated
export function useIsAuthenticated() {
	const { data, isLoading } = useCurrentUser();
	return {
		isAuthenticated: !!data,
		isLoading,
		user: data,
	};
}

// Logout admin
export function useLogout() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const response = await api.post('/api/auth/logout');
			return response.data;
		},
		onSuccess: () => {
			queryClient.clear();
		},
	});
}
