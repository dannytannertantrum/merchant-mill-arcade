import Link from '../Link/Link'
import * as sharedStyles from '../sharedStyles'
import davola from '../../assets/davola.jpg'


const DeleteGameSuccessPage = () => {
    const title = window.location.search.replace(/\?|%20/g, ' ').trim()

    return (
        <div className={sharedStyles.landingPageWrapper}>
            <h1>Delete Success!</h1>
            <img
                alt='Joe Davola from Seinfeld'
                className={sharedStyles.landingPageImage}
                src={davola}
            />
            <p>You just put the kibosh on <span className={sharedStyles.highlight}>{title}</span>.
                Now head <Link href='/'>back to the arcade</Link>!</p>
        </div>
    )
}

export default DeleteGameSuccessPage
