import React from 'react'

import AddGamePage from './components/AddGamePage/AddGamePage'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import GamesPage from './components/GamesPage/GamesPage'
import Link from './components/Link/Link'
import logo from './assets/logo.png'
import Route from './components/Route/Route'
import ScoresPage from './components/ScoresPage/ScoresPage'
import './global.css'
import * as styles from './appStyles'
import { GamesContext, GamesContextProvider } from './contexts/GamesContext'


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
                <GamesContextProvider>
                    <Route path='/'>
                        <GamesPage handleClickGameSelection={handleClickGameSelection} />
                    </Route>
                    <Route path='/add-game'>
                        <AddGamePage />
                    </Route>
                    <Route path={`/scores/${currentGame.slug}`}>
                        <ScoresPage />
                    </Route>
                </GamesContextProvider>
            </ErrorBoundary>
        </div>
    )
}

export default App
