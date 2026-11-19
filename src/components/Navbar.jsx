import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand-link">
          Veloura Beauty
        </Link>
        <span className="brand-subtitle">Admin Dashboard</span>
      </div>
      <nav className="navbar-links" aria-label="Primary">
        <Link to="/" className="navbar-link">
          Dashboard
        </Link>
        <Link to="/products" className="navbar-link">
          Products
        </Link>
      </nav>
    </header>
  )
}

export default Navbar