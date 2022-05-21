import React, { Fragment, SyntheticEvent, useContext, useState } from 'react'

import { GameData } from '../../../../common/games.types'
import { GamesContext } from '../../contexts/GamesContext'
import * as sharedStyles from '../sharedStyles'
import FetchException from '../../utils/custom-exceptions'


const AddGamePage = () => {
    const { createGame } = useContext(GamesContext)

    const [titleValue, setTitleValue] = useState('')
    const [response, setResponse] = useState<GameData | FetchException | null>(null)

    const handleOnSubmit = async (event: SyntheticEvent) => {
        event.preventDefault()

        const thing = await createGame(titleValue).catch(reason => {
            // TODO do something with this
            console.log('this', reason)
        })

        // TODO display a message
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitleValue(event.currentTarget.value)
    }

    const displayForm = (
        <form onSubmit={handleOnSubmit}>
            <label htmlFor='addGameTitle'>
                Enter a title
                <input
                    id='addGameTitle'
                    onChange={handleInputChange}
                    type='text'
                    value={titleValue}
                />
            </label>
            {
                //
                // Pull in image search API and search based off the title
            }
            <input type='submit' value='Submit' />
        </form>
    )

    console.log('BEFORE THE RETURN', response)

    return (
        <Fragment>
            <h1 className={sharedStyles.heading}>Add a game</h1>
            {response === null && displayForm}
        </Fragment>
    )
}

export default AddGamePage
