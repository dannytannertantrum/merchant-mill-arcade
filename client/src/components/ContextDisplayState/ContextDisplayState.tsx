import { Fragment } from 'react'

import FetchError from '../FetchError/FetchError'
import Loading from '../../components/Loading/Loading'
import logo from '../../assets/logo.png'
import { ReplyFailure } from '../../utils/sharedTypes'
import * as sharedStyles from '../../components/sharedStyles'


interface ContextDisplayStateProps {
    isLoading: boolean
    error: ReplyFailure | null
    children: JSX.Element | JSX.Element[]
}

const ContextDisplayState = ({ isLoading, error, children }: ContextDisplayStateProps): JSX.Element => {
    if (isLoading && error || error) {
        return (
            <Fragment>
                <a href='/' className={sharedStyles.logoWrapper}>
                    <img src={logo} alt='logo - return to homepage' />
                </a>
                <FetchError reason={'string'} />
            </Fragment>
        )
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <Fragment>
            {children}
        </Fragment>
    )
}

export default ContextDisplayState
