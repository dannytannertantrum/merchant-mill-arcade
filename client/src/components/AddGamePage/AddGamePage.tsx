import {
    ChangeEvent,
    Fragment,
    MouseEvent,
    SyntheticEvent,
    useContext,
    useReducer,
    useState
} from 'react'
import { DEFAULT_MARQUEE, FETCH_IN_PROGRESS, FETCH_ERROR, GET_IMAGES } from '../../utils/constants'
import { FetchException } from '../../utils/custom-exceptions'
import { GameData } from '../../../../common/games.types'
import { GamesContext } from '../../contexts/GamesContext'
import { getImages } from '../../apis/imageSearch.api'
import { imageSearchReducer, INITIAL_IMAGE_SEARCH_STATE } from '../../reducers/imageSearch.reducer'
import Loading from '../Loading/Loading'
import * as sharedStyles from '../sharedStyles'
import * as styles from './AddGamePageStyles'


interface ErrorHandling {
    existingGame: string
    isFetchException: FetchException | null
    isFormTouched: boolean
}
interface FormControlFlow {
    imageSelection: string
    showImageSearch: boolean
    title: string
}

const DEFAULT_ERROR_HANDLING: ErrorHandling = {
    existingGame: '',
    isFetchException: null,
    isFormTouched: false
}
const DEFAULT_FORM_CONTROL_FLOW: FormControlFlow = {
    imageSelection: '',
    showImageSearch: false,
    title: ''
}

const AddGamePage = () => {
    const { allGames, createGame } = useContext(GamesContext)
    const [state, dispatch] = useReducer(imageSearchReducer, INITIAL_IMAGE_SEARCH_STATE)

    const [formControl, setFormControl] = useState<FormControlFlow>(DEFAULT_FORM_CONTROL_FLOW)
    const [errors, setErrors] = useState<ErrorHandling>(DEFAULT_ERROR_HANDLING)
    const [selectedImage, setSelectedImage] = useState<string>(DEFAULT_MARQUEE)
    const [gameCreated, setGameCreated] = useState<GameData | null>(null)

    const handleSuccessMessageReload = (event: MouseEvent) => {
        event.preventDefault()

        window.location.reload()
    }

    const handleShowImageSelection = (event: SyntheticEvent) => {
        event.preventDefault()

        if (formControl.title.trim() === '' || errors.existingGame !== '') {
            setErrors(errorState => ({ ...errorState, isFormTouched: true }))
            return
        }

        dispatch({ type: FETCH_IN_PROGRESS, isLoading: true })

        getImages(formControl.title.trim()).then((imagesReturned) => {
            // We need to type narrow here or TS gets really upset
            if (imagesReturned.isSuccess) {
                dispatch({ type: GET_IMAGES, isLoading: false, payload: imagesReturned })
            }
        }).catch(reason => {
            dispatch({ type: FETCH_ERROR, isLoading: false, payload: reason })
        })

        setFormControl(formState => ({ ...formState, showImageSearch: true }))
    }

    const handleOnSubmit = async (event: SyntheticEvent) => {
        event.preventDefault()

        const submitResponse = await createGame(formControl.title).catch((reason: FetchException) => {
            setErrors(errorState => ({ ...errorState, isFetchException: reason }))
        })

        if (errors.isFetchException === null && submitResponse) setGameCreated(submitResponse)
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget
        const allTitles = allGames.map(game => game.title.toLowerCase())
        const matchingTitle = allTitles.filter(gameTitle => gameTitle === value.toLowerCase().trim())[0]

        if (matchingTitle && matchingTitle.length > 0) {
            setErrors(errorState => ({ ...errorState, existingGame: matchingTitle }))
        } else {
            setErrors(errorState => ({ ...errorState, existingGame: '' }))
        }

        setErrors(errorState => ({ ...errorState, isFormTouched: true }))
        setFormControl(formState => ({ ...formState, title: value }))
    }

    const displayForm = (
        <form onSubmit={handleOnSubmit}>
            {formControl.showImageSearch === false && (
                <Fragment>
                    <label
                        htmlFor='addGameTitle'
                        className={errors.isFormTouched && formControl.title.trim() === '' || errors.existingGame ? sharedStyles.errorLabel : ''}
                    >
                        Enter a title
                        <input
                            id='addGameTitle'
                            onChange={handleInputChange}
                            type='text'
                            value={formControl.title}
                        />
                        {errors.isFormTouched && formControl.title.trim() === '' && <p>Title is required</p>}
                        {errors.existingGame !== '' && <p>{errors.existingGame} is already in the arcade! Please enter a different title.</p>}
                    </label>
                    <button className={sharedStyles.buttonPurple} onClick={handleShowImageSelection}>Next</button>
                </Fragment>
            )}

            {formControl.showImageSearch && state.data?.isSuccess && (
                <Fragment>
                    <p>Almost there! Select an image for <span className={sharedStyles.highlight}>{formControl.title}</span>.
                        If no image is selected or we cannot find a suitable marquee, we'll use the default currently selected.</p>
                    <div className={styles.currentMarqueeSelection}>
                        <h3>Current Selection</h3>
                        <img src={selectedImage} alt={`${formControl.title} arcade marquee`} />
                    </div>
                    {state.data?.isSuccess && state.data.searchResults.items
                        ? <ul className={sharedStyles.gameGrid}>
                            {state.data.searchResults.items.map((image, index) => (
                                <li key={index}>
                                    <button onClick={() => setSelectedImage(image['link'])} className={sharedStyles.gameLink}>
                                        <span className={sharedStyles.marquee(image['link'])}></span>
                                    </button>
                                    <span className={sharedStyles.gameTitle}>{`Selection ${index}`}</span>
                                </li>
                            ))}
                        </ul>
                        : <p>No images were returned - looks like default it is!</p>}
                    <input type='submit' value='Submit' />
                </Fragment>
            )}
        </form>
    )

    if (errors.isFetchException) {
        return (
            <div className={styles.submitMessage}>
                <h1 className={sharedStyles.errorText}>Status code: {errors.isFetchException.statusCode} {errors.isFetchException.error}</h1>
                <p>
                    Whatever that means, amirite?? Slippery Pete says, "<span className={sharedStyles.highlight}>{errors.isFetchException.message}</span>."
                    &nbsp;Why don't you <a href='/add-game' onClick={handleSuccessMessageReload}>try again</a>, eh?
                </p>
            </div>
        )
    }

    if (errors.isFetchException === null && gameCreated) {
        return (
            <div className={styles.submitMessage}>
                <p>Congratulations! You just added <span>{gameCreated.title}</span> to the Merchant Mill Arcade! Go <a href={`/games/${gameCreated.slug}`}>
                    add some scores</a> or <a href='/add-game' onClick={handleSuccessMessageReload}>create another game</a>
                </p>
            </div>
        )
    }

    return (
        <Fragment>
            <h1 className={sharedStyles.heading}>Add a game</h1>
            {state.isLoading === true
                ? <Loading />
                : gameCreated === null && displayForm
            }
        </Fragment>
    )
}

export default AddGamePage
