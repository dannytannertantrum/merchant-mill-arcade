import {
    FETCH_ERROR,
    FETCH_IN_PROGRESS,
    GET_IMAGES
} from '../utils/constants'
import { CustomSearchResults, ResponseSuccess, ResponseFailure } from '../apis/imageSearch.api'


type ImageSearchAction =
    | { type: 'FETCH_ERROR'; isLoading: boolean; payload: ResponseFailure<Error> }
    | { type: 'FETCH_IN_PROGRESS'; isLoading: boolean; }
    | { type: 'GET_IMAGES'; isLoading: boolean; payload: ResponseSuccess<CustomSearchResults> }

const INITIAL_IMAGE_SEARCH_STATE = {
    data: null,
    isLoading: false,
}

const imageSearchReducer = (state: typeof INITIAL_IMAGE_SEARCH_STATE, action: ImageSearchAction) => {
    switch (action.type) {
        case FETCH_ERROR:
            return { ...state, isLoading: false, data: action.payload }

        case FETCH_IN_PROGRESS:
            return { ...state, isLoading: true }

        case GET_IMAGES:
            return { ...state, isLoading: false, data: action.payload }

        default:
            throw new Error(`Unknown action type: ${action}`)
    }
}

export {
    CustomSearchResults,
    imageSearchReducer,
    INITIAL_IMAGE_SEARCH_STATE
}
