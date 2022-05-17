import * as styles from './ClientErrorStyles'


interface ClientErrorProps {
    content: 'games' | 'scores'
}

const ClientError = ({ content }: ClientErrorProps) => {
    return (
        <div className={styles.clientErrorWrapper}>
            <h1>Thanks a lot; you broke the arcade!</h1>
            <img src='https://media1.giphy.com/media/Zi4gonZjDY6go/giphy.gif' />
            <p>But seriously, something went wrong displaying the {content}. Please try refreshing the page or come back later.</p>
        </div>
    )
}

export default ClientError
