import type { ExtendedUnit } from '../models/units'

const BASE = 'https://raw.githubusercontent.com/optc-db/optc-db.github.io/master/common/data'
const UNITS_URL   = `${BASE}/units.js`
const DETAILS_URL = `${BASE}/details.js`

// optc-db serves JS files like: var units = [[...], ...]
// We extract the array by evaling the variable assignment safely
function extractArray(js: string, varName: string): unknown[] {
  const match = js.match(new RegExp(`var\\s+${varName}\\s*=\\s*(\\[)`))
  if (!match || match.index === undefined) throw new Error(`No se encontró '${varName}' en el JS`)
  const start = match.index + js.indexOf('[', match.index)
  // Find the matching closing bracket
  let depth = 0
  let end = start
  for (let i = start; i < js.length; i++) {
    if (js[i] === '[') depth++
    else if (js[i] === ']') { depth--; if (depth === 0) { end = i; break } }
  }
  return JSON.parse(js.slice(start, end + 1))
}

export async function fetchAllUnits(
  onProgress?: (pct: number) => void
): Promise<ExtendedUnit[]> {
  onProgress?.(5)

  const [unitsRes, detailsRes] = await Promise.all([
    fetch(UNITS_URL),
    fetch(DETAILS_URL),
  ])

  if (!unitsRes.ok)   throw new Error(`No se pudo cargar units.js (${unitsRes.status})`)
  if (!detailsRes.ok) throw new Error(`No se pudo cargar details.js (${detailsRes.status})`)

  onProgress?.(30)

  const [unitsText, detailsText] = await Promise.all([
    unitsRes.text(),
    detailsRes.text(),
  ])

  onProgress?.(60)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawUnits  = extractArray(unitsText,   'units')   as any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawDetails = extractArray(detailsText, 'details') as any[]

  onProgress?.(80)

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
