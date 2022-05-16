import { css } from 'goober'
import { Component, ErrorInfo, ReactNode } from 'react'


interface ErrorBoundaryProps {
    children: ReactNode
}

interface ErrorBoundaryState {
    hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    public state: ErrorBoundaryState = {
        hasError: false
    }

    public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
        // Update state so the next render will show the fallback UI
        return { hasError: true }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log the error to the console or a service (if we had one)
        console.log('Uncaught error: ', error, errorInfo)
    }

    public render() {
        if (this.state.hasError) {
            // Render a custom fallback UI
            return (
                <div className={css`display: flex; justify-content: center; align-items: center; flex-direction: column;`}>
                    <h1 className={css`text-align: center;`}>An Error Is You</h1>
                    <img
                        className={css`display: block;`}
                        src='https://64.media.tumblr.com/3dcff8b3e5337893f065c2622546a290/tumblr_nshfz4FL2x1u0rseao1_540.gifv'
                    />
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
