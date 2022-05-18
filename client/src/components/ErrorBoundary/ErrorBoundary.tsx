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
            // Direct user to Fallback UI, based on routing in App.tsx
            return window.location.pathname = '/error'
        }

        return this.props.children
    }
}

export default ErrorBoundary
