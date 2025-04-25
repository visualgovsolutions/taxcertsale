import React, { useState, useEffect } from 'react';
import { Button, Card, Checkbox, Label, Select, Alert, Spinner, Progress } from 'flowbite-react';
import { HiDownload, HiCheckCircle, HiFilter, HiExclamationCircle } from 'react-icons/hi';
import { 
  EntityType, 
  ExportFormat,
  startExport, 
  getExportJobStatus, 
  downloadExportFile 
} from '../../../services/importExportService';
import useJobProgress from '../../../hooks/useJobProgress';

interface FilterOption {
  field: string;
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'between' | 'in';
  value: string | number | string[] | number[] | [number, number] | [string, string];
}

interface ExportField {
  name: string;
  label: string;
  selected: boolean;
}

const DataExportTool: React.FC = () => {
  const [selectedEntityType, setSelectedEntityType] = useState<EntityType | ''>('');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('csv');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterOption[]>([]);
  const [availableFields, setAvailableFields] = useState<ExportField[]>([]);
  const [selectedCount, setSelectedCount] = useState<number>(0);
  const [rowLimit, setRowLimit] = useState<number | ''>('');
  const [includeHeaders, setIncludeHeaders] = useState<boolean>(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [exportJobId, setExportJobId] = useState<string>('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadInProgress, setDownloadInProgress] = useState<boolean>(false);

  // Use job progress hook for real-time export status updates
  const { 
    jobStatus,
    isLoading: jobStatusLoading,
    error: jobStatusError
  } = useJobProgress({
    jobId: exportJobId,
    endpoint: '/api/export/status',
    useWebSocket: true,
    onComplete: (result) => {
      setIsGenerating(false);
      setSuccessMessage(`Export file has been generated successfully. Click Download to get your file.`);
      if (result.downloadUrl) {
        setDownloadUrl(result.downloadUrl);
      }
    },
    onError: (error) => {
      setIsGenerating(false);
      setErrorMessage(`Export failed: ${error}`);
    }
  });

  // Update progress when job status changes
  useEffect(() => {
    if (jobStatus && isGenerating) {
      if (jobStatus.status === 'failed') {
        setIsGenerating(false);
        setErrorMessage(`Export failed: ${jobStatus.error || 'Unknown error'}`);
      } else if (jobStatus.status === 'completed') {
        setIsGenerating(false);
        setSuccessMessage(`Export file has been generated successfully. Click Download to get your file.`);
        if (jobStatus.result && typeof jobStatus.result === 'object' && 'downloadUrl' in jobStatus.result) {
          setDownloadUrl(jobStatus.result.downloadUrl as string);
        }
      }
    }
  }, [jobStatus, isGenerating]);

  // Get fields for the selected entity type
  const getEntityFields = (entityType: string): ExportField[] => {
    switch (entityType) {
      case 'certificate':
        return [
          { name: 'id', label: 'Certificate ID', selected: true },
          { name: 'parcelId', label: 'Parcel ID', selected: true },
          { name: 'propertyAddress', label: 'Property Address', selected: true },
          { name: 'ownerName', label: 'Owner Name', selected: true },
          { name: 'faceValue', label: 'Face Value', selected: true },
          { name: 'interestRate', label: 'Interest Rate', selected: true },
          { name: 'issueDate', label: 'Issue Date', selected: true },
          { name: 'status', label: 'Status', selected: true },
          { name: 'redemptionAmount', label: 'Redemption Amount', selected: true },
          { name: 'redemptionDate', label: 'Redemption Date', selected: true },
          { name: 'countyId', label: 'County ID', selected: false },
          { name: 'countyName', label: 'County Name', selected: true },
          { name: 'auctionId', label: 'Auction ID', selected: false },
          { name: 'auctionTitle', label: 'Auction Title', selected: true },
          { name: 'createdAt', label: 'Created At', selected: false },
          { name: 'updatedAt', label: 'Updated At', selected: false },
        ];
      case 'property':
        return [
          { name: 'id', label: 'Property ID', selected: true },
          { name: 'parcelId', label: 'Parcel ID', selected: true },
          { name: 'address', label: 'Address', selected: true },
          { name: 'city', label: 'City', selected: true },
          { name: 'state', label: 'State', selected: true },
          { name: 'zip', label: 'ZIP Code', selected: true },
          { name: 'latitude', label: 'Latitude', selected: false },
          { name: 'longitude', label: 'Longitude', selected: false },
          { name: 'acreage', label: 'Acreage', selected: true },
          { name: 'propertyType', label: 'Property Type', selected: true },
          { name: 'countyId', label: 'County ID', selected: false },
          { name: 'countyName', label: 'County Name', selected: true },
          { name: 'createdAt', label: 'Created At', selected: false },
          { name: 'updatedAt', label: 'Updated At', selected: false },
        ];
      case 'county':
        return [
          { name: 'id', label: 'County ID', selected: true },
          { name: 'name', label: 'County Name', selected: true },
          { name: 'state', label: 'State', selected: true },
          { name: 'code', label: 'County Code', selected: true },
          { name: 'contactEmail', label: 'Contact Email', selected: true },
          { name: 'contactPhone', label: 'Contact Phone', selected: true },
          { name: 'websiteUrl', label: 'Website URL', selected: true },
          { name: 'createdAt', label: 'Created At', selected: false },
          { name: 'updatedAt', label: 'Updated At', selected: false },
        ];
      case 'auction':
        return [
          { name: 'id', label: 'Auction ID', selected: true },
          { name: 'title', label: 'Title', selected: true },
          { name: 'description', label: 'Description', selected: true },
          { name: 'startDate', label: 'Start Date', selected: true },
          { name: 'endDate', label: 'End Date', selected: true },
          { name: 'countyId', label: 'County ID', selected: false },
          { name: 'countyName', label: 'County Name', selected: true },
          { name: 'minBidAmount', label: 'Minimum Bid Amount', selected: true },
          { name: 'status', label: 'Status', selected: true },
          { name: 'certificateCount', label: 'Certificate Count', selected: true },
          { name: 'totalValue', label: 'Total Value', selected: true },
          { name: 'createdAt', label: 'Created At', selected: false },
          { name: 'updatedAt', label: 'Updated At', selected: false },
        ];
      case 'user':
        return [
          { name: 'id', label: 'User ID', selected: true },
          { name: 'firstName', label: 'First Name', selected: true },
          { name: 'lastName', label: 'Last Name', selected: true },
          { name: 'email', label: 'Email', selected: true },
          { name: 'role', label: 'Role', selected: true },
          { name: 'status', label: 'Status', selected: true },
          { name: 'lastLoginDate', label: 'Last Login Date', selected: true },
          { name: 'createdAt', label: 'Created At', selected: false },
          { name: 'updatedAt', label: 'Updated At', selected: false },
        ];
      case 'bid':
        return [
          { name: 'id', label: 'Bid ID', selected: true },
          { name: 'userId', label: 'User ID', selected: false },
          { name: 'userName', label: 'User Name', selected: true },
          { name: 'certificateId', label: 'Certificate ID', selected: false },
          { name: 'certificateParcelId', label: 'Certificate Parcel ID', selected: true },
          { name: 'auctionId', label: 'Auction ID', selected: false },
          { name: 'auctionTitle', label: 'Auction Title', selected: true },
          { name: 'bidAmount', label: 'Bid Amount', selected: true },
          { name: 'bidDate', label: 'Bid Date', selected: true },
          { name: 'status', label: 'Status', selected: true },
          { name: 'createdAt', label: 'Created At', selected: false },
          { name: 'updatedAt', label: 'Updated At', selected: false },
        ];
      case 'transaction':
        return [
          { name: 'id', label: 'Transaction ID', selected: true },
          { name: 'userId', label: 'User ID', selected: false },
          { name: 'userName', label: 'User Name', selected: true },
          { name: 'type', label: 'Transaction Type', selected: true },
          { name: 'amount', label: 'Amount', selected: true },
          { name: 'status', label: 'Status', selected: true },
          { name: 'relatedEntityId', label: 'Related Entity ID', selected: false },
          { name: 'relatedEntityType', label: 'Related Entity Type', selected: true },
          { name: 'paymentMethod', label: 'Payment Method', selected: true },
          { name: 'transactionDate', label: 'Transaction Date', selected: true },
          { name: 'createdAt', label: 'Created At', selected: false },
          { name: 'updatedAt', label: 'Updated At', selected: false },
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
      const fields = getEntityFields(type);
      setAvailableFields(fields);
      
      // Update selected count
      const selectedFieldsCount = fields.filter(field => field.selected).length;
      setSelectedCount(selectedFieldsCount);
    } else {
      setAvailableFields([]);
      setSelectedCount(0);
    }
  };

  // Handle format change
  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setExportFormat(e.target.value as ExportFormat);
  };

  // Toggle a field's selection
  const toggleFieldSelection = (fieldName: string) => {
    const updatedFields = availableFields.map(field => {
      if (field.name === fieldName) {
        return { ...field, selected: !field.selected };
      }
      return field;
    });
    
    setAvailableFields(updatedFields);
    const selectedFieldsCount = updatedFields.filter(field => field.selected).length;
    setSelectedCount(selectedFieldsCount);
  };

  // Toggle all fields
  const toggleAllFields = (selected: boolean) => {
    const updatedFields = availableFields.map(field => ({ ...field, selected }));
    setAvailableFields(updatedFields);
    setSelectedCount(selected ? availableFields.length : 0);
  };

  // Handle download of export file
  const handleDownloadExport = async () => {
    if (!downloadUrl) return;
    
    setDownloadInProgress(true);
    
    try {
      // Call the download function from the import-export service
      const blob = await downloadExportFile(downloadUrl);
      
      // Create a download link and trigger click
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = `export-${selectedEntityType}-${new Date().toISOString().slice(0, 10)}.${exportFormat}`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      setDownloadInProgress(false);
    } catch (error) {
      setErrorMessage('Failed to download the export file. Please try again.');
      setDownloadInProgress(false);
      console.error('Download error:', error);
    }
  };

  // Generate and start the export job
  const generateExport = async () => {
    // Reset messages
    setSuccessMessage(null);
    setErrorMessage(null);
    setDownloadUrl(null);
    
    // Validate selection
    if (!selectedEntityType) {
      setErrorMessage('Please select an entity type to export');
      return;
    }
    
    if (selectedCount === 0) {
      setErrorMessage('Please select at least one field to export');
      return;
    }
    
    // Start generation
    setIsGenerating(true);
    
    try {
      // Get selected fields
      const selectedFields = availableFields
        .filter(field => field.selected)
        .map(field => field.name);
      
      // Start the export job
      const response = await startExport({
        entityType: selectedEntityType,
        fields: selectedFields,
        format: exportFormat === 'pdf' ? 'csv' : exportFormat,
        filters: {}
      });
      
      setExportJobId(response.jobId);
    } catch (error) {
      setIsGenerating(false);
      setErrorMessage('An error occurred while generating the export. Please try again.');
      console.error('Export error:', error);
    }
  };

  // Row limit change handler
  const handleRowLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setRowLimit('');
    } else {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) && numValue >= 0) {
        setRowLimit(numValue);
      }
    }
  };

  return (
    <div className="data-export-tool">
      <Card>
        <div className="p-4">
          <h3 className="text-lg font-medium mb-4">Export Data</h3>
          
          {successMessage && (
            <Alert color="success" className="mb-4">
              <HiCheckCircle className="h-5 w-5 mr-2" />
              <span>{successMessage}</span>
              {downloadUrl && (
                <Button
                  color="success"
                  size="xs"
                  className="ml-4"
                  onClick={handleDownloadExport}
                  disabled={downloadInProgress}
                >
                  {downloadInProgress ? (
                    <>
                      <Spinner size="xs" className="mr-2" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <HiDownload className="mr-1 h-4 w-4" />
                      Download
                    </>
                  )}
                </Button>
              )}
            </Alert>
          )}
          
          {errorMessage && (
            <Alert color="failure" className="mb-4">
              <HiExclamationCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">{errorMessage}</span>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="entity-type" value="Select Entity Type to Export" />
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
                <option value="bid">Bids</option>
                <option value="transaction">Transactions</option>
              </Select>
            </div>
            
            <div>
              <div className="mb-2 block">
                <Label htmlFor="export-format" value="Export Format" />
              </div>
              <Select
                id="export-format"
                value={exportFormat}
                onChange={handleFormatChange}
                required
              >
                <option value="csv">CSV</option>
                <option value="excel">Excel (XLSX)</option>
                <option value="json">JSON</option>
                <option value="pdf">PDF</option>
              </Select>
            </div>
          </div>
          
          {selectedEntityType && (
            <>
              {isGenerating && (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                  <h4 className="text-md font-medium mb-3">Generating Export</h4>
                  <div className="mb-4">
                    <Progress 
                      progress={jobStatus?.progress || 0} 
                      size="lg" 
                    />
                    <div className="mt-2 text-sm text-center text-gray-700">
                      {jobStatus?.progress || 0}% Complete
                    </div>
                  </div>
                  <p className="text-sm text-center text-gray-600">
                    {jobStatus?.message || 'Processing data...'}
                  </p>
                </div>
              )}
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="fields-select" value="Select Fields to Include" />
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => toggleAllFields(true)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleAllFields(false)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Deselect All
                    </button>
                    <span className="text-sm text-gray-500">
                      {selectedCount} of {availableFields.length} selected
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {availableFields.map((field, index) => (
                    <div key={index} className="flex items-center">
                      <Checkbox
                        id={`field-${field.name}`}
                        checked={field.selected}
                        onChange={() => toggleFieldSelection(field.name)}
                      />
                      <Label htmlFor={`field-${field.name}`} className="ml-2 text-sm">
                        {field.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="row-limit" value="Row Limit (Optional)" />
                  </div>
                  <input
                    id="row-limit"
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={rowLimit}
                    onChange={handleRowLimitChange}
                    placeholder="No limit"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Leave empty for no limit
                  </p>
                </div>
                
                <div className="flex items-center">
                  <Checkbox
                    id="include-headers"
                    checked={includeHeaders}
                    onChange={() => setIncludeHeaders(!includeHeaders)}
                  />
                  <Label htmlFor="include-headers" className="ml-2">
                    Include Headers in Export
                  </Label>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button
                  color="light"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <HiFilter className="mr-2 h-5 w-5" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
                
                <Button
                  color="blue"
                  onClick={generateExport}
                  disabled={isGenerating || selectedCount === 0}
                >
                  {isGenerating ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Generating...
                    </>
                  ) : (
                    'Generate Export'
                  )}
                </Button>
              </div>
              
              {showFilters && (
                <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                  <h4 className="text-md font-medium mb-4">Filter Options</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Filtering functionality will be implemented in a future update.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DataExportTool; 