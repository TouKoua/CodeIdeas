import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>CodeIdeas</h1>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/browse" className="nav-link">
            Browse Ideas
          </Link>
          <Link to="/about" className="nav-link">
            About
          </Link>
          <button className="cta-button">Share Your Idea</button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
