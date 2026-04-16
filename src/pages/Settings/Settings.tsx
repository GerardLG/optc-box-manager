import { useState } from 'react'
import { loadSettings, saveSettings, isStoragePersisted, type AppSettings } from '../../services/storage'
import { applyDocumentTheme } from '../../services/theme'
import styles from './Settings.module.css'

export default function Settings() {
  const [settings, setSettings] = useState<AppSettings>(loadSettings)
  const persisted = isStoragePersisted()

  function update<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    const next = { ...settings, [key]: value }
    setSettings(next)
    saveSettings(next)
    if (key === 'theme') applyDocumentTheme(value as 'light' | 'dark')
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Ajustes</h1>

      {!persisted && (
        <div className={styles.storageWarning}>
          ⚠️ <strong>Almacenamiento limitado:</strong> localStorage no está disponible en este entorno.
          Los datos del box se guardan en memoria y se perderán al recargar.
          Usa <strong>Exportar JSON</strong> para guardar tu progreso.
        </div>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Apariencia</h2>
        <div className={styles.row}>
          <div className={styles.rowInfo}>
            <span className={styles.rowLabel}>Tema</span>
            <span className={styles.rowDesc}>Oscuro o claro</span>
          </div>
          <div className={styles.toggle}>
            <button className={`${styles.themeBtn} ${settings.theme === 'dark'  ? styles.themeBtnActive : ''}`} onClick={() => update('theme', 'dark')} >🌙 Oscuro</button>
            <button className={`${styles.themeBtn} ${settings.theme === 'light' ? styles.themeBtnActive : ''}`} onClick={() => update('theme', 'light')}>☀️ Claro</button>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.rowInfo}>
            <span className={styles.rowLabel}>Tamaño de carta</span>
            <span className={styles.rowDesc}>Grid de personajes</span>
          </div>
          <div className={styles.toggle}>
            {(['small','medium','large'] as const).map(s => (
              <button key={s} className={`${styles.themeBtn} ${settings.gridSize === s ? styles.themeBtnActive : ''}`} onClick={() => update('gridSize', s)}>
                {s === 'small' ? 'S' : s === 'medium' ? 'M' : 'L'}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Región</h2>
        <label className={styles.checkRow}><input type="checkbox" checked={settings.showGlobal} onChange={e => update('showGlobal', e.target.checked)} /><span>Mostrar personajes Global</span></label>
        <label className={styles.checkRow}><input type="checkbox" checked={settings.showJapan}  onChange={e => update('showJapan',  e.target.checked)} /><span>Mostrar personajes Japan Only</span></label>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Acerca de</h2>
        <p className={styles.about}>OPTC Box Manager — datos de <a href="https://github.com/optc-db/optc-db" target="_blank" rel="noopener noreferrer">optc-db community</a>. Imágenes: <a href="https://github.com/2Shankz/optc-db.github.io" target="_blank" rel="noopener noreferrer">2Shankz mirror</a>.</p>
      </section>
    </div>
  )
}
