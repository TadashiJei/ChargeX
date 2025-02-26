# ChargeX Blockchain Integration

This document provides instructions for setting up and running the ChargeX dashboard with blockchain integration for battery leasing and energy trading.

## Features

- **Smart Contracts**: Battery leasing and energy trading contracts deployed on Ethereum
- **Web3 Integration**: Frontend components that interact with blockchain contracts
- **Real-time Updates**: WebSocket server for real-time telemetry and trading updates

## Smart Contracts

The project includes two main smart contracts:

1. **BatteryLeasing.sol**: Manages battery leasing, including registration, leasing, and lease management
2. **EnergyTrading.sol**: Facilitates peer-to-peer energy trading with buy/sell orders

## Setup Instructions

### Prerequisites

- Node.js 16+ and npm
- MetaMask or another Web3 wallet
- Access to an Ethereum network (local, testnet, or mainnet)

### Environment Variables

Create a `.env.local` file in the project root with the following variables:

```
# Ethereum Configuration
NEXT_PUBLIC_BATTERY_LEASING_CONTRACT_ADDRESS=your_deployed_battery_leasing_contract_address
NEXT_PUBLIC_ENERGY_TRADING_CONTRACT_ADDRESS=your_deployed_energy_trading_contract_address
ETHEREUM_RPC_URL=your_ethereum_rpc_url
DEPLOYER_PRIVATE_KEY=your_deployer_private_key

# WebSocket Configuration
NEXT_PUBLIC_WS_URL=ws://localhost:3001
WS_PORT=3001
```

### Deploying Smart Contracts

1. Navigate to the project directory:
   ```
   cd /Users/jay/Java/ChargeX/WebApp/chargex-dashboard
   ```

2. Deploy the smart contracts:
   ```
   node src/contracts/deploy.js
   ```

3. Update the `.env.local` file with the deployed contract addresses.

### Running the Application

1. Start the WebSocket server:
   ```
   npm run websocket
   ```

2. In a separate terminal, start the Next.js application:
   ```
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Using the Application

### Battery Leasing

1. Connect your Web3 wallet
2. Browse available batteries
3. Select a battery and lease duration
4. Confirm the transaction in your wallet

### Energy Trading

1. Connect your Web3 wallet
2. Create a sell order for energy
3. Browse available energy trades
4. Buy energy by confirming the transaction in your wallet

### Battery Monitoring

1. Select a battery to monitor
2. View real-time telemetry data
3. Receive and acknowledge alerts

## Development

### WebSocket Server

The WebSocket server provides real-time updates for:
- Battery telemetry
- Alerts
- Energy trading updates

To modify the WebSocket server, edit:
```
src/server/websocket-server.js
```

### Smart Contracts

To modify the smart contracts, edit:
```
src/contracts/BatteryLeasing.sol
src/contracts/EnergyTrading.sol
```

After making changes, redeploy the contracts and update the contract addresses in your `.env.local` file.

### Frontend Components

The main frontend components are:
- `src/components/BatteryLeasing.tsx`
- `src/components/EnergyTrading.tsx`
- `src/components/BatteryMonitor.tsx`

## Troubleshooting

- **MetaMask Connection Issues**: Ensure you're connected to the correct network in MetaMask
- **WebSocket Connection Errors**: Check that the WebSocket server is running and the `NEXT_PUBLIC_WS_URL` is set correctly
- **Smart Contract Errors**: Verify the contract addresses in your `.env.local` file match the deployed contracts
