import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  FormControlLabel,
  IconButton,
  Card,
  CardContent,
  Tabs,
  Tab,
  Tooltip,
  InputLabel,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  SelectChangeEvent,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Add as PlusIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
  Save as SaveIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useParams, useNavigate } from 'react-router-dom';
import CountyHeader from '../../components/bidder/CountyHeader';

// GraphQL queries
const GET_AUCTION_CERTIFICATES = gql`
  query GetCertificates($filter: CertificateFilterInput, $page: Int, $limit: Int) {
    certificates(filter: $filter, page: $page, limit: $limit) {
      totalCount
      certificates {
        id
        certificateNumber
        faceValue
        interestRate
        status
        parcelId
        propertyAddress
        ownerName
        bidCount
        property {
          id
          parcelId
          address
          city
          state
          zipCode
          legalDescription
        }
      }
    }
  }
`;

const GET_MY_BIDS = gql`
  query GetMyBids {
    myBids {
      id
      certificateId
      auctionId
      interestRate
      bidTime
      status
      isWinningBid
    }
  }
`;

const GET_ACTIVE_AUCTIONS = gql`
  query GetActiveAuctions {
    activeAuctions {
      id
      name
      countyId
      status
    }
  }
`;

const GET_AUCTION = gql`
  query GetAuction($id: ID!) {
    auction(id: $id) {
      id
      name
      countyId
      status
      county {
        id
        name
        state
        primaryColor
      }
    }
  }
`;

const PLACE_BID = gql`
  mutation PlaceBid($certificateId: ID!, $interestRate: Float!) {
    createBid(certificateId: $certificateId, interestRate: $interestRate) {
      id
      certificateId
      interestRate
      status
      isWinningBid
    }
  }
`;

const CANCEL_BID = gql`
  mutation CancelBid($bidId: ID!) {
    cancelBid(bidId: $bidId) {
      id
      status
    }
  }
`;

