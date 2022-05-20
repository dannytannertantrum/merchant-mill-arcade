import { useContext, useEffect, useReducer, useRef, useState } from 'react'
import { css } from 'goober'

import AddGamePage from '../../components/AddGamePage/AddGamePage'
import AllGamesPage from '../../components/AllGamesPage/AllGamesPage'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import ErrorPage from '../../components/ErrorPage/ErrorPage'
import GamePage from '../../components/GamePage/GamePage'
import { gameReducer, INITIAL_GAME_STATE } from '../../reducers/game.reducer'
import { getGame } from '../../apis/games'
import Link from '../../components/Link/Link'
import logo from '../../assets/logo.png'
import Route from '../../components/Route/Route'
import * as styles from '../sharedStyles'
import { GamesContext } from '../../contexts/GamesContext'
import { GameData } from '../../../../common/games.types'
import NotFoundPage from '../NotFoundPage/NotFoundPage'


const Arcade = () => {
    const gamesData = useContext(GamesContext)
    const [state, dispatch] = useReducer(gameReducer, INITIAL_GAME_STATE)

    const [currentGamePathname, setCurrentGamePathname] = useState('')
    const [handleClickCalled, setHandleClickCalled] = useState(0)

    const firstUpdate = useRef(true)

    const validRoutes = ['/', '/add-game', '/error']
    gamesData.forEach(game => validRoutes.push(`/games/${game.slug}`))

    const gameSlugRegex = /^\/games\/(\w|-)+$/

    /*
        We decided against React Router to build routing on our own.
        In the case of dynamic routing to a particular game (e.g. /games/:slug),
        we can pass it in when a user clicks on a game (handleClickGameSelection).

        The if block below with 'firstUpdate' will stop the useEffect from pushing history on componentDidMount.
        We're doing this because if someone navigates directly to a page in their browser (e.g. /games/frogger),
        there won't be a 'currentGamePathname' to set the window history to. Instead, we need to grab
        the URL and check against our game data to see if it's a viable path
    */

    useEffect(() => {
        if (firstUpdate.current && gameSlugRegex.test(window.location.pathname)) {
            dispatch({ type: 'GET_DATA', isLoading: true })

            const getSlugFromPathname = window.location.pathname.replace('/games/', '')
            const gameId = gamesData
                .filter(game => game.slug === getSlugFromPathname)[0]
                ?.id

            if (gameId) {
                getGame(gameId).then((gameReturned) => {
                    dispatch({ type: 'GET_DATA_SUCCESS', payload: gameReturned, isLoading: false })
                }).then(() => {
                    setCurrentGamePathname(window.location.pathname)
                }).catch(reason => {
                    dispatch({ type: 'GET_DATA_ERROR', error: reason, isLoading: false })
                })
            } else {
                return
            }

            window.history.pushState({}, '', window.location.pathname)
            window.dispatchEvent(new PopStateEvent('popstate'))

            firstUpdate.current = false

            return
        }

        // Updating state happens asynchronously, so we need to use useEffect
        // To wait for the slug to actually update and THEN change the route
        window.history.pushState({}, '', currentGamePathname)
        window.dispatchEvent(new PopStateEvent('popstate'))

    }, [handleClickCalled])

    const handleClickGameSelection = (e: React.MouseEvent, game: GameData): void => {
        e.preventDefault()

        dispatch({ type: 'USE_PASSED_GAME_VALUE', payload: game, isLoading: false })
        setCurrentGamePathname(`/games/${game.slug}`)

        // This is a simple way to tell our useEffect above that someone clicked
        // because we only want to fire it when that happens; we can't rely on the pathname
        // or slug updating
        setHandleClickCalled(handleClickCalled + 1)
    }

    if (!validRoutes.includes(window.location.pathname)) {
        return <NotFoundPage />
    }

    return (
        <div className={css`margin: 0 20px;`}>
            <Link href='/' className={styles.logoWrapper}>
                <img src={logo} alt='logo - return to homepage' />
            </Link>
            <ErrorBoundary>
                <Route path='/error'>
                    <ErrorPage />
                </Route>
                <Route path='/'>
                    <AllGamesPage handleClickGameSelection={handleClickGameSelection} />
                </Route>
                <Route path='/add-game'>
                    <AddGamePage />
                </Route>
                <Route path={currentGamePathname}>
                    <GamePage {...state} />
                </Route>
            </ErrorBoundary>
        </div>
    )
}

export default Arcade
