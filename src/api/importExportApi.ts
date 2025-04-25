import axios from 'axios';
import { API_URL } from '../config';

// --- General Types ---
export type EntityType = 'certificate' | 'property' | 'auction' | 'bidder' | 'user' | 'county' | 'transaction';
export type ExportFormat = 'csv' | 'xlsx' | 'json' | 'pdf';
export type ImportFormat = 'csv' | 'xlsx' | 'json';
export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type FrequencyType = 'daily' | 'weekly' | 'monthly' | 'quarterly';

// --- Field Mapping ---
export interface FieldMapping {
  sourceField: string; // Field name from the source file
  targetField: string; // Field name in the target system
  type: 'string' | 'number' | 'date' | 'boolean'; // Expected data type
  required: boolean; // Is this field required?
}

export interface FieldMappingResult {
  sourceField: string;
  targetField: string;
  valid: boolean;
  sampleValues: string[];
  issues?: string[];
  recommendations?: string[];
}

export interface FieldMappingValidationResponse {
  valid: boolean; // Overall validity of the mapping
  fieldResults: FieldMappingResult[];
  sampleData?: Record<string, any>[]; // Sample rows from the file
  errorMessage?: string; // General error message if validation failed
}

// --- Import ---
export interface ImportJobResponse {
  jobId: string;
  status: JobStatus;
  message?: string;
  fileName: string;
  entityType: EntityType;
  totalRecords?: number;
  createdAt: string;
}

export interface ImportProgressResponse {
  jobId: string;
  status: JobStatus;
  processedRecords: number;
  totalRecords: number;
  percentComplete: number;
  errors?: Array<{
    row: number;
    message: string;
    field?: string;
  }>;
  warnings?: Array<{
    row: number;
    message: string;
    field?: string;
  }>;
  message?: string;
  startTime?: string;
  endTime?: string;
}

export interface ImportPreviewResponse {
  jobId: string; // ID representing the uploaded file/preview context
  headers: string[]; // Detected headers from the file
  sampleRows: Record<string, any>[]; // Sample data rows
  estimatedRowCount: number;
}

// --- Export ---
export interface ExportJobResponse {
  jobId: string;
  status: JobStatus;
  message?: string;
  format: ExportFormat;
  entityType: EntityType;
  fileName?: string;
  createdAt: string;
}

export interface ExportProgressResponse {
  jobId: string;
  status: JobStatus;
  processedRecords: number;
  totalRecords: number;
  percentComplete: number;
  downloadUrl?: string;
  message?: string;
  startTime?: string;
  endTime?: string;
}

// --- Scheduled Export ---
export interface ScheduledExportJob {
  id: string;
  name: string;
  entityType: EntityType;
  format: ExportFormat;
  filters?: Record<string, any>; // Filters applied to the data
  selectedFields?: string[]; // Fields to include in the export
  schedule: {
    frequency: FrequencyType;
    dayOfWeek?: number; // 0-6 (Sun-Sat) for weekly
    dayOfMonth?: number; // 1-31 for monthly/quarterly
    time: string; // HH:mm format (24hr)
  };
  emailRecipients?: string[]; // List of email addresses to send the export to
  active: boolean;
  lastRun?: string; // ISO Date string
  nextRun?: string; // ISO Date string
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}

// API Client Setup
const apiClient = axios.create({
  baseURL: `${API_URL}/api/import-export`,
  // Add headers, interceptors etc. if needed
});

