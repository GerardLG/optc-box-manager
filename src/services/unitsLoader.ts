import type { ExtendedUnit } from '../models/units'

const UNITS_URL   = 'https://raw.githubusercontent.com/optc-db/optc-db.github.io/master/common/data/units.json'
const DETAILS_URL = 'https://raw.githubusercontent.com/optc-db/optc-db.github.io/master/common/data/details.json'

export async function fetchAllUnits(
  onProgress?: (pct: number) => void
): Promise<ExtendedUnit[]> {
  onProgress?.(5)

  const [unitsRes, detailsRes] = await Promise.all([
    fetch(UNITS_URL),
    fetch(DETAILS_URL),
  ])

  if (!unitsRes.ok)   throw new Error(`No se pudo cargar units.json (${unitsRes.status})`)
  if (!detailsRes.ok) throw new Error(`No se pudo cargar details.json (${detailsRes.status})`)

  onProgress?.(40)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawUnits: any[]   = await unitsRes.json()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawDetails: any[] = await detailsRes.json()

  onProgress?.(75)

  const result: ExtendedUnit[] = rawUnits.map((row, idx) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const d: any = rawDetails[idx] ?? {}
    return {
      id:       idx + 1,
      name:     row[0] ?? `Unit #${idx + 1}`,
      type:     row[1],
      class:    row[2],
      stars:    Number(row[3]) || 0,
      cost:     row[4] ?? 0,
      combo:    row[5] ?? 0,
      slots:    row[6] ?? 0,
      maxLevel: row[7] ?? 99,
      minHP:    row[8]  ?? 0,
      maxHP:    row[9]  ?? 0,
      limitHP:  d.limitHP  ?? row[9]  ?? 0,
      minATK:   row[10] ?? 0,
      maxATK:   row[11] ?? 0,
      limitATK: d.limitATK ?? row[11] ?? 0,
      minRCV:   row[12] ?? 0,
      maxRCV:   row[13] ?? 0,
      limitRCV: d.limitRCV ?? row[13] ?? 0,
      cooldown: d.cooldown,
      flags:    d.flags,
      aliases:  d.aliases,
      detail: {
        captain:      d.captain,
        special:      d.special,
        specialName:  d.specialName,
        sailor:       d.sailor,
        superSpecial: d.superSpecial,
        potential:    d.potential,
        limit:        d.limit,
        VSCondition:  d.VSCondition,
        VSSpecial:    d.VSSpecial,
      },
      evolution: d.evolution,
    }
  })

  onProgress?.(100)
  return result
}
