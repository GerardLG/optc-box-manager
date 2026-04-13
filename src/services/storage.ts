import type { UserBox } from '../models/userBox'

const BOX_KEY = 'optc-userbox'
const SETTINGS_KEY = 'optc-settings'

export interface AppSettings {
  theme: 'dark' | 'light'
  gridSize: 'small' | 'medium' | 'large'
  showGlobal: boolean
  showJapan: boolean
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  gridSize: 'medium',
  showGlobal: true,
  showJapan: true,
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return DEFAULT_SETTINGS
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(s: AppSettings): void {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)) } catch { /* silencio */ }
}

export function loadBox(): UserBox {
  try {
    const raw = localStorage.getItem(BOX_KEY)
    if (!raw) return []
    return JSON.parse(raw) as UserBox
  } catch {
    return []
  }
}

export function saveBox(box: UserBox): void {
  try { localStorage.setItem(BOX_KEY, JSON.stringify(box)) } catch { /* silencio */ }
}

export function exportBoxJSON(box: UserBox): void {
  const blob = new Blob([JSON.stringify(box, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `optc-box-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importBoxJSON(jsonString: string): UserBox {
  const data = JSON.parse(jsonString)
  if (!Array.isArray(data)) throw new Error('Formato inválido: se esperaba un array')
  return data as UserBox
}
