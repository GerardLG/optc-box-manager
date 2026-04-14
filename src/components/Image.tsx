import { useState } from 'react'

interface Props {
  unitId: number
  name: string
  size?: number
  className?: string
  style?: React.CSSProperties
}

function formatId(id: number): string {
  return String(id).padStart(4, '0')
}

// Rutas verificadas del repo público 2Shankz/optc-db.github.io
function buildUrls(id: number): string[] {
  const fid = formatId(id)
  return [
    `https://raw.githubusercontent.com/2Shankz/optc-db.github.io/master/res/thumbnail/jap/f${fid}.png`,
    `https://raw.githubusercontent.com/2Shankz/optc-db.github.io/master/res/thumbnail/gl/f${fid}.png`,
  ]
}

function FallbackSVG({ name, size }: { name: string; size: number }) {
  const letter = name ? name.charAt(0).toUpperCase() : '?'
  const uid = `gf${letter}${size}`
  return (
    <svg width={size} height={size} viewBox="0 0 100 100"
      style={{ display: 'block', borderRadius: '8px', flexShrink: 0 }} aria-label={name}>
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-surface-offset)" />
          <stop offset="100%" stopColor="var(--color-surface-dynamic)" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="12" fill={`url(#${uid})`} />
      <text x="50" y="67" textAnchor="middle" fontSize="40" fontWeight="700"
        fill="var(--color-text-faint)" fontFamily="var(--font-body, sans-serif)">
        {letter}
      </text>
    </svg>
  )
}

export function UnitImage({ unitId, name, size = 80, className, style }: Props) {
  const urls = buildUrls(unitId)
  const [index, setIndex] = useState(0)
  const [failed, setFailed] = useState(false)

  if (failed) return <FallbackSVG name={name} size={size} />

  return (
    <img
      src={urls[index]}
      alt={name}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className={className}
      style={{ display: 'block', borderRadius: '8px', objectFit: 'cover', flexShrink: 0, ...style }}
      onError={() => {
        if (index < urls.length - 1) setIndex(i => i + 1)
        else setFailed(true)
      }}
    />
  )
}
