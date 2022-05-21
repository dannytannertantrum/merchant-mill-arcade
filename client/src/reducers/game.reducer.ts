import {
    FETCH_ERROR,
    FETCH_IN_PROGRESS,
    GET_GAME,
    GET_GAMES
} from '../utils/constants'
import { GameData } from '../../../common/games.types'

interface GameAction {
    type: 'FETCH_ERROR' | 'FETCH_IN_PROGRESS' | 'GET_GAME' | 'GET_GAMES'
    isLoading: boolean
    payload?: GameData
    error?: string
}

interface GameState {
    game: GameData | null
    isLoading: boolean
    error: string
}

const INITIAL_GAME_STATE = {
    game: null,
    isLoading: true,
    error: ''
}

const gameReducer = (state: GameState, action: GameAction) => {
    switch (action.type) {
        case FETCH_ERROR:
            return { isLoading: false, error: action.error, game: null }

        case FETCH_IN_PROGRESS:
            return { ...state, isLoading: true }

        case GET_GAME:
            return { ...state, game: action.payload, isLoading: false }

        case GET_GAMES:
            return { ...state, game: action.payload, isLoading: false }

        default:
            throw new Error(`Unknown action type: ${action}`)
    }
}

export {
    gameReducer,
    GameState,
    INITIAL_GAME_STATE
}
