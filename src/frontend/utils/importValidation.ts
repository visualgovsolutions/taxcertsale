import { FieldMapping } from '../../api/importExportApi';

/**
 * Validates field mappings to ensure all required fields are mapped
 */
export const validateMappings = (
  mappings: FieldMapping[]
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check if all required fields are mapped
  const unmappedRequired = mappings.filter(
    (mapping) => mapping.required && !mapping.sourceField
  );
  
  if (unmappedRequired.length > 0) {
    errors.push(
      `Missing required field mappings: ${unmappedRequired
        .map((m) => m.targetField)
        .join(', ')}`
    );
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates a single value against its expected type
 */
export const validateFieldValue = (
  value: any,
  type: FieldMapping['type']
): { isValid: boolean; error?: string } => {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: 'Value is empty' };
  }
  
  switch (type) {
    case 'number':
      const num = Number(value);
      if (isNaN(num)) {
        return { isValid: false, error: 'Not a valid number' };
      }
      return { isValid: true };
      
    case 'date':
      // Try to parse the date
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return { isValid: false, error: 'Not a valid date format' };
      }
      return { isValid: true };
      
    case 'boolean':
      // Accept true, false, 'true', 'false', 0, 1, '0', '1'
      const validBooleans = [true, false, 'true', 'false', 0, 1, '0', '1'];
      if (!validBooleans.includes(value)) {
        return { isValid: false, error: 'Not a valid boolean value' };
      }
      return { isValid: true };
      
    case 'string':
    default:
      // Strings are generally valid
      return { isValid: true };
  }
};

/**
 * Transforms a value to the correct type based on field type
 */
export const transformValue = (
  value: any,
  type: FieldMapping['type']
): any => {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  
  switch (type) {
    case 'number':
      return Number(value);
      
    case 'date':
      return new Date(value).toISOString();
      
    case 'boolean':
      if (typeof value === 'boolean') return value;
      if (value === 1 || value === '1' || value === 'true') return true;
      if (value === 0 || value === '0' || value === 'false') return false;
      return Boolean(value);
      
    case 'string':
    default:
      return String(value);
  }
};

/**
 * Generates a sample row for a given set of field mappings
 */
export const generateSampleRow = (
  mappings: FieldMapping[]
): Record<string, any> => {
  const sample: Record<string, any> = {};
  
  mappings.forEach((mapping) => {
    if (!mapping.sourceField) return;
    
    switch (mapping.type) {
      case 'number':
        sample[mapping.targetField] = 123.45;
        break;
      case 'date':
        sample[mapping.targetField] = new Date().toISOString();
        break;
      case 'boolean':
        sample[mapping.targetField] = true;
        break;
      case 'string':
      default:
        sample[mapping.targetField] = `Sample ${mapping.targetField}`;
        break;
    }
  });
  
  return sample;
};

/**
 * Validates a complete row of data against the field mappings
 */
export const validateRow = (
  row: Record<string, any>,
  mappings: FieldMapping[]
): { isValid: boolean; errors: { field: string; message: string }[] } => {
  const errors: { field: string; message: string }[] = [];
  
  mappings.forEach((mapping) => {
    // Skip if not mapped
    if (!mapping.sourceField) return;
    
    const value = row[mapping.sourceField];
    
    // Check if required field is missing
    if (mapping.required && (value === null || value === undefined || value === '')) {
      errors.push({
        field: mapping.targetField,
        message: `Required field '${mapping.targetField}' is missing`
      });
      return;
    }
    
    // Skip validation if value is empty and field is not required
    if (value === null || value === undefined || value === '') return;
    
    // Validate type
    const validation = validateFieldValue(value, mapping.type);
    if (!validation.isValid && validation.error) {
      errors.push({
        field: mapping.targetField,
        message: `Field '${mapping.targetField}': ${validation.error}`
      });
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}; 