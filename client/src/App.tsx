import { useEffect, useRef, useState } from 'react'

import AddGamePage from './components/AddGamePage/AddGamePage'
import AllGamesPage from './components/AllGamesPage/AllGamesPage'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import ErrorPage from './components/ErrorPage/ErrorPage'
import GamePage from './components/GamePage/GamePage'
import Link from './components/Link/Link'
import logo from './assets/logo.png'
import Route from './components/Route/Route'
import './global.css'
import * as styles from './appStyles'
import { GamesContextProvider } from './contexts/GamesContext'
import { GameData } from '../../common/games.types'


const App = () => {
    const [currentGamePathname, setCurrentGamePathname] = useState('')
    const [currentGame, setCurrentGame] = useState<GameData | null>(null)
    const [handleClickCalled, setHandleClickCalled] = useState(0)

    const firstUpdate = useRef(true)
    const gameSlugRegex = /^\/games\/(\w|-)+$/

    /*
        We decided against React Router to build routing on our own
        In the case of dynamic routing to a particular game (e.g. /games/:slug),
        we can pass it in when a user clicks on a game (handleClickGameSelection):

        firstUpdate will stop the useEffect from running on componentDidMount - this way,
        we won't be setting anything to empty strings or null - we can set it based on
        window.location.pathname and update everything accordingly (history, paths, etc.) 

        But what if someone navigates directly to a page in their browser (e.g. /games/frogger)?
        Both currentGamePathname and currentGame will be empty, so we once we get all our games
        back from our context, we strip the game title off the pathname, grab the id through some
        filtering and mapping, then fetch and dispatch updates (see in the useEffect in GamePage).
    */

    useEffect(() => {
        if (firstUpdate.current && gameSlugRegex.test(window.location.pathname)) {

            setCurrentGamePathname(window.location.pathname)
            window.history.pushState({}, '', window.location.pathname)

            const navEvent = new PopStateEvent('popstate')
            window.dispatchEvent(navEvent)

            firstUpdate.current = false

            return
        }

        // Updating state happens asynchronously, so we need to use useEffect
        // To wait for the slug to actually update and THEN change the route
        window.history.pushState({}, '', currentGamePathname)

        const navEvent = new PopStateEvent('popstate')
        window.dispatchEvent(navEvent)
    }, [handleClickCalled])

    const handleClickGameSelection = (e: React.MouseEvent, game: GameData): void => {
        e.preventDefault()
        setCurrentGame(game)
        setCurrentGamePathname(`/games/${game.slug}`)

        // This is a simple way to tell our useEffect above that someone clicked
        // because we only want to fire it when that happens; we can't rely on the pathname
        // or slug updating
        setHandleClickCalled(handleClickCalled + 1)
    }

    return (
        <div className={styles.arcade}>
            <Link href='/' className={styles.logo}>
                <img src={logo} alt='logo - return to homepage' />
            </Link>
            <ErrorBoundary>
                <Route path='/error'>
                    <ErrorPage />
                </Route>
                <GamesContextProvider>
                    <Route path='/'>
                        <AllGamesPage handleClickGameSelection={handleClickGameSelection} />
                    </Route>
                    <Route path='/add-game'>
                        <AddGamePage />
                    </Route>
                    <Route path={currentGamePathname}>
                        <GamePage currentGame={currentGame} />
                    </Route>
                </GamesContextProvider>
            </ErrorBoundary>
        </div>
    )
}

export default App
