import type { ExtendedUnit } from '../models/units'

export interface TeamCondition {
  types: string[]      // STR, DEX, QCK, PSY, INT
  classes: string[]    // Fighter, Shooter, Cerebral...
  families: string[]   // Straw Hat, Heart Pirates...
  isUniversal: boolean // "all characters"
}

// All known OPTC types
const UNIT_TYPES = ['STR', 'DEX', 'QCK', 'PSY', 'INT']

// Known OPTC classes
const UNIT_CLASSES = [
  'Fighter', 'Slasher', 'Shooter', 'Free Spirit', 'Cerebral',
  'Powerhouse', 'Navy', 'Pirate', 'Driven', 'Treasure Hunter',
  'Striker', 'Ambition',
]

// Known families / crews
const FAMILIES = [
  'Straw Hat', 'Heart Pirates', 'Kid Pirates', 'Whitebeard Pirates',
  'Red Hair Pirates', 'Big Mom Pirates', 'Beasts Pirates', 'Donquixote',
  'Revolutionary', 'Marines', 'Baroque Works', 'Impel Down',
  'Ohara', 'Wano', 'Alabasta', 'Skypiea',
]

export function parseCaptainAbility(text: string): TeamCondition {
  if (!text) return { types: [], classes: [], families: [], isUniversal: false }

  const lower = text.toLowerCase()

  // Universal captain
  const isUniversal =
    lower.includes('all characters') ||
    lower.includes('all allies') ||
    lower.includes('entire crew')

  // Detect types — format is [STR], [DEX], etc.
  const types = UNIT_TYPES.filter(t =>
    text.includes(`[${t}]`) || lower.includes(t.toLowerCase() + ' characters')
  )

  // Detect classes
  const classes = UNIT_CLASSES.filter(c =>
    lower.includes(c.toLowerCase() + ' characters') ||
    lower.includes(c.toLowerCase() + ' class')
  )

  // Detect families
  const families = FAMILIES.filter(f =>
    lower.includes(f.toLowerCase())
  )

  return { types, classes, families, isUniversal }
}

export function scoreUnitForCaptain(
  unit: ExtendedUnit,
  condition: TeamCondition
): number {
  if (condition.isUniversal) return 1

  let score = 0
  const unitTypes    = (Array.isArray(unit.type)  ? unit.type  : [unit.type])  as string[]
  const unitClasses  = (Array.isArray(unit.class) ? unit.class : [unit.class]) as string[]

  // Type match: high weight
  if (condition.types.length > 0) {
    const typeMatch = unitTypes.some(t => condition.types.includes(t))
    if (typeMatch) score += 3
    else return 0  // if captain requires specific type, non-matching units score 0
  }

  // Class match
  condition.classes.forEach(c => {
    if (unitClasses.some(uc => uc.toLowerCase().includes(c.toLowerCase()))) {
      score += 2
    }
  })

  // Family match (in name or class)
  condition.families.forEach(f => {
    if (
      unit.name.toLowerCase().includes(f.toLowerCase()) ||
      unitClasses.some(c => c.toLowerCase().includes(f.toLowerCase()))
    ) {
      score += 1
    }
  })

  return score
}

export function getRecommendedTeam(
  captain: ExtendedUnit,
  allUnits: ExtendedUnit[],
  boxIds?: Set<number>,
  maxResults = 10
): { unit: ExtendedUnit; score: number; inBox: boolean }[] {
  const captainText = captain.detail?.captain ?? ''
  if (typeof captainText !== 'string' || !captainText) return []

  const condition = parseCaptainAbility(captainText)

  // If we can't determine any condition, return empty
  if (!condition.isUniversal && condition.types.length === 0 && condition.classes.length === 0 && condition.families.length === 0) {
    return []
  }

  const candidates = allUnits
    .filter(u => u.id !== captain.id)
    .map(u => ({
      unit: u,
      score: scoreUnitForCaptain(u, condition),
      inBox: boxIds ? boxIds.has(u.id) : false,
    }))
    .filter(r => r.score > 0)
    // Sort: box units first, then by score desc
    .sort((a, b) => {
      if (a.inBox !== b.inBox) return a.inBox ? -1 : 1
      return b.score - a.score
    })
    .slice(0, maxResults)

  return candidates
}
