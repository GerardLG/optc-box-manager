import type { UserUnit } from '../models/userBox'

export interface AppSettings {
  theme: 'dark' | 'light'
  gridSize: 'small' | 'medium' | 'large'
  showGlobal: boolean
  showJapan: boolean
}

const KEYS = {
  box:       'optc_box_v2',
  favorites: 'optc_favorites_v1',
  settings:  'optc_settings_v1',
} as const

// ── localStorage availability check ──────────────────────────────────────────
// In some sandboxed iframes localStorage throws or silently fails.
// We detect this once and fall back to a module-level in-memory store.

function isLocalStorageAvailable(): boolean {
  try {
    const test = '__optc_test__'
    localStorage.setItem(test, '1')
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

const USE_LS = isLocalStorageAvailable()

// In-memory fallback store (used when localStorage is blocked)
const memStore: Record<string, string> = {}

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = USE_LS ? localStorage.getItem(key) : (memStore[key] ?? null)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function safeSet(key: string, value: unknown) {
  try {
    const serialized = JSON.stringify(value)
    if (USE_LS) {
      localStorage.setItem(key, serialized)
    } else {
      memStore[key] = serialized
    }
  } catch { /* quota or security */ }
}

// ── Box ──────────────────────────────────────────────────────────────────────

export function loadBox(): UserUnit[] {
  return safeGet<UserUnit[]>(KEYS.box, [])
}

export function saveBox(box: UserUnit[]) {
  // Only persist lightweight fields — strip the full `detail` object to save
  // space and avoid stale skill data. On load, detail is re-hydrated from the
  // live units cache (see hydrateBox in useUserBox).
  const slim = box.map(u => ({
    ...u,
    unit: {
      ...u.unit,
      detail: {},   // detail is always re-hydrated from live data
    },
  }))
  safeSet(KEYS.box, slim)
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
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `optc-box-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importBoxJSON(raw: string): UserUnit[] {
  const parsed = JSON.parse(raw)
  if (!Array.isArray(parsed)) throw new Error('El archivo no contiene un array válido')
  return parsed as UserUnit[]
}

// ── Storage availability (for UI feedback) ────────────────────────────────────
export function isStoragePersisted(): boolean {
  return USE_LS
}
