import { GameData } from '../../../common/games.types'


interface GameAction {
    type: string
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
        case 'GET_DATA':
            return state = { ...state, isLoading: true }

        case 'GET_DATA_SUCCESS':
            return { ...state, game: action.payload, isLoading: false }

        case 'GET_DATA_ERROR':
            return { isLoading: false, error: action.error, game: null }

        case 'USE_PASSED_GAME_VALUE':
            return { ...state, game: action.payload, isLoading: false }

        default:
            throw new Error(`Unknown action type: ${action}`)
    }
}

export {
    gameReducer,
    INITIAL_GAME_STATE
}
