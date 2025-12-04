import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

function Header() {
  const { user } = useAuth();
  const homeLink = user ? "/dashboard" : "/";

  return (
    <header className="header">
      <div className="header-container">
        <Link to={homeLink} className="logo">
          <h1>CodeIdeas</h1>
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
          <Link to="/signup" className="nav-link">
            <button className="cta-button">Share Your Idea</button>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
