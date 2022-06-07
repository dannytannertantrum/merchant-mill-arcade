import {
    CREATE_GAME,
    FETCH_ERROR,
    FETCH_IN_PROGRESS,
    GET_GAME,
    GET_GAMES
} from '../utils/constants'
import { AllGamesData, GameData } from '../../../common/games.types'
import { BaseActionType, ReplySuccess } from '../utils/sharedTypes';


type GameAction =
    | { type: 'CREATE_GAME'; isLoading: boolean; payload: ReplySuccess<GameData> }
    | { type: 'GET_GAME'; isLoading: boolean; payload: ReplySuccess<GameData> }
    | { type: 'GET_GAMES'; isLoading: boolean; payload: ReplySuccess<AllGamesData> }

const INITIAL_GAME_STATE = {
    error: null,
    isLoading: false,
    replyCreateGame: null,
    replyGetGame: null,
    replyGetGames: null
}

const gameReducer = (state: typeof INITIAL_GAME_STATE, action: BaseActionType | GameAction) => {
    switch (action.type) {
        case FETCH_ERROR:
            return { ...state, isLoading: false, error: action.error }

        case FETCH_IN_PROGRESS:
            return { ...state, isLoading: true }

        case CREATE_GAME:
            return { ...state, isLoading: false, replyCreateGame: action.payload }

        case GET_GAME:
            return { ...state, isLoading: false, replyGetGame: action.payload }

        case GET_GAMES:
            return { ...state, isLoading: false, replyGetGames: action.payload }

        default:
            throw new Error(`Unknown action type: ${action}`)
    }
}

export {
    gameReducer,
    INITIAL_GAME_STATE
}
