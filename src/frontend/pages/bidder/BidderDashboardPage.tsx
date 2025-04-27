import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';

// GraphQL queries
const GET_BIDDER_DASHBOARD = gql`
  query GetBidderDashboard {
    myBids {
      id
      certificateId
      interestRate
      bidTime
      status
      certificate {
        id
        certificateNumber
        parcelId
        propertyAddress
        faceValue
        auctionId
        auction {
          id
          name
          county {
            id
            name
            state
          }
        }
      }
    }
    myCertificates {
      id
      certificateNumber
      parcelId
      propertyAddress
      faceValue
      interestRate
      status
      countyId
      auction {
        county {
          id
          name
          state
        }
      }
    }
    registeredCounties {
      id
      name
      state
      logoUrl
      primaryColor
      activeAuctions
      upcomingAuctions
    }
  }
`;

// Utility formatter functions
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

// Status Chip component
const StatusChip = ({ status }: { status: string }) => {
  let color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" = "default";
  
  switch (status.toUpperCase()) {
    case 'ACTIVE':
    case 'SOLD':
      color = "primary";
      break;
    case 'WINNING':
      color = "success";
      break;
    case 'PENDING':
      color = "warning";
      break;
    case 'OUTBID':
    case 'LOST':
      color = "error";
      break;
    case 'REDEEMED':
      color = "info";
      break;
    default:
      color = "default";
  }
  
  return <Chip label={status} color={color} size="small" />;
};

