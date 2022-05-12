import { Fragment } from 'react'

import AddGamePage from './components/AddGamePage'
import HomePage from './components/HomePage'
import Route from './components/Route'
import ScorePage from './components/ScorePage'


const App = () => {
    return (
        <Fragment>
            <Route path='/'>
                <HomePage />
            </Route>
            <Route path='/add-game'>
                <AddGamePage />
            </Route>
            <Route path='/scores'>
                <ScorePage />
            </Route>
        </Fragment>
    )
}

export default App
