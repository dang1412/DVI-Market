// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat"
import { BigNumber, BigNumberish } from "ethers"

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  // Dvision721Dvi
  const Dvision721Dvi = await ethers.getContractFactory("Dvision721Dvi")
  const dvision721Dvi = await Dvision721Dvi.deploy("0xCF141c72D7aCc4dB8A8930C6E84aC61435E4035a", "0xCF141c72D7aCc4dB8A8930C6E84aC61435E4035a", "")
  await dvision721Dvi.deployed()
  console.log("Dvision721Dvi deployed to:", dvision721Dvi.address)

  // Dvision1155Dvi
  const Dvision1155Dvi = await ethers.getContractFactory("Dvision1155Dvi")
  const dvision1155Dvi = await Dvision1155Dvi.deploy("0xCF141c72D7aCc4dB8A8930C6E84aC61435E4035a", "0xCF141c72D7aCc4dB8A8930C6E84aC61435E4035a", "")
  await dvision1155Dvi.deployed()
  console.log("Dvision1155Dvi deployed to:", dvision1155Dvi.address)

  // DvisionMarket
  const DvisionMarket = await ethers.getContractFactory("DvisionMarket")
  const dvisionMarket = await DvisionMarket.deploy(dvision721Dvi.address, dvision1155Dvi.address)
  await dvisionMarket.deployed()
  console.log("DvisionMarket deployed to:", dvisionMarket.address)

  await dvision721Dvi.batchMint(100)

  const prices: BigNumberish[] = []
  const tokenIds: number[] = []
  for (let i = 0; i < 100; i++) {
    prices.push(BigNumber.from(1e18.toString()))
    tokenIds.push(i + 1)
  }
  await dvision721Dvi.batchSellItem(dvisionMarket.address, tokenIds, prices, 0)

  console.log(await dvision721Dvi.totalSupply())
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
