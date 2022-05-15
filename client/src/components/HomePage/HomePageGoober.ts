import { css } from 'goober'


const marquee = (bgImage: string) => css`
    background-image: url(${bgImage});
    background-size: cover;
    display: flex;
    height: 100px;
    justify-content: center;
    position: relative;
    width: 100%;
`

export {
    marquee
}
