import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';

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
export class BiddingSocketService {
  private socket: Socket | null = null;
  private userId: string | null = null;
  private token: string | null = null;
  private authenticated = false;
  private eventHandlers: Map<string, Set<EventHandler>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  // Singleton instance
  private static instance: BiddingSocketService | null = null;

  /**
   * Get the singleton instance
   */
  public static getInstance(): BiddingSocketService {
    if (!BiddingSocketService.instance) {
      BiddingSocketService.instance = new BiddingSocketService();
    }
    return BiddingSocketService.instance;
  }

  /**
   * Private constructor to prevent direct instantiation
   */
  private constructor() {}

  /**
   * Initialize the socket connection
   */
  public initialize(url: string, userId: string, token: string): void {
    this.userId = userId;
    this.token = token;

    // Clean up any existing connection
    this.disconnect();

    // Create a new connection
    this.socket = io(url, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      timeout: 20000
    });

    // Setup event handlers
    this.setupEventHandlers();

    // Authenticate the connection
    this.authenticate();
  }

  /**
   * Set up socket event handlers
   */
  private setupEventHandlers(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      // eslint-disable-next-line no-console
      console.log('Socket connected');
      this.reconnectAttempts = 0;

      // If previously authenticated, re-authenticate on reconnect
      if (this.userId && this.token && !this.authenticated) {
        this.authenticate();
      }

      this.notifyEventHandlers('connect');
    });

    this.socket.on('disconnect', (reason: string) => {
      // eslint-disable-next-line no-console
      console.log(`Socket disconnected: ${reason}`);
      this.authenticated = false;
      this.notifyEventHandlers('disconnect', reason);
    });

    this.socket.on('connect_error', (error: Error) => {
      // eslint-disable-next-line no-console
      console.error('Socket connection error:', error);
      this.reconnectAttempts++;
      this.notifyEventHandlers('error', error);

      // If exceeded max reconnect attempts, stop trying
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        this.disconnect();
        this.notifyEventHandlers('max_reconnect_attempts');
      }
    });

    // Auction events
    this.socket.on('auction:authenticated', (data: { userId: string }) => {
      // eslint-disable-next-line no-console
      console.log('Authenticated with auction server', data);
      this.authenticated = true;
      this.notifyEventHandlers('authenticated', data);
    });

    this.socket.on('auction:error', (data: { message: string }) => {
      // eslint-disable-next-line no-console
      console.error('Auction error:', data);
      this.notifyEventHandlers('auction_error', data);
    });

    this.socket.on('auction:state', (data: AuctionState) => {
      // Convert date string to Date object if it exists
      if (data.lastBidTime) {
        data.lastBidTime = new Date(data.lastBidTime);
      }
      this.notifyEventHandlers('auction_state', data);
    });

    this.socket.on('auction:bid-placed', (data: Record<string, unknown>) => {
      // Convert date string to Date object if it exists
      if (data.timestamp && typeof data.timestamp === 'string') {
        data.timestamp = new Date(data.timestamp);
      }
      this.notifyEventHandlers('bid_placed', data);
    });

    this.socket.on('auction:bid-accepted', (data: BidResponse) => {
      this.notifyEventHandlers('bid_accepted', data);
    });

    this.socket.on('auction:bid-rejected', (data: Record<string, unknown>) => {
      this.notifyEventHandlers('bid_rejected', data);
    });

    this.socket.on('auction:started', (data: { certificateId: string }) => {
      this.notifyEventHandlers('auction_started', data);
    });

    this.socket.on('auction:ended', (data: { certificateId: string, winner: string | null, interestRate?: number }) => {
      this.notifyEventHandlers('auction_ended', data);
    });

    this.socket.on('auction:heartbeat', (data: { timestamp: string | Date }) => {
      // Convert date string to Date object
      data.timestamp = new Date(data.timestamp);
      this.notifyEventHandlers('heartbeat', data);
    });
  }

  /**
   * Authenticate with the auction server
   */
  private authenticate(): void {
    if (!this.socket || !this.userId || !this.token) return;

    this.socket.emit('auction:authenticate', {
      userId: this.userId,
      token: this.token
    });
  }

  /**
   * Join an auction room
   */
  public joinAuction(certificateId: string): void {
    if (!this.socket || !this.authenticated) {
      this.reconnectAndPerformAction(() => this.joinAuction(certificateId));
      return;
    }

    this.socket.emit('auction:join', { certificateId });
  }

  /**
   * Leave an auction room
   */
  public leaveAuction(certificateId: string): void {
    if (!this.socket) return;

    this.socket.emit('auction:leave', { certificateId });
  }

  /**
   * Place a bid on a certificate
   */
  public placeBid(certificateId: string, interestRate: number): void {
    if (!this.socket || !this.authenticated || !this.userId) {
      this.reconnectAndPerformAction(() => this.placeBid(certificateId, interestRate));
      return;
    }

    this.socket.emit('auction:place-bid', {
      certificateId,
      bidderId: this.userId,
      interestRate,
      ipAddress: window.location.hostname,
      userAgent: navigator.userAgent
    });
  }

  /**
   * Reconnect and perform an action after reconnection
   */
  private reconnectAndPerformAction(action: () => void): void {
    // If we're not connected, try to reconnect
    if (!this.socket || !this.socket.connected) {
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
      }

      // Queue the action to be performed after reconnection
      this.on('connect', action);

      // Try to reconnect
      if (this.socket) {
        this.socket.connect();
      } else if (this.userId && this.token) {
        // If no socket exists, reinitialize (URL would need to be stored or passed again)
        // eslint-disable-next-line no-console
        console.error('Cannot reconnect: Socket not initialized');
      }
    }
  }

  /**
   * Register an event handler
   */
  public on(event: string, handler: EventHandler): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)?.add(handler);
  }

  /**
   * Unregister an event handler
   */
  public off(event: string, handler: EventHandler): void {
    if (this.eventHandlers.has(event)) {
      this.eventHandlers.get(event)?.delete(handler);
    }
  }

  /**
   * Notify all event handlers for an event
   */
  private notifyEventHandlers(event: string, ...args: unknown[]): void {
    if (this.eventHandlers.has(event)) {
      this.eventHandlers.get(event)?.forEach(handler => {
        try {
          handler(...args);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Disconnect from the socket server
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.authenticated = false;
  }

  /**
   * Check if the socket is connected
   */
  public isConnected(): boolean {
    return this.socket !== null && this.socket.connected;
  }

  /**
   * Check if the socket is authenticated
   */
  public isAuthenticated(): boolean {
    return this.authenticated;
  }
} 