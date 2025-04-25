import { message } from 'antd';
import axios from 'axios';
import { API_BASE_URL } from '../config';

// Types for import/export functionality
export type EntityType = 'certificate' | 'property' | 'auction' | 'bidder' | 'user' | 'county' | 'transaction';
export type ExportFormat = 'csv' | 'xlsx' | 'json' | 'pdf';
export type ImportFormat = 'csv' | 'xlsx' | 'json';
export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type FrequencyType = 'daily' | 'weekly' | 'monthly' | 'quarterly';

export interface FieldMapping {
  id?: string;
  sourceField: string;
  targetField: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  fieldType?: 'string' | 'number' | 'date' | 'boolean';
  required: boolean;
  description?: string;
}

export interface ScheduledExportJob {
  id: string;
  name: string;
  entityType: EntityType;
  filters?: Record<string, any>;
  fields: string[];
  format: ExportFormat;
  schedule: {
    frequency: FrequencyType;
    dayOfWeek?: number; // 0-6, Sunday to Saturday
    dayOfMonth?: number; // 1-31
    hour: number; // 0-23
    minute: number;
  };
  options?: {
    includeHeader?: boolean;
    dateFormat?: string;
    fileName?: string;
  };
  emailRecipients?: string[];
  active: boolean;
  lastRun?: string;
  nextRun?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImportJob {
  id: string;
  entityType: EntityType;
  fileName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  totalRows: number;
  processedRows: number;
  errorRows: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  errorDetails?: string;
  mappings: FieldMapping[];
}

export interface ExportJob {
  id: string;
  entityType: EntityType;
  format: ExportFormat;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  errorDetails?: string;
  downloadUrl?: string;
  fileSize?: number;
  filters?: Record<string, any>;
  selectedFields?: string[];
}

export interface FieldMappingTemplate {
  entityType: EntityType;
  fields: FieldMapping[];
}

export interface ImportConfig {
  entityType: EntityType;
  filePath: string;
  fieldMappings: Record<string, string>;
  options?: {
    skipHeader?: boolean;
    updateExisting?: boolean;
    batchSize?: number;
  };
}

export interface ExportConfig {
  entityType: EntityType;
  filters?: Record<string, any>;
  fields: string[];
  format: 'csv' | 'xlsx' | 'json';
  options?: {
    includeHeader?: boolean;
    dateFormat?: string;
    fileName?: string;
  };
}

export interface ImportProgress {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  totalRecords: number;
  processedRecords: number;
  successCount: number;
  errorCount: number;
  warningCount: number;
  errors?: Array<{
    row: number;
    field: string;
    message: string;
  }>;
  warnings?: Array<{
    row: number;
    field: string;
    message: string;
  }>;
  startTime: string;
  endTime?: string;
}

export interface ExportProgress {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  totalRecords: number;
  processedRecords: number;
  startTime: string;
  endTime?: string;
  downloadUrl?: string;
}

// API endpoints
const IMPORT_EXPORT_API = {
  FIELD_MAPPINGS: `${API_BASE_URL}/api/import-export/field-mappings`,
  IMPORT: `${API_BASE_URL}/api/import-export/import`,
  IMPORT_PREVIEW: `${API_BASE_URL}/api/import-export/import-preview`,
  EXPORT: `${API_BASE_URL}/api/import-export/export`,
  SCHEDULED_JOBS: `${API_BASE_URL}/api/import-export/scheduled-jobs`,
  JOB_STATUS: `${API_BASE_URL}/api/import-export/jobs`,
  DOWNLOAD_TEMPLATE: `${API_BASE_URL}/api/import-export/templates`,
};

// Field mapping functions
export const getFieldMappings = async (entityType: EntityType): Promise<FieldMapping[]> => {
  try {
    const response = await axios.get(`${IMPORT_EXPORT_API.FIELD_MAPPINGS}/${entityType}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching field mappings:', error);
    throw error;
  }
};

// Import functions
export const uploadImportFile = async (
  file: File,
  entityType: EntityType,
  format: ImportFormat
): Promise<{ jobId: string; previewData: any[] }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('entityType', entityType);
    formData.append('format', format);

    const response = await axios.post(`${IMPORT_EXPORT_API.IMPORT_PREVIEW}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading import file:', error);
    throw error;
  }
};

export const startImportJob = async (
  jobId: string,
  mappings: FieldMapping[]
): Promise<{ jobId: string }> => {
  try {
    const response = await axios.post(`${IMPORT_EXPORT_API.IMPORT}`, {
      jobId,
      mappings,
    });

    return response.data;
  } catch (error) {
    console.error('Error starting import job:', error);
    throw error;
  }
};

export const getImportJobStatus = async (jobId: string): Promise<ImportJob> => {
  try {
    const response = await axios.get(`${IMPORT_EXPORT_API.JOB_STATUS}/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching import job status:', error);
    throw error;
  }
};

export const downloadImportTemplate = async (
  entityType: EntityType,
  format: ImportFormat = 'csv'
): Promise<Blob> => {
  try {
    const response = await axios.get(`${IMPORT_EXPORT_API.DOWNLOAD_TEMPLATE}/${entityType}`, {
      params: { format },
      responseType: 'blob',
    });

    return response.data;
  } catch (error) {
    console.error('Error downloading import template:', error);
    throw error;
  }
};

// Export functions
export const startExportJob = async (
  entityType: EntityType,
  format: ExportFormat,
  selectedFields?: string[],
  filters?: Record<string, any>
): Promise<{ jobId: string }> => {
  try {
    const response = await axios.post(`${IMPORT_EXPORT_API.EXPORT}`, {
      entityType,
      format,
      selectedFields,
      filters,
    });

    return response.data;
  } catch (error) {
    console.error('Error starting export job:', error);
    throw error;
  }
};

export const getExportJobStatus = async (jobId: string): Promise<ExportJob> => {
  try {
    const response = await axios.get(`${IMPORT_EXPORT_API.JOB_STATUS}/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching export job status:', error);
    throw error;
  }
};

export const downloadExportFile = async (downloadUrl: string): Promise<Blob> => {
  try {
    const response = await axios.get(downloadUrl, {
      responseType: 'blob',
    });

    return response.data;
  } catch (error) {
    console.error('Error downloading export file:', error);
    throw error;
  }
};

// Scheduled jobs functions
export const getScheduledJobs = async (): Promise<ScheduledExportJob[]> => {
  try {
    const response = await axios.get(IMPORT_EXPORT_API.SCHEDULED_JOBS);
    return response.data;
  } catch (error) {
    console.error('Error fetching scheduled jobs:', error);
    throw error;
  }
};

export const createScheduledJob = async (
  job: Omit<ScheduledExportJob, 'id' | 'lastRun' | 'nextRun' | 'createdAt' | 'updatedAt'>
): Promise<ScheduledExportJob> => {
  try {
    const response = await axios.post(IMPORT_EXPORT_API.SCHEDULED_JOBS, job);
    return response.data;
  } catch (error) {
    console.error('Error creating scheduled job:', error);
    throw error;
  }
};

export const updateScheduledJob = async (job: ScheduledExportJob): Promise<ScheduledExportJob> => {
  try {
    const response = await axios.put(`${IMPORT_EXPORT_API.SCHEDULED_JOBS}/${job.id}`, job);
    return response.data;
  } catch (error) {
    console.error('Error updating scheduled job:', error);
    throw error;
  }
};

export const deleteScheduledJob = async (jobId: string): Promise<void> => {
  try {
    await axios.delete(`${IMPORT_EXPORT_API.SCHEDULED_JOBS}/${jobId}`);
  } catch (error) {
    console.error('Error deleting scheduled job:', error);
    throw error;
  }
};

export const runScheduledJobNow = async (jobId: string): Promise<{ jobId: string }> => {
  try {
    const response = await axios.post(`${IMPORT_EXPORT_API.SCHEDULED_JOBS}/${jobId}/run`);
    return response.data;
  } catch (error) {
    console.error('Error running scheduled job:', error);
    throw error;
  }
};

export const toggleScheduledJobStatus = async (jobId: string, active: boolean): Promise<ScheduledExportJob> => {
  try {
    const response = await axios.put(`${IMPORT_EXPORT_API.SCHEDULED_JOBS}/${jobId}/status`, { active });
    return response.data;
  } catch (error) {
    console.error('Error toggling scheduled job status:', error);
    throw error;
  }
};

// Utility functions
export const getAvailableFields = async (entityType: EntityType): Promise<Record<string, string>> => {
  try {
    const response = await axios.get(`${IMPORT_EXPORT_API.FIELD_MAPPINGS}/${entityType}/available-fields`);
    return response.data;
  } catch (error) {
    console.error('Error fetching available fields:', error);
    throw error;
  }
};

export const validateImportData = async (
  jobId: string,
  mappings: FieldMapping[]
): Promise<{ valid: boolean; errors?: Record<number, string[]> }> => {
  try {
    const response = await axios.post(`${IMPORT_EXPORT_API.IMPORT_PREVIEW}/${jobId}/validate`, { mappings });
    return response.data;
  } catch (error) {
    console.error('Error validating import data:', error);
    throw error;
  }
};

/**
 * Start an import job with the specified configuration
 * @param config Import configuration with entity type, file path, and field mappings
 * @returns Promise with the job ID and initial progress
 */
export const startImport = async (config: ImportConfig): Promise<{ jobId: string, progress: ImportProgress }> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/import`, config);
    return response.data;
  } catch (error) {
    console.error('Import error:', error);
    message.error('Failed to start import process');
    throw error;
  }
};

/**
 * Start an export job with the specified configuration
 * @param config Export configuration with entity type, filters, fields, and format
 * @returns Promise with the job ID and initial progress
 */
export const startExport = async (config: ExportConfig): Promise<{ jobId: string, progress: ExportProgress }> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/export`, config);
    return response.data;
  } catch (error) {
    console.error('Export error:', error);
    message.error('Failed to start export process');
    throw error;
  }
};

