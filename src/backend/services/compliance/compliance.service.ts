// import { Injectable } from '@nestjs/common'; // Not using NestJS DI
import { Pool } from 'pg'; // Import Pool type
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'; // Import pdf-lib components
// Hypothetical Service Imports - Replace with actual paths when created
// import { UserService, UserDetailsFor1099 } from '../user/UserService'; // Assuming UserService exists
// import { PaymentService, InterestPaymentSummary } from '../payment/PaymentService'; // Assuming PaymentService exists
// import { CountyConfigService, PayerDetails } from '../county/CountyConfigService'; // Assuming CountyConfigService exists

// --- Placeholder Types and Interfaces (Define actual services/types later) ---
interface UserDetailsFor1099 {
  name: string;
  tin: string; // Taxpayer Identification Number
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

interface InterestPaymentSummary {
  investorId: string;
  totalInterest: number;
}

interface PayerDetails {
  name: string;
  tin: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

interface UserService {
  getInvestorDetailsFor1099(investorId: string): Promise<UserDetailsFor1099 | null>;
}

interface PaymentService {
  getInvestorIdsWithInterestPaid(taxYear: number): Promise<string[]>;
  getTotalInterestPaidForInvestor(investorId: string, taxYear: number): Promise<InterestPaymentSummary | null>;
  getRedemptionDetails(redemptionId: string): Promise<{ date: Date; amount: number; redeemedBy: string; } | null>;
}

interface CountyConfigService {
  getPayerDetailsFor1099(): Promise<PayerDetails | null>;
}

interface CertificateService {
  getCertificatesForChapter197(startDate: Date, endDate: Date): Promise<any[]>;
}
// --- End Placeholder Types and Interfaces ---

// Interface for the data needed for a single 1099-INT
interface Investor1099Data {
  investorId: string; // Or number, depending on your User model
  investorName: string;
  investorTIN: string; // Taxpayer Identification Number (SSN or EIN)
  investorAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  interestPaid: number;
  payerName: string; // e.g., County Name or Platform Name
  payerTIN: string;
  payerAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

// Interface for Chapter 197 report data row
interface Chapter197ReportRow {
  certificateId: string; // Or number
  parcelId: string;
  auctionDate: string; // ISO string format
  batchId: string; // Or number
  winningBidderId: string | null;
  winningBidderName: string | null;
  winningInterestRate: number | null;
  certificateFaceValue: number;
  redemptionDate: string | null; // ISO string format
  redemptionAmount: number | null;
  redeemedBy: string | null;
  currentStatus: string; // e.g., 'Outstanding', 'Redeemed', 'Deed Applied'
}

// @Injectable() // Remove NestJS decorator
export class ComplianceService {
  // TEMP: Revert constructor to only take Pool until other services are ready
  constructor(
    private pool: Pool
    // private userService: UserService, // Use placeholder interface type
    // private paymentService: PaymentService, // Use placeholder interface type
    // private countyConfigService: CountyConfigService, // Use placeholder interface type
    // Add CertificateService dependency if needed for Chapter 197
    // private certificateService: CertificateService // Assuming CertificateService interface exists or define it
  ) {}

