# Auction State Management

This document describes the implementation of auction state transitions in the Tax Certificate Sale system.

## State Machine Overview

The auction system follows a strict state machine with the following states:

- **UPCOMING**: Initial state for newly created auctions
- **ACTIVE**: Auctions currently in progress and accepting bids
- **COMPLETED**: Auctions that have successfully concluded
- **CANCELLED**: Auctions that have been terminated prematurely

## Valid State Transitions

The following state transitions are permitted:

```
UPCOMING ---> ACTIVE ---> COMPLETED
    |            |
    v            v
CANCELLED <---- CANCELLED
```

- **UPCOMING → ACTIVE**: Start an auction
- **ACTIVE → COMPLETED**: Complete a finished auction
- **UPCOMING → CANCELLED**: Cancel an upcoming auction
- **ACTIVE → CANCELLED**: Cancel an active auction

Invalid transitions (e.g., COMPLETED → ACTIVE) will be rejected with appropriate error messages.

## Implementation

The state machine is implemented at multiple levels:

1. **Database/Entity Level**: The `Auction` entity contains a `status` field with the `AuctionStatus` enum.
2. **Repository Level**: The `AuctionRepository` enforces valid state transitions.
3. **GraphQL API**: Mutations for state transitions with validation and error handling.
4. **WebSocket Gateway**: Real-time state change events with permission checks.

## GraphQL Mutations

The following GraphQL mutations are available:

### Start Auction

```graphql
mutation StartAuction($id: String!) {
  startAuction(id: $id) {
    success
    message
    auction {
      id
      status
    }
  }
}
```

### Complete Auction

```graphql
mutation CompleteAuction($id: String!) {
  completeAuction(id: $id) {
    success
    message
    auction {
      id
      status
    }
  }
}
```

### Cancel Auction

```graphql
mutation CancelAuction($id: String!) {
  cancelAuction(id: $id) {
    success
    message
    auction {
      id
      status
    }
  }
}
```

## WebSocket Events

The WebSocket gateway provides real-time auction state management:

### Join Auction Room

```javascript
// Client-side code
socket.emit('joinAuction', auctionId);

// Server response on successful join
socket.on('joinedAuction', (data) => {
  console.log(`Joined auction ${data.auctionId} with status ${data.status}`);
});
```

### Auction State Change Events

```javascript
// Listen for auction state changes
socket.on('auctionStarted', (data) => {
  console.log(`Auction ${data.auctionId} started at ${data.startedAt}`);
});

socket.on('auctionEnded', (data) => {
  console.log(`Auction ${data.auctionId} ended at ${data.endedAt}`);
});

socket.on('auctionCancelled', (data) => {
  console.log(`Auction ${data.auctionId} cancelled at ${data.cancelledAt}`);
});
```

### Admin Actions (Requires Authentication)

```javascript
// Start an auction (admin only)
socket.emit('startAuction', { 
  auctionId: 'auction-123', 
  adminToken: 'admin-token-from-env' 
});

// End an auction (admin only)
socket.emit('endAuction', { 
  auctionId: 'auction-123', 
  adminToken: 'admin-token-from-env' 
});

// Cancel an auction (admin only)
socket.emit('cancelAuction', { 
  auctionId: 'auction-123', 
  adminToken: 'admin-token-from-env' 
});
```

## Bidding Restrictions

Bids are only accepted for auctions in the **ACTIVE** state:

```javascript
// Client-side bid attempt
socket.emit('placeBid', {
  auctionId: 'auction-123',
  bidAmount: 1000,
  userId: 'user-456'
});

// Successful bid response
socket.on('bidPlaced', (data) => {
  console.log(`Bid placed: $${data.bidAmount}`);
});

// Error for invalid bid (including wrong auction state)
socket.on('errorEvent', (data) => {
  console.error(`Bid error: ${data.message}`);
});
```

## Testing

The auction state management system includes:

1. **Unit Tests**: Testing repository state transition methods
2. **Integration Tests**: GraphQL mutation tests and WebSocket event tests

Run tests with:

```bash
npm run test:auction-state
```

## Best Practices

1. Always check auction status before allowing bid-related actions
2. Use GraphQL mutations for admin-level state changes
3. Use WebSocket events for real-time updates to clients
4. Handle error responses appropriately at the client level 