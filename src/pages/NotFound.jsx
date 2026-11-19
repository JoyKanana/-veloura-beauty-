import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="page-section">
      <h1>Page Not Found</h1>
      <p className="muted">The page you are looking for does not exist.</p>
      <div className="card">
        <Link to="/" className="btn-link">
          Return to Dashboard
        </Link>
      </div>
    </section>
  )
}

export default NotFound