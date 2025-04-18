import React, { useState, useEffect } from 'react';
import { BiddingSocketService } from '../../services/socket/BiddingSocketService';

interface Bid {
  id: string;
  certificateId: string;
  bidderId: string;
  interestRate: number;
  timestamp: Date;
  status: string;
}

interface BidEventData {
  certificateId: string;
  bidId: string;
  bidderId: string;
  interestRate: number;
  timestamp: Date | string;
}

interface BidHistoryProps {
  certificateId: string;
  currentUserId?: string;
}

const BidHistory: React.FC<BidHistoryProps> = ({ certificateId, currentUserId }) => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const socketService = BiddingSocketService.getInstance();
  
  // Fetch initial bid history
  useEffect(() => {
    const fetchBidHistory = async () => {
      try {
        setLoading(true);
        // For now, we'll use mock data until we create an API endpoint for this
        // In a real implementation, you would fetch the bid history from the server
        const mockBids: Bid[] = [];
        setBids(mockBids);
        setError(null);
      } catch (err) {
        setError('Failed to load bid history');
        console.error('Error fetching bid history:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBidHistory();
  }, [certificateId]);
  
  // Listen for new bids
  useEffect(() => {
    // Adjust handler to accept unknown args and perform type check inside
    const handleBidPlaced = (...args: unknown[]) => {
      // Assume the first argument is the data object
      const data = args[0] as BidEventData; // Use type assertion (or proper type guard)
      
      // Basic validation of the received data structure
      if (!data || typeof data !== 'object' || !data.certificateId || data.certificateId !== certificateId) {
          console.warn('Received bid_placed event with invalid data or for wrong certificate:', data);
          return;
      }

      // Proceed with validated data
      const newBid: Bid = {
        id: data.bidId || 'unknown', // Add fallback for safety
        certificateId: data.certificateId,
        bidderId: data.bidderId || 'unknown', // Add fallback for safety
        interestRate: typeof data.interestRate === 'number' ? data.interestRate : 0, // Add fallback
        timestamp: data.timestamp ? (typeof data.timestamp === 'string' ? new Date(data.timestamp) : data.timestamp) : new Date(), // Ensure date
        status: 'active' // Assuming new bids are active
      };
      
      setBids(prevBids => [newBid, ...prevBids].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())); // Add sorting
    };
    
    socketService.on('bid_placed', handleBidPlaced);
    
    return () => {
      socketService.off('bid_placed', handleBidPlaced);
    };
  }, [certificateId, socketService]);
  
  // Format date for display
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };
  
  // Check if bid is from current user
  const isCurrentUser = (bidderId: string): boolean => {
    return currentUserId !== undefined && bidderId === currentUserId;
  };
  
  // Truncate bidder ID for display
  const truncateBidderId = (bidderId: string): string => {
    if (isCurrentUser(bidderId)) {
      return 'You';
    }
    return bidderId.substring(0, 8) + '...';
  };
  
  if (loading) {
    return <div className="bid-history-loading">Loading bid history...</div>;
  }
  
  if (error) {
    return <div className="bid-history-error">{error}</div>;
  }
  
  return (
    <div className="bid-history">
      <h3>Bid History</h3>
      
      {bids.length === 0 ? (
        <div className="no-bids">
          No bids have been placed on this certificate yet.
        </div>
      ) : (
        <table className="bid-table">
          <thead>
            <tr>
              <th>Bidder</th>
              <th>Interest Rate</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bids.map(bid => (
              <tr key={bid.id} className={isCurrentUser(bid.bidderId) ? 'current-user-bid' : ''}>
                <td>{truncateBidderId(bid.bidderId)}</td>
                <td>{bid.interestRate}%</td>
                <td>{formatDate(bid.timestamp)}</td>
                <td>
                  <span className={`bid-status ${bid.status}`}>
                    {bid.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BidHistory; 