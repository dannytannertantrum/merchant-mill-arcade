import { css } from 'goober'

import { DESKTOP, LARGE_MOBILE } from '../../utils/breakpoints'


// ul
const gameGrid = css`
    column-gap: 30px;
    display: grid;
    grid-template-columns: 1fr;
    list-style-type: none;
    margin: 0;
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
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

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
    gameGrid,
    gameLink,
    gameTitle,
    marquee
}
