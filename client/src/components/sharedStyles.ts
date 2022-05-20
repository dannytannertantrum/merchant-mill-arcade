import { css } from 'goober'


const errorImage = css`
    max-width: 400px;
    margin-bottom: 30px;
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

const heading = css`
    text-align: center;
`

const logoWrapper = css`
    display: block;
    margin: 0 auto 20px;
    max-width: 350px;
`

export {
    errorImage,
    errorWrapper,
    heading,
    logoWrapper
}
