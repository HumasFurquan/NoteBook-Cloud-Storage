import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = () => { localStorage.removeItem('token'); navigate('/login'); };

  return (
    <nav className="navbar navbar-dark bg-dark navbar-expand">
      <Link className="navbar-brand px-3" to="/">iNotebook</Link>
      <div className="ms-auto px-3">
        {!localStorage.getItem('token') ? (
          <>
            <Link className="btn btn-primary me-2" to="/login">Login</Link>
            <Link className="btn btn-primary" to="/signup">Signup</Link>
          </>
        ) : (
          <button className="btn btn-primary" onClick={logout}>Logout</button>
        )}
      </div>
    </nav>
  );
}
