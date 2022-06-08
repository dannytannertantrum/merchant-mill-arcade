import { css } from 'goober'
import React, {
    Fragment,
    Suspense,
    SyntheticEvent,
    useContext,
    useEffect,
    useReducer,
    useState
} from 'react'

import { DEFAULT_MARQUEE, FETCH_ERROR, FETCH_IN_PROGRESS, GET_GAME, UPDATE_GAME } from '../../utils/constants'
import EditGame from '../EditGame/EditGame'
import FetchError from '../FetchError/FetchError'
import { GameData } from '../../../../common/games.types'
import { gameReducer, INITIAL_GAME_STATE } from '../../reducers/game.reducer'
import { GamesContext } from '../../contexts/GamesContext'
import { getGame } from '../../apis/games.apis'
import Loading from '../Loading/Loading'
import NotFoundPage from '../NotFoundPage/NotFoundPage'
import * as sharedStyles from '../sharedStyles'

// Given the size of this app, there's no real need for lazy loading
// This is more so for learning purposes: check react docs and this article
// https://medium.com/hackernoon/lazy-loading-and-preloading-components-in-react-16-6-804de091c82d
const ScoresPromise = import('../Scores/Scores')
const Scores = React.lazy(() => ScoresPromise)


interface GamePageProps {
    game: GameData
}


const GamePage = ({ game }: GamePageProps): JSX.Element => {
    const { deleteGame, updateGame } = useContext(GamesContext)
    const [state, dispatch] = useReducer(gameReducer, INITIAL_GAME_STATE)
    const [showEditGame, setShowEditGame] = useState(false)


    useEffect(() => {
        if (game) {
            dispatch({ type: FETCH_IN_PROGRESS, isLoading: true })

            getGame(game.id).then((gameReturned) => {
                if (gameReturned.isSuccess) {
                    dispatch({ type: GET_GAME, isLoading: false, payload: gameReturned })
                }
            }).catch(reason => {
                dispatch({ type: FETCH_ERROR, isLoading: false, error: reason })
            })
        }
    }, [])


    const makeApiRequestDeleteGame = (event: SyntheticEvent, id: string) => {
        dispatch({ type: FETCH_IN_PROGRESS, isLoading: true })

        deleteGame(id).then(gameReturned => {
            if (gameReturned.isSuccess) {
                dispatch({ type: UPDATE_GAME, isLoading: false, payload: gameReturned })
            }
        }).catch(reason => {
            dispatch({ type: FETCH_ERROR, isLoading: false, error: reason })
        })
    }

    const makeApiRequestUpdateGame = (event: SyntheticEvent, title: string, selectedImage: string, gameId: string) => {
        event.preventDefault()

        // Prevent unnecessary API call if user did not change anything
        if (title === state.replyGame?.data.title && selectedImage === state.replyGame?.data.imageUrl) {
            setShowEditGame(false)
            return
        }

        dispatch({ type: FETCH_IN_PROGRESS, isLoading: true })

        updateGame(gameId, title, selectedImage).then(gameReturned => {
            if (gameReturned.isSuccess) {
                dispatch({ type: UPDATE_GAME, isLoading: false, payload: gameReturned })
            }
        }).catch(reason => {
            dispatch({ type: FETCH_ERROR, isLoading: false, error: reason })
        })

        setShowEditGame(false)
    }

    if (state.error) {
        if (state.error) return <FetchError reason={state.error.reason} />
    }

    if (state.isLoading) {
        return <Loading />
    }

    if (!state.replyGame?.isSuccess) {
        return (
            <NotFoundPage message="Hmmm...we had trouble finding that game." />
        )
    }

    const { replyGame: { data: { id, imageUrl, title } } } = state

    return (
        <Fragment>
            <div className={sharedStyles.gameHeader}>
                <div>
                    <h3>{title}</h3>
                    <button className={sharedStyles.buttonAsLink} onClick={() => setShowEditGame(!showEditGame)}>
                        {showEditGame
                            ? 'Cancel edit'
                            : 'Edit'
                        }
                    </button>
                </div>
                <img
                    src={imageUrl ?? DEFAULT_MARQUEE}
                    alt={title}
                />
            </div>
            {showEditGame
                ? (
                    <Fragment>
                        <p className={css`text-align: center; margin-bottom: 40px;`}>
                            You are making edits to <span className={sharedStyles.highlight}>{title}</span>
                        </p>
                        <EditGame
                            gameId={id}
                            makeApiRequestDeleteGame={makeApiRequestDeleteGame}
                            imageUrl={imageUrl}
                            isEditingExistingGame={true}
                            makeApiRequest={makeApiRequestUpdateGame}
                            title={title}
                        />
                    </Fragment>
                ) : (
                    <Suspense fallback={<Loading />}>
                        <Scores game={state.replyGame.data} />
                    </Suspense>
                )
            }
        </Fragment>
    )
}

export default GamePage
