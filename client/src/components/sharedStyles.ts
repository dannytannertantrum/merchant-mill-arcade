import { css } from 'goober'


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

const labelError = css`
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
        margin-top: 10px;
        text-transform: none;
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
    errorText,
    errorWrapper,
    labelError,
    heading,
    logoWrapper
}
