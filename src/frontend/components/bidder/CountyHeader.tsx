import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';

// CRITICAL PATH COMPONENT
// This component renders the county header on bidder pages.
//
// USAGE REQUIREMENTS:
// 1. Must be included in all county-specific bidder pages
// 2. Use the pattern: const isCountyContext = !!auctionId;
// 3. Then conditionally render: {isCountyContext && <CountyHeader />}
// 4. Must be the first element in the page component return
// 5. Do not modify the height (100px) or background color scheme
// 6. Can accept auctionId as prop if not using route params

// GraphQL query to get auction details with county information
const GET_AUCTION_DETAILS = gql`
  query GetAuctionDetails($id: ID!) {
    auction(id: $id) {
      id
      name
      county {
        id
        name
        state
        primaryColor
      }
    }
  }
`;

interface CountyHeaderProps {
  auctionId?: string;
}

const CountyHeader: React.FC<CountyHeaderProps> = ({ auctionId: propAuctionId }) => {
  // Get auctionId from props or URL params
  const { auctionId: paramAuctionId } = useParams<{ auctionId: string }>();
  const auctionId = propAuctionId || paramAuctionId;

  // Skip query if no auctionId provided
  const { data, loading, error } = useQuery(GET_AUCTION_DETAILS, {
    variables: { id: auctionId },
    skip: !auctionId,
  });

  // Return nothing if no auction data is available
  if (!auctionId || loading || error || !data?.auction) {
    return null;
  }

  const { auction } = data;
  const county = auction.county || {};

  return (
    <Box
      sx={{
        height: '100px',
        backgroundColor: county.primaryColor || '#1976d2',
        width: '100%',
        marginLeft: 0,
        marginRight: 0,
        paddingLeft: 0,
        paddingRight: 0,
        marginBottom: 0,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold' }}>
            {auction.name || `${county.name || 'County'} Tax Certificate Auction`}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#fff' }}>
            {county.name || 'County'}, {county.state || 'FL'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default CountyHeader;
