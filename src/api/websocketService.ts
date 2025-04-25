import { WS_URL } from '../config';
import { ImportProgressResponse, ExportProgressResponse } from './importExportApi';

type MessageHandler = (data: any) => void;
type ProgressHandler = (progress: ImportProgressResponse | ExportProgressResponse) => void;

// Event types that can be subscribed to
export enum WebSocketEventType {
  IMPORT_PROGRESS = 'import_progress',
  EXPORT_PROGRESS = 'export_progress',
  SCHEDULED_JOB_UPDATED = 'scheduled_job_updated',
  NOTIFICATION = 'notification',
}

// Combine all possible event types for type safety
export type WebSocketEvent = 
  | { type: WebSocketEventType.IMPORT_PROGRESS; jobId: string; data: ImportProgressResponse }
  | { type: WebSocketEventType.EXPORT_PROGRESS; jobId: string; data: ExportProgressResponse }
  | { type: WebSocketEventType.SCHEDULED_JOB_UPDATED; jobId: string; data: any }
  | { type: WebSocketEventType.NOTIFICATION; message: string; level: 'info' | 'success' | 'warning' | 'error' };

class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private eventHandlers: Map<string, Set<MessageHandler>> = new Map();
  private jobProgressHandlers: Map<string, Set<ProgressHandler>> = new Map();
  private connected = false;
  private connectPromise: Promise<void> | null = null;
  private maxReconnectAttempts = 5;
  private reconnectAttempts = 0;
  private reconnectDelay = 2000; // Start with 2 seconds delay
  
  constructor() {
    // Initialize the maps for each event type
    Object.values(WebSocketEventType).forEach(type => {
      this.eventHandlers.set(type, new Set());
    });
  }

  // Connect to WebSocket server
  public connect(): Promise<void> {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return Promise.resolve();
    }

    if (!this.connectPromise) {
      this.connectPromise = new Promise<void>((resolve, reject) => {
        try {
          this.socket = new WebSocket(WS_URL);
          
          this.socket.onopen = () => {
            console.log('WebSocket connection established');
            this.connected = true;
            this.reconnectAttempts = 0;
            this.connectPromise = null;
            resolve();
          };
          
          this.socket.onclose = (event) => {
            console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
            this.connected = false;
            this.handleReconnect();
          };
          
          this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            if (!this.connected) {
              this.connectPromise = null;
              reject(new Error('Failed to connect to WebSocket server'));
            }
          };
          
          this.socket.onmessage = (event) => {
            try {
              const message = JSON.parse(event.data) as WebSocketEvent;
              this.handleMessage(message);
            } catch (error) {
              console.error('Error parsing WebSocket message:', error);
            }
          };
        } catch (error) {
          this.connectPromise = null;
          reject(error);
        }
      });
    }
    
    return this.connectPromise;
  }

  // Reconnect logic with exponential backoff
  private handleReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = Math.min(30000, this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts));
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
      
      this.reconnectTimer = setTimeout(() => {
        this.reconnectAttempts++;
        this.connect();
      }, delay);
    } else {
      console.error('Maximum reconnection attempts reached. Please refresh the page.');
    }
  }

  // Disconnect from WebSocket server
  public disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    this.connected = false;
  }

  // Subscribe to a specific event type
  public subscribe(type: WebSocketEventType, handler: MessageHandler): void {
    const handlers = this.eventHandlers.get(type);
    if (handlers) {
      handlers.add(handler);
    }
  }

  // Unsubscribe from a specific event type
  public unsubscribe(type: WebSocketEventType, handler: MessageHandler): void {
    const handlers = this.eventHandlers.get(type);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  // Subscribe to progress updates for a specific job
  public subscribeToJobProgress(
    jobId: string, 
    type: WebSocketEventType.IMPORT_PROGRESS | WebSocketEventType.EXPORT_PROGRESS,
    handler: ProgressHandler
  ): void {
    // Ensure we're connected
    this.connect().catch(error => console.error('Failed to connect when subscribing to job:', error));
    
    // Create a unique key for this job and event type
    const key = `${type}:${jobId}`;
    
    // Get or create the set of handlers for this key
    if (!this.jobProgressHandlers.has(key)) {
      this.jobProgressHandlers.set(key, new Set());
    }
    
    const handlers = this.jobProgressHandlers.get(key)!;
    handlers.add(handler);
    
    // Also subscribe to the general event type if we haven't already
    if (handlers.size === 1) {
      this.subscribe(type, (data) => {
        if (data.jobId === jobId) {
          handlers.forEach(h => h(data.data));
        }
      });
    }
  }

  // Unsubscribe from progress updates for a specific job
  public unsubscribeFromJobProgress(
    jobId: string,
    type: WebSocketEventType.IMPORT_PROGRESS | WebSocketEventType.EXPORT_PROGRESS,
    handler: ProgressHandler
  ): void {
    const key = `${type}:${jobId}`;
    const handlers = this.jobProgressHandlers.get(key);
    
    if (handlers) {
      handlers.delete(handler);
      
      // Clean up if no handlers left
      if (handlers.size === 0) {
        this.jobProgressHandlers.delete(key);
      }
    }
  }

  // Send a message to the server
  public sendMessage(data: any): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.connect()
        .then(() => {
          this.socket?.send(JSON.stringify(data));
        })
        .catch(error => console.error('Failed to send message:', error));
      return;
    }
    
    this.socket.send(JSON.stringify(data));
  }

  // Handle incoming messages
  private handleMessage(message: WebSocketEvent): void {
    // Get the handlers for this event type
    const handlers = this.eventHandlers.get(message.type);
    
    if (handlers) {
      // Call all registered handlers for this event type
      handlers.forEach(handler => {
        try {
          handler(message);
        } catch (error) {
          console.error(`Error in WebSocket event handler for ${message.type}:`, error);
        }
      });
    }
  }

  // Check if connected
  public isConnected(): boolean {
    return this.connected;
  }
}

// Create a singleton instance
const websocketService = new WebSocketService();
export default websocketService; 