import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy, Component, type ReactNode, type ErrorInfo } from 'react'
import { Layout } from './components/Layout'
import { GithubPagesRedirect } from './components/GithubPagesRedirect'

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
          <h2 style={{ color: '#d163a7' }}>Error al cargar</h2>
          <pre style={{ fontSize: '12px', color: '#797876', maxWidth: '80vw', whiteSpace: 'pre-wrap' }}>
            {String((this.state.error as Error).message)}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: '8px 24px', background: '#4f98a3', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >Recargar</button>
        </div>
      )
    }
    return this.props.children
  }
}

const MyUserBox     = lazy(() => import('./pages/MyUserBox/MyUserBox'))
const Detail        = lazy(() => import('./pages/Detail/Detail'))
const AppManagement = lazy(() => import('./pages/AppManagement/AppManagement'))
const Settings      = lazy(() => import('./pages/Settings/Settings'))

function Loader() {
  return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60dvh', color:'#5a5957' }}>Cargando…</div>
}

function Wrap({ children }: { children: ReactNode }) {
  return <ErrorBoundary><Suspense fallback={<Loader />}>{children}</Suspense></ErrorBoundary>
}

export default function App() {
  return (
    <ErrorBoundary>
      <GithubPagesRedirect />
      <Routes>
        <Route element={<Layout />}>
          <Route index         element={<Wrap><MyUserBox /></Wrap>} />
          <Route path="manage"   element={<Wrap><AppManagement /></Wrap>} />
          <Route path="settings" element={<Wrap><Settings /></Wrap>} />
        </Route>
        <Route path="detail/:id" element={<Wrap><Detail /></Wrap>} />
      </Routes>
    </ErrorBoundary>
  )
}
