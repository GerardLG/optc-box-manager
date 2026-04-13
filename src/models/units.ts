export const UnitTypes = ['STR', 'DEX', 'QCK', 'PSY', 'INT', 'DUAL', 'VS'] as const
export type UnitType = typeof UnitTypes[number]
export const UnitClasses = ['Fighter','Slasher','Shooter','Free Spirit','Cerebral','Powerhouse','Driven','Evolver'] as const
export type UnitClass = typeof UnitClasses[number]
export const Rarity = [1, 2, 3, 4, 5, 6] as const
export type UnitStar = typeof Rarity[number]

export interface ExtendedUnit {
  id: number
  name: string
  type: UnitType | UnitType[]
  class: UnitClass | UnitClass[]
  stars: UnitStar | number
  cost: number
  combo: number
  slots: number
  maxLevel: number
  evo: unknown
  minHP: number; maxHP: number
  minATK: number; maxATK: number
  minRCV: number; maxRCV: number
  limitHP: number; limitATK: number; limitRCV: number
  limitexHP: number; limitexATK: number; limitexRCV: number
  cooldown: [number, number]
  flags: {
    global?: boolean
    japOnly?: boolean
    lrr?: boolean
    rr?: boolean
    fnonly?: boolean
    raid?: boolean
    shop?: boolean
    inkable?: boolean
  }
  detail: {
    captain: string
    captainNotes: string
    special: string
    specialName: string
    sailor: string | { base?: string; level1?: string; level2?: string } | undefined
    sailorNotes: string
    superSpecial: string
    superSpecialCriteria: string
    swap: string | { captain?: string; sailor?: string } | undefined
    VSCondition: string
    VSSpecial: unknown
    VSCaptain: unknown
    potential: Array<{ Name: string; description: string[] }>
    support: unknown
    rumble: unknown
    festAbility: unknown
    festSpecial: unknown
    festResistance: unknown
  }
}
