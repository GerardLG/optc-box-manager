import { useState } from 'react'
import type { SearchFilters } from '../../hooks/useSearch'
import type { UnitType } from '../../models/units'
import styles from './SearchPanel.module.css'

const ALL_TYPES: UnitType[] = ['STR','DEX','QCK','PSY','INT','DUAL','VS']
const TYPE_COLORS: Record<UnitType, string> = {
  STR:'#c0392b', DEX:'#27ae60', QCK:'#2980b9',
  PSY:'#8e44ad', INT:'#d35400', DUAL:'#7f8c8d', VS:'#16a085'
}
const ALL_CLASSES = [
  'Fighter','Slasher','Shooter','Free Spirit','Cerebral','Powerhouse',
  'Driven','Tanker','Striker','Navy','Pirate','Imposter'
]

interface Props {
  filters: SearchFilters
  onChange: (f: SearchFilters) => void
  onReset: () => void
  totalCount: number
  filteredCount: number
}

export function SearchPanel({ filters, onChange, onReset, totalCount, filteredCount }: Props) {
  const [expanded, setExpanded] = useState(false)

  function toggle<K extends keyof SearchFilters>(key: K, value: SearchFilters[K] extends unknown[] ? SearchFilters[K][number] : never) {
    const arr = filters[key] as unknown[]
    const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]
    onChange({ ...filters, [key]: next })
  }

  const hasFilters = filters.query || filters.types.length || filters.classes.length || filters.minStars > 0

  return (
    <div className={styles.panel}>
      <div className={styles.searchRow}>
        <div className={styles.inputWrap}>
          <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="search"
            className={styles.input}
            placeholder={`Buscar entre ${totalCount.toLocaleString()} personajes…`}
            value={filters.query}
            onChange={e => onChange({ ...filters, query: e.target.value })}
          />
          {filters.query && (
            <button className={styles.clearBtn} onClick={() => onChange({ ...filters, query: '' })} aria-label="Limpiar búsqueda">✕</button>
          )}
        </div>
        <button
          className={`${styles.filterBtn} ${expanded ? styles.filterBtnActive : ''} ${hasFilters ? styles.filterBtnDot : ''}`}
          onClick={() => setExpanded(e => !e)}
          aria-expanded={expanded}
          aria-label="Filtros avanzados"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
        </button>
      </div>

      {expanded && (
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Tipo</span>
            <div className={styles.chips}>
              {ALL_TYPES.map(t => (
                <button
                  key={t}
                  className={`${styles.chip} ${filters.types.includes(t) ? styles.chipActive : ''}`}
                  style={{ '--chip-color': TYPE_COLORS[t] } as React.CSSProperties}
                  onClick={() => toggle('types', t as never)}
                >{t}</button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Clase</span>
            <div className={styles.chips}>
              {ALL_CLASSES.map(c => (
                <button
                  key={c}
                  className={`${styles.chip} ${filters.classes.includes(c) ? styles.chipActive : ''}`}
                  onClick={() => toggle('classes', c as never)}
                >{c}</button>
              ))}
            </div>
          </div>

          <div className={styles.filterRow}>
            <div className={styles.filterGroup} style={{ flex: 1 }}>
              <span className={styles.filterLabel}>Mín. estrellas: {filters.minStars || 'cualquiera'}</span>
              <input type="range" min={0} max={6} step={1} value={filters.minStars}
                onChange={e => onChange({ ...filters, minStars: Number(e.target.value) })}
                className={styles.slider} />
            </div>
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Ordenar</span>
              <div style={{ display: 'flex', gap: 4 }}>
                <select className={styles.select} value={filters.sortBy}
                  onChange={e => onChange({ ...filters, sortBy: e.target.value as SearchFilters['sortBy'] })}>
                  <option value="id">ID</option>
                  <option value="name">Nombre</option>
                  <option value="atk">ATK</option>
                  <option value="hp">HP</option>
                  <option value="rcv">RCV</option>
                </select>
                <button className={styles.sortDirBtn}
                  onClick={() => onChange({ ...filters, sortDir: filters.sortDir === 'asc' ? 'desc' : 'asc' })}>
                  {filters.sortDir === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>

          <div className={styles.filterFooter}>
            <span className={styles.resultCount}>{filteredCount.toLocaleString()} resultado{filteredCount !== 1 ? 's' : ''}</span>
            {hasFilters && <button className={styles.resetBtn} onClick={onReset}>Limpiar filtros</button>}
          </div>
        </div>
      )}
    </div>
  )
}
