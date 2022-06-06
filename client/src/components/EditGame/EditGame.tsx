import {
    ChangeEvent,
    Fragment,
    SyntheticEvent,
    useContext,
    useReducer,
    useState
} from 'react'

import { addGamePageReducer, INITIAL_ADD_GAME_PAGE_STATE } from '../../reducers/addGamePage.reducer'
import {
    CUSTOM_SEARCH_ERROR,
    DEFAULT_MARQUEE,
    FETCH_ERROR,
    FETCH_IN_PROGRESS,
    GET_IMAGES
} from '../../utils/constants'
import { GamesContext } from '../../contexts/GamesContext'
import { getImages } from '../../apis/imageSearch.api'
import * as sharedStyles from '../sharedStyles'
import * as styles from '../AddGamePage/AddGamePageStyles'
import Loading from '../Loading/Loading'


interface EditGameProps {
    makeApiRequest: (event: SyntheticEvent, title: string, selectedImage: string) => void
    title?: string
    gameId?: string
    imageUrl?: string | null
}
interface GameFormControlFlow {
    imageSelection: string
    isFormTouched: boolean
    showImageSearch: boolean
    title: string
}

const DEFAULT_FORM_CONTROL_FLOW: GameFormControlFlow = {
    imageSelection: '',
    isFormTouched: false,
    showImageSearch: false,
    title: ''
}

const EditGame = ({
    makeApiRequest,
    gameId,
    imageUrl,
    title
}: EditGameProps) => {
    const { allGames } = useContext(GamesContext)
    const [state, dispatch] = useReducer(addGamePageReducer, INITIAL_ADD_GAME_PAGE_STATE)

    const [existingGame, setExistingGame] = useState<string>('')
    const [selectedImage, setSelectedImage] = useState<string>(DEFAULT_MARQUEE)
    const [formControl, setFormControl] = useState<GameFormControlFlow>(DEFAULT_FORM_CONTROL_FLOW)

    const gameHeaderAddBorder = `${sharedStyles.gameHeader} ${styles.gameHeaderAddBorder}`


    const defaultFormChecksFail = () => !!(formControl.title.trim() === '' || existingGame !== '')

    const handleOnSubmit = (event: SyntheticEvent, title: string) => {
        event.preventDefault()

        if (defaultFormChecksFail() || !formControl.showImageSearch) {
            setFormControl(state => ({ ...state, isFormTouched: true }))
            return
        }

        makeApiRequest(event, title, selectedImage)
    }

    const handleShowImageSelection = (event: React.SyntheticEvent | React.KeyboardEvent<HTMLElement>) => {
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

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        if (defaultFormChecksFail()) return

        if (event.code === 'Enter') {
            handleShowImageSelection(event)
        }
    }

    if (state.isLoading) {
        return <Loading />
    }

    return (
        <form onSubmit={(event: SyntheticEvent) => handleOnSubmit(event, formControl.title)}>

            <section className={sharedStyles.editTitleSection}>
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
                        <p>Select an image below or keep the default.</p>
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
}

export default EditGame
