import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <div className="header">
            <div className="logo">
                <Link to="/">MovieApp</Link>
            </div>
            <div className="nav-links">
                <Link to="/">Home</Link>
            </div>
            <div className="auth-controls">
                {user ? (
                    <>
                        <span className="username">{user.username}</span>
                        <button onClick={logout} className="logout-button">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="login-button">Login</Link>
                        <Link to="/register" className="register-button">Register</Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default Header;