// API Client Methods
const importExportApi = {
  // --- Import Methods ---

  // Upload a file for import preview and validation
  uploadImportFile: async (
    file: File,
    entityType: EntityType
  ): Promise<ImportPreviewResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('entityType', entityType);

    const response = await apiClient.post<ImportPreviewResponse>('/import/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Validate field mappings against uploaded file data
  validateFieldMapping: async (
    jobId: string, // ID from uploadImportFile response
    mappings: FieldMapping[]
  ): Promise<FieldMappingValidationResponse> => {
    const response = await apiClient.post<FieldMappingValidationResponse>(`/import/${jobId}/validate-mapping`, { mappings });
    return response.data;
  },

  // Start the actual import process
  startImport: async (
    jobId: string, // ID from uploadImportFile response
    mappings: FieldMapping[],
    options?: { updateExisting?: boolean; skipHeader?: boolean }
  ): Promise<ImportJobResponse> => {
    const response = await apiClient.post<ImportJobResponse>(`/import/${jobId}/start`, { mappings, options });
    return response.data;
  },

  // Check the progress of an ongoing import job
  getImportProgress: async (jobId: string): Promise<ImportProgressResponse> => {
    const response = await apiClient.get<ImportProgressResponse>(`/import/progress/${jobId}`);
    return response.data;
  },

  // Cancel an ongoing import job
  cancelImport: async (jobId: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post(`/import/cancel/${jobId}`);
    return response.data;
  },

  // Download an import template file
  downloadImportTemplate: async (entityType: EntityType, format: ImportFormat): Promise<Blob> => {
    const response = await apiClient.get('/templates/import', {
      params: { entityType, format },
      responseType: 'blob',
    });
    return response.data;
  },

  // --- Export Methods ---

  // Start an export job
  startExport: async (
    entityType: EntityType,
    format: ExportFormat,
    filters: Record<string, any> = {},
    selectedFields: string[] = [],
    options?: { rowLimit?: number; includeHeaders?: boolean }
  ): Promise<ExportJobResponse> => {
    const response = await apiClient.post<ExportJobResponse>('/export/start', {
      entityType,
      format,
      filters,
      selectedFields,
      options,
    });
    return response.data;
  },

  // Check the progress of an ongoing export job
  getExportProgress: async (jobId: string): Promise<ExportProgressResponse> => {
    const response = await apiClient.get<ExportProgressResponse>(`/export/progress/${jobId}`);
    return response.data;
  },

  // Cancel an ongoing export job
  cancelExport: async (jobId: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post(`/export/cancel/${jobId}`);
    return response.data;
  },

  // Download the result of a completed export job
  downloadExportFile: async (jobId: string): Promise<Blob> => {
    // Note: The download URL might be provided in the progress response.
    // This is a fallback or direct download method.
    const response = await apiClient.get(`/export/download/${jobId}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // --- Scheduled Export Job Methods ---

  getScheduledExportJobs: async (): Promise<ScheduledExportJob[]> => {
    const response = await apiClient.get<ScheduledExportJob[]>('/scheduled-exports');
    return response.data;
  },

  createScheduledExportJob: async (
    jobData: Omit<ScheduledExportJob, 'id' | 'lastRun' | 'nextRun' | 'createdAt' | 'updatedAt'>
  ): Promise<ScheduledExportJob> => {
    const response = await apiClient.post<ScheduledExportJob>('/scheduled-exports', jobData);
    return response.data;
  },

  updateScheduledExportJob: async (
    jobId: string,
    jobData: Partial<Omit<ScheduledExportJob, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<ScheduledExportJob> => {
    const response = await apiClient.put<ScheduledExportJob>(`/scheduled-exports/${jobId}`, jobData);
    return response.data;
  },

  deleteScheduledExportJob: async (jobId: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/scheduled-exports/${jobId}`);
    return response.data;
  },

  toggleScheduledExportJobStatus: async (
    jobId: string,
    active: boolean
  ): Promise<ScheduledExportJob> => {
    const response = await apiClient.patch<ScheduledExportJob>(`/scheduled-exports/${jobId}/status`, { active });
    return response.data;
  },

  runScheduledExportJobNow: async (jobId: string): Promise<ExportJobResponse> => {
    // This will trigger an immediate run, returning the initial export job status
    const response = await apiClient.post<ExportJobResponse>(`/scheduled-exports/${jobId}/run`);
    return response.data;
  },

  // --- Utility Methods ---

  // Get available fields for a given entity (useful for mapping/export selection)
  getAvailableFields: async (entityType: EntityType): Promise<FieldMapping[]> => {
    const response = await apiClient.get<FieldMapping[]>('/fields', { params: { entityType } });
    return response.data;
  },
};

export { importExportApi }; 