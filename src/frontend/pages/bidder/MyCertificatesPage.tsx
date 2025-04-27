import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  CircularProgress,
  Chip,
  Button,
  Alert,
  Card,
  CardContent,
  Grid,
} from '@mui/material';

// GraphQL query to fetch bidder's certificates
const GET_MY_CERTIFICATES = gql`
  query GetMyCertificates {
    myCertificates {
      id
      certificateNumber
      parcelId
      propertyAddress
      ownerName
      faceValue
      interestRate
      status
      purchaseDate
      redemptionDate
      expirationDate
      countyId
      createdAt
      updatedAt
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
  let displayText = status;
  
  switch (status.toUpperCase()) {
    case 'REDEEMED':
      color = "success";
      displayText = "REDEEMED";
      break;
    case 'SOLD':
      color = "primary";
      displayText = "ACTIVE";
      break;
    case 'EXPIRED':
      color = "error";
      displayText = "EXPIRED";
      break;
    default:
      color = "default";
      displayText = status;
  }
  
  return <Chip label={displayText} color={color} size="small" />;
};

const MyCertificatesPage: React.FC = () => {
  // State for search and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch certificates data
  const { loading, error, data } = useQuery(GET_MY_CERTIFICATES, {
    fetchPolicy: 'cache-and-network',
  });

  // Handle pagination
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter certificates based on search term
  const filteredCertificates = data?.myCertificates
    ? data.myCertificates.filter((certificate: any) => {
        const searchableFields = [
          certificate.certificateNumber,
          certificate.parcelId,
          certificate.propertyAddress,
          certificate.ownerName,
        ].filter(Boolean).map(field => field.toLowerCase());
        
        return searchTerm === '' || searchableFields.some(field => field.includes(searchTerm.toLowerCase()));
      })
    : [];

  // Calculate summary statistics
  const calculateSummary = () => {
    if (!data?.myCertificates || data.myCertificates.length === 0) {
      return {
        total: 0,
        totalValue: 0,
        redeemed: 0,
        active: 0,
        expired: 0,
      };
    }

    return data.myCertificates.reduce((summary: any, cert: any) => {
      summary.total += 1;
      summary.totalValue += cert.faceValue;
      
      if (cert.status.toUpperCase() === 'REDEEMED') {
        summary.redeemed += 1;
      } else if (cert.status.toUpperCase() === 'SOLD') {
        summary.active += 1;
      } else if (cert.status.toUpperCase() === 'EXPIRED') {
        summary.expired += 1;
      }
      
      return summary;
    }, { total: 0, totalValue: 0, redeemed: 0, active: 0, expired: 0 });
  };

  const summary = calculateSummary();

  if (loading && !data) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">
          Error loading certificates: {error.message}
        </Alert>
      </Container>
    );
  }

  // Check if user has any certificates
  const hasCertificates = data?.myCertificates && data.myCertificates.length > 0;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        My Tax Certificates
      </Typography>

      {hasCertificates ? (
        <>
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>Total Certificates</Typography>
                  <Typography variant="h4">{summary.total}</Typography>
                  <Typography variant="subtitle1" sx={{ mt: 1 }}>
                    Value: {formatCurrency(summary.totalValue)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: '100%', bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                <CardContent>
                  <Typography gutterBottom>Active Certificates</Typography>
                  <Typography variant="h4">{summary.active}</Typography>
                  <Typography variant="subtitle1" sx={{ mt: 1 }}>
                    Earning Interest
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: '100%', bgcolor: 'success.light', color: 'success.contrastText' }}>
                <CardContent>
                  <Typography gutterBottom>Redeemed</Typography>
                  <Typography variant="h4">{summary.redeemed}</Typography>
                  <Typography variant="subtitle1" sx={{ mt: 1 }}>
                    Completed
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: '100%', bgcolor: 'error.light', color: 'error.contrastText' }}>
                <CardContent>
                  <Typography gutterBottom>Expired</Typography>
                  <Typography variant="h4">{summary.expired}</Typography>
                  <Typography variant="subtitle1" sx={{ mt: 1 }}>
                    Not Redeemed
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Search and Filter */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by certificate number, parcel ID, address, or owner name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {/* Remove problematic icon import */}
                    {/* <SearchIcon /> */}
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Certificates Table */}
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell><strong>Certificate #</strong></TableCell>
                  <TableCell><strong>Parcel ID</strong></TableCell>
                  <TableCell><strong>Property Address</strong></TableCell>
                  <TableCell><strong>Face Value</strong></TableCell>
                  <TableCell><strong>Interest Rate</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Purchase Date</strong></TableCell>
                  <TableCell><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCertificates
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((certificate: any) => (
                    <TableRow key={certificate.id} hover>
                      <TableCell>{certificate.certificateNumber}</TableCell>
                      <TableCell>{certificate.parcelId}</TableCell>
                      <TableCell>{certificate.propertyAddress || 'N/A'}</TableCell>
                      <TableCell>{formatCurrency(certificate.faceValue)}</TableCell>
                      <TableCell>{certificate.interestRate}%</TableCell>
                      <TableCell><StatusChip status={certificate.status} /></TableCell>
                      <TableCell>{formatDate(certificate.purchaseDate)}</TableCell>
                      <TableCell>
                        <Button 
                          variant="contained" 
                          size="small" 
                          component={Link} 
                          to={`/bidder/certificate/${certificate.id}`}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                {filteredCertificates.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No certificates found matching your search criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredCertificates.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          {/* Information Section */}
          <Box sx={{ mt: 4 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body1">
                <strong>About Tax Certificates:</strong> Tax certificates represent unpaid property taxes that you have purchased at auction. If the property owner redeems the certificate, you'll receive your principal plus interest. Certificates that aren't redeemed within the statutory period may lead to property ownership through a tax deed application.
              </Typography>
            </Alert>
          </Box>
        </>
      ) : (
        <Box sx={{ mt: 3 }}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              You don't have any tax certificates yet.
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Participate in tax certificate auctions to bid on properties with delinquent taxes.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              component={Link} 
              to="/bidder/auctions"
              size="large"
            >
              View Available Auctions
            </Button>
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default MyCertificatesPage; 