import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import ProductDetails from '../pages/ProductDetails'
import { ProductProvider } from '../context/ProductContext'

const mockProducts = [
  {
    id: '1',
    name: 'Rose Dew Hydrating Serum',
    description: 'Lightweight hydrating serum',
    category: 'Skincare',
    price: 3640,
    stock: 24,
    imageUrl: 'https://example.com/1.jpg',
  },
]

function renderDetails(path = '/products/1') {
  return render(
    <ProductProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/products" element={<div>Products List Page</div>} />
        </Routes>
      </MemoryRouter>
    </ProductProvider>,
  )
}

describe('ProductDetails', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('displays the selected product', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockProducts,
    })

    renderDetails('/products/1')

    expect(
      await screen.findByRole('heading', { name: 'Rose Dew Hydrating Serum' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Skincare')).toBeInTheDocument()
    expect(screen.getByText('KSh 3,640')).toBeInTheDocument()
    expect(screen.getByText('24 in stock')).toBeInTheDocument()
    expect(
      screen.getByText('Lightweight hydrating serum'),
    ).toBeInTheDocument()
  })

  it('handles a missing product', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockProducts,
    })

    renderDetails('/products/999')

    expect(await screen.findByText('Product not found.')).toBeInTheDocument()
  })

  it('deletes a product after confirmation', async () => {
    const user = userEvent.setup()
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

    globalThis.fetch = vi.fn((url, options) => {
      if (!options) {
        return Promise.resolve({
          ok: true,
          json: async () => mockProducts,
        })
      }
      if (options.method === 'DELETE') {
        return Promise.resolve({ ok: true, status: 200, json: async () => ({}) })
      }
      return Promise.resolve({ ok: true, json: async () => [] })
    })

    renderDetails('/products/1')
    await screen.findByRole('heading', { name: 'Rose Dew Hydrating Serum' })

    await user.click(screen.getByRole('button', { name: 'Delete' }))

    expect(confirmSpy).toHaveBeenCalled()
    expect(await screen.findByText('Products List Page')).toBeInTheDocument()

    const deleteCall = globalThis.fetch.mock.calls.find(
      (call) => call[1] && call[1].method === 'DELETE',
    )
    expect(deleteCall).toBeTruthy()
  })

  it('handles deletion errors', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    globalThis.fetch = vi.fn((url, options) => {
      if (!options) {
        return Promise.resolve({
          ok: true,
          json: async () => mockProducts,
        })
      }
      if (options.method === 'DELETE') {
        return Promise.resolve({
          ok: false,
          status: 500,
          json: async () => ({}),
        })
      }
      return Promise.resolve({ ok: true, json: async () => [] })
    })

    renderDetails('/products/1')
    await screen.findByRole('heading', { name: 'Rose Dew Hydrating Serum' })

    await user.click(screen.getByRole('button', { name: 'Delete' }))

    expect(
      await screen.findByText('Request failed with status 500'),
    ).toBeInTheDocument()
    expect(screen.queryByText('Products List Page')).not.toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Rose Dew Hydrating Serum' }),
    ).toBeInTheDocument()
  })
})
