import { Link } from 'react-router-dom'
import { useProductContext } from '../context/ProductContext'
import ProductCard from '../components/ProductCard'

function Dashboard() {
  const { products, loading, error } = useProductContext()

  const totalProducts = products.length
  const inStockCount = products.filter((product) => Number(product.stock) > 0).length
  const outOfStockCount = products.filter(
    (product) => Number(product.stock) <= 0,
  ).length
  const recentProducts = products.slice(-4).reverse()

  return (
    <section className="page-section">
      <div className="page-header">
        <h1>Welcome to Veloura Beauty</h1>
        <p className="muted">
          Manage your beauty and skincare catalog from this admin dashboard.
        </p>
      </div>

      {loading && <p className="muted">Loading dashboard data...</p>}
      {error && <p className="error-text">Error: {error}</p>}

      {!loading && !error && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <p className="stat-label">Total Products</p>
              <p className="stat-value">{totalProducts}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">In Stock</p>
              <p className="stat-value">{inStockCount}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Out of Stock</p>
              <p className="stat-value">{outOfStockCount}</p>
            </div>
          </div>

          <div className="quick-links">
            <h2>Quick Actions</h2>
            <div className="quick-links-actions">
              <Link to="/products" className="btn-link">
                View Products
              </Link>
              <Link to="/products/new" className="btn-link">
                Add Product
              </Link>
            </div>
          </div>

          <div className="recent-section">
            <h2>Recently Added Products</h2>
            {recentProducts.length === 0 ? (
              <div className="card">
                <p>No products available yet.</p>
              </div>
            ) : (
              <div className="products-grid">
                {recentProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  )
}

export default Dashboard
