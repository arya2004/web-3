// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require('fs');
// async function main() {
//   const currentTimestampInSeconds = Math.round(Date.now() / 1000);
//   const unlockTime = currentTimestampInSeconds + 60;

//   const lockedAmount = hre.ethers.parseEther("0.001");

//   const lock = await hre.ethers.deployContract("Lock", [unlockTime], {
//     value: lockedAmount,
//   });

//   await lock.waitForDeployment();

//   console.log(
//     `Lock with ${ethers.formatEther(
//       lockedAmount
//     )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.target}`
//   );
// }


async function main() {
  //const NFTMarket = await hre.ethers.getContractFactory("NFTMarket");
  const nftMarket = await hre.ethers.deployContract("NFTMarket");
  await nftMarket.waitForDeployment();
  const nftMarketaddr = await nftMarket.getAddress();
  console.log("nftMarket deployed to:",nftMarketaddr);

  //const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await hre.ethers.deployContract("NFT",[nftMarketaddr]);
  await nft.waitForDeployment();
  const nftaddr = await nft.getAddress();
  console.log("nft deployed to:", nftaddr);

  let config = `
  export const nftmarketaddress = "${nftMarketaddr}"
  export const nftaddress = "${nftaddr}"
  `

  let data = JSON.stringify(config)
  fs.writeFileSync('config.js', JSON.parse(data))

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
