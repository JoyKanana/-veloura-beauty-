import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Products from '../pages/Products'
import { ProductProvider } from '../context/ProductContext'

const mockProducts = [
  {
    id: '1',
    name: 'Rose Dew Hydrating Serum',
    description: 'Serum',
    category: 'Skincare',
    price: 28,
    stock: 24,
    imageUrl: 'https://example.com/1.jpg',
  },
  {
    id: '2',
    name: 'Velvet Matte Lipstick',
    description: 'Lipstick',
    category: 'Makeup',
    price: 18.5,
    stock: 40,
    imageUrl: 'https://example.com/2.jpg',
  },
  {
    id: '3',
    name: 'Citrus Glow Cleanser',
    description: 'Cleanser',
    category: 'Skincare',
    price: 22,
    stock: 15,
    imageUrl: 'https://example.com/3.jpg',
  },
  {
    id: '4',
    name: 'Argan Silk Hair Oil',
    description: 'Oil',
    category: 'Haircare',
    price: 24.99,
    stock: 0,
    imageUrl: 'https://example.com/4.jpg',
  },
]

function renderProducts() {
  return render(
    <ProductProvider>
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    </ProductProvider>,
  )
}

describe('Products page', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('displays products', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockProducts,
    })

    renderProducts()

    expect(await screen.findByText('Rose Dew Hydrating Serum')).toBeInTheDocument()
    expect(screen.getByText('Velvet Matte Lipstick')).toBeInTheDocument()
    expect(screen.getByText('Citrus Glow Cleanser')).toBeInTheDocument()
    expect(screen.getByText('Argan Silk Hair Oil')).toBeInTheDocument()
    expect(screen.getByText('KSh 28')).toBeInTheDocument()
    expect(screen.getByText('KSh 18.5')).toBeInTheDocument()
  })

  it('searches dynamically by product name', async () => {
    const user = userEvent.setup()
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockProducts,
    })

    renderProducts()
    await screen.findByText('Rose Dew Hydrating Serum')

    await user.type(screen.getByLabelText('Search products'), 'rose')

    expect(screen.getByText('Rose Dew Hydrating Serum')).toBeInTheDocument()
    expect(screen.queryByText('Velvet Matte Lipstick')).not.toBeInTheDocument()
    expect(screen.queryByText('Argan Silk Hair Oil')).not.toBeInTheDocument()
  })

  it('filters by category', async () => {
    const user = userEvent.setup()
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockProducts,
    })

    renderProducts()
    await screen.findByText('Rose Dew Hydrating Serum')

    await user.selectOptions(screen.getByLabelText('Category'), 'Skincare')

    expect(screen.getByText('Rose Dew Hydrating Serum')).toBeInTheDocument()
    expect(screen.getByText('Citrus Glow Cleanser')).toBeInTheDocument()
    expect(screen.queryByText('Velvet Matte Lipstick')).not.toBeInTheDocument()
    expect(screen.queryByText('Argan Silk Hair Oil')).not.toBeInTheDocument()
  })

  it('filters by stock status', async () => {
    const user = userEvent.setup()
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockProducts,
    })

    renderProducts()
    await screen.findByText('Rose Dew Hydrating Serum')

    await user.selectOptions(screen.getByLabelText('Stock Status'), 'out-of-stock')

    expect(screen.getByText('Argan Silk Hair Oil')).toBeInTheDocument()
    expect(screen.queryByText('Rose Dew Hydrating Serum')).not.toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText('Stock Status'), 'in-stock')
    expect(screen.getByText('Rose Dew Hydrating Serum')).toBeInTheDocument()
    expect(screen.queryByText('Argan Silk Hair Oil')).not.toBeInTheDocument()
  })

  it('clears filters', async () => {
    const user = userEvent.setup()
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockProducts,
    })

    renderProducts()
    await screen.findByText('Rose Dew Hydrating Serum')

    await user.type(screen.getByLabelText('Search products'), 'rose')
    await user.selectOptions(screen.getByLabelText('Category'), 'Skincare')

    expect(screen.queryByText('Velvet Matte Lipstick')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear Filters' }))

    expect(screen.getByText('Rose Dew Hydrating Serum')).toBeInTheDocument()
    expect(screen.getByText('Velvet Matte Lipstick')).toBeInTheDocument()
    expect(screen.getByText('Citrus Glow Cleanser')).toBeInTheDocument()
    expect(screen.getByText('Argan Silk Hair Oil')).toBeInTheDocument()
    expect(screen.getByLabelText('Search products')).toHaveValue('')
    expect(screen.getByLabelText('Category')).toHaveValue('all')
    expect(screen.getByLabelText('Stock Status')).toHaveValue('all')
  })

  it('displays an appropriate empty/no-results state', async () => {
    const user = userEvent.setup()
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockProducts,
    })

    renderProducts()
    await screen.findByText('Rose Dew Hydrating Serum')

    await user.type(screen.getByLabelText('Search products'), 'zzzznomatch')

    expect(
      await screen.findByText('No products match your filters.'),
    ).toBeInTheDocument()
  })
})
