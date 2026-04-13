import { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { UserBox, UserUnit } from '../models/userBox'
import type { ExtendedUnit } from '../models/units'
import { loadBox, saveBox, exportBoxJSON, importBoxJSON } from '../services/storage'

export function useUserBox() {
  const [box, setBoxState] = useState<UserBox>(loadBox)

  function persist(next: UserBox) {
    setBoxState(next)
    saveBox(next)
  }

  const add = useCallback((unit: ExtendedUnit) => {
    setBoxState(prev => {
      const next = [...prev, {
        id: uuidv4(),
        unit,
        level: { lvl: 1, enhancedMaxLevel: false, limitLevel: false },
        cc: { hp: 0, atk: 0, rcv: 0 },
      }]
      saveBox(next)
      return next
    })
  }, [])

  const update = useCallback((updated: UserUnit) => {
    setBoxState(prev => {
      const next = prev.map(u => u.id === updated.id ? updated : u)
      saveBox(next)
      return next
    })
  }, [])

  const remove = useCallback((id: string) => {
    setBoxState(prev => {
      const next = prev.filter(u => u.id !== id)
      saveBox(next)
      return next
    })
  }, [])

  const reset = useCallback(() => persist([]), [])

  const exportDB = useCallback(async () => { exportBoxJSON(box) }, [box])

  const importDB = useCallback((json: string) => {
    const data = importBoxJSON(json)
    persist(data)
  }, [])

  return { box, add, update, remove, reset, exportDB, importDB }
}
