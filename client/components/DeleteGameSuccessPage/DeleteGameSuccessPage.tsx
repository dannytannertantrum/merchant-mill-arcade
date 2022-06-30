import Image from 'next/image'
import Link from 'next/link'

import * as sharedStyles from '../../sharedStyles'


function DeleteGameSuccessPage({ title }: { title: string }) {
    return (
        <div className={sharedStyles.landingPageWrapper}>
            <h1>Delete Success!</h1>
            <Image
                alt='Joe Davola from Seinfeld'
                className={sharedStyles.landingPageImage}
                src='/images/davola.jpg'
                width={273}
                height={204}
            />
            <br />
            <p>You just put the kibosh on <span className={sharedStyles.highlight}>{title}</span>.
                Now head <Link href='/'>back to the arcade</Link>!</p>
        </div>
    )
}

export default DeleteGameSuccessPage
