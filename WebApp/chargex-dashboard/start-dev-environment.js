/**
 * Script to start the development environment
 * 
 * This script starts the WebSocket server and the mock data generator
 * in separate child processes.
 * 
 * Run with: node start-dev-environment.js
 */

const { spawn } = require('child_process');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

// Function to create a prefixed logger
function createLogger(prefix, color) {
  return (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        console.log(`${color}[${prefix}]${colors.reset} ${line}`);
      }
    });
  };
}

// Start WebSocket server
console.log(`${colors.bright}${colors.cyan}Starting ChargeX development environment...${colors.reset}`);
console.log(`${colors.bright}${colors.yellow}Press Ctrl+C to stop all processes${colors.reset}\n`);

// Start WebSocket server
console.log(`${colors.cyan}Starting WebSocket server...${colors.reset}`);
const wsServer = spawn('node', ['start-websocket-server.js'], {
  cwd: process.cwd(),
  stdio: 'pipe'
});

const wsLogger = createLogger('WebSocket', colors.cyan);
wsServer.stdout.on('data', wsLogger);
wsServer.stderr.on('data', wsLogger);

// Wait 2 seconds before starting mock data generator
setTimeout(() => {
  console.log(`${colors.green}Starting mock data generator...${colors.reset}`);
  const mockData = spawn('node', ['scripts/generate-mock-data.js'], {
    cwd: process.cwd(),
    stdio: 'pipe'
  });
  
  const mockLogger = createLogger('MockData', colors.green);
  mockData.stdout.on('data', mockLogger);
  mockData.stderr.on('data', mockLogger);
  
  // Handle mock data generator exit
  mockData.on('exit', (code) => {
    console.log(`${colors.red}Mock data generator exited with code ${code}${colors.reset}`);
    wsServer.kill();
    process.exit(code);
  });
}, 2000);

// Handle WebSocket server exit
wsServer.on('exit', (code) => {
  console.log(`${colors.red}WebSocket server exited with code ${code}${colors.reset}`);
  process.exit(code);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log(`\n${colors.yellow}Shutting down all processes...${colors.reset}`);
  wsServer.kill();
  process.exit(0);
});
