import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const homeLink = user ? "/dashboard" : "/";

  const handleLogOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to={homeLink} className="logo">
          <h1>The Creative Spark</h1>
        </Link>
        <nav className="nav">
          <Link to={homeLink} className="nav-link">
            Home
          </Link>
          <Link to="/browse" className="nav-link">
            Browse Ideas
          </Link>
          <Link to="/about" className="nav-link">
            About
          </Link>

          {user && (
            <Link to="/profile" className="nav-link">
              My Profile
            </Link>
          )}

          {user && (
            <div className="create-idea-cta">
              <Link to="/create-idea" className="cta-button">
                Create Idea
              </Link>
            </div>
          )}

          {user ? (
            <button onClick={handleLogOut} className="nav-link logout-button">
              Logout
            </button>
          ) : (
            <Link to="/login" className="nav-link">
              <button className="cta-button">Share Your Idea</button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
