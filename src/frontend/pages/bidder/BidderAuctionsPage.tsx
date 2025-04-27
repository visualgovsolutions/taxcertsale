import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { 
  Container, 
  Tabs, 
  Tab, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  CircularProgress,
  Chip,
  Card,
  CardContent,
  CardActionArea,
  CardActions,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  InputAdornment,
  Alert
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import * as MuiGrid from '@mui/material/Grid';

// Define TypeScript interfaces
interface Certificate {
  id: string;
  certificateNumber: string;
  parcelId: string;
  propertyAddress?: string;
  faceValue: number;
  status: string;
  interestRate: number;
  countyId: string;
  ownerName?: string;
  createdAt: string;
  updatedAt: string;
}

interface Auction {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  status: string;
  location: string;
}

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

const formatDateTime = (dateString: string): string => {
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
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch (error) {
    console.error("Error formatting date and time:", error);
    return dateString || 'N/A';
  }
};

// GraphQL query to fetch active auctions
const GET_ACTIVE_AUCTIONS = gql`
  query GetActiveAuctions {
    activeAuctions {
      id
      name
      startTime
      endTime
      status
      location
    }
  }
`;

// GraphQL query to fetch upcoming auctions
const GET_UPCOMING_AUCTIONS = gql`
  query GetUpcomingAuctions {
    upcomingAuctions {
      id
      name
      startTime
      endTime
      status
      location
    }
  }
`;

// GraphQL query to fetch certificates by auction
const GET_CERTIFICATES_BY_AUCTION = gql`
  query GetCertificatesByAuction($auctionId: ID!) {
    certificatesByAuction(auctionId: $auctionId) {
      id
      certificateNumber
      parcelId
      propertyAddress
      faceValue
      status
      interestRate
      countyId
      ownerName
      createdAt
      updatedAt
    }
  }
`;

const BidderAuctionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [viewType, setViewType] = useState<'table' | 'card'>('card');
  const [selectedAuction, setSelectedAuction] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("certificateNumber");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Fetch active auctions
  const { loading: activeLoading, error: activeError, data: activeData } = useQuery(GET_ACTIVE_AUCTIONS);
  
  // Fetch upcoming auctions
  const { loading: upcomingLoading, error: upcomingError, data: upcomingData } = useQuery(GET_UPCOMING_AUCTIONS);

  // Fetch certificates for selected auction
  const { 
    loading: certificatesLoading, 
    error: certificatesError, 
    data: certificatesData 
  } = useQuery(GET_CERTIFICATES_BY_AUCTION, {
    variables: { auctionId: selectedAuction },
    skip: !selectedAuction
  });

  // Set the first active auction as selected when data loads
  useEffect(() => {
    if (activeData?.activeAuctions?.length > 0 && !selectedAuction) {
      setSelectedAuction(activeData.activeAuctions[0].id);
    }
  }, [activeData, selectedAuction]);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Handle view type change
  const handleViewTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newViewType: 'table' | 'card' | null,
  ) => {
    if (newViewType !== null) {
      setViewType(newViewType);
    }
  };

  // Handle auction selection
  const handleAuctionSelect = (auctionId: string) => {
    navigate(`/bidder/county-auction/${auctionId}`);
  };

  // Handle search term change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handle sort change
  const handleSortChange = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Render certificates section
  const renderCertificatesSection = () => {
    if (!selectedAuction) {
      return (
        <Typography variant="body1">
          Please select an auction to view certificates.
        </Typography>
      );
    }

    if (certificatesLoading) {
      return <CircularProgress />;
    }

    if (certificatesError) {
      return (
        <Typography color="error">
          Error loading certificates: {certificatesError.message}
        </Typography>
      );
    }

    const certificates = certificatesData?.certificatesByAuction || [];

    if (certificates.length === 0) {
      return (
        <Alert severity="info">
          No certificates available for this auction.
        </Alert>
      );
    }

    // Filter certificates based on search term
    const filteredCertificates = certificates.filter((cert: Certificate) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        cert.certificateNumber.toLowerCase().includes(searchLower) ||
        cert.parcelId.toLowerCase().includes(searchLower) ||
        (cert.propertyAddress && cert.propertyAddress.toLowerCase().includes(searchLower)) ||
        (cert.ownerName && cert.ownerName.toLowerCase().includes(searchLower))
      );
    });

    // Sort certificates based on sort field and direction
    const sortedCertificates = [...filteredCertificates].sort((a: Certificate, b: Certificate) => {
      let aValue: any = a[sortField as keyof Certificate] || '';
      let bValue: any = b[sortField as keyof Certificate] || '';
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return (
      <Box>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Search certificates"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by certificate #, parcel ID, address, or owner"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">🔍</InputAdornment>
              ),
            }}
          />
        </Box>

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell 
                  onClick={() => handleSortChange("certificateNumber")}
                  sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Certificate #
                  {sortField === "certificateNumber" && (
                    <span>{sortDirection === "asc" ? " ↑" : " ↓"}</span>
                  )}
                </TableCell>
                <TableCell 
                  onClick={() => handleSortChange("parcelId")}
                  sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Parcel ID
                  {sortField === "parcelId" && (
                    <span>{sortDirection === "asc" ? " ↑" : " ↓"}</span>
                  )}
                </TableCell>
                <TableCell 
                  onClick={() => handleSortChange("propertyAddress")}
                  sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Property Address
                  {sortField === "propertyAddress" && (
                    <span>{sortDirection === "asc" ? " ↑" : " ↓"}</span>
                  )}
                </TableCell>
                <TableCell 
                  onClick={() => handleSortChange("faceValue")}
                  sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Face Value
                  {sortField === "faceValue" && (
                    <span>{sortDirection === "asc" ? " ↑" : " ↓"}</span>
                  )}
                </TableCell>
                <TableCell 
                  onClick={() => handleSortChange("status")}
                  sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Status
                  {sortField === "status" && (
                    <span>{sortDirection === "asc" ? " ↑" : " ↓"}</span>
                  )}
                </TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedCertificates.map((certificate: Certificate) => (
                <TableRow key={certificate.id} hover>
                  <TableCell>{certificate.certificateNumber}</TableCell>
                  <TableCell>{certificate.parcelId}</TableCell>
                  <TableCell>{certificate.propertyAddress || "N/A"}</TableCell>
                  <TableCell>{formatCurrency(certificate.faceValue)}</TableCell>
                  <TableCell>
                    <Chip
                      label={certificate.status}
                      color={certificate.status === "AVAILABLE" ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      component={Link}
                      to={`/bidder/parcels/${certificate.id}`}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  // Render auctions in card view
  const renderAuctionsCards = (auctions: Auction[], loading: boolean, error: any) => {
    if (loading) return <CircularProgress />;
    
    if (error) {
      return (
        <Typography color="error">
          Error loading auctions: {error.message}
        </Typography>
      );
    }
    
    if (!auctions || auctions.length === 0) {
      return (
        <Typography variant="body1">
          No auctions found.
        </Typography>
      );
    }
    
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {auctions.map((auction) => (
          <Box key={auction.id} sx={{ width: { xs: '100%', sm: '45%', md: '30%' }, mb: 2 }}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                border: selectedAuction === auction.id ? '2px solid #1976d2' : 'none',
              }}
              onClick={() => handleAuctionSelect(auction.id)}
            >
              <CardActionArea sx={{ flexGrow: 1 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                      {auction.name}
                    </Typography>
                    {renderStatusChip(auction.status)}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box component="span" sx={{ mr: 1, color: 'text.secondary', fontSize: 'small' }}>📅</Box>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(auction.startTime)}
                      {auction.endTime && ` - ${formatDate(auction.endTime)}`}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box component="span" sx={{ mr: 1, color: 'text.secondary', fontSize: 'small' }}>📍</Box>
                    <Typography variant="body2" color="text.secondary">
                      {auction.location || 'Online'}
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="small" 
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAuctionSelect(auction.id);
                  }}
                >
                  Select Auction
                </Button>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>
    );
  };

  // Render auctions in table view
  const renderAuctionsTable = (auctions: Auction[], loading: boolean, error: any) => {
    if (loading) return <CircularProgress />;
    
    if (error) {
      return (
        <Typography color="error">
          Error loading auctions: {error.message}
        </Typography>
      );
    }
    
    if (!auctions || auctions.length === 0) {
      return (
        <Typography variant="body1">
          No auctions available in this category.
        </Typography>
      );
    }
    
    return (
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Auction Name</strong></TableCell>
              <TableCell><strong>Start Date</strong></TableCell>
              <TableCell><strong>End Date</strong></TableCell>
              <TableCell><strong>Location</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {auctions.map((auction: Auction) => (
              <TableRow 
                key={auction.id} 
                hover 
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  },
                  backgroundColor: selectedAuction === auction.id ? 'rgba(25, 118, 210, 0.12)' : 'inherit',
                }}
                onClick={() => handleAuctionSelect(auction.id)}
              >
                <TableCell><strong>{auction.name}</strong></TableCell>
                <TableCell>{formatDate(auction.startTime)}</TableCell>
                <TableCell>{auction.endTime ? formatDate(auction.endTime) : 'N/A'}</TableCell>
                <TableCell>{auction.location}</TableCell>
                <TableCell>{renderStatusChip(auction.status)}</TableCell>
                <TableCell>
                  <Button 
                    variant="contained" 
                    color="primary"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAuctionSelect(auction.id);
                    }}
                  >
                    Select Auction
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // Render status chip with appropriate color
  const renderStatusChip = (status: string) => {
    let color = 'default';
    let label = status;
    
    switch (status.toLowerCase()) {
      case 'active':
        color = 'success';
        label = 'ACTIVE';
        break;
      case 'upcoming':
        color = 'warning';
        label = 'UPCOMING';
        break;
      case 'closed':
        color = 'error';
        label = 'CLOSED';
        break;
      default:
        color = 'default';
    }
    
    return (
      <Chip 
        label={label} 
        color={color as any} 
        size="small" 
        sx={{ fontWeight: 'bold' }} 
      />
    );
  };

  // If no auctions are available, show a message
  if (
    (!activeLoading && (!activeData?.activeAuctions || activeData.activeAuctions.length === 0)) &&
    (!upcomingLoading && (!upcomingData?.upcomingAuctions || upcomingData.upcomingAuctions.length === 0))
  ) {
    return (
      <Container>
        <Typography variant="h4" gutterBottom>
          Tax Certificate Auctions
        </Typography>
        <Typography variant="body1">
          There are currently no active or upcoming tax certificate auctions.
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">
          Tax Certificate Auctions
        </Typography>
        <ToggleButtonGroup
          value={viewType}
          exclusive
          onChange={handleViewTypeChange}
          aria-label="view type"
          size="small"
        >
          <ToggleButton value="card" aria-label="card view">
            <Tooltip title="Card View">
              <Box component="span">
                ⧉
              </Box>
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="table" aria-label="table view">
            <Tooltip title="Table View">
              <Box component="span">
                ☰
              </Box>
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          aria-label="auction tabs"
        >
          <Tab label="Active Auctions" disabled={!activeData?.activeAuctions?.length} />
          <Tab label="Upcoming Auctions" disabled={!upcomingData?.upcomingAuctions?.length} />
        </Tabs>
      </Box>

      <Box>
        {/* Active Auctions Tab */}
        <Box sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
          <Typography variant="h5" gutterBottom>
            Active Auctions
          </Typography>
          {viewType === 'card' 
            ? renderAuctionsCards(activeData?.activeAuctions || [], activeLoading, activeError)
            : renderAuctionsTable(activeData?.activeAuctions || [], activeLoading, activeError)
          }
        </Box>

        {/* Upcoming Auctions Tab */}
        <Box sx={{ display: activeTab === 1 ? 'block' : 'none' }}>
          <Typography variant="h5" gutterBottom>
            Upcoming Auctions
          </Typography>
          {viewType === 'card'
            ? renderAuctionsCards(upcomingData?.upcomingAuctions || [], upcomingLoading, upcomingError)
            : renderAuctionsTable(upcomingData?.upcomingAuctions || [], upcomingLoading, upcomingError)
          }
        </Box>
      </Box>
    </Container>
  );
};

export default BidderAuctionsPage;
