import Image from 'next/image'
import Link from 'next/link'

import * as sharedStyles from '../sharedStyles'


interface NotFoundPageProps {
    message?: string
}

const InteralServerErrorPage = ({ message }: NotFoundPageProps) => {

    return (
        <div className={sharedStyles.landingPageWrapper}>
            <h1>Thanks a lot; you broke the arcade!</h1>
            <Image
                alt='George Costanza playing Frogger in the street'
                className={sharedStyles.landingPageImage}
                src='https://media1.giphy.com/media/Zi4gonZjDY6go/giphy.gif'
                width={329}
                height={249}
            />
            <br />
            <p>
                But seriously, something went wrong. Please try heading <Link href='/'>
                    back to the arcade</Link>
            </p>
        </div>
    )
}

export default InteralServerErrorPage
