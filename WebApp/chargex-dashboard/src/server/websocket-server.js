/**
 * WebSocket Server
 * 
 * This server handles real-time communication with clients
 * for telemetry updates, alerts, and other real-time data.
 */

const WebSocket = require('ws');
const http = require('http');
const url = require('url');

// Create HTTP server
const server = http.createServer();

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Store client subscriptions
const subscriptions = {
  telemetry: new Map(), // Map of batteryId -> Set of clients
  alerts: new Set(),    // Set of clients subscribed to alerts
  energy_trading: new Set() // Set of clients subscribed to energy trading updates
};

// Handle WebSocket connections
wss.on('connection', (ws, req) => {
  const clientIp = req.socket.remoteAddress;
  console.log(`New WebSocket connection from ${clientIp}`);
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'connection',
    payload: {
      status: 'connected',
      message: 'Connected to ChargeX WebSocket Server'
    }
  }));
  
  // Handle messages from client
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'subscribe') {
        handleSubscription(ws, data.payload);
      } else if (data.type === 'unsubscribe') {
        handleUnsubscription(ws, data.payload);
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
      
      ws.send(JSON.stringify({
        type: 'error',
        payload: {
          message: 'Invalid message format'
        }
      }));
    }
  });
  
  // Handle client disconnection
  ws.on('close', () => {
    console.log(`WebSocket connection from ${clientIp} closed`);
    removeClientSubscriptions(ws);
  });
  
  // Handle errors
  ws.on('error', (error) => {
    console.error(`WebSocket error from ${clientIp}:`, error);
    removeClientSubscriptions(ws);
  });
});

/**
 * Handle client subscription requests
 */
function handleSubscription(ws, payload) {
  const { channel, batteryId } = payload;
  
  if (channel === 'telemetry') {
    if (batteryId) {
      // Subscribe to specific battery telemetry
      if (!subscriptions.telemetry.has(batteryId)) {
        subscriptions.telemetry.set(batteryId, new Set());
      }
      
      subscriptions.telemetry.get(batteryId).add(ws);
      
      console.log(`Client subscribed to telemetry for battery ${batteryId}`);
    } else {
      // Subscribe to all telemetry
      for (const [batteryId, clients] of subscriptions.telemetry.entries()) {
        clients.add(ws);
      }
      
      console.log('Client subscribed to all telemetry');
    }
  } else if (channel === 'alerts') {
    // Subscribe to alerts
    subscriptions.alerts.add(ws);
    console.log('Client subscribed to alerts');
  } else if (channel === 'energy_trading') {
    // Subscribe to energy trading updates
    subscriptions.energy_trading.add(ws);
    console.log('Client subscribed to energy trading updates');
  }
  
  // Confirm subscription
  ws.send(JSON.stringify({
    type: 'subscription',
    payload: {
      channel,
      batteryId,
      status: 'subscribed'
    }
  }));
}

/**
 * Handle client unsubscription requests
 */
function handleUnsubscription(ws, payload) {
  const { channel, batteryId } = payload;
  
  if (channel === 'telemetry') {
    if (batteryId) {
      // Unsubscribe from specific battery telemetry
      if (subscriptions.telemetry.has(batteryId)) {
        subscriptions.telemetry.get(batteryId).delete(ws);
        
        // Clean up if no more subscribers
        if (subscriptions.telemetry.get(batteryId).size === 0) {
          subscriptions.telemetry.delete(batteryId);
        }
      }
    } else {
      // Unsubscribe from all telemetry
      for (const [batteryId, clients] of subscriptions.telemetry.entries()) {
        clients.delete(ws);
        
        // Clean up if no more subscribers
        if (clients.size === 0) {
          subscriptions.telemetry.delete(batteryId);
        }
      }
    }
  } else if (channel === 'alerts') {
    // Unsubscribe from alerts
    subscriptions.alerts.delete(ws);
  } else if (channel === 'energy_trading') {
    // Unsubscribe from energy trading updates
    subscriptions.energy_trading.delete(ws);
  }
  
  // Confirm unsubscription
  ws.send(JSON.stringify({
    type: 'subscription',
    payload: {
      channel,
      batteryId,
      status: 'unsubscribed'
    }
  }));
}

/**
 * Remove all subscriptions for a client
 */
function removeClientSubscriptions(ws) {
  // Remove from telemetry subscriptions
  for (const [batteryId, clients] of subscriptions.telemetry.entries()) {
    clients.delete(ws);
    
    // Clean up if no more subscribers
    if (clients.size === 0) {
      subscriptions.telemetry.delete(batteryId);
    }
  }
  
  // Remove from alerts subscriptions
  subscriptions.alerts.delete(ws);
  
  // Remove from energy trading subscriptions
  subscriptions.energy_trading.delete(ws);
}

/**
 * Broadcast telemetry update to subscribed clients
 */
function broadcastTelemetryUpdate(batteryId, data) {
  if (subscriptions.telemetry.has(batteryId)) {
    const clients = subscriptions.telemetry.get(batteryId);
    
    const message = JSON.stringify({
      type: 'telemetry',
      payload: {
        batteryId,
        ...data
      }
    });
    
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }
}

/**
 * Broadcast alert to subscribed clients
 */
function broadcastAlert(alert) {
  const message = JSON.stringify({
    type: 'alert',
    payload: alert
  });
  
  for (const client of subscriptions.alerts) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}

/**
 * Broadcast energy trading update to subscribed clients
 */
function broadcastEnergyTradingUpdate(update) {
  const message = JSON.stringify({
    type: 'energy_trading',
    payload: update
  });
  
  for (const client of subscriptions.energy_trading) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}

// Start the server
const PORT = process.env.WS_PORT || 3003;
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});

// Export functions for external use
module.exports = {
  broadcastTelemetryUpdate,
  broadcastAlert,
  broadcastEnergyTradingUpdate
};
