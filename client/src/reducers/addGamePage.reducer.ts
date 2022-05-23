import {
    CREATE_GAME,
    FETCH_ERROR,
    FETCH_IN_PROGRESS,
    GET_IMAGES
} from '../utils/constants'
import { CustomSearchResults } from '../apis/imageSearch.api'
import { BaseActionType, ReplySuccess } from '../utils/sharedTypes'
import { GameData } from '../../../common/games.types';


type ImageSearchAction =
    | { type: 'GET_IMAGES'; isLoading: boolean; payload: ReplySuccess<CustomSearchResults> }
    | { type: 'CREATE_GAME'; isLoading: boolean; payload: ReplySuccess<GameData> }

const INITIAL_ADD_GAME_PAGE_STATE = {
    error: null,
    isLoading: false,
    replyCreateGame: null,
    replyGetImages: null
}

// This includes our custom image search implementation
const addGamePageReducer = (state: typeof INITIAL_ADD_GAME_PAGE_STATE, action: BaseActionType | ImageSearchAction) => {
    switch (action.type) {
        case FETCH_ERROR:
            return { ...state, isLoading: false, error: action.error }

        case FETCH_IN_PROGRESS:
            return { ...state, isLoading: true }

        case CREATE_GAME:
            return { ...state, isLoading: false, replyCreateGame: action.payload }

        case GET_IMAGES:
            return { ...state, isLoading: false, replyGetImages: action.payload }

        default:
            throw new Error(`Unknown action type: ${action}`)
    }
}

export {
    CustomSearchResults,
    addGamePageReducer,
    INITIAL_ADD_GAME_PAGE_STATE
}
