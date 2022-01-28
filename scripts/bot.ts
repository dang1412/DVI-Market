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
// const dvi721Address = '0xBEDF7769720481f03a5B4927A1D51c738cf20FDf'
// const marketAddress = '0x5737366c02f1E60B089a56215384F733Fb02CE61'

// items
const items = [2,3,47,5,6]

// const items1 = [5, 34, 160, 243, 392, 432, 506, 644, 703, 771, 806, 823, 945, 1302, 1437]
const items1 = [
  5, 34, 160, 243, 392, 432, 506, 644, 703, 771, 806, 823, 945, 1302, 1437,
  1480, 1588, 1718, 1791, 1837, 1875, 1899, 1918, 1957
]

const items2 = [237, 395, 688, 858, 1027, 1123, 1284, 1649, 1808, 1998, 2203, 2313, 69, 116, 213, 295, 320]

async function main() {
  const dvi721 = await ethers.getContractAt('Dvision721Dvi', dvi721Address)
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

  console.log('Account', await dvisionMarket.signer.getAddress())

  if (!paused) {
    await buyAll()
  } else {
    console.log('----Listening')
    dvisionMarket.once('Unpaused', buyAll)
  }

  // ethers.provider.
  // console.log('ethers.provider', ethers.provider)

  // setInterval(() => {
  // }, 200000);

  console.log('getGasPrice', await ethers.provider.getGasPrice())

  async function buyAll() {
    console.log('------------ BUY ALL ------------', items1)
    const all = items1.map(id => buyItem(id))
    await Promise.all(all)
  }

  async function buyItem(id: number): Promise<void> {
    const item = await dvi721.getItems(id)
    console.log(id, item._price)
    try {
      if (item._forSale) {
        const tx = await dvisionMarket.trade721ETH(id, { value: item._price })
        await tx.wait()

        console.log('Done ------> Item:', id, 'Price:', item._price, tx.gasPrice, tx.gasLimit)
      }
    } catch (error) {
      console.log('Error:', id, error)
    }
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
