import { createContext, useState, useEffect, Fragment } from 'react'

import { AllGamesData } from '../../../common/games.types'
import { getGames } from '../apis/games'
import FetchError from '../components/FetchError/FetchError'
import Link from '../components/Link/Link'
import Loading from '../components/Loading/Loading'
import logo from '../assets/logo.png'
import * as styles from '../components/sharedStyles'


interface GamesProviderProps {
    children: JSX.Element | JSX.Element[]
}

const GAMES_DEFAULT_VALUE: AllGamesData = []
const GamesContext = createContext(GAMES_DEFAULT_VALUE)

const GamesContextProvider = ({ children }: GamesProviderProps) => {
    const [games, setGames] = useState(GAMES_DEFAULT_VALUE)
    const [isLoading, setIsLoading] = useState(true)
    const [isFetchError, setIsFetchError] = useState(false)

    useEffect(() => {
        getGames()
            .then(gamesData => {
                setIsLoading(false)
                setGames(gamesData)
            })
            .catch(reason => {
                setIsFetchError(true)
                console.log(`This error occurred when trying to get all games: ${reason}`)
            })
    }, [])

    const display = () => {
        if (isLoading && isFetchError || isFetchError) {
            return (
                <Fragment>
                    <Link href='/' className={styles.logoWrapper}>
                        <img src={logo} alt='logo - return to homepage' />
                    </Link>
                    <FetchError content={'games'} />
                </Fragment>
            )
        }

        if (isLoading) {
            return <Loading />
        }

        return children
    }

    return (
        <GamesContext.Provider value={games}>
            {display()}
        </GamesContext.Provider>
    )
}

export {
    GamesContext,
    GamesContextProvider
}
