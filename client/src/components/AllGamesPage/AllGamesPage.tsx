import { css } from 'goober'
import { Fragment, useContext } from 'react'

import { DEFAULT_MARQUEE } from '../../utils/constants'
import * as styles from '../sharedStyles'
import Link from '../Link/Link'
import { GamesContext } from '../../contexts/GamesContext'
import { GameData } from '../../../../common/games.types'


interface GamesPageProps {
    handleClickGameSelection: (event: React.MouseEvent, gameData: GameData) => void
}

const AllGamesPage = ({ handleClickGameSelection }: GamesPageProps) => {
    const { allGames } = useContext(GamesContext)

    const displayNav = (
        allGames && allGames.length > 0
            ? (
                <nav>
                    <h2>Select a game</h2>
                    <Link href='/add-game'>+ Add a game</Link>
                </nav>
            ) : <nav className={css`justify-content: flex-end; padding-bottom: 14px;`}><Link href='/add-game'>+ Add a game</Link></nav>
    )

    const gameList = (
        allGames?.filter(game => !game.isDeleted).map(game => (
            <li key={game.id}>
                <a href={`/games/${game.slug}`} onClick={(e) => handleClickGameSelection(e, game)} className={styles.gameGridMarqueeLink}>
                    <Fragment>
                        {game.imageUrl
                            ? <span className={styles.marquee(game.imageUrl)}></span>
                            : <span className={styles.marquee(DEFAULT_MARQUEE)}></span>
                        }
                        <span className={styles.gameTitle}>{game.title}</span>
                    </Fragment>
                </a>
            </li>
        ))
    )

    return (
        <Fragment>
            {displayNav}
            {allGames && allGames.length > 0
                ? <ul className={styles.gameGrid}>{gameList}</ul>
                : <h2>No games? May I suggest adding your pal, Peter Peppers to start?</h2>
            }
        </Fragment>
    )
}

export default AllGamesPage
