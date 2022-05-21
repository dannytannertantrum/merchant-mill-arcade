import { createContext, useState, useEffect, useReducer, Fragment } from 'react'

import { addGame } from '../apis/games.apis'
import { GameData } from '../../../common/games.types'
import { gameReducer, INITIAL_GAME_STATE } from '../reducers/game.reducer'
import { AllGamesData } from '../../../common/games.types'
import { getGames } from '../apis/games.apis'
import FetchError from '../components/FetchError/FetchError'
import Link from '../components/Link/Link'
import Loading from '../components/Loading/Loading'
import logo from '../assets/logo.png'
import * as styles from '../components/sharedStyles'
import { FETCH_IN_PROGRESS, GET_GAME } from '../utils/constants'


interface GamesProviderProps {
    children: JSX.Element | JSX.Element[]
}

interface GamesContextInterface {
    allGames: AllGamesData
    createGame: (title: string, imageUrl?: string) => Promise<GameData>
}
const GAMES_DEFAULT_VALUE: GamesContextInterface = {
    allGames: [],
    createGame: () => Promise.resolve({
        id: '',
        description: null,
        imageUrl: null,
        isDeleted: false,
        slug: '',
        title: '',
        createdAt: '',
        updatedAt: null
    })
}
const GamesContext = createContext<GamesContextInterface>(GAMES_DEFAULT_VALUE)


const GamesContextProvider = ({ children }: GamesProviderProps) => {
    const [games, setGames] = useState(GAMES_DEFAULT_VALUE.allGames)
    const [isLoading, setIsLoading] = useState(true)
    const [isFetchError, setIsFetchError] = useState(false)
    const [state, dispatch] = useReducer(gameReducer, INITIAL_GAME_STATE)

    const gamesContext: GamesContextInterface = {
        allGames: games,
        createGame: async (title: string, imageUrl?: string): Promise<GameData> => {
            dispatch({ type: FETCH_IN_PROGRESS, isLoading: true })

            const response = await addGame(title)

            if (response) {
                dispatch({ type: GET_GAME, payload: response, isLoading: false })
                setGames([...games, response])
            }

            return response
        }
    }

    useEffect(() => {
        getGames()
            .then(response => {
                setIsLoading(false)
                setGames(response)
            })
            .catch(_reason => {
                setIsFetchError(true)
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
        <GamesContext.Provider value={gamesContext}>
            {display()}
        </GamesContext.Provider>
    )
}

export {
    GamesContext,
    GamesContextProvider
}
