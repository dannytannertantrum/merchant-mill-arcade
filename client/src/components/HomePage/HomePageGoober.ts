import { css } from 'goober'


const gridItemGame = (bgImage: string) => css`
    background-image: url(${bgImage});
    background-size: cover;
    display: flex;
    height: 100px;
    justify-content: center;
    position: relative;
    width: 100%;

    h3 {
        position: absolute;
        bottom: -40px;
        color: var(--link-color);
        margin: 0;
    }
`

export {
    gridItemGame
}
