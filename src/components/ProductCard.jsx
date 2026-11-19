import { Link } from 'react-router-dom'

function ProductCard({ product }) {
  const price = Number(product.price).toFixed(2)
  const inStock = Number(product.stock) > 0

  return (
    <article className="product-card">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="product-image"
      />
      <div className="product-card-body">
        <p className="product-category">{product.category}</p>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-meta">
          <span className="product-price">${price}</span>
          <span className={inStock ? 'stock-badge in-stock' : 'stock-badge out-of-stock'}>
            {inStock ? `In stock: ${product.stock}` : 'Out of stock'}
          </span>
        </div>
        <div className="product-actions">
          <Link to={`/products/${product.id}`} className="card-link">
            View Details
          </Link>
          <Link to={`/products/${product.id}/edit`} className="card-link secondary">
            Edit
          </Link>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
