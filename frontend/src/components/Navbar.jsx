import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        CareerPilot AI
      </Link>

      <div className="navbar-links">
        <Link to="/">Home</Link>

        <a href="/#features">
          Features
        </a>

        <Link to="/jobs">
          Jobs
        </Link>

        <Link to="/cover-letter">
          Cover Letter
        </Link>

        <a href="/#about">
          About
        </a>

        <button
          type="button"
          className="navbar-login-button"
        >
          Login
        </button>
      </div>
    </nav>
  );
}

export default Navbar;