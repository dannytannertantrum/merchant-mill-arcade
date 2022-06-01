import {
    createRef,
    Fragment,
    SyntheticEvent,
    useEffect,
    useReducer,
    useState
} from 'react'

import { DEFAULT_MARQUEE, FETCH_ERROR, FETCH_IN_PROGRESS, GET_SCORES } from '../../utils/constants'
import FetchError from '../FetchError/FetchError'
import { GameData } from '../../../../common/games.types'
import Loading from '../Loading/Loading'
import Modal from '../Modal/Modal'
import * as styles from './GamePageStyles'
import * as sharedStyles from '../sharedStyles'
import NotFoundPage from '../NotFoundPage/NotFoundPage'
import { getScoresByGameId } from '../../apis/scores.apis'
import { INITIAL_SCORE_STATE, scoreReducer } from '../../reducers/score.reducer'


// When replacing with real data, do ORDER BY DESC high scores
const fakeData = [
    { initials: 'GLC', score: 100000000 },
    { initials: 'JSS', score: 90000000 },
    { initials: 'CAK', score: 80000000 },
    { initials: 'ELB', score: 70000000 },
    { initials: 'GLC', score: 60000000 }
]

interface GamePageProps {
    game?: GameData | null
    error?: Error | {
        error: string
        message: string
        statusCode: number
    } | string
    isLoading: boolean
}

const GamePage = (gameState: GamePageProps): JSX.Element => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [state, dispatch] = useReducer(scoreReducer, INITIAL_SCORE_STATE)

    // We create a reference to the "Add Your Score" text so focus can return to it after the modal closes
    // This is good for a11y: https://reactjs.org/docs/accessibility.html#programmatically-managing-focus
    const addYourScoreRef: React.RefObject<HTMLButtonElement> = createRef()
    const marqueeImgSrc = gameState.game?.imageUrl ? gameState.game.imageUrl : DEFAULT_MARQUEE


    useEffect(() => {
        if (gameState.game) {
            dispatch({ type: FETCH_IN_PROGRESS, isLoading: true })

            getScoresByGameId(gameState.game.id).then((scoresReturned) => {
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

    const scoreList = (
        fakeData.map((score, index) => (
            <Fragment key={score.score + index}>
                <li>{index + 1}</li>
                <li>{score.score}</li>
                <li>{score.initials}</li>
            </Fragment>
        ))
    )

    if (!gameState.isLoading && gameState.error != null || gameState.error != null) {
        return <FetchError reason={gameState.error} />
    }

    if (gameState.isLoading) {
        return <Loading />
    }

    if (!gameState.isLoading && !gameState.game) {
        return (
            <NotFoundPage message="Hmmm...we had trouble finding that game." />
        )
    }

    return (
        <Fragment>
            <div className={sharedStyles.gameHeader}>
                <h3>{gameState.game?.title}</h3>
                <img src={marqueeImgSrc} alt={gameState.game?.title} />
            </div>
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
            <ul className={styles.scoresContainer}>
                {scoreList}
            </ul>
            {isModalOpen && <Modal>{addScoreModal}</Modal>}
        </Fragment>
    )
}

export default GamePage
