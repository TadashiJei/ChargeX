# ChargeX Dashboard

A modern dashboard for managing battery leasing, energy trading, and real-time battery monitoring.

## Features

- **Battery Leasing**: Manage battery leases with blockchain-based smart contracts
- **Energy Trading**: Facilitate peer-to-peer energy trading with blockchain integration
- **Battery Monitoring**: Real-time telemetry and alerts for battery status
- **WebSocket Integration**: Real-time updates for telemetry, alerts, and trading

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- MongoDB (for data storage)
- MetaMask or another Web3 wallet (for blockchain features)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/chargex-dashboard.git
   cd chargex-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with the required environment variables (see `.env.example`).

### Development

Run the standard Next.js development server:

```bash
npm run dev
```

For WebSocket features, run the WebSocket server in a separate terminal:

```bash
npm run websocket
```

For testing with mock data, run:

```bash
npm run mock-data
```

Or run both WebSocket server and mock data generator with one command:

```bash
npm run dev:ws
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Documentation

For more detailed information, see:

- [Blockchain Integration](./README-BLOCKCHAIN.md) - Smart contract setup and usage
- [WebSocket Server](./README-WEBSOCKET.md) - Real-time updates and API

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Ethereum and Web3](https://ethereum.org/en/developers/docs/)
- [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
