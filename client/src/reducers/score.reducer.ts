import {
    CREATE_SCORE,
    DELETE_SCORE,
    FETCH_ERROR,
    FETCH_IN_PROGRESS,
    GET_SCORES,
    UPDATE_SCORE
} from '../utils/constants'
import { AllScoresData, ScoreData } from '../../../common/scores.types'
import { BaseActionType, ReplySuccess } from '../utils/sharedTypes'


type ScoreAction =
    | { type: 'CREATE_SCORE'; isLoading: boolean; payload: ReplySuccess<ScoreData> }
    | { type: 'DELETE_SCORE'; isLoading: boolean; payload: ReplySuccess<ScoreData> }
    | { type: 'GET_SCORES'; isLoading: boolean; payload: ReplySuccess<AllScoresData> }
    | { type: 'UPDATE_SCORE'; isLoading: boolean; payload: ReplySuccess<ScoreData> }

const INITIAL_SCORE_STATE = {
    error: null,
    isLoading: false,
    replyCreateScore: null,
    replyDeleteScore: null,
    replyGetScores: null,
    replyUpdateScore: null
}

const scoreReducer = (state: typeof INITIAL_SCORE_STATE, action: BaseActionType | ScoreAction) => {
    switch (action.type) {
        case FETCH_ERROR:
            return { ...state, isLoading: false, error: action.error }

        case FETCH_IN_PROGRESS:
            return { ...state, isLoading: true }

        case CREATE_SCORE:
            return { ...state, isLoading: false, replyCreateScore: action.payload }

        case DELETE_SCORE:
            return { ...state, isLoading: false, replyDeleteScore: action.payload }

        case GET_SCORES:
            return { ...state, isLoading: false, replyGetScores: action.payload }

        case UPDATE_SCORE:
            return { ...state, isLoading: false, replyUpdateScore: action.payload }

        default:
            throw new Error(`Unknown action type: ${action}`)
    }
}

export {
    scoreReducer,
    INITIAL_SCORE_STATE
}
