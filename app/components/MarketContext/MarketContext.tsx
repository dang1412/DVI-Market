import { BigNumber } from 'ethers'
import { createContext, useEffect, useState } from 'react'
import { getDvi721Contract, getMarketContract } from '../../data'

interface IMarketContext {
  paused: boolean
  tokenId: number
  to: string
}

const initMarketContext: IMarketContext = {
  paused: false,
  tokenId: 0,
  to: ''
}

export const MarketContext = createContext(initMarketContext)

export const MarketContextWrap: React.FC<{}> = (props) => {
  const [state, setState] = useState(initMarketContext)

  useEffect(() => {
    (async () => {
      const market = await getMarketContract()
      const paused = await market.paused()
      console.log('Paused', paused)
      setState({...state, paused})

      market.on('Paused', () => {
        console.log('Paused', true)
        setState({...state, paused: true})
      })

      market.on('Unpaused', () => {
        console.log('Paused', false)
        setState({...state, paused: false})
      })

      // Transfer(from, to, tokenId)
      const dvi721 = await getDvi721Contract()
      dvi721.on('Transfer', (from: string, to: string, id: BigNumber) => {
        const tokenId = id.toNumber()
        console.log('Transfer', from, to, tokenId)
        setState({...state, to, tokenId: tokenId})
      })
    })()
  }, [])

  return (
    <MarketContext.Provider value={state}>{props.children}</MarketContext.Provider>
  )
}