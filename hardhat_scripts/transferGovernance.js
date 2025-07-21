const { ethers, network } = require("hardhat");
const { readConfig } = require("./helper.js");

async function main() {
  // 获取部署账户
  const [deployer] = await ethers.getSigners();
  console.log("Executing with account:", deployer.address);

  // 获取 QsPriceOracleForEla 合约地址
  const ORACLE_ADDRESS = await readConfig(network.name, "ASSET_ORACLE");
  console.log("Oracle address:", ORACLE_ADDRESS);

  // 新的 Governance 地址
  const NEW_GOVERNANCE = "0xf99d8EF7009071b60614F602Bc9B3E2644D193dD"; // 需要替换为实际的新治理地址
  console.log("New governance address:", NEW_GOVERNANCE);

  // 获取合约实例
  const QsPriceOracleForEla = await ethers.getContractFactory("QsPriceOracleForEla");
  const oracle = await QsPriceOracleForEla.attach(ORACLE_ADDRESS);

  // 获取当前的 governance 地址
  const currentGovernance = await oracle.governance();
  console.log("Current governance:", currentGovernance);

  // 调用 transferGovernance 方法
  console.log("Calling transferGovernance...");
  const tx = await oracle.transferGovernance(NEW_GOVERNANCE, {
    gasLimit: 300000 // 设置固定的 gas limit
  });

  // 等待交易确认
  console.log("Transaction hash:", tx.hash);
  await tx.wait();
  console.log("Transaction confirmed");

  // 验证是否成功转移
  const newGovernance = await oracle.governance();
  console.log("New governance after transfer:", newGovernance);
  
  if (newGovernance.toLowerCase() === NEW_GOVERNANCE.toLowerCase()) {
    console.log("✅ Governance transfer successful!");
  } else {
    console.log("❌ Governance transfer failed!");
  }
}

// 运行脚本
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
