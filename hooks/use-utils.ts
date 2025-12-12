// Utility hooks for common operations
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Prefetch data for better UX
export function usePrefetchReports() {
	return useQuery({
		queryKey: ['reports', 'prefetch'],
		queryFn: async () => {
			const response = await api.get('/api/reports');
			return response.data;
		},
		staleTime: 60000,
		enabled: false, // Manual trigger only
	});
}

// Custom hook to check API health
export function useApiStatus() {
	return useQuery({
		queryKey: ['api', 'status'],
		queryFn: async () => {
			try {
				const response = await api.get('/api/health');
				return { online: true, data: response.data };
			} catch (error) {
				return { online: false, error };
			}
		},
		refetchInterval: 60000,
		retry: 3,
	});
}

// Hook for optimistic updates
export function useOptimisticReport() {
	return {
		onMutate: async (newReport: any) => {
			// Cancel outgoing queries
			// Snapshot previous value
			// Optimistically update
			return { previousReports: [] };
		},
		onError: (err: any, newReport: any, context: any) => {
			// Rollback on error
		},
		onSettled: () => {
			// Refetch after mutation
		},
	};
}
