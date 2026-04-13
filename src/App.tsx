import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy, Component, type ReactNode, type ErrorInfo } from 'react'
import { AppShell } from './components/Layout'

// ── Error Boundary ───────────────────────────────────────────────────
class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null }
  static getDerivedStateFromError(error: Error) { return { error } }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('[OPTC]', error, info) }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: '100dvh', gap: '1rem',
          padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif',
          background: '#171614', color: '#cdccca'
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d163a7" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <h2 style={{ color: '#d163a7' }}>Algo ha fallado</h2>
          <pre style={{ fontSize: '12px', color: '#797876', maxWidth: '80vw', whiteSpace: 'pre-wrap' }}>
            {String((this.state.error as Error).message)}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 24px', background: '#4f98a3', color: '#171614',
              border: 'none', borderRadius: '9999px', fontWeight: 700,
              cursor: 'pointer', fontSize: '14px'
            }}
          >Recargar</button>
        </div>
      )
    }
    return this.props.children
  }
}

// ── Lazy pages ─────────────────────────────────────────────────────────
const MyUserBox     = lazy(() => import('./pages/MyUserBox/MyUserBox'))
const Detail        = lazy(() => import('./pages/Detail/Detail'))
const AppManagement = lazy(() => import('./pages/AppManagement/AppManagement'))
const Settings      = lazy(() => import('./pages/Settings/Settings'))

function Loader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '60dvh', color: '#5a5957', fontFamily: 'sans-serif'
    }}>
      Cargando…
    </div>
  )
}

function Wrap({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loader />}>{children}</Suspense>
    </ErrorBoundary>
  )
}

// ── Router ──────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Wrap><MyUserBox /></Wrap>} />
          <Route path="manage"   element={<Wrap><AppManagement /></Wrap>} />
          <Route path="settings" element={<Wrap><Settings /></Wrap>} />
        </Route>
        <Route path="detail/:id" element={<Wrap><Detail /></Wrap>} />
      </Routes>
    </ErrorBoundary>
  )
}
