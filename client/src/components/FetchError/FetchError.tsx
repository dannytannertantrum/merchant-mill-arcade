import React from 'react'
import * as styles from '../sharedStyles'


interface FetchErrorProps {
    reason: Error | {
        error: string
        message: string
        statusCode: number
    }
}

const FetchError = ({ reason }: FetchErrorProps) => {
    const handleLinkReload = (event: React.MouseEvent) => {
        // Restore command or ctrl clicking to open in a new tab
        if (event.metaKey || event.ctrlKey) {
            return
        }

        event.preventDefault()

        window.location.reload()
    }

    console.warn(`Error fetching: ${reason}`)

    return (
        <div className={styles.errorWrapper}>
            <h1>Thanks a lot; you broke the arcade!</h1>
            <img
                alt='George Costanza playing Frogger in the street'
                className={styles.errorImage}
                src='https://media1.giphy.com/media/Zi4gonZjDY6go/giphy.gif'
            />
            <p>
                But seriously, something went wrong. Please try <a href='/' onClick={handleLinkReload}>
                    reloading the page</a> or come back later.
            </p>
        </div>
    )
}

export default FetchError
