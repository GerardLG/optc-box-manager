import { memo } from 'react'
import type { ExtendedUnit } from '../../models/units'
import type { UserUnit } from '../../models/userBox'
import { UnitImage } from '../Image'
import styles from './CharacterCard.module.css'

interface Props {
  unit: ExtendedUnit
  userUnit?: UserUnit
  isOwned: boolean
  isFavorite: boolean
  onAdd: () => void
  onRemove: () => void
  onFavorite: () => void
  onClick: () => void
}

export const CharacterCard = memo(function CharacterCard({
  unit, userUnit, isOwned, isFavorite, onAdd, onRemove, onFavorite, onClick
}: Props) {
  const typeArr = Array.isArray(unit.type) ? unit.type : [unit.type]
  const mainType = typeArr[0]

  return (
    <div
      className={`${styles.card} ${isOwned ? styles.owned : ''}`}
      data-type={mainType}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      aria-label={unit.name}
    >
      <div className={styles.imageWrap}>
        <UnitImage unitId={unit.id} name={unit.name} size={80} className={styles.img} />
        {isOwned && <span className={styles.ownedBadge}>✓</span>}
        <button
          className={`${styles.favBtn} ${isFavorite ? styles.favActive : ''}`}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          onClick={e => { e.stopPropagation(); onFavorite() }}
        >♥</button>
      </div>
      <div className={styles.info}>
        <span className={styles.name}>{unit.name}</span>
        <span className={styles.id}>#{String(unit.id).padStart(4, '0')}</span>
      </div>
      <div className={styles.actions}>
        {isOwned
          ? <button className={`${styles.btn} ${styles.btnRemove}`}
              aria-label="Quitar del box"
              onClick={e => { e.stopPropagation(); onRemove() }}>✕</button>
          : <button className={`${styles.btn} ${styles.btnAdd}`}
              aria-label="Añadir al box"
              onClick={e => { e.stopPropagation(); onAdd() }}>+</button>
        }
      </div>
      {userUnit && (
        <div className={styles.lvl}>Lv {userUnit.level.lvl}</div>
      )}
    </div>
  )
})
