import {
    MouseEvent,
    SyntheticEvent,
    useContext,
    useReducer
} from 'react'

import {
    FETCH_IN_PROGRESS,
    FETCH_ERROR,
    CREATE_GAME,
    CUSTOM_SEARCH_ERROR
} from '../../utils/constants'
import { GamesContext } from '../../contexts/GamesContext'
// import { addGamePageReducer, INITIAL_ADD_GAME_PAGE_STATE } from '../../reducers/addGamePage.reducer'
import { gameReducer, INITIAL_GAME_STATE } from '../../reducers/game.reducer'
import Loading from '../Loading/Loading'
import * as sharedStyles from '../sharedStyles'
import * as styles from './AddGamePageStyles'
import FetchError from '../FetchError/FetchError'
import EditGame from '../EditGame/EditGame'


const AddGamePage = () => {
    const { createGame } = useContext(GamesContext)
    const [state, dispatch] = useReducer(gameReducer, INITIAL_GAME_STATE)


    const handleSuccessMessageReload = (event: MouseEvent) => {
        event.preventDefault()
        window.location.reload()
    }

    const handleOnSubmit = (event: SyntheticEvent, title: string, selectedImage: string) => {
        event.preventDefault()

        dispatch({ type: FETCH_IN_PROGRESS, isLoading: true })

        createGame(title, selectedImage).then(gameReturned => {
            if (gameReturned.isSuccess) {
                dispatch({ type: CREATE_GAME, isLoading: false, payload: gameReturned })
            }
        }).catch(reason => {
            dispatch({ type: FETCH_ERROR, isLoading: false, error: reason })
        })
    }

    if (state.error && state.error.reason !== CUSTOM_SEARCH_ERROR) {
        return <FetchError reason={state.error.reason} />
    }

    if (state.error === null && state.replyCreateGame?.isSuccess) {
        const { replyCreateGame: { data: { title, slug } } } = state
        return (
            <div className={styles.submitMessage}>
                <p>Congratulations! You just added <span>{title}</span> to the Merchant Mill Arcade! Go <a href={`/games/${slug}`}>
                    add some scores</a> or <a href='/add-game' onClick={handleSuccessMessageReload}>create another game</a>
                </p>
            </div>
        )
    }

    return (
        <div className={styles.addGamePageWrapper}>
            <h1 className={sharedStyles.heading}>Add a game</h1>
            <ol>
                <li>Enter a title</li>
                <li>Search images to find a suitable arcade marquee to associate with your game.</li>
            </ol>
            {state.isLoading === true
                ? <Loading />
                : state.replyCreateGame === null && <EditGame makeApiRequest={handleOnSubmit} />
            }
        </div>
    )
}

export default AddGamePage
