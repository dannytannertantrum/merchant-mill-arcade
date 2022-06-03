import {
    ChangeEvent,
    createRef,
    Fragment,
    SyntheticEvent,
    useEffect,
    useReducer,
    useState
} from 'react'

import { addScore } from '../../apis/scores.apis'
import { CREATE_SCORE, FETCH_ERROR, FETCH_IN_PROGRESS, GET_SCORES } from '../../utils/constants'
import EditScore from '../EditScore/EditScore'
import { GameData } from '../../../../common/games.types'
import Loading from '../Loading/Loading'
import Modal from '../Modal/Modal'
import * as styles from './ScorePageStyles'
import * as sharedStyles from '../sharedStyles'
import { getScoresByGameId } from '../../apis/scores.apis'
import { INITIAL_SCORE_STATE, scoreReducer } from '../../reducers/score.reducer'


interface ScoresProps {
    game?: GameData | null
}
interface FormControlFlow {
    areFormInitialsTouched: boolean
    editingScore: boolean
    isFormScoreTouched: boolean
    initials: string
    score: string
}

const DEFAULT_FORM_CONTROL_FLOW: FormControlFlow = {
    areFormInitialsTouched: false,
    editingScore: false,
    isFormScoreTouched: false,
    initials: '',
    score: ''
}

const Scores = ({ game }: ScoresProps) => {
    const [state, dispatch] = useReducer(scoreReducer, INITIAL_SCORE_STATE)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formControl, setFormControl] = useState<FormControlFlow>(DEFAULT_FORM_CONTROL_FLOW)

    // We create a reference to the "Add Your Score" text so focus can return to it after the modal closes
    // This is good for a11y: https://reactjs.org/docs/accessibility.html#programmatically-managing-focus
    const addYourScoreRef: React.RefObject<HTMLButtonElement> = createRef()

    /*
        1. Refactor modal into its own <EditScore /> Component - DONE
            - get it working standalone - commit - DONE
            - pass in isEditing boolean - DONE
                - if true, then pass in formControl state - DONE
                - if not, pass in default formControl - DONE
        2. Add pencil emoji
            - ensure a11y
        3. Clicking on pencil opens modal
            - All fields should be pre-populated
            - Add "cancel" button
            - Same form checks should apply with proper errors
            - If nothing changed, do not fire off an update request
        4. Add "update" api call
        5. Add "update" reducer state
    */


    useEffect(() => {
        if (game) {
            dispatch({ type: FETCH_IN_PROGRESS, isLoading: true })

            getScoresByGameId(game.id).then((scoresReturned) => {
                if (scoresReturned.isSuccess) {
                    dispatch({ type: GET_SCORES, isLoading: false, payload: scoresReturned })
                }
            }).catch(reason => {
                dispatch({ type: FETCH_ERROR, isLoading: false, error: reason })
            })
        }
    }, [state.replyCreateScore])


    const handleInputChange = (event: ChangeEvent<HTMLInputElement>, typeChanged?: 'initials') => {
        const { value } = event.currentTarget

        if (typeChanged === 'initials') {
            setFormControl(state => ({ ...state, areFormInitialsTouched: true, initials: value }))
        } else {
            setFormControl(state => ({ ...state, isFormScoreTouched: true, score: value }))
        }
    }

    const handleOnSubmit = (event: SyntheticEvent) => {
        event.preventDefault()

        if (formControl.initials.trim() === '' || formControl.score.trim() === '') {
            setFormControl(state => ({ ...state, areFormInitialsTouched: true, isFormScoreTouched: true }))
            return
        }

        if (game) {
            const scoreConversion = Number(formControl.score)

            dispatch({ type: FETCH_IN_PROGRESS, isLoading: true })

            addScore(game.id, formControl.initials, scoreConversion).then(scoreReturned => {
                if (scoreReturned.isSuccess) {
                    dispatch({ type: CREATE_SCORE, isLoading: false, payload: scoreReturned })
                }
            }).catch(reason => {
                dispatch({ type: FETCH_ERROR, isLoading: false, error: reason })
            })

            setIsModalOpen(false)
        }
    }

    const handleModalToggle = () => {
        setIsModalOpen(false)
        addYourScoreRef && addYourScoreRef.current?.focus()
    }

    const handleAddScoreClicked = (event: SyntheticEvent) => {
        event.preventDefault()

        setFormControl(DEFAULT_FORM_CONTROL_FLOW)
        setIsModalOpen(!isModalOpen)
    }

    const addScoreMessage = (
        <p>Well HOT DOG! Even if your score sucks, you'll be a weiner! ...Because there's like, no scores here, man. Get to playin'!</p>
    )

    const scoreList = (
        state.replyGetScores?.data.map((score, index) => (
            <Fragment key={score.id}>
                <li>{index + 1}</li>
                <li>{score.score}</li>
                <li>{score.initials}</li>
            </Fragment>
        ))
    )

    if (state.isLoading) {
        return <Loading />
    }

    return (
        <Fragment>
            <nav>
                <h2>Top 5 Scores</h2>
                <button className={styles.addScoreButton} onClick={handleAddScoreClicked} ref={addYourScoreRef}>
                    + Add your score
                </button>
            </nav>
            <div className={styles.scoresHeader}>
                <h3>NO</h3>
                <h3>Score</h3>
                <h3>Initials</h3>
            </div>
            {state.replyGetScores && state.replyGetScores.data.length > 0
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
                        handleModalToggle={handleModalToggle}
                        handleOnSubmit={handleOnSubmit}
                    />
                </Modal>
            }
        </Fragment>
    )
}

export {
    Scores as default,
    FormControlFlow
}
