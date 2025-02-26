# ChargeX WebSocket Server

This document provides instructions for setting up and running the WebSocket server for real-time updates in the ChargeX dashboard.

## Overview

The WebSocket server provides real-time updates for:
- Battery telemetry data
- Battery alerts
- Energy trading updates

## Setup Instructions

### Prerequisites

- Node.js 16+ and npm
- ChargeX dashboard application

### Environment Variables

Make sure your `.env.local` file includes the following WebSocket configuration:

```
# WebSocket Configuration
NEXT_PUBLIC_WS_URL=ws://localhost:3002
WS_PORT=3002
```

## Running the WebSocket Server

1. Start the WebSocket server:
   ```
   npm run websocket
   ```

2. In a separate terminal, start the Next.js application:
   ```
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Testing with Mock Data

For development and testing purposes, you can generate mock telemetry data and alerts:

1. Start the WebSocket server:
   ```
   npm run websocket
   ```

2. In a separate terminal, run the mock data generator:
   ```
   npm run mock-data
   ```

This will send random telemetry updates and alerts to the WebSocket server, which will then broadcast them to connected clients.

## WebSocket API

### Client to Server Messages

Clients can send the following message types to the server:

#### Subscribe to Telemetry Updates

```json
{
  "type": "subscribe",
  "channel": "telemetry",
  "batteryId": "battery_id_here"
}
```

#### Subscribe to Alerts

```json
{
  "type": "subscribe",
  "channel": "alerts"
}
```

#### Subscribe to Energy Trading Updates

```json
{
  "type": "subscribe",
  "channel": "energy_trading"
}
```

#### Unsubscribe

```json
{
  "type": "unsubscribe",
  "channel": "channel_name",
  "batteryId": "battery_id_here" // Only required for telemetry
}
```

### Server to Client Messages

The server sends the following message types to clients:

#### Telemetry Update

```json
{
  "type": "telemetry_update",
  "data": {
    "batteryId": "battery_id",
    "serialNumber": "BT-123456",
    "chargeLevel": 85,
    "temperature": 32.5,
    "voltage": 3.9,
    "current": 1.2,
    "power": 4.68,
    "health": 92,
    "status": "charging",
    "timestamp": "2025-02-26T09:30:00.000Z"
  }
}
```

#### Alert

```json
{
  "type": "alert",
  "data": {
    "batteryId": "battery_id",
    "serialNumber": "BT-123456",
    "type": "high_temperature",
    "severity": "medium",
    "message": "Battery temperature high at 52.3°C",
    "timestamp": "2025-02-26T09:35:00.000Z",
    "acknowledged": false
  }
}
```

#### Energy Trading Update

```json
{
  "type": "energy_trading_update",
  "data": {
    "id": "trade_id",
    "seller": "0x1234...",
    "buyer": "0x5678...",
    "energyAmount": 25,
    "pricePerUnit": 0.12,
    "status": "completed",
    "timestamp": "2025-02-26T10:15:00.000Z"
  }
}
```

## Troubleshooting

- **Connection Issues**: Check that the WebSocket server is running and the `NEXT_PUBLIC_WS_URL` is set correctly
- **No Updates**: Ensure you've subscribed to the correct channels
- **Server Crashes**: Check the server logs for error messages
