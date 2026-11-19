import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import ProductForm from '../components/ProductForm'

describe('ProductForm', () => {
  it('renders all fields', () => {
    render(<ProductForm onSubmit={vi.fn()} />)

    expect(screen.getByLabelText('Product Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Category')).toBeInTheDocument()
    expect(screen.getByLabelText('Price')).toBeInTheDocument()
    expect(screen.getByLabelText('Stock Quantity')).toBeInTheDocument()
    expect(screen.getByLabelText('Image URL')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Save Product' }),
    ).toBeInTheDocument()
  })

  it('shows validation errors for empty required fields', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ProductForm onSubmit={onSubmit} />)

    await user.click(screen.getByRole('button', { name: 'Save Product' }))

    expect(
      await screen.findByText('Product name is required.'),
    ).toBeInTheDocument()
    expect(screen.getByText('Category is required.')).toBeInTheDocument()
    expect(screen.getByText('Price is required.')).toBeInTheDocument()
    expect(
      screen.getByText('Stock quantity is required.'),
    ).toBeInTheDocument()
    expect(screen.getByText('Description is required.')).toBeInTheDocument()
    expect(screen.getByText('Image URL is required.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('rejects a price of zero or below', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ProductForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Product Name'), 'Rose Serum')
    await user.type(screen.getByLabelText('Category'), 'Skincare')
    await user.type(screen.getByLabelText('Price'), '0')
    await user.type(screen.getByLabelText('Stock Quantity'), '5')
    await user.type(
      screen.getByLabelText('Image URL'),
      'https://example.com/image.jpg',
    )
    await user.type(screen.getByLabelText('Description'), 'A nice serum')
    await user.click(screen.getByRole('button', { name: 'Save Product' }))

    expect(
      await screen.findByText('Price must be greater than zero.'),
    ).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('rejects negative stock', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ProductForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Product Name'), 'Rose Serum')
    await user.type(screen.getByLabelText('Category'), 'Skincare')
    await user.type(screen.getByLabelText('Price'), '10')
    await user.type(screen.getByLabelText('Stock Quantity'), '-1')
    await user.type(
      screen.getByLabelText('Image URL'),
      'https://example.com/image.jpg',
    )
    await user.type(screen.getByLabelText('Description'), 'A nice serum')
    await user.click(screen.getByRole('button', { name: 'Save Product' }))

    expect(
      await screen.findByText('Stock must be zero or greater.'),
    ).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits valid product data', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<ProductForm onSubmit={onSubmit} submitLabel="Add Product" />)

    await user.type(screen.getByLabelText('Product Name'), '  Rose Serum  ')
    await user.type(screen.getByLabelText('Category'), '  Skincare  ')
    await user.type(screen.getByLabelText('Price'), '25.5')
    await user.type(screen.getByLabelText('Stock Quantity'), '10')
    await user.type(
      screen.getByLabelText('Image URL'),
      '  https://example.com/image.jpg  ',
    )
    await user.type(
      screen.getByLabelText('Description'),
      '  Hydrating serum  ',
    )
    await user.click(screen.getByRole('button', { name: 'Add Product' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Rose Serum',
      category: 'Skincare',
      price: 25.5,
      stock: 10,
      description: 'Hydrating serum',
      imageUrl: 'https://example.com/image.jpg',
    })
  })

  it('sends price and stock as numbers', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<ProductForm onSubmit={onSubmit} submitLabel="Add Product" />)

    await user.type(screen.getByLabelText('Product Name'), 'Lip Balm')
    await user.type(screen.getByLabelText('Category'), 'Makeup')
    await user.type(screen.getByLabelText('Price'), '12.99')
    await user.type(screen.getByLabelText('Stock Quantity'), '3')
    await user.type(
      screen.getByLabelText('Image URL'),
      'https://example.com/lip.jpg',
    )
    await user.type(screen.getByLabelText('Description'), 'Soft lips')
    await user.click(screen.getByRole('button', { name: 'Add Product' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    const submittedData = onSubmit.mock.calls[0][0]
    expect(typeof submittedData.price).toBe('number')
    expect(typeof submittedData.stock).toBe('number')
    expect(submittedData.price).toBe(12.99)
    expect(submittedData.stock).toBe(3)
  })
})
