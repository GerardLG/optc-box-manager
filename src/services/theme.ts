import { loadSettings, saveSettings } from './storage'

export type Theme = 'light' | 'dark'

export function getSavedTheme(): Theme {
  const t = loadSettings().theme
  return t === 'light' ? 'light' : 'dark'
}

export function applyDocumentTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
}

/** Persiste tema en ajustes y aplica `data-theme` (fuente única para Layout, Ajustes y primer pintado). */
export function persistTheme(theme: Theme) {
  const s = loadSettings()
  saveSettings({ ...s, theme })
  applyDocumentTheme(theme)
}
