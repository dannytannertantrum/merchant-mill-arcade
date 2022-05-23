import {
    ChangeEvent,
    Fragment,
    MouseEvent,
    SyntheticEvent,
    useContext,
    useReducer,
    useState
} from 'react'
import { DEFAULT_MARQUEE, FETCH_IN_PROGRESS, FETCH_ERROR, GET_IMAGES, CREATE_GAME } from '../../utils/constants'
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

    const handleShowImageSelection = (event: SyntheticEvent) => {
        event.preventDefault()

        if (formControl.title.trim() === '' || existingGame !== '') {
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

    const handleOnSubmit = (event: SyntheticEvent) => {
        event.preventDefault()

        createGame(formControl.title).then(gameReturned => {
            if (gameReturned.isSuccess) {
                dispatch({ type: CREATE_GAME, isLoading: false, payload: gameReturned })
            }
        }).catch(reason => {
            dispatch({ type: FETCH_ERROR, isLoading: false, error: reason })
        })
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget

        if (allGames) {
            const allTitles = allGames.map(game => game.title.toLowerCase())
            const matchingTitle = allTitles.filter(gameTitle => gameTitle === value.toLowerCase().trim())[0]

            if (matchingTitle && matchingTitle.length > 0) {
                setExistingGame(matchingTitle)
            } else {
                setExistingGame('')
            }

            setFormControl(state => ({ ...state, isFormTouched: true, title: value }))
        }
    }

    const displayForm = (
        <form onSubmit={handleOnSubmit}>
            {formControl.showImageSearch === false && (
                <Fragment>
                    <label
                        htmlFor='addGameTitle'
                        className={formControl.isFormTouched && formControl.title.trim() === '' || existingGame !== '' ? sharedStyles.errorLabel : ''}
                    >
                        Enter a title
                        <input
                            id='addGameTitle'
                            onChange={handleInputChange}
                            type='text'
                            value={formControl.title}
                        />

                        {formControl.isFormTouched && formControl.title.trim() === '' && <p>Title is required</p>}
                        {existingGame !== '' && <p>{existingGame} is already in the arcade! Please enter a different title.</p>}
                    </label>
                    <button className={sharedStyles.buttonPurple} onClick={handleShowImageSelection}>Next</button>
                </Fragment>
            )}

            {formControl.showImageSearch && state.replyGetImages?.isSuccess && (
                <Fragment>
                    <p>Almost there! Select an image for <span className={sharedStyles.highlight}>{formControl.title}</span>.
                        If no image is selected or we cannot find a suitable marquee, we'll use the default currently selected.</p>
                    <div className={styles.currentMarqueeSelection}>
                        <h3>Current Selection</h3>
                        <img src={selectedImage} alt={`${formControl.title} arcade marquee`} />
                    </div>
                    {state.replyGetImages?.isSuccess && state.replyGetImages.data.items
                        ? <ul className={sharedStyles.gameGrid}>
                            {state.replyGetImages.data.items.map((image, index) => (
                                <li key={index}>
                                    <button onClick={() => setSelectedImage(image['link'])} className={sharedStyles.gameLink}>
                                        <span className={sharedStyles.marquee(image['link'])}></span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                        : <p>No images were returned - looks like default it is!</p>}
                    <input type='submit' value='Submit' />
                </Fragment>
            )}
        </form>
    )

    if (state.error) {
        return <FetchError reason={state.error.reason} />
    }

    if (state.error === null && state.replyCreateGame?.data) {
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
        <Fragment>
            <h1 className={sharedStyles.heading}>Add a game</h1>
            {state.isLoading === true
                ? <Loading />
                : state.replyCreateGame === null && displayForm
            }
        </Fragment>
    )
}

export default AddGamePage
