import { useState, useEffect, useId } from 'react'
import type { CSSProperties } from 'react'

function formatId(id: number): string {
  return String(id).padStart(4, '0')
}

/** Mirror 2Shankz: suele ser la fuente más estable para thumbnails. */
const SHANKZ_THUMB =
  'https://raw.githubusercontent.com/2Shankz/optc-db.github.io/master/units/thumbnails'

/** URLs tipo optc-db.github.io (glo / jap), como respaldo. */
function buildOptcDbApiUrls(id: number): string[] {
  const fid = formatId(id)
  const folder = `${Math.trunc(id / 1000)}/${Math.trunc((id % 1000) / 100)}00`
  const base = 'https://optc-db.github.io/api/images/thumbnail'
  return [`${base}/glo/${folder}/${fid}.png`, `${base}/jap/${folder}/${fid}.png`]
}

/** Orden: primero mirror (más fiable), luego API. */
function buildAllThumbnailUrls(id: number): string[] {
  const shankz = `${SHANKZ_THUMB}/${formatId(id)}.png`
  return [shankz, ...buildOptcDbApiUrls(id)]
}

function FallbackSVG({
  name,
  unitId,
  size,
  gradientId,
}: {
  name: string
  unitId: number
  size: number
  gradientId: string
}) {
  const letter = name ? name.charAt(0).toUpperCase() : '?'
  const label = name || `Personaje #${unitId}`
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={label}
      style={{ display: 'block', borderRadius: '8px', flexShrink: 0 }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-surface-offset)" />
          <stop offset="100%" stopColor="var(--color-surface-dynamic)" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="12" fill={`url(#${gradientId})`} />
      <text
        x="50"
        y="67"
        textAnchor="middle"
        fontSize="40"
        fontWeight="700"
        fill="var(--color-text-faint)"
        fontFamily="var(--font-body, sans-serif)"
      >
        {letter}
      </text>
    </svg>
  )
}

export interface UnitImageProps {
  unitId: number
  name?: string
  size?: number
  className?: string
  style?: CSSProperties
  /** `hero`: recorte tipo portada; `card`: miniatura en grid */
  variant?: 'card' | 'hero'
}

export function UnitImage({
  unitId,
  name = '',
  size = 64,
  className,
  style,
  variant = 'card',
}: UnitImageProps) {
  const urls = buildAllThumbnailUrls(unitId)
  const [index, setIndex] = useState(0)
  const [failed, setFailed] = useState(false)
  const svgGradientId = useId().replace(/:/g, '')

  useEffect(() => {
    setIndex(0)
    setFailed(false)
  }, [unitId])

  if (failed) {
    return (
      <FallbackSVG
        name={name}
        unitId={unitId}
        size={size}
        gradientId={`uimg-fallback-${svgGradientId}`}
      />
    )
  }

  const objectFit = variant === 'hero' ? 'cover' : 'contain'
  const currentUrl = urls[index]

  return (
    <img
      key={`${unitId}-${index}-${currentUrl}`}
      src={currentUrl}
      alt={name || `Personaje #${unitId}`}
      width={size}
      height={size}
      loading={variant === 'hero' ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
      style={{
        imageRendering: 'pixelated',
        objectFit,
        display: 'block',
        borderRadius: variant === 'hero' ? undefined : '8px',
        flexShrink: 0,
        maxWidth: `${size}px`,
        height: `${size}px`,
        width: `${size}px`,
        ...style,
      }}
      onError={e => {
        const el = e.currentTarget
        el.onerror = null

        setIndex(i => {
          if (i < urls.length - 1) return i + 1
          setFailed(true)
          return i
        })
      }}
    />
  )
}
