/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react'
import useProducts from '../hooks/useProducts'

const ProductContext = createContext(null)

export function ProductProvider({ children }) {
  const productState = useProducts()

  return (
    <ProductContext.Provider value={productState}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProductContext() {
  const context = useContext(ProductContext)

  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider')
  }

  return context
}
