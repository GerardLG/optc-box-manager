import type { ExtendedUnit } from '../models/units'

const BASE         = 'https://raw.githubusercontent.com/optc-db/optc-db.github.io/master/common/data'
const DETAILS_BASE = 'https://raw.githubusercontent.com/2Shankz/optc-db.github.io/master/common/data'

const UNITS_URL     = `${BASE}/units.js`
const COOLDOWNS_URL = `${BASE}/cooldowns.js`
const DETAILS_URL   = `${DETAILS_BASE}/details.js`

// optc-db files are real JS -- execute in isolated scope via new Function
function execJS<T>(js: string, varName: string): T {
  const fn = new Function(`
    var window = {};
    ${js}
    if (typeof window.${varName} !== 'undefined') return window.${varName};
    if (typeof ${varName} !== 'undefined') return ${varName};
    throw new Error("No se encontró '${varName}' en el JS");
  `)
  return fn() as T
}

function isPlaceholder(row: unknown[]): boolean {
  const name = row[0]
  const type = row[1]
  return !name || name === '' || type === 'Type' || type === null
}

function extractCaptainText(captain: unknown): string {
  if (!captain) return ''
  if (typeof captain === 'string') return captain
  if (typeof captain === 'object') {
    const c = captain as Record<string, string>
    return c.base ?? c.level1 ?? ''
  }
  return ''
}

function extractSailorText(sailor: unknown): string | { base?: string; level1?: string; level5?: string } | undefined {
  if (!sailor) return undefined
  if (typeof sailor === 'string') return sailor
  if (typeof sailor === 'object') return sailor as { base?: string; level1?: string; level5?: string }
  return undefined
}

export async function fetchAllUnits(
  onProgress?: (pct: number) => void
): Promise<ExtendedUnit[]> {
  onProgress?.(5)

  const [unitsRes, cooldownsRes, detailsRes] = await Promise.all([
    fetch(UNITS_URL),
    fetch(COOLDOWNS_URL),
    fetch(DETAILS_URL),
  ])

  if (!unitsRes.ok)     throw new Error(`No se pudo cargar units.js (${unitsRes.status})`)
  if (!cooldownsRes.ok) throw new Error(`No se pudo cargar cooldowns.js (${cooldownsRes.status})`)

  onProgress?.(30)

  const [unitsText, cooldownsText, detailsText] = await Promise.all([
    unitsRes.text(),
    cooldownsRes.text(),
    detailsRes.ok ? detailsRes.text() : Promise.resolve(''),
  ])

  onProgress?.(60)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawUnits     = execJS<any[]>(unitsText,     'units')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawCooldowns = execJS<([number, number] | null)[]>(cooldownsText, 'cooldowns')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawDetails   = detailsText ? execJS<Record<number, any>>(detailsText, 'details') : {}

  onProgress?.(80)

  const result: ExtendedUnit[] = rawUnits
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((row: any, idx: number) => {
      const id       = idx + 1
      const cooldown = rawCooldowns[idx] ?? undefined
      const d        = rawDetails[id] ?? {}

      return {
        id,
        name:     row[0] ?? `Unit #${id}`,
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
        detail: {
          captain:              extractCaptainText(d.captain),
          captainNotes:         d.captainNotes ?? '',
          special:              typeof d.special === 'string' ? d.special : '',
          specialName:          d.specialName ?? '',
          sailor:               extractSailorText(d.sailor),
          sailorNotes:          d.sailorNotes ?? '',
          superSpecial:         d.superSpecial ?? '',
          superSpecialCriteria: d.superSpecialCriteria ?? '',
          potential:            d.potential ?? [],
          support:              d.support,
          limit:                d.limit,
        },
      } as ExtendedUnit
    })
    .filter((u: ExtendedUnit) => u.name && u.name !== '' && u.type !== ('Type' as never))

  onProgress?.(100)
  return result
}
