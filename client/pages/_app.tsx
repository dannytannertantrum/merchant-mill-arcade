import type { AppProps } from 'next/app'
import { css } from 'goober'
import Head from 'next/head'

import Header from '../components/Header/Header'
import '../global.css'


export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <div className={css`margin: 0 20px;`}>
            <Head>
                <meta charSet='utf-8' />
                <meta name='viewport' content='width=device-width, initial-scale=1.0' />
                <meta name='theme-color' content='#000000' />
                <title>Merchant Mill Arcade</title>
            </Head>
            <Header />
            <Component {...pageProps} />
        </div>
    )
}
