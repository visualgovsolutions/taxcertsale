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

const CertificateDetails: React.FC<CertificateDetailsProps> = ({ certificate }) => {
  // Format currency for display
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Format date for display
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };
  
  // Get status label with appropriate styling
  const getStatusLabel = (status: string): JSX.Element => {
    let statusClass = '';
    let label = '';
    
    switch (status) {
      case 'upcoming':
        statusClass = 'status-upcoming';
        label = 'Upcoming';
        break;
      case 'active':
        statusClass = 'status-active';
        label = 'Active';
        break;
      case 'closed':
        statusClass = 'status-closed';
        label = 'Closed';
        break;
      case 'redeemed':
        statusClass = 'status-redeemed';
        label = 'Redeemed';
        break;
      default:
        statusClass = '';
        label = status;
    }
    
    return <span className={`status-badge ${statusClass}`}>{label}</span>;
  };

  return (
    <div className="certificate-details">
      <div className="certificate-header">
        <h2>Certificate Details</h2>
        {getStatusLabel(certificate.status)}
      </div>
      
      <div className="certificate-info-grid">
        <div className="info-group">
          <h3>Property Information</h3>
          <div className="info-row">
            <span className="label">Parcel ID:</span>
            <span className="value">{certificate.parcelId}</span>
          </div>
          <div className="info-row">
            <span className="label">Owner:</span>
            <span className="value">{certificate.ownerName}</span>
          </div>
          <div className="info-row">
            <span className="label">Address:</span>
            <span className="value">{certificate.propertyAddress}</span>
          </div>
          <div className="info-row">
            <span className="label">County:</span>
            <span className="value">{certificate.county}</span>
          </div>
        </div>
        
        <div className="info-group">
          <h3>Certificate Information</h3>
          <div className="info-row">
            <span className="label">Certificate ID:</span>
            <span className="value">{certificate.id}</span>
          </div>
          <div className="info-row">
            <span className="label">Face Value:</span>
            <span className="value">{formatCurrency(certificate.faceValue)}</span>
          </div>
          <div className="info-row">
            <span className="label">Minimum Bid:</span>
            <span className="value">{formatCurrency(certificate.minimumBid)}</span>
          </div>
          {certificate.currentLowestBid !== undefined && (
            <div className="info-row current-lowest-bid">
              <span className="label">Current Lowest Bid:</span>
              <span className="value">{certificate.currentLowestBid}%</span>
            </div>
          )}
        </div>
        
        <div className="info-group">
          <h3>Auction Information</h3>
          <div className="info-row">
            <span className="label">Start Time:</span>
            <span className="value">{formatDate(certificate.auctionStartTime)}</span>
          </div>
          <div className="info-row">
            <span className="label">End Time:</span>
            <span className="value">{formatDate(certificate.auctionEndTime)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateDetails; 