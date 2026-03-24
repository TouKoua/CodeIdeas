import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import { useState } from "react";

function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const homeLink = user ? "/dashboard" : "/";
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const handleMouseEnter = () => {
    setDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    setDropdownVisible(false);
  };

  const profileDropdown = () => {
    return (
      <div className="dropdown-menu">
        <ul className="dropdown-list">
          <li>
            <Link to="/profile" className="dropdown-link">
              My Profile
            </Link>
          </li>
          <li>
            <Link to="/" className="dropdown-link" onClick={signOut}>
              Log Out
            </Link>
          </li>
        </ul>
      </div>
    );
  };

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
          {user ? (
            <div
              className="nav-link dropdown"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button className="cta-button"> Account ▼ </button>
              {isDropdownVisible && profileDropdown()}
            </div>
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
