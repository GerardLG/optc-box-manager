import type { UserUnit } from '../models/userBox'

export interface AppSettings {
  theme: 'dark' | 'light'
  gridSize: 'small' | 'medium' | 'large'
  showGlobal: boolean
  showJapan: boolean
}

const KEYS = {
  box: 'optc_box_v2',
  favorites: 'optc_favorites_v1',
  settings: 'optc_settings_v1',
} as const

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function safeSet(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* quota */ }
}

// ── Box ──────────────────────────────────────────────────────────────────────

export function loadBox(): UserUnit[] {
  return safeGet<UserUnit[]>(KEYS.box, [])
}

export function saveBox(box: UserUnit[]) {
  safeSet(KEYS.box, box)
}

// ── Favorites ────────────────────────────────────────────────────────────────

export function loadFavorites(): number[] {
  return safeGet<number[]>(KEYS.favorites, [])
}

export function saveFavorites(ids: number[]) {
  safeSet(KEYS.favorites, ids)
}

// ── Settings ─────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  gridSize: 'medium',
  showGlobal: true,
  showJapan: true,
}

export function loadSettings(): AppSettings {
  return { ...DEFAULT_SETTINGS, ...safeGet<Partial<AppSettings>>(KEYS.settings, {}) }
}

export function saveSettings(s: AppSettings) {
  safeSet(KEYS.settings, s)
}

// ── Export / Import ──────────────────────────────────────────────────────────

export async function exportBoxJSON(box: UserUnit[]) {
  const data = JSON.stringify(box, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `optc-box-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importBoxJSON(raw: string): UserUnit[] {
  const parsed = JSON.parse(raw)
  if (!Array.isArray(parsed)) throw new Error('El archivo no contiene un array válido')
  return parsed as UserUnit[]
}
