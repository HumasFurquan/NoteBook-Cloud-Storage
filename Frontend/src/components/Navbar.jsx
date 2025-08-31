import React from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <Link className="brand" to="/">iNotebook</Link>
      <div className="nav-actions">
        {!localStorage.getItem('token') ? (
          <>
            <Link className={isActive('/login')} to="/login">Login</Link>
            <Link className={isActive('/signup')} to="/signup">Signup</Link>
          </>
        ) : (
          <button className="logout-btn" onClick={logout}>Logout</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
