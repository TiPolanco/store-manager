import { Link } from "react-router-dom";

import { useUserAuth } from "../hooks/useUserAuth.js";

import './styles/nav-bar.css';

const NavBar = () => {
    const { user, isAdmin } = useUserAuth();

    const renderUserProfile = () => (
        <div className={`profile-pic one`} />
    )

    return (
        <div className="nav-bar-container">
            <div>
                <Link to="/">The Greatest Metaverse Shopping Mall</Link>
            </div>
            <div className="right-btn-group">
                {isAdmin && <Link to="/users">Users</Link>}
                <Link to="/login">{user ? user.name : 'Login'}</Link>
                {renderUserProfile()}
            </div>
        </div>
    )
};

export default NavBar;