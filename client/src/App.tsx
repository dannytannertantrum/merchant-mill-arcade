import Arcade from './components/Arcade/Arcade'
import { GamesContextProvider } from './contexts/GamesContext'
import './global.css'


const App = () => {
    return (
        <GamesContextProvider>
            <Arcade />
        </GamesContextProvider>
    )
}

export default App
