import type { ExtendedUnit } from '../../models/units'
import type { UserUnit } from '../../models/userBox'
import { UnitImage } from '../Image'
import { TypeBadge } from '../Type'
import styles from './CharacterCard.module.css'

interface Props {
  unit: ExtendedUnit
  userUnit?: UserUnit
  isFavorite: boolean
  isOwned: boolean
  onAdd: () => void
  onRemove: () => void
  onFavorite: () => void
  onClick: () => void
}

export function CharacterCard({ unit, userUnit, isFavorite, isOwned, onAdd, onRemove, onFavorite, onClick }: Props) {
  return (
    <div
      className={`${styles.card} ${isOwned ? styles.cardOwned : ''}`}
      role="button" tabIndex={0}
      aria-label={`${unit.name}, ID ${unit.id}`}
      onClick={onClick}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      <div className={styles.imageWrap}>
        <UnitImage unitId={unit.id} name={unit.name} size={90} className={styles.image} />
        <button
          className={`${styles.favBtn} ${isFavorite ? styles.favBtnActive : ''}`}
          onClick={e => { e.stopPropagation(); onFavorite() }}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >♥</button>
        {isOwned
          ? <button className={styles.removeBtn} onClick={e => { e.stopPropagation(); onRemove() }} aria-label="Quitar del box">✕</button>
          : <button className={styles.addBtn} onClick={e => { e.stopPropagation(); onAdd() }} aria-label="Añadir al box">+</button>
        }
        <div className={styles.typeBadge}><TypeBadge type={unit.type} size={18} /></div>
      </div>
      <div className={styles.info}>
        <span className={styles.name}>{unit.name}</span>
        {isOwned && userUnit && <span className={styles.level}>Lv {userUnit.level.lvl}</span>}
      </div>
    </div>
  )
}
