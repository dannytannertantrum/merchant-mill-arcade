import { css } from 'goober'
import { Fragment, useContext } from 'react'

import * as styles from './AllGamesPageStyles'
import Link from '../Link/Link'
import { GamesContext } from '../../contexts/GamesContext'
import { GameData } from '../../../../common/games.types'


interface GamesPageProps {
    handleClickGameSelection: (event: React.MouseEvent, gameData: GameData) => void
}

const AllGamesPage = ({ handleClickGameSelection }: GamesPageProps) => {
    const gamesData = useContext(GamesContext)

    const displayNav = (
        gamesData?.length > 0
            ? (
                <nav>
                    <h2>Select a game</h2>
                    <Link href='/add-game'>+ Add a game</Link>
                </nav>
            ) : <nav className={css`justify-content: flex-end; padding-bottom: 14px;`}><Link href='/add-game'>+ Add a game</Link></nav>
    )

    const gameList = (
        gamesData.map(game => (
            <li key={game.id}>
                <a onClick={(e) => handleClickGameSelection(e, game)} className={styles.gameLink}>
                    <Fragment>
                        {game.imageUrl && <span className={styles.marquee(game.imageUrl)}></span>}
                        <span className={styles.gameTitle}>{game.title}</span>
                    </Fragment>
                </a>
            </li>
        ))
    )

    return (
        <Fragment>
            {displayNav}
            {gamesData.length > 0
                ? <ul className={styles.gameGrid}>{gameList}</ul>
                : <h2>No games? May I suggest adding your pal, Peter Peppers to start?</h2>
            }
        </Fragment>
    )
}

export default AllGamesPage
