import { Link } from "react-router";

export function Header() {
    return (
        <>
            <Link to="/">Metrics</Link>
            <Link to="/logs">Logs</Link>
            <Link to="/errors">Errors</Link>
        </>
    );
}