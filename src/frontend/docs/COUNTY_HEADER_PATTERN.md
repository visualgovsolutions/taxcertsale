# County Header Implementation Pattern

## Overview

The `CountyHeader` component is a critical UI element that must be consistently implemented across all bidder pages when in a county auction context. This document outlines the implementation pattern that must be followed.

## Implementation Requirements

1. All bidder pages that can be accessed within a county context **must** implement the `CountyHeader` component.

2. The `CountyHeader` must be the **first element** in the component's render tree.

3. The `CountyHeader` should be conditionally rendered based on the presence of an auction ID in the route parameters.

## Standard Implementation Pattern

```tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import CountyHeader from '../../components/bidder/CountyHeader';

const BidderPage: React.FC = () => {
  // Get auction ID from route params to determine if we're in a county context
  const { auctionId } = useParams<{ auctionId: string }>();
  const isCountyContext = !!auctionId;
  
  // Rest of component logic
  
  return (
    <>
      {/* CRITICAL PATH: County Header must be first element */}
      {isCountyContext && <CountyHeader />}
      <Container>
        {/* Page content */}
      </Container>
    </>
  );
};

export default BidderPage;
```

## Testing County Header Integration

To verify proper integration of the CountyHeader:

1. Navigate to a county-specific URL (containing an auctionId parameter)
2. Confirm the county header appears at the top of the page
3. Verify that the county name and state are correctly displayed
4. Check that the county's primary color is applied to the header background

## Important Notes

- Do not modify the height (100px) or styling of the CountyHeader component
- The CountyHeader automatically fetches county details based on the auctionId
- For pages not accessed through county context, the header will not be displayed
- When adding new bidder pages, always follow this pattern for consistency

## Related Components

- `CountyHeader.tsx` - The core component that renders the county banner 