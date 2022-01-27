import { Contract, BigNumber, utils } from 'ethers'
import { Dvision721Dvi, Dvision721Dvi__factory, DvisionMarket, DvisionMarket__factory } from '../typechain'
import { items1 } from './constants'

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

const min = 1
const max = 4000
const itemIds = [5, 34, 69, 116, 160, 213, 237, 243, 295, 320, 392, 395, 432, 451, 506, 522, 540, 545, 596, 644, 
  659, 688, 697, 703, 761, 771, 788, 806, 823, 824, 858, 945, 1027, 1036, 1050, 1100, 1107, 1123, 1164, 1210, 
  1273, 1284, 1302, 1313, 1353, 1428, 1437, 1480, 1481, 1514, 1582, 1588, 1619, 1649, 1718, 1746, 1787, 1791, 
  1808, 1830, 1837, 1871, 1875, 1899, 1918, 1936, 1957, 1992, 1998, 2020, 2042, 2117, 2148, 2180, 2203, 2207, 
  2297, 2307, 2313, 2334, 2375, 2396, 2459, 2514, 2585, 2591, 2595, 2644, 2708, 2730, 2745, 2810, 2812, 2850, 
  2864, 2870, 2918, 2925, 2963, 3020, 3045, 3087, 3093, 3111, 3125, 3140, 3158, 3160, 3185, 3252, 3261, 3289, 
  3381, 3388, 3431, 3469, 3495, 3516, 3576, 3612, 3621, 3635, 3695, 3754, 3784, 3793, 3824, 3827, 3934, 3947, 
  3971, 3997]

export async function getPreciousItems(): Promise<SaleItem[]> {
  const items: SaleItem[] = []
  for (const id of items1) {
    items.push({
      id,
      price: 1,
      type: 0,
      info: null
    })
  }
  return items
}



export async function categorizeItems() {
  const data: {[category: string]: number[]} = {}
  for (const id of itemIds) {
    console.log(id)
    const info = await getItemInfo(id)
    if (info) {
      const category = info.type
      if (!data[category]) {
        data[category] = []
      }

      data[category].push(id)
    }
  }

  console.log(data)
}

