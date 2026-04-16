import { useMemo, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUnits } from '../../hooks/useUnits'
import { useUserBox } from '../../hooks/useUserBox'
import { useFavorites } from '../../hooks/useFavorites'
import { useSearch } from '../../hooks/useSearch'
import { SearchPanel } from '../../components/SearchPanel/SearchPanel'
import { CharacterCard } from '../../components/CharacterBox/CharacterCard'
import type { ExtendedUnit } from '../../models/units'
import styles from './MyUserBox.module.css'

type ViewMode = 'all' | 'owned' | 'missing' | 'favorites'

export default function MyUserBox() {
  const { units, isLoading, loadingProgress, error, retry } = useUnits()
  const { box, add, remove } = useUserBox()
  const { favorites, toggle: toggleFav, isFavorite } = useFavorites()
  const { filters, setFilters, results, reset } = useSearch(units)
  const [viewMode, setViewMode] = useState<ViewMode>('all')
  const navigate = useNavigate()

  const ownedIds = useMemo(() => new Set(box.map(u => u.unit.id)), [box])

  const displayed = useMemo(() => {
    let list = results
    if (viewMode === 'owned')     list = list.filter(u => ownedIds.has(u.id))
    if (viewMode === 'missing')   list = list.filter(u => !ownedIds.has(u.id))
    if (viewMode === 'favorites') list = list.filter(u => favorites.has(u.id))
    return list
  }, [results, viewMode, ownedIds, favorites])

  const handleAdd    = useCallback((unit: ExtendedUnit) => add(unit), [add])
  const handleRemove = useCallback((unitId: number) => {
    const entry = box.find(u => u.unit.id === unitId)
    if (entry) remove(entry.id)
  }, [box, remove])

  if (error) return (
    <div className={styles.error} role="alert">
      <h2>Error al cargar los datos</h2>
      <p>Comprueba tu conexión o si los datos de optc-db están disponibles.</p>
      <p style={{ fontSize: '0.85rem', opacity: 0.85 }}>{error}</p>
      <button type="button" onClick={retry}>Reintentar</button>
    </div>
  )

  if (isLoading) return (
    <div className={styles.loading}>
      <div className={styles.loadingIcon}>
        <svg viewBox="0 0 100 100" width="80" height="80" fill="none">
          <circle cx="50" cy="50" r="40" stroke="var(--color-surface-offset)" strokeWidth="8"/>
          <circle cx="50" cy="50" r="40" stroke="var(--color-primary)" strokeWidth="8"
            strokeDasharray="251"
            strokeDashoffset={251 - (251 * loadingProgress / 100)}
            strokeLinecap="round" transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dashoffset 0.3s' }}
          />
          <text x="50" y="56" textAnchor="middle" fill="var(--color-primary)"
            fontSize="20" fontFamily="var(--font-display)" fontWeight="700">
            {loadingProgress}%
          </text>
        </svg>
      </div>
      <p>Cargando personajes…</p>
    </div>
  )

  return (
    <div className={styles.page}>
      <SearchPanel filters={filters} onChange={setFilters} onReset={reset}
        totalCount={units.length} filteredCount={displayed.length} />

      <div className={styles.viewTabs} role="tablist" aria-label="Vista del box">
        {(['all', 'owned', 'missing', 'favorites'] as ViewMode[]).map(m => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={viewMode === m}
            id={`box-tab-${m}`}
            className={`${styles.tab} ${viewMode === m ? styles.tabActive : ''}`}
            onClick={() => setViewMode(m)}
          >
            {m === 'all'       && `Todos (${units.length.toLocaleString()})`}
            {m === 'owned'     && `Mi box (${box.length})`}
            {m === 'missing'   && 'Sin conseguir'}
            {m === 'favorites' && `♥ Favs (${favorites.size})`}
          </button>
        ))}
      </div>

      {displayed.length === 0 ? (
        <div className={styles.empty}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <h3>Sin resultados</h3>
          <p>Prueba a cambiar los filtros o el texto de búsqueda.</p>
          <button className={styles.resetBtn} onClick={reset}>Limpiar filtros</button>
        </div>
      ) : (
        <div className={styles.grid}>
          {displayed.map(unit => (
            <CharacterCard key={unit.id} unit={unit}
              userUnit={box.find(u => u.unit.id === unit.id)}
              isFavorite={isFavorite(unit.id)}
              isOwned={ownedIds.has(unit.id)}
              onAdd={() => handleAdd(unit)}
              onRemove={() => handleRemove(unit.id)}
              onFavorite={() => toggleFav(unit.id)}
              onClick={() => navigate(`/detail/${unit.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
