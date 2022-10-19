const log = require('chalk-log') 

const { assert, expect } = require("chai")
const { getNamedAccounts, deployments, ethers, network } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Staging Tests", function () {
          let raffle, raffleEntranceFee, deployer

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              raffle = await ethers.getContract("Raffle", deployer)
              raffleEntranceFee = await raffle.getEntranceFee()
          })

          




          describe("fulfillRandomWords", function () {
              it("works with live Chainlink Keepers and Chainlink VRF, we get a random winner", async function () {
                  // enter the raffle
                  log.progress("Setting up test...")
                  const startingTimeStamp = await raffle.getLastTimeStamp()
                  const accounts = await ethers.getSigners()

                  log.progress("Setting up Listener...")
                  await new Promise(async (reject) => {
                      // setup listener before we enter the raffle
                      // Just in case the blockchain moves REALLY fast
                      raffle.once("WinnerPicked", async () => { // raffle.once is a listener 
                          log.ok("WinnerPicked event fired!")
                          try {
                              // add our asserts here
                              const recentWinner = await raffle.getRecentWinner()
                              const raffleState = await raffle.getRaffleState()
                              const winnerEndingBalance = await accounts[0].getBalance()
                              const endingTimeStamp = await raffle.getLastTimeStamp()

                              await expect(raffle.getPlayer(0)).to.be.reverted
                              assert.equal(recentWinner.toString(), accounts[0].address)
                              assert.equal(raffleState, 0) // We want the ENUM to go back to 0 once we are done
                              assert.equal(
                                  winnerEndingBalance.toString(),
                                  winnerStartingBalance.add(raffleEntranceFee).toString()
                              )

                              assert(endingTimeStamp > startingTimeStamp)
                              resolve()
                          } catch (error) {
                              log.error(error)
                              reject(error)
                          }
                      })
                      // Then entering the raffle
                      log.progress("Entering Raffle...")
                      const tx = await raffle.enterRaffle({ value: raffleEntranceFee })
                      await tx.wait(1)
                      log.progress("Ok, time to wait...")
                      const winnerStartingBalance = await accounts[0].getBalance()

                      // and this code WONT complete until our "raffle.once" listener has finished listening!
                  })
              })
          })
      })
