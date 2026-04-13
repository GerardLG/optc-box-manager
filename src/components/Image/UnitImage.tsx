import { useState } from 'react'

const THUMB_BASE = 'https://raw.githubusercontent.com/2Shankz/optc-db.github.io/master/units/thumbnails'
const PLACEHOLDER = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23333"/><text x="50" y="60" font-size="32" text-anchor="middle" fill="%23999">?</text></svg>')}`

function formatId(id: number): string {
  return String(id).padStart(4, '0')
}

interface Props {
  unitId: number
  name?: string
  size?: number
  className?: string
}

export function UnitImage({ unitId, name = '', size = 64, className }: Props) {
  const [errCount, setErrCount] = useState(0)

  const src = errCount === 0
    ? `${THUMB_BASE}/${formatId(unitId)}.png`
    : PLACEHOLDER

  return (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className={className}
      style={{ imageRendering: 'pixelated', objectFit: 'contain' }}
      onError={() => setErrCount(c => c + 1)}
    />
  )
}
