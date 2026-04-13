import { useRef, useState } from 'react'
import { useUserBox } from '../../hooks/useUserBox'
import styles from './AppManagement.module.css'

export default function AppManagement() {
  const { box, exportDB, importDB, reset } = useUserBox()
  const fileRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)

  function notify(text: string, ok: boolean) {
    setMessage({ text, ok })
    setTimeout(() => setMessage(null), 3500)
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Gestión de datos</h1>

      {message && (
        <div className={`${styles.toast} ${message.ok ? styles.toastOk : styles.toastErr}`}>{message.text}</div>
      )}

      <section className={styles.card}>
        <div className={styles.cardIcon}>📦</div>
        <div className={styles.cardBody}>
          <h2>Exportar box</h2>
          <p>Descarga un archivo JSON con todos tus personajes, niveles y Cotton Candy.</p>
          <p className={styles.meta}>{box.length} personajes en tu box actual</p>
        </div>
        <button className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={async () => { await exportDB(); notify('Box exportado ✓', true) }}
          disabled={box.length === 0}>
          ↓ Exportar JSON
        </button>
      </section>

      <section className={styles.card}>
        <div className={styles.cardIcon}>📂</div>
        <div className={styles.cardBody}>
          <h2>Importar box</h2>
          <p>Carga un JSON exportado previamente. Compatible con el formato de Nagarian.</p>
        </div>
        <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => fileRef.current?.click()}>↑ Importar JSON</button>
        <input ref={fileRef} type="file" accept=".json" hidden onChange={e => {
          const file = e.target.files?.[0]; if (!file) return
          const reader = new FileReader()
          reader.onload = ev => {
            try { importDB(ev.target?.result as string); notify(`Box importado ✓`, true) }
            catch (err) { notify(`Error: ${String(err)}`, false) }
          }
          reader.readAsText(file); e.target.value = ''
        }} />
      </section>

      <section className={`${styles.card} ${styles.cardDanger}`}>
        <div className={styles.cardIcon}>⚠️</div>
        <div className={styles.cardBody}>
          <h2>Reiniciar box</h2>
          <p>Elimina <strong>todos</strong> los personajes. Esta acción no se puede deshacer.</p>
        </div>
        <button
          className={`${styles.btn} ${confirmReset ? styles.btnDanger : styles.btnOutlineDanger}`}
          onClick={() => { if (!confirmReset) { setConfirmReset(true); return } reset(); setConfirmReset(false); notify('Box reiniciado ✓', true) }}>
          {confirmReset ? '⚠️ Confirmar reset' : '✕ Reiniciar'}
        </button>
        {confirmReset && <button className={styles.cancelBtn} onClick={() => setConfirmReset(false)}>Cancelar</button>}
      </section>
    </div>
  )
}
