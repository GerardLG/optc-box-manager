import { describe, it, expect } from 'vitest'
import { normalizeRedirectTarget } from './githubPagesRedirect'

describe('normalizeRedirectTarget', () => {
  it('devuelve null para vacío', () => {
    expect(normalizeRedirectTarget(null)).toBeNull()
    expect(normalizeRedirectTarget('')).toBeNull()
  })

  it('decodifica y asegura barra inicial', () => {
    expect(normalizeRedirectTarget('%2Fdetail%2F5')).toBe('/detail/5')
    expect(normalizeRedirectTarget('/manage')).toBe('/manage')
  })
})
