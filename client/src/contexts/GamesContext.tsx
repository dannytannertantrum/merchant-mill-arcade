import { createContext, useEffect, useReducer } from 'react'

import { addGame, editGame, removeGame } from '../apis/games.apis'
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
    deleteGame: (id: string) => Promise<ReplyType<GameData>>
    updateGame: (id: string, title: string, imageUrl?: string) => Promise<ReplyType<GameData>>
}

const gameData = {
    id: '',
    description: null,
    imageUrl: null,
    isDeleted: false,
    slug: '',
    title: '',
    createdAt: '',
    updatedAt: null
}
const GAMES_DEFAULT_VALUE: GamesContextInterface = {
    allGames: [],
    createGame: () => Promise.resolve({
        isSuccess: true,
        data: gameData
    }),
    deleteGame: () => Promise.resolve({
        isSuccess: true,
        data: gameData
    }),
    updateGame: () => Promise.resolve({
        isSuccess: true,
        data: gameData
    })
}
const GamesContext = createContext<GamesContextInterface>(GAMES_DEFAULT_VALUE)


const GamesContextProvider = ({ children }: GamesProviderProps) => {
    const [state, dispatch] = useReducer(gameReducer, INITIAL_GAME_STATE)

    const standardDataRefresh = async () => {
        const updateAllGames = await getGames().catch(reason => {
            dispatch({ type: FETCH_ERROR, isLoading: false, error: reason })
        })

        if (updateAllGames?.isSuccess) {
            dispatch({ type: GET_GAMES, isLoading: false, payload: updateAllGames })
        }
    }

    const gamesContext: GamesContextInterface = {
        allGames: state.replyGetGames && state.replyGetGames.data,
        // No catch blocks because we are just passing this down through context
        // We are handling errors where we're calling these functions
        createGame: async (title: string, imageUrl: string): Promise<ReplyType<GameData>> => {
            const gameReturned = await addGame(title, imageUrl)

            await standardDataRefresh()

            return gameReturned
        },
        deleteGame: async (id: string): Promise<ReplyType<GameData>> => {
            const gameReturned = await removeGame(id)

            await standardDataRefresh()

            if (gameReturned.isSuccess) {
                window.location.replace(`/delete-success?${gameReturned.data.title}`)
            }

            return gameReturned
        },
        updateGame: async (id: string, title: string, imageUrl: string): Promise<ReplyType<GameData>> => {
            const gameReturned = await editGame(id, title, imageUrl)

            const slug = gameReturned.isSuccess && gameReturned.data.slug
            const isSlugMatch = gamesContext.allGames?.filter(game => game.slug === slug)

            const updateAllGames = await getGames().catch(reason => {
                dispatch({ type: FETCH_ERROR, isLoading: false, error: reason })
            })

            if (updateAllGames?.isSuccess) {
                // If a user updated the title of the game, we need to redirect them to the correct page
                if (isSlugMatch?.length === 0) {
                    window.location.replace(`/games/${slug}`)
                }

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
