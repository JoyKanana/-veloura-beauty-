import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import EditProduct from '../pages/EditProduct'
import { ProductProvider } from '../context/ProductContext'

const mockProducts = [
  {
    id: '1',
    name: 'Rose Dew Hydrating Serum',
    description: 'Lightweight hydrating serum',
    category: 'Skincare',
    price: 28,
    stock: 24,
    imageUrl: 'https://example.com/1.jpg',
  },
]

function renderEdit(path = '/products/1/edit') {
  return render(
    <ProductProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/products/:id/edit" element={<EditProduct />} />
          <Route path="/products/:id" element={<div>Product Details Page</div>} />
        </Routes>
      </MemoryRouter>
    </ProductProvider>,
  )
}

describe('EditProduct', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('loads existing product values', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockProducts,
    })

    renderEdit('/products/1/edit')

    expect(await screen.findByDisplayValue('Rose Dew Hydrating Serum')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Skincare')).toBeInTheDocument()
    expect(screen.getByDisplayValue('28')).toBeInTheDocument()
    expect(screen.getByDisplayValue('24')).toBeInTheDocument()
    expect(
      screen.getByDisplayValue('Lightweight hydrating serum'),
    ).toBeInTheDocument()
    expect(
      screen.getByDisplayValue('https://example.com/1.jpg'),
    ).toBeInTheDocument()
  })

  it('successfully updates a product', async () => {
    const user = userEvent.setup()
    const updatedProduct = {
      ...mockProducts[0],
      name: 'Rose Dew Serum Plus',
      price: 30,
      stock: 20,
    }

    globalThis.fetch = vi.fn((url, options) => {
      if (!options) {
        return Promise.resolve({
          ok: true,
          json: async () => mockProducts,
        })
      }
      if (options.method === 'PATCH') {
        return Promise.resolve({
          ok: true,
          json: async () => updatedProduct,
        })
      }
      return Promise.resolve({ ok: true, json: async () => [] })
    })

    renderEdit('/products/1/edit')
    await screen.findByDisplayValue('Rose Dew Hydrating Serum')

    const nameInput = screen.getByLabelText('Product Name')
    await user.clear(nameInput)
    await user.type(nameInput, 'Rose Dew Serum Plus')
    const priceInput = screen.getByLabelText('Price')
    await user.clear(priceInput)
    await user.type(priceInput, '30')
    const stockInput = screen.getByLabelText('Stock Quantity')
    await user.clear(stockInput)
    await user.type(stockInput, '20')

    await user.click(screen.getByRole('button', { name: 'Save Changes' }))

    expect(
      await screen.findByText('Product updated successfully. Redirecting...'),
    ).toBeInTheDocument()

    const patchCall = globalThis.fetch.mock.calls.find(
      (call) => call[1] && call[1].method === 'PATCH',
    )
    expect(patchCall).toBeTruthy()
    const sentBody = JSON.parse(patchCall[1].body)
    expect(sentBody.name).toBe('Rose Dew Serum Plus')
    expect(sentBody.price).toBe(30)
    expect(sentBody.stock).toBe(20)

    expect(await screen.findByText('Product Details Page')).toBeInTheDocument()
  })

  it('handles update errors', async () => {
    const user = userEvent.setup()

    globalThis.fetch = vi.fn((url, options) => {
      if (!options) {
        return Promise.resolve({
          ok: true,
          json: async () => mockProducts,
        })
      }
      if (options.method === 'PATCH') {
        return Promise.resolve({
          ok: false,
          status: 500,
          json: async () => ({}),
        })
      }
      return Promise.resolve({ ok: true, json: async () => [] })
    })

    renderEdit('/products/1/edit')
    await screen.findByDisplayValue('Rose Dew Hydrating Serum')

    await user.click(screen.getByRole('button', { name: 'Save Changes' }))

    expect(
      await screen.findByText('Request failed with status 500'),
    ).toBeInTheDocument()
    expect(screen.queryByText('Product Details Page')).not.toBeInTheDocument()
  })

  it('handles missing product IDs', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockProducts,
    })

    renderEdit('/products/999/edit')

    expect(await screen.findByText('Product not found.')).toBeInTheDocument()
  })
})
