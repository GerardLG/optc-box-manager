import { describe, it, expect } from 'vitest'
import { getBaseTypes, getFilterTypes } from './unitsLoader'

describe('getBaseTypes', () => {
  it('normaliza string a un elemento', () => {
    expect(getBaseTypes('STR')).toEqual(['STR'])
  })

  it('aplana arrays de tipos', () => {
    expect(getBaseTypes(['STR', 'PSY'])).toEqual(['STR', 'PSY'])
  })

  it('devuelve vacío para nullish', () => {
    expect(getBaseTypes(null)).toEqual([])
    expect(getBaseTypes(undefined)).toEqual([])
  })
})

describe('getFilterTypes', () => {
  it('marca DUAL cuando hay dos tipos en array', () => {
    const t = getFilterTypes(['DEX', 'QCK'], 'Some Dual Unit')
    expect(t).toContain('DEX')
    expect(t).toContain('QCK')
    expect(t).toContain('DUAL')
    expect(t).not.toContain('VS')
  })

  it('marca VS cuando el nombre contiene " vs "', () => {
    const t = getFilterTypes(['STR', 'PSY'], 'Luffy VS Kaido')
    expect(t).toContain('VS')
    expect(t).toContain('STR')
    expect(t).toContain('PSY')
  })
})
