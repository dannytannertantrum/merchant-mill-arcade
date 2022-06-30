import { css } from 'goober'

const loadingWrapper = css`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 100px;

    img {
        animation: spin 3s linear infinite;
    }

    @keyframes spin {
        from { transform: rotate(-360deg); }
        to { transform: rotate(360deg); }
    }
`

export {
    loadingWrapper
}
