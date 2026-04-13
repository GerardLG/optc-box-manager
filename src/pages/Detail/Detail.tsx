import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useUnits } from '../../hooks/useUnits'
import { useUserBox } from '../../hooks/useUserBox'
import { UnitImage } from '../../components/Image'
import { TypeBadge } from '../../components/Type'
import type { UserUnit } from '../../models/userBox'
import type { ExtendedUnit } from '../../models/units'
import styles from './Detail.module.css'

export default function Detail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { units } = useUnits()
  const { box, add, update, remove } = useUserBox()

  const unit = units.find(u => u.id === Number(id))
  const userUnit = box.find(u => u.unit.id === Number(id))
  const [tab, setTab] = useState<'info' | 'skills' | 'progress'>('info')

  if (!unit) return (
    <div className={styles.notFound}>
      <p>Personaje no encontrado</p>
      <button onClick={() => navigate(-1)}>← Volver</button>
    </div>
  )

  const isOwned = !!userUnit
  const typeColor: Record<string, string> = { STR:'#e63946', DEX:'#2ecc71', QCK:'#3498db', PSY:'#9b59b6', INT:'#f39c12', DUAL:'#7f8c8d', VS:'#16a085' }
  const mainType = Array.isArray(unit.type) ? unit.type[0] : unit.type

  return (
    <div className={styles.page}>
      <div className={styles.hero} style={{ '--type-color': typeColor[mainType] } as React.CSSProperties}>
        <button className={styles.back} onClick={() => navigate(-1)} aria-label="Volver">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <div className={styles.heroContent}>
          <UnitImage unitId={unit.id} name={unit.name} size={120} className={styles.heroImage} />
          <div className={styles.heroInfo}>
            <div className={styles.heroMeta}>
              <span className={styles.heroId}>#{String(unit.id).padStart(4,'0')}</span>
              <TypeBadge type={unit.type} size={22} />
              <span className={styles.heroStars}>{'\u2605'.repeat(Math.min(Number(unit.stars),6))}</span>
            </div>
            <h1 className={styles.heroName}>{unit.name}</h1>
            <div className={styles.heroClass}>
              {Array.isArray(unit.class) ? (unit.class as string[]).flat().join(' / ') : String(unit.class)}
            </div>
          </div>
        </div>
        <div className={styles.heroActions}>
          {isOwned
            ? <button className={`${styles.actionBtn} ${styles.actionBtnRemove}`} onClick={() => { if (userUnit) remove(userUnit.id) }}>✕ Quitar del box</button>
            : <button className={`${styles.actionBtn} ${styles.actionBtnAdd}`} onClick={() => add(unit)}>+ Añadir al box</button>
          }
        </div>
      </div>

      <div className={styles.tabs}>
        {(['info', 'skills', 'progress'] as const).map(t => (
          <button key={t} className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`} onClick={() => setTab(t)}>
            {t === 'info' && 'Estadísticas'}
            {t === 'skills' && 'Habilidades'}
            {t === 'progress' && 'Mi progreso'}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {tab === 'info' && (
          <div>
            <h2 className={styles.sectionTitle}>Stats base</h2>
            <div className={styles.statsGrid}>
              {[['HP','#e74c3c', unit.minHP, unit.maxHP, unit.limitHP],
                ['ATK','#e67e22', unit.minATK, unit.maxATK, unit.limitATK],
                ['RCV','#2ecc71', unit.minRCV, unit.maxRCV, unit.limitRCV]
              ].map(([label, color, min, max, limit]) => (
                <div key={String(label)} className={styles.statRow}>
                  <span className={styles.statLabel} style={{ color: String(color) }}>{String(label)}</span>
                  <div className={styles.statValues}>
                    <span className={styles.statMin}>{Number(min).toLocaleString()}</span>
                    <span className={styles.statSep}>→</span>
                    <span className={styles.statMax}>{Number(max).toLocaleString()}</span>
                    {Number(limit) > Number(max) && <><span className={styles.statSep}>/ LB</span><span className={styles.statLimit} style={{ color: String(color) }}>{Number(limit).toLocaleString()}</span></>}
                  </div>
                </div>
              ))}
            </div>
            <h2 className={styles.sectionTitle}>Info</h2>
            <div className={styles.infoGrid}>
              {[['Coste', unit.cost],['Max Lv', unit.maxLevel],['Slots', unit.slots],['Combo', unit.combo]].map(([l,v]) => (
                <div key={String(l)} className={styles.infoCell}>
                  <span className={styles.infoCellLabel}>{String(l)}</span>
                  <span className={styles.infoCellValue}>{String(v)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'skills' && (
          <div className={styles.skillsSection}>
            {unit.detail.captain && <SkillBlock title="Capitán" icon="⚓" text={unit.detail.captain} color="#d4a017" />}
            {unit.detail.special && <SkillBlock title={`Special${unit.detail.specialName ? ` — ${unit.detail.specialName}` : ''}`} icon="⚡" text={unit.detail.special} color="#3498db" cooldown={unit.cooldown} />}
            {unit.detail.sailor && <SkillBlock title="Sailor" icon="🛢️" text={typeof unit.detail.sailor === 'string' ? unit.detail.sailor : (unit.detail.sailor as {base?:string})?.base ?? ''} color="#2ecc71" />}
            {unit.detail.superSpecial && <SkillBlock title="Super Special" icon="💥" text={unit.detail.superSpecial} color="#9b59b6" />}
            {unit.detail.potential && unit.detail.potential.length > 0 && (
              <div className={styles.skillBlock} style={{ '--skill-color': '#f39c12' } as React.CSSProperties}>
                <h3 className={styles.skillTitle}><span>🌟</span> Potenciales</h3>
                {unit.detail.potential.map((p, i) => (
                  <div key={i} className={styles.potentialRow}>
                    <span className={styles.potentialName}>{p.Name}</span>
                    {p.description.map((d, j) => <p key={j} className={styles.potentialDesc}>Lvl {j+1}: {d}</p>)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'progress' && (
          <div>
            {!isOwned ? (
              <div className={styles.notOwned}>
                <p>Aún no tienes este personaje en tu box.</p>
                <button className={`${styles.actionBtn} ${styles.actionBtnAdd}`} onClick={() => add(unit)}>+ Añadir al box</button>
              </div>
            ) : (
              <ProgressEditor userUnit={userUnit} unit={unit} onUpdate={update} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function SkillBlock({ title, icon, text, color, cooldown }: { title:string; icon:string; text:string; color:string; cooldown?:[number,number] }) {
  return (
    <div className={styles.skillBlock} style={{ '--skill-color': color } as React.CSSProperties}>
      <h3 className={styles.skillTitle}>
        <span>{icon}</span> {title}
        {cooldown && cooldown[0] > 0 && <span className={styles.cooldown}>CD: {cooldown[1]} → {cooldown[0]}</span>}
      </h3>
      <p className={styles.skillText}>{text}</p>
    </div>
  )
}

function ProgressEditor({ userUnit, unit, onUpdate }: { userUnit: UserUnit; unit: ExtendedUnit; onUpdate: (u: UserUnit) => void }) {
  const [level, setLevel] = useState(userUnit.level.lvl)
  const [ccHp, setCcHp]   = useState(userUnit.cc.hp)
  const [ccAtk, setCcAtk] = useState(userUnit.cc.atk)
  const [ccRcv, setCcRcv] = useState(userUnit.cc.rcv)

  return (
    <div className={styles.progressEditor}>
      <div className={styles.editGroup}>
        <label className={styles.editLabel}>Nivel actual</label>
        <div className={styles.editRow}>
          <input type="range" min={1} max={unit.maxLevel} value={level}
            onChange={e => setLevel(Number(e.target.value))} className={styles.slider} />
          <span className={styles.editValue}>{level} / {unit.maxLevel}</span>
        </div>
      </div>
      <h3 className={styles.editSection}>Cotton Candy</h3>
      <div className={styles.ccGrid}>
        {([['HP','#e74c3c',ccHp,setCcHp],['ATK','#e67e22',ccAtk,setCcAtk],['RCV','#2ecc71',ccRcv,setCcRcv]] as [string,string,number,(v:number)=>void][]).map(([l,c,v,fn]) => (
          <div key={l} className={styles.ccInput}>
            <span className={styles.ccLabel} style={{ color:c }}>{l}</span>
            <div className={styles.ccControls}>
              <button onClick={() => fn(Math.max(0, v-1))}>-</button>
              <input type="number" min={0} max={200} value={v} onChange={e => fn(Math.max(0, Math.min(200, Number(e.target.value))))} />
              <button onClick={() => fn(Math.min(200, v+1))}>+</button>
            </div>
          </div>
        ))}
      </div>
      <button className={styles.saveBtn} onClick={() => onUpdate({ ...userUnit, level: { ...userUnit.level, lvl: level }, cc: { hp: ccHp, atk: ccAtk, rcv: ccRcv } })}>Guardar cambios</button>
    </div>
  )
}
