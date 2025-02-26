/**
 * Script to start the WebSocket server
 * 
 * Run this with: node start-websocket-server.js
 */

// Load environment variables
require('dotenv').config();

// Start the WebSocket server
require('./src/server/websocket-server');
