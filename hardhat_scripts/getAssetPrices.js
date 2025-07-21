const { ethers, network } = require("hardhat");
const { readConfig } = require("./helper.js");

async function main() {
    // 获取部署账户
    const [deployer] = await ethers.getSigners();
    console.log("Executing with account:", deployer.address);

    // 获取 QsPriceOracleForEla 合约地址
    const ORACLE_ADDRESS = await readConfig(network.name, "ASSET_ORACLE");
    console.log("Oracle address:", ORACLE_ADDRESS);
    // 获取合约实例
    const oracle = await ethers.getContractAt("QsPriceOracleForEla", ORACLE_ADDRESS);

    // 调用 getAssetPrices 方法
    console.log("Calling assetPrices...");
    const ETH = await readConfig(network.name, "ETH");
    const USDC = await readConfig(network.name, "USDC");
    const BTC = await readConfig(network.name, "BTC");
    const USDT = await readConfig(network.name, "USDT");
    const StableCoin = await readConfig(network.name, "StableCoin");
    let prices = await oracle.assetPrices(ETH);
    console.log("ETH price:", prices);
    prices = await oracle.assetPrices(USDC);
    console.log("USDC price:", prices);
    prices = await oracle.assetPrices(BTC);
    console.log("BTC price:", prices);
    prices = await oracle.assetPrices(USDT);
    console.log("USDT price:", prices);
    prices = await oracle.assetPrices(StableCoin);
    console.log("StableCoin price:", prices);
}

// 运行脚本
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
