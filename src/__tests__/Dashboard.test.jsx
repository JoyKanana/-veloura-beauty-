import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Dashboard from '../pages/Dashboard'
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
  {
    id: '5',
    name: 'Chamomile Body Lotion',
    description: 'Lotion',
    category: 'Body Care',
    price: 16,
    stock: 32,
    imageUrl: 'https://example.com/5.jpg',
  },
  {
    id: '6',
    name: 'Mineral Sunscreen SPF 50',
    description: 'Sunscreen',
    category: 'Skincare',
    price: 30,
    stock: 18,
    imageUrl: 'https://example.com/6.jpg',
  },
  {
    id: '7',
    name: 'Peony Bloom Eau de Parfum',
    description: 'Perfume',
    category: 'Fragrance',
    price: 54,
    stock: 9,
    imageUrl: 'https://example.com/7.jpg',
  },
  {
    id: '8',
    name: 'Overnight Repair Eye Cream',
    description: 'Eye cream',
    category: 'Skincare',
    price: 34,
    stock: 0,
    imageUrl: 'https://example.com/8.jpg',
  },
]

function renderDashboard() {
  return render(
    <ProductProvider>
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    </ProductProvider>,
  )
}

describe('Dashboard', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('displays correct product statistics', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockProducts,
    })

    renderDashboard()

    expect(await screen.findByText('Total Products')).toBeInTheDocument()
    expect(screen.getByText('Total Products').closest('.stat-card')).toHaveTextContent('8')
    expect(screen.getByText('In Stock').closest('.stat-card')).toHaveTextContent('6')
    expect(screen.getByText('Out of Stock').closest('.stat-card')).toHaveTextContent('2')
  })

  it('displays the latest four products', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockProducts,
    })

    renderDashboard()

    await screen.findByText('Welcome to Veloura Beauty')

    expect(screen.getByText('Overnight Repair Eye Cream')).toBeInTheDocument()
    expect(screen.getByText('Peony Bloom Eau de Parfum')).toBeInTheDocument()
    expect(screen.getByText('Mineral Sunscreen SPF 50')).toBeInTheDocument()
    expect(screen.getByText('Chamomile Body Lotion')).toBeInTheDocument()

    expect(
      screen.queryByText('Rose Dew Hydrating Serum'),
    ).not.toBeInTheDocument()
  })

  it('shows loading state', () => {
    globalThis.fetch = vi.fn(() => new Promise(() => {}))

    renderDashboard()

    expect(screen.getByText('Loading dashboard data...')).toBeInTheDocument()
  })

  it('shows error state', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    })

    renderDashboard()

    expect(
      await screen.findByText('Error: Request failed with status 500'),
    ).toBeInTheDocument()
  })
})
