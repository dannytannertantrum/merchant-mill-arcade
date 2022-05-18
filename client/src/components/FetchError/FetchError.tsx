import React from 'react'
import * as styles from '../sharedStyles'


interface FetchErrorProps {
    content: 'games' | 'scores'
}

const FetchError = ({ content }: FetchErrorProps) => {
    const handleLinkReload = (event: React.MouseEvent) => {
        event.preventDefault()

        window.location.reload()
    }

    return (
        <div className={styles.errorWrapper}>
            <h1>Thanks a lot; you broke the arcade!</h1>
            <img src='https://media1.giphy.com/media/Zi4gonZjDY6go/giphy.gif' />
            <p>
                But seriously, something went wrong displaying the {content}. Please try <a onClick={handleLinkReload}>
                    reloading the page</a> or come back later.
            </p>
        </div>
    )
}

export default FetchError
