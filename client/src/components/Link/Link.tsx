import { ReactElement } from "react"


interface LinkProps {
    children: ReactElement | string
    href: string
    className?: string
}

const Link = ({ children, href, className }: LinkProps): JSX.Element => {
    const handleOnClick = (event: React.MouseEvent) => {
        // Restore command or ctrl clicking to open in a new tab
        if (event.metaKey || event.ctrlKey) {
            return
        }

        event.preventDefault()
        window.history.pushState({}, '', href)

        // This communicates to our route components that the URL changed
        // https://developer.mozilla.org/en-US/docs/Web/API/PopStateEvent
        const navEvent = new PopStateEvent('popstate')
        window.dispatchEvent(navEvent)
    }

    return (
        <a onClick={handleOnClick} href={href} className={className}>
            {children}
        </a>
    )
}

export default Link
