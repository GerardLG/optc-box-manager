import type { ExtendedUnit } from './units'

export interface UserUnit {
  id: string
  unit: ExtendedUnit
  level: {
    lvl: number
    limitLvl?: number
  }
  cc: {
    hp: number
    atk: number
    rcv: number
  }
  limitBreak?: {
    lvl: number
    support: number
  }
  support?: boolean
  ink?: boolean
  notes?: string
  createdAt: number
}
