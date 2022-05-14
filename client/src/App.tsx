import AddGamePage from './components/AddGamePage'
import logo from './assets/logo.png'
import HomePage from './components/HomePage/HomePage'
import Route from './components/Route'
import ScorePage from './components/ScorePage'
import * as styles from './index.css'


const App = () => {
    return (
        <div className={styles.arcade}>
            <a href='/'>
                <img src={logo} alt='logo' className={styles.logo} />
            </a>
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
