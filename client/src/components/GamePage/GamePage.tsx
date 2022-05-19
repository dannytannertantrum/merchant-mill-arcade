import {
    createRef,
    Fragment,
    SyntheticEvent,
    useContext,
    useEffect,
    useReducer,
    useState
} from 'react'

import FetchError from '../FetchError/FetchError'
import { getGame } from '../../apis/games'
import { GameData } from '../../../../common/games.types'
import { GamesContext } from '../../contexts/GamesContext'
import Modal from '../Modal/Modal'
import * as styles from './GamePageStyles'
import * as sharedStyles from '../sharedStyles'


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
    error?: string
    isLoading: boolean
}

const GamePage = (gameState: GamePageProps): JSX.Element => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    // We create a reference to the "Add Your Score" text so focus can return to it after the modal closes
    // This is good for a11y: https://reactjs.org/docs/accessibility.html#programmatically-managing-focus
    const addYourScoreRef: React.RefObject<HTMLButtonElement> = createRef()

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

    if (!gameState.isLoading && gameState.error !== '' || gameState.error !== '') {
        return <FetchError content={'games'} />
    }

    if (gameState.isLoading) {
        return <h1>Loading...</h1>
    }

    if (!gameState.isLoading && !gameState.game) {
        return (
            <h1>No game here, man.</h1>
        )
    }

    return (
        <Fragment>
            {gameState.game?.imageUrl && <img src={gameState.game.imageUrl} className={styles.gameMarquee} />}
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
