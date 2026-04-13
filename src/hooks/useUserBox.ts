import { useState, useCallback } from 'react'
import { v4 as uuid } from 'uuid'
import type { UserUnit } from '../models/userBox'
import type { ExtendedUnit } from '../models/units'
import { loadBox, saveBox, exportBoxJSON, importBoxJSON } from '../services/storage'

export function useUserBox() {
  const [box, setBox] = useState<UserUnit[]>(loadBox)

  const persist = useCallback((next: UserUnit[]) => {
    setBox(next)
    saveBox(next)
  }, [])

  const add = useCallback((unit: ExtendedUnit) => {
    setBox(prev => {
      if (prev.some(u => u.unit.id === unit.id)) return prev
      const entry: UserUnit = {
        id: uuid(),
        unit,
        level: { lvl: unit.maxLevel },
        cc: { hp: 0, atk: 0, rcv: 0 },
        createdAt: Date.now(),
      }
      const next = [...prev, entry]
      saveBox(next)
      return next
    })
  }, [])

  const remove = useCallback((id: string) => {
    setBox(prev => { const next = prev.filter(u => u.id !== id); saveBox(next); return next })
  }, [])

  const update = useCallback((updated: UserUnit) => {
    setBox(prev => { const next = prev.map(u => u.id === updated.id ? updated : u); saveBox(next); return next })
  }, [])

  const exportDB = useCallback(() => exportBoxJSON(box), [box])

  const importDB = useCallback((raw: string) => {
    const imported = importBoxJSON(raw)
    persist(imported)
  }, [persist])

  const reset = useCallback(() => persist([]), [persist])

  return { box, add, remove, update, exportDB, importDB, reset }
}
