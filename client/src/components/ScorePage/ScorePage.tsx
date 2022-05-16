import { Fragment, SyntheticEvent, useState } from 'react'

import Modal from '../Modal/Modal'
import * as styles from './ScorePageStyles'
import * as sharedStyles from '../sharedStyles'


// When replacing with real data, do ORDER BY DESC high scores
const fakeData = [
    { initials: 'GLC', score: 100000000 },
    { initials: 'JSS', score: 90000000 },
    { initials: 'CAK', score: 80000000 },
    { initials: 'ELB', score: 70000000 },
    { initials: 'GLC', score: 60000000 }
]

const ScorePage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleOnSubmit = (event: SyntheticEvent) => {
        event.preventDefault()
    }

    const addScoreModal = (
        <div className={styles.scoreModalWrapper}>
            <div>
                <button onClick={() => setIsModalOpen(false)} className={styles.closeModalButton} aria-label='Close modal'>
                    X
                </button>
                <h1 className={sharedStyles.heading}>Add your score</h1>
                <form onSubmit={handleOnSubmit}>
                    <label>
                        Enter your initials
                        <input type='text' className={styles.inputInitials} maxLength={3} />
                    </label>
                    <label>
                        Enter your score
                        <input type='text' />
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

    return (
        <Fragment>
            <img src='https://arcademarquee.com/wp-content/uploads/2015/02/frogger_marquee_24x6_dedicated.jpg' className={styles.gameMarquee} />
            <nav>
                <h2>Top 5 Scores</h2>
                <button className={styles.addScoreButton} onClick={() => setIsModalOpen(!isModalOpen)}>
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

export default ScorePage
