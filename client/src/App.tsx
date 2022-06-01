import Arcade from './components/Arcade/Arcade'
import { GamesContextProvider } from './contexts/GamesContext'
import { ScoresContextProvider } from './contexts/ScoresContext'
import './global.css'


const App = () => {
    return (
        <GamesContextProvider>
            <ScoresContextProvider>
                <Arcade />
            </ScoresContextProvider>
        </GamesContextProvider>
    )
}

export default App
