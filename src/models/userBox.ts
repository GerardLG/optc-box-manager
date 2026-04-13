import type { ExtendedUnit } from './units'

export interface UserUnitLevel {
  lvl: number
  enhancedMaxLevel: boolean
  limitLevel: boolean
}

export interface UserUnitCC {
  hp: number
  atk: number
  rcv: number
}

export interface UserUnit {
  id: string
  unit: ExtendedUnit
  level: UserUnitLevel
  cc: UserUnitCC
}

export type UserBox = UserUnit[]
export type UserUnitBulkEdit = Partial<Pick<UserUnit, 'level' | 'cc'>>
