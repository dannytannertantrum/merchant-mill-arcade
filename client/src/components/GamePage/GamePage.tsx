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

import { DEFAULT_MARQUEE, FETCH_ERROR, FETCH_IN_PROGRESS, UPDATE_GAME } from '../../utils/constants'
import EditGame from '../EditGame/EditGame'
import FetchError from '../FetchError/FetchError'
import { GameData } from '../../../../common/games.types'
import { gameReducer, INITIAL_GAME_STATE } from '../../reducers/game.reducer'
import { GamesContext } from '../../contexts/GamesContext'
import Loading from '../Loading/Loading'
import NotFoundPage from '../NotFoundPage/NotFoundPage'
import * as sharedStyles from '../sharedStyles'

// Given the size of this app, there's no real need for lazy loading
// This is more so for learning purposes: check react docs and this article
// https://medium.com/hackernoon/lazy-loading-and-preloading-components-in-react-16-6-804de091c82d
const ScoresPromise = import('../Scores/Scores')
const Scores = React.lazy(() => ScoresPromise)


interface GamePageProps {
    game?: GameData
}


const GamePage = ({ game }: GamePageProps): JSX.Element => {
    const { updateGame } = useContext(GamesContext)
    const [state, dispatch] = useReducer(gameReducer, INITIAL_GAME_STATE)
    const [showEditGame, setShowEditGame] = useState(false)
    const [marquee, setMarquee] = useState(game?.imageUrl ?? DEFAULT_MARQUEE)


    useEffect(() => {
        if (state.replyUpdateGame) {
            setMarquee(state.replyUpdateGame?.data.imageUrl ?? DEFAULT_MARQUEE)
            setShowEditGame(!showEditGame)
        }
    }, [state.replyUpdateGame])


    const makeApiRequestUpdateGame = (event: SyntheticEvent, title: string, selectedImage: string, gameId: string) => {
        event.preventDefault()

        // Prevent unnecessary API call if user did not change the score
        if (title === game?.title && selectedImage === game?.imageUrl) {
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
    }

    if (state.error) {
        if (state.error) return <FetchError reason={state.error.reason} />
    }

    if (state.isLoading) {
        return <Loading />
    }

    if (!game) {
        return (
            <NotFoundPage message="Hmmm...we had trouble finding that game." />
        )
    }

    return (
        <Fragment>
            <div className={sharedStyles.gameHeader}>
                <div>
                    <h3>{game.title}</h3>
                    <button className={sharedStyles.buttonAsLink} onClick={() => setShowEditGame(!showEditGame)}>
                        {showEditGame
                            ? 'Cancel edit'
                            : 'Edit'
                        }
                    </button>
                </div>
                <img
                    src={marquee}
                    alt={game.title}
                />
            </div>
            {showEditGame
                ? (
                    <Fragment>
                        <p className={css`text-align: center; margin-bottom: 40px;`}>
                            You are making edits to <span className={sharedStyles.highlight}>{game.title}</span>
                        </p>
                        <EditGame
                            makeApiRequest={makeApiRequestUpdateGame}
                            gameId={game.id}
                            imageUrl={game.imageUrl}
                            title={game.title}
                        />
                    </Fragment>
                ) : (
                    <Suspense fallback={<Loading />}>
                        <Scores game={game} />
                    </Suspense>
                )
            }
        </Fragment>
    )
}

export default GamePage
