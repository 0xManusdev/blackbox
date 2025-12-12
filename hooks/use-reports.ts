// Reports hooks for public endpoints
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type {
	Zone,
	SubmitReportInput,
	ReportDetail,
	VerifyResult,
	ApiResponse,
} from '@/lib/types';

// Get available zones
// If the API call fails, an error will be thrown and can be handled by the UI.
export function useZones() {
	return useQuery({
		queryKey: ['zones'],
		queryFn: async () => {
			const response = await api.get<ApiResponse<Zone[]>>('/api/zones');
			return response.data.data;
		},
		staleTime: Infinity,
		retry: false, // Ne pas réessayer en cas d'échec
	});
}

// Submit a new report
export function useSubmitReport() {
	return useMutation({
		mutationFn: async (data: SubmitReportInput) => {
			const formData = new FormData();
			formData.append('zone', data.zone);
			if (data.customZone) {
				formData.append('customZone', data.customZone);
			}
			formData.append('incidentTime', data.incidentTime);
			formData.append('description', data.description);

			data.attachments?.forEach((file) => {
				formData.append('attachments', file);
			});

			const response = await api.post<ApiResponse<ReportDetail>>(
				'/api/reports',
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);
			return response.data.data;
		},
	});
}

// Get a single report by ID
export function useReport(id: number | string) {
	return useQuery({
		queryKey: ['report', id],
		queryFn: async () => {
			const response = await api.get<ApiResponse<ReportDetail>>(
				`/api/reports/${id}`
			);
			return response.data.data;
		},
		enabled: !!id,
	});
}

// Verify report integrity on blockchain
export function useVerifyReport(reportId: number | string) {
	return useQuery({
		queryKey: ['verify', reportId],
		queryFn: async () => {
			const response = await api.get<ApiResponse<VerifyResult>>(
				`/api/reports/${reportId}/verify`
			);
			return response.data.data;
		},
		enabled: !!reportId,
		staleTime: 30000,
	});
}

// Health check
export function useHealthCheck() {
	return useQuery({
		queryKey: ['health'],
		queryFn: async () => {
			const response = await api.get('/api/health');
			return response.data;
		},
		refetchInterval: 60000,
	});
}
