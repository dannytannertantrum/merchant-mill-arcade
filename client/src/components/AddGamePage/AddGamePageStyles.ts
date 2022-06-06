import { css } from 'goober'


const addGamePageWrapper = css`
    margin: 0 auto;
    max-width: 800px;

    form {
        margin-top: 30px;
    }
`

const gameHeaderAddBorder = css`
    border-bottom: 2px solid var(--borders);
    max-width: 800px;
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
