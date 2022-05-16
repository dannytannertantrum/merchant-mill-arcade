import { css } from 'goober'
import { LARGE_MOBILE } from '../../utils/breakpoints'


const gameMarquee = css`
    display: block;
    width: 500px;
    margin: 0 auto 40px;
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
        color: #ffffff;
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
    gameMarquee,
    scoresContainer,
    scoresHeader
}
