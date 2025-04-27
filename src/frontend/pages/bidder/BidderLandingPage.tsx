import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button,
  Divider,
  AppBar,
  Toolbar,
  List,
  ListItem,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import Grid from '@mui/material/Grid';

const BidderLandingPage: React.FC = () => {
  // Mock data - would be fetched from API in real implementation
  const bidderSummary = {
    w9Form: false,
    bidderAgreement: false,
    bidderNumber: false,
    totalBidCount: 0,
    totalBidAmount: 0,
    totalDeposit: 0,
    depositShortage: 0
  };

  const auctionSummary = {
    countyName: 'Practice',
    status: 'Accepting Bids',
    startDate: '4/1/2025',
    endDate: '5/31/2025',
    advertisedItems: 1855,
    maxBid: '18.00 %',
    minBid: '0.00 %',
    bidIncrement: '0.25 %',
    biddableProperties: 1855,
    biddablePropertiesValue: '$2,640,843.70'
  };

  return (
    <Box sx={{ 
      flexGrow: 1,
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      {/* Red header */}
      <Box sx={{ 
        height: '100px', 
        backgroundColor: 'red', 
        width: '100%',
        mb: 2
      }} />

      {/* Navigation menu */}
      <Box sx={{ 
        backgroundColor: '#fff',
        mb: 2,
        borderTop: '1px solid #ddd',
        borderBottom: '1px solid #ddd',
        padding: '8px 16px'
      }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Link to="/bidder/auction-summary" style={{ textDecoration: 'none', color: 'navy' }}>
            Auction Summary
          </Link>
          <Link to="/bidder/search" style={{ textDecoration: 'none', color: 'navy' }}>
            Search
          </Link>
          <Link to="/bidder/place-bids" style={{ textDecoration: 'none', color: 'navy' }}>
            Place Bids
          </Link>
          <Link to="/bidder/my-bids" style={{ textDecoration: 'none', color: 'navy' }}>
            My Bids
          </Link>
          <Link to="/bidder/deposit" style={{ textDecoration: 'none', color: 'navy' }}>
            Deposit
          </Link>
          <Link to="/bidder/w9-form" style={{ textDecoration: 'none', color: 'navy' }}>
            W9 Form
          </Link>
          <Link to="/bidder/upload-bids" style={{ textDecoration: 'none', color: 'navy' }}>
            Upload Bids
          </Link>
          <Link to="/bidder/change-password" style={{ textDecoration: 'none', color: 'navy' }}>
            Change Password
          </Link>
          <Link to="/bidder/support" style={{ textDecoration: 'none', color: 'navy' }}>
            Support
          </Link>
        </Box>
      </Box>

      <Container>
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
                  <Typography variant="body1">{auctionSummary.countyName}</Typography>
                </ListItem>
                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body1">Auction Status:</Typography>
                  <Typography variant="body1">{auctionSummary.status}</Typography>
                </ListItem>
                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body1">Auction Start Date:</Typography>
                  <Typography variant="body1">{auctionSummary.startDate}</Typography>
                </ListItem>
                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body1">Auction Closes:</Typography>
                  <Typography variant="body1">{auctionSummary.endDate}</Typography>
                </ListItem>
                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body1">Advertised Items:</Typography>
                  <Typography variant="body1">{auctionSummary.advertisedItems}</Typography>
                </ListItem>
                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body1">Maximum Bid:</Typography>
                  <Typography variant="body1">{auctionSummary.maxBid}</Typography>
                </ListItem>
                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body1">Minimum Bid:</Typography>
                  <Typography variant="body1">{auctionSummary.minBid}</Typography>
                </ListItem>
                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body1">Bid Increment:</Typography>
                  <Typography variant="body1">{auctionSummary.bidIncrement}</Typography>
                </ListItem>
                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body1">Biddable Properties:</Typography>
                  <Typography variant="body1">{auctionSummary.biddableProperties}</Typography>
                </ListItem>
                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body1">Biddable Properties Value:</Typography>
                  <Typography variant="body1">{auctionSummary.biddablePropertiesValue}</Typography>
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>

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
    </Box>
  );
};

export default BidderLandingPage; 