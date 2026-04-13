export type UnitType = 'STR' | 'DEX' | 'QCK' | 'PSY' | 'INT' | 'DUAL' | 'VS'
export type UnitClass = string

export interface Potential {
  Name: string
  description: string[]
}

export interface UnitDetail {
  captain?: string
  special?: string
  specialName?: string
  sailor?: string | { base?: string; level1?: string; level5?: string }
  superSpecial?: string
  potential?: Potential[]
  limit?: string[]
  VSCondition?: string
  VSSpecial?: string
}

export interface ExtendedUnit {
  id: number
  name: string
  type: UnitType | UnitType[]
  class: UnitClass | UnitClass[]
  stars: number | string
  cost: number
  combo: number
  slots: number
  maxLevel: number
  minHP: number
  maxHP: number
  limitHP: number
  minATK: number
  maxATK: number
  limitATK: number
  minRCV: number
  maxRCV: number
  limitRCV: number
  cooldown?: [number, number]
  aliases?: string[]
  flags?: { global?: boolean; japan?: boolean; rr?: boolean; tn?: boolean }
  detail: UnitDetail
  evolution?: {
    evolution: number | number[]
    evolvers: (number | 'skullA' | 'skullB' | 'skullC' | 'skullD')[]
  }
}
