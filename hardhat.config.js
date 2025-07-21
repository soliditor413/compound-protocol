require("hardhat-deploy");
require("@nomicfoundation/hardhat-verify");
require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();

const { staging_key, prod_key } = process.env;
const mainNetURL = "https://api.elastos.io/esc";
const testnetURL = "https://api-testnet.elastos.io/esc";
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.5.16",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    prod: {
      url: mainNetURL,
      accounts: [...(prod_key ? [prod_key] : [])]
    },
    staging: {
      url: mainNetURL,
      accounts: [...(staging_key ? [staging_key] : [])]
    },
    testnet: {
      url: testnetURL,
      accounts: [...(staging_key ? [staging_key] : [])]
    },
    pgp_testnet: {
      url: "https://api-testnet.elastos.io/pgp",
      accounts: [...(staging_key ? [staging_key, staging_key] : [])],
    },
    mainNet: {
      url: mainNetURL,
    },
    hardhat: {
      chainId: 100,
      blockGasLimit: 8000000
    }
  },
  etherscan: {
    apiKey: {
      'testnet': 'empty',
      'mainNet': 'empty',
      'pgp_testnet': 'empty',
      'pgp_mainnet': 'empty',
    },
    customChains: [
      {
        network: "testnet",
        chainId: 21,
        urls: {
          apiURL: "https://esc-testnet.elastos.io:443/api",
          browserURL: "https://esc-testnet.elastos.io:443"
        }
      },
      {
        network: "mainNet",
        chainId: 20,
        urls: {
          apiURL: "https://esc.elastos.io:443/api",
          browserURL: "https://esc.elastos.io:443"
        }
      },
      {
        network: "pgp_testnet",
        chainId: 12345,
        urls: {
          apiURL: "https://pgp-testnet.elastos.io:443/api",
          browserURL: "https://pgp-testnet.elastos.io:443"
        }
      },
    ]
  },
};
