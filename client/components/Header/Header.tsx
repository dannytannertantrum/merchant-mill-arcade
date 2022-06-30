import Image from 'next/image'
import Link from 'next/link'
import { Fragment } from 'react'

import * as styles from '../../sharedStyles'


function Header() {
    return (
        <Fragment>
            <Link href='/'>
                <a className={styles.logoWrapper}>
                    <Image src='/images/logo.png' width={350} height={197} alt='logo' />
                </a>
            </Link>
        </Fragment>
    )
}

export default Header
