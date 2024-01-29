import { Link } from "react-router-dom";

import { useUserAuth } from "../hooks/useUserAuth.js";
import AuthWrapper from '../utils/AuthWrapper.js';

import './styles/nav-bar.css';

const NavBar = () => {
    const { user, isAdmin } = useUserAuth();

    const renderUserProfile = () => (
        <div className={`profile-pic ${user?.pfp}`} />
    )

    return (
        <div className="nav-bar-container">
            <div className="nav-bar-header">
                <div className="nav-bar-logo-container">
                    <div className="nav-bar-logo logo" />
                    <div>Metaverse Mall</div>
                </div>
                <div className="right-btn-group">
                    <Link to="/login">{user ? user.name : 'Login'}</Link>
                    {renderUserProfile()}
                </div>
            </div>
            <div className="nav-bar-content">
                <Link to="/">
                    <span className="icon store" />
                    Stores
                </Link>
                <AuthWrapper requiredRoles={[1]} >
                    <Link to="/users">
                        <span className="icon user" />
                        Users
                    </Link>
                </AuthWrapper>
                <div>
                    <span className="icon more" />
                    More coming...
                </div>
            </div>
        </div>
    )
};

export default NavBar;