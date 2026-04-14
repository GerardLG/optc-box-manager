import type { ExtendedUnit } from '../models/units'

const BASE = 'https://raw.githubusercontent.com/optc-db/optc-db.github.io/master/common/data'
const UNITS_URL     = `${BASE}/units.js`
const COOLDOWNS_URL = `${BASE}/cooldowns.js`

// optc-db files are real JS -- execute in isolated scope via new Function
function execJS(js: string, varName: string): unknown[] {
  const fn = new Function(`
    var window = {};
    ${js}
    if (typeof window.${varName} !== 'undefined') return window.${varName};
    if (typeof ${varName} !== 'undefined') return ${varName};
    throw new Error("No se encontró '${varName}' en el JS");
  `)
  return fn() as unknown[]
}

function isPlaceholder(row: unknown[]): boolean {
  const name = row[0]
  const type = row[1]
  return !name || name === '' || type === 'Type' || type === null
}

export async function fetchAllUnits(
  onProgress?: (pct: number) => void
): Promise<ExtendedUnit[]> {
  onProgress?.(5)

  const [unitsRes, cooldownsRes] = await Promise.all([
    fetch(UNITS_URL),
    fetch(COOLDOWNS_URL),
  ])

  if (!unitsRes.ok)     throw new Error(`No se pudo cargar units.js (${unitsRes.status})`)
  if (!cooldownsRes.ok) throw new Error(`No se pudo cargar cooldowns.js (${cooldownsRes.status})`)

  onProgress?.(30)

  const [unitsText, cooldownsText] = await Promise.all([
    unitsRes.text(),
    cooldownsRes.text(),
  ])

  onProgress?.(60)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawUnits     = execJS(unitsText,     'units')     as any[]
  // cooldowns.js exposes window.cooldowns -- pure array, no dependencies
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawCooldowns = execJS(cooldownsText, 'cooldowns') as ([number, number] | null)[]

  onProgress?.(80)

  const result: ExtendedUnit[] = rawUnits
    .map((row: any, idx: number) => {
      const cooldown = rawCooldowns[idx] ?? undefined
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
        limitHP:  row[9]  ?? 0,
        minATK:   row[10] ?? 0,
        maxATK:   row[11] ?? 0,
        limitATK: row[11] ?? 0,
        minRCV:   row[12] ?? 0,
        maxRCV:   row[13] ?? 0,
        limitRCV: row[13] ?? 0,
        cooldown,
        detail:   {},
      } as ExtendedUnit
    })
    .filter((u: ExtendedUnit) => u.name && u.name !== '' && u.type !== ('Type' as any))

  onProgress?.(100)
  return result
}
