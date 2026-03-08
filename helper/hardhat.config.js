require("@nomicfoundation/hardhat-toolbox");
// require("@tenderly/hardhat-tenderly");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    arbitrumSepolia: {
      url: process.env.ARBITRUM_SEPOLIA_RPC || "https://sepolia-rollup.arbitrum.io/rpc",
      accounts: (process.env.PRIVATE_KEY || process.env.CRE_ETH_PRIVATE_KEY) ? [process.env.PRIVATE_KEY || process.env.CRE_ETH_PRIVATE_KEY] : [],
      chainId: 421614,
    },
    sepolia: {
      url: process.env.RPC_URL_SEPOLIA || "https://ethereum-sepolia-rpc.publicnode.com",
      accounts: (process.env.PRIVATE_KEY || process.env.CRE_ETH_PRIVATE_KEY) ? [process.env.PRIVATE_KEY || process.env.CRE_ETH_PRIVATE_KEY] : [],
      chainId: 99911155111,
    },
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC || "https://sepolia.base.org",
      accounts: (process.env.PRIVATE_KEY || process.env.CRE_ETH_PRIVATE_KEY) ? [process.env.PRIVATE_KEY || process.env.CRE_ETH_PRIVATE_KEY] : [],
      chainId: 84532,
    },
    tenderly: {
      url: process.env.RPC_URL_SEPOLIA || "",
      accounts: (process.env.PRIVATE_KEY || process.env.CRE_ETH_PRIVATE_KEY) ? [process.env.PRIVATE_KEY || process.env.CRE_ETH_PRIVATE_KEY] : [],
    },
  },
  tenderly: {
    project: process.env.TENDERLY_PROJECT || "",
    username: process.env.TENDERLY_USERNAME || "",
    privateVerification: false,
  },
  etherscan: {
    apiKey: {
      arbitrumSepolia: process.env.ARBISCAN_API_KEY || "",
      baseSepolia: process.env.BASESCAN_API_KEY || "",
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
