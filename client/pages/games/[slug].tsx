import { css } from 'goober'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, {
    Fragment,
    SyntheticEvent,
    useEffect,
    useReducer,
    useRef,
    useState
} from 'react'

import { editGame, getGames, removeGame } from '../../api/games.apis'
import { DEFAULT_MARQUEE, FETCH_ERROR, FETCH_IN_PROGRESS, UPDATE_GAME } from '../../utils/constants'
import EditGame from '../../components/EditGame/EditGame'
import FetchError from '../../components/FetchError/FetchError'
import { GameData } from '../../../common/games.types'
import { gameReducer, INITIAL_GAME_STATE } from '../../reducers/game.reducer'
import Loading from '../../components/Loading/Loading'
import Scores from '../../components/Scores/Scores'
import * as sharedStyles from '../../sharedStyles'
import DeleteGameSuccessPage from '../../components/DeleteGameSuccessPage/DeleteGameSuccessPage'


interface GamePageProps {
    loadedGame: GameData
}


const GamePage = ({ loadedGame }: GamePageProps): JSX.Element => {
    const [game, setGame] = useState(loadedGame)
    const [state, dispatch] = useReducer(gameReducer, INITIAL_GAME_STATE)
    const [showEditGame, setShowEditGame] = useState(false)
    const [showDeleteSuccessPage, setShowDeleteSuccesspage] = useState(false)

    const didMountRef = useRef(true)
    const router = useRouter()


    useEffect(() => {
        // Ignore call to componentDidMount
        if (!didMountRef.current) {

            const { isDeleted, slug } = state.replyGame.data

            if (isDeleted) setShowDeleteSuccesspage(true)

            if (game.slug !== slug) {
                router.replace(`/games/${slug}`)
            }

            setGame(state.replyGame.data)

        }

        didMountRef.current = false
    }, [state.replyGame])


    const makeApiRequestDeleteGame = async (_event: SyntheticEvent, id: string) => {
        dispatch({ type: FETCH_IN_PROGRESS, isLoading: true })

        try {

            const response = await removeGame(id)

            if (response.isSuccess) {
                dispatch({ type: UPDATE_GAME, isLoading: false, payload: response })
            }

        } catch (reason) {
            dispatch({ type: FETCH_ERROR, isLoading: false, error: reason })
        }

    }

    const makeApiRequestUpdateGame = async (event: SyntheticEvent, title: string, selectedImage: string, gameId: string) => {
        event.preventDefault()

        // Prevent unnecessary API call if user did not change anything
        if (title === game.title && selectedImage === game.imageUrl) {
            setShowEditGame(false)
            return
        }

        dispatch({ type: FETCH_IN_PROGRESS, isLoading: true })

        try {

            const response = await editGame(gameId, title, selectedImage)

            if (response.isSuccess) {
                dispatch({ type: UPDATE_GAME, isLoading: false, payload: response })
            }

        } catch (reason) {
            dispatch({ type: FETCH_ERROR, isLoading: false, error: reason })
        }

        setShowEditGame(false)
    }

    if (state.error) {
        if (state.error) return <FetchError reason={state.error.reason} />
    }

    if (state.isLoading || !game) {
        return <Loading />
    }

    if (showDeleteSuccessPage) {
        return <DeleteGameSuccessPage title={game.title} />
    }

    const { id, imageUrl, title } = game

    return (
        <Fragment>
            <Head>
                <title>{title} | Merchant Mill Arcade</title>
            </Head>
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
                    <Scores game={game} />
                )
            }
        </Fragment>
    )
}

export async function getStaticProps(context) {
    const { params } = context

    // This helps us prepare the data server-side vs using useRouter
    const gameSlug = params.slug
    const response = await getGames()

    if (response.isSuccess) {
        const game = response.data.find(game => game.slug === gameSlug)

        if (!game) {
            // Next.js will know to show the 404 page with notFound: true
            return { notFound: true }
        }

        return {
            props: { loadedGame: game }
        }
    }

    return {
        notFound: true
    }
}

export async function getStaticPaths() {
    const response = await getGames()

    if (response.isSuccess) {
        const slugs = response.data.map(game => game.slug)
        const pathsWithParams = slugs.map(slug => ({ params: { slug } }))

        return {
            paths: pathsWithParams,
            fallback: true
        }
    }

    return {
        notFound: true
    }
}

export default GamePage
