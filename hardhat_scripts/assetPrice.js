const { ethers, network } = require("hardhat");
const { readConfig } = require("./helper.js");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 获取 WELA 地址，这个需要根据实际网络来设置
  const AssetOracleAddress = await readConfig(network.name, "ASSET_ORACLE"); // 请替换为实际的 WELA 地址
  console.log("AssetOracleAddress", AssetOracleAddress);

  // 部署 QsPriceOracleForEla
  const QsPriceOracleForEla = await ethers.getContractFactory("QsPriceOracleForEla", deployer);
  const priceOracle = await QsPriceOracleForEla.attach(AssetOracleAddress);

  
  // 等待部署完成
  const priceOracleAddress = await priceOracle.getAddress();

  console.log("QsPriceOracleForEla deployed to:", priceOracleAddress);
  console.log("Governance (initial admin):", await priceOracle.governance());
  console.log("Wrapped Native Token:", await priceOracle.wrappedNativeToken());

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
