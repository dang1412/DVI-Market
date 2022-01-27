import { Contract, BigNumber, utils } from 'ethers'
import { Dvision721Dvi, Dvision721Dvi__factory, DvisionMarket, DvisionMarket__factory } from '../typechain'

import { type SaleItem } from './types'
import { getItemInfo, getMetaProvider, getMetaSigner } from './utils'

// const marketAddress = '0xf36721581b3db68408a7189840c79ad47c719c71'

// local
const dvi721Address = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
const marketAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'

// mumbai testnet
// const dvi721Address = '0xa8a9ff7e1597f00988ab643a95c07cc9d80fd979'
// const marketAddress = '0xbd68B0A248028A4aAE60390DEB1AcD16684EB941'

// polygon mainnet
// const dvi721Address = '0x8b72734cc8a28410073bde934f7f0ff9df9eaf55'
// const marketAddress = ''

let _dvi721Contract: Dvision721Dvi | null = null
let _dviMarketContract: DvisionMarket | null = null

// dvi721 contract instance
export async function getDvi721Contract(): Promise<Dvision721Dvi> {
  const signer = await getMetaSigner()
  if (!_dvi721Contract) {
    // _dvi721Contract = new Dvision721Dvi(marketAddress, Dvision721Dvi.getInterface(), provider)
    // _dvi721Contract = await ethers.getContractAt('Dvision721Dvi', marketAddress)
    _dvi721Contract = Dvision721Dvi__factory.connect(dvi721Address, signer)
  }

  return _dvi721Contract
}

// dviMarket contract instance
export async function getMarketContract(): Promise<DvisionMarket> {
  const signer = await getMetaSigner()
  if (!_dviMarketContract) {
    _dviMarketContract = DvisionMarket__factory.connect(marketAddress, signer)
  }

  return _dviMarketContract
}

export async function getSellItems(): Promise<SaleItem[]> {
  const dvi721Contract = await getDvi721Contract()
  const [ids, prices, types]: [BigNumber[], BigNumber[], BigNumber[]] = await dvi721Contract.getSellingItems()

  const items: SaleItem[] = []
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i].toNumber()
    // const info = await getItemInfo(id)
    // if (info) {
      items.push({
        id,
        price: Number(utils.formatUnits(prices[i].toString(), 18)),
        type: types[i].toNumber(),
        info: null
      })
    // }
  }
  console.log(items)

  return items
}

export async function nativeBuyItem(tokenId: number, price: number): Promise<void> {
  const martketContract = await getMarketContract()
  await martketContract.trade721ETH(tokenId, { value: utils.parseEther(`${price}`) })
}
