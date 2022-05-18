import { css } from 'goober'


const errorWrapper = css`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    max-width: 600px;
    margin: 0 auto;
    text-align: center;

    img {
        display: block;
        max-width: 400px;
        margin-bottom: 30px;
    }

    a {
        cursor: pointer;
    }
`

const heading = css`
    text-align: center;
`

export {
    errorWrapper,
    heading
}
