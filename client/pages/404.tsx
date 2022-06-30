import Head from 'next/head'
import Image from 'next/image'

import * as sharedStyles from '../sharedStyles'


interface NotFoundPageProps {
    message?: string
}

const NotFoundPage = ({ message }: NotFoundPageProps) => {

    return (
        <div className={sharedStyles.landingPageWrapper}>
            <Head>
                <title>404 Page Not Found | Merchant Mill Arcade</title>
            </Head>
            <h1>Frour-04</h1>
            <Image
                alt='Steve Brule confused'
                className={sharedStyles.landingPageImage}
                src='https://c.tenor.com/me1Yk0jRlHoAAAAC/huh-confused.gif'
                width={498}
                height={364}
            />
            <br />
            <p>
                {message ? message : 'Page not found.'} Check the URL or head <a href='/'>
                    back to the arcade</a>, ya dingus!
            </p>
        </div>
    )
}

export default NotFoundPage
