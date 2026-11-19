import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Footer from '../components/Footer'

describe('Footer', () => {
  it('shows the Kenya contact details', () => {
    render(<Footer />)

    expect(screen.getByText('Serving customers in Kenya')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'kananaaajoy@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:kananaaajoy@gmail.com',
    )
    expect(screen.getByRole('link', { name: '0741190136' })).toHaveAttribute(
      'href',
      'tel:+254741190136',
    )
  })
})
