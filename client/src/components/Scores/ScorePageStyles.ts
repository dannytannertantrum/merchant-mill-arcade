import { css } from 'goober'
import { LARGE_MOBILE } from '../../utils/breakpoints'


const initialsAndEdit = css`
    button {
        background: transparent;
        border: 0 none;
        display: inline-block;
        cursor: pointer;
        margin: 0 0 0 10px;
        padding: 0;
        vertical-align: top;
    }
`

// ul
const scoresContainer = css`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    text-align: center;
    column-gap: 20px;
    list-style: none;
    margin: 0;
    padding: 0;

    li {
        color: var(--default-text-color);
        margin-bottom: 20px;
        font-size: 12px;
    }

    @media screen and (min-width: ${LARGE_MOBILE}px) {
        li {
            font-size: 16px;
        }
    }
`

const scoresHeader = css`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    text-align: center;
    column-gap: 20px;
`

export {
    initialsAndEdit,
    scoresContainer,
    scoresHeader
}
