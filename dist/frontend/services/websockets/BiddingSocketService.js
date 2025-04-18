"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BiddingSocketService = void 0;
const socket_io_client_1 = __importDefault(require("socket.io-client"));
/**
 * Bidding Socket Service
 *
 * This service manages the WebSocket connection to the bidding server
 * and provides methods for interacting with auctions.
 */
class BiddingSocketService {
    socket = null;
    userId = null;
    token = null;
    authenticated = false;
    eventHandlers = new Map();
    reconnectAttempts = 0;
    maxReconnectAttempts = 5;
    reconnectTimeout = null;
    // Singleton instance
    static instance = null;
    /**
     * Get the singleton instance
     */
    static getInstance() {
        if (!BiddingSocketService.instance) {
            BiddingSocketService.instance = new BiddingSocketService();
        }
        return BiddingSocketService.instance;
    }
    /**
     * Private constructor to prevent direct instantiation
     */
    constructor() { }
    /**
     * Initialize the socket connection
     */
    initialize(url, userId, token) {
        this.userId = userId;
        this.token = token;
        // Clean up any existing connection
        this.disconnect();
        // Create a new connection
        this.socket = (0, socket_io_client_1.default)(url, {
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
    setupEventHandlers() {
        if (!this.socket)
            return;
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
        this.socket.on('disconnect', (reason) => {
            // eslint-disable-next-line no-console
            console.log(`Socket disconnected: ${reason}`);
            this.authenticated = false;
            this.notifyEventHandlers('disconnect', reason);
        });
        this.socket.on('connect_error', (error) => {
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
        this.socket.on('auction:authenticated', (data) => {
            // eslint-disable-next-line no-console
            console.log('Authenticated with auction server', data);
            this.authenticated = true;
            this.notifyEventHandlers('authenticated', data);
        });
        this.socket.on('auction:error', (data) => {
            // eslint-disable-next-line no-console
            console.error('Auction error:', data);
            this.notifyEventHandlers('auction_error', data);
        });
        this.socket.on('auction:state', (data) => {
            // Convert date string to Date object if it exists
            if (data.lastBidTime) {
                data.lastBidTime = new Date(data.lastBidTime);
            }
            this.notifyEventHandlers('auction_state', data);
        });
        this.socket.on('auction:bid-placed', (data) => {
            // Convert date string to Date object if it exists
            if (data.timestamp && typeof data.timestamp === 'string') {
                data.timestamp = new Date(data.timestamp);
            }
            this.notifyEventHandlers('bid_placed', data);
        });
        this.socket.on('auction:bid-accepted', (data) => {
            this.notifyEventHandlers('bid_accepted', data);
        });
        this.socket.on('auction:bid-rejected', (data) => {
            this.notifyEventHandlers('bid_rejected', data);
        });
        this.socket.on('auction:started', (data) => {
            this.notifyEventHandlers('auction_started', data);
        });
        this.socket.on('auction:ended', (data) => {
            this.notifyEventHandlers('auction_ended', data);
        });
        this.socket.on('auction:heartbeat', (data) => {
            // Convert date string to Date object
            data.timestamp = new Date(data.timestamp);
            this.notifyEventHandlers('heartbeat', data);
        });
    }
    /**
     * Authenticate with the auction server
     */
    authenticate() {
        if (!this.socket || !this.userId || !this.token)
            return;
        this.socket.emit('auction:authenticate', {
            userId: this.userId,
            token: this.token
        });
    }
    /**
     * Join an auction room
     */
    joinAuction(certificateId) {
        if (!this.socket || !this.authenticated) {
            this.reconnectAndPerformAction(() => this.joinAuction(certificateId));
            return;
        }
        this.socket.emit('auction:join', { certificateId });
    }
    /**
     * Leave an auction room
     */
    leaveAuction(certificateId) {
        if (!this.socket)
            return;
        this.socket.emit('auction:leave', { certificateId });
    }
    /**
     * Place a bid on a certificate
     */
    placeBid(certificateId, interestRate) {
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
    reconnectAndPerformAction(action) {
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
            }
            else if (this.userId && this.token) {
                // If no socket exists, reinitialize (URL would need to be stored or passed again)
                // eslint-disable-next-line no-console
                console.error('Cannot reconnect: Socket not initialized');
            }
        }
    }
    /**
     * Register an event handler
     */
    on(event, handler) {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, new Set());
        }
        this.eventHandlers.get(event)?.add(handler);
    }
    /**
     * Unregister an event handler
     */
    off(event, handler) {
        if (this.eventHandlers.has(event)) {
            this.eventHandlers.get(event)?.delete(handler);
        }
    }
    /**
     * Notify all event handlers for an event
     */
    notifyEventHandlers(event, ...args) {
        if (this.eventHandlers.has(event)) {
            this.eventHandlers.get(event)?.forEach(handler => {
                try {
                    handler(...args);
                }
                catch (error) {
                    // eslint-disable-next-line no-console
                    console.error(`Error in event handler for ${event}:`, error);
                }
            });
        }
    }
    /**
     * Disconnect from the socket server
     */
    disconnect() {
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
    isConnected() {
        return this.socket !== null && this.socket.connected;
    }
    /**
     * Check if the socket is authenticated
     */
    isAuthenticated() {
        return this.authenticated;
    }
}
exports.BiddingSocketService = BiddingSocketService;
//# sourceMappingURL=BiddingSocketService.js.map