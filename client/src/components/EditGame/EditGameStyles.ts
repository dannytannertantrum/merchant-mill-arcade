import { css } from 'goober'


const deleteWrapper = css`
    margin: 0 auto;
    max-width: 800px;
    text-align: right;

    button {
        background: transparent;
        border: 0 none;
        color: #cf0000;
        cursor: pointer;
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

export {
    deleteWrapper,
    gameHeaderAddBorder,
    marquee,
    selectedMarquee
}
