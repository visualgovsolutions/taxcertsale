import React, { useState, useCallback, useEffect } from 'react';
import { Button, Card, Label, Select, Alert, Progress, Spinner } from 'flowbite-react';
import { HiDocumentDownload, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';

import FileUploader from '../../common/FileUploader';
import FieldMappingValidation from './FieldMappingValidation';
import {
  EntityType,
  FieldMapping,
  validateImportData,
  uploadImportFile,
  downloadImportTemplate,
  startImport
} from '../../../services/importExportService';
import useJobProgress, { JobStatus } from '../../../hooks/useJobProgress';
import { validateMappings } from '../../../utils/importValidation';

// Import steps
type ImportStep = 'select-type' | 'upload-file' | 'map-fields' | 'review' | 'import' | 'results';

interface FieldMappingValidationResponse {
  valid: boolean;
  fieldResults: Array<{
    sourceField: string;
    targetField: string;
    valid: boolean;
    sampleValues: string[];
    issues?: string[];
    recommendations?: string[];
  }>;
  sampleData?: Record<string, any>[];
  errorMessage?: string;
}

const DataImportWizard: React.FC = () => {
  // State
  const [currentStep, setCurrentStep] = useState<ImportStep>('select-type');
  const [selectedEntityType, setSelectedEntityType] = useState<EntityType | ''>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileId, setFileId] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [availableSourceFields, setAvailableSourceFields] = useState<string[]>([]);
  const [targetEntityFields, setTargetEntityFields] = useState<FieldMapping[]>([]);
  const [validationResults, setValidationResults] = useState<FieldMappingValidationResponse | null>(null);
  const [validating, setValidating] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [importJobId, setImportJobId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { 
    jobStatus,
  } = useJobProgress({
    jobId: importJobId,
    endpoint: '/api/import-export/import/progress',
    useWebSocket: true,
    onComplete: (/* result */) => {
      setCurrentStep('results');
    },
    onError: (error: string) => {
      setErrorMessage(`Import failed: ${error}`);
      setCurrentStep('results');
    }
  });

  useEffect(() => {
    if (jobStatus && currentStep === 'import') {
      setUploadProgress(jobStatus.progress);
    }
  }, [jobStatus, currentStep]);

  // Get target fields based on selected entity type
  const getTargetFields = (entityType: EntityType): FieldMapping[] => {
    switch (entityType) {
      case 'certificate':
        return [
          { id: 'id', sourceField: '', targetField: 'id', type: 'string', fieldType: 'string', required: true, description: 'Unique identifier' },
          { id: 'parcelId', sourceField: '', targetField: 'parcelId', type: 'string', fieldType: 'string', required: true, description: 'Parcel identifier' },
          { id: 'propertyAddress', sourceField: '', targetField: 'propertyAddress', type: 'string', fieldType: 'string', required: true, description: 'Property address' },
          { id: 'ownerName', sourceField: '', targetField: 'ownerName', type: 'string', fieldType: 'string', required: true, description: 'Owner name' },
          { id: 'faceValue', sourceField: '', targetField: 'faceValue', type: 'number', fieldType: 'number', required: true, description: 'Face value' },
          { id: 'interestRate', sourceField: '', targetField: 'interestRate', type: 'number', fieldType: 'number', required: true, description: 'Interest rate' },
          { id: 'issueDate', sourceField: '', targetField: 'issueDate', type: 'date', fieldType: 'date', required: false, description: 'Issue date' },
          { id: 'status', sourceField: '', targetField: 'status', type: 'string', fieldType: 'string', required: true, description: 'Status' },
          { id: 'redemptionAmount', sourceField: '', targetField: 'redemptionAmount', type: 'number', fieldType: 'number', required: false, description: 'Redemption amount' },
          { id: 'redemptionDate', sourceField: '', targetField: 'redemptionDate', type: 'date', fieldType: 'date', required: false, description: 'Redemption date' },
          { id: 'countyId', sourceField: '', targetField: 'countyId', type: 'string', fieldType: 'string', required: true, description: 'County ID' },
        ];
      case 'property':
        return [
          { id: 'id', sourceField: '', targetField: 'id', type: 'string', fieldType: 'string', required: true, description: 'Unique identifier' },
          { id: 'parcelId', sourceField: '', targetField: 'parcelId', type: 'string', fieldType: 'string', required: true, description: 'Parcel identifier' },
          { id: 'address', sourceField: '', targetField: 'address', type: 'string', fieldType: 'string', required: true, description: 'Property address' },
          { id: 'city', sourceField: '', targetField: 'city', type: 'string', fieldType: 'string', required: true, description: 'City' },
          { id: 'state', sourceField: '', targetField: 'state', type: 'string', fieldType: 'string', required: true, description: 'State' },
          { id: 'zip', sourceField: '', targetField: 'zip', type: 'string', fieldType: 'string', required: true, description: 'ZIP code' },
          { id: 'latitude', sourceField: '', targetField: 'latitude', type: 'number', fieldType: 'number', required: false, description: 'Latitude' },
          { id: 'longitude', sourceField: '', targetField: 'longitude', type: 'number', fieldType: 'number', required: false, description: 'Longitude' },
          { id: 'acreage', sourceField: '', targetField: 'acreage', type: 'number', fieldType: 'number', required: false, description: 'Acreage' },
          { id: 'propertyType', sourceField: '', targetField: 'propertyType', type: 'string', fieldType: 'string', required: true, description: 'Property type' },
          { id: 'countyId', sourceField: '', targetField: 'countyId', type: 'string', fieldType: 'string', required: true, description: 'County ID' },
        ];
      case 'county':
        return [
          { id: 'id', sourceField: '', targetField: 'id', type: 'string', fieldType: 'string', required: true, description: 'Unique identifier' },
          { id: 'name', sourceField: '', targetField: 'name', type: 'string', fieldType: 'string', required: true, description: 'County name' },
          { id: 'state', sourceField: '', targetField: 'state', type: 'string', fieldType: 'string', required: true, description: 'State' },
          { id: 'code', sourceField: '', targetField: 'code', type: 'string', fieldType: 'string', required: true, description: 'County code' },
          { id: 'contactEmail', sourceField: '', targetField: 'contactEmail', type: 'string', fieldType: 'string', required: false, description: 'Contact email' },
          { id: 'contactPhone', sourceField: '', targetField: 'contactPhone', type: 'string', fieldType: 'string', required: false, description: 'Contact phone' },
          { id: 'websiteUrl', sourceField: '', targetField: 'websiteUrl', type: 'string', fieldType: 'string', required: false, description: 'Website URL' },
        ];
      case 'auction':
        return [
          { id: 'id', sourceField: '', targetField: 'id', type: 'string', fieldType: 'string', required: true, description: 'Unique identifier' },
          { id: 'title', sourceField: '', targetField: 'title', type: 'string', fieldType: 'string', required: true, description: 'Auction title' },
          { id: 'description', sourceField: '', targetField: 'description', type: 'string', fieldType: 'string', required: false, description: 'Description' },
          { id: 'startDate', sourceField: '', targetField: 'startDate', type: 'date', fieldType: 'date', required: true, description: 'Start date' },
          { id: 'endDate', sourceField: '', targetField: 'endDate', type: 'date', fieldType: 'date', required: true, description: 'End date' },
          { id: 'countyId', sourceField: '', targetField: 'countyId', type: 'string', fieldType: 'string', required: true, description: 'County ID' },
          { id: 'minBidAmount', sourceField: '', targetField: 'minBidAmount', type: 'number', fieldType: 'number', required: false, description: 'Minimum bid amount' },
          { id: 'status', sourceField: '', targetField: 'status', type: 'string', fieldType: 'string', required: true, description: 'Status' },
        ];
      case 'user':
        return [
          { id: 'id', sourceField: '', targetField: 'id', type: 'string', fieldType: 'string', required: true, description: 'Unique identifier' },
          { id: 'firstName', sourceField: '', targetField: 'firstName', type: 'string', fieldType: 'string', required: true, description: 'First name' },
          { id: 'lastName', sourceField: '', targetField: 'lastName', type: 'string', fieldType: 'string', required: true, description: 'Last name' },
          { id: 'email', sourceField: '', targetField: 'email', type: 'string', fieldType: 'string', required: true, description: 'Email address' },
          { id: 'role', sourceField: '', targetField: 'role', type: 'string', fieldType: 'string', required: true, description: 'User role' },
          { id: 'status', sourceField: '', targetField: 'status', type: 'string', fieldType: 'string', required: true, description: 'Status' },
          { id: 'createdAt', sourceField: '', targetField: 'createdAt', type: 'date', fieldType: 'date', required: false, description: 'Creation date' },
        ];
      case 'bidder':
        return [];
      case 'transaction':
        return [
          { id: 'id', sourceField: '', targetField: 'id', type: 'string', fieldType: 'string', required: true, description: 'Unique identifier' },
          { id: 'userId', sourceField: '', targetField: 'userId', type: 'string', fieldType: 'string', required: true, description: 'User ID' },
          { id: 'type', sourceField: '', targetField: 'type', type: 'string', fieldType: 'string', required: true, description: 'Transaction type' },
          { id: 'amount', sourceField: '', targetField: 'amount', type: 'number', fieldType: 'number', required: true, description: 'Amount' },
          { id: 'status', sourceField: '', targetField: 'status', type: 'string', fieldType: 'string', required: true, description: 'Status' },
          { id: 'relatedEntityId', sourceField: '', targetField: 'relatedEntityId', type: 'string', fieldType: 'string', required: false, description: 'Related entity ID' },
          { id: 'relatedEntityType', sourceField: '', targetField: 'relatedEntityType', type: 'string', fieldType: 'string', required: false, description: 'Related entity type' },
          { id: 'paymentMethod', sourceField: '', targetField: 'paymentMethod', type: 'string', fieldType: 'string', required: false, description: 'Payment method' },
          { id: 'transactionDate', sourceField: '', targetField: 'transactionDate', type: 'date', fieldType: 'date', required: true, description: 'Transaction date' },
        ];
      default:
        return [];
    }
  };

  // Handle entity type selection
  const handleEntityTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as EntityType | '';
    setSelectedEntityType(type);
    
    if (type) {
      setTargetEntityFields(getTargetFields(type as EntityType));
    } else {
      setTargetEntityFields([]);
    }
    
    setFieldMappings([]);
    setAvailableSourceFields([]);
    setValidationErrors([]);
    setErrorMessage(null);
    setValidationResults(null);
  };

  // Handle file upload
  const handleFileUpload = useCallback(async (file: File) => {
    if (!selectedEntityType) {
      setErrorMessage('Please select an entity type first');
      return;
    }
    
    try {
      setSelectedFile(file);
      setUploading(true);
      setUploadProgress(0);
      setErrorMessage(null);
      setValidationResults(null);

      const response = await uploadImportFile(file, selectedEntityType, 'csv');
      setFileId(response.jobId);
      
      if (response.previewData && Array.isArray(response.previewData) && response.previewData.length > 0) {
        const headers = Object.keys(response.previewData[0]);
        setAvailableSourceFields(headers);
        
        const fetchedTargetFields = getTargetFields(selectedEntityType as EntityType);
        const newMappings = fetchedTargetFields.map(field => {
          const sourceField = headers.find((sf: string) => 
            sf.toLowerCase().replace(/[^a-z0-9]/gi, '') === field.targetField.toLowerCase().replace(/[^a-z0-9]/gi, '')
          ) || '';
          return { ...field, sourceField };
        });
        setFieldMappings(newMappings);
      }

      setUploading(false);
      setUploadProgress(100);
      setCurrentStep('map-fields');
    } catch (error: any) {
      setErrorMessage(`Error uploading file: ${error?.message || 'Please try again.'}`);
      setUploading(false);
      setUploadProgress(0);
      setSelectedFile(null);
      setFileId('');
      setValidationResults(null);
      console.error('Upload error:', error);
    }
  }, [selectedEntityType]);

  // Handle file upload error
  const handleFileError = (error: string) => {
    setErrorMessage(error);
    setSelectedFile(null);
  };

  // Update field mapping
  const updateFieldMapping = (targetField: string, sourceField: string) => {
    const updatedMappings = fieldMappings.map(mapping => {
      if (mapping.targetField === targetField) {
        return { ...mapping, sourceField };
      }
      return mapping;
    });
    setFieldMappings(updatedMappings);
    
    // Clear validation errors/results when mappings change manually
    setValidationErrors([]);
    setValidationResults(null);
    setErrorMessage(null);
  };

  // Download template
  const downloadTemplate = async () => {
    if (!selectedEntityType) {
      setErrorMessage('Please select an entity type first');
      return;
    }
    
    try {
      setErrorMessage(null);
      const blob = await downloadImportTemplate(selectedEntityType as EntityType, 'csv');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedEntityType}_template.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      setErrorMessage(`Error downloading template: ${error?.response?.data?.message || error.message || 'Please try again.'}`);
      console.error('Template download error:', error);
    }
  };

  // Validate mappings using API
  const validateMappingsAndProceed = async () => {
    // Clear previous messages
    setErrorMessage(null);
    setValidationErrors([]);
    setValidationResults(null);
    
    // Basic client-side check (optional, but good UX)
    const clientValidation = validateMappings(fieldMappings);
    if (!clientValidation.isValid) {
      setValidationErrors(clientValidation.errors);
      return;
    }
    
    if (!fileId) {
      setErrorMessage('File ID is missing. Please re-upload the file.');
      return;
    }

    setValidating(true);
    try {
      // Call the API to validate mappings
      const results = await validateImportData(fileId, fieldMappings);
      const validationResponse: FieldMappingValidationResponse = {
        valid: results.valid,
        fieldResults: [],
        errorMessage: results.errors ? 'Some validation errors were found.' : undefined,
      };
      setValidationResults(validationResponse);
      setCurrentStep('review');
    } catch (error: any) {
      console.error('Validation API error:', error);
      setErrorMessage(`Error validating mappings: ${error?.response?.data?.message || error.message || 'Please try again.'}`);
      setValidationResults(null);
    } finally {
      setValidating(false);
    }
  };

  // Start import
  const initiateImport = async () => {
    if (!validationResults || !validationResults.valid) {
      setErrorMessage('Cannot start import. Please fix mapping validation issues.');
      return;
    }
    
    if (!fileId || !selectedEntityType) {
      setErrorMessage('Missing file or entity type information.');
      return;
    }

    try {
      setCurrentStep('import');
      setUploadProgress(0);
      setErrorMessage(null);
      
      const jobResponse = await startImport({
        entityType: selectedEntityType as EntityType,
        filePath: fileId,
        fieldMappings: fieldMappings.reduce((acc, mapping) => {
          acc[mapping.targetField] = mapping.sourceField;
          return acc;
        }, {} as Record<string, string>)
      });
      setImportJobId(jobResponse.jobId);
    } catch (error: any) {
      console.error('Import start error:', error);
      setErrorMessage(`Error starting import: ${error?.response?.data?.message || error.message || 'Please try again.'}`);
      setCurrentStep('review');
    }
  };

  // Reset wizard
  const resetWizard = () => {
    setCurrentStep('select-type');
    setSelectedEntityType('');
    setSelectedFile(null);
    setFileId('');
    setUploading(false);
    setUploadProgress(0);
    setFieldMappings([]);
    setAvailableSourceFields([]);
    setTargetEntityFields([]);
    setValidationResults(null);
    setValidating(false);
    setValidationErrors([]);
    setImportJobId('');
    setErrorMessage(null);
  };

  // Navigation functions
  const goToNextStep = () => {
    switch (currentStep) {
      case 'select-type':
        if (selectedEntityType) {
          setCurrentStep('upload-file');
        } else {
          setErrorMessage('Please select an entity type');
        }
        break;
      case 'upload-file':
        if (selectedFile && fileId) {
          setCurrentStep('map-fields');
        } else {
          setErrorMessage('Please select and upload a file to import');
        }
        break;
      case 'map-fields':
        validateMappingsAndProceed();
        break;
      case 'review':
        initiateImport();
        break;
      default:
        break;
    }
  };

  const goToPrevStep = () => {
    switch (currentStep) {
      case 'upload-file':
        setCurrentStep('select-type');
        break;
      case 'map-fields':
        setCurrentStep('upload-file');
        setValidationResults(null);
        break;
      case 'review':
        setCurrentStep('map-fields');
        break;
      case 'import':
        setCurrentStep('review');
        if (importJobId) {
        }
        break;
      default:
        break;
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'select-type':
        return (
          <div className="space-y-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="entity-type" value="Select Entity Type to Import" />
              </div>
              <Select
                id="entity-type"
                value={selectedEntityType}
                onChange={handleEntityTypeChange}
                required
              >
                <option value="">Select entity type</option>
                <option value="certificate">Certificates</option>
                <option value="property">Properties</option>
                <option value="county">Counties</option>
                <option value="auction">Auctions</option>
                <option value="user">Users</option>
                <option value="bidder">Bidders</option>
                <option value="transaction">Transactions</option>
              </Select>
            </div>
          </div>
        );
      
      case 'upload-file':
        return (
          <div className="space-y-4">
            <div className="mb-4">
              <div className="mb-2 block">
                <Label htmlFor="file-upload" value="Select File to Import" />
              </div>
              <div className="flex items-center gap-4">
                <FileUploader
                  accept=".csv,.xlsx,.json"
                  maxSizeInMB={10}
                  onFileSelected={handleFileUpload}
                  onError={handleFileError}
                  uploading={uploading}
                  error={errorMessage || undefined}
                  helperText="CSV, Excel, or JSON file containing data to import."
                  className="flex-1"
                />
                <Button
                  color="light"
                  size="sm"
                  onClick={downloadTemplate}
                  disabled={!selectedEntityType}
                >
                  <HiDocumentDownload className="mr-2 h-5 w-5" />
                  Template
                </Button>
              </div>
            </div>
          </div>
        );
      
      case 'map-fields':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Map File Fields to System Fields</h3>
            <p className="text-sm text-gray-600 mb-4">
              Match columns from your file ({selectedFile?.name}) to the corresponding fields for **{selectedEntityType}**. Required fields are marked with *.
            </p>
            
            {validationErrors.length > 0 && (
              <Alert color="failure" className="mb-4">
                <div className="flex items-center">
                  <HiExclamationCircle className="h-5 w-5 mr-2" />
                  <div>
                    <p className="font-medium">Please fix the following errors:</p>
                    <ul className="mt-1 list-disc list-inside text-sm">
                      {validationErrors.map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Alert>
            )}
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      System Field (Target)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      File Column (Source)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Required
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data Type
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fieldMappings.map((mapping, index) => (
                    <tr key={index} className={mapping.required && !mapping.sourceField ? 'bg-red-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {mapping.targetField} {mapping.required && <span className="text-red-500">*</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Select
                          value={mapping.sourceField}
                          onChange={(e) => updateFieldMapping(mapping.targetField, e.target.value)}
                          required={mapping.required}
                          className={`text-sm w-full ${mapping.required && !mapping.sourceField ? 'border-red-500' : ''}`}
                        >
                          <option value="">-- Not Mapped --</option>
                          {availableSourceFields.map((field, i) => (
                            <option key={i} value={field}>{field}</option>
                          ))}
                        </Select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {mapping.required ? 'Yes' : 'No'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {mapping.type}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      
      case 'review':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Review & Validate</h3>
            <FieldMappingValidation 
                validationResults={validationResults} 
                loading={validating}
            />
          </div>
        );
      
      case 'import':
        return (
          <div className="space-y-4 py-6">
            <h3 className="text-lg font-medium">Importing Data</h3>
            <p className="text-sm text-gray-600 mb-6">
              Please wait while your data is being imported. This may take a few minutes depending on the file size.
            </p>
            
            <div className="mb-4">
              {jobStatus && (jobStatus.progress > 0) ? (
                  <Progress progress={jobStatus.progress} size="lg" />
              ) : (
                  <div className="flex justify-center items-center">
                      <Spinner aria-label="Importing data..." />
                  </div>
              )}
               <div className="text-center mt-2">
                 {jobStatus?.message || (jobStatus?.progress ? `${jobStatus.progress}% Complete` : 'Processing...')}
              </div>
            </div>
          </div>
        );
      
      case 'results':
        const finalStatus = jobStatus?.status ?? (errorMessage ? 'failed' : 'unknown');
        const finalMessage = jobStatus?.message || errorMessage;
        const showResults = finalStatus === 'completed' || finalStatus === 'failed';

        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Import Results</h3>
            
            {showResults ? (
              <>
                <Alert 
                    color={finalStatus === 'completed' ? 'success' : 'failure'}
                    className="mb-4"
                >
                  {finalStatus === 'completed' ? (
                    <HiCheckCircle className="h-5 w-5 mr-2" />
                  ) : (
                    <HiExclamationCircle className="h-5 w-5 mr-2" />
                  )}
                  <span>{finalMessage || (finalStatus === 'completed' ? 'Import completed successfully.' : 'Import failed.')}</span>
                </Alert>
                
                <p className="text-sm text-gray-600">
                    {finalStatus === 'completed' 
                        ? "The import process finished successfully." 
                        : "The import process encountered errors. Please check server logs or contact support for details."
                    }
                    {jobStatus?.error && finalStatus === 'failed' && 
                        <span className="block mt-1 text-red-600">Details: {jobStatus.error}</span>
                    }
                </p>
                                
                <div className="mt-6 flex justify-center">
                  <Button color="success" onClick={resetWizard}>
                    Start New Import
                  </Button>
                </div>
              </>
            ) : (
                 <div className="text-center">
                     <Spinner />
                     <p>Loading results...</p>
                 </div>
             )}
          </div>
        );
      
      default:
        return null;
    }
  };

  // Render wizard steps indicator
  const renderStepsIndicator = () => {
    const steps: { key: ImportStep; label: string }[] = [
      { key: 'select-type', label: 'Select Type' },
      { key: 'upload-file', label: 'Upload File' },
      { key: 'map-fields', label: 'Map Fields' },
      { key: 'review', label: 'Review & Validate' },
      { key: 'import', label: 'Import' },
      { key: 'results', label: 'Results' }
    ];

    const currentStepIndex = steps.findIndex(s => s.key === currentStep);

    return (
      <div className="flex w-full mb-8 border-b pb-4">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isPast = index < currentStepIndex;
          
          return (
            <div key={step.key} className="flex-1">
              <div className={`group flex flex-col items-center border-indigo-600 py-2 ${index > 0 ? 'border-l' : ''} ${isActive ? 'border-b-2' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                    ${isActive ? 'bg-blue-600 text-white' : isPast ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {isPast ? (
                    <HiCheckCircle className="h-6 w-6" />
                  ) : (
                    <span className="text-xs font-bold">{index + 1}</span>
                  )}
                </div>
                <span className={`text-xs mt-2 ${isActive ? 'font-medium text-blue-600' : isPast ? 'text-gray-700' : 'text-gray-500'}`}>
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="data-import-wizard">
      {renderStepsIndicator()}
      
      <Card>
        <div className="p-4 min-h-[300px]">
          {errorMessage && currentStep !== 'results' && (
            <Alert color="failure" className="mb-4">
              <HiExclamationCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">{errorMessage}</span>
            </Alert>
          )}
          
          {renderStepContent()}
          
          {currentStep !== 'import' && currentStep !== 'results' && (
            <div className="flex justify-between mt-8 pt-4 border-t">
              <Button
                color="light"
                onClick={goToPrevStep}
                disabled={currentStep === 'select-type' || validating || uploading}
              >
                Back
              </Button>
              <Button
                color="blue"
                onClick={goToNextStep}
                disabled={
                  validating || 
                  uploading || 
                  (currentStep === 'review' && (!validationResults || !validationResults.valid))
                }
              >
                {validating ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Validating...
                  </>
                ) : currentStep === 'review' ? (
                  'Start Import'
                ) : currentStep === 'map-fields' ? (
                   'Validate & Review'
                ) : (
                  'Next'
                )}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DataImportWizard; 