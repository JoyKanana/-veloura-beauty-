import { useId, useRef, useState } from 'react'

const emptyValues = {
  name: '',
  category: '',
  price: '',
  stock: '',
  description: '',
  imageUrl: '',
}

function ProductForm({
  initialValues = emptyValues,
  onSubmit,
  submitLabel = 'Save Product',
  isSubmitting = false,
}) {
  const [formValues, setFormValues] = useState({
    ...emptyValues,
    ...initialValues,
  })
  const [errors, setErrors] = useState({})
  const nameRef = useRef(null)
  const formId = useId()

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors = {}

    if (!formValues.name.trim()) {
      newErrors.name = 'Product name is required.'
    }
    if (!formValues.category.trim()) {
      newErrors.category = 'Category is required.'
    }
    if (formValues.price === '' || formValues.price === null) {
      newErrors.price = 'Price is required.'
    } else if (Number.isNaN(Number(formValues.price)) || Number(formValues.price) <= 0) {
      newErrors.price = 'Price must be greater than zero.'
    }
    if (formValues.stock === '' || formValues.stock === null) {
      newErrors.stock = 'Stock quantity is required.'
    } else if (
      Number.isNaN(Number(formValues.stock)) ||
      Number(formValues.stock) < 0
    ) {
      newErrors.stock = 'Stock must be zero or greater.'
    }
    if (!formValues.description.trim()) {
      newErrors.description = 'Description is required.'
    }
    if (!formValues.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required.'
    }

    return newErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      if (validationErrors.name && nameRef.current) {
        nameRef.current.focus()
      }
      return
    }

    const productData = {
      name: formValues.name.trim(),
      category: formValues.category.trim(),
      price: Number(formValues.price),
      stock: Number(formValues.stock),
      description: formValues.description.trim(),
      imageUrl: formValues.imageUrl.trim(),
    }

    await onSubmit(productData)
  }

  return (
    <form className="product-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor={`${formId}-name`}>Product Name</label>
          <input
            ref={nameRef}
            id={`${formId}-name`}
            name="name"
            type="text"
            value={formValues.name}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label htmlFor={`${formId}-category`}>Category</label>
          <input
            id={`${formId}-category`}
            name="category"
            type="text"
            value={formValues.category}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.category && <p className="error-text">{errors.category}</p>}
        </div>

        <div className="form-group">
          <label htmlFor={`${formId}-price`}>Price</label>
          <input
            id={`${formId}-price`}
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={formValues.price}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.price && <p className="error-text">{errors.price}</p>}
        </div>

        <div className="form-group">
          <label htmlFor={`${formId}-stock`}>Stock Quantity</label>
          <input
            id={`${formId}-stock`}
            name="stock"
            type="number"
            step="1"
            min="0"
            value={formValues.stock}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.stock && <p className="error-text">{errors.stock}</p>}
        </div>

        <div className="form-group form-group-full">
          <label htmlFor={`${formId}-imageUrl`}>Image URL</label>
          <input
            id={`${formId}-imageUrl`}
            name="imageUrl"
            type="url"
            value={formValues.imageUrl}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.imageUrl && <p className="error-text">{errors.imageUrl}</p>}
        </div>

        <div className="form-group form-group-full">
          <label htmlFor={`${formId}-description`}>Description</label>
          <textarea
            id={`${formId}-description`}
            name="description"
            rows="4"
            value={formValues.description}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.description && (
            <p className="error-text">{errors.description}</p>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}

export default ProductForm
