import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { MarketContextWrap } from '../components/MarketContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MarketContextWrap>
      <Component {...pageProps} />
    </MarketContextWrap>
  )
}

export default MyApp
