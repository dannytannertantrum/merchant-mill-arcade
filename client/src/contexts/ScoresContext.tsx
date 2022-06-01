import { createContext, useEffect, useReducer } from 'react'

import { AllScoresData } from '../../../common/scores.types'
import { FETCH_ERROR, FETCH_IN_PROGRESS, GET_SCORES } from '../utils/constants'
import { getScores } from '../apis/scores.apis'
import { scoreReducer, INITIAL_SCORE_STATE } from '../reducers/score.reducer'
import ContextDisplayState from '../components/ContextDisplayState/ContextDisplayState'


interface ScoresProviderProps {
    children: JSX.Element | JSX.Element[]
}
interface ScoresContextInterface {
    allScores: AllScoresData | null
}

const SCORES_DEFAULT_VALUE: ScoresContextInterface = {
    allScores: []
}
const ScoresContext = createContext<ScoresContextInterface>(SCORES_DEFAULT_VALUE)


const ScoresContextProvider = ({ children }: ScoresProviderProps) => {
    const [state, dispatch] = useReducer(scoreReducer, INITIAL_SCORE_STATE)

    const scoresContext: ScoresContextInterface = {
        allScores: state.replyGetScores && state.replyGetScores.data
    }

    useEffect(() => {
        dispatch({ type: FETCH_IN_PROGRESS, isLoading: true })

        getScores().then(scoresReturned => {
            if (scoresReturned.isSuccess) {
                dispatch({ type: GET_SCORES, isLoading: false, payload: scoresReturned })
            }
        }).catch(reason => {
            dispatch({ type: FETCH_ERROR, isLoading: false, error: reason })
        })
    }, [])

    return (
        <ScoresContext.Provider value={scoresContext}>
            <ContextDisplayState isLoading={state.isLoading} error={state.error} children={children} />
        </ScoresContext.Provider>
    )
}

export {
    ScoresContext,
    ScoresContextProvider
}
