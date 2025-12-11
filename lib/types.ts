// TypeScript types for API responses

// Auth Types
export interface Admin {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  createdAt: string;
  updatedAt?: string;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  position: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    admin: Admin;
    token: string;
  };
}

// Report Types
export interface Report {
  id: number;
  zone: string;
  customZone: string | null;
  incidentTime: string;
  category: string;
  severity: 'low' | 'medium' | 'high';
  anonymizedContent: string;
  attachments: string[];
  blockchainTxHash: string | null;
  status?: 'pending' | 'resolved';
  createdAt: string;
  resolvedBy?: number;
  resolvedAt?: string;
}

export interface ReportDetail extends Report {
  description: string;
  analysis: string;
  blockchain: {
    txHash: string;
    contentHash: string;
    blockNumber?: number;
    explorerUrl: string;
  };
}

export interface SubmitReportInput {
  zone: string;
  customZone?: string;
  incidentTime: string;
  description: string;
  attachments?: File[];
}

export interface Zone {
  value: string;
  label: string;
}

export interface VerifyResult {
  reportId: number;
  integrityValid: boolean;
  storedHash: string;
  calculatedHash: string;
  blockchainTxHash: string;
  explorerUrl: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
}

export interface ReportsListResponse {
  success: boolean;
  count: number;
  data: Report[];
}
