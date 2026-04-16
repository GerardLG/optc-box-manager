import { useState, useEffect, useRef, useCallback } from 'react'
import type { ExtendedUnit } from '../models/units'
import { fetchAllUnits } from '../services/unitsLoader'
import { setUnitsCache } from '../services/unitsCache'

interface State {
  units: ExtendedUnit[]
  isLoading: boolean
  loadingProgress: number
  error: string | null
}

let _cache: ExtendedUnit[] | null = null
let _promise: Promise<ExtendedUnit[]> | null = null

function resetUnitsFetch() {
  _cache = null
  _promise = null
}

export function useUnits() {
  const [fetchVersion, setFetchVersion] = useState(0)
  const [state, setState] = useState<State>(() => ({
    units: _cache ?? [],
    isLoading: !_cache,
    loadingProgress: _cache ? 100 : 0,
    error: null,
  }))

  const mounted = useRef(true)

  const retry = useCallback(() => {
    resetUnitsFetch()
    setFetchVersion(v => v + 1)
  }, [])

  useEffect(() => {
    mounted.current = true

    if (_cache) {
      setUnitsCache(_cache)
      setState({
        units: _cache,
        isLoading: false,
        loadingProgress: 100,
        error: null,
      })
      return () => { mounted.current = false }
    }

    setState(s => ({
      ...s,
      isLoading: true,
      error: null,
      loadingProgress: 0,
      units: [],
    }))

    if (!_promise) {
      _promise = fetchAllUnits(pct => {
        if (mounted.current) setState(prev => ({ ...prev, loadingProgress: pct }))
      })
    }

    _promise
      .then(units => {
        _cache = units
        setUnitsCache(units)
        if (mounted.current) {
          setState({ units, isLoading: false, loadingProgress: 100, error: null })
        }
      })
      .catch(err => {
        _promise = null
        if (mounted.current) {
          setState(s => ({
            ...s,
            isLoading: false,
            error: String(err),
          }))
        }
      })

    return () => { mounted.current = false }
  }, [fetchVersion])

  return { ...state, retry }
}
