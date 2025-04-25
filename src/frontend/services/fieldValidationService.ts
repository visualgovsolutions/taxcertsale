import { EntityType } from './importExportService';

export interface ValidationError {
  field: string;
  message: string;
  severity: 'warning' | 'error';
}

export interface DataTypeValidation {
  type: 'string' | 'number' | 'date' | 'boolean' | 'email' | 'phone' | 'address';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  pattern?: RegExp;
  allowedValues?: string[];
}

export interface FieldDefinition {
  name: string;
  displayName: string;
  validation: DataTypeValidation;
  description?: string;
}

// Field definitions by entity type
const fieldDefinitions: Record<EntityType, FieldDefinition[]> = {
  'certificate': [
    {
      name: 'certificateNumber',
      displayName: 'Certificate Number',
      validation: { type: 'string', required: true, minLength: 1, maxLength: 50 },
      description: 'Unique identifier for the certificate'
    },
    {
      name: 'propertyAddress',
      displayName: 'Property Address',
      validation: { type: 'address', required: true },
      description: 'Physical address of the property'
    },
    {
      name: 'faceValue',
      displayName: 'Face Value',
      validation: { type: 'number', required: true, minValue: 0 },
      description: 'Original face value of the certificate'
    },
    {
      name: 'interestRate',
      displayName: 'Interest Rate',
      validation: { type: 'number', required: true, minValue: 0, maxValue: 100 },
      description: 'Annual interest rate as a percentage'
    },
    {
      name: 'issueDate',
      displayName: 'Issue Date',
      validation: { type: 'date', required: true },
      description: 'Date when the certificate was issued'
    },
    {
      name: 'status',
      displayName: 'Status',
      validation: { 
        type: 'string', 
        required: true, 
        allowedValues: ['available', 'assigned', 'sold', 'redeemed', 'expired'] 
      },
      description: 'Current status of the certificate'
    }
  ],
  'property': [
    {
      name: 'parcelId',
      displayName: 'Parcel ID',
      validation: { type: 'string', required: true, minLength: 1, maxLength: 50 },
      description: 'Unique identifier for the property parcel'
    },
    {
      name: 'address',
      displayName: 'Address',
      validation: { type: 'address', required: true },
      description: 'Physical address of the property'
    },
    {
      name: 'ownerName',
      displayName: 'Owner Name',
      validation: { type: 'string', required: true },
      description: 'Name of the property owner'
    },
    {
      name: 'marketValue',
      displayName: 'Market Value',
      validation: { type: 'number', required: true, minValue: 0 },
      description: 'Current market value of the property'
    },
    {
      name: 'taxYear',
      displayName: 'Tax Year',
      validation: { type: 'number', required: true, minValue: 1900 },
      description: 'Year for which taxes are being assessed'
    }
  ],
  'auction': [
    {
      name: 'auctionName',
      displayName: 'Auction Name',
      validation: { type: 'string', required: true, minLength: 1, maxLength: 100 },
      description: 'Name of the auction event'
    },
    {
      name: 'startDate',
      displayName: 'Start Date',
      validation: { type: 'date', required: true },
      description: 'Start date and time of the auction'
    },
    {
      name: 'endDate',
      displayName: 'End Date',
      validation: { type: 'date', required: true },
      description: 'End date and time of the auction'
    },
    {
      name: 'location',
      displayName: 'Location',
      validation: { type: 'string' },
      description: 'Physical location of the auction, if applicable'
    },
    {
      name: 'description',
      displayName: 'Description',
      validation: { type: 'string', maxLength: 500 },
      description: 'Detailed description of the auction'
    }
  ],
  'bidder': [
    {
      name: 'bidderName',
      displayName: 'Bidder Name',
      validation: { type: 'string', required: true },
      description: 'Full name of the bidder'
    },
    {
      name: 'email',
      displayName: 'Email',
      validation: { type: 'email', required: true },
      description: 'Email address for communications'
    },
    {
      name: 'phone',
      displayName: 'Phone',
      validation: { type: 'phone' },
      description: 'Contact phone number'
    },
    {
      name: 'registrationDate',
      displayName: 'Registration Date',
      validation: { type: 'date', required: true },
      description: 'Date when the bidder registered'
    },
    {
      name: 'status',
      displayName: 'Status',
      validation: { 
        type: 'string', 
        required: true, 
        allowedValues: ['active', 'suspended', 'pending'] 
      },
      description: 'Current status of the bidder'
    }
  ]
};

/**
 * Validates field mappings for a specific entity type
 * @param entityType The type of entity (certificate, property, etc.)
 * @param sourceFields The source fields from the import file
 * @param mappings The mappings from source fields to destination fields
 * @returns Array of validation errors or warnings
 */
export const validateFieldMappings = (
  entityType: EntityType,
  sourceFields: string[],
  mappings: Record<string, string>
): ValidationError[] => {
  const errors: ValidationError[] = [];
  const definitions = fieldDefinitions[entityType];
  
  // Check if required fields are mapped
  const mappedFields = Object.values(mappings);
  definitions.forEach(def => {
    if (def.validation.required && !mappedFields.includes(def.name)) {
      errors.push({
        field: def.name,
        message: `Required field "${def.displayName}" is not mapped.`,
        severity: 'error'
      });
    }
  });
  
  // Check for duplicate mappings
  const uniqueMappedFields = new Set(mappedFields.filter(field => field !== ''));
  if (uniqueMappedFields.size !== mappedFields.filter(field => field !== '').length) {
    errors.push({
      field: 'general',
      message: 'Multiple source fields are mapped to the same destination field.',
      severity: 'error'
    });
  }
  
  // Check for unmapped source fields
  sourceFields.forEach(sourceField => {
    if (!Object.keys(mappings).includes(sourceField)) {
      errors.push({
        field: sourceField,
        message: `Source field "${sourceField}" is not mapped.`,
        severity: 'warning'
      });
    }
  });
  
  return errors;
};