/**
 * Get the current progress of an import job
 * @param jobId The ID of the import job
 * @returns Promise with the current progress
 */
export const getImportProgress = async (jobId: string): Promise<ImportProgress> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/import/${jobId}/progress`);
    return response.data;
  } catch (error) {
    console.error('Error fetching import progress:', error);
    message.error('Failed to get import progress');
    throw error;
  }
};

/**
 * Get the current progress of an export job
 * @param jobId The ID of the export job
 * @returns Promise with the current progress
 */
export const getExportProgress = async (jobId: string): Promise<ExportProgress> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/export/${jobId}/progress`);
    return response.data;
  } catch (error) {
    console.error('Error fetching export progress:', error);
    message.error('Failed to get export progress');
    throw error;
  }
};

/**
 * Cancel an ongoing import job
 * @param jobId The ID of the import job to cancel
 * @returns Promise with the final status of the job
 */
export const cancelImport = async (jobId: string): Promise<{ success: boolean, message: string }> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/import/${jobId}/cancel`);
    return response.data;
  } catch (error) {
    console.error('Error canceling import:', error);
    message.error('Failed to cancel import');
    throw error;
  }
};

/**
 * Cancel an ongoing export job
 * @param jobId The ID of the export job to cancel
 * @returns Promise with the final status of the job
 */
export const cancelExport = async (jobId: string): Promise<{ success: boolean, message: string }> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/export/${jobId}/cancel`);
    return response.data;
  } catch (error) {
    console.error('Error canceling export:', error);
    message.error('Failed to cancel export');
    throw error;
  }
};

