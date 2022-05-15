import AddGamePage from './components/AddGamePage/AddGamePage'
import HomePage from './components/HomePage/HomePage'
import Link from './components/Link/Link'
import logo from './assets/logo.png'
import Route from './components/Route/Route'
import ScorePage from './components/ScorePage'
import * as styles from './global.css'


const App = () => {
    return (
        <div className={styles.arcade}>
            <Link href='/'>
                <img src={logo} alt='logo' className={styles.logo} />
            </Link>
            <Route path='/'>
                <HomePage />
            </Route>
            <Route path='/add-game'>
                <AddGamePage />
            </Route>
            <Route path='/scores'>
                <ScorePage />
            </Route>
        </div>
    )
}

export default App
