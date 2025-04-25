// API Configuration
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Authentication Configuration
export const AUTH_TOKEN_KEY = 'taxcertsale_auth_token';
export const AUTH_USER_KEY = 'taxcertsale_user';

// Application Configuration
export const APP_NAME = 'Tax Certificate Sale System';
export const DEFAULT_PAGE_SIZE = 10;

// Feature Flags
export const FEATURES = {
  REAL_TIME_NOTIFICATIONS: true,
  ADVANCED_FILTERING: true,
  SCHEDULED_EXPORTS: true,
};

// Date Format Configuration
export const DATE_FORMAT = 'MM/DD/YYYY';
export const DATETIME_FORMAT = 'MM/DD/YYYY hh:mm A';

// File Upload Configuration
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = ['.csv', '.xlsx', '.xls'];

// WebSocket Configuration
export const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:3001/ws'; 