/**
 * Create a new scheduled export job
 * @param job The scheduled export job configuration
 * @returns Promise with the created job
 */
export const createScheduledExport = async (job: Omit<ScheduledExportJob, 'id' | 'createdAt' | 'updatedAt' | 'lastRun' | 'nextRun'>): Promise<ScheduledExportJob> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/export/scheduled`, job);
    return response.data;
  } catch (error) {
    console.error('Error creating scheduled export:', error);
    message.error('Failed to create scheduled export');
    throw error;
  }
};

/**
 * Update an existing scheduled export job
 * @param id The ID of the scheduled export job
 * @param job The updated job configuration
 * @returns Promise with the updated job
 */
export const updateScheduledExport = async (id: string, job: Partial<Omit<ScheduledExportJob, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ScheduledExportJob> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/export/scheduled/${id}`, job);
    return response.data;
  } catch (error) {
    console.error('Error updating scheduled export:', error);
    message.error('Failed to update scheduled export');
    throw error;
  }
};

/**
 * Delete a scheduled export job
 * @param id The ID of the scheduled export job to delete
 * @returns Promise with success status
 */
export const deleteScheduledExport = async (id: string): Promise<{ success: boolean, message: string }> => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/export/scheduled/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting scheduled export:', error);
    message.error('Failed to delete scheduled export');
    throw error;
  }
};

/**
 * Get all scheduled export jobs
 * @returns Promise with an array of scheduled export jobs
 */
export const getScheduledExports = async (): Promise<ScheduledExportJob[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/export/scheduled`);
    return response.data;
  } catch (error) {
    console.error('Error fetching scheduled exports:', error);
    message.error('Failed to get scheduled exports');
    throw error;
  }
};

/**
 * Run a scheduled export job immediately
 * @param id The ID of the scheduled export job to run
 * @returns Promise with the job ID and initial progress
 */
export const runScheduledExport = async (id: string): Promise<{ jobId: string, progress: ExportProgress }> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/export/scheduled/${id}/run`);
    return response.data;
  } catch (error) {
    console.error('Error running scheduled export:', error);
    message.error('Failed to run scheduled export');
    throw error;
  }
};

/**
 * Get file upload status and progress
 * @param fileId The ID of the uploaded file
 * @returns Promise with upload status and progress
 */
export const getFileUploadStatus = async (fileId: string): Promise<{ 
  status: 'uploading' | 'processing' | 'completed' | 'failed',
  progress: number,
  filePath?: string,
  error?: string
}> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/files/${fileId}/status`);
    return response.data;
  } catch (error) {
    console.error('Error fetching file upload status:', error);
    message.error('Failed to get file upload status');
    throw error;
  }
};

/**
 * Get sample data for a specific file to help with mapping
 * @param fileId The ID of the uploaded file
 * @param options Options like number of rows to sample
 * @returns Promise with sample data and column headers
 */
export const getFileSampleData = async (fileId: string, options?: { 
  rowCount?: number, 
  hasHeader?: boolean 
}): Promise<{
  headers: string[],
  data: any[]
}> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/files/${fileId}/sample`, {
      params: options
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching file sample data:', error);
    message.error('Failed to get file sample data');
    throw error;
  }
};

/**
 * Generate a template file for a specific entity type
 * @param entityType The type of entity
 * @param format The file format
 * @returns Promise with download URL
 */
export const generateTemplate = async (entityType: EntityType, format: 'csv' | 'xlsx'): Promise<{ downloadUrl: string }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/templates/${entityType}`, {
      params: { format }
    });
    return response.data;
  } catch (error) {
    console.error('Error generating template:', error);
    message.error('Failed to generate template');
    throw error;
  }
}; 