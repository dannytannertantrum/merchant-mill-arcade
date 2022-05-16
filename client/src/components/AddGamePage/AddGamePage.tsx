import { Fragment, SyntheticEvent } from 'react'

import * as styles from './AddGamePageStyles'


const AddGamePage = () => {
    const handleOnSubmit = (event: SyntheticEvent) => {
        event.preventDefault()
    }

    return (
        <Fragment>
            <h1 className={styles.heading}>Add a game</h1>
            <form onSubmit={handleOnSubmit}>
                <label>
                    Enter a title
                    <input type='text' />
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
