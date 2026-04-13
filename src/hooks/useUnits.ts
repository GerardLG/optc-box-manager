import { useState, useEffect } from 'react'
import type { ExtendedUnit } from '../models/units'
import { fetchAllUnits } from '../services/optcdb'

export function useUnits() {
  const [units, setUnits] = useState<ExtendedUnit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)
    fetchAllUnits(p => { if (!cancelled) setLoadingProgress(p) })
      .then(data => { if (!cancelled) { setUnits(data); setIsLoading(false) } })
      .catch(e => { if (!cancelled) { setError(String(e)); setIsLoading(false) } })
    return () => { cancelled = true }
  }, [])

  return { units, isLoading, loadingProgress, error }
}
