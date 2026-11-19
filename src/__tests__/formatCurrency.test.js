import { describe, expect, it } from 'vitest'
import formatCurrency from '../utils/formatCurrency'

describe('formatCurrency', () => {
  it('formats Kenyan shillings with Kenyan number grouping', () => {
    expect(formatCurrency(3640)).toBe('KSh 3,640')
    expect(formatCurrency(2405)).toBe('KSh 2,405')
  })

  it('keeps fractional shillings when present', () => {
    expect(formatCurrency(12.5)).toBe('KSh 12.5')
  })
})
