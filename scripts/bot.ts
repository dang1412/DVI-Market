// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat"
import { BigNumber, BigNumberish, utils } from "ethers"

// local
const dvi721Address = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
const marketAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'

// mainnet
// const dvi721Address = '0x8b72734cc8a28410073bde934f7f0ff9df9eaf55'
// const dvi721Address = '0xA90010D8d5D09788F57Cd6E10a3b1db5564a803E'
// const marketAddress = '0x10df5214C75552273387E811087F8681C12407Dd'
// const marketAddress = '0xE922149436a2d1E98812e9C5f1C5530B3277E657'

// items
const items = [11, 12]

async function main() {
  const dvisionMarket = await ethers.getContractAt('DvisionMarket', marketAddress)

  // const DEFAULT_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000'
  // const MANAGER_ROLE = '0x241ecf16d79d0f8dbfb92cbc07fe17840425976cf0667f022fe9877caa831b08'
  // console.log(await dvisionMarket.getRoleMember(DEFAULT_ROLE, 0))
  // console.log(await dvisionMarket.getRoleAdmin(DEFAULT_ROLE))

  // await dvisionMarket.grantRole(MANAGER_ROLE, '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')

  // await dvisionMarket.unpauseMarket()
  // await dvisionMarket.pauseMarket()
  const [signer1, signer2, signer3] = await ethers.getSigners()
  const paused = await dvisionMarket.paused()
  console.log('Paused', paused)

  if (!paused) {
    await buyAll()
  } else {
    console.log('----Listening')
    dvisionMarket.on('Unpaused', buyAll)
  }

  setInterval(() => {
  }, 200000);

  async function buyAll() {
    console.log('------------ BUY ALL ------------', items)
    const all = items.map(item => dvisionMarket.connect(signer3).trade721ETH(item, {value: utils.parseEther('1')}))
    await Promise.all(all)
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
