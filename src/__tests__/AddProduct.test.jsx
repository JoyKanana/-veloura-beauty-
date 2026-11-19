import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import AddProduct from '../pages/AddProduct'
import { ProductProvider } from '../context/ProductContext'

function renderAddProduct() {
  return render(
    <ProductProvider>
      <MemoryRouter initialEntries={['/products/new']}>
        <Routes>
          <Route path="/products/new" element={<AddProduct />} />
          <Route path="/products" element={<div>Products List Page</div>} />
        </Routes>
      </MemoryRouter>
    </ProductProvider>,
  )
}

async function fillValidForm(user) {
  await user.type(screen.getByLabelText('Product Name'), 'New Glow Serum')
  await user.type(screen.getByLabelText('Category'), 'Skincare')
  await user.type(screen.getByLabelText('Price (KSh)'), '29.99')
  await user.type(screen.getByLabelText('Stock Quantity'), '12')
  await user.type(
    screen.getByLabelText('Image URL'),
    'https://example.com/new.jpg',
  )
  await user.type(screen.getByLabelText('Description'), 'Brightening serum')
}

describe('AddProduct', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('successfully creates a product', async () => {
    const user = userEvent.setup()
    const createdProduct = {
      id: '99',
      name: 'New Glow Serum',
      category: 'Skincare',
      price: 29.99,
      stock: 12,
      imageUrl: 'https://example.com/new.jpg',
      description: 'Brightening serum',
    }

    globalThis.fetch = vi.fn((url, options) => {
      if (!options) {
        return Promise.resolve({
          ok: true,
          json: async () => [],
        })
      }
      if (options.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: async () => createdProduct,
        })
      }
      return Promise.resolve({ ok: true, json: async () => [] })
    })

    renderAddProduct()
    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalled())

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: 'Add Product' }))

    expect(
      await screen.findByText('Product added successfully. Redirecting...'),
    ).toBeInTheDocument()

    const postCall = globalThis.fetch.mock.calls.find(
      (call) => call[1] && call[1].method === 'POST',
    )
    expect(postCall).toBeTruthy()
    const sentBody = JSON.parse(postCall[1].body)
    expect(sentBody.name).toBe('New Glow Serum')
    expect(sentBody.price).toBe(29.99)
    expect(sentBody.stock).toBe(12)

    expect(await screen.findByText('Products List Page')).toBeInTheDocument()
  })

  it('displays API errors when creation fails', async () => {
    const user = userEvent.setup()

    globalThis.fetch = vi.fn((url, options) => {
      if (!options) {
        return Promise.resolve({
          ok: true,
          json: async () => [],
        })
      }
      if (options.method === 'POST') {
        return Promise.resolve({
          ok: false,
          status: 500,
          json: async () => ({}),
        })
      }
      return Promise.resolve({ ok: true, json: async () => [] })
    })

    renderAddProduct()
    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalled())

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: 'Add Product' }))

    expect(
      await screen.findByText('Request failed with status 500'),
    ).toBeInTheDocument()
    expect(screen.queryByText('Products List Page')).not.toBeInTheDocument()
  })
})
