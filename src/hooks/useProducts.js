import { useCallback, useEffect, useState } from 'react'
import fallbackData from '../../db.json'

const API_BASE_URL = 'http://localhost:3001'

function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const handleResponse = async (response) => {
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    if (response.status === 204) {
      return null
    }

    return response.json()
  }

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/products`)
      const data = await handleResponse(response)
      setProducts(data)
    } catch (err) {
      if (err instanceof TypeError) {
        setProducts(fallbackData.products || [])
      } else {
        setError(err.message || 'Failed to fetch products')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let isActive = true

    const loadProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products`)
        const data = await handleResponse(response)
        if (isActive) {
          setProducts(data)
        }
      } catch (err) {
        if (isActive) {
          if (err instanceof TypeError) {
            setProducts(fallbackData.products || [])
          } else {
            setError(err.message || 'Failed to fetch products')
          }
        }
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      isActive = false
    }
  }, [])

  const addProduct = async (productData) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    })

    const createdProduct = await handleResponse(response)
    setProducts((prevProducts) => [...prevProducts, createdProduct])
    return createdProduct
  }

  const updateProduct = async (id, updates) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    })

    const updatedProduct = await handleResponse(response)
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? updatedProduct : product,
      ),
    )
    return updatedProduct
  }

  const deleteProduct = async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
    })

    await handleResponse(response)
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id),
    )
  }

  return {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  }
}

export default useProducts
