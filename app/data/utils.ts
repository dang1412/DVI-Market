import { providers } from 'ethers'

import { ItemInfo } from './types'

let _provider: providers.Web3Provider | null = null

export function getMetaProvider(): providers.Web3Provider {
  if (!_provider) {
    _provider = new providers.Web3Provider((window as any).ethereum)
  }

  return _provider
}

export async function getMetaSigner(): Promise<providers.JsonRpcSigner> {
  const provider = getMetaProvider()
  await provider.send('eth_requestAccounts', [])

  return provider.getSigner()
}

const _cache: {[id: number]: ItemInfo | null} = {}

export async function getItemInfo(id: number): Promise<ItemInfo | null> {
  if (_cache[id] === undefined) {
    // const url = `https://www.multiverse.so/m/api/search_bep_721?token_id=${id}`
    const url = `https://www.multiverse.so/m/api/search_pol_land?token_id=${id}`
    const data = await fetch(url)
    const { attributes: attrs, image } = await data.json()
    try {
      _cache[id] = {
        type: attrs[0].value,
        startX: Number(attrs[1].value),
        endX: Number(attrs[2].value),
        startY: Number(attrs[3].value),
        endY: Number(attrs[4].value),
        image
      }
    } catch (error) {
      _cache[id] = null
    }
  }

  return _cache[id]
}
