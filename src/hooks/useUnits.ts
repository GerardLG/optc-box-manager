import { useState, useEffect, useRef } from 'react'
import type { ExtendedUnit } from '../models/units'
import { fetchAllUnits } from '../services/unitsLoader'

interface State {
  units: ExtendedUnit[]
  isLoading: boolean
  loadingProgress: number
  error: string | null
}

// Module-level cache so units are only fetched once per session
let _cache: ExtendedUnit[] | null = null
let _promise: Promise<ExtendedUnit[]> | null = null

export function useUnits() {
  const [state, setState] = useState<State>({
    units: _cache ?? [],
    isLoading: !_cache,
    loadingProgress: _cache ? 100 : 0,
    error: null,
  })

  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    if (_cache) return

    if (!_promise) {
      _promise = fetchAllUnits(pct => {
        if (mounted.current) setState(s => ({ ...s, loadingProgress: pct }))
      })
    }

    _promise
      .then(units => {
        _cache = units
        if (mounted.current) setState({ units, isLoading: false, loadingProgress: 100, error: null })
      })
      .catch(err => {
        _promise = null
        if (mounted.current)
          setState(s => ({ ...s, isLoading: false, error: String(err) }))
      })

    return () => { mounted.current = false }
  }, [])

  return state
}
