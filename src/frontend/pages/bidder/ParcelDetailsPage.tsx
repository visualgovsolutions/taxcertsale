import React, { useState, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
  Alert,
  Tabs,
  Tab,
  Avatar,
  Chip
} from '@mui/material';
// Using standard HTML/CSS instead of Material UI to avoid dependency issues
import { formatCurrency, formatDate } from '../../utils/formatters';

// Add the mockAppraisalInfo - In a real app, this would come from an API
const mockAppraisalInfo = {
  lastAssessmentDate: "2024-01-15",
  assessedValue: 285000,
  marketValue: 310000,
  appraiserId: "WK-AP-1234",
  appraiserName: "Wakulla County Property Appraiser",
  appraiserUrl: "https://www.wakullaproperty.com",
  taxCollectorUrl: "https://www.wakullataxcollector.com",
  taxInfo: {
    annualTax: 3500,
    lastPaymentDate: "2023-11-10",
    delinquencyAmount: 3850,
    delinquencySince: "2023-12-31"
  },
  propertyDetails: {
    zoning: "R-1 Residential",
    landUse: "Single Family",
    subdivision: "Pine Grove Estates",
    legalDescription: "LOT 7 BLK C PINE GROVE ESTATES SUBDIVISION",
    yearBuilt: 1985,
    buildingSquareFeet: 2100,
    totalRooms: 7,
    beds: 3,
    baths: 2,
    stories: 1
  }
};

// GraphQL query to get certificate details by ID
const GET_CERTIFICATE_DETAILS = gql`
  query GetCertificateDetails($id: ID!) {
    certificate(id: $id) {
      id
      certificateNumber
      parcelId
      propertyAddress
      faceValue
      status
      interestRate
      auctionId
      propertyType
      landValue
      buildingValue
      yearBuilt
      totalValue
      acreage
      taxYear
    }
  }
`;

// Mutation to place a bid
const PLACE_BID = gql`
  mutation PlaceBid($certificateId: ID!, $interestRate: Float!) {
    createBid(certificateId: $certificateId, interestRate: $interestRate) {
      id
      certificateId
      interestRate
      timestamp
      status
    }
  }
`;

// Check if user has a bid on this certificate
const GET_MY_BID_ON_CERTIFICATE = gql`
  query GetMyBidOnCertificate($certificateId: ID!) {
    myBidOnCertificate(certificateId: $certificateId) {
      id
      interestRate
      timestamp
      status
    }
  }
`;

interface Certificate {
  id: string;
  certificateNumber: string;
  parcelId: string;
  propertyAddress: string;
  faceValue: number;
  status: string;
  interestRate: number;
  auctionId: string;
  propertyType?: string;
  landValue?: number;
  buildingValue?: number;
  yearBuilt?: number;
  totalValue?: number;
  acreage?: number;
  taxYear?: number;
}

interface Bid {
  id: string;
  interestRate: number;
  timestamp: string;
  status: string;
}

