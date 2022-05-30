import { css } from 'goober'
import { LARGE_MOBILE } from '../../utils/breakpoints'


const addGamePageWrapper = css`
    margin: 0 auto;
    max-width: 800px;

    form {
        margin-top: 30px;
    }

    section {
        border-bottom: 2px solid var(--borders);
        margin-bottom: 30px;
        padding-bottom: 30px;
    }
`

const currentMarqueeSelection = css`
    border-bottom: 2px solid var(--borders);
    margin-bottom: 30px;
    text-align: center;

    h3 {
        margin-bottom: 8px;
    }

    img {
        height: 100px;
        margin: 0 auto 30px;
    }

    p {
        margin-bottom: 30px;
    }

    @media screen and (min-width: ${LARGE_MOBILE}px) {
        img {
            max-width: 400px;
        }
    }
`

const marquee = css`
    border: 4px solid transparent;
`

const selectedMarquee = css`
    border: 4px solid #d300ff;
`

const submitMessage = css`
    margin: 0 auto;
    max-width: 800px;

    span {
        color: #fec11e;
    }

    h1 {
        text-align: center;
    }
`

export {
    addGamePageWrapper,
    currentMarqueeSelection,
    marquee,
    selectedMarquee,
    submitMessage
}
