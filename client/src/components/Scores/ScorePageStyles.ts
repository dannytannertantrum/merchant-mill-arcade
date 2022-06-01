import { css } from 'goober'
import { LARGE_MOBILE } from '../../utils/breakpoints'


const addScoreButton = css`
    background: transparent;
    border: 0 none;
    color: var(--link-color);
    cursor: pointer;
    font-family: 'Press Start 2P', monospace, sans-serif;
    margin: 0 0 14px;
    transition: color ease-in-out .2s;
    text-transform: uppercase;

    &:hover {
        color: var(--link-color-hover);
    }
`

const closeModalButton = css`
    background: transparent;
    border: 0 none;
    color: #cf0000;
    cursor: pointer;
    font-size: 16px;
    font-family: inherit;
    position: absolute;
    top: 15px;
    right: 10px;

    @media screen and (min-width: ${LARGE_MOBILE}px) {
        font-size: 24px;
    }
`

const inputInitials = css`
    width: 60px;
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

const scoreModalWrapper = css`
    background-color: rgba(0,0,0,0.7);
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    > div {
        max-width: 600px;
        background: rgba(0,0,0,0.7);
        padding: 20px;
        border-radius: 24px;
        border: 5px solid white;
        margin: 0 10px;
        position: relative;
        width: 100%;
    }

    input[type='text'] {
        max-width: 200px;
    }

    h1, label {
        font-size: 12px;
    }

    @media screen and (min-width: ${LARGE_MOBILE}px) {
        input[type='text'] {
            max-width: none;
        }

        h1 {
            font-size: 20px;
        }

        label {
            font-size: 16px;
        }
    }
`

export {
    addScoreButton,
    closeModalButton,
    inputInitials,
    scoresContainer,
    scoresHeader,
    scoreModalWrapper
}
