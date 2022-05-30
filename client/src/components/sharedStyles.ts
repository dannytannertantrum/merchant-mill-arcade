import { css } from 'goober'
import { DESKTOP, LARGE_MOBILE } from '../utils/breakpoints'


const buttonPurple = css`
    background-color: var(--button-bg-color);
    border: 1px solid var(--borders);
    border-radius: 4px;
    color: var(--default-text-color);
    cursor: pointer;
    padding: 12px;
    transition: background-color ease .5s;
    font-family: 'Press Start 2P', monospace, sans-serif;
    text-transform: uppercase;

    &:hover {
        background-color: var(--button-bg-hover);
    }

    &:active {
        box-shadow: inset 1px 1px 7px rgba(0, 0, 0, .5), inset -1px -1px 7px rgba(0, 0, 0, .5);
    }
`

const errorImage = css`
    max-width: 400px;
    margin-bottom: 30px;
`

const errorText = css`
    color: var(--error);
`

const errorWrapper = css`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    max-width: 600px;
    margin: 0 auto;
    text-align: center;

    a {
        cursor: pointer;
    }
`

const errorLabel = css`
    color: var(--error);

    input[type='text'] {
        border: 2px solid var(--error);
        box-shadow: inset 3px 3px 3px var(--error),
            inset -3px -3px 3px var(--error),
            inset 0px 0px 20px var(--error);
    }

    p {
        color: var(--error);
        font-size: 12px;
        margin: 0;
        position: absolute;
        bottom: -26px;
        text-transform: none;
    }
`

// ul
const gameGrid = css`
    column-gap: 30px;
    display: grid;
    grid-template-columns: 1fr;
    list-style-type: none;
    margin: 0 0 30px;
    padding: 0;
    row-gap: 30px;

    @media screen and (min-width: ${LARGE_MOBILE}px) {
        grid-template-columns: 1fr 1fr;
    }

    @media screen and (min-width: ${DESKTOP}px) {
        grid-template-columns: 1fr 1fr 1fr;
    }
`

// ul li a
const gameLink = css`
    background: transparent;
    border: 0 none;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    cursor: pointer;
    padding: 0;
    width: 100%;

    &:hover,
    &:active {
        background: transparent;
        box-shadow: none;
    }
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transition: opacity ease .4s, background-color ease .4s;
        z-index: 2;
    }

    &:hover::before {
        background-color: var(--link-color-hover);
        opacity: .2;
    }
`

// span
const gameTitle = css`
    margin: 10px 0;
    text-align: center;
`

const heading = css`
    text-align: center;
`

const highlight = css`
    color: var(--highlight);
`

const logoWrapper = css`
    display: block;
    margin: 0 auto 20px;
    max-width: 350px;
`

const marquee = (bgImage: string) => css`
    background-image: url(${bgImage});
    background-position: center;
    background-size: cover;
    display: flex;
    height: 100px;
    justify-content: center;
    position: relative;
    width: 100%;
`

export {
    buttonPurple,
    errorImage,
    errorText,
    errorWrapper,
    errorLabel,
    gameGrid,
    gameLink,
    gameTitle,
    heading,
    highlight,
    logoWrapper,
    marquee
}