/**
 * Validates a single data value against field definition
 * @param fieldName The name of the field
 * @param value The value to validate
 * @param entityType The type of entity the field belongs to
 * @returns Validation error or null if valid
 */
export const validateFieldValue = (
  fieldName: string,
  value: any,
  entityType: EntityType
): ValidationError | null => {
  const fieldDef = fieldDefinitions[entityType].find(def => def.name === fieldName);
  
  if (!fieldDef) {
    return {
      field: fieldName,
      message: `Unknown field "${fieldName}".`,
      severity: 'error'
    };
  }
  
  const validation = fieldDef.validation;
  
  // Check required
  if (validation.required && (value === undefined || value === null || value === '')) {
    return {
      field: fieldName,
      message: `${fieldDef.displayName} is required.`,
      severity: 'error'
    };
  }
  
  // Skip further validation if value is empty and not required
  if (value === undefined || value === null || value === '') {
    return null;
  }
  
  // Type validation
  switch (validation.type) {
    case 'number':
      if (isNaN(Number(value))) {
        return {
          field: fieldName,
          message: `${fieldDef.displayName} must be a number.`,
          severity: 'error'
        };
      }
      
      const numValue = Number(value);
      if (validation.minValue !== undefined && numValue < validation.minValue) {
        return {
          field: fieldName,
          message: `${fieldDef.displayName} must be at least ${validation.minValue}.`,
          severity: 'error'
        };
      }
      
      if (validation.maxValue !== undefined && numValue > validation.maxValue) {
        return {
          field: fieldName,
          message: `${fieldDef.displayName} must be at most ${validation.maxValue}.`,
          severity: 'error'
        };
      }
      break;
      
    case 'string':
      if (typeof value !== 'string') {
        return {
          field: fieldName,
          message: `${fieldDef.displayName} must be a text value.`,
          severity: 'error'
        };
      }
      
      if (validation.minLength !== undefined && value.length < validation.minLength) {
        return {
          field: fieldName,
          message: `${fieldDef.displayName} must be at least ${validation.minLength} characters.`,
          severity: 'error'
        };
      }
      
      if (validation.maxLength !== undefined && value.length > validation.maxLength) {
        return {
          field: fieldName,
          message: `${fieldDef.displayName} must be at most ${validation.maxLength} characters.`,
          severity: 'error'
        };
      }
      
      if (validation.pattern && !validation.pattern.test(value)) {
        return {
          field: fieldName,
          message: `${fieldDef.displayName} has an invalid format.`,
          severity: 'error'
        };
      }
      
      if (validation.allowedValues && !validation.allowedValues.includes(value)) {
        return {
          field: fieldName,
          message: `${fieldDef.displayName} must be one of: ${validation.allowedValues.join(', ')}.`,
          severity: 'error'
        };
      }
      break;
      
    case 'date':
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return {
          field: fieldName,
          message: `${fieldDef.displayName} must be a valid date.`,
          severity: 'error'
        };
      }
      break;
      
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(String(value))) {
        return {
          field: fieldName,
          message: `${fieldDef.displayName} must be a valid email address.`,
          severity: 'error'
        };
      }
      break;
      
    case 'phone':
      const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
      if (!phoneRegex.test(String(value))) {
        return {
          field: fieldName,
          message: `${fieldDef.displayName} must be a valid phone number.`,
          severity: 'warning'
        };
      }
      break;
  }
  
  return null;
};

/**
 * Validates a complete row of data against field definitions
 * @param rowData Object containing field values
 * @param entityType The type of entity
 * @returns Array of validation errors
 */
export const validateRow = (
  rowData: Record<string, any>,
  entityType: EntityType
): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  fieldDefinitions[entityType].forEach(fieldDef => {
    const error = validateFieldValue(fieldDef.name, rowData[fieldDef.name], entityType);
    if (error) {
      errors.push(error);
    }
  });
  
  return errors;
};

/**
 * Gets all available fields for a specific entity type
 * @param entityType The type of entity
 * @returns Array of field definitions with names and display names
 */
export const getAvailableFields = (entityType: EntityType): FieldDefinition[] => {
  return fieldDefinitions[entityType] || [];
};

/**
 * Generates a sample template for a specific entity type
 * @param entityType The type of entity
 * @returns Object with field names as keys and example values
 */
export const generateSampleData = (entityType: EntityType): Record<string, any> => {
  const sample: Record<string, any> = {};
  
  fieldDefinitions[entityType].forEach(fieldDef => {
    switch (fieldDef.validation.type) {
      case 'string':
        if (fieldDef.validation.allowedValues && fieldDef.validation.allowedValues.length > 0) {
          sample[fieldDef.name] = fieldDef.validation.allowedValues[0];
        } else {
          sample[fieldDef.name] = `Sample ${fieldDef.displayName}`;
        }
        break;
      case 'number':
        sample[fieldDef.name] = fieldDef.validation.minValue || 0;
        break;
      case 'date':
        sample[fieldDef.name] = new Date().toISOString().split('T')[0];
        break;
      case 'boolean':
        sample[fieldDef.name] = false;
        break;
      case 'email':
        sample[fieldDef.name] = 'example@example.com';
        break;
      case 'phone':
        sample[fieldDef.name] = '(555) 555-5555';
        break;
      case 'address':
        sample[fieldDef.name] = '123 Main St, Anytown, ST 12345';
        break;
      default:
        sample[fieldDef.name] = '';
    }
  });
  
  return sample;
}; 