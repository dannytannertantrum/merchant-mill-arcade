import React, { Fragment, Suspense } from 'react'

import { DEFAULT_MARQUEE } from '../../utils/constants'
import FetchError from '../FetchError/FetchError'
import { GameData } from '../../../../common/games.types'
import Loading from '../Loading/Loading'
import * as sharedStyles from '../sharedStyles'
import NotFoundPage from '../NotFoundPage/NotFoundPage'

// Given the size of this app, there's no real need for lazy loading
// This is more so for learning purposes: check react docs and this article
// https://medium.com/hackernoon/lazy-loading-and-preloading-components-in-react-16-6-804de091c82d
const ScoresPromise = import('../Scores/Scores')
const Scores = React.lazy(() => ScoresPromise)


interface GamePageProps {
    game?: GameData | null
    error?: Error | {
        error: string
        message: string
        statusCode: number
    } | string
    isLoading: boolean
}

const GamePage = (gameState: GamePageProps): JSX.Element => {
    const marqueeImgSrc = gameState.game?.imageUrl ? gameState.game.imageUrl : DEFAULT_MARQUEE

    if (!gameState.isLoading && gameState.error != null || gameState.error != null) {
        return <FetchError reason={gameState.error} />
    }

    if (gameState.isLoading) {
        return <Loading />
    }

    if (!gameState.isLoading && !gameState.game) {
        return (
            <NotFoundPage message="Hmmm...we had trouble finding that game." />
        )
    }

    return (
        <Fragment>
            <div className={sharedStyles.gameHeader}>
                <h3>{gameState.game?.title}</h3>
                <img src={marqueeImgSrc} alt={gameState.game?.title} />
            </div>
            <Suspense fallback={<Loading />}>
                <Scores game={gameState.game} />
            </Suspense>
        </Fragment>
    )
}

export default GamePage
