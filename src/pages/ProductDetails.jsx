import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useProductContext } from '../context/ProductContext'
import formatCurrency from '../utils/formatCurrency'

function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products, loading, error, deleteProduct } = useProductContext()
  const [deleteError, setDeleteError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const product = products.find((item) => String(item.id) === String(id))

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this product?',
    )

    if (!confirmed) {
      return
    }

    setIsDeleting(true)
    setDeleteError('')

    try {
      await deleteProduct(id)
      navigate('/products')
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete product.')
      setIsDeleting(false)
    }
  }

  return (
    <section className="page-section">
      <div className="page-header">
        <h1>Product Details</h1>
        <p className="muted">View and manage product information.</p>
      </div>

      {loading && <p className="muted">Loading product...</p>}

      {!loading && error && (
        <div className="card">
          <p className="error-text">Error: {error}</p>
        </div>
      )}

      {!loading && !error && !product && (
        <div className="card">
          <p className="error-text">Product not found.</p>
          <Link to="/products" className="btn-link">
            Back to Products
          </Link>
        </div>
      )}

      {!loading && !error && product && (
        <div className="card details-card">
          {deleteError && <p className="error-text">{deleteError}</p>}
          <div className="details-layout">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="details-image"
            />
            <div className="details-info">
              <p className="product-category">{product.category}</p>
              <h2>{product.name}</h2>
              <p className="details-price">{formatCurrency(product.price)}</p>
              <p>
                <strong>Stock:</strong>{' '}
                {Number(product.stock) > 0
                  ? `${product.stock} in stock`
                  : 'Out of stock'}
              </p>
              <p className="details-description">{product.description}</p>

              <div className="details-actions">
                <Link to={`/products/${product.id}/edit`} className="btn-link">
                  Edit
                </Link>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default ProductDetails
