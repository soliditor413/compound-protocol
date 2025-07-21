const { ethers, network, run } = require("hardhat");
const { readConfig, writeConfig } = require("./helper.js");

async function main() {
  // 获取部署账户
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 获取合约工厂
  const QsElaAssetOracle = await ethers.getContractFactory("QsElaAssetOracle");

  // 部署参数
  const DECIMALS = 8; // 设置价格精度为8位小数
  const DESCRIPTION = "ELA Asset Oracle"; // 预言机描述
  const BASE_ORACLE_ADDRESS = await readConfig(network.name, "ASSET_ORACLE"); // 需要替换为实际的 QsPriceOracleForEla 地址
  const ASSET_ADDRESS = await readConfig(network.name, "ELA"); // 需要替换为实际的资产地址

  // 部署合约
  console.log("Deploying QsElaAssetOracle...");
  const oracle = await QsElaAssetOracle.deploy(
    DECIMALS,
    DESCRIPTION,
    BASE_ORACLE_ADDRESS,
    ASSET_ADDRESS,{
        gasLimit: 3000000 // 设置固定的 gas limit
    }
  );

  await oracle.waitForDeployment();
  const assetOracleAddress = await oracle.getAddress();

  console.log("QsElaAssetOracle deployed to:", assetOracleAddress);
  console.log("Transaction hash:", oracle.deploymentTransaction().hash);
  console.log("Parameters:");
  console.log("- Decimals:", DECIMALS);
  console.log("- Description:", DESCRIPTION);
  console.log("- Base Oracle:", BASE_ORACLE_ADDRESS);
  console.log("- Asset:", ASSET_ADDRESS);

  await writeConfig(network.name, "ELA_ASSET_ORACLE", assetOracleAddress);

  // 验证合约
//   if (network.name !== "hardhat") {
//     console.log("Waiting for block confirmations...");

//     console.log("Verifying contract...");
//     try {
//       await run("verify:verify", {
//         address: assetOracleAddress,
//         constructorArguments: [DECIMALS, DESCRIPTION, BASE_ORACLE_ADDRESS, ASSET_ADDRESS],
//       });
//       console.log("Contract verified successfully");
//     } catch (error) {
//       console.log("Verification failed:", error);
//     }
//   }
}

// 运行部署脚本
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });