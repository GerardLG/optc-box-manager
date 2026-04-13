import { useState } from 'react'
import type { SearchFilters } from '../../hooks/useSearch'
import { UnitTypes, UnitClasses, Rarity } from '../../models/units'
import type { UnitType, UnitClass, UnitStar } from '../../models/units'
import styles from './SearchPanel.module.css'

interface Props {
  filters: SearchFilters
  onChange: (f: SearchFilters) => void
  onReset: () => void
  totalCount: number
  filteredCount: number
}

const TYPE_COLORS: Record<string, string> = {
  STR:'#e63946', DEX:'#2ecc71', QCK:'#3498db', PSY:'#9b59b6',
  INT:'#f39c12', DUAL:'#7f8c8d', VS:'#16a085',
}

export function SearchPanel({ filters, onChange, onReset, totalCount, filteredCount }: Props) {
  const [open, setOpen] = useState(false)

  const toggleType = (t: UnitType) => onChange({ ...filters, types: filters.types.includes(t) ? filters.types.filter(x => x !== t) : [...filters.types, t] })
  const toggleStar = (s: UnitStar) => onChange({ ...filters, stars: filters.stars.includes(s) ? filters.stars.filter(x => x !== s) : [...filters.stars, s] })
  const toggleClass = (c: UnitClass) => onChange({ ...filters, classes: filters.classes.includes(c) ? filters.classes.filter(x => x !== c) : [...filters.classes, c] })

  const hasFilters = filters.query || filters.types.length || filters.stars.length || filters.classes.length || filters.onlyGlobal || filters.onlyJapan || filters.onlyRR

  return (
    <div className={styles.panel}>
      <div className={styles.topBar}>
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="search" className={styles.searchInput}
            placeholder="Buscar por nombre o #ID..."
            value={filters.query}
            onChange={e => onChange({ ...filters, query: e.target.value })}
          />
          {filters.query && <button className={styles.clearBtn} onClick={() => onChange({ ...filters, query: '' })}>✕</button>}
        </div>
        <button
          className={`${styles.filterToggle} ${open ? styles.filterToggleActive : ''}`}
          onClick={() => setOpen(o => !o)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          Filtros
          {hasFilters && <span className={styles.filterDot} />}
        </button>
      </div>

      {open && (
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Tipo</span>
            <div className={styles.chips}>
              {UnitTypes.map(t => (
                <button key={t}
                  className={`${styles.chip} ${filters.types.includes(t) ? styles.chipActive : ''}`}
                  style={filters.types.includes(t)
                    ? { background: TYPE_COLORS[t], borderColor: TYPE_COLORS[t], color:'#fff' }
                    : { borderColor: TYPE_COLORS[t] + '66' }}
                  onClick={() => toggleType(t)}>{t}</button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Rareza</span>
            <div className={styles.chips}>
              {Rarity.map(r => (
                <button key={r}
                  className={`${styles.chip} ${filters.stars.includes(r as UnitStar) ? styles.chipActive : ''}`}
                  onClick={() => toggleStar(r as UnitStar)}>{r}★</button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Clase</span>
            <div className={styles.chips}>
              {UnitClasses.map(c => (
                <button key={c}
                  className={`${styles.chip} ${filters.classes.includes(c as UnitClass) ? styles.chipActive : ''}`}
                  onClick={() => toggleClass(c as UnitClass)}>{c}</button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Pool</span>
            <div className={styles.chips}>
              <button className={`${styles.chip} ${filters.onlyGlobal ? styles.chipActive : ''}`} onClick={() => onChange({ ...filters, onlyGlobal: !filters.onlyGlobal })}>Global</button>
              <button className={`${styles.chip} ${filters.onlyJapan ? styles.chipActive : ''}`} onClick={() => onChange({ ...filters, onlyJapan: !filters.onlyJapan })}>Japan</button>
              <button className={`${styles.chip} ${filters.onlyRR ? styles.chipActive : ''}`} onClick={() => onChange({ ...filters, onlyRR: !filters.onlyRR })}>Rare Recruit</button>
            </div>
          </div>

          <div className={styles.filterFooter}>
            <span className={styles.count}>{filteredCount} / {totalCount} personajes</span>
            {hasFilters && <button className={styles.resetBtn} onClick={onReset}>Limpiar filtros</button>}
          </div>
        </div>
      )}
      {!open && <p className={styles.countBar}>{filteredCount.toLocaleString()} personajes{hasFilters ? ' (filtrado)' : ''}</p>}
    </div>
  )
}
