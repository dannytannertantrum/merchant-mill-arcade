import React from 'react'

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


const App = () => {
    // TODO Rip this out when pulling in real data
    // And add loading state
    let currentGame = { id: '2', slug: 'frogger' }

    const handleClickGameSelection = (e: React.MouseEvent, game: any) => {
        e.preventDefault()
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
                    <Route path={`/game/${currentGame.slug}`}>
                        <GamePage />
                    </Route>
                </GamesContextProvider>
            </ErrorBoundary>
        </div>
    )
}

export default App