// Add a TabPanel component for the tabbed information display
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const ParcelDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [interestRate, setInterestRate] = useState<string>('');
  const [bidError, setBidError] = useState<string | null>(null);
  const [bidSuccess, setBidSuccess] = useState<boolean>(false);
  const [tabValue, setTabValue] = useState(0);

  // Query to get certificate details
  const { loading: certificateLoading, error: certificateError, data: certificateData } = useQuery(
    GET_CERTIFICATE_DETAILS,
    {
      variables: { id },
      fetchPolicy: 'network-only',
    }
  );

  // Query to check if user has a bid on this certificate
  const { loading: bidLoading, data: bidData } = useQuery(GET_MY_BID_ON_CERTIFICATE, {
    variables: { certificateId: id },
    fetchPolicy: 'network-only',
  });

  // Mutation to place a bid
  const [placeBid, { loading: placeBidLoading }] = useMutation(PLACE_BID, {
    onCompleted: () => {
      setBidSuccess(true);
      setBidError(null);
      setInterestRate('');
    },
    onError: (error) => {
      setBidError(error.message);
      setBidSuccess(false);
    },
    refetchQueries: [
      { query: GET_MY_BID_ON_CERTIFICATE, variables: { certificateId: id } },
    ],
  });

  const handlePlaceBid = async () => {
    if (!interestRate) {
      setBidError('Please enter an interest rate.');
      return;
    }

    try {
      await placeBid({
        variables: {
          certificateId: id,
          interestRate: parseFloat(interestRate),
        },
      });
    } catch (error) {
      console.error('Error placing bid:', error);
    }
  };

  const handleBack = () => {
    navigate('/bidder/auctions');
  };

  const handleInterestRateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInterestRate(e.target.value);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (certificateLoading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (certificateError) {
    return (
      <Container>
        <Alert severity="error">Error loading certificate details: {certificateError.message}</Alert>
        <Button variant="contained" onClick={handleBack} sx={{ mt: 2 }}>
          Back to Auctions
        </Button>
      </Container>
    );
  }

  const certificate: Certificate = certificateData?.certificate;
  const existingBid: Bid | null = bidData?.myBidOnCertificate || null;

  if (!certificate) {
    return (
      <Container>
        <Alert severity="warning">Certificate not found.</Alert>
        <Button variant="contained" onClick={handleBack} sx={{ mt: 2 }}>
          Back to Auctions
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Box py={4}>
        <Button variant="outlined" onClick={handleBack} sx={{ mb: 3 }}>
          Back to Auctions
        </Button>
        
        <Typography variant="h4" gutterBottom>
          Parcel Details: {certificate.parcelId}
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
          {/* Certificate Information */}
          <Box sx={{ flex: 1 }}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Certificate Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle2">Certificate Number</Typography>
                    <Typography variant="body1">{certificate.certificateNumber}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Face Value</Typography>
                    <Typography variant="body1">${certificate.faceValue.toFixed(2)}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Status</Typography>
                    <Typography variant="body1">{certificate.status}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Interest Rate</Typography>
                    <Typography variant="body1">{certificate.interestRate}%</Typography>
                  </Box>
                  <Box sx={{ gridColumn: 'span 2' }}>
                    <Typography variant="subtitle2">Auction ID</Typography>
                    <Typography variant="body1">{certificate.auctionId}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Property Information */}
          <Box sx={{ flex: 1 }}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Property Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                  <Box sx={{ gridColumn: 'span 2' }}>
                    <Typography variant="subtitle2">Property Address</Typography>
                    <Typography variant="body1">{certificate.propertyAddress}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Property Type</Typography>
                    <Typography variant="body1">{certificate.propertyType || 'N/A'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Year Built</Typography>
                    <Typography variant="body1">{certificate.yearBuilt || 'N/A'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Land Value</Typography>
                    <Typography variant="body1">
                      ${certificate.landValue?.toFixed(2) || 'N/A'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Building Value</Typography>
                    <Typography variant="body1">
                      ${certificate.buildingValue?.toFixed(2) || 'N/A'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Total Value</Typography>
                    <Typography variant="body1">
                      ${certificate.totalValue?.toFixed(2) || 'N/A'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Acreage</Typography>
                    <Typography variant="body1">
                      {certificate.acreage?.toFixed(2) || 'N/A'} acres
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Tax Year</Typography>
                    <Typography variant="body1">{certificate.taxYear || 'N/A'}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Map and Appraiser Section */}
        <Box sx={{ mt: 4 }}>
          <Paper elevation={3}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="property information tabs"
              variant="fullWidth"
            >
              <Tab label="Map & Location" />
              <Tab label="Property Appraiser Info" />
              <Tab label="Tax Information" />
            </Tabs>
            
            <TabPanel value={tabValue} index={0}>
              <Typography variant="h6" gutterBottom>
                Property Map
              </Typography>
              <Box sx={{ 
                position: 'relative', 
                width: '100%',
                height: '400px',
                overflow: 'hidden',
                borderRadius: '4px',
                mb: 2
              }}>
                {/* Google Maps iframe - would use Google Maps API in production */}
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDummyKeyForDemoPurposes&q=${encodeURIComponent(certificate.propertyAddress)}`}
                ></iframe>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Card sx={{ flex: '1 1 48%', minWidth: '280px' }}>
                  <CardHeader title="Nearby Services" sx={{ bgcolor: '#f5f5f5' }} />
                  <CardContent>
                    <Typography variant="body2" gutterBottom>
                      • Schools: Wakulla High School (2.3 mi), Wakulla Middle School (1.8 mi)
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      • Shopping: Wakulla Plaza (1.1 mi), Downtown Shopping District (3.5 mi)
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      • Medical: Wakulla Memorial Hospital (4.2 mi), MedExpress Urgent Care (2.0 mi)
                    </Typography>
                    <Typography variant="body2">
                      • Recreation: Wakulla Springs State Park (5.7 mi), Community Park (0.8 mi)
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card sx={{ flex: '1 1 48%', minWidth: '280px' }}>
                  <CardHeader title="Neighborhood Information" sx={{ bgcolor: '#f5f5f5' }} />
                  <CardContent>
                    <Typography variant="body2" gutterBottom>
                      • Median Home Value: $245,000
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      • Population Density: Medium
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      • Crime Rate: Low
                    </Typography>
                    <Typography variant="body2">
                      • Walk Score: 65/100 - Some errands can be accomplished on foot
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>WA</Avatar>
                <Box>
                  <Typography variant="h6">{mockAppraisalInfo.appraiserName}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Last Assessment: {formatDate(mockAppraisalInfo.lastAssessmentDate)}
                  </Typography>
                </Box>
                <Button 
                  variant="outlined" 
                  href={mockAppraisalInfo.appraiserUrl} 
                  target="_blank" 
                  sx={{ ml: 'auto' }}
                >
                  Visit Appraiser Website
                </Button>
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <Card sx={{ flex: '1 1 48%', minWidth: '280px' }}>
                  <CardHeader title="Property Valuation" sx={{ bgcolor: '#f5f5f5' }} />
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Assessed Value:</Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {formatCurrency(mockAppraisalInfo.assessedValue)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Market Value:</Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {formatCurrency(mockAppraisalInfo.marketValue)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Land Use:</Typography>
                      <Typography variant="body1">
                        {mockAppraisalInfo.propertyDetails.landUse}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
                
                <Card sx={{ flex: '1 1 48%', minWidth: '280px' }}>
                  <CardHeader title="Building Information" sx={{ bgcolor: '#f5f5f5' }} />
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Year Built:</Typography>
                      <Typography variant="body1">
                        {mockAppraisalInfo.propertyDetails.yearBuilt}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Square Feet:</Typography>
                      <Typography variant="body1">
                        {mockAppraisalInfo.propertyDetails.buildingSquareFeet.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Beds/Baths:</Typography>
                      <Typography variant="body1">
                        {mockAppraisalInfo.propertyDetails.beds}/{mockAppraisalInfo.propertyDetails.baths}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
              
              <Card>
                <CardHeader title="Legal Information" sx={{ bgcolor: '#f5f5f5' }} />
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary">Legal Description:</Typography>
                    <Typography variant="body1">
                      {mockAppraisalInfo.propertyDetails.legalDescription}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ flex: '1 1 auto', minWidth: '200px' }}>
                      <Typography variant="body2" color="textSecondary">Zoning:</Typography>
                      <Typography variant="body1">{mockAppraisalInfo.propertyDetails.zoning}</Typography>
                    </Box>
                    
                    <Box sx={{ flex: '1 1 auto', minWidth: '200px' }}>
                      <Typography variant="body2" color="textSecondary">Subdivision:</Typography>
                      <Typography variant="body1">{mockAppraisalInfo.propertyDetails.subdivision}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </TabPanel>
            
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Tax Information</Typography>
                <Button 
                  variant="outlined" 
                  href={mockAppraisalInfo.taxCollectorUrl} 
                  target="_blank" 
                  sx={{ ml: 'auto' }}
                >
                  Visit Tax Collector Website
                </Button>
              </Box>
              
              <Card sx={{ mb: 3 }}>
                <CardHeader 
                  title="Delinquent Tax Information" 
                  sx={{ bgcolor: '#f5f5f5' }}
                  action={
                    <Chip 
                      label="Delinquent" 
                      color="error" 
                      size="small" 
                      sx={{ fontWeight: 'bold' }}
                    />
                  }
                />
                <CardContent>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    <Box>
                      <Typography variant="body2" color="textSecondary">Delinquent Amount:</Typography>
                      <Typography variant="h6" color="error">
                        {formatCurrency(mockAppraisalInfo.taxInfo.delinquencyAmount)}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="textSecondary">Delinquent Since:</Typography>
                      <Typography variant="body1">
                        {formatDate(mockAppraisalInfo.taxInfo.delinquencySince)}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="textSecondary">Annual Tax Amount:</Typography>
                      <Typography variant="body1">
                        {formatCurrency(mockAppraisalInfo.taxInfo.annualTax)}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="textSecondary">Last Payment Date:</Typography>
                      <Typography variant="body1">
                        {formatDate(mockAppraisalInfo.taxInfo.lastPaymentDate)}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Alert severity="info" sx={{ mt: 2 }}>
                    This certificate represents delinquent taxes owed on this property. Bidding on this certificate provides you with the right to collect the delinquent amount plus interest from the property owner.
                  </Alert>
                </CardContent>
              </Card>
              
              <Typography variant="body2" color="textSecondary" paragraph>
                Tax certificates are issued for unpaid property taxes. The bid interest rate is the maximum rate you are willing to accept when the property owner redeems the certificate. The lowest bid interest rate wins the auction.
              </Typography>
            </TabPanel>
          </Paper>
        </Box>

        {/* Bidding Section */}
        <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Place a Bid
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {existingBid ? (
            <Box>
              <Alert severity="info" sx={{ mb: 2 }}>
                You already have a bid on this certificate at {existingBid.interestRate}% interest rate.
              </Alert>
              <Typography variant="subtitle2">Your Current Bid</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2, mt: 1 }}>
                <Box>
                  <Typography variant="body2">Interest Rate:</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {existingBid.interestRate}%
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2">Timestamp:</Typography>
                  <Typography variant="body1">
                    {new Date(existingBid.timestamp).toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2">Status:</Typography>
                  <Typography variant="body1">{existingBid.status}</Typography>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box>
              <Typography variant="body2" paragraph>
                Enter your interest rate to place a bid on this certificate. Lower interest rates are more competitive.
              </Typography>
            </Box>
          )}

          {bidSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Your bid has been successfully placed!
            </Alert>
          )}

          {bidError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {bidError}
            </Alert>
          )}

          <Box component="form" sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'center' }}>
              <Box sx={{ width: { xs: '100%', sm: '40%', md: '30%' } }}>
                <TextField
                  label="Interest Rate (%)"
                  type="number"
                  value={interestRate}
                  onChange={handleInterestRateChange}
                  fullWidth
                  InputProps={{
                    inputProps: {
                      min: 0,
                      step: 0.01,
                    },
                  }}
                  disabled={placeBidLoading}
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: '40%', md: '30%' } }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePlaceBid}
                  disabled={placeBidLoading || !interestRate}
                  fullWidth
                >
                  {placeBidLoading ? <CircularProgress size={24} /> : 'Place Bid'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ParcelDetailsPage; 