import mrHotDog from '../../assets/mrHotDog.png'
import * as styles from './LoadingStyles'


const Loading = () => {
    return (
        <div className={styles.loadingWrapper}>
            <img src={mrHotDog} alt='Mr. Hot Dog from Burger Time' />
        </div>
    )
}

export default Loading
