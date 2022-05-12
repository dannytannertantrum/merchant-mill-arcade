interface Route {
    path: string
    children: JSX.Element
}

const Route = ({ path, children }: Route): JSX.Element | null => {
    return window.location.pathname === path
        ? children
        : null
}

export default Route
