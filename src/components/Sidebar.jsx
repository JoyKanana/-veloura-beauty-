import { NavLink } from 'react-router-dom'

function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Sidebar">
      <nav className="sidebar-nav">
        <NavLink to="/" end className="sidebar-link">
          Dashboard
        </NavLink>
        <NavLink to="/products" end className="sidebar-link">
          Products
        </NavLink>
        <NavLink to="/products/new" className="sidebar-link">
          Add Product
        </NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar