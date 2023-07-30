// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
// imports
const { ethers, run, network } = require("hardhat")

// async main
async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
  console.log("Deploying contract...")
  const simpleStorage = await SimpleStorageFactory.deploy()
  const deploymentTransaction = await simpleStorage.deploymentTransaction();
  console.log("\ndeployed");
  console.log(deploymentTransaction);
  // // what happens when we deploy to our hardhat network?
  // if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
  //   console.log("Waiting for block confirmations...")
  //   await simpleStorage.deployTransaction.wait(6)
  //   await verify(simpleStorage.address, [])
  // }

  // const currentValue = await simpleStorage.retrieve()
  // console.log(`Current Value is: ${currentValue}`)

  // // Update the current value
  // const transactionResponse = await simpleStorage.store(7)
  // await transactionResponse.wait(1)
  // const updatedValue = await simpleStorage.retrieve()
  // console.log(`Updated Value is: ${updatedValue}`)
}

async function verify(contractAddress, args) {
const verify = async (contractAddress, args) => {
  console.log("Verifying contract...")
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!")
    } else {
      console.log(e)
    }
  }
}}

// main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
