import { describe, it, expect } from 'vitest'
import { importBoxJSON } from './storage'

describe('importBoxJSON', () => {
  it('acepta un array JSON válido', () => {
    const raw = JSON.stringify([])
    expect(importBoxJSON(raw)).toEqual([])
  })

  it('rechaza JSON que no sea array', () => {
    expect(() => importBoxJSON('{}')).toThrow(/array válido/)
  })
})
