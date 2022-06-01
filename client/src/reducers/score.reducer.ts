import {
    FETCH_ERROR,
    FETCH_IN_PROGRESS,
    GET_SCORE,
    GET_SCORES
} from '../utils/constants'
import { AllScoresData, ScoreData } from '../../../common/scores.types'
import { BaseActionType, ReplySuccess } from '../utils/sharedTypes'


type ScoreAction =
    | { type: 'GET_SCORE'; isLoading: boolean; payload: ReplySuccess<ScoreData> }
    | { type: 'GET_SCORES'; isLoading: boolean; payload: ReplySuccess<AllScoresData> }

const INITIAL_SCORE_STATE = {
    error: null,
    isLoading: true,
    replyGetScore: null,
    replyGetScores: null
}

const scoreReducer = (state: typeof INITIAL_SCORE_STATE, action: BaseActionType | ScoreAction) => {
    switch (action.type) {
        case FETCH_ERROR:
            return { ...state, isLoading: false, error: action.error }

        case FETCH_IN_PROGRESS:
            return { ...state, isLoading: true }

        case GET_SCORE:
            return { ...state, isLoading: false, replyGetScore: action.payload }

        case GET_SCORES:
            return { ...state, isLoading: false, replyGetScores: action.payload }

        default:
            throw new Error(`Unknown action type: ${action}`)
    }
}

export {
    scoreReducer,
    INITIAL_SCORE_STATE
}
