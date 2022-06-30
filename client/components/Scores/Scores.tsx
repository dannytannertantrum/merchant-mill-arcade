import {
    ChangeEvent,
    Fragment,
    SyntheticEvent,
    useEffect,
    useReducer,
    useRef,
    useState
} from 'react'

import { addScore, deleteScore, editScore, getScoresByGameId } from '../../api/scores.apis'
import { CREATE_SCORE, DELETE_SCORE, FETCH_ERROR, FETCH_IN_PROGRESS, GET_SCORES, UPDATE_SCORE } from '../../utils/constants'
import EditScore from '../EditScore/EditScore'
import FetchError from '../FetchError/FetchError'
import { GameData } from '../../../common/games.types'
import { INITIAL_SCORE_STATE, scoreReducer } from '../../src/reducers/score.reducer'
import Loading from '../Loading/Loading'
import Modal from '../Modal/Modal'
import { ScoreData } from '../../../common/scores.types'
import * as styles from './ScorePageStyles'
import * as sharedStyles from '../../sharedStyles'


interface ScoresProps {
    game: GameData
}
interface ScoreFormControlFlow {
    areFormInitialsTouched: boolean
    editingScore: boolean
    gameId: string
    index: number
    initials: string
    isFormScoreTouched: boolean
    score: string
    scoreId: string
}
interface ScoreNotChanged {
    initials: string
    score: string
}

const DEFAULT_FORM_CONTROL_FLOW: ScoreFormControlFlow = {
    areFormInitialsTouched: false,
    editingScore: false,
    gameId: '',
    index: 0,
    initials: '',
    isFormScoreTouched: false,
    score: '',
    scoreId: ''
}
const SCORE_NOT_CHANGED_DEFAULT: ScoreNotChanged = {
    initials: '',
    score: ''
}

