import { NavLink, Outlet } from 'react-router-dom'
import styles from './Layout.module.css'

export function Layout() {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.logo}>
          {/* Sombrero de paja de Luffy */}
          <svg width="34" height="28" viewBox="0 0 68 52" fill="none" aria-label="OPTC Box Manager">
            {/* Ala izquierda */}
            <path d="M2 36 C8 28, 18 26, 26 28 L22 38 C14 38, 6 40, 2 36Z"
              fill="var(--color-primary)" stroke="var(--color-primary-hover)" strokeWidth="1.2" />
            {/* Ala derecha */}
            <path d="M66 36 C60 28, 50 26, 42 28 L46 38 C54 38, 62 40, 66 36Z"
              fill="var(--color-primary)" stroke="var(--color-primary-hover)" strokeWidth="1.2" />
            {/* Copa del sombrero */}
            <path d="M20 30 C20 12, 48 12, 48 30 L46 34 C44 36, 24 36, 22 34 Z"
              fill="var(--color-primary)" stroke="var(--color-primary-hover)" strokeWidth="1.2" />
            {/* Banda roja */}
            <path d="M22 33 C26 30, 42 30, 46 33"
              stroke="#cc2222" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Borde del ala — línea continua */}
            <path d="M2 36 C10 42, 28 42, 34 40 C40 42, 58 42, 66 36"
              stroke="var(--color-primary-hover)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </svg>
          <span>OPTC Box</span>
        </div>
        <button data-theme-toggle className={styles.themeToggle} aria-label="Cambiar tema">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>
      </header>

      <main className={styles.main}><Outlet /></main>

      <nav className={styles.nav} role="navigation" aria-label="Navegación principal">
        <NavLink to="/" end className={({ isActive }) => isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
          <span>Box</span>
        </NavLink>
        <NavLink to="/manage" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <span>Datos</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          <span>Ajustes</span>
        </NavLink>
      </nav>
    </div>
  )
}
