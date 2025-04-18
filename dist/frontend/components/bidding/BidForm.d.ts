import React from 'react';
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
    onBidPlaced?: (bidAmount: number) => void;
}
declare const BidForm: React.FC<BidFormProps>;
export default BidForm;
