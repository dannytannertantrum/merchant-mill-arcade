import { FETCH_ERROR, FETCH_IN_PROGRESS, GET_IMAGES } from '../utils/constants'
import { CustomSearchResults } from '../api/imageSearch.api'
import { BaseActionType, ReplySuccess } from '../utils/sharedTypes'


interface ImageSearchAction {
    type: 'GET_IMAGES'; isLoading: boolean; payload: ReplySuccess<CustomSearchResults>
}

const INITIAL_IMAGE_SEARCH_STATE = {
    error: null,
    isLoading: false,
    replyGetImages: null
}

// This includes our custom image search implementation
const imageSearchReducer = (state: typeof INITIAL_IMAGE_SEARCH_STATE, action: BaseActionType | ImageSearchAction) => {
    switch (action.type) {
        case FETCH_ERROR:
            return { ...state, isLoading: false, error: action.error }

        case FETCH_IN_PROGRESS:
            return { ...state, isLoading: true }

        case GET_IMAGES:
            return { ...state, isLoading: false, replyGetImages: action.payload }

        default:
            throw new Error(`Unknown action type: ${action}`)
    }
}

export {
    type CustomSearchResults,
    imageSearchReducer,
    INITIAL_IMAGE_SEARCH_STATE
}
