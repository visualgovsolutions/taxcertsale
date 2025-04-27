import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Divider,
  Button,
  Grid,
  Checkbox,
  FormGroup,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Tooltip,
  IconButton,
  CircularProgress,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { CloudUpload, InfoOutlined, Save, Print, CheckCircle } from '@mui/icons-material';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useAuth } from '../../context/AuthContext';
import CountyHeader from '../../components/bidder/CountyHeader';

// GraphQL Queries and Mutations
const SUBMIT_W9_FORM = gql`
  mutation SubmitW9Form($input: W9FormInput!) {
    submitW9Form(input: $input) {
      id
      name
      status
      submissionDate
    }
  }
`;

const GET_MY_W9_FORMS = gql`
  query GetMyW9Forms {
    myW9Forms {
      id
      countyId
      county {
        id
        name
        state
      }
      status
      submissionDate
      approvalDate
    }
  }
`;

const GET_COUNTIES = gql`
  query GetCounties {
    counties {
      id
      name
      state
    }
  }
`;

// Add query to get auction by ID
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
      }
    }
  }
`;

// Helper function to format date safely
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Pending';
  
  try {
    // First try to parse as an ISO date string directly
    const date = new Date(dateString);
    
    // Check if date is valid
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString();
    }
    
    // If we got an invalid date, try parsing it as a timestamp
    const timestamp = parseInt(dateString);
    if (!isNaN(timestamp)) {
      const dateFromTimestamp = new Date(timestamp);
      if (!isNaN(dateFromTimestamp.getTime())) {
        return dateFromTimestamp.toLocaleDateString();
      }
    }
    
    // If all parsing fails
    return 'Date unavailable';
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Date unavailable';
  }
};

// Styled components for form elements
const FormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(3),
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  borderRadius: '8px',
  border: '1px solid #e0e0e0'
}));

const FormSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4)
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  color: '#1976d2',
  borderBottom: '1px solid #e0e0e0',
  paddingBottom: theme.spacing(1)
}));

const FormField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2)
}));

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

const W9FormPage: React.FC = () => {
  const { user } = useAuth();
  const { auctionId } = useParams<{ auctionId: string }>(); // Extract auctionId from URL
  const [activeStep, setActiveStep] = useState(0);
  const [selectedCounty, setSelectedCounty] = useState('');
  const [formData, setFormData] = useState({
    countyId: '',
    name: '',
    businessName: '',
    taxClassification: 'individual',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    accountNumbers: '',
    ssn: '',
    ein: '',
    certificationChecked: false,
    fileUploaded: false,
    fileUrl: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // GraphQL Hooks
  const [submitW9Form, { loading: submitting }] = useMutation(SUBMIT_W9_FORM, {
    onCompleted: (data) => {
      setFormSubmitted(true);
      setSuccessMessage(`Your W9 form has been successfully submitted for approval.`);
      setErrorMessage('');
    },
    onError: (error) => {
      setErrorMessage(`Failed to submit form: ${error.message}`);
      setSuccessMessage('');
    }
  });

  const { data: myFormsData, loading: formsLoading, refetch: refetchMyForms } = useQuery(GET_MY_W9_FORMS);
  const { data: countiesData, loading: countiesLoading, error: countiesError } = useQuery(GET_COUNTIES, {
    onError: (error) => {
      console.error("Error fetching counties:", error);
      setErrorMessage("There was an issue loading counties. Please try again later or contact support.");
    }
  });

  // Use auction data to pre-select county if auctionId is provided
  const { data: auctionData, loading: auctionLoading } = useQuery(GET_AUCTION, {
    variables: { id: auctionId },
    skip: !auctionId,
    onCompleted: (data) => {
      if (data?.auction?.countyId) {
        setSelectedCounty(data.auction.countyId);
        setFormData(prevData => ({
          ...prevData,
          countyId: data.auction.countyId
        }));
      }
    }
  });

  useEffect(() => {
    // Set the county from auction data if available
    if (auctionData?.auction?.countyId) {
      setSelectedCounty(auctionData.auction.countyId);
      setFormData(prev => ({
        ...prev,
        countyId: auctionData.auction.countyId
      }));
    }
  }, [auctionData]);

  useEffect(() => {
    // Refetch forms when page loads
    refetchMyForms();
  }, [refetchMyForms]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear validation error when field is modified
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const handleCountyChange = (event: SelectChangeEvent<string>) => {
    const countyId = event.target.value;
    setSelectedCounty(countyId);
    setFormData({
      ...formData,
      countyId
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      // For now, just mark as uploaded - in a real implementation, we would upload to a server
      setFormData({
        ...formData,
        fileUploaded: true,
        fileUrl: 'https://example.com/w9form.pdf' // This would be the actual URL from upload
      });
    }
  };

  const handleStepChange = (step: number) => {
    // Simple validation before proceeding
    if (step > activeStep) {
      const errors: Record<string, string> = {};
      
      if (step === 1 && activeStep === 0) {
        // Validate step 1
        if (!formData.countyId) errors.countyId = 'County is required';
        if (!formData.name) errors.name = 'Name is required';
        if (!formData.address) errors.address = 'Address is required';
        if (!formData.city) errors.city = 'City is required';
        if (!formData.state) errors.state = 'State is required';
        if (!formData.zipCode) errors.zipCode = 'ZIP Code is required';
      }
      
      if (step === 2 && activeStep === 1) {
        // Validate step 2 - at least one of SSN or EIN
        if (!formData.ssn && !formData.ein) {
          errors.ssn = 'Either SSN or EIN is required';
          errors.ein = 'Either SSN or EIN is required';
        }
      }
      
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
    }
    
    setActiveStep(step);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    // Final validation
    const errors: Record<string, string> = {};
    if (!formData.certificationChecked) {
      errors.certificationChecked = 'You must certify the information is correct';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Submit form data to backend
    submitW9Form({
      variables: {
        input: {
          countyId: formData.countyId,
          name: formData.name,
          businessName: formData.businessName || undefined,
          taxClassification: formData.taxClassification,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          accountNumbers: formData.accountNumbers || undefined,
          ssn: formData.ssn || undefined,
          ein: formData.ein || undefined,
          fileUrl: formData.fileUrl || undefined
        }
      }
    });
  };

  const steps = ['County & Taxpayer Information', 'Tax Classification & TIN', 'Certification'];

  // Check if user already has forms submitted
  const existingForms = myFormsData?.myW9Forms || [];
  const formStatusByCounty = existingForms.reduce((acc: Record<string, string>, form: any) => {
    acc[form.countyId] = form.status;
    return acc;
  }, {});
  
  // Log for debugging
  useEffect(() => {
    if (existingForms.length > 0) {
      console.log('Existing forms:', existingForms);
      console.log('Form status by county:', formStatusByCounty);
    }
  }, [existingForms, formStatusByCounty]);

  // Determine if we're in a county context
  const isCountyContext = !!auctionId;

  return (
    <>
      {/* CRITICAL PATH: County Header must be first element */}
      {isCountyContext && <CountyHeader />}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            W-9 Form Submission
          </Typography>

          {existingForms.length > 0 && (
            <FormPaper sx={{ mb: 4 }}>
              <SectionTitle variant="h6">Your W9 Form Status by County</SectionTitle>
              <Grid container spacing={2}>
                {existingForms.map((form: any) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={form.id}>
                    <Paper 
                      elevation={1} 
                      sx={{ 
                        p: 2, 
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        backgroundColor: 
                          form.status === 'APPROVED' ? '#e8f5e9' : 
                          form.status === 'REJECTED' ? '#ffebee' : '#fff8e1'
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight={600}>
                        {form.county?.name}, {form.county?.state}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          Status:
                        </Typography>
                        <Typography 
                          variant="body2" 
                          fontWeight={600}
                          color={
                            form.status === 'APPROVED' ? 'success.main' : 
                            form.status === 'REJECTED' ? 'error.main' : 'warning.main'
                          }
                        >
                          {form.status}
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        Submitted: {formatDate(form.submissionDate)}
                      </Typography>
                      {form.approvalDate && (
                        <Typography variant="body2">
                          Approved: {formatDate(form.approvalDate)}
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </FormPaper>
          )}

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {errorMessage}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ mb: 4 }}>
              {successMessage}
            </Alert>
          )}

          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  onClick={() => handleStepChange(index)}
                  sx={{ cursor: 'pointer' }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {formSubmitted ? (
            <Alert 
              severity="success" 
              sx={{ mb: 4 }}
              icon={<CheckCircle fontSize="inherit" />}
            >
              <Typography variant="h6">Form Submitted Successfully</Typography>
              <Typography variant="body1">
                Your W-9 form has been submitted and is pending approval. You can track the status
                at the top of this page. The county will review your submission and approve it once verified.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Print />}
                  onClick={() => window.print()}
                  sx={{ mr: 2 }}
                >
                  Print Receipt
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setFormSubmitted(false);
                    setActiveStep(0);
                    refetchMyForms();
                  }}
                >
                  Submit Another Form
                </Button>
              </Box>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit}>
              {activeStep === 0 && (
                <FormPaper>
                  <FormSection>
                    <SectionTitle variant="h6">Select County</SectionTitle>
                    {countiesError ? (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        Unable to load counties. Please contact support for assistance.
                      </Alert>
                    ) : (
                      <FormControl fullWidth error={!!formErrors.countyId}>
                        <Select
                          value={selectedCounty}
                          onChange={handleCountyChange}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Select county' }}
                        >
                          <MenuItem value="" disabled>
                            Select a county for W9 submission
                          </MenuItem>
                          {(countiesData?.counties || [])
                            .filter((county: any) => {
                              // Only show counties that haven't been submitted or were rejected
                              const status = formStatusByCounty[county.id];
                              const shouldShow = !status || status === 'REJECTED';
                              return shouldShow;
                            })
                            .map((county: any) => (
                              <MenuItem
                                key={county.id} 
                                value={county.id}
                              >
                                {county.name}, {county.state}
                              </MenuItem>
                            ))}
                        </Select>
                        {formErrors.countyId && (
                          <Typography color="error" variant="caption">
                            {formErrors.countyId}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  </FormSection>

                  <FormSection>
                    <SectionTitle variant="h6">1. Taxpayer Identification</SectionTitle>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <FormField
                          fullWidth
                          label="Name (as shown on your income tax return)"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          error={!!formErrors.name}
                          helperText={formErrors.name}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <FormField
                          fullWidth
                          label="Business name/disregarded entity name (if different)"
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleChange}
                        />
                      </Grid>
                    </Grid>
                  </FormSection>

                  <FormSection>
                    <SectionTitle variant="h6">2. Address</SectionTitle>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12 }}>
                        <FormField
                          fullWidth
                          label="Street address, P.O. box, etc."
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          required
                          error={!!formErrors.address}
                          helperText={formErrors.address}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 5 }}>
                        <FormField
                          fullWidth
                          label="City"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          error={!!formErrors.city}
                          helperText={formErrors.city}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 3 }}>
                        <FormField
                          fullWidth
                          label="State"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          required
                          error={!!formErrors.state}
                          helperText={formErrors.state}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FormField
                          fullWidth
                          label="ZIP Code"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          required
                          error={!!formErrors.zipCode}
                          helperText={formErrors.zipCode}
                        />
                      </Grid>
                    </Grid>
                  </FormSection>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button
                      variant="contained"
                      onClick={() => handleStepChange(1)}
                      color="primary"
                      disabled={!formData.countyId}
                    >
                      Continue
                    </Button>
                  </Box>
                </FormPaper>
              )}

              {activeStep === 1 && (
                <FormPaper>
                  <FormSection>
                    <SectionTitle variant="h6">3. Tax Classification</SectionTitle>
                    <FormControl component="fieldset" sx={{ mb: 2 }}>
                      <RadioGroup
                        name="taxClassification"
                        value={formData.taxClassification}
                        onChange={handleChange}
                      >
                        <FormControlLabel value="individual" control={<Radio />} label="Individual/Sole proprietor or single-member LLC" />
                        <FormControlLabel value="cCorporation" control={<Radio />} label="C Corporation" />
                        <FormControlLabel value="sCorporation" control={<Radio />} label="S Corporation" />
                        <FormControlLabel value="partnership" control={<Radio />} label="Partnership" />
                        <FormControlLabel value="trust" control={<Radio />} label="Trust/Estate" />
                        <FormControlLabel value="llc" control={<Radio />} label="Limited liability company" />
                        <FormControlLabel value="other" control={<Radio />} label="Other" />
                      </RadioGroup>
                    </FormControl>
                  </FormSection>

                  <FormSection>
                    <SectionTitle variant="h6">4. Taxpayer Identification Number (TIN)</SectionTitle>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <FormField
                          fullWidth
                          label="Social Security Number"
                          name="ssn"
                          value={formData.ssn}
                          onChange={handleChange}
                          placeholder="XXX-XX-XXXX"
                          error={!!formErrors.ssn}
                          helperText={formErrors.ssn}
                          InputProps={{
                            endAdornment: (
                              <Tooltip title="Enter your Social Security Number (SSN) in the format XXX-XX-XXXX">
                                <IconButton edge="end">
                                  <InfoOutlined />
                                </IconButton>
                              </Tooltip>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <FormField
                          fullWidth
                          label="Employer Identification Number"
                          name="ein"
                          value={formData.ein}
                          onChange={handleChange}
                          placeholder="XX-XXXXXXX"
                          error={!!formErrors.ein}
                          helperText={formErrors.ein}
                          InputProps={{
                            endAdornment: (
                              <Tooltip title="Enter your Employer Identification Number (EIN) in the format XX-XXXXXXX">
                                <IconButton edge="end">
                                  <InfoOutlined />
                                </IconButton>
                              </Tooltip>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                          Note: Either a Social Security Number OR Employer Identification Number is required.
                        </Typography>
                      </Grid>
                    </Grid>
                  </FormSection>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    <Button
                      variant="outlined"
                      onClick={() => handleStepChange(0)}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => handleStepChange(2)}
                      color="primary"
                    >
                      Continue
                    </Button>
                  </Box>
                </FormPaper>
              )}

              {activeStep === 2 && (
                <FormPaper>
                  <FormSection>
                    <SectionTitle variant="h6">5. Certification</SectionTitle>
                    <Typography paragraph sx={{ mb: 3 }}>
                      Under penalties of perjury, I certify that:
                    </Typography>
                    <ol>
                      <li>
                        <Typography paragraph>
                          The number shown on this form is my correct taxpayer identification number (or I am waiting for a number to be issued to me); and
                        </Typography>
                      </li>
                      <li>
                        <Typography paragraph>
                          I am not subject to backup withholding because: (a) I am exempt from backup withholding, or (b) I have not been notified by the Internal Revenue Service (IRS) that I am subject to backup withholding as a result of a failure to report all interest or dividends, or (c) the IRS has notified me that I am no longer subject to backup withholding; and
                        </Typography>
                      </li>
                      <li>
                        <Typography paragraph>
                          I am a U.S. citizen or other U.S. person (defined in the instructions); and
                        </Typography>
                      </li>
                      <li>
                        <Typography paragraph>
                          The FATCA code(s) entered on this form (if any) indicating that I am exempt from FATCA reporting is correct.
                        </Typography>
                      </li>
                    </ol>
                  </FormSection>

                  <FormSection>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.certificationChecked}
                            onChange={handleChange}
                            name="certificationChecked"
                            required
                          />
                        }
                        label="I certify that the above statements are true and accurate to the best of my knowledge."
                      />
                      {formErrors.certificationChecked && (
                        <Typography color="error" variant="caption">
                          {formErrors.certificationChecked}
                        </Typography>
                      )}
                    </FormGroup>
                  </FormSection>

                  <FormSection>
                    <SectionTitle variant="h6">6. Upload Signed W-9 Form (Optional)</SectionTitle>
                    <Typography paragraph>
                      If you already have a completed W-9 form, you can upload it here:
                    </Typography>
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<CloudUpload />}
                      sx={{ mb: 2 }}
                    >
                      Upload W-9 PDF
                      <VisuallyHiddenInput type="file" onChange={handleFileUpload} accept=".pdf" />
                    </Button>
                    {formData.fileUploaded && (
                      <Alert severity="success" sx={{ mt: 2 }}>
                        File uploaded successfully
                      </Alert>
                    )}
                  </FormSection>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    <Button
                      variant="outlined"
                      onClick={() => handleStepChange(1)}
                    >
                      Back
                    </Button>
                    <Box>
                      <Button
                        variant="outlined"
                        startIcon={<Print />}
                        sx={{ mr: 2 }}
                        onClick={() => window.print()}
                      >
                        Print Form
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={submitting ? <CircularProgress size={20} /> : <Save />}
                        disabled={!formData.certificationChecked || submitting}
                      >
                        {submitting ? 'Submitting...' : 'Submit Form'}
                      </Button>
                    </Box>
                  </Box>
                </FormPaper>
              )}
            </form>
          )}
        </Box>
      </Container>
    </>
  );
};

export default W9FormPage; 