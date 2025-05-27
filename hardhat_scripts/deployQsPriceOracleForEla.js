const { ethers, network, run } = require("hardhat");
const { readConfig, writeConfig } = require("./helper.js");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 获取 WELA 地址，这个需要根据实际网络来设置
  const WELA_ADDRESS = await readConfig(network.name, "ETH"); // 请替换为实际的 WELA 地址
  console.log("WELA_ADDRESS", WELA_ADDRESS);

  // 部署 QsPriceOracleForEla
  const QsPriceOracleForEla = await ethers.getContractFactory("QsPriceOracleForEla", deployer);
  const priceOracle = await QsPriceOracleForEla.deploy(WELA_ADDRESS, {
    gasLimit: 3000000 // 设置固定的 gas limit
  });
  
  // 等待部署完成
  await priceOracle.waitForDeployment();
  const priceOracleAddress = await priceOracle.getAddress();

  console.log("QsPriceOracleForEla deployed to:", priceOracleAddress);
  console.log("Governance (initial admin):", await priceOracle.governance());
  console.log("Wrapped Native Token:", await priceOracle.wrappedNativeToken());
  await writeConfig(network.name, "ASSET_ORACLE", priceOracleAddress);

  // 验证合约
  // if (network.name !== "hardhat") {
  //   console.log("Waiting for block confirmations...");
  //   const receipt = await priceOracle.deploymentTransaction().wait(1);

  //   console.log("Verifying contract...");
  //   try {
  //     await hre.run("verify:verify", {
  //       address: priceOracleAddress,
  //       constructorArguments: [WELA_ADDRESS],
  //     });
  //     console.log("Contract verified successfully");
  //   } catch (error) {
  //     console.log("Verification failed:", error);
  //   }
  // }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
