import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  CircularProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Chip,
  Alert,
  Card,
  CardContent,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem
} from '@mui/material';
import Grid from '@mui/material/Grid';
import CountyHeader from '../../components/bidder/CountyHeader';
// TODO: Import necessary components (Table, Button, TextField, etc.)
// TODO: Import GraphQL queries (GET_AUCTION_DETAILS, GET_PARCELS_FOR_AUCTION, PLACE_BID)

// GraphQL query to fetch auction details with parcels
const GET_AUCTION_WITH_PARCELS = gql`
  query GetAuctionWithParcels($id: ID!) {
    auction(id: $id) {
      id
      name
      description
      status
      auctionDate
      startTime
      endTime
      location
      countyId
    }
    certificatesByAuction(auctionId: $id) {
      id
      parcelId
      propertyAddress
      ownerName
      faceValue
      status
    }
  }
`;

// GraphQL mutation for placing a bid
const PLACE_BID = gql`
  mutation PlaceBid($certificateId: ID!, $interestRate: Float!) {
    createBid(certificateId: $certificateId, interestRate: $interestRate) {
      id
      certificateId
      interestRate
      status
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
    // Check if it's just a time string like "10:00 AM" without a date
    if (dateString.match(/^\d{1,2}:\d{2}(\s?[AP]M)?$/i)) {
      return dateString; // Return the time string as is
    }
    
    const date = new Date(dateString);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return dateString; // Return the original string if not a valid date
    }
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString || 'N/A';
  }
};

// Status chip component
const StatusChip = ({ status }: { status: string }) => {
  let color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" = "default";
  
  switch (status.toUpperCase()) {
    case 'ACTIVE':
      color = "success";
      break;
    case 'UPCOMING':
      color = "warning";
      break;
    case 'COMPLETED':
      color = "info";
      break;
    case 'CANCELLED':
      color = "error";
      break;
    default:
      color = "default";
  }
  
  return <Chip label={status} color={color} size="small" />;
};

interface CountyAuctionPageProps {}

const CountyAuctionPage: React.FC<CountyAuctionPageProps> = () => {
  const { auctionId } = useParams<{ auctionId: string }>();
  const [bidAmount, setBidAmount] = useState<{ [key: string]: string }>({});
  const [openBidDialog, setOpenBidDialog] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState<any>(null);
  const isCountyContext = !!auctionId;
  
  const { loading, error, data, refetch } = useQuery(GET_AUCTION_WITH_PARCELS, {
    variables: { id: auctionId },
    fetchPolicy: 'network-only',
  });

  const [placeBid, { loading: bidLoading }] = useMutation(PLACE_BID, {
    onCompleted: () => {
      setOpenBidDialog(false);
      refetch();
    },
    onError: (error) => {
      console.error("Error placing bid:", error);
    }
  });

  const handleBidClick = (parcel: any) => {
    setSelectedParcel(parcel);
    setOpenBidDialog(true);
  };

  const handleBidSubmit = () => {
    if (!selectedParcel || !bidAmount[selectedParcel.id]) return;
    
    const interestRate = parseFloat(bidAmount[selectedParcel.id]);
    if (isNaN(interestRate) || interestRate <= 0) return;

    placeBid({
      variables: {
        certificateId: selectedParcel.id,
        interestRate: interestRate
      }
    });
  };

  const handleBidInputChange = (id: string, value: string) => {
    if (value === '' || /^\d{1,2}(\.\d{0,2})?$/.test(value)) {
      setBidAmount(prev => ({
        ...prev,
        [id]: value
      }));
    }
  };

  if (loading) return (
    <>
      {/* CRITICAL PATH: County Header must be first element */}
      {isCountyContext && <CountyHeader />}
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    </>
  );

  if (error) return (
    <>
      {/* CRITICAL PATH: County Header must be first element */}
      {isCountyContext && <CountyHeader />}
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">
          Error loading auction data: {error.message}
        </Alert>
      </Container>
    </>
  );

  const auction = data?.auction;
  const parcels = data?.certificatesByAuction || [];
  
  // Removed hardcoded county information
  // const countyName = "County"; // This should be fetched from the API
  // const countyState = "FL"; // This should be fetched from the API
  // const countyColor = "#1976d2"; // This should be fetched from the API or use a default
  
  const isAuthenticated = true; // Replace with actual auth logic
  const isQualifiedBidder = true; // Replace with actual qualification check

  // Check if auction is active
  const isAuctionActive = auction?.status === 'ACTIVE';

  // Check if we need to add a W9 Form reminder banner
  const renderW9FormBanner = () => {
    const countyName = auction?.county?.name || 'this county';
    
    return (
      <Box sx={{ mb: 4 }}>
        <Alert severity="info" 
          action={
            <Button 
              color="inherit" 
              size="small" 
              component={Link} 
              to={`/bidder/county-auction/${auctionId}/w9-form`}
            >
              Fill W9 Form
            </Button>
          }
        >
          To participate in the bidding for {countyName}, you need to submit a completed W9 form.
        </Alert>
      </Box>
    );
  };

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#f5f5f5', padding: 0 }}>
      {/* CRITICAL PATH: County Header must be first element */}
      {isCountyContext && <CountyHeader />}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {renderW9FormBanner()}
        
        {/* Auction Summary Section */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h1" gutterBottom>
              {auction?.name || 'Auction Details'}
            </Typography>
            <StatusChip status={auction?.status || 'Unknown'} />
          </Box>
        </Paper>

        <Grid container spacing={2}>
          {/* Bidder Summary */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" color="error" gutterBottom>
                Bidder Summary
              </Typography>
              <List disablePadding>
                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body1">W9Form:</Typography>
                  <Typography variant="body1" color="error">✕</Typography>
                </ListItem>
                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body1">Approve Bidder Agreement:</Typography>
                  <Typography variant="body1" color="error">✕</Typography>
                </ListItem>
                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body1">Bidder Number:</Typography>
                  <Typography variant="body1" color="error">✕</Typography>
                </ListItem>
                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body1">Total Bid Count:</Typography>
                  <Typography variant="body1">0</Typography>
                </ListItem>
                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body1">Total Bid Amount:</Typography>
                  <Typography variant="body1">$0.00</Typography>
                </ListItem>
                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body1">Total Deposit:</Typography>
                  <Typography variant="body1">0</Typography>
                </ListItem>
                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body1">Deposit Shortage or Overage:</Typography>
                  <Typography variant="body1">$0.00</Typography>
                </ListItem>
                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body1">Deposit History:</Typography>
                  <Typography variant="body1"></Typography>
                </ListItem>
              </List>
            </Paper>
          </Grid>

          {/* Auction Summary */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" color="error" gutterBottom>
                Auction Summary
              </Typography>
              <List disablePadding>
                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body1">County Name:</Typography>
                  <Typography variant="body1">{auction?.county?.name || 'County'}</Typography>
                </ListItem>
                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body1">Auction Status:</Typography>
                  <Typography variant="body1">{auction?.status || 'Accepting Bids'}</Typography>
                </ListItem>
                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body1">Auction Start Date:</Typography>
                  <Typography variant="body1">{formatDate(auction?.auctionDate || '')}</Typography>
                </ListItem>
                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body1">Auction Closes:</Typography>
                  <Typography variant="body1">{auction?.endTime || '5/31/2025'}</Typography>
                </ListItem>
                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body1">Advertised Items:</Typography>
                  <Typography variant="body1">{parcels.length}</Typography>
                </ListItem>
                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body1">Maximum Bid:</Typography>
                  <Typography variant="body1">18.00 %</Typography>
                </ListItem>
                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body1">Minimum Bid:</Typography>
                  <Typography variant="body1">0.00 %</Typography>
                </ListItem>
                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body1">Bid Increment:</Typography>
                  <Typography variant="body1">0.25 %</Typography>
                </ListItem>
                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body1">Biddable Properties:</Typography>
                  <Typography variant="body1">{parcels.length}</Typography>
                </ListItem>
                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body1">Biddable Properties Value:</Typography>
                  <Typography variant="body1">
                    {
                      formatCurrency(
                        parcels.reduce((total: number, parcel: any) => 
                          total + (parcel.faceValue || 0), 0)
                      )
                    }
                  </Typography>
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>

        {/* Action buttons */}
        <Box sx={{ mt: 3, mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Button 
            component={Link} 
            to={`/bidder/county-auction/${auctionId}/w9-form`}
            variant="contained" 
            color="primary"
            startIcon={<span>📝</span>}
          >
            Submit W9 Form
          </Button>
          <Button 
            component={Link} 
            to={`/bidder/county-auction/${auctionId}/deposit`}
            variant="contained" 
            color="primary"
            startIcon={<span>💰</span>}
          >
            Make Deposit
          </Button>
          <Button 
            component={Link} 
            to={`/bidder/county-auction/${auctionId}/search`}
            variant="contained" 
            color="primary"
            startIcon={<span>🔍</span>}
          >
            Search Parcels
          </Button>
          <Button 
            component={Link} 
            to={`/bidder/county-auction/${auctionId}/place-bids`}
            variant="contained" 
            color="primary"
            startIcon={<span>🏷️</span>}
          >
            Place Bids
          </Button>
          <Button 
            component={Link} 
            to={`/bidder/county-auction/${auctionId}/upload-bids`}
            variant="contained" 
            color="primary"
            startIcon={<span>📤</span>}
          >
            Upload Bids
          </Button>
        </Box>

        {/* Copyright footer */}
        <Box sx={{ 
          textAlign: 'center', 
          mt: 4, 
          mb: 2, 
          color: '#666',
          borderTop: '1px solid #ddd',
          pt: 2
        }}>
          <Typography variant="body2">
            Copyright VisualGov Solutions LLC 2025 ©
          </Typography>
        </Box>
      </Container>

      {/* Bid confirmation dialog */}
      <Dialog open={openBidDialog} onClose={() => setOpenBidDialog(false)}>
        <DialogTitle>Confirm Your Bid</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are bidding <strong>{bidAmount[selectedParcel?.id || ''] || 0}%</strong> interest rate on:
            <br /><br />
            <strong>Parcel ID:</strong> {selectedParcel?.parcelId}<br />
            <strong>Address:</strong> {selectedParcel?.propertyAddress || 'N/A'}<br />
            <strong>Tax Amount:</strong> {selectedParcel ? formatCurrency(selectedParcel.faceValue) : '$0.00'}
            <br /><br />
            This means if your bid wins and the property owner redeems their taxes, you will receive this interest percentage on the tax amount.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBidDialog(false)} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleBidSubmit} 
            color="primary" 
            variant="contained" 
            disabled={bidLoading}
          >
            {bidLoading ? 'Submitting...' : 'Confirm Bid'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CountyAuctionPage; 