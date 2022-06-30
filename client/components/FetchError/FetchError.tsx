import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import * as sharedStyles from '../../sharedStyles'


interface FetchErrorProps {
    reason: {
        error: string
        message: string
        statusCode: number
    } | Error | string
}

const FetchError = ({ reason }: FetchErrorProps) => {
    const handleLinkReload = (event: React.MouseEvent) => {
        // Restore command or ctrl clicking to open in a new tab
        if (event.metaKey || event.ctrlKey) {
            return
        }

        event.preventDefault()

        window.location.reload()
    }

    if (typeof reason !== 'string') {
        console.warn(`Error fetching: ${JSON.stringify(reason)})`)
    } else {
        console.warn(`Error fetching: ${reason}`)
    }

    return (
        <div className={sharedStyles.landingPageWrapper}>
            <h1>Thanks a lot; you broke the arcade!</h1>
            <Head>
                <title>Error | Merchant Mill Arcade</title>
            </Head>
            <Image
                alt='George Costanza playing Frogger in the street'
                className={sharedStyles.landingPageImage}
                src='https://media1.giphy.com/media/Zi4gonZjDY6go/giphy.gif'
                width={329}
                height={249}
            />
            <br />
            <p>
                But seriously, something went wrong. Please try <Link href='/'><a onClick={handleLinkReload}>
                    reloading the page</a></Link> or come back later.
            </p>
        </div>
    )
}

export default FetchError
