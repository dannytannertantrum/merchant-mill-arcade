import logo from '../../assets/logo.png'
import * as sharedStyles from '../sharedStyles'


interface NotFoundPageProps {
    message?: string
}

const NotFoundPage = ({ message }: NotFoundPageProps) => {

    return (
        <div className={sharedStyles.landingPageWrapper}>
            {!message && (
                <a href='/' className={sharedStyles.logoWrapper}>
                    <img src={logo} alt='logo - return to homepage' />
                </a>
            )}
            <h1>Frour-04</h1>
            <img
                alt='Steve Brule confused'
                className={sharedStyles.landingPageImage}
                src='https://c.tenor.com/me1Yk0jRlHoAAAAC/huh-confused.gif'
            />
            <p>
                {message ? message : 'Page not found.'} Check the URL or head <a href='/'>
                    back to the arcade</a>, ya dingus!
            </p>
        </div>
    )
}

export default NotFoundPage
