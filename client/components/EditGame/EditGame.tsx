import {
    ChangeEvent,
    Fragment,
    SyntheticEvent,
    useEffect,
    useReducer,
    useState
} from 'react'

import { AllGamesData } from '../../../common/games.types'
import { imageSearchReducer, INITIAL_IMAGE_SEARCH_STATE } from '../../reducers/imageSearch.reducer'
import {
    CUSTOM_SEARCH_ERROR,
    DEFAULT_MARQUEE,
    FETCH_ERROR,
    FETCH_IN_PROGRESS,
    GET_IMAGES
} from '../../utils/constants'
import { getImages } from '../../api/imageSearch.api'
import * as sharedStyles from '../../sharedStyles'
import * as styles from './EditGameStyles'
import Loading from '../Loading/Loading'
import { getGames } from '../../api/games.apis'


interface EditGameProps {
    isEditingExistingGame: boolean
    makeApiRequest: (event: SyntheticEvent, title: string, selectedImage: string, gameId?: string) => void
    gameId?: string
    makeApiRequestDeleteGame?: (event: SyntheticEvent, gameId?: string) => void
    imageUrl?: string | null
    title?: string
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
    isEditingExistingGame,
    makeApiRequest,
    gameId,
    makeApiRequestDeleteGame = () => { },
    imageUrl,
    title
}: EditGameProps) => {
    const [state, dispatch] = useReducer(imageSearchReducer, INITIAL_IMAGE_SEARCH_STATE)

    const [allGames, setAllGames] = useState<AllGamesData>([])
    const [existingGame, setExistingGame] = useState<string>('')
    const [formControl, setFormControl] = useState<GameFormControlFlow>(DEFAULT_FORM_CONTROL_FLOW)
    const [selectedImage, setSelectedImage] = useState<string>(DEFAULT_MARQUEE)
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false)

    const gameHeaderAddBorder = `${sharedStyles.gameHeader} ${styles.gameHeaderAddBorder}`


    useEffect(() => {
        async function fetchGames() {

            const response = await getGames()

            if (response.isSuccess) {
                setAllGames(response.data)
            }

        }

        if (isEditingExistingGame && title) {
            setFormControl(state => ({ ...state, title, imageSelection: imageUrl ?? '' }))
        }

        if (allGames.length === 0) fetchGames()

    }, [])


    const defaultFormChecksFail = () => !!(formControl.title.trim() === '' || existingGame !== '')

    const handleCancelDeleteClicked = (event: SyntheticEvent) => {
        // We need this to prevent the button from trying to submit the form
        event.preventDefault()

        setShowDeleteConfirmation(!showDeleteConfirmation)
    }

    const handleOnSubmit = (event: SyntheticEvent, title: string) => {
        event.preventDefault()

        if (defaultFormChecksFail() || !formControl.showImageSearch) {
            setFormControl(state => ({ ...state, isFormTouched: true }))
            return
        }

        if (gameId) {
            makeApiRequest(event, title, selectedImage, gameId)
        } else {
            makeApiRequest(event, title, selectedImage)
        }
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

            if (matchingTitle && matchingTitle.length > 0 && matchingTitle !== title?.trim().toLowerCase()) {
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
        <Fragment>
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
                            : <p className={sharedStyles.highlight}>{"No images were returned - looks like we're going with the default above!"}</p>}
                    </Fragment>
                )}

                {state.error && state.error.reason === CUSTOM_SEARCH_ERROR &&
                    <div className={sharedStyles.gameHeader}>
                        <p>{"Hmmm there seems to be a problem connecting to Google. Looks like we'll need to go with our default marquee:"}</p>
                        <img src={selectedImage} alt={`${formControl.title} arcade marquee`} />
                    </div>
                }

                {formControl.showImageSearch && <input type='submit' value='Submit' />}

            </form>
            {isEditingExistingGame && !formControl.showImageSearch && (
                <div className={styles.deleteWrapper}>
                    {showDeleteConfirmation
                        ? (
                            <Fragment>
                                <p>Are you sure you want to delete <span className={sharedStyles.highlight}>{title}</span> and all
                                    of its associated scores?</p>
                                <button
                                    className={sharedStyles.deleteButton}
                                    onClick={(event) => makeApiRequestDeleteGame(event, gameId)}
                                >
                                    Yes, Delete
                                </button>
                                <button
                                    className={sharedStyles.cancelDeleteButton}
                                    data-ref='cancel'
                                    onClick={(event) => handleCancelDeleteClicked(event)}
                                >
                                    Cancel
                                </button>
                            </Fragment>
                        ) : <button className={sharedStyles.deleteButton} onClick={() => setShowDeleteConfirmation(true)}>Delete Game</button>
                    }
                </div>
            )}
        </Fragment>
    )
}

export default EditGame
