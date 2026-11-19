import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useProductContext } from '../context/ProductContext'
import ProductForm from '../components/ProductForm'

function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products, loading, error, updateProduct } = useProductContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const product = products.find((item) => String(item.id) === String(id))

  const handleUpdateProduct = async (productData) => {
    setIsSubmitting(true)
    setSubmitError('')
    setSuccessMessage('')

    try {
      await updateProduct(id, productData)
      setSuccessMessage('Product updated successfully. Redirecting...')
      setTimeout(() => {
        navigate(`/products/${id}`)
      }, 800)
    } catch (err) {
      setSubmitError(err.message || 'Failed to update product.')
      setIsSubmitting(false)
    }
  }

  return (
    <section className="page-section">
      <div className="page-header">
        <h1>Edit Product</h1>
        <p className="muted">Update the details for this product.</p>
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
        <div className="card form-card">
          {submitError && <p className="error-text">{submitError}</p>}
          {successMessage && <p className="success-text">{successMessage}</p>}
          <ProductForm
            key={product.id}
            initialValues={{
              name: product.name,
              category: product.category,
              price: product.price,
              stock: product.stock,
              description: product.description,
              imageUrl: product.imageUrl,
            }}
            onSubmit={handleUpdateProduct}
            submitLabel="Save Changes"
            isSubmitting={isSubmitting}
          />
        </div>
      )}
    </section>
  )
}

export default EditProduct
