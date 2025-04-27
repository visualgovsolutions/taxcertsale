import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  TextField,
  Button,
  Divider,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Chip,
  Card,
  CardContent,
  Alert,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Collapse,
  Snackbar,
  CircularProgress,
  Tabs,
  Tab,
  InputAdornment,
  useTheme,
  alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Bookmark as BookmarkIcon,
  KeyboardArrowDown as ExpandMoreIcon,
  KeyboardArrowUp as ExpandLessIcon,
  BookmarkBorder as BookmarkBorderIcon,
  FolderOpen as FolderOpenIcon,
  FileCopy as FileCopyIcon,
  Home as HomeIcon,
  AttachMoney as MoneyIcon,
  Assessment as AssessmentIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { gql, useQuery, useMutation } from '@apollo/client';
import CountyHeader from '../../components/bidder/CountyHeader';

// GraphQL queries and mutations
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

const GET_CERTIFICATES = gql`
  query GetCertificates($auctionId: ID!, $filters: CertificateFiltersInput) {
    certificates(auctionId: $auctionId, filters: $filters) {
      id
      certificateNumber
      faceValue
      interestRate
      property {
        id
        parcelId
        address
        city
        state
        zipCode
        legalDescription
      }
      status
    }
  }
`;

const GET_SAVED_SEARCHES = gql`
  query GetSavedSearches($auctionId: ID!) {
    savedSearches(auctionId: $auctionId) {
      id
      name
      auctionId
      criteria
      createdAt
    }
  }
`;

const SAVE_SEARCH = gql`
  mutation SaveSearch($input: SavedSearchInput!) {
    saveSearch(input: $input) {
      id
      name
      auctionId
      criteria
      createdAt
    }
  }
`;

const DELETE_SAVED_SEARCH = gql`
  mutation DeleteSavedSearch($id: ID!) {
    deleteSavedSearch(id: $id) {
      id
      success
    }
  }
`;

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  position: 'relative',
  overflow: 'hidden',
  border: '1px solid #e0e0e0'
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
  '& svg': {
    marginRight: theme.spacing(1)
  }
}));

const SearchCriteriaRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    alignItems: 'stretch',
    '& > *': {
      marginBottom: theme.spacing(1),
      width: '100%'
    }
  }
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    cursor: 'pointer',
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const ResultsContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '200px',
}));

const LoadingOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  zIndex: 1,
}));

// Available search fields and operations
const searchGroups = [
  { id: 'all', label: 'All Search Groups' },
  { id: 'property', label: 'Property Detail' },
  { id: 'location', label: 'Location' },
  { id: 'building', label: 'Building Specifications' },
  { id: 'tax', label: 'Taxes' },
  { id: 'value', label: 'Value' },
  { id: 'sales', label: 'Sales' },
];

const searchFields = {
  property: [
    { id: 'parcelId', label: 'Parcel ID' },
    { id: 'legalDescription', label: 'Legal Description' },
  ],
  location: [
    { id: 'address', label: 'Address' },
    { id: 'city', label: 'City' },
    { id: 'zipCode', label: 'ZIP Code' },
  ],
  building: [
    { id: 'buildingType', label: 'Building Type' },
    { id: 'squareFeet', label: 'Square Feet' },
    { id: 'yearBuilt', label: 'Year Built' },
  ],
  tax: [
    { id: 'taxStatus', label: 'Tax Status' },
    { id: 'taxAmount', label: 'Tax Amount' },
  ],
  value: [
    { id: 'assessedValue', label: 'Assessed Value' },
    { id: 'marketValue', label: 'Market Value' },
  ],
  sales: [
    { id: 'lastSaleDate', label: 'Last Sale Date' },
    { id: 'lastSalePrice', label: 'Last Sale Price' },
  ],
};

const searchOperations = [
  { id: 'equals', label: 'Equals' },
  { id: 'contains', label: 'Contains' },
  { id: 'startsWith', label: 'Starts With' },
  { id: 'endsWith', label: 'Ends With' },
  { id: 'greaterThan', label: 'Greater Than' },
  { id: 'lessThan', label: 'Less Than' },
  { id: 'between', label: 'Between' },
];

const initialCriterion = {
  group: 'property',
  field: 'parcelId',
  operation: 'contains',
  value: '',
  secondValue: '', // For "between" operation
};

