import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  TextField, 
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Link,
  Alert,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Chip,
  Avatar,
  Stack,
  InputAdornment,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { gql, useQuery } from '@apollo/client';
import { 
  AccountBalance as BankIcon,
  CreditCard as CardIcon,
  Payment as PaymentIcon,
  Security as SecurityIcon,
  CheckCircle as CheckIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import CountyHeader from '../../components/bidder/CountyHeader';

// GraphQL query to get county details if in county context
const GET_COUNTY = gql`
  query GetCounty($id: ID!) {
    county(id: $id) {
      id
      name
      state
      primaryColor
    }
  }
`;

// GraphQL query to get auction details
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

const DepositPage = () => {
  const { auctionId } = useParams();
  const location = useLocation();
  const isCountyContext = location.pathname.includes('county-auction');
  const [activeStep, setActiveStep] = useState(0);

  // Form state
  const [amount, setAmount] = useState('');
  const [accountName, setAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [transactionType, setTransactionType] = useState('Deposit');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [accountType, setAccountType] = useState('Checking');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Get county data if in county context
  const { data: auctionData } = useQuery(GET_AUCTION, {
    variables: { id: auctionId },
    skip: !auctionId
  });

  const countyId = auctionData?.auction?.countyId;
  
  const { data: countyData } = useQuery(GET_COUNTY, {
    variables: { id: countyId },
    skip: !countyId
  });

  const county = auctionData?.auction?.county || countyData?.county;
  const countyName = county?.name || '';
  const countyState = county?.state || '';
  const countyColor = county?.primaryColor || '#0066cc';

  // Hardcoded dates for demo purposes
  const wireTransferLastDate = "5/29/2025";
  const eCheckLastDate = "5/20/2025";

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    
    if (!accountName) newErrors.accountName = 'Account holder name is required';
    if (!bankName) newErrors.bankName = 'Bank name is required';
    
    if (!routingNumber) {
      newErrors.routingNumber = 'Routing number is required';
    } else if (!/^\d{9}$/.test(routingNumber)) {
      newErrors.routingNumber = 'Routing number must be 9 digits';
    }
    
    if (!accountNumber) {
      newErrors.accountNumber = 'Account number is required';
    }
    
    if (!confirmAccountNumber) {
      newErrors.confirmAccountNumber = 'Please confirm account number';
    } else if (accountNumber !== confirmAccountNumber) {
      newErrors.confirmAccountNumber = 'Account numbers must match';
    }

    if (!termsAccepted) {
      newErrors.terms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // In a real implementation, this would submit the form data to the backend
      console.log('Form submitted', {
        amount,
        accountName,
        bankName,
        routingNumber,
        accountNumber,
        accountType,
        transactionType
      });
      setSubmitted(true);
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const steps = ['Amount', 'Account Information', 'Review & Confirm'];

  return (
    <>
      {/* CRITICAL PATH: County Header must be first element */}
      {isCountyContext && <CountyHeader />}
      <Container maxWidth="md" sx={{ my: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          {!isCountyContext && county && (
            <Typography variant="h4" component="h1" gutterBottom sx={{ color: countyColor, fontWeight: 'bold' }}>
              {countyName}, {countyState}
            </Typography>
          )}
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium' }}>
            Secure Deposit Payment
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Chip 
              icon={<SecurityIcon />} 
              label="Secure Transaction" 
              color="success" 
              sx={{ mr: 1 }} 
            />
            <Chip 
              icon={<LockIcon />} 
              label="Encrypted" 
              color="primary" 
            />
          </Box>
          <Divider sx={{ my: 2 }} />
        </Box>

        {/* Payment Options Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card raised sx={{ 
              height: '100%', 
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.02)' },
              border: `2px solid ${countyColor}`,
              position: 'relative'
            }}>
              <Box sx={{ 
                position: 'absolute', 
                top: 10, 
                right: 10, 
                bgcolor: countyColor, 
                color: 'white',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontSize: '0.8rem'
              }}>
                RECOMMENDED
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: countyColor, mr: 2 }}>
                    <BankIcon />
                  </Avatar>
                  <Typography variant="h6">eCheck (ACH)</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Securely transfer funds directly from your bank account with no processing fees.
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mt: 'auto' }}>
                  <Typography variant="body2" fontWeight="bold" color="error.main">
                    Deadline: {eCheckLastDate} 6:00 PM
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ 
              height: '100%',
              bgcolor: '#f9f9f9'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'grey.500', mr: 2 }}>
                    <PaymentIcon />
                  </Avatar>
                  <Typography variant="h6">Wire Transfer</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Transfer funds through your bank's wire service. Additional bank fees may apply.
                </Typography>
                <Link href="#" underline="hover" color="primary">
                  View wire transfer instructions
                </Link>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  <Typography variant="body2" fontWeight="bold" color="error.main">
                    Deadline: {wireTransferLastDate} EOD
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Form */}
        <Paper elevation={3} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ 
            bgcolor: countyColor, 
            py: 2, 
            px: 3, 
            color: 'white',
            display: 'flex',
            alignItems: 'center'
          }}>
            <BankIcon sx={{ mr: 1 }} />
            <Typography variant="h6">
              eCheck Payment Form
            </Typography>
          </Box>

          <Box sx={{ p: 3 }}>
            {submitted ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CheckIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom color="success.main">
                  Payment Successful
                </Typography>
                <Typography variant="body1" paragraph>
                  Your deposit of ${Number(amount).toLocaleString()} has been processed successfully.
                </Typography>
                <Typography variant="body2" paragraph color="text.secondary">
                  A confirmation email has been sent to your registered email address.
                  Transaction ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  sx={{ mt: 2 }}
                  onClick={() => window.print()}
                >
                  Print Receipt
                </Button>
              </Box>
            ) : (
              <>
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                <form onSubmit={handleSubmit}>
                  {activeStep === 0 && (
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Enter Deposit Amount
                      </Typography>
                      <TextField
                        fullWidth
                        label="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        error={!!errors.amount}
                        helperText={errors.amount || "Maximum $25,000 per transaction. Multiple deposits allowed."}
                        variant="outlined"
                        placeholder="0.00"
                        sx={{ mb: 1 }}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          inputMode: 'numeric'
                        }}
                        inputProps={{ 
                          pattern: '[0-9]*'
                        }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        • Deposit whole dollars only (e.g., $125 for a $125.00 deposit)<br />
                        • $25,000 limit per eCheck transaction<br />
                        • Funds will be debited directly from your bank account
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          onClick={handleNext}
                          disabled={!amount || !!errors.amount}
                          sx={{ 
                            px: 4, 
                            backgroundColor: countyColor,
                            '&:hover': {
                              backgroundColor: countyColor + 'dd',
                            }
                          }}
                        >
                          Continue
                        </Button>
                      </Box>
                    </Box>
                  )}

                  {activeStep === 1 && (
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Bank Account Information
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            fullWidth
                            label="Account Holder's Name"
                            value={accountName}
                            onChange={(e) => setAccountName(e.target.value)}
                            error={!!errors.accountName}
                            helperText={errors.accountName}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            fullWidth
                            label="Bank Name"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            error={!!errors.bankName}
                            helperText={errors.bankName}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <FormControl fullWidth variant="outlined">
                            <InputLabel>Account Type</InputLabel>
                            <Select
                              value={accountType}
                              onChange={(e) => setAccountType(e.target.value)}
                              label="Account Type"
                            >
                              <MenuItem value="Checking">Checking</MenuItem>
                              <MenuItem value="Savings">Savings</MenuItem>
                              <MenuItem value="Business">Business</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            label="Routing Number (9 digits)"
                            value={routingNumber}
                            onChange={(e) => setRoutingNumber(e.target.value)}
                            error={!!errors.routingNumber}
                            helperText={errors.routingNumber}
                            variant="outlined"
                            inputProps={{ maxLength: 9, inputMode: 'numeric', pattern: '[0-9]*' }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            label="Account Number"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            error={!!errors.accountNumber}
                            helperText={errors.accountNumber}
                            variant="outlined"
                            type="password"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            label="Confirm Account Number"
                            value={confirmAccountNumber}
                            onChange={(e) => setConfirmAccountNumber(e.target.value)}
                            error={!!errors.confirmAccountNumber}
                            helperText={errors.confirmAccountNumber}
                            variant="outlined"
                            type="password"
                          />
                        </Grid>
                      </Grid>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                        <Button 
                          onClick={handleBack}
                          variant="outlined"
                        >
                          Back
                        </Button>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          onClick={handleNext}
                          disabled={!accountName || !bankName || !routingNumber || !accountNumber || !confirmAccountNumber || !!errors.accountName || !!errors.bankName || !!errors.routingNumber || !!errors.accountNumber || !!errors.confirmAccountNumber}
                          sx={{ 
                            px: 4, 
                            backgroundColor: countyColor,
                            '&:hover': {
                              backgroundColor: countyColor + 'dd',
                            }
                          }}
                        >
                          Review
                        </Button>
                      </Box>
                    </Box>
                  )}

                  {activeStep === 2 && (
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Review & Confirm Payment
                      </Typography>
                      <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: '#f9f9f9' }}>
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 6 }}>
                            <Typography variant="body2" color="text.secondary">Amount</Typography>
                            <Typography variant="body1" fontWeight="bold">${Number(amount).toLocaleString()}.00</Typography>
                          </Grid>
                          <Grid size={{ xs: 6 }}>
                            <Typography variant="body2" color="text.secondary">Payment Method</Typography>
                            <Typography variant="body1">eCheck (ACH)</Typography>
                          </Grid>
                          <Grid size={{ xs: 6 }}>
                            <Typography variant="body2" color="text.secondary">Account Holder</Typography>
                            <Typography variant="body1">{accountName}</Typography>
                          </Grid>
                          <Grid size={{ xs: 6 }}>
                            <Typography variant="body2" color="text.secondary">Bank</Typography>
                            <Typography variant="body1">{bankName}</Typography>
                          </Grid>
                          <Grid size={{ xs: 6 }}>
                            <Typography variant="body2" color="text.secondary">Account Type</Typography>
                            <Typography variant="body1">{accountType}</Typography>
                          </Grid>
                          <Grid size={{ xs: 6 }}>
                            <Typography variant="body2" color="text.secondary">Routing Number</Typography>
                            <Typography variant="body1">{routingNumber}</Typography>
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <Typography variant="body2" color="text.secondary">Account Number</Typography>
                            <Typography variant="body1">••••••{accountNumber.slice(-4)}</Typography>
                          </Grid>
                        </Grid>
                      </Paper>

                      <Alert severity="info" sx={{ mb: 3 }}>
                        By submitting this form, you authorize a one-time ACH debit from your account for the amount specified above.
                      </Alert>

                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={termsAccepted} 
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                          />
                        }
                        label={
                          <Typography variant="body2">
                            I authorize the county tax office to debit my account in accordance with the <Link href="#" underline="hover">terms and conditions</Link>.
                          </Typography>
                        }
                        sx={{ mb: 2 }}
                      />
                      {errors.terms && (
                        <Typography color="error" variant="caption" sx={{ ml: 4, display: 'block', mt: -1 }}>
                          {errors.terms}
                        </Typography>
                      )}
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                        <Button 
                          onClick={handleBack}
                          variant="outlined"
                        >
                          Back
                        </Button>
                        <Button 
                          type="submit" 
                          variant="contained" 
                          color="primary" 
                          sx={{ 
                            px: 4, 
                            backgroundColor: countyColor,
                            '&:hover': {
                              backgroundColor: countyColor + 'dd',
                            }
                          }}
                        >
                          Confirm Payment
                        </Button>
                      </Box>
                    </Box>
                  )}
                </form>
              </>
            )}
          </Box>
        </Paper>

        {/* Security Info */}
        <Paper elevation={1} sx={{ p: 3, borderRadius: 2, bgcolor: '#f5f5f5' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 1 }}>
              <LockIcon sx={{ fontSize: 40, color: 'gray' }} />
            </Grid>
            <Grid size={{ xs: 12, md: 11 }}>
              <Typography variant="body2" color="text.secondary">
                All transactions are secure and encrypted. Your financial information is protected using industry-standard security protocols. We do not store your bank account numbers on our servers.
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
};

export default DepositPage; 