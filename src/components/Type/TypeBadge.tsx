import type { UnitType } from '../../models/units'

const TYPE_COLORS: Record<string, string> = {
  STR: '#e63946', DEX: '#2ecc71', QCK: '#3498db',
  PSY: '#9b59b6', INT: '#f39c12', DUAL: '#7f8c8d', VS: '#16a085',
}

const TYPE_BG: Record<string, string> = {
  STR: '#e6394620', DEX: '#2ecc7120', QCK: '#3498db20',
  PSY: '#9b59b620', INT: '#f39c1220', DUAL: '#7f8c8d20', VS: '#16a08520',
}

interface Props { type: UnitType | UnitType[]; size?: number }

export function TypeBadge({ type, size = 20 }: Props) {
  const types = Array.isArray(type) ? type : [type]
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {types.map(t => (
        <span key={t} style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: size, height: size,
          background: TYPE_BG[t] ?? '#aaa2',
          border: `1.5px solid ${TYPE_COLORS[t] ?? '#aaa'}`,
          borderRadius: size / 4,
          fontSize: Math.max(8, size * 0.38),
          fontWeight: 800,
          color: TYPE_COLORS[t] ?? '#aaa',
          letterSpacing: '-0.05em',
        }}>
          {t.slice(0, 3)}
        </span>
      ))}
    </div>
  )
}
