import type { ExtendedUnit, UnitType, UnitClass } from '../models/units'

const DETAILS_URL = 'https://raw.githubusercontent.com/optc-db/optc-db.github.io/master/common/data/details.json'
const EVOLUTIONS_URL = 'https://raw.githubusercontent.com/optc-db/optc-db.github.io/master/common/data/evolutions.json'

export function formatId(id: number): string {
  return String(id).padStart(4, '0')
}

export function buildImageUrls(id: number): string[] {
  const fid = formatId(id)
  return [
    `https://raw.githubusercontent.com/2Shankz/optc-db.github.io/master/public/img/thumbnail/${fid}.png`,
    `https://raw.githubusercontent.com/2Shankz/optc-db.github.io/master/public/img/thumbnail/${fid}_1.png`,
    `https://optc-db.github.io/img/thumbnail/${fid}.png`,
  ]
}

export async function fetchAllUnits(onProgress?: (p: number) => void): Promise<ExtendedUnit[]> {
  onProgress?.(5)

  const [detailsRaw, evolutionsRaw] = await Promise.all([
    fetch(DETAILS_URL).then(r => r.json()),
    fetch(EVOLUTIONS_URL).then(r => r.json()).catch(() => ({})),
  ])

  onProgress?.(70)

  const evolutions: Record<string, unknown> = evolutionsRaw ?? {}
  const units: ExtendedUnit[] = []
  let idx = 0

  for (const raw of detailsRaw as unknown[]) {
    idx++
    if (raw === null || raw === undefined) continue
    const r = raw as Record<string, unknown>
    const id = idx

    units.push({
      id,
      name: (r.name as string) ?? `Unit #${id}`,
      type: (r.type as UnitType | UnitType[]) ?? 'STR',
      class: (r.class as UnitClass | UnitClass[]) ?? 'Fighter',
      stars: Number(r.stars ?? 1),
      cost: Number(r.cost ?? 0),
      combo: Number(r.combo ?? 0),
      slots: Number(r.slots ?? 0),
      maxLevel: Number(r.maxLevel ?? 1),
      evo: evolutions[String(id)],
      minHP: Number(r.minHP ?? 0), maxHP: Number(r.maxHP ?? 0),
      minATK: Number(r.minATK ?? 0), maxATK: Number(r.maxATK ?? 0),
      minRCV: Number(r.minRCV ?? 0), maxRCV: Number(r.maxRCV ?? 0),
      limitHP: Number(r.limitHP ?? 0),
      limitATK: Number(r.limitATK ?? 0),
      limitRCV: Number(r.limitRCV ?? 0),
      limitexHP: Number(r.limitexHP ?? 0),
      limitexATK: Number(r.limitexATK ?? 0),
      limitexRCV: Number(r.limitexRCV ?? 0),
      cooldown: (r.cooldown as [number, number]) ?? [0, 0],
      flags: (r.flags as ExtendedUnit['flags']) ?? {},
      detail: {
        captain: (r.captain as string) ?? '',
        captainNotes: (r.captainNotes as string) ?? '',
        special: (r.special as string) ?? '',
        specialName: (r.specialName as string) ?? '',
        sailor: r.sailor as ExtendedUnit['detail']['sailor'],
        sailorNotes: (r.sailorNotes as string) ?? '',
        superSpecial: (r.superSpecial as string) ?? '',
        superSpecialCriteria: (r.superSpecialCriteria as string) ?? '',
        swap: r.swap as ExtendedUnit['detail']['swap'],
        VSCondition: (r.VSCondition as string) ?? '',
        VSSpecial: r.VSSpecial,
        VSCaptain: r.VSCaptain,
        potential: (r.potential as ExtendedUnit['detail']['potential']) ?? [],
        support: r.support,
        rumble: r.rumble,
        festAbility: r.festAbility,
        festSpecial: r.festSpecial,
        festResistance: r.festResistance,
      },
    })
  }

  onProgress?.(100)
  return units
}
