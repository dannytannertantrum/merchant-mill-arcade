import { useEffect, useState } from 'react'


interface Route {
    path: string
    children: JSX.Element
}

const Route = ({ path, children }: Route): JSX.Element | null => {
    // This exists to get our route to update
    const [currentPath, setCurrentPath] = useState(window.location.pathname)

    useEffect(() => {
        const onLocationChange = () => {
            setCurrentPath(window.location.pathname)
        }

        window.addEventListener('popstate', onLocationChange)

        // If we stop showing the route component on the screen, cleanup the event listener
        return () => {
            window.removeEventListener('popstate', onLocationChange)
        }
    }, [])

    return currentPath === path ? children : null
}

export default Route
