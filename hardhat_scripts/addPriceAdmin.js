const { ethers, network } = require("hardhat");
const { readConfig } = require("./helper.js");

async function main() {
  // 获取部署账户
  const [deployer] = await ethers.getSigners();
  console.log("Executing with account:", deployer.address);

  // 获取 QsPriceOracleForEla 合约地址
  const ORACLE_ADDRESS = await readConfig(network.name, "ASSET_ORACLE");
  console.log("Oracle address:", ORACLE_ADDRESS);

  // 要添加的 Price Admin 地址
  const NEW_PRICE_ADMIN = "0xf99d8EF7009071b60614F602Bc9B3E2644D193dD"; // 需要替换为实际要添加的管理员地址
  console.log("Adding price admin:", NEW_PRICE_ADMIN);

  // 获取合约实例
  const QsPriceOracleForEla = await ethers.getContractFactory("QsPriceOracleForEla");
  const oracle = await QsPriceOracleForEla.attach(ORACLE_ADDRESS);

  // 调用 addPriceAdmin 方法
  console.log("Calling addPriceAdmin...");
  const tx = await oracle.addPriceAdmin(NEW_PRICE_ADMIN, {
    gasLimit: 300000 // 设置固定的 gas limit
  });

  // 等待交易确认
  console.log("Transaction hash:", tx.hash);
  await tx.wait();
  console.log("Transaction confirmed");

  // 验证是否成功添加
  const isPriceAdmin = await oracle.priceAdmin(NEW_PRICE_ADMIN);
  console.log("Is price admin after addition:", isPriceAdmin);
}

// 运行脚本
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
