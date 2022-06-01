import {
    createRef,
    Fragment,
    SyntheticEvent,
    useEffect,
    useReducer,
    useState
} from 'react'

import { FETCH_ERROR, FETCH_IN_PROGRESS, GET_SCORES } from '../../utils/constants'
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

const Scores = ({ game }: ScoresProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [state, dispatch] = useReducer(scoreReducer, INITIAL_SCORE_STATE)

    // We create a reference to the "Add Your Score" text so focus can return to it after the modal closes
    // This is good for a11y: https://reactjs.org/docs/accessibility.html#programmatically-managing-focus
    const addYourScoreRef: React.RefObject<HTMLButtonElement> = createRef()

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
    }, [])

    const handleOnSubmit = (event: SyntheticEvent) => {
        event.preventDefault()
    }

    const handleModalToggle = () => {
        setIsModalOpen(false)
        addYourScoreRef && addYourScoreRef.current?.focus()
    }

    const addScoreModal = (
        <div className={styles.scoreModalWrapper}>
            <div>
                <button onClick={handleModalToggle} className={styles.closeModalButton} aria-label='Close modal'>
                    X
                </button>
                <h1 className={sharedStyles.heading}>Add your score</h1>
                <form onSubmit={handleOnSubmit}>
                    <label htmlFor='addInitials'>
                        Enter your initials
                        <input type='text' className={styles.inputInitials} maxLength={3} id='addInitials' />
                    </label>
                    <label htmlFor='addScore'>
                        Enter your score
                        <input type='number' id='addScore' />
                    </label>
                    <input type='submit' value='Submit' />
                </form>
            </div>
        </div>
    )

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
                <button className={styles.addScoreButton} onClick={() => setIsModalOpen(!isModalOpen)} ref={addYourScoreRef}>
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
            {isModalOpen && <Modal>{addScoreModal}</Modal>}
        </Fragment>
    )
}

export default Scores
