import {
    ChangeEvent,
    Fragment,
    MouseEvent,
    SyntheticEvent,
    useContext,
    useReducer,
    useState
} from 'react'

import {
    DEFAULT_MARQUEE,
    FETCH_IN_PROGRESS,
    FETCH_ERROR,
    GET_IMAGES,
    CREATE_GAME,
    CUSTOM_SEARCH_ERROR
} from '../../utils/constants'
import { GamesContext } from '../../contexts/GamesContext'
import { getImages } from '../../apis/imageSearch.api'
import { addGamePageReducer, INITIAL_ADD_GAME_PAGE_STATE } from '../../reducers/addGamePage.reducer'
import Loading from '../Loading/Loading'
import * as sharedStyles from '../sharedStyles'
import * as styles from './AddGamePageStyles'
import FetchError from '../FetchError/FetchError'


interface FormControlFlow {
    imageSelection: string
    isFormTouched: boolean
    showImageSearch: boolean
    title: string
}
const DEFAULT_FORM_CONTROL_FLOW: FormControlFlow = {
    imageSelection: '',
    isFormTouched: false,
    showImageSearch: false,
    title: ''
}

const AddGamePage = () => {
    const { allGames, createGame } = useContext(GamesContext)
    const [state, dispatch] = useReducer(addGamePageReducer, INITIAL_ADD_GAME_PAGE_STATE)

    const [formControl, setFormControl] = useState<FormControlFlow>(DEFAULT_FORM_CONTROL_FLOW)
    const [existingGame, setExistingGame] = useState<string>('')
    const [selectedImage, setSelectedImage] = useState<string>(DEFAULT_MARQUEE)


    const handleSuccessMessageReload = (event: MouseEvent) => {
        event.preventDefault()
        window.location.reload()
    }


    // FORM HANDLING
    const defaultFormChecksFail = () => !!(formControl.title.trim() === '' || existingGame !== '')

    const handleShowImageSelection = (event: SyntheticEvent | React.KeyboardEvent<HTMLElement>) => {
        event.preventDefault()

        if (defaultFormChecksFail()) {
            setFormControl(state => ({ ...state, isFormTouched: true }))
            return
        }

        dispatch({ type: FETCH_IN_PROGRESS, isLoading: true })

        getImages(formControl.title.trim()).then(imagesReturned => {
            if (imagesReturned.isSuccess) {
                dispatch({ type: GET_IMAGES, isLoading: false, payload: imagesReturned })
            }
        }).catch(reason => {
            dispatch({ type: FETCH_ERROR, isLoading: false, error: reason })
        })

        setFormControl(formState => ({ ...formState, showImageSearch: true }))
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget

        if (allGames) {
            const allTitles = allGames.filter(game => !game.isDeleted).map(game => game.title.toLowerCase())
            const matchingTitle = allTitles.filter(gameTitle => gameTitle === value.toLowerCase().trim())[0]

            if (matchingTitle && matchingTitle.length > 0) {
                setExistingGame(matchingTitle)
            } else {
                setExistingGame('')
            }

            setFormControl(state => ({ ...state, isFormTouched: true, title: value }))
        }
    }

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        if (defaultFormChecksFail()) return

        if (event.code === 'Enter') {
            handleShowImageSelection(event)
        }
    }

    const handleOnSubmit = (event: SyntheticEvent) => {
        event.preventDefault()

        if (defaultFormChecksFail() || !formControl.showImageSearch) {
            setFormControl(state => ({ ...state, isFormTouched: true }))
            return
        }

        dispatch({ type: FETCH_IN_PROGRESS, isLoading: true })

        createGame(formControl.title, selectedImage).then(gameReturned => {
            if (gameReturned.isSuccess) {
                dispatch({ type: CREATE_GAME, isLoading: false, payload: gameReturned })
            }
        }).catch(reason => {
            dispatch({ type: FETCH_ERROR, isLoading: false, error: reason })
        })
    }

    const gameHeaderAddBorder = `${sharedStyles.gameHeader} ${styles.gameHeaderAddBorder}`
    const displayForm = (
        <form onSubmit={handleOnSubmit}>

            <section>
                <label
                    htmlFor='addGameTitle'
                    className={formControl.isFormTouched && formControl.title.trim() === '' || existingGame !== '' ? sharedStyles.errorLabel : ''}
                >
                    Title
                    <input
                        id='addGameTitle'
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                        type='text'
                        value={formControl.title}
                    />

                    {formControl.isFormTouched && formControl.title.trim() === '' && <p>Title is required</p>}
                    {existingGame !== '' && <p>Title already exists</p>}
                </label>
                <button type='button' className={sharedStyles.buttonPurple} onClick={handleShowImageSelection}>Search arcade marquees</button>
            </section>

            {formControl.showImageSearch && state.replyGetImages?.isSuccess && (
                <Fragment>
                    <div className={gameHeaderAddBorder}>
                        <p>Choose an image or keep the default.</p>
                        <h3>Current Selection</h3>
                        <img src={selectedImage} alt={`${formControl.title} arcade marquee`} />
                    </div>
                    {state.replyGetImages?.isSuccess && state.replyGetImages.data.items
                        ? <ul className={sharedStyles.gameGrid}>
                            <li className={selectedImage === DEFAULT_MARQUEE ? styles.selectedMarquee : styles.marquee}>
                                <button type='button' onClick={() => setSelectedImage(DEFAULT_MARQUEE)} className={sharedStyles.gameGridMarqueeLink}>
                                    <span className={sharedStyles.marquee(DEFAULT_MARQUEE)}></span>
                                </button>
                            </li>
                            {state.replyGetImages.data.items.map((image, index) => (
                                <li key={index} className={selectedImage === image['link'] ? styles.selectedMarquee : styles.marquee}>
                                    <button type='button' onClick={() => setSelectedImage(image['link'])} className={sharedStyles.gameGridMarqueeLink}>
                                        <span className={sharedStyles.marquee(image['link'])}></span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                        : <p className={sharedStyles.highlight}>No images were returned - looks like we're going with the default above!</p>}
                </Fragment>
            )}

            {state.error && state.error.reason === CUSTOM_SEARCH_ERROR &&
                <div className={sharedStyles.gameHeader}>
                    <p>Hmmm there seems to be a problem connecting to Google. Looks like we'll need to go with our default marquee:</p>
                    <img src={selectedImage} alt={`${formControl.title} arcade marquee`} />
                </div>
            }

            {formControl.showImageSearch && <input type='submit' value='Submit' />}

        </form>
    )

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
                : state.replyCreateGame === null && displayForm
            }
        </div>
    )
}

export default AddGamePage
