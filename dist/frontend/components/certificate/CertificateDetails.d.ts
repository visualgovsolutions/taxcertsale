import React from 'react';
interface Certificate {
    id: string;
    propertyId: string;
    parcelId: string;
    ownerName: string;
    propertyAddress: string;
    county: string;
    faceValue: number;
    minimumBid: number;
    auctionStartTime: Date;
    auctionEndTime: Date;
    currentLowestBid?: number;
    status: 'upcoming' | 'active' | 'closed' | 'redeemed';
}
interface CertificateDetailsProps {
    certificate: Certificate;
}
declare const CertificateDetails: React.FC<CertificateDetailsProps>;
export default CertificateDetails;
