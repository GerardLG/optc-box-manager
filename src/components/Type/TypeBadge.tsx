interface Props {
  type: string | string[]
  size?: number
}

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  STR:  { bg: '#c0392b', text: '#fff' },
  DEX:  { bg: '#27ae60', text: '#fff' },
  QCK:  { bg: '#2980b9', text: '#fff' },
  PSY:  { bg: '#8e44ad', text: '#fff' },
  INT:  { bg: '#d35400', text: '#fff' },
  DUAL: { bg: '#7f8c8d', text: '#fff' },
  VS:   { bg: '#16a085', text: '#fff' },
}

export function TypeBadge({ type, size = 18 }: Props) {
  const types = Array.isArray(type) ? type : [type]
  return (
    <span style={{ display: 'inline-flex', gap: 3 }}>
      {types.map((t, i) => {
        const c = TYPE_COLORS[t] ?? { bg: '#555', text: '#fff' }
        return (
          <span key={i} style={{
            background: c.bg, color: c.text,
            fontSize: size * 0.7,
            fontWeight: 700,
            padding: `1px ${size * 0.35}px`,
            borderRadius: 4,
            lineHeight: 1.4,
            letterSpacing: 0.5,
          }}>{t}</span>
        )
      })}
    </span>
  )
}
