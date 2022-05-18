import { createContext, useState, useEffect } from 'react'

import { AllGamesData } from '../../../common/games.types'
import getGames from '../apis/games'
import FetchError from '../components/FetchError/FetchError'


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
        // TODO Make better loading state
        if (isLoading && isFetchError || isFetchError) return <FetchError content={'games'} />
        if (isLoading) return <h1>Loading...</h1>

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
