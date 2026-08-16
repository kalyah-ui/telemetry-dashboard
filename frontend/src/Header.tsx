import { Link } from "react-router";
import "./Header.css"

export function Header() {
    return (
        <div className="header-container">
            <Link to="/">Metrics</Link>
            <Link to="/logs">Logs</Link>
            <Link to="/errors">Errors</Link>
        </div>
    );
}