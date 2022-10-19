
const log = require('chalk-log') 
const { ethers } = require("hardhat")

async function enterRaffle() {
    const raffle = await ethers.getContract("Raffle")
    const entranceFee = await raffle.getEntranceFee()
    await raffle.enterRaffle({ value: entranceFee + 1 })
    log.note("Entered!")
}

enterRaffle()
    .then(() => process.exit(0))
    .catch((error) => {
        log.error(error)
        process.exit(1)
    })
