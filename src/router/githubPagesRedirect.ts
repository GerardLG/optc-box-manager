/**
 * Normaliza la ruta del query `redirect` que envía public/404.html en GitHub Pages.
 */
export function normalizeRedirectTarget(raw: string | null): string | null {
  if (raw == null || raw === '') return null
  try {
    const path = decodeURIComponent(raw)
    if (!path.startsWith('/')) return `/${path}`
    return path
  } catch {
    return null
  }
}

/**
 * Lee `?redirect=`, limpia la barra de direcciones y devuelve la ruta para React Router (sin basename).
 */
export function consumeRedirectSearchParam(): string | null {
  const params = new URLSearchParams(window.location.search)
  const raw = params.get('redirect')
  const target = normalizeRedirectTarget(raw)
  if (!target) return null

  params.delete('redirect')
  const rest = params.toString()
  const search = rest ? `?${rest}` : ''
  window.history.replaceState(null, '', `${window.location.pathname}${search}`)
  return target
}
