import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProductContext } from '../context/ProductContext'
import ProductForm from '../components/ProductForm'

function AddProduct() {
  const { addProduct } = useProductContext()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleAddProduct = async (productData) => {
    setIsSubmitting(true)
    setSubmitError('')
    setSuccessMessage('')

    try {
      await addProduct(productData)
      setSuccessMessage('Product added successfully. Redirecting...')
      setTimeout(() => {
        navigate('/products')
      }, 800)
    } catch (err) {
      setSubmitError(err.message || 'Failed to add product.')
      setIsSubmitting(false)
    }
  }

  return (
    <section className="page-section">
      <div className="page-header">
        <h1>Add Product</h1>
        <p className="muted">Create a new product for the Veloura Beauty catalog.</p>
      </div>

      <div className="card form-card">
        {submitError && <p className="error-text">{submitError}</p>}
        {successMessage && <p className="success-text">{successMessage}</p>}
        <ProductForm
          onSubmit={handleAddProduct}
          submitLabel="Add Product"
          isSubmitting={isSubmitting}
        />
      </div>
    </section>
  )
}

export default AddProduct