  // --- Placeholder Data Fetching for Chapter 197 ---
  private async getChapter197ReportData(startDate: Date, endDate: Date): Promise<Chapter197ReportRow[]> {
      // TODO: Implement actual data fetching using injected services
      // TODO: Reinstate service calls once dependencies are injected
      // This query needs to:
      // 1. Fetch certificates issued or relevant events (redemption) within the date range.
      // 2. Join with auction, batch, bidder, and redemption details.
      // 3. Format dates and amounts correctly.

      console.log(`Fetching Chapter 197 report data from ${startDate.toISOString()} to ${endDate.toISOString()}...`);

      // TEMP: Comment out service usage until dependencies are injected
      // Step 1: Fetch relevant certificates based on date range (auction date, redemption date, etc.)
      // The specifics depend on the exact report requirements
      // const certificates = await this.certificateService.getCertificatesForChapter197(startDate, endDate); // Hypothetical method
      // Example: certificates = [{ id: 'cert-001', ..., bidderId: 'user123', redemptionId: null }, { id: 'cert-002', ..., bidderId: 'user456', redemptionId: 'red-abc' }]

      // if (!certificates || certificates.length === 0) {
      //     console.log(`No relevant certificate data found for Chapter 197 report between ${startDate.toISOString()} and ${endDate.toISOString()}.`);
      //     return [];
      // }

      // Step 2: Iterate through certificates and gather associated data
      const reportRows: Chapter197ReportRow[] = [];
      // for (const cert of certificates) {
      //     let bidderName: string | null = null;
      //     if (cert.purchaserId) {
      //         const bidderDetails = await this.userService.getInvestorDetailsFor1099(cert.purchaserId);
      //         bidderName = bidderDetails ? bidderDetails.name : 'Unknown Bidder';
      //     }

      //     let redemptionDetails = null;
      //     if (cert.redemptionId) { // Assuming redemption details are linked via an ID
      //        redemptionDetails = await this.paymentService.getRedemptionDetails(cert.redemptionId); // Hypothetical method
      //        // Example: redemptionDetails = { date: '2024-01-20T14:30:00Z', amount: 895.50, redeemedBy: 'Property Owner' }
      //     }

      //     // Populate the row for the report
      //     reportRows.push({
      //         certificateId: cert.id,
      //         parcelId: cert.parcelId,
      //         auctionDate: cert.auctionDate ? cert.auctionDate.toISOString() : 'N/A',
      //         batchId: cert.batchId || 'N/A',
      //         winningBidderId: cert.purchaserId,
      //         winningBidderName: bidderName,
      //         winningInterestRate: cert.interestRate,
      //         certificateFaceValue: cert.faceValue,
      //         redemptionDate: redemptionDetails ? redemptionDetails.date.toISOString() : null,
      //         redemptionAmount: redemptionDetails ? redemptionDetails.amount : null,
      //         redeemedBy: redemptionDetails ? redemptionDetails.redeemedBy : null,
      //         currentStatus: cert.status, // Assuming status is part of the Certificate object
      //     });
      // }

      // Remove the placeholder data and filtering logic
      /*
      // Example placeholder data:
      const placeholderData: Chapter197ReportRow[] = [
          // ... (old placeholder data)
      ];

      // Simulate DB delay
      await new Promise(resolve => setTimeout(resolve, 150));

      // Filter placeholder data by date (approximating DB query range)
      const startMillis = startDate.getTime();
      const endMillis = endDate.getTime();
      return placeholderData.filter(row => {
          const auctionMillis = new Date(row.auctionDate).getTime();
          const redemptionMillis = row.redemptionDate ? new Date(row.redemptionDate).getTime() : null;
          return (auctionMillis >= startMillis && auctionMillis <= endMillis) || 
                 (redemptionMillis && redemptionMillis >= startMillis && redemptionMillis <= endMillis);
      });
      */
      // TEMP: Return empty array until services are injected
      console.warn("TEMP: getChapter197ReportData returning empty array - services not injected.");
      return [];
  }

  // --- Data Fetching Placeholder for 1099-INT ---
  private async getInvestorInterestDataForYear(taxYear: number): Promise<Investor1099Data[]> {
    // TODO: Implement actual data fetching using injected services
    // TODO: Reinstate service calls once dependencies are injected
    console.log(`Fetching investor interest data for tax year ${taxYear}...`);

    // TEMP: Return empty array until services are injected
    console.warn("TEMP: getInvestorInterestDataForYear returning empty array - services not injected.");
    return []; 
    /* 
    // Step 1: Identify investors who received interest in the tax year
    // This might involve querying redemptions or payments within the date range
    const investorIds = await this.paymentService.getInvestorIdsWithInterestPaid(taxYear);
    // Example: investorIds = ['user123', 'user456'];

    if (!investorIds || investorIds.length === 0) {
      console.log(`No investors found with interest payments for tax year ${taxYear}.`);
      return [];
    }

    // Step 2: Get Payer details (assuming one payer for simplicity, could vary by county)
    // This might come from a county configuration or platform settings
    const payerDetails: PayerDetails | null = await this.countyConfigService.getPayerDetailsFor1099(); // Hypothetical method
    if (!payerDetails) {
        console.error("Payer details could not be retrieved. Cannot generate 1099-INTs.");
        // Handle error appropriately - maybe throw an error or return empty
        return [];
    }
    // Example: payerDetails = { name: 'Sample County Tax Collector', tin: '12-3456789', address: {...} };

    // Step 3: For each investor, get their details and total interest paid
    const results: Investor1099Data[] = [];
    for (const investorId of investorIds) {
      // Fetch investor details (Name, TIN, Address)
      const investorDetails: UserDetailsFor1099 | null = await this.userService.getInvestorDetailsFor1099(investorId); // Hypothetical method

      // Fetch total interest paid to this investor for the year
      const interestSummary: InterestPaymentSummary | null = await this.paymentService.getTotalInterestPaidForInvestor(investorId, taxYear); // Hypothetical method

      if (investorDetails && interestSummary && interestSummary.totalInterest > 0) {
        results.push({
          investorId: investorId,
          investorName: investorDetails.name,
          investorTIN: investorDetails.tin, // Ensure TIN is handled securely
          investorAddress: investorDetails.address,
          interestPaid: interestSummary.totalInterest,
          payerName: payerDetails.name,
          payerTIN: payerDetails.tin,
          payerAddress: payerDetails.address,
        });
      } else {
          console.warn(`Skipping 1099-INT for investor ${investorId} due to missing details or zero interest.`);
          // Log details about missing data if necessary
      }
    }

    // Simulate DB delay (can be removed once actual service calls are implemented)
    // await new Promise(resolve => setTimeout(resolve, 100));

    console.log(`Successfully prepared data for ${results.length} 1099-INT forms.`);
    return results;
    */
  }

