import AddGamePage from './components/AddGamePage/AddGamePage'
import HomePage from './components/HomePage/HomePage'
import Link from './components/Link/Link'
import logo from './assets/logo.png'
import Route from './components/Route/Route'
import ScorePage from './components/ScorePage/ScorePage'
import './global.css'
import * as styles from './appStyles'


const App = () => {
    return (
        <div className={styles.arcade}>
            <Link href='/' className={styles.logo}>
                <img src={logo} alt='logo' />
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
