// Script to deploy ChargeX smart contracts
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Contract ABIs and Bytecode will be populated during compilation
const contracts = {
  BatteryLeasing: {
    abi: null,
    bytecode: null
  },
  EnergyTrading: {
    abi: null,
    bytecode: null
  }
};

async function main() {
  // Connect to the network
  const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
  
  // Load wallet from private key
  const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);
  console.log(`Deploying contracts from address: ${wallet.address}`);
  
  // Deploy BatteryLeasing contract
  console.log('Deploying BatteryLeasing contract...');
  const BatteryLeasingFactory = new ethers.ContractFactory(
    contracts.BatteryLeasing.abi,
    contracts.BatteryLeasing.bytecode,
    wallet
  );
  const batteryLeasing = await BatteryLeasingFactory.deploy();
  await batteryLeasing.deployed();
  console.log(`BatteryLeasing contract deployed to: ${batteryLeasing.address}`);
  
  // Deploy EnergyTrading contract
  console.log('Deploying EnergyTrading contract...');
  const EnergyTradingFactory = new ethers.ContractFactory(
    contracts.EnergyTrading.abi,
    contracts.EnergyTrading.bytecode,
    wallet
  );
  const energyTrading = await EnergyTradingFactory.deploy();
  await energyTrading.deployed();
  console.log(`EnergyTrading contract deployed to: ${energyTrading.address}`);
  
  // Save contract addresses to a file
  const deploymentInfo = {
    network: process.env.ETHEREUM_NETWORK || 'unknown',
    batteryLeasingAddress: batteryLeasing.address,
    energyTradingAddress: energyTrading.address,
    deploymentTime: new Date().toISOString(),
    deployer: wallet.address
  };
  
  fs.writeFileSync(
    path.join(__dirname, 'deployment-info.json'),
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log('Deployment information saved to deployment-info.json');
  
  return deploymentInfo;
}

// Execute the deployment
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { main };
