export declare class ComplianceService {
    private readonly logger;
    constructor();
    /** @internal */
    private _getChapter197ReportData;
    private getInvestorInterestDataForYear;
    generate1099Int(taxYear: number): Promise<Buffer | string>;
    generateChapter197Report(startDate: Date, endDate: Date): Promise<Buffer | string>;
    /**
     * Placeholder for checking auction compliance.
     * @param auctionId The ID of the auction to check.
     * @returns Promise<boolean> Indicates if the auction is compliant.
     */
    checkAuctionCompliance(auctionId: string): Promise<boolean>;
    /**
     * Placeholder for generating a compliance report for an auction.
     * @param auctionId The ID of the auction.
     * @returns Promise<Buffer> The generated PDF report as a Buffer.
     */
    generateComplianceReport(auctionId: string): Promise<Buffer>;
    /**
     * Placeholder for handling compliance violations.
     * @param auctionId The ID of the auction with violations.
     * @param violations Details of the compliance violations.
     */
    handleComplianceViolation(auctionId: string, violations: string[]): Promise<void>;
}
export declare function getComplianceService(): ComplianceService;