const Scores = ({ game }: ScoresProps) => {
    const [state, dispatch] = useReducer(scoreReducer, INITIAL_SCORE_STATE)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formControl, setFormControl] = useState<ScoreFormControlFlow>(DEFAULT_FORM_CONTROL_FLOW)
    const [scoreUnchanged, setScoreUnchanged] = useState<ScoreNotChanged>(SCORE_NOT_CHANGED_DEFAULT)

    // We create a reference to the "Add Your Score" text and edit buttons so focus can return to it after the modal closes
    // This is good for a11y: https://reactjs.org/docs/accessibility.html#programmatically-managing-focus
    const addYourScoreRef: React.RefObject<HTMLButtonElement> = useRef(null)
    const editScoreRef: React.RefObject<HTMLButtonElement[]> = useRef([])


    useEffect(() => {
        dispatch({ type: FETCH_IN_PROGRESS, isLoading: true })

        getScoresByGameId(game.id).then((scoresReturned) => {
            if (scoresReturned.isSuccess) {
                dispatch({ type: GET_SCORES, isLoading: false, payload: scoresReturned })
            }
        }).catch(reason => {
            dispatch({ type: FETCH_ERROR, isLoading: false, error: reason })
        })

    }, [state.replyScore])


    const handleInputChange = (event: ChangeEvent<HTMLInputElement>, typeChanged?: 'initials') => {
        const { value } = event.currentTarget

        if (typeChanged === 'initials') {
            setFormControl(state => ({ ...state, areFormInitialsTouched: true, initials: value }))
        } else {
            setFormControl(state => ({ ...state, isFormScoreTouched: true, score: value }))
        }
    }

    const defaultFormChecksFail = () => {
        if (formControl.initials.trim() === '' || formControl.score.trim() === '') {
            setFormControl(state => ({ ...state, areFormInitialsTouched: true, isFormScoreTouched: true }))
            return true
        }

        return false
    }

    const handleDelete = (_event: SyntheticEvent, scoreId: string) => {
        dispatch({ type: FETCH_IN_PROGRESS, isLoading: true })

        deleteScore(scoreId).then(deletedScore => {
            if (deletedScore.isSuccess) {
                dispatch({ type: DELETE_SCORE, isLoading: false, payload: deletedScore })
            }
        }).catch(reason => {
            dispatch({ type: FETCH_ERROR, isLoading: false, error: reason })
        })

        setIsModalOpen(false)
    }

    const handleOnSubmitCreate = (event: SyntheticEvent) => {
        event.preventDefault()

        if (defaultFormChecksFail()) return

        if (game) {
            const convertedScore = Number(formControl.score)

            dispatch({ type: FETCH_IN_PROGRESS, isLoading: true })

            addScore(game.id, formControl.initials, convertedScore).then(scoreReturned => {
                if (scoreReturned.isSuccess) {
                    dispatch({ type: CREATE_SCORE, isLoading: false, payload: scoreReturned })
                }
            }).catch(reason => {
                dispatch({ type: FETCH_ERROR, isLoading: false, error: reason })
            })

            setIsModalOpen(false)
        }
    }

    const handleOnSubmitEdit = (event: SyntheticEvent) => {
        event.preventDefault()

        if (defaultFormChecksFail()) return

        // Prevent unnecessary API call if user did not change the score
        if (formControl.initials === scoreUnchanged.initials && formControl.score === scoreUnchanged.score) {
            setIsModalOpen(false)
            return
        }

        const convertedScore = Number(formControl.score)

        dispatch({ type: FETCH_IN_PROGRESS, isLoading: true })

        editScore(formControl.scoreId, formControl.initials, convertedScore).then(updatedScore => {
            if (updatedScore.isSuccess) {
                dispatch({ type: UPDATE_SCORE, isLoading: false, payload: updatedScore })
            }
        }).catch(reason => {
            dispatch({ type: FETCH_ERROR, isLoading: false, error: reason })
        })

        setIsModalOpen(false)
    }

    const handleCloseModalToggle = (_event: React.MouseEvent<HTMLButtonElement>, index: number) => {
        setIsModalOpen(false)

        if (formControl.editingScore) {
            editScoreRef && editScoreRef.current && editScoreRef.current[index].focus()
        } else {
            addYourScoreRef && addYourScoreRef.current?.focus()
        }
    }

    const handleAddScoreClicked = () => {
        setFormControl(DEFAULT_FORM_CONTROL_FLOW)
        setIsModalOpen(!isModalOpen)
    }

    const handleEditScoreClicked = (_event: React.MouseEvent<HTMLButtonElement>, { gameId, id, initials, score }: ScoreData, index: number) => {
        const convertedScore = score.toString()

        setFormControl(state => ({
            ...state,
            gameId,
            editingScore: true,
            index,
            initials,
            score: convertedScore,
            scoreId: id
        }))
        setScoreUnchanged({ initials, score: convertedScore })

        setIsModalOpen(!isModalOpen)
    }

    const addScoreMessage = (
        <p>Well HOT DOG! Even if your score sucks, you'll be a weiner! ...Because there's like, no scores here, man. Get to playin'!</p>
    )

    const scoreList = (
        state.replyAllScores?.data.map((scoreData, index) => (
            <Fragment key={scoreData.id}>
                <li>{index + 1}</li>
                <li>{scoreData.score}</li>
                <li className={styles.initialsAndEdit}>
                    {scoreData.initials}

                    <button
                        aria-label={'edit score'}
                        onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleEditScoreClicked(event, scoreData, index)}
                        ref={element => element && editScoreRef.current?.push(element)}
                    >
                        &#9999;&#65039; {/* Pencil emoji */}
                    </button>
                </li>
            </Fragment>
        ))
    )

    if (state.isLoading) {
        return <Loading />
    }

    if (state.error) {
        return <FetchError reason={state.error.reason} />
    }

    return (
        <Fragment>
            <nav>
                <h2>Top 5 Scores</h2>
                <button className={sharedStyles.buttonAsLink} onClick={handleAddScoreClicked} ref={addYourScoreRef}>
                    + Add your score
                </button>
            </nav>
            <div className={styles.scoresHeader}>
                <h3>NO</h3>
                <h3>Score</h3>
                <h3>Initials</h3>
            </div>
            {state.replyAllScores && state.replyAllScores.data.length > 0
                ? (
                    <ul className={styles.scoresContainer}>
                        {scoreList}
                    </ul>
                ) : addScoreMessage
            }
            {isModalOpen &&
                <Modal>
                    <EditScore
                        formControl={formControl}
                        handleInputChange={handleInputChange}
                        handleCloseModalToggle={handleCloseModalToggle}
                        handleDelete={handleDelete}
                        handleOnSubmitCreate={handleOnSubmitCreate}
                        handleOnSubmitEdit={handleOnSubmitEdit}
                        scoreUnchanged={scoreUnchanged}
                    />
                </Modal>
            }
        </Fragment>
    )
}

export {
    Scores as default,
    type ScoreFormControlFlow
}
