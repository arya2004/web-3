

const {networkConfig, developmentChains} = require("../helper-hardhat-config")
const {network} = require("hardhat")
require("dotenv").config()
const {verify} = require("../utils/verify")

module.exports = async (hre) => {
    const {getNamedAccounts, deployments} = hre;
    const {deploy, log, get} = deployments;
    const {deployer} = await getNamedAccounts()
    const chainId = network.config.chainId

    //const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    //dev chain
    let ethUsdPriceFeedAddress
    if(chainId == 31337)
    {
        const ethUsdAggregator = await get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    }
    //prod chain
    else{
         ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    const args = [ethUsdPriceFeedAddress]

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [
            ethUsdPriceFeedAddress
        ],  //price feed adddrea
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log("------------------------------------------------------------------------")
    if(!chainId == 31337 && process.env.ETHERSCAN_API_KEY)
    {
        //verify
        await verify(fundMe.address, args)
    }
}

module.exports.tags = ["all", "fundme"]