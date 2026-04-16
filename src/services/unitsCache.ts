import type { ExtendedUnit } from '../models/units'

let cache: ExtendedUnit[] | null = null
const listeners = new Set<() => void>()

/** Actualiza la caché de unidades y notifica a los suscriptores (p. ej. rehidratación de la caja). */
export function setUnitsCache(units: ExtendedUnit[]) {
  cache = units
  for (const fn of listeners) fn()
}

export function getUnitsCache(): ExtendedUnit[] | null {
  return cache
}

export function subscribeUnitsCache(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
