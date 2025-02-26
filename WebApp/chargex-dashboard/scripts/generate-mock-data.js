/**
 * Script to generate mock telemetry data and alerts for testing
 * 
 * This script connects to the WebSocket server and sends mock telemetry
 * data and alerts at regular intervals.
 * 
 * Run with: node scripts/generate-mock-data.js
 */

require('dotenv').config();
const WebSocket = require('ws');

// Mock battery IDs (would come from your database in production)
const BATTERY_IDS = [
  '65db12345678901234567890',
  '65db23456789012345678901',
  '65db34567890123456789012'
];

// Connect to WebSocket server
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3003';
const ws = new WebSocket(WS_URL);

// Track connection state
let connected = false;

// Handle connection events
ws.on('open', () => {
  console.log(`Connected to WebSocket server at ${WS_URL}`);
  connected = true;
  
  // Start generating mock data
  startMockDataGeneration();
});

ws.on('close', () => {
  console.log('Disconnected from WebSocket server');
  connected = false;
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});

// Generate random telemetry data for a battery
function generateTelemetryData(batteryId) {
  // Generate realistic but random values
  const chargeLevel = Math.floor(Math.random() * 100);
  const temperature = 20 + Math.random() * 40; // 20-60°C
  const voltage = 3.6 + Math.random() * 0.8; // 3.6-4.4V
  const current = Math.random() * 10 - 5; // -5 to 5A (negative = discharging)
  const power = voltage * current;
  const health = 70 + Math.floor(Math.random() * 30); // 70-100%
  
  // Determine status based on current
  let status;
  if (current > 0.5) {
    status = 'charging';
  } else if (current < -0.5) {
    status = 'discharging';
  } else {
    status = 'idle';
  }
  
  // Random chance of error state
  if (Math.random() < 0.05) {
    status = 'error';
  }
  
  // Random chance of offline state
  if (Math.random() < 0.02) {
    status = 'offline';
  }
  
  return {
    batteryId,
    serialNumber: `BT-${batteryId.substring(0, 6)}`,
    chargeLevel,
    temperature,
    voltage,
    current,
    power,
    health,
    status,
    timestamp: new Date().toISOString()
  };
}

// Generate a random alert for a battery
function generateAlert(batteryId, telemetry) {
  // Determine alert type based on telemetry
  let type, severity, message;
  
  if (telemetry.chargeLevel < 20) {
    type = 'low_charge';
    severity = telemetry.chargeLevel < 10 ? 'high' : 'medium';
    message = `Battery charge critical at ${telemetry.chargeLevel}%`;
  } else if (telemetry.temperature > 50) {
    type = 'high_temperature';
    severity = telemetry.temperature > 55 ? 'high' : 'medium';
    message = `Battery temperature high at ${telemetry.temperature.toFixed(1)}°C`;
  } else if (telemetry.voltage > 4.3) {
    type = 'high_voltage';
    severity = 'medium';
    message = `Battery voltage high at ${telemetry.voltage.toFixed(2)}V`;
  } else if (telemetry.health < 80) {
    type = 'health_degradation';
    severity = telemetry.health < 75 ? 'medium' : 'low';
    message = `Battery health degrading: ${telemetry.health}%`;
  } else if (telemetry.status === 'error') {
    type = 'system_error';
    severity = 'high';
    message = 'Battery system error detected';
  } else if (telemetry.status === 'offline') {
    type = 'connection_lost';
    severity = 'medium';
    message = 'Battery connection lost';
  } else {
    // No alert needed
    return null;
  }
  
  return {
    batteryId,
    serialNumber: telemetry.serialNumber,
    type,
    severity,
    message,
    timestamp: new Date().toISOString(),
    acknowledged: false
  };
}

// Start generating mock data
function startMockDataGeneration() {
  // Generate telemetry data for each battery every 5 seconds
  setInterval(() => {
    if (!connected) return;
    
    BATTERY_IDS.forEach(batteryId => {
      // Generate telemetry
      const telemetry = generateTelemetryData(batteryId);
      
      // Send telemetry update
      ws.send(JSON.stringify({
        type: 'telemetry_update',
        data: telemetry
      }));
      
      console.log(`Sent telemetry for battery ${telemetry.serialNumber}: ${telemetry.chargeLevel}%, ${telemetry.status}`);
      
      // Random chance to generate an alert
      if (Math.random() < 0.2) {
        const alert = generateAlert(batteryId, telemetry);
        
        if (alert) {
          // Send alert
          ws.send(JSON.stringify({
            type: 'alert',
            data: alert
          }));
          
          console.log(`Sent alert for battery ${alert.serialNumber}: ${alert.severity} - ${alert.message}`);
        }
      }
    });
  }, 5000);
  
  // Generate random energy trading updates every 15 seconds
  setInterval(() => {
    if (!connected) return;
    
    // Random trade data
    const tradeUpdate = {
      id: Math.floor(Math.random() * 1000000),
      seller: `0x${Math.random().toString(16).substring(2, 10)}`,
      buyer: Math.random() < 0.5 ? `0x${Math.random().toString(16).substring(2, 10)}` : null,
      energyAmount: Math.floor(Math.random() * 100),
      pricePerUnit: Math.floor(Math.random() * 50) / 100,
      status: Math.random() < 0.7 ? 'open' : 'completed',
      timestamp: new Date().toISOString()
    };
    
    // Send trade update
    ws.send(JSON.stringify({
      type: 'energy_trading_update',
      data: tradeUpdate
    }));
    
    console.log(`Sent energy trading update: ${tradeUpdate.status}, ${tradeUpdate.energyAmount} kWh`);
  }, 15000);
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('Closing WebSocket connection...');
  ws.close();
  process.exit(0);
});
