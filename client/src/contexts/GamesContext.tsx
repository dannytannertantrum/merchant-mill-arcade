import { createContext, useEffect, useReducer, Fragment } from 'react'

import { addGame } from '../apis/games.apis'
import { AllGamesData } from '../../../common/games.types'
import FetchError from '../components/FetchError/FetchError'
import { CREATE_GAME, FETCH_ERROR, FETCH_IN_PROGRESS, GET_GAMES } from '../utils/constants'
import { GameData } from '../../../common/games.types'
import { gameReducer, INITIAL_GAME_STATE } from '../reducers/game.reducer'
import { getGames } from '../apis/games.apis'
import Link from '../components/Link/Link'
import Loading from '../components/Loading/Loading'
import logo from '../assets/logo.png'
import { ReplyType } from '../utils/sharedTypes'
import * as styles from '../components/sharedStyles'


interface GamesProviderProps {
    children: JSX.Element | JSX.Element[]
}
interface GamesContextInterface {
    allGames: AllGamesData | null
    createGame: (title: string, imageUrl?: string) => Promise<ReplyType<GameData>>
}

const GAMES_DEFAULT_VALUE: GamesContextInterface = {
    allGames: [],
    createGame: () => Promise.resolve({
        isSuccess: true,
        data: {
            id: '',
            description: null,
            imageUrl: null,
            isDeleted: false,
            slug: '',
            title: '',
            createdAt: '',
            updatedAt: null
        }
    })
}
const GamesContext = createContext<GamesContextInterface>(GAMES_DEFAULT_VALUE)


const GamesContextProvider = ({ children }: GamesProviderProps) => {
    const [state, dispatch] = useReducer(gameReducer, INITIAL_GAME_STATE)

    const gamesContext: GamesContextInterface = {
        allGames: state.replyGetGames && state.replyGetGames.data,
        createGame: (title: string, imageUrl?: string): Promise<ReplyType<GameData>> => {
            dispatch({ type: FETCH_IN_PROGRESS, isLoading: true })

            addGame(title).then(gameReturned => {
                if (gameReturned.isSuccess) {
                    dispatch({ type: CREATE_GAME, isLoading: false, payload: gameReturned })
                    return gameReturned
                }
                return gameReturned
            }).catch(reason => {
                dispatch({ type: FETCH_ERROR, isLoading: false, error: reason })
            })

            return Promise.reject({
                isSuccess: false,
                reason: 'An unknown error occurred in creating your game'
            })
        }
    }

    useEffect(() => {
        dispatch({ type: FETCH_IN_PROGRESS, isLoading: true })

        getGames().then(gamesReturned => {
            if (gamesReturned.isSuccess) {
                dispatch({ type: GET_GAMES, isLoading: false, payload: gamesReturned })
            }
        }).catch(reason => {
            dispatch({ type: FETCH_ERROR, isLoading: false, error: reason })
        })
    }, [])

    const display = () => {
        if (state.isLoading && state.error || state.error) {
            return (
                <Fragment>
                    <Link href='/' className={styles.logoWrapper}>
                        <img src={logo} alt='logo - return to homepage' />
                    </Link>
                    <FetchError reason={state.error.reason} />
                </Fragment>
            )
        }

        if (state.isLoading) {
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
