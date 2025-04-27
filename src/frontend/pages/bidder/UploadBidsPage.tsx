import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  Alert, 
  Grid,
  Link,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  CloudUpload as CloudUploadIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  FileCopy as FileIcon,
  InsertDriveFile as FileUploadIcon,
  Description as TemplateIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useMutation, useQuery, gql } from '@apollo/client';
import { alpha } from '@mui/material/styles';
import CountyHeader from '../../components/bidder/CountyHeader';

// Queries to get auction and county information
const GET_AUCTION = gql`
  query GetAuction($id: ID!) {
    auction(id: $id) {
      id
      name
      countyId
      county {
        id
        name
        state
        primaryColor
      }
      auctionDate
      status
    }
  }
`;

// Mock mutation - replace with actual mutation
const UPLOAD_BIDS = gql`
  mutation UploadBids($file: Upload!, $auctionId: ID!) {
    uploadBids(file: $file, auctionId: $auctionId) {
      success
      message
      processedCount
      errorCount
      errors {
        line
        message
      }
    }
  }
`;

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

// Define props interface for FileUploadBox
interface FileUploadBoxProps {
  isDragActive?: boolean;
  theme?: any;
}

// Fix the styled component with proper typing
const FileUploadBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isDragActive',
})<FileUploadBoxProps>(({ theme, isDragActive = false }) => ({
  border: `2px dashed ${isDragActive ? theme.palette.success.main : theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(6),
  textAlign: 'center',
  backgroundColor: isDragActive ? alpha(theme.palette.success.light, 0.1) : theme.palette.background.default,
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

// Template data for CSV download
const templateCsvData = `certificateNumber,interestRate,notes
ABC123456,18.00,Example bid
DEF789012,15.50,Another example`;

// Template structure for display
const templateStructure = [
  { field: 'certificateNumber', description: 'The unique identifier of the certificate', example: 'ABC123456', required: true },
  { field: 'interestRate', description: 'The interest rate for your bid (as a percentage)', example: '18.00', required: true },
  { field: 'notes', description: 'Optional notes for your bid', example: 'Example bid', required: false },
];

const UploadBidsPage: React.FC = () => {
  const { auctionId } = useParams<{ auctionId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);

  // Query for auction data including county
  const { data: auctionData } = useQuery(GET_AUCTION, {
    variables: { id: auctionId },
    skip: !auctionId
  });

  const auction = auctionData?.auction;
  const county = auction?.county;
  const countyName = county?.name || '';
  const countyState = county?.state || '';
  const countyColor = county?.primaryColor || theme.palette.primary.main;

  const [uploadBids, { loading }] = useMutation(UPLOAD_BIDS, {
    onCompleted: (data) => {
      console.log('Upload completed:', data);
      setUploadResult(data.uploadBids);
      setFile(null);
      setActiveStep(2); // Move to results step
    },
    onError: (error) => {
      console.error('Upload error:', error);
      setError(error.message);
    }
  });

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    if (selectedFile) {
      setFile(selectedFile);
      setUploadResult(null);
      setError(null);
      setActiveStep(1); // Move to review step
    }
  }, []);

  // Add these new handlers for drag and drop
  const handleDragEnter = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isDragActive) {
      setIsDragActive(true);
    }
  }, [isDragActive]);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
    
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      const droppedFile = droppedFiles[0];
      
      // Check file type
      if (!droppedFile.name.endsWith('.csv') && !droppedFile.name.endsWith('.xlsx')) {
        setError('Please upload a CSV or Excel file');
        return;
      }

      // Check file size - limit to 5MB
      if (droppedFile.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB');
        return;
      }
      
      setFile(droppedFile);
      setUploadResult(null);
      setError(null);
      setActiveStep(1); // Move to review step
    }
  }, []);

  const handleUpload = useCallback(() => {
    if (!file || !auctionId) return;

    // Check file type
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      setError('Please upload a CSV or Excel file');
      return;
    }

    // Check file size - limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }

    // Proceed with upload
    uploadBids({ variables: { file, auctionId } });
  }, [file, uploadBids, auctionId]);

  const handleDownloadTemplate = () => {
    // Create blob with the template data
    const blob = new Blob([templateCsvData], { type: 'text/csv' });
    
    // Create temporary link element
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'bid-upload-template.csv');
    
    // Append, click, and remove
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  const steps = ['Select File', 'Review', 'Results'];

  return (
    <>
      {auctionId && <CountyHeader />}
      <Container maxWidth="md" sx={{ mt: 2, mb: 6 }}>
        {/* Header */}
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Bulk Bid Upload
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Box>

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Main Content */}
        <Grid container spacing={2}>
          {/* Left Column - Instructions */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: countyColor, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                  <InfoIcon sx={{ mr: 1 }} />
                  Instructions
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="body2" paragraph>
                  Upload multiple bids at once by following these steps:
                </Typography>
                
                <Box sx={{ ml: 1 }}>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Chip label="1" size="small" sx={{ mr: 1, mt: 0.5, bgcolor: countyColor, color: 'white' }} />
                      <Typography variant="body2">
                        Download the template file to see the required format.
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Chip label="2" size="small" sx={{ mr: 1, mt: 0.5, bgcolor: countyColor, color: 'white' }} />
                      <Typography variant="body2">
                        Fill in the template with your bid information, following the format specified.
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Chip label="3" size="small" sx={{ mr: 1, mt: 0.5, bgcolor: countyColor, color: 'white' }} />
                      <Typography variant="body2">
                        Save your file as CSV or Excel format.
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Chip label="4" size="small" sx={{ mr: 1, mt: 0.5, bgcolor: countyColor, color: 'white' }} />
                      <Typography variant="body2">
                        Upload the file using the upload button.
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle2" gutterBottom sx={{ color: countyColor, fontWeight: 'bold' }}>
                  Template Format
                </Typography>
                
                <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Field</StyledTableCell>
                        <StyledTableCell>Required</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {templateStructure.map((field) => (
                        <TableRow key={field.field}>
                          <TableCell>{field.field}</TableCell>
                          <TableCell>{field.required ? 'Yes' : 'No'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadTemplate}
                  sx={{ 
                    mt: 2,
                    borderColor: countyColor,
                    color: countyColor,
                    '&:hover': {
                      borderColor: countyColor,
                      backgroundColor: `${countyColor}10`,
                    }
                  }}
                >
                  Download Template
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Right Column - Upload Section */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card elevation={3} sx={{ 
              height: '100%',
              minHeight: 400,
              borderRadius: 2
            }}>
              <Box sx={{ 
                py: 2, 
                px: 3, 
                bgcolor: countyColor, 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center',
                borderTopLeftRadius: 'inherit',
                borderTopRightRadius: 'inherit'
              }}>
                <CloudUploadIcon sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Bulk Bid Upload
                </Typography>
              </Box>
              
              <CardContent sx={{ p: 3 }}>
                {/* Step 1: Select File */}
                {activeStep === 0 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
                    <FileUploadBox
                      sx={{ width: '100%' }}
                      isDragActive={isDragActive}
                      onDragEnter={handleDragEnter}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('file-upload-input')?.click()}
                    >
                      <FileUploadIcon sx={{ fontSize: 60, color: isDragActive ? 'success.main' : countyColor, mb: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        {isDragActive ? 'Drop your file here' : 'Drag & Drop your file here'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        or click to select a file
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Accepted formats: CSV or Excel (.xlsx)
                      </Typography>
                      <VisuallyHiddenInput 
                        id="file-upload-input"
                        type="file" 
                        onChange={handleFileChange} 
                        accept=".csv,.xlsx" 
                      />
                    </FileUploadBox>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
                      Make sure your file follows the template format for successful upload.
                      <br />
                      Maximum file size: 5MB.
                    </Typography>
                  </Box>
                )}
                
                {/* Step 2: Review File */}
                {activeStep === 1 && file && (
                  <Box sx={{ minHeight: 300 }}>
                    <Alert 
                      severity="info" 
                      icon={<FileIcon />}
                      sx={{ mb: 3 }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        Ready to Upload
                      </Typography>
                      <Typography variant="body2">
                        Please review your file details below before uploading.
                      </Typography>
                    </Alert>
                    
                    <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <FileIcon sx={{ mr: 1, fontSize: 20 }} />
                        File Details
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 4 }}>
                          <Typography variant="body2" color="text.secondary">File Name</Typography>
                        </Grid>
                        <Grid size={{ xs: 8 }}>
                          <Typography variant="body2" fontWeight="bold">{file.name}</Typography>
                        </Grid>
                        
                        <Grid size={{ xs: 4 }}>
                          <Typography variant="body2" color="text.secondary">File Size</Typography>
                        </Grid>
                        <Grid size={{ xs: 8 }}>
                          <Typography variant="body2">{(file.size / 1024).toFixed(2)} KB</Typography>
                        </Grid>
                        
                        <Grid size={{ xs: 4 }}>
                          <Typography variant="body2" color="text.secondary">File Type</Typography>
                        </Grid>
                        <Grid size={{ xs: 8 }}>
                          <Typography variant="body2">{file.type || (file.name.endsWith('.csv') ? 'text/csv' : 'application/xlsx')}</Typography>
                        </Grid>
                      </Grid>
                    </Card>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setFile(null);
                          setActiveStep(0);
                        }}
                      >
                        Back
                      </Button>
                      
                      <Button
                        variant="contained"
                        onClick={handleUpload}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                        sx={{ 
                          bgcolor: countyColor,
                          '&:hover': {
                            bgcolor: `${countyColor}dd`,
                          },
                          '&.Mui-disabled': {
                            bgcolor: `${countyColor}99`,
                          }
                        }}
                      >
                        {loading ? 'Uploading...' : 'Upload Bids'}
                      </Button>
                    </Box>
                    
                    {error && (
                      <Alert severity="error" sx={{ mt: 3 }}>
                        {error}
                      </Alert>
                    )}
                  </Box>
                )}
                
                {/* Step 3: Results */}
                {activeStep === 2 && uploadResult && (
                  <Box sx={{ minHeight: 300 }}>
                    <Alert 
                      severity={uploadResult.errorCount > 0 ? "warning" : "success"}
                      icon={uploadResult.errorCount === 0 ? <CheckCircleIcon /> : undefined}
                      sx={{ mb: 3 }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        Upload {uploadResult.errorCount > 0 ? 'Completed with Issues' : 'Successful'}
                      </Typography>
                      <Typography variant="body2">
                        Successfully processed {uploadResult.processedCount} bids.
                        {uploadResult.errorCount > 0 && ` Found ${uploadResult.errorCount} errors.`}
                      </Typography>
                    </Alert>
                    
                    {uploadResult.errorCount > 0 && (
                      <Card variant="outlined" sx={{ mb: 3, p: 0 }}>
                        <Box sx={{ 
                          p: 2, 
                          bgcolor: '#ffecb3',
                          borderBottom: '1px solid #e0e0e0'
                        }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            Issues Found ({uploadResult.errorCount})
                          </Typography>
                        </Box>
                        <Box sx={{ maxHeight: 200, overflow: 'auto', p: 2 }}>
                          {uploadResult.errors.map((err: any, index: number) => (
                            <Alert severity="error" key={index} sx={{ mb: 1 }}>
                              <Typography variant="body2">
                                <strong>Line {err.line}:</strong> {err.message}
                              </Typography>
                            </Alert>
                          ))}
                        </Box>
                      </Card>
                    )}
                    
                    <Typography variant="body2" paragraph>
                      {uploadResult.message || 'Your bids have been uploaded to the system and will be processed accordingly.'}
                      {uploadResult.errorCount > 0 ? ' Please fix the errors and try uploading again.' : ''}
                    </Typography>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Button
                        component="label"
                        variant="outlined"
                        startIcon={<CloudUploadIcon />}
                        sx={{ 
                          borderColor: countyColor,
                          color: countyColor,
                          '&:hover': {
                            borderColor: countyColor,
                            backgroundColor: `${countyColor}10`,
                          }
                        }}
                      >
                        Upload Another File
                        <VisuallyHiddenInput 
                          type="file" 
                          onChange={(e) => {
                            handleFileChange(e);
                            setActiveStep(1);
                          }}
                          accept=".csv,.xlsx" 
                        />
                      </Button>
                      
                      <Button
                        variant="contained"
                        onClick={() => navigate(`/bidder/county-auction/${auctionId}/my-bids`)}
                        sx={{ 
                          bgcolor: countyColor,
                          '&:hover': {
                            bgcolor: `${countyColor}dd`,
                          }
                        }}
                      >
                        View My Bids
                      </Button>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default UploadBidsPage; 