import Link from '../Link/Link'
import * as styles from '../sharedStyles'


const ErrorPage = () => (
    <div className={styles.errorWrapper}>
        <h1>An Error Is You</h1>
        <img src='https://64.media.tumblr.com/3dcff8b3e5337893f065c2622546a290/tumblr_nshfz4FL2x1u0rseao1_540.gifv' />
        <p>Sorry. We don't know what went wrong. Try heading <Link href='/'>back to the arcade</Link>.</p>
    </div>
)

export default ErrorPage
