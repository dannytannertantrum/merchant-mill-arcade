import { createContext, useEffect, useReducer, Fragment } from 'react'

import { addGame } from '../apis/games.apis'
import { AllGamesData } from '../../../common/games.types'
import ContextDisplayState from '../components/ContextDisplayState/ContextDisplayState'
import { FETCH_ERROR, FETCH_IN_PROGRESS, GET_GAMES } from '../utils/constants'
import { GameData } from '../../../common/games.types'
import { gameReducer, INITIAL_GAME_STATE } from '../reducers/game.reducer'
import { getGames } from '../apis/games.apis'
import { ReplyType } from '../utils/sharedTypes'


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
        createGame: async (title: string, imageUrl: string): Promise<ReplyType<GameData>> => {
            // No catch blocks because we are just passing this down through context
            // We are handling errors where we're calling createGame
            const gameReturned = await addGame(title, imageUrl)

            const updateAllGames = await getGames().catch(reason => {
                dispatch({ type: FETCH_ERROR, isLoading: false, error: reason })
            })

            if (updateAllGames?.isSuccess) {
                dispatch({ type: GET_GAMES, isLoading: false, payload: updateAllGames })
            }

            return gameReturned
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

    return (
        <GamesContext.Provider value={gamesContext}>
            <ContextDisplayState isLoading={state.isLoading} error={state.error} children={children} />
        </GamesContext.Provider>
    )
}

export {
    GamesContext,
    GamesContextProvider
}
