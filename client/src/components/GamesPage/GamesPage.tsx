import { Fragment } from 'react'

import * as styles from './GamesPageStyles'
import Link from '../Link/Link'


const fakeData = [
    { id: '1', slug: 'frogger', title: 'Frogger', imageUrl: 'https://arcademarquee.com/wp-content/uploads/2015/02/frogger_marquee_24x6_dedicated.jpg' },
    { id: '2', slug: 'burger-time', title: 'Burger Time', imageUrl: 'https://www.thisoldgamearchive.com/sc_images/products/BurgerTimeMqD-sca1-1000.jpg' },
    { id: '3', slug: 'attack-from-mars', title: 'Attack From Mars', imageUrl: 'https://classicplayfields.com/wp-content/uploads/2019/02/AFM-Backglass.jpg' },
    { id: '4', slug: 'space-invaders', title: 'Space Invaders', imageUrl: 'https://i0.wp.com/arcademarquee.com/wp-content/uploads/2015/02/space-invaders_marquee.jpg' },
    { id: '5', slug: 'centipede', title: 'Centipede', imageUrl: 'https://i0.wp.com/arcademarquee.com/wp-content/uploads/2015/02/centipede_marquee-scaled.jpg' },
    { id: '6', slug: 'ms-pac-man', title: 'Ms. Pac Man', imageUrl: 'https://i0.wp.com/arcademarquee.com/wp-content/uploads/2015/02/ms-pacman_marquee_23x9-scaled.jpg' },
]

interface GamesPageProps {
    handleClickGameSelection: (event: React.MouseEvent, gameData: any) => any
}

const GamesPage = ({ handleClickGameSelection }: GamesPageProps) => {
    const gameList = (
        fakeData.map(game => (
            <li key={game.id}>
                <Link href={`/scores/${game.slug}`} className={styles.gameLink}>
                    <Fragment>
                        <span className={styles.marquee(game.imageUrl)}></span>
                        <span className={styles.gameTitle} onClick={(e) => handleClickGameSelection(e, game)}>{game.title}</span>
                    </Fragment>
                </Link>
            </li>
        ))
    )

    return (
        <Fragment>
            <nav>
                <h2>Select a game</h2>
                <Link href='/add-game'>+ Add a game</Link>
            </nav>
            <ul className={styles.gameGrid}>
                {gameList}
            </ul>
        </Fragment>
    )
}

export default GamesPage
