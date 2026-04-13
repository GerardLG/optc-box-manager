import type { ExtendedUnit } from '../models/units'

// Raw data shape from optc-db
type RawUnit = [
  string,          // 0 name
  string | string[], // 1 type
  string | string[], // 2 class
  string,          // 3 rarity/stars
  number,          // 4 cost
  number,          // 5 combo
  number,          // 6 slots
  number,          // 7 maxLevel
  number,          // 8 minHP
  number,          // 9 maxHP
  number,          // 10 minATK
  number,          // 11 maxATK
  number,          // 12 minRCV
  number,          // 13 maxRCV
]

const UNITS_URL  = 'https://raw.githubusercontent.com/optc-db/optc-db/master/common/data/units.json'
const DETAILS_URL = 'https://raw.githubusercontent.com/optc-db/optc-db/master/common/data/details.json'

export async function fetchAllUnits(
  onProgress?: (pct: number) => void
): Promise<ExtendedUnit[]> {
  onProgress?.(5)

  const [unitsRes, detailsRes] = await Promise.all([
    fetch(UNITS_URL),
    fetch(DETAILS_URL),
  ])

  if (!unitsRes.ok)   throw new Error('No se pudo cargar units.json')
  if (!detailsRes.ok) throw new Error('No se pudo cargar details.json')

  onProgress?.(40)

  const rawUnits: RawUnit[]       = await unitsRes.json()
  const rawDetails: (object | null)[] = await detailsRes.json()

  onProgress?.(75)

  const result: ExtendedUnit[] = rawUnits.map((row, idx) => {
    const detail = (rawDetails[idx] ?? {}) as Record<string, unknown>
    return {
      id: idx + 1,
      name:     row[0] ?? `Unit #${idx + 1}`,
      type:     (row[1] as ExtendedUnit['type']),
      class:    (row[2] as ExtendedUnit['class']),
      stars:    Number(row[3]) || 0,
      cost:     row[4] ?? 0,
      combo:    row[5] ?? 0,
      slots:    row[6] ?? 0,
      maxLevel: row[7] ?? 99,
      minHP:    row[8]  ?? 0,
      maxHP:    row[9]  ?? 0,
      limitHP:  (detail.limitHP  as number) ?? row[9]  ?? 0,
      minATK:   row[10] ?? 0,
      maxATK:   row[11] ?? 0,
      limitATK: (detail.limitATK as number) ?? row[11] ?? 0,
      minRCV:   row[12] ?? 0,
      maxRCV:   row[13] ?? 0,
      limitRCV: (detail.limitRCV as number) ?? row[13] ?? 0,
      cooldown: detail.cooldown as [number, number] | undefined,
      flags:    detail.flags    as ExtendedUnit['flags'],
      aliases:  detail.aliases  as string[] | undefined,
      detail: {
        captain:      detail.captain      as string | undefined,
        special:      detail.special      as string | undefined,
        specialName:  detail.specialName  as string | undefined,
        sailor:       detail.sailor       as ExtendedUnit['detail']['sailor'],
        superSpecial: detail.superSpecial as string | undefined,
        potential:    detail.potential    as ExtendedUnit['detail']['potential'],
        limit:        detail.limit        as string[] | undefined,
        VSCondition:  detail.VSCondition  as string | undefined,
        VSSpecial:    detail.VSSpecial    as string | undefined,
      },
      evolution: detail.evolution as ExtendedUnit['evolution'],
    } satisfies ExtendedUnit
  })

  onProgress?.(100)
  return result
}
