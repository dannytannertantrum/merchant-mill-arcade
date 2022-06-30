import Image from 'next/image'

import * as styles from './LoadingStyles'


const Loading = () => {
    return (
        <div className={styles.loadingWrapper}>
            <Image
                src='/images/MrHotDog.png'
                alt='Mr. Hot Dog from Burger Time'
                width={126}
                height={126}
            />
        </div>
    )
}

export default Loading