// TabPanel component
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
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const BidderDashboardPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  
  // Fetch dashboard data
  const { loading, error, data } = useQuery(GET_BIDDER_DASHBOARD, {
    fetchPolicy: 'cache-and-network',
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading && !data) {
    return (
      <Container sx={{ my: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ my: 4 }}>
        <Alert severity="error">
          Error loading dashboard data: {error.message}
        </Alert>
      </Container>
    );
  }

  // Extract data
  const myBids = data?.myBids || [];
  const myCertificates = data?.myCertificates || [];
  const registeredCounties = data?.registeredCounties || [];
  
  // Calculate summary stats
  const activeBids = myBids.filter((bid: any) => 
    bid.status.toUpperCase() === 'ACTIVE' || 
    bid.status.toUpperCase() === 'PENDING'
  ).length;
  
  const winningBids = myBids.filter((bid: any) => 
    bid.status.toUpperCase() === 'WINNING'
  ).length;
  
  const activeCertificates = myCertificates.filter((cert: any) => 
    cert.status.toUpperCase() === 'SOLD' || 
    cert.status.toUpperCase() === 'ACTIVE'
  ).length;
  
  const totalValue = myCertificates.reduce((sum: number, cert: any) => 
    sum + cert.faceValue, 0
  );

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Bidder Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your tax certificate bidding activity across all counties
      </Typography>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Bids
              </Typography>
              <Typography variant="h4">{myBids.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Tax Certificates
              </Typography>
              <Typography variant="h4">{myCertificates.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Counties
              </Typography>
              <Typography variant="h4">{registeredCounties.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* County Access Cards */}
      <Typography variant="h5" component="h2" gutterBottom>
        County Portals
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {registeredCounties.length > 0 ? (
          registeredCounties.map((county: any) => (
            <Grid key={county.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card sx={{ 
                height: '100%',
                borderTop: `4px solid ${county.primaryColor || '#1976d2'}`
              }}>
                <CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 2,
                    height: 40
                  }}>
                    {county.logoUrl ? (
                      <Box 
                        component="img" 
                        src={county.logoUrl} 
                        alt={`${county.name} Logo`} 
                        sx={{ 
                          maxHeight: 40, 
                          maxWidth: 80, 
                          mr: 1
                        }}
                      />
                    ) : null}
                    <Typography variant="h6" component="div">
                      {county.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {county.state}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ my: 1 }}>
                    <Typography variant="body2">
                      Active Auctions: {county.activeAuctions || 0}
                    </Typography>
                    <Typography variant="body2">
                      Upcoming Auctions: {county.upcomingAuctions || 0}
                    </Typography>
                  </Box>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    component={Link} 
                    to={`/bidder/county/${county.id}`}
                    sx={{ mt: 2 }}
                  >
                    View Auctions
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid size={{ xs: 12 }}>
            <Alert severity="info">
              You are not registered with any counties yet. Please complete registration to participate in auctions.
            </Alert>
          </Grid>
        )}
      </Grid>

      {/* Tabs for Bids and Certificates */}
      <Paper sx={{ mt: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="dashboard tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Recent Bids" />
          <Tab label="My Certificates" />
          <Tab label="Upcoming Auctions" />
        </Tabs>

        {/* Recent Bids Tab */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            Recent Bidding Activity
          </Typography>
          
          {myBids.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><strong>County</strong></TableCell>
                    <TableCell><strong>Auction</strong></TableCell>
                    <TableCell><strong>Parcel ID</strong></TableCell>
                    <TableCell><strong>Interest Rate</strong></TableCell>
                    <TableCell><strong>Face Value</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {myBids.slice(0, 10).map((bid: any) => (
                    <TableRow key={bid.id} hover>
                      <TableCell>
                        {bid.certificate?.auction?.county?.name || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {bid.certificate?.auction?.name || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {bid.certificate?.parcelId || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {bid.interestRate}%
                      </TableCell>
                      <TableCell>
                        {formatCurrency(bid.certificate?.faceValue || 0)}
                      </TableCell>
                      <TableCell>
                        <StatusChip status={bid.status} />
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          component={Link} 
                          to={`/bidder/parcels/${bid.certificate?.id}`}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ p: 2 }}>
              <Alert severity="info">
                You haven't placed any bids yet. Browse available auctions to start bidding.
              </Alert>
              <Button 
                variant="contained" 
                component={Link} 
                to="/bidder/auctions" 
                sx={{ mt: 2 }}
              >
                View Auctions
              </Button>
            </Box>
          )}
        </TabPanel>

        {/* My Certificates Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            My Tax Certificates
          </Typography>
          
          {myCertificates.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><strong>County</strong></TableCell>
                    <TableCell><strong>Certificate #</strong></TableCell>
                    <TableCell><strong>Parcel ID</strong></TableCell>
                    <TableCell><strong>Face Value</strong></TableCell>
                    <TableCell><strong>Interest Rate</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {myCertificates.slice(0, 10).map((cert: any) => (
                    <TableRow key={cert.id} hover>
                      <TableCell>
                        {cert.auction?.county?.name || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {cert.certificateNumber}
                      </TableCell>
                      <TableCell>
                        {cert.parcelId}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(cert.faceValue)}
                      </TableCell>
                      <TableCell>
                        {cert.interestRate}%
                      </TableCell>
                      <TableCell>
                        <StatusChip status={cert.status} />
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          component={Link} 
                          to={`/bidder/certificate/${cert.id}`}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ p: 2 }}>
              <Alert severity="info">
                You don't own any tax certificates yet. Win auctions to acquire certificates.
              </Alert>
              <Button 
                variant="contained" 
                component={Link} 
                to="/bidder/auctions" 
                sx={{ mt: 2 }}
              >
                View Auctions
              </Button>
            </Box>
          )}
          
          {myCertificates.length > 10 && (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button 
                variant="outlined" 
                component={Link} 
                to="/bidder/certificates"
              >
                View All Certificates
              </Button>
            </Box>
          )}
        </TabPanel>
        
        {/* Upcoming Auctions Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Upcoming Auctions
          </Typography>
          
          <Alert severity="info" sx={{ mb: 3 }}>
            Stay informed about upcoming auctions across all counties you're registered with.
          </Alert>
          
          <Button 
            variant="contained" 
            component={Link} 
            to="/bidder/auctions"
          >
            View All Auctions
          </Button>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default BidderDashboardPage; 