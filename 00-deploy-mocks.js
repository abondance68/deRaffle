//const log = require('chalk-log') 
const { logger } = require('ethers')
const { getNamedAccounts, deployments, network, ethers } = require("hardhat")

const BASE_FEE = ethers.utils.parseEther("0.25")  
// or we can write const BASE_FEE = "250000000000000000" . 
// 0.25 is the price we will have to pay to request a random number on the goerli testnet, 0.25 link per request .

const GAS_PRICE_LINK = 1e9 // calculated value based on the gas price of the chain or 0.000000001 LINK per gas

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    // If we are on a local development network, we need to deploy mocks!
    if (chainId == 31337) {
        log("Local network detected! Deploying mocks...")
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: [BASE_FEE, GAS_PRICE_LINK],
        })

        log("Mocks Deployed!")
        log("----------------------------------------------------------")
        log("You are deploying to a local network, you'll need a local network running to interact")
        log(
            "Please run `yarn hardhat console --network localhost` to interact with the deployed smart contracts!"
        )
        log("----------------------------------------------------------")
    }
}
module.exports.tags = ["all", "mocks"]
