import { useState, useMemo } from 'react'
import type { ExtendedUnit, UnitType, UnitClass, UnitStar } from '../models/units'

export interface SearchFilters {
  query: string
  types: UnitType[]
  stars: UnitStar[]
  classes: UnitClass[]
  onlyGlobal: boolean
  onlyJapan: boolean
  onlyRR: boolean
}

const EMPTY: SearchFilters = {
  query: '', types: [], stars: [], classes: [],
  onlyGlobal: false, onlyJapan: false, onlyRR: false,
}

export function useSearch(units: ExtendedUnit[]) {
  const [filters, setFilters] = useState<SearchFilters>(EMPTY)

  const results = useMemo(() => {
    let list = units

    if (filters.query) {
      const q = filters.query.toLowerCase().trim()
      const isId = /^#?\d+$/.test(q)
      if (isId) {
        const numId = Number(q.replace('#', ''))
        list = list.filter(u => u.id === numId)
      } else {
        list = list.filter(u => u.name.toLowerCase().includes(q))
      }
    }

    if (filters.types.length)
      list = list.filter(u => {
        const t = Array.isArray(u.type) ? u.type : [u.type]
        return filters.types.some(ft => t.includes(ft))
      })

    if (filters.stars.length)
      list = list.filter(u => filters.stars.includes(Number(u.stars) as UnitStar))

    if (filters.classes.length)
      list = list.filter(u => {
        const c = (Array.isArray(u.class) ? u.class : [u.class]).flat() as string[]
        return filters.classes.some(fc => c.includes(fc))
      })

    if (filters.onlyGlobal) list = list.filter(u => u.flags?.global)
    if (filters.onlyJapan)  list = list.filter(u => u.flags?.japOnly)
    if (filters.onlyRR)     list = list.filter(u => u.flags?.rr || u.flags?.lrr)

    return list
  }, [units, filters])

  return { filters, setFilters, results, reset: () => setFilters(EMPTY) }
}
