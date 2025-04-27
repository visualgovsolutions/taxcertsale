import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  Divider,
  Button,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  List,
  ListItem,
  ListItemText,
  Grid
} from '@mui/material';
import Alert from '@mui/material/Alert';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

// GraphQL query to fetch certificate details
const GET_CERTIFICATE_DETAIL = gql`
  query GetCertificateDetail($id: ID!) {
    certificate(id: $id) {
      id
      certificateNumber
      parcelId
      propertyAddress
      faceValue
      interestRate
      status
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

// Status chip component with coloring
const StatusChip = ({ status }: { status: string }) => {
  let color = 'default';
  
  switch (status.toLowerCase()) {
    case 'active':
      color = 'success';
      break;
    case 'redeemed':
      color = 'info';
      break;
    case 'sold':
      color = 'primary';
      break;
    case 'expired':
      color = 'error';
      break;
    default:
      color = 'default';
  }
  
  return (
    <Chip 
      label={status.toUpperCase()} 
      color={color as any} 
      size="small" 
      sx={{ fontWeight: 'bold' }}
    />
  );
};

// Update the interface definition
interface Certificate {
  id: string;
  certificateNumber: string;
  parcelId: string;
  propertyAddress: string;
  faceValue: number;
  interestRate: number;
  status: string;
  countyId: string;
  createdAt: string;
  updatedAt: string;
}

const BidderCertificateDetailPage: React.FC = () => {
  const { certificateId } = useParams<{ certificateId: string }>();
  const navigate = useNavigate();
  
  const { loading, error, data } = useQuery(GET_CERTIFICATE_DETAIL, {
    variables: { id: certificateId },
    fetchPolicy: 'network-only',
  });

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading certificate details...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h5" color="error" gutterBottom>
          Error Loading Certificate
        </Typography>
        <Typography variant="body1">
          {error.message}
        </Typography>
        <Button 
          component={Link} 
          to="/bidder/auctions"
          variant="contained"
          sx={{ mt: 2 }}
        >
          Return to Auctions
        </Button>
      </Container>
    );
  }

  const certificate = data?.certificate;

  if (!certificate) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h5" gutterBottom>
          Certificate Not Found
        </Typography>
        <Typography variant="body1">
          The certificate you are looking for could not be found.
        </Typography>
        <Button 
          component={Link} 
          to="/bidder/auctions"
          variant="contained"
          sx={{ mt: 2 }}
        >
          Return to Auctions
        </Button>
      </Container>
    );
  }

  // Add the missing handlePlaceBid function
  const handlePlaceBid = () => {
    navigate(`/bidder/certificates/${certificate.id}/bid`);
  };

  return (
    <Container sx={{ py: 4 }}>
      {/* Header with navigation */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">
          Certificate Details
        </Typography>
        <Button 
          component={Link} 
          to="/bidder/auctions"
          variant="outlined"
        >
          Back to Auctions
        </Button>
      </Box>

      {/* Certificate Summary Card */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Certificate #{certificate.certificateNumber}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {certificate.propertyAddress || 'No address available'}
            </Typography>
          </Box>
          <StatusChip status={certificate.status} />
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Card>
              <CardHeader title="Certificate Details" />
              <CardContent>
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="Certificate Number" 
                      secondary={certificate.certificateNumber} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Parcel ID" 
                      secondary={certificate.parcelId} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Property Address" 
                      secondary={certificate.propertyAddress} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Face Value" 
                      secondary={formatCurrency(certificate.faceValue)} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Interest Rate" 
                      secondary={`${certificate.interestRate}%`} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Status" 
                      secondary={certificate.status} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="County ID" 
                      secondary={certificate.countyId} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Created At" 
                      secondary={new Date(certificate.createdAt).toLocaleString()} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Updated At" 
                      secondary={new Date(certificate.updatedAt).toLocaleString()} 
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Card>
              <CardHeader title="Bidding Information" />
              <CardContent>
                {certificate.status === 'AUCTION_ACTIVE' ? (
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handlePlaceBid}
                  >
                    Place Bid
                  </Button>
                ) : (
                  <Typography variant="body1">
                    This certificate is not available for bidding.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Paper>

      {/* Property Details Section */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Property Information
      </Typography>
      
      <Grid container spacing={3}>
        {/* Property Details Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader 
              title="Parcel Details" 
              sx={{ 
                backgroundColor: '#f5f5f5',
                pb: 1
              }} 
            />
            <CardContent>
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold', width: '40%' }}>
                        Parcel ID
                      </TableCell>
                      <TableCell>{certificate.parcelId || 'Not Available'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold' }}>
                        Property Address
                      </TableCell>
                      <TableCell>{certificate.propertyAddress || 'Not Available'}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Property Appraiser Placeholder */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader 
              title="Property Appraiser Data" 
              sx={{ 
                backgroundColor: '#f5f5f5',
                pb: 1
              }} 
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                (Mock property appraiser details like owner, assessed value, etc. would be displayed here.)
              </Typography>
              {/* Placeholder for appraiser data table/list */}
            </CardContent>
          </Card>
        </Grid>

        {/* Map Placeholder */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader 
              title="Property Location" 
              sx={{ 
                backgroundColor: '#f5f5f5',
                pb: 1
              }} 
            />
            <CardContent>
              <Box sx={{ height: 300, backgroundColor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  (Google Map integration placeholder - showing location based on address/coordinates)
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* County Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader 
              title="County Information" 
              sx={{ 
                backgroundColor: '#f5f5f5',
                pb: 1
              }} 
            />
            <CardContent>
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold', width: '50%' }}>
                        County ID
                      </TableCell>
                      <TableCell>{certificate.countyId || 'Not Available'}</TableCell>
                    </TableRow>
                    {/* Add link to county website if available */}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BidderCertificateDetailPage; 