  // --- 1099-INT Generation ---
  async generate1099Int(taxYear: number): Promise<Buffer | string> {
    try {
      console.log(`Generating 1099-INT PDF for tax year ${taxYear}...`);
      const investorData = await this.getInvestorInterestDataForYear(taxYear);

      if (investorData.length === 0) {
        return `No interest payments found for tax year ${taxYear}. No 1099-INTs generated.`;
      }

      // Create a new PDFDocument
      const pdfDoc = await PDFDocument.create();
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

      // --- Create a page for each investor --- 
      // NOTE: A real implementation would likely use a template PDF or more complex layout.
      // This is a very basic example showing one investor per page.
      for (const data of investorData) {
        const page = pdfDoc.addPage();
        // const { width, height } = page.getSize(); // Remove width
        const { height } = page.getSize(); // Only get height
        const fontSize = 12;

        // Draw text function for simplicity
        const drawText = (text: string, x: number, y: number) => {
            page.drawText(text, {
                x: x,
                y: height - y * fontSize, // Adjust y from top
                size: fontSize,
                font: timesRomanFont,
                color: rgb(0, 0, 0),
            });
        };

        // Basic Layout (adjust coordinates as needed)
        drawText(`Form 1099-INT - Interest Income - Tax Year ${taxYear}`, 50, 4);
        drawText(`PAYER: ${data.payerName}`, 50, 7);
        drawText(`  ${data.payerAddress.street}`, 50, 8);
        drawText(`  ${data.payerAddress.city}, ${data.payerAddress.state} ${data.payerAddress.zip}`, 50, 9);
        drawText(`  TIN: ${data.payerTIN}`, 50, 10);

        drawText(`RECIPIENT: ${data.investorName}`, 50, 13);
        drawText(`  ${data.investorAddress.street}`, 50, 14);
        drawText(`  ${data.investorAddress.city}, ${data.investorAddress.state} ${data.investorAddress.zip}`, 50, 15);
        drawText(`  TIN: ${data.investorTIN}`, 50, 16);

        drawText(`1. Interest Income: $${data.interestPaid.toFixed(2)}`, 50, 19);

        // Add more fields as required by the 1099-INT form
      }

      // Serialize the PDFDocument to bytes (a Uint8Array)
      const pdfBytes = await pdfDoc.save();

      // Convert Uint8Array to Buffer
      return Buffer.from(pdfBytes);

    } catch (error) {
      console.error(`Error generating 1099-INT PDF for year ${taxYear}:`, error);
      const errorMessage = (error instanceof Error) ? error.message : 'Unknown error during PDF generation';
      return `Failed to generate 1099-INT PDF: ${errorMessage}`;
    }
  }

  // --- Chapter 197 Report Generation (CSV) ---
  async generateChapter197Report(startDate: Date, endDate: Date): Promise<Buffer | string> {
    try {
      console.log(`Generating Chapter 197 report (CSV) from ${startDate.toISOString()} to ${endDate.toISOString()}...`);
      const reportData = await this.getChapter197ReportData(startDate, endDate);

      if (reportData.length === 0) {
        return `No relevant certificate data found between ${startDate.toISOString().split('T')[0]} and ${endDate.toISOString().split('T')[0]}.`;
      }

      // Define CSV headers
      const headers = [
        'CertificateID',
        'ParcelID',
        'AuctionDate',
        'BatchID',
        'WinningBidderID',
        'WinningBidderName',
        'WinningInterestRate',
        'CertificateFaceValue',
        'RedemptionDate',
        'RedemptionAmount',
        'RedeemedBy',
        'CurrentStatus',
      ];

      // Function to escape CSV values (handle commas, quotes, newlines)
      const escapeCsvValue = (value: string | number | null | undefined): string => {
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        // If value contains comma, quote, or newline, enclose in double quotes and escape existing quotes
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      };

      // Convert data rows to CSV format
      const csvRows = reportData.map(row => {
        return [
          escapeCsvValue(row.certificateId),
          escapeCsvValue(row.parcelId),
          escapeCsvValue(row.auctionDate),
          escapeCsvValue(row.batchId),
          escapeCsvValue(row.winningBidderId),
          escapeCsvValue(row.winningBidderName),
          escapeCsvValue(row.winningInterestRate),
          escapeCsvValue(row.certificateFaceValue),
          escapeCsvValue(row.redemptionDate),
          escapeCsvValue(row.redemptionAmount),
          escapeCsvValue(row.redeemedBy),
          escapeCsvValue(row.currentStatus),
        ].join(',');
      });

      // Combine headers and rows
      const csvString = [headers.join(','), ...csvRows].join('\n');

      // Convert CSV string to Buffer
      return Buffer.from(csvString, 'utf-8');

    } catch (error) {
        console.error(`Error generating Chapter 197 report for ${startDate.toISOString()} to ${endDate.toISOString()}:`, error);
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error during report generation';
        return `Failed to generate Chapter 197 report: ${errorMessage}`;
    }
  }

  // Add other compliance-related methods as needed
} 