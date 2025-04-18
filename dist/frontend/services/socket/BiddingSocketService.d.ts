/**
 * Auction State Interface
 */
export interface AuctionState {
    certificateId: string;
    lowestBid: number | null;
    lowestBidder: string | null;
    bidCount: number;
    lastBidTime: Date | null;
}
/**
 * Bid Response Interface
 */
export interface BidResponse {
    certificateId: string;
    bidId: string;
    interestRate: number;
}
/**
 * Event Handler Type
 */
type EventHandler = (...args: unknown[]) => void;
/**
 * Bidding Socket Service
 *
 * This service manages the WebSocket connection to the bidding server
 * and provides methods for interacting with auctions.
 */
export declare class BiddingSocketService {
    private socket;
    private userId;
    private token;
    private authenticated;
    private eventHandlers;
    private reconnectAttempts;
    private maxReconnectAttempts;
    private reconnectTimeout;
    private static instance;
    /**
     * Get the singleton instance
     */
    static getInstance(): BiddingSocketService;
    /**
     * Private constructor to prevent direct instantiation
     */
    private constructor();
    /**
     * Initialize the socket connection
     */
    initialize(url: string, userId: string, token: string): void;
    /**
     * Set up socket event handlers
     */
    private setupEventHandlers;
    /**
     * Authenticate with the auction server
     */
    private authenticate;
    /**
     * Join an auction room
     */
    joinAuction(certificateId: string): void;
    /**
     * Leave an auction room
     */
    leaveAuction(certificateId: string): void;
    /**
     * Place a bid on a certificate
     */
    placeBid(certificateId: string, interestRate: number): void;
    /**
     * Reconnect and perform an action after reconnection
     */
    private reconnectAndPerformAction;
    /**
     * Register an event handler
     */
    on(event: string, handler: EventHandler): void;
    /**
     * Unregister an event handler
     */
    off(event: string, handler: EventHandler): void;
    /**
     * Notify all event handlers for an event
     */
    private notifyEventHandlers;
    /**
     * Disconnect from the socket server
     */
    disconnect(): void;
    /**
     * Check if the socket is connected
     */
    isConnected(): boolean;
    /**
     * Check if the socket is authenticated
     */
    isAuthenticated(): boolean;
}
export {};
