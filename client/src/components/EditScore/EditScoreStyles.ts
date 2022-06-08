import { css } from 'goober'
import { LARGE_MOBILE, TABLET } from '../../utils/breakpoints'


const closeModalButton = css`
    background: transparent;
    border: 0 none;
    color: #cf0000;
    cursor: pointer;
    font-size: 16px;
    font-family: inherit;
    position: absolute;
    top: 10px;
    right: 10px;

    @media screen and (min-width: ${LARGE_MOBILE}px) {
        font-size: 24px;
    }
`

const deleteConfirmation = css`
    margin-top: 20px;
`

const editSubmitButtonsWrapper = css`
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;

    input[type="submit"] {
        margin: 0 20px 20px 0;
    }

    @media screen and (min-width: ${LARGE_MOBILE}px) {
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        align-items: center;

        input[type="submit"] {
            margin-bottom: 0;
        }
    }
`

const inputInitials = css`
    width: 100px;
    text-transform: uppercase !important;
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
        text-align: left;
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

    @media screen and (min-width: ${TABLET}px) {
        h1 {
            text-align: center;
        }
    }
`

export {
    closeModalButton,
    deleteConfirmation,
    editSubmitButtonsWrapper,
    inputInitials,
    scoreModalWrapper
}
