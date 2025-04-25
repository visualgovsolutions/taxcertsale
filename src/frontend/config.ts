// API configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

// Authentication settings
export const AUTH_TOKEN_KEY = "auth_token";
export const USER_INFO_KEY = "user_info";

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_NUMBER = 1;

// Date format
export const DATE_FORMAT = "MM/DD/YYYY";
export const DATETIME_FORMAT = "MM/DD/YYYY HH:mm:ss";

// Application settings
export const APP_NAME = "Tax Certificate Sale System";
export const APP_VERSION = "1.0.0";

// File upload limits
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [".csv", ".xlsx", ".xls"];

// Timeout settings
export const API_TIMEOUT = 30000; // 30 seconds

// Cache settings
export const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

// Error messages
export const ERROR_MESSAGES = {
  GENERIC: "An error occurred. Please try again.",
  NETWORK: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION: "Please check your input and try again.",
};

// Success messages
export const SUCCESS_MESSAGES = {
  GENERIC: "Operation completed successfully.",
  SAVE: "Data saved successfully.",
  UPDATE: "Data updated successfully.",
  DELETE: "Data deleted successfully.",
  IMPORT: "Data imported successfully.",
  EXPORT: "Data exported successfully.",
};

// Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  PROPERTIES: "/properties",
  CERTIFICATES: "/certificates",
  USERS: "/users",
  SETTINGS: "/settings",
  REPORTS: "/reports",
  IMPORT: "/import",
  EXPORT: "/export",
};

// Application-wide configuration
export const APP_CONFIG = {
  // Pagination defaults
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  
  // Date format for display
  DATE_FORMAT: 'MM/DD/YYYY',
  DATE_TIME_FORMAT: 'MM/DD/YYYY HH:mm',
  
  // File upload limits
  MAX_FILE_SIZE_MB: 10,
  ALLOWED_IMPORT_FORMATS: ['csv', 'xlsx', 'json'],
  
  // Timeout configurations
  API_TIMEOUT_MS: 30000,
  REFRESH_INTERVAL_MS: 5000,
};

// Feature flags
export const FEATURES = {
  ENABLE_REAL_TIME_UPDATES: true,
  ENABLE_FIELD_VALIDATION: true,
  ENABLE_EXPORT_SCHEDULING: true,
};

// Export settings
export const EXPORT_FORMATS = [
  { label: 'CSV', value: 'csv' },
  { label: 'Excel', value: 'xlsx' },
  { label: 'JSON', value: 'json' }
];

// Entity display names
export const ENTITY_DISPLAY_NAMES = {
  certificate: 'Tax Certificate',
  property: 'Property',
  auction: 'Auction',
  bidder: 'Bidder'
}; 