import { API_BASE_URL } from '../frontend/config';

type MessageHandler = (message: any) => void;
type ConnectionHandler = () => void;

class WebSocketClient {
  private socket: WebSocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private messageHandlers: Map<string, Set<MessageHandler>> = new Map();
  private connectHandlers: Set<ConnectionHandler> = new Set();
  private disconnectHandlers: Set<ConnectionHandler> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000; // Start with 2 seconds

  constructor(private url: string, private token: string | null = null) {}

  connect() {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const wsUrl = `${this.url.replace('http', 'ws')}/ws`;
    const fullUrl = this.token ? `${wsUrl}?token=${this.token}` : wsUrl;
    
    this.socket = new WebSocket(fullUrl);
    
    this.socket.onopen = () => {
      console.log('WebSocket connection established');
      this.reconnectAttempts = 0;
      this.reconnectDelay = 2000;
      this.notifyConnectHandlers();
    };
    
    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };
    
    this.socket.onclose = (event) => {
      console.log(`WebSocket connection closed: ${event.code} - ${event.reason}`);
      this.notifyDisconnectHandlers();
      
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.scheduleReconnect();
      } else {
        console.log('Maximum reconnection attempts reached');
      }
    };
    
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    
    this.reconnectAttempts++;
    const delay = Math.min(30000, this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1));
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  subscribe(topic: string, handler: MessageHandler) {
    if (!this.messageHandlers.has(topic)) {
      this.messageHandlers.set(topic, new Set());
    }
    
    this.messageHandlers.get(topic)?.add(handler);
    
    // If connected, send subscription message
    this.sendSubscription('subscribe', topic);
    
    return () => this.unsubscribe(topic, handler);
  }

  unsubscribe(topic: string, handler: MessageHandler) {
    const handlers = this.messageHandlers.get(topic);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.messageHandlers.delete(topic);
        // If connected, send unsubscription message
        this.sendSubscription('unsubscribe', topic);
      }
    }
  }

  onConnect(handler: ConnectionHandler) {
    this.connectHandlers.add(handler);
    return () => this.connectHandlers.delete(handler);
  }

  onDisconnect(handler: ConnectionHandler) {
    this.disconnectHandlers.add(handler);
    return () => this.disconnectHandlers.delete(handler);
  }

  private notifyConnectHandlers() {
    this.connectHandlers.forEach(handler => handler());
  }

  private notifyDisconnectHandlers() {
    this.disconnectHandlers.forEach(handler => handler());
  }

  private handleMessage(data: any) {
    if (!data || !data.topic) return;
    
    const handlers = this.messageHandlers.get(data.topic);
    if (handlers) {
      handlers.forEach(handler => handler(data.payload));
    }
  }

  private sendSubscription(action: 'subscribe' | 'unsubscribe', topic: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        action,
        topic
      }));
    }
  }

  send(message: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('Cannot send message, socket is not connected');
    }
  }

  isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }
}

// Singleton instance
const wsClient = new WebSocketClient(API_BASE_URL);

// Export hooks for subscribing to topics
export const subscribeToImportProgress = (jobId: string, handler: MessageHandler) => {
  return wsClient.subscribe(`import.progress.${jobId}`, handler);
};

export const subscribeToExportProgress = (jobId: string, handler: MessageHandler) => {
  return wsClient.subscribe(`export.progress.${jobId}`, handler);
};

export const subscribeToFileUploadProgress = (fileId: string, handler: MessageHandler) => {
  return wsClient.subscribe(`file.upload.${fileId}`, handler);
};

export const connectWebSocket = (token: string) => {
  wsClient.disconnect();
  const newClient = new WebSocketClient(API_BASE_URL, token);
  newClient.connect();
  return newClient;
};

export default wsClient; 