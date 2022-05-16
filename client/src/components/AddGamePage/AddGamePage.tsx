import { Fragment, SyntheticEvent } from 'react'

import * as sharedStyles from '../sharedStyles'


const AddGamePage = () => {
    const handleOnSubmit = (event: SyntheticEvent) => {
        event.preventDefault()
    }

    return (
        <Fragment>
            <h1 className={sharedStyles.heading}>Add a game</h1>
            <form onSubmit={handleOnSubmit}>
                <label htmlFor='addGameTitle'>
                    Enter a title
                    <input type='text' id='addGameTitle' />
                </label>
                {
                    //
                    // Pull in image search API and search based off the title
                }
                <input type='submit' value='Submit' />
            </form>
        </Fragment>
    )
}

export default AddGamePage
