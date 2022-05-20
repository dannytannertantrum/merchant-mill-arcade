import logo from '../../assets/logo.png'
import * as styles from '../sharedStyles'


const NotFoundPage = () => {
    const handleLinkRedirect = (event: React.MouseEvent) => {
        // Restore command or ctrl clicking to open in a new tab
        if (event.metaKey || event.ctrlKey) {
            return
        }

        event.preventDefault()

        window.location.replace('/')
    }

    return (
        <div className={styles.errorWrapper}>
            <a href='/' onClick={handleLinkRedirect} className={styles.logoWrapper}>
                <img src={logo} alt='logo - return to homepage' />
            </a>
            <h1>Frour-04</h1>
            <img
                alt='Steve Brule confused'
                className={styles.errorImage}
                src='https://c.tenor.com/me1Yk0jRlHoAAAAC/huh-confused.gif'
            />
            <p>Page not found. Check the URL or head <a href='/' onClick={handleLinkRedirect}>back to the arcade</a>, ya dingus!</p>
        </div>
    )
}

export default NotFoundPage
