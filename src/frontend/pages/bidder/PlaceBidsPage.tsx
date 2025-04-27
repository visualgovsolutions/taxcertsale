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
  const [currentCertificate, setCurrentCertificate] = useState<any>(null);
  const [bidRate, setBidRate] = useState<string>('');
  const [bidError, setBidError] = useState<string>('');

  // Fetch active auctions if no auctionId in the URL
  const { data: auctionsData } = useQuery(GET_ACTIVE_AUCTIONS, {
    skip: !!auctionId,
  });

  // Redirect to the first active auction if accessed directly
  useEffect(() => {
    if (!auctionId && auctionsData?.activeAuctions) {
      if (auctionsData.activeAuctions.length > 0) {
        const firstAuction = auctionsData.activeAuctions[0];
        navigate(`/bidder/county-auction/${firstAuction.id}/place-bids`, { replace: true });
      } else {
        // No active auctions available
        console.log('No active auctions available for bidding');
      }
    }
  }, [auctionId, auctionsData, navigate]);

  // Queries to fetch certificates and existing bids
  const { loading, error, data, refetch } = useQuery(GET_AUCTION_CERTIFICATES, {
    variables: {
      filter: {
        auctionId: auctionId || undefined,
        searchTerm: searchTerm || undefined,
        propertyClass: propertyClass || undefined,
        minBids: minBidsFilter ? parseInt(minBidsFilter) : undefined,
      },
      page: page + 1, // API uses 1-based indexing
      limit: rowsPerPage,
    },
    skip: !auctionId,
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

  // Pagination handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter handlers
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setPropertyClass('');
    setMinBidsFilter('');
  };

  const handleFilterBidCount = () => {
    refetch();
  };

  const handleClearBidCount = () => {
    setMinBidsFilter('');
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
    alert(`Mass bidding on ${selectedCertificates.length} certificates`);
    // In a real app, this would open a dialog to set the bid rate for all selected certificates
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

  // Show auction selection UI if no auctionId is provided
  if (!auctionId) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Select an Auction to Place Bids
        </Typography>

        {!auctionsData ? (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : auctionsData.activeAuctions?.length > 0 ? (
          <Box sx={{ mt: 4 }}>
            <Typography variant="body1" paragraph>
              Please select an auction below:
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {auctionsData.activeAuctions.map((auction: any) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={auction.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {auction.name}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => navigate(`/bidder/county-auction/${auction.id}/place-bids`)}
                      >
                        Place Bids
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <Box sx={{ mt: 4 }}>
            <Alert severity="info">
              There are no active auctions available for bidding at this time.
            </Alert>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 4 }}
              onClick={() => navigate('/bidder/auctions')}
            >
              View All Auctions
            </Button>
          </Box>
        )}
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Place Bids
      </Typography>

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
                select
                label="Search By"
                defaultValue="SEQ#"
                size="small"
                sx={{ width: '150px', mr: 1 }}
              >
                <MenuItem value="SEQ#">SEQ#</MenuItem>
                <MenuItem value="PARCEL">Parcel ID</MenuItem>
                <MenuItem value="ADDRESS">Address</MenuItem>
                <MenuItem value="OWNER">Owner Name</MenuItem>
              </TextField>
              <TextField
                fullWidth
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => refetch()}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                onClick={() => refetch()}
                sx={{ mr: 1 }}
                startIcon={<SearchIcon />}
              >
                Search
              </Button>
              <Button variant="outlined" onClick={handleClearFilters} startIcon={<ClearIcon />}>
                Clear
              </Button>
            </Box>
          </Grid>
        </Grid>
      </StyledBox>

      {/* Filters Section - Collapsible */}
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Advanced Filters</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Property Type</InputLabel>
                <Select
                  value={propertyClass}
                  onChange={e => setPropertyClass(e.target.value)}
                  label="Property Type"
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="SINGLE FAMILY">Single Family</MenuItem>
                  <MenuItem value="MOBILE HOME">Mobile Home</MenuItem>
                  <MenuItem value="NON AG ACREAGE">Non Ag Acreage</MenuItem>
                  <MenuItem value="VACANT">Vacant</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box display="flex" alignItems="center">
                <Typography variant="body2" sx={{ mr: 1 }}>
                  Min Bids:
                </Typography>
                <TextField
                  size="small"
                  value={minBidsFilter}
                  onChange={e => setMinBidsFilter(e.target.value)}
                  sx={{ width: 80 }}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 6, sm: 6, md: 3 }}>
              <Button variant="contained" color="primary" onClick={handleFilterBidCount} fullWidth>
                Apply Filters
              </Button>
            </Grid>
            <Grid size={{ xs: 6, sm: 6, md: 3 }}>
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
        <Button
          variant="contained"
          color="primary"
          onClick={handleMassBidding}
          disabled={selectedCertificates.length === 0}
        >
          Bid on all selected certificates
        </Button>
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
                        <TableCell>{Math.floor(Math.random() * 5)}</TableCell>
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
                          />
                          <IconButton
                            color="primary"
                            onClick={() => handlePlaceBid(certificate.id)}
                            disabled={hasExistingBid}
                          >
                            <PlusIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <IconButton color="error" disabled={!hasExistingBid}>
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
    </Container>
  );
};

export default PlaceBidsPage;
