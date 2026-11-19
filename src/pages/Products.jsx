import { useState } from 'react'
import { useProductContext } from '../context/ProductContext'
import ProductCard from '../components/ProductCard'
import SearchBar from '../components/SearchBar'

function Products() {
  const { products, loading, error } = useProductContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')

  const categories = Array.from(
    new Set(products.map((product) => product.category)),
  ).sort()

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    const matchesCategory =
      categoryFilter === 'all' || product.category === categoryFilter

    const isInStock = Number(product.stock) > 0
    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'in-stock' && isInStock) ||
      (stockFilter === 'out-of-stock' && !isInStock)

    return matchesSearch && matchesCategory && matchesStock
  })

  const hasActiveFilters =
    searchTerm !== '' || categoryFilter !== 'all' || stockFilter !== 'all'

  const clearFilters = () => {
    setSearchTerm('')
    setCategoryFilter('all')
    setStockFilter('all')
  }

  return (
    <section className="page-section">
      <div className="page-header">
        <h1>Products</h1>
        <p className="muted">Browse and manage your product catalog.</p>
      </div>

      {loading && <p className="muted">Loading products...</p>}

      {!loading && error && (
        <div className="card">
          <p className="error-text">Error: {error}</p>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="card">
          <p>No products found.</p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <div className="filters-bar card">
            <div className="filters-grid">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                label="Search products"
                placeholder="Search by product name"
              />

              <div className="filter-group">
                <label htmlFor="category-filter" className="filter-label">
                  Category
                </label>
                <select
                  id="category-filter"
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="stock-filter" className="filter-label">
                  Stock Status
                </label>
                <select
                  id="stock-filter"
                  value={stockFilter}
                  onChange={(event) => setStockFilter(event.target.value)}
                >
                  <option value="all">All</option>
                  <option value="in-stock">In Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="filters-actions">
                <button type="button" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="card">
              <p>No products match your filters.</p>
              <button type="button" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default Products
