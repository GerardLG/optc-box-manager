import { useState, useMemo } from 'react'
import type { ExtendedUnit, UnitType } from '../models/units'
import { normalizeType } from '../services/unitsLoader'

export interface SearchFilters {
  query:    string
  types:    UnitType[]
  classes:  string[]
  minStars: number
  sortBy:   'id' | 'name' | 'atk' | 'hp' | 'rcv' | 'cost'
  sortDir:  'asc' | 'desc'
}

const DEFAULT: SearchFilters = {
  query:    '',
  types:    [],
  classes:  [],
  minStars: 0,
  sortBy:   'id',
  sortDir:  'asc',
}

export function useSearch(units: ExtendedUnit[]) {
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT)

  const results = useMemo(() => {
    let list = units

    if (filters.query.trim()) {
      const q = filters.query.toLowerCase()
      list = list.filter(u =>
        u.name.toLowerCase().includes(q) ||
        (u.aliases ?? []).some(a => a.toLowerCase().includes(q)) ||
        String(u.id).includes(q)
      )
    }

    if (filters.types.length) {
      list = list.filter(u => {
        // normalizeType maneja string | array | objeto
        const unitTypes = normalizeType(u.type)
        return filters.types.some(selected => unitTypes.includes(selected))
      })
    }

    if (filters.classes.length) {
      list = list.filter(u => {
        const classes = (Array.isArray(u.class)
          ? (u.class as string[]).flat()
          : [String(u.class)])
        return filters.classes.some(c => classes.includes(c))
      })
    }

    if (filters.minStars > 0) {
      list = list.filter(u => Number(u.stars) >= filters.minStars)
    }

    list = [...list].sort((a, b) => {
      let diff = 0
      if (filters.sortBy === 'id')   diff = a.id - b.id
      if (filters.sortBy === 'name') diff = a.name.localeCompare(b.name)
      if (filters.sortBy === 'atk')  diff = a.maxATK - b.maxATK
      if (filters.sortBy === 'hp')   diff = a.maxHP  - b.maxHP
      if (filters.sortBy === 'rcv')  diff = a.maxRCV - b.maxRCV
      if (filters.sortBy === 'cost') diff = a.cost   - b.cost
      return filters.sortDir === 'asc' ? diff : -diff
    })

    return list
  }, [units, filters])

  const reset = () => setFilters(DEFAULT)

  return { filters, setFilters, results, reset }
}
