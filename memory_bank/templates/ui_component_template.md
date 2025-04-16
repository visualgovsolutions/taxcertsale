# UI Component Templates

## Bidding Interface Components

### BidderDashboard Component

```typescript
import React, { useState, useEffect } from "react";
import { useSocket } from "../hooks/useSocket";
import { BidHistory } from "./BidHistory";
import { CertificateDetails } from "./CertificateDetails";
import { BidForm } from "./BidForm";
import { ActiveBatches } from "./ActiveBatches";
import { Alert, Grid, Box, Typography } from "@mui/material";

interface BidderDashboardProps {
  bidderId: string;
  countyId: string;
}

export const BidderDashboard: React.FC<BidderDashboardProps> = ({ bidderId, countyId }) => {
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);
  const [bidHistory, setBidHistory] = useState<Bid[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "connecting">("connecting");
  const [error, setError] = useState<string | null>(null);
  
  const socket = useSocket();
  
  useEffect(() => {
    // Socket setup and connection logic
    // Handle connection events, bid updates, and batch status changes
  }, [bidderId, countyId]);
  
  return (
    <Box>
      {error && <Alert severity="error">{error}</Alert>}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <ActiveBatches 
            countyId={countyId}
            onSelectBatch={setSelectedBatch}
            selectedBatch={selectedBatch}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          {selectedCertificate ? (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <CertificateDetails certificateId={selectedCertificate} />
              </Grid>
              <Grid item xs={12}>
                <BidForm 
                  certificateId={selectedCertificate}
                  bidderId={bidderId}
                  connectionStatus={connectionStatus}
                />
              </Grid>
              <Grid item xs={12}>
                <BidHistory certificateId={selectedCertificate} bids={bidHistory} />
              </Grid>
            </Grid>
          ) : (
            <Typography variant="body1" color="textSecondary" align="center">
              Select a certificate to place a bid
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};
```

### BidForm Component

```typescript
import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Box, CircularProgress, Alert } from "@mui/material";
import { useBidService } from "../hooks/useBidService";
import { formatCurrency } from "../utils/formatters";

interface BidFormProps {
  certificateId: string;
  bidderId: string;
  connectionStatus: "connected" | "disconnected" | "connecting";
}

export const BidForm: React.FC<BidFormProps> = ({ certificateId, bidderId, connectionStatus }) => {
  const [interestRate, setInterestRate] = useState<string>("18");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [currentLowestBid, setCurrentLowestBid] = useState<number | null>(null);
  
  const bidService = useBidService();
  
  useEffect(() => {
    // Fetch certificate details and current lowest bid
    // Subscribe to bid updates for this certificate
  }, [certificateId]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      // Validate input (must be number between 0-18)
      const rateValue = parseFloat(interestRate);
      
      if (isNaN(rateValue) || rateValue < 0 || rateValue > 18) {
        throw new Error("Interest rate must be between 0% and 18%");
      }
      
      // Florida-specific validation: minimum 5% unless zero bid
      if (rateValue > 0 && rateValue < 5) {
        throw new Error("Interest rate must be either 0% or at least 5%");
      }
      
      // Submit bid using bidding service
      await bidService.placeBid({
        certificateId,
        bidderId,
        interestRate: rateValue,
        timestamp: new Date(),
      });
      
      // Reset form after successful submission
      setInterestRate("");
    } catch (err) {
      setError(err.message || "Failed to place bid. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const isDisabled = connectionStatus !== "connected" || isSubmitting;
  
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>Place Bid</Typography>
      
      {certificate && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2">
            Certificate Value: {formatCurrency(certificate.faceValue)}
          </Typography>
          {currentLowestBid !== null && (
            <Typography variant="body2" color="primary">
              Current Lowest Bid: {currentLowestBid}%
            </Typography>
          )}
        </Box>
      )}
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      {connectionStatus === "disconnected" && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          You are disconnected. Reconnecting...
        </Alert>
      )}
      
      <TextField
        label="Interest Rate (%)"
        value={interestRate}
        onChange={(e) => setInterestRate(e.target.value)}
        type="number"
        inputProps={{ 
          min: "0", 
          max: "18", 
          step: "0.01" 
        }}
        fullWidth
        required
        disabled={isDisabled}
        sx={{ mb: 2 }}
        helperText="Enter a rate between 0% and 18%. Must be 0% or at least 5%."
      />
      
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isDisabled}
        fullWidth
        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
      >
        {isSubmitting ? "Submitting..." : "Place Bid"}
      </Button>
    </Box>
  );
};
```
