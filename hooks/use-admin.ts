// Admin-only hooks for protected endpoints
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Report, ReportsListResponse, ApiResponse } from '@/lib/types';

// Get all reports (admin only)
export function useAllReports() {
	return useQuery({
		queryKey: ['reports', 'all'],
		queryFn: async () => {
			const response = await api.get<ReportsListResponse>('/api/reports');
			return response.data;
		},
		refetchInterval: 5000, // Rafraîchir toutes les 5 secondes pour temps réel
		refetchOnWindowFocus: true, // Rafraîchir quand on revient sur la page
		refetchOnMount: true, // Rafraîchir au montage
	});
}

// Mark a report as resolved
export function useResolveReport() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (reportId: number) => {
			const response = await api.put<
				ApiResponse<{
					id: number;
					status: string;
					resolvedBy: number;
					resolvedAt: string;
				}>
			>(`/api/reports/${reportId}/resolve`);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['reports'] });
		},
	});
}

// Delete a report
export function useDeleteReport() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (reportId: number) => {
			const response = await api.delete<
				ApiResponse<{
					id: number;
					deletedBy: number;
					deletedAt: string;
				}>
			>(`/api/reports/${reportId}`);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['reports'] });
		},
	});
}

// Get audit logs (admin only)
export interface AuditLog {
	id: number;
	action: string;
	method: string;
	endpoint: string;
	params: Record<string, any>;
	ipAddress: string;
	userAgent: string;
	createdAt: string;
	admin: {
		id: number;
		firstName: string;
		lastName: string;
		email: string;
		position: string;
	};
}

interface AuditLogsResponse {
	success: boolean;
	data: AuditLog[];
	pagination: {
		page: number;
		perPage: number;
		total: number;
		totalPages: number;
	};
}

export function useAuditLogs(page: number = 1, perPage: number = 50) {
	return useQuery({
		queryKey: ['auditLogs', page, perPage],
		queryFn: async () => {
			const response = await api.get<AuditLogsResponse>(
				`/api/admin/logs?page=${page}&perPage=${perPage}`
			);
			return response.data;
		},
	});
}