const ParcelSearchPage: React.FC = () => {
  const { auctionId } = useParams<{ auctionId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();

  // State for auction data
  const [county, setCounty] = useState<any>(null);
  const [countyColor, setCountyColor] = useState<string>(theme.palette.primary.main);

  // State for search criteria
  const [criteria, setCriteria] = useState<any[]>([{ ...initialCriterion }]);
  const [searchName, setSearchName] = useState<string>('');
  const [selectedSavedSearchId, setSelectedSavedSearchId] = useState<string>('');

  // State for search results
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalResults, setTotalResults] = useState(0);

  // State for UI components
  const [saveDialogOpen, setSaveDialogOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'info',
  });
  const [selectedSearchGroup, setSelectedSearchGroup] = useState<string>('all');
  const [addCriteriaDialogOpen, setAddCriteriaDialogOpen] = useState<boolean>(false);
  const [newCriterion, setNewCriterion] = useState({ ...initialCriterion });

  // GraphQL hooks
  const { data: auctionData } = useQuery(GET_AUCTION, {
    variables: { id: auctionId },
    skip: !auctionId,
    onCompleted: (data) => {
      if (data?.auction?.county) {
        setCounty(data.auction.county);
        setCountyColor(data.auction.county.primaryColor || theme.palette.primary.main);
      }
    },
  });

  const { data: savedSearchesData, loading: savedSearchesLoading, refetch: refetchSavedSearches } = useQuery(GET_SAVED_SEARCHES, {
    variables: { auctionId },
    skip: !auctionId,
  });

  const [saveSearch, { loading: savingSearch }] = useMutation(SAVE_SEARCH, {
    onCompleted: () => {
      setNotification({
        open: true,
        message: 'Search saved successfully',
        severity: 'success',
      });
      setSaveDialogOpen(false);
      refetchSavedSearches();
    },
    onError: (error) => {
      setNotification({
        open: true,
        message: `Error saving search: ${error.message}`,
        severity: 'error',
      });
    },
  });

  const [deleteSearch, { loading: deletingSearch }] = useMutation(DELETE_SAVED_SEARCH, {
    onCompleted: () => {
      setNotification({
        open: true,
        message: 'Search deleted successfully',
        severity: 'success',
      });
      refetchSavedSearches();
    },
    onError: (error) => {
      setNotification({
        open: true,
        message: `Error deleting search: ${error.message}`,
        severity: 'error',
      });
    },
  });

  // We would normally fetch certificate data here, but for now we'll mock it
  const fetchSearchResults = useCallback(async () => {
    setIsSearching(true);
    
    // In a real implementation, this would be replaced with a GraphQL query
    // using filters built from the criteria
    setTimeout(() => {
      // Mock search results for demonstration
      const mockResults = Array.from({ length: 25 }, (_, i) => ({
        id: `cert-${i + 1}`,
        certificateNumber: `C${100000 + i}`,
        faceValue: Math.floor(Math.random() * 10000) + 1000,
        interestRate: (Math.random() * 15 + 5).toFixed(2),
        property: {
          id: `prop-${i + 1}`,
          parcelId: `P${200000 + i}`,
          address: `${i + 100} Main St`,
          city: 'Anytown',
          state: 'FL',
          zipCode: '33101',
          legalDescription: 'LOT 1 BLOCK 2 SAMPLE SUBDIVISION PB 123 PG 45',
        },
        status: i % 5 === 0 ? 'SOLD' : 'AVAILABLE',
      }));
      
      setSearchResults(mockResults);
      setTotalResults(mockResults.length);
      setIsSearching(false);
    }, 1000);
  }, [criteria]);

  const handleAddCriterion = () => {
    setAddCriteriaDialogOpen(true);
  };

  const handleDeleteCriterion = (index: number) => {
    setCriteria(criteria.filter((_, i) => i !== index));
  };

  const handleCriterionChange = (index: number, field: string, value: any) => {
    const newCriteria = [...criteria];
    newCriteria[index] = { ...newCriteria[index], [field]: value };
    setCriteria(newCriteria);
  };

  const handleSearch = () => {
    setPage(0);
    fetchSearchResults();
  };

  const handleSaveSearch = () => {
    if (!searchName.trim()) {
      setNotification({
        open: true,
        message: 'Please enter a name for your search',
        severity: 'error',
      });
      return;
    }
    
    saveSearch({
      variables: {
        input: {
          name: searchName,
          auctionId,
          criteria: JSON.stringify(criteria),
        },
      },
    });
  };

  const handleLoadSavedSearch = (searchId: string) => {
    const savedSearch = savedSearchesData?.savedSearches.find((search: any) => search.id === searchId);
    if (savedSearch) {
      try {
        const parsedCriteria = JSON.parse(savedSearch.criteria);
        setCriteria(parsedCriteria);
        setSearchName(savedSearch.name);
        setSelectedSavedSearchId(searchId);
      } catch (error) {
        console.error('Error parsing saved search criteria:', error);
      }
    }
  };

  const handleDeleteSavedSearch = (searchId: string) => {
    deleteSearch({
      variables: { id: searchId },
    });
    
    if (selectedSavedSearchId === searchId) {
      setSelectedSavedSearchId('');
    }
  };

  const handleBidWithSearch = () => {
    // Navigate to bidding page with search parameters
    if (auctionId) {
      navigate(`/bidder/county-auction/${auctionId}/bid?searchId=${selectedSavedSearchId}`);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (certificateId: string) => {
    // Navigate to certificate detail page
    navigate(`/bidder/county-auction/${auctionId}/certificate/${certificateId}`);
  };

  const handleAddNewCriterion = () => {
    setCriteria([...criteria, { ...newCriterion }]);
    setNewCriterion({ ...initialCriterion });
    setAddCriteriaDialogOpen(false);
  };

  const renderFieldOptions = () => {
    if (selectedSearchGroup === 'all') {
      return Object.values(searchFields).flat().map((field) => (
        <MenuItem key={field.id} value={field.id}>
          {field.label}
        </MenuItem>
      ));
    } else {
      return (searchFields[selectedSearchGroup as keyof typeof searchFields] || []).map((field) => (
        <MenuItem key={field.id} value={field.id}>
          {field.label}
        </MenuItem>
      ));
    }
  };

  return (
    <>
      {auctionId && <CountyHeader />}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        {/* Saved Searches Section */}
        <StyledPaper>
          <SectionTitle variant="h6">
            <BookmarkIcon sx={{ color: countyColor }} />
            Saved Searches
          </SectionTitle>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel id="saved-search-label">Select Saved Search</InputLabel>
                <Select
                  labelId="saved-search-label"
                  id="saved-search-select"
                  value={selectedSavedSearchId}
                  label="Select Saved Search"
                  onChange={(e) => handleLoadSavedSearch(e.target.value as string)}
                  displayEmpty
                  startAdornment={
                    <InputAdornment position="start">
                      <FolderOpenIcon />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="" disabled>
                    <em>Select a saved search</em>
                  </MenuItem>
                  {savedSearchesData?.savedSearches.map((search: any) => (
                    <MenuItem key={search.id} value={search.id}>
                      {search.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<DeleteIcon />}
                  disabled={!selectedSavedSearchId || deletingSearch}
                  onClick={() => handleDeleteSavedSearch(selectedSavedSearchId)}
                >
                  Delete
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SearchIcon />}
                  disabled={!selectedSavedSearchId}
                  onClick={handleBidWithSearch}
                  sx={{ 
                    bgcolor: countyColor,
                    '&:hover': {
                      bgcolor: `${countyColor}dd`,
                    }
                  }}
                >
                  Bid With This Search
                </Button>
              </Box>
            </Grid>
          </Grid>
        </StyledPaper>

        {/* Search Criteria Section */}
        <StyledPaper>
          <SectionTitle variant="h6">
            <FilterIcon sx={{ color: countyColor }} />
            Search Criteria
          </SectionTitle>
          
          {criteria.map((criterion, index) => (
            <SearchCriteriaRow key={index} sx={{ mb: 2 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Search Field</InputLabel>
                    <Select
                      value={criterion.field}
                      label="Search Field"
                      onChange={(e) => handleCriterionChange(index, 'field', e.target.value)}
                    >
                      {Object.values(searchFields).flat().map((field) => (
                        <MenuItem key={field.id} value={field.id}>
                          {field.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Search Function</InputLabel>
                    <Select
                      value={criterion.operation}
                      label="Search Function"
                      onChange={(e) => handleCriterionChange(index, 'operation', e.target.value)}
                    >
                      {searchOperations.map((op) => (
                        <MenuItem key={op.id} value={op.id}>
                          {op.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: criterion.operation === 'between' ? 2 : 5 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Search Value"
                    value={criterion.value}
                    onChange={(e) => handleCriterionChange(index, 'value', e.target.value)}
                  />
                </Grid>
                {criterion.operation === 'between' && (
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Second Value"
                      value={criterion.secondValue}
                      onChange={(e) => handleCriterionChange(index, 'secondValue', e.target.value)}
                    />
                  </Grid>
                )}
                <Grid size={{ xs: 12, md: 1 }}>
                  <Tooltip title="Remove Criterion">
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteCriterion(index)}
                      sx={{ mt: '4px' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </SearchCriteriaRow>
          ))}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddCriterion}
            >
              Add Row
            </Button>
            <Box>
              <Button
                variant="outlined"
                startIcon={<SaveIcon />}
                onClick={() => setSaveDialogOpen(true)}
                sx={{ mr: 1 }}
              >
                Save Search
              </Button>
              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                sx={{ 
                  bgcolor: countyColor,
                  '&:hover': {
                    bgcolor: `${countyColor}dd`,
                  }
                }}
              >
                Test Search
              </Button>
            </Box>
          </Box>
        </StyledPaper>

        {/* Results Section */}
        <StyledPaper>
          <SectionTitle variant="h6">
            <AssessmentIcon sx={{ color: countyColor }} />
            Results
          </SectionTitle>
          
          <ResultsContainer>
            {isSearching && (
              <LoadingOverlay>
                <CircularProgress sx={{ color: countyColor }} />
              </LoadingOverlay>
            )}
            
            {searchResults.length > 0 ? (
              <>
                <TableContainer>
                  <Table sx={{ minWidth: 650 }} size="small">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Certificate #</StyledTableCell>
                        <StyledTableCell>Parcel ID</StyledTableCell>
                        <StyledTableCell>Address</StyledTableCell>
                        <StyledTableCell align="right">Face Value</StyledTableCell>
                        <StyledTableCell align="right">Interest Rate</StyledTableCell>
                        <StyledTableCell>Status</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {searchResults
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((result) => (
                          <StyledTableRow
                            key={result.id}
                            onClick={() => handleRowClick(result.id)}
                          >
                            <TableCell component="th" scope="row">
                              {result.certificateNumber}
                            </TableCell>
                            <TableCell>{result.property.parcelId}</TableCell>
                            <TableCell>{result.property.address}</TableCell>
                            <TableCell align="right">
                              ${result.faceValue.toLocaleString()}
                            </TableCell>
                            <TableCell align="right">{result.interestRate}%</TableCell>
                            <TableCell>
                              <Chip
                                label={result.status}
                                color={result.status === 'AVAILABLE' ? 'success' : 'default'}
                                size="small"
                              />
                            </TableCell>
                          </StyledTableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={totalResults}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  py: 4,
                  color: 'text.secondary',
                  flexDirection: 'column',
                }}
              >
                <SearchIcon sx={{ fontSize: 40, mb: 2, opacity: 0.5 }} />
                <Typography variant="body1" gutterBottom>
                  No data available
                </Typography>
                <Typography variant="body2">
                  {criteria.length > 0
                    ? 'Adjust your search criteria and try again'
                    : 'Add search criteria and click "Test Search"'}
                </Typography>
              </Box>
            )}
          </ResultsContainer>
        </StyledPaper>

        {/* Save Search Dialog */}
        <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
          <DialogTitle>Save Search</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="search-name"
              label="Search Name"
              type="text"
              fullWidth
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSaveSearch}
              variant="contained"
              disabled={!searchName.trim() || savingSearch}
              sx={{ 
                bgcolor: countyColor,
                '&:hover': {
                  bgcolor: `${countyColor}dd`,
                }
              }}
            >
              {savingSearch ? 'Saving...' : 'Save Search'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Criteria Dialog */}
        <Dialog open={addCriteriaDialogOpen} onClose={() => setAddCriteriaDialogOpen(false)}>
          <DialogTitle>Add Search Criteria</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
              <InputLabel>Search Group</InputLabel>
              <Select
                value={selectedSearchGroup}
                label="Search Group"
                onChange={(e) => setSelectedSearchGroup(e.target.value)}
              >
                {searchGroups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Search Field</InputLabel>
              <Select
                value={newCriterion.field}
                label="Search Field"
                onChange={(e) => setNewCriterion({ ...newCriterion, field: e.target.value })}
              >
                {renderFieldOptions()}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Search Function</InputLabel>
              <Select
                value={newCriterion.operation}
                label="Search Function"
                onChange={(e) => setNewCriterion({ ...newCriterion, operation: e.target.value })}
              >
                {searchOperations.map((op) => (
                  <MenuItem key={op.id} value={op.id}>
                    {op.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Search Value"
              value={newCriterion.value}
              onChange={(e) => setNewCriterion({ ...newCriterion, value: e.target.value })}
              sx={{ mb: newCriterion.operation === 'between' ? 2 : 0 }}
            />

            {newCriterion.operation === 'between' && (
              <TextField
                fullWidth
                label="Second Value"
                value={newCriterion.secondValue}
                onChange={(e) => setNewCriterion({ ...newCriterion, secondValue: e.target.value })}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddCriteriaDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleAddNewCriterion}
              variant="contained"
              sx={{ 
                bgcolor: countyColor,
                '&:hover': {
                  bgcolor: `${countyColor}dd`,
                }
              }}
            >
              Add Criteria
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notifications */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={() => setNotification({ ...notification, open: false })}
        >
          <Alert
            onClose={() => setNotification({ ...notification, open: false })}
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default ParcelSearchPage; 