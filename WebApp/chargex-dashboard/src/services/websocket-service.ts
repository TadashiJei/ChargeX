/**
 * WebSocket Service
 * 
 * This service handles real-time communication with the server
 * for telemetry updates, alerts, and other real-time data.
 */

class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000; // 3 seconds
  private listeners: { [event: string]: Function[] } = {};
  private isConnected = false;
  
  /**
   * Connect to the WebSocket server
   */
  connect() {
    if (this.socket) {
      return;
    }
    
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
    
    try {
      this.socket = new WebSocket(wsUrl);
      
      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.emit('connection', { status: 'connected' });
      };
      
      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type) {
            this.emit(data.type, data.payload);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      this.socket.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnected = false;
        this.socket = null;
        this.emit('connection', { status: 'disconnected' });
        
        // Attempt to reconnect
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          setTimeout(() => this.connect(), this.reconnectDelay);
        }
      };
      
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.emit('error', error);
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
    }
  }
  
  /**
   * Disconnect from the WebSocket server
   */
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.isConnected = false;
    }
  }
  
  /**
   * Send a message to the WebSocket server
   */
  send(type: string, payload: any) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not connected');
      return;
    }
    
    try {
      const message = JSON.stringify({
        type,
        payload
      });
      
      this.socket.send(message);
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
    }
  }
  
  /**
   * Subscribe to a specific event
   */
  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    
    this.listeners[event].push(callback);
    
    // If subscribing to telemetry, send subscription to server
    if (event === 'telemetry' && this.isConnected) {
      this.send('subscribe', { channel: 'telemetry' });
    }
    
    return () => this.off(event, callback);
  }
  
  /**
   * Unsubscribe from a specific event
   */
  off(event: string, callback: Function) {
    if (!this.listeners[event]) {
      return;
    }
    
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    
    // If unsubscribing from telemetry and no more listeners, send unsubscribe to server
    if (event === 'telemetry' && this.listeners[event].length === 0 && this.isConnected) {
      this.send('unsubscribe', { channel: 'telemetry' });
    }
  }
  
  /**
   * Emit an event to all listeners
   */
  private emit(event: string, data: any) {
    if (!this.listeners[event]) {
      return;
    }
    
    this.listeners[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in ${event} listener:`, error);
      }
    });
  }
  
  /**
   * Subscribe to telemetry updates for a specific battery
   */
  subscribeToBatteryTelemetry(batteryId: string) {
    if (!this.isConnected) {
      this.connect();
    }
    
    this.send('subscribe', {
      channel: 'telemetry',
      batteryId
    });
  }
  
  /**
   * Unsubscribe from telemetry updates for a specific battery
   */
  unsubscribeFromBatteryTelemetry(batteryId: string) {
    if (!this.isConnected) {
      return;
    }
    
    this.send('unsubscribe', {
      channel: 'telemetry',
      batteryId
    });
  }
  
  /**
   * Subscribe to alerts
   */
  subscribeToAlerts() {
    if (!this.isConnected) {
      this.connect();
    }
    
    this.send('subscribe', {
      channel: 'alerts'
    });
  }
  
  /**
   * Unsubscribe from alerts
   */
  unsubscribeFromAlerts() {
    if (!this.isConnected) {
      return;
    }
    
    this.send('unsubscribe', {
      channel: 'alerts'
    });
  }
  
  /**
   * Subscribe to energy trading updates
   */
  subscribeToEnergyTrading() {
    if (!this.isConnected) {
      this.connect();
    }
    
    this.send('subscribe', {
      channel: 'energy_trading'
    });
  }
  
  /**
   * Unsubscribe from energy trading updates
   */
  unsubscribeFromEnergyTrading() {
    if (!this.isConnected) {
      return;
    }
    
    this.send('unsubscribe', {
      channel: 'energy_trading'
    });
  }
}

export const websocketService = new WebSocketService();
