import { ChangeEvent, Fragment, MouseEvent, SyntheticEvent, useContext, useState } from 'react'

import FetchException from '../../utils/custom-exceptions'
import { GameData } from '../../../../common/games.types'
import { GamesContext } from '../../contexts/GamesContext'
import * as sharedStyles from '../sharedStyles'
import * as styles from './AddGamePageStyles'


interface ErrorHandling {
    existingGame: string
    isFetchException: FetchException | null
    isFormTouched: boolean
}

const DEFAULT_ERROR_HANDLING: ErrorHandling = {
    existingGame: '',
    isFetchException: null,
    isFormTouched: false
}

const AddGamePage = () => {
    const { allGames, createGame } = useContext(GamesContext)

    const [titleValue, setTitleValue] = useState('')
    const [errors, setErrors] = useState<ErrorHandling>(DEFAULT_ERROR_HANDLING)
    const [response, setResponse] = useState<GameData | null>(null)

    const handleSuccessMessageReload = (event: MouseEvent) => {
        event.preventDefault()

        window.location.reload()
    }

    const handleOnSubmit = async (event: SyntheticEvent) => {
        event.preventDefault()

        if (titleValue.trim() === '' || errors.existingGame !== '') {
            setErrors(state => ({ ...state, isFormTouched: true }))
            return
        }

        const submitResponse = await createGame(titleValue).catch((reason: FetchException) => {
            setErrors(state => ({ ...state, isFetchException: reason }))
        })

        if (errors.isFetchException === null && submitResponse) setResponse(submitResponse)
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const allTitles = allGames.map(game => game.title.toLowerCase())
        const matchingTitle = allTitles.filter(title => title === event.currentTarget.value.toLowerCase().trim())[0]

        if (matchingTitle && matchingTitle.length > 0) {
            setErrors(state => ({ ...state, existingGame: matchingTitle }))
        } else {
            setErrors(state => ({ ...state, existingGame: '' }))
        }

        setErrors(state => ({ ...state, isFormTouched: true }))
        setTitleValue(event.currentTarget.value)
    }

    const displayForm = (
        <form onSubmit={handleOnSubmit}>
            <label
                htmlFor='addGameTitle'
                className={errors.isFormTouched && titleValue.trim() === '' || errors.existingGame ? sharedStyles.labelError : ''}
            >
                Enter a title
                <input
                    id='addGameTitle'
                    onChange={handleInputChange}
                    type='text'
                    value={titleValue}
                />
                {errors.isFormTouched && titleValue.trim() === '' && <p>Title is required</p>}
                {errors.existingGame !== '' && <p>{errors.existingGame} is already in the arcade! Please enter a different title.</p>}
            </label>
            {
                //
                // Pull in image search API and search based off the title
            }
            <input type='submit' value='Submit' />
        </form>
    )

    if (errors.isFetchException) {
        return (
            <div className={styles.submitMessage}>
                <h1 className={sharedStyles.errorText}>Status code: {errors.isFetchException.statusCode} {errors.isFetchException.error}</h1>
                <p>
                    Whatever that means, amirite?? Slippery Pete says, "<span>{errors.isFetchException.message}</span>."
                    &nbsp;Why don't you <a href='/add-game' onClick={handleSuccessMessageReload}>try again</a>, eh?
                </p>
            </div>
        )
    }

    if (errors.isFetchException === null && response) {
        return (
            <div className={styles.submitMessage}>
                <p>Congratulations! You just added <span>{response.title}</span> to the Merchant Mill Arcade! Go <a href={`/games/${response.slug}`}>
                    add some scores</a> or <a href='/add-game' onClick={handleSuccessMessageReload}>create another game</a>
                </p>
            </div>
        )
    }

    return (
        <Fragment>
            <h1 className={sharedStyles.heading}>Add a game</h1>
            {response === null && displayForm}
        </Fragment>
    )
}

export default AddGamePage