// Styled components
const StyledBox = styled(Box)(({ theme }) => ({
  border: '1px solid #ddd',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

const StyledHeading = styled(Typography)(({ theme }) => ({
  borderBottom: '2px solid #f00',
  paddingBottom: theme.spacing(0.5),
  marginBottom: theme.spacing(2),
  fontWeight: 'bold',
  color: '#f00',
}));

const PlaceBidsPage: React.FC = () => {
  // Get the current auction ID from params or state
  const navigate = useNavigate();
  const { auctionId } = useParams<{ auctionId: string }>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyClass, setPropertyClass] = useState('');
  const [minBidsFilter, setMinBidsFilter] = useState('');
  const [selectedCertificates, setSelectedCertificates] = useState<string[]>([]);
  const [bidDialogOpen, setBidDialogOpen] = useState(false);
  const [massBidDialogOpen, setMassBidDialogOpen] = useState(false);
  const [currentCertificate, setCurrentCertificate] = useState<any>(null);
  const [bidRate, setBidRate] = useState<string>('');
  const [massBidRate, setMassBidRate] = useState<string>('');
  const [bidError, setBidError] = useState<string>('');
  const [massBidError, setMassBidError] = useState<string>('');
  const [massBidding, setMassBidding] = useState(false);
  const [individualBidRates, setIndividualBidRates] = useState<{[key: string]: string}>({});
  const [individualBidErrors, setIndividualBidErrors] = useState<{[key: string]: string}>({});

  // Redirect immediately if no auctionId is provided
  useEffect(() => {
    if (!auctionId) {
      navigate('/bidder/auctions', { replace: true });
    }
  }, [auctionId, navigate]);

  // Fetch active auctions if no auctionId in the URL
  const { data: auctionsData, loading: auctionsLoading, error: auctionsError } = useQuery(GET_ACTIVE_AUCTIONS, {
    skip: !!auctionId,
  });

  // Fetch auction details if auctionId is provided
  const { data: auctionData, loading: auctionLoading, error: auctionError } = useQuery(GET_AUCTION, {
    variables: { id: auctionId },
    skip: !auctionId,
  });

  // Query for fetching certificates with parameters for filtering and pagination
  const {
    loading,
    error,
    data,
    refetch,
    fetchMore
  } = useQuery(GET_AUCTION_CERTIFICATES, {
    variables: {
      filter: {
        auctionId: auctionId,
        searchTerm: searchTerm,
        propertyClass: propertyClass || undefined,
        minBidCount: minBidsFilter ? parseInt(minBidsFilter, 10) : undefined
      },
      page: page + 1, // GraphQL uses 1-based indexing, MUI uses 0-based
      limit: rowsPerPage
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network', // Ensures we fetch fresh data but still show cached data immediately
    skip: !auctionId, // Skip query if no auction ID is available
    onError: (error) => {
      console.error('Error fetching certificates:', error);
    }
  });

  const { data: bidsData, error: bidsError } = useQuery(GET_MY_BIDS);

  // Place bid mutation
  const [placeBid, { loading: placingBid }] = useMutation(PLACE_BID, {
    onCompleted: data => {
      setBidDialogOpen(false);
      refetch();
    },
    onError: error => {
      setBidError(error.message);
    },
  });

  // Cancel bid mutation
  const [cancelBid, { loading: cancellingBid }] = useMutation(CANCEL_BID, {
    onCompleted: data => {
      refetch();
    },
    onError: error => {
      alert(`Error cancelling bid: ${error.message}`);
    },
  });

  // Handle changes to individual bid rates
  const handleIndividualBidRateChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    certificateId: string
  ) => {
    setIndividualBidRates({
      ...individualBidRates,
      [certificateId]: event.target.value
    });
    
    // Clear any existing error for this certificate
    if (individualBidErrors[certificateId]) {
      const newErrors = { ...individualBidErrors };
      delete newErrors[certificateId];
      setIndividualBidErrors(newErrors);
    }
  };

  // Submit an individual bid directly from the table
  const submitIndividualBid = (certificateId: string) => {
    const bidRateValue = individualBidRates[certificateId];
    if (!bidRateValue) return;

    const rateValue = parseFloat(bidRateValue);
    if (isNaN(rateValue) || rateValue < 0 || rateValue > 18) {
      setIndividualBidErrors({
        ...individualBidErrors,
        [certificateId]: 'Rate must be 0-18%'
      });
      return;
    }

    placeBid({
      variables: {
        certificateId,
        interestRate: rateValue,
      },
    });

    // Clear the input after submission
    const newRates = { ...individualBidRates };
    delete newRates[certificateId];
    setIndividualBidRates(newRates);
  };

  // Handler for placing a bid
  const handlePlaceBid = (certificateId: string) => {
    const certificate = data?.certificates.certificates.find(
      (cert: any) => cert.id === certificateId
    );
    setCurrentCertificate(certificate);
    // Default to the current interest rate minus 0.25%
    setBidRate(Math.max(0.25, (certificate?.interestRate || 18) - 0.25).toFixed(2));
    setBidDialogOpen(true);
  };

  // Submit the bid
  const submitBid = () => {
    if (!currentCertificate || !bidRate) return;

    const rateValue = parseFloat(bidRate);
    if (isNaN(rateValue) || rateValue < 0 || rateValue > 18) {
      setBidError('Bid rate must be between 0% and 18%');
      return;
    }

    placeBid({
      variables: {
        certificateId: currentCertificate.id,
        interestRate: rateValue,
      },
    });
  };

  // Handle cancelling a bid
  const handleCancelBid = (certificateId: string) => {
    const existingBid = bidsData?.myBids.find((bid: any) => bid.certificateId === certificateId);
    if (!existingBid) return;
    
    if (window.confirm('Are you sure you want to cancel this bid?')) {
      cancelBid({
        variables: {
          bidId: existingBid.id
        }
      });
    }
  };

  // Pagination handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    // Fetch more data if needed for the new page
    if (data && newPage * rowsPerPage >= data.certificates.totalCount) {
      fetchMore({
        variables: {
          page: newPage + 1,
          limit: rowsPerPage
        }
      });
    }
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter handlers
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handlePropertyClassChange = (event: SelectChangeEvent) => {
    setPropertyClass(event.target.value);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setPropertyClass('');
    setMinBidsFilter('');
  };

  const applyFilters = () => {
    refetch();
  };

  // Select/deselect all certificates
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = data?.certificates.certificates.map((cert: any) => cert.id) || [];
      setSelectedCertificates(allIds);
    } else {
      setSelectedCertificates([]);
    }
  };

  // Select/deselect a single certificate
  const handleSelectCertificate = (
    event: React.ChangeEvent<HTMLInputElement>,
    certificateId: string
  ) => {
    if (event.target.checked) {
      setSelectedCertificates([...selectedCertificates, certificateId]);
    } else {
      setSelectedCertificates(selectedCertificates.filter(id => id !== certificateId));
    }
  };

  // Mass bidding on all selected certificates
  const handleMassBidding = () => {
    if (selectedCertificates.length === 0) return;
    // Set default mass bid rate (18% or lowest current rate minus 0.25%)
    let defaultRate = 18;
    if (data?.certificates?.certificates) {
      const selectedCerts = data.certificates.certificates.filter((cert: any) => 
        selectedCertificates.includes(cert.id)
      );
      const lowestRate = Math.min(...selectedCerts.map((cert: any) => cert.interestRate || 18));
      defaultRate = Math.max(0.25, lowestRate - 0.25);
    }
    setMassBidRate(defaultRate.toFixed(2));
    setMassBidError('');
    setMassBidDialogOpen(true);
  };

  // Submit mass bids
  const submitMassBids = async () => {
    if (!massBidRate || selectedCertificates.length === 0) return;

    const rateValue = parseFloat(massBidRate);
    if (isNaN(rateValue) || rateValue < 0 || rateValue > 18) {
      setMassBidError('Bid rate must be between 0% and 18%');
      return;
    }

    setMassBidding(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      // Process bids in sequence to avoid overwhelming the server
      for (const certificateId of selectedCertificates) {
        // Skip certificates that already have bids
        if (hasBid(certificateId)) continue;
        
        try {
          await placeBid({
            variables: {
              certificateId,
              interestRate: rateValue,
            },
          });
          successCount++;
        } catch (error) {
          errorCount++;
          console.error(`Error placing bid on ${certificateId}:`, error);
        }
      }

      // Close dialog and show summary
      setMassBidDialogOpen(false);
      alert(`Mass bidding complete: ${successCount} bids placed successfully, ${errorCount} failed.`);
      refetch();
    } finally {
      setMassBidding(false);
    }
  };

  // Check if a certificate already has a bid from the current user
  const hasBid = (certificateId: string) => {
    // Handle errors by returning false
    if (!bidsData || !bidsData.myBids) return false;
    return bidsData.myBids.some((bid: any) => bid.certificateId === certificateId) || false;
  };

  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  // Show loading state while fetching auction data
  if (auctionLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Loading Auction Data
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Show error state if auction data fetch fails
  if (auctionError) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom color="error">
          Error Loading Auction
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">
            Could not load auction data. The auction may not exist or there was a connection issue.
          </Alert>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 4 }}
            onClick={() => navigate('/bidder/auctions')}
          >
            Return to Auctions
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <>
      {auctionId && <CountyHeader />}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Place Bids
        </Typography>

        {/* Error alert for certificate fetch errors */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small" onClick={() => refetch()}>
                Retry
              </Button>
            }
          >
            Error loading certificate data: {error.message}
          </Alert>
        )}

        {/* Budget Details Section */}
        <StyledBox>
          <StyledHeading variant="h6">Budget Details</StyledHeading>
          <Typography>
            Total Certificates Bid On: {bidsData?.myBids?.length || 0}
            &nbsp;&nbsp;&nbsp; Bid Count: {selectedCertificates.length}
          </Typography>
          {bidsError && (
            <Alert severity="warning" sx={{ mt: 1 }}>
              Unable to fetch your existing bids. You may continue browsing properties.
            </Alert>
          )}
        </StyledBox>

        {/* Quick Find Section */}
        <StyledBox sx={{ py: 1.5 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <Box display="flex" alignItems="center">
                <TextField
                  label="Search"
                  variant="outlined"
                  size="small"
                  fullWidth
                  placeholder="Search by parcel ID, address, or owner"
                  value={searchTerm}
                  onChange={handleSearch}
                  sx={{ flex: 1 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: searchTerm ? (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setSearchTerm('')}
                          edge="end"
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    ) : null,
                  }}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box display="flex" gap={1}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={applyFilters}
                  startIcon={<SearchIcon />}
                  sx={{ flex: 1 }}
                >
                  Search
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleClearFilters}
                  startIcon={<ClearIcon />}
                >
                  Clear
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => refetch()}
                  startIcon={<RefreshIcon />}
                >
                  Refresh
                </Button>
              </Box>
            </Grid>
          </Grid>
        </StyledBox>

        {/* Advanced Filters */}
        <Accordion sx={{ mb: 3 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display="flex" alignItems="center">
              <FilterIcon sx={{ mr: 1 }} />
              <Typography>Advanced Filters</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel id="property-type-label">Property Type</InputLabel>
                  <Select
                    labelId="property-type-label"
                    id="property-type"
                    value={propertyClass}
                    label="Property Type"
                    onChange={handlePropertyClassChange}
                    fullWidth
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="RESIDENTIAL">Residential</MenuItem>
                    <MenuItem value="COMMERCIAL">Commercial</MenuItem>
                    <MenuItem value="INDUSTRIAL">Industrial</MenuItem>
                    <MenuItem value="AGRICULTURAL">Agricultural</MenuItem>
                    <MenuItem value="VACANT_LOT">Vacant Lot</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  label="Minimum Bids"
                  type="number"
                  fullWidth
                  value={minBidsFilter}
                  onChange={e => setMinBidsFilter(e.target.value)}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 6, md: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={applyFilters}
                  fullWidth
                >
                  Apply Filters
                </Button>
              </Grid>
              <Grid size={{ xs: 6, sm: 6, md: 2 }}>
                <Button variant="outlined" onClick={handleClearFilters} fullWidth>
                  Clear All
                </Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Mass Bidding Section */}
        <StyledBox>
          <StyledHeading variant="h6">Mass Bidding</StyledHeading>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleMassBidding}
              disabled={selectedCertificates.length === 0 || massBidding}
              startIcon={massBidding ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {massBidding ? 'Processing...' : `Bid on ${selectedCertificates.length} selected certificate${selectedCertificates.length !== 1 ? 's' : ''}`}
            </Button>
            {selectedCertificates.length > 0 && (
              <Typography variant="body2" sx={{ ml: 2 }}>
                {selectedCertificates.length} certificate{selectedCertificates.length !== 1 ? 's' : ''} selected
              </Typography>
            )}
          </Box>
          {massBidError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {massBidError}
            </Alert>
          )}
        </StyledBox>

        {/* Results Table */}
        <Paper sx={{ width: '100%', overflow: 'hidden', mt: 3 }}>
          {error ? (
            <Alert severity="error" sx={{ m: 2 }}>
              {error.message}
            </Alert>
          ) : loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          onChange={handleSelectAll}
                          checked={
                            data?.certificates.certificates.length > 0 &&
                            selectedCertificates.length === data?.certificates.certificates.length
                          }
                          indeterminate={
                            selectedCertificates.length > 0 &&
                            selectedCertificates.length <
                              (data?.certificates.certificates.length || 0)
                          }
                        />
                      </TableCell>
                      <TableCell>Seq#</TableCell>
                      <TableCell>Parcel ID</TableCell>
                      <TableCell>Address</TableCell>
                      <TableCell>Owner</TableCell>
                      <TableCell>Face Value</TableCell>
                      <TableCell>Bids</TableCell>
                      <TableCell>Your Bid</TableCell>
                      <TableCell>Place Bid</TableCell>
                      <TableCell>Cancel Bid</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.certificates.certificates.map((certificate: any, index: number) => {
                      const hasExistingBid = hasBid(certificate.id);

                      return (
                        <TableRow key={certificate.id}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedCertificates.includes(certificate.id)}
                              onChange={e => handleSelectCertificate(e, certificate.id)}
                            />
                          </TableCell>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            {certificate.parcelId || certificate.certificateNumber}
                          </TableCell>
                          <TableCell>
                            {certificate.property ? (
                              <Tooltip
                                title={`${certificate.property.address}, ${certificate.property.city}, ${certificate.property.state} ${certificate.property.zipCode}`}
                              >
                                <span>
                                  {certificate.propertyAddress ||
                                    certificate.property.address ||
                                    'N/A'}
                                </span>
                              </Tooltip>
                            ) : (
                              certificate.propertyAddress || 'N/A'
                            )}
                          </TableCell>
                          <TableCell>{certificate.ownerName || 'N/A'}</TableCell>
                          <TableCell>{formatCurrency(certificate.faceValue || 0)}</TableCell>
                          <TableCell>{certificate.bidCount || 0}</TableCell>
                          <TableCell>
                            {hasExistingBid
                              ? `${bidsData?.myBids.find((bid: any) => bid.certificateId === certificate.id)?.interestRate.toFixed(2)}%`
                              : ''}
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              placeholder="%"
                              sx={{ width: 80 }}
                              disabled={hasExistingBid}
                              value={individualBidRates[certificate.id] || ''}
                              onChange={(e) => handleIndividualBidRateChange(e, certificate.id)}
                              error={!!individualBidErrors[certificate.id]}
                              helperText={individualBidErrors[certificate.id] || ''}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      size="small"
                                      color="primary"
                                      onClick={() => submitIndividualBid(certificate.id)}
                                      disabled={hasExistingBid || !individualBidRates[certificate.id]}
                                    >
                                      <PlusIcon />
                                    </IconButton>
                                  </InputAdornment>
                                )
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton 
                              color="error" 
                              disabled={!hasExistingBid}
                              onClick={() => hasExistingBid && handleCancelBid(certificate.id)}
                            >
                              <ClearIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={data?.certificates.totalCount || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </Paper>

        {/* Bid Dialog */}
        <Dialog open={bidDialogOpen} onClose={() => setBidDialogOpen(false)}>
          <DialogTitle>Place Bid</DialogTitle>
          <DialogContent>
            {currentCertificate && (
              <>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1">
                    Certificate: {currentCertificate.certificateNumber}
                  </Typography>
                  <Typography variant="body2">
                    Property:{' '}
                    {currentCertificate.propertyAddress ||
                      (currentCertificate.property
                        ? `${currentCertificate.property.address}, ${currentCertificate.property.city}, ${currentCertificate.property.state}`
                        : 'N/A')}
                  </Typography>
                  <Typography variant="body2">
                    Parcel ID: {currentCertificate.parcelId || 'N/A'}
                  </Typography>
                  <Typography variant="body2">
                    Face Value: {formatCurrency(currentCertificate.faceValue || 0)}
                  </Typography>
                  <Typography variant="body2">
                    Current Interest Rate: {currentCertificate.interestRate || 18}%
                  </Typography>
                </Box>

                <TextField
                  label="Your Bid Rate (%)"
                  type="number"
                  fullWidth
                  value={bidRate}
                  onChange={e => setBidRate(e.target.value)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  error={!!bidError}
                  helperText={bidError || 'Enter an interest rate between 0% and 18%'}
                  sx={{ mt: 2 }}
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBidDialogOpen(false)}>Cancel</Button>
            <Button onClick={submitBid} variant="contained" color="primary" disabled={placingBid}>
              {placingBid ? <CircularProgress size={24} /> : 'Place Bid'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Mass Bid Dialog */}
        <Dialog open={massBidDialogOpen} onClose={() => !massBidding && setMassBidDialogOpen(false)}>
          <DialogTitle>Place Mass Bids</DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 3, mt: 1 }}>
              <Typography variant="body1">
                You are about to place bids on {selectedCertificates.length} certificates.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                This will only place bids on certificates that you haven't already bid on.
              </Typography>
            </Box>

            <TextField
              label="Bid Rate (%)"
              type="number"
              fullWidth
              value={massBidRate}
              onChange={e => setMassBidRate(e.target.value)}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              error={!!massBidError}
              helperText={massBidError || 'Enter an interest rate between 0% and 18%'}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setMassBidDialogOpen(false)} disabled={massBidding}>
              Cancel
            </Button>
            <Button 
              onClick={submitMassBids} 
              variant="contained" 
              color="primary" 
              disabled={massBidding}
            >
              {massBidding ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  Processing...
                </Box>
              ) : 'Place Bids'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default PlaceBidsPage;
