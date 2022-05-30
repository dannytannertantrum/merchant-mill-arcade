import { css } from 'goober'


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

const gameHeaderAddBorder = css`
    border-bottom: 2px solid var(--borders);
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
    gameHeaderAddBorder,
    marquee,
    selectedMarquee,
    submitMessage,
}
