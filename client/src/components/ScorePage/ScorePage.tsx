import { Fragment } from 'react'

import Link from '../Link/Link'
import * as styles from './ScorePage.css'


// When replacing with real data, do ORDER BY DESC high scores
const fakeData = [
    { initials: 'GLC', score: 100000000 },
    { initials: 'JSS', score: 90000000 },
    { initials: 'CAK', score: 80000000 },
    { initials: 'ELB', score: 70000000 },
    { initials: 'GLC', score: 60000000 }
]

const ScorePage = () => {
    return (
        <Fragment>
            <img src='https://arcademarquee.com/wp-content/uploads/2015/02/frogger_marquee_24x6_dedicated.jpg' className={styles.gameMarquee} />
            <nav>
                <h2>Top 5 Scores</h2>
                <Link href='/add-game'>+ Add your score</Link>
            </nav>
            <div className={styles.scoresHeader}>
                <h3>NO</h3>
                <h3>Score</h3>
                <h3>Initials</h3>
            </div>
            <ul className={styles.scoresContainer}>
                {fakeData.map((score, index) => (
                    <Fragment>
                        <li>{index + 1}</li>
                        <li>{score.score}</li>
                        <li>{score.initials}</li>
                    </Fragment>
                ))}
            </ul>
        </Fragment>
    )
}

export default ScorePage
