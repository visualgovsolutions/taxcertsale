import React, { useState, useEffect } from 'react';
import { BiddingSocketService } from '../../services/socket/BiddingSocketService';

interface Certificate {
  id: string;
  propertyId: string;
  faceValue: number;
  minimumBid: number;
  currentLowestBid?: number;
  auctionEndTime: string;
  status: 'upcoming' | 'active' | 'closed' | 'redeemed';
}

interface BidFormProps {
  certificate: Certificate;
  userId: string;
  onBidPlaced?: (bidAmount: number) => void;
}

const BidForm: React.FC<BidFormProps> = ({ certificate, userId, onBidPlaced }) => {
  const [bidAmount, setBidAmount] = useState<number>(
    certificate.currentLowestBid ? certificate.currentLowestBid - 0.25 : 18.00
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');
  
  // Maximum allowed bid rate is 18%
  const MAX_BID_RATE = 18.00;
  // Minimum decrement (Florida statute requires 0.25% decrements)
  const BID_DECREMENT = 0.25;
  
  // Calculate time left in auction
  useEffect(() => {
    if (certificate.status !== 'active') return;
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const endTime = new Date(certificate.auctionEndTime);
      const difference = endTime.getTime() - now.getTime();
      
      if (difference <= 0) {
        setTimeLeft('Auction ended');
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      let timeString = '';
      if (days > 0) timeString += `${days}d `;
      if (hours > 0) timeString += `${hours}h `;
      if (minutes > 0) timeString += `${minutes}m `;
      timeString += `${seconds}s`;
      
      setTimeLeft(timeString);
    };
    
    calculateTimeLeft();
    const timerId = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timerId);
  }, [certificate.auctionEndTime, certificate.status]);
  
  // Handle bid amount change
  const handleBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    
    // Validate bid amount
    if (isNaN(value)) {
      setError('Please enter a valid number');
      return;
    }
    
    // Round to nearest quarter percent
    const roundedValue = Math.round(value * 4) / 4;
    setBidAmount(roundedValue);
    setError(null);
  };
  
  // Handle bid submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous messages
    setError(null);
    setSuccessMessage(null);
    
    // Validate certificate status
    if (certificate.status !== 'active') {
      setError('This certificate is not available for bidding');
      return;
    }
    
    // Validate bid amount
    if (isNaN(bidAmount) || bidAmount <= 0) {
      setError('Please enter a valid bid amount');
      return;
    }
    
    // Validate against maximum bid rate
    if (bidAmount > MAX_BID_RATE) {
      setError(`Bid amount cannot exceed ${MAX_BID_RATE}%`);
      return;
    }
    
    // Validate against current lowest bid
    if (certificate.currentLowestBid && bidAmount >= certificate.currentLowestBid) {
      setError(`Bid must be lower than current lowest bid (${certificate.currentLowestBid}%)`);
      return;
    }
    
    // Validate bid decrement
    if (certificate.currentLowestBid && 
        (certificate.currentLowestBid - bidAmount) % BID_DECREMENT !== 0) {
      setError(`Bid must be in increments of ${BID_DECREMENT}%`);
      return;
    }
    
    // Submit bid
    try {
      setIsSubmitting(true);
      
      // Create bid object
      const bid = {
        certificateId: certificate.id,
        bidderId: userId,
        bidAmount: bidAmount,
        timestamp: new Date().toISOString()
      };
      
      // Send bid via socket service
      await BiddingSocketService.placeBid(bid);
      
      // Show success message
      setSuccessMessage(`Bid of ${bidAmount}% placed successfully!`);
      
      // Call the callback if provided
      if (onBidPlaced) {
        onBidPlaced(bidAmount);
      }
      
      // Reset form for next bid
      setBidAmount(bidAmount - BID_DECREMENT);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place bid. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Determine if bidding is allowed
  const canBid = certificate.status === 'active' && !isSubmitting;
  
  // Calculate the next valid bid amount
  const calculateNextBid = () => {
    if (!certificate.currentLowestBid) return MAX_BID_RATE;
    return Math.max(0, certificate.currentLowestBid - BID_DECREMENT);
  };
  
  // Quick bid buttons
  const renderQuickBidButtons = () => {
    if (!certificate.currentLowestBid) return null;
    
    const nextBid = calculateNextBid();
    const quickBids = [
      nextBid,
      Math.max(0, nextBid - BID_DECREMENT),
      Math.max(0, nextBid - (BID_DECREMENT * 2))
    ];
    
    return (
      <div className="quick-bid-buttons">
        <span>Quick bid: </span>
        {quickBids.map(amount => (
          <button
            key={amount}
            type="button"
            className="quick-bid-button"
            onClick={() => setBidAmount(amount)}
            disabled={!canBid}
          >
            {amount}%
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bid-form-container">
      <h3>Place Your Bid</h3>
      
      {/* Status and time information */}
      <div className="bid-status-info">
        {certificate.status === 'active' ? (
          <>
            <span className="time-remaining">Time remaining: {timeLeft}</span>
            {certificate.currentLowestBid && (
              <span className="current-bid">
                Current lowest bid: <strong>{certificate.currentLowestBid}%</strong>
              </span>
            )}
          </>
        ) : (
          <span className="auction-status">
            Auction status: <strong>{certificate.status}</strong>
          </span>
        )}
      </div>
      
      {/* Success message */}
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {/* Bid form */}
      <form onSubmit={handleSubmit} className="bid-form">
        <div className="form-row">
          <label htmlFor="bidAmount">Interest Rate (%)</label>
          <div className="input-with-symbol">
            <input
              id="bidAmount"
              type="number"
              step={BID_DECREMENT}
              min="0"
              max={MAX_BID_RATE}
              value={bidAmount}
              onChange={handleBidChange}
              disabled={!canBid}
              required
            />
            <span className="input-symbol">%</span>
          </div>
        </div>
        
        {/* Quick bid buttons */}
        {renderQuickBidButtons()}
        
        {/* Submit button */}
        <button
          type="submit"
          className="submit-bid-button"
          disabled={!canBid}
        >
          {isSubmitting ? 'Placing Bid...' : 'Place Bid'}
        </button>
      </form>
      
      {/* Bidding information */}
      <div className="bidding-info">
        <h4>Bidding Information</h4>
        <ul>
          <li>Bids are placed as interest rates - <strong>lower is better</strong></li>
          <li>Each bid must be at least {BID_DECREMENT}% lower than the current bid</li>
          <li>The maximum interest rate allowed is {MAX_BID_RATE}%</li>
          <li>Winning bid will be the lowest interest rate when the auction ends</li>
        </ul>
      </div>
    </div>
  );
};

export default BidForm; 