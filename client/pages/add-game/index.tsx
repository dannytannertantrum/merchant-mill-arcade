import Head from 'next/head'
import {
    MouseEvent,
    SyntheticEvent,
    useReducer
} from 'react'

import { addGame } from '../../api/games.apis'
import {
    FETCH_IN_PROGRESS,
    FETCH_ERROR,
    CREATE_GAME,
    CUSTOM_SEARCH_ERROR
} from '../../utils/constants'
import { gameReducer, INITIAL_GAME_STATE } from '../../reducers/game.reducer'
import Loading from '../../components/Loading/Loading'
import * as sharedStyles from '../../sharedStyles'
import * as styles from './AddGamePageStyles'
import FetchError from '../../components/FetchError/FetchError'
import EditGame from '../../components/EditGame/EditGame'


function AddGamePage() {
    const [state, dispatch] = useReducer(gameReducer, INITIAL_GAME_STATE)


    const handleSuccessMessageReload = (event: MouseEvent) => {
        event.preventDefault()
        window.location.reload()
    }

    const handleOnSubmit = async (event: SyntheticEvent, title: string, selectedImage: string) => {
        event.preventDefault()

        dispatch({ type: FETCH_IN_PROGRESS, isLoading: true })

        try {

            const response = await addGame(title, selectedImage)

            if (response.isSuccess) {
                dispatch({ type: CREATE_GAME, isLoading: false, payload: response })
            }

        } catch (reason) {
            dispatch({ type: FETCH_ERROR, isLoading: false, error: reason })
        }

    }

    if (state.error && state.error.reason !== CUSTOM_SEARCH_ERROR) {
        return <FetchError reason={state.error.reason} />
    }

    if (state.error === null && state.replyGame?.isSuccess) {
        const { replyGame: { data: { title, slug } } } = state
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
            <Head>
                <title>Add a Game | Merchant Mill Arcade</title>
            </Head>
            <h1 className={sharedStyles.heading}>Add a game</h1>
            <ol>
                <li>Enter a title</li>
                <li>Search images to find a suitable arcade marquee to associate with your game.</li>
            </ol>
            {state.isLoading === true
                ? <Loading />
                : state.replyGame === null && <EditGame isEditingExistingGame={false} makeApiRequest={handleOnSubmit} />
            }
        </div>
    )
}

export default AddGamePage
