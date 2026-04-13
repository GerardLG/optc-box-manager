import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { AppShell } from './components/Layout'

const MyUserBox      = lazy(() => import('./pages/MyUserBox/MyUserBox'))
const Detail         = lazy(() => import('./pages/Detail/Detail'))
const AppManagement  = lazy(() => import('./pages/AppManagement/AppManagement'))
const Settings       = lazy(() => import('./pages/Settings/Settings'))

function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60dvh', color: 'var(--color-text-faint)', fontFamily: 'var(--font-body)' }}>
      Cargando…
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Suspense fallback={<PageLoader />}><MyUserBox /></Suspense>} />
        <Route path="manage" element={<Suspense fallback={<PageLoader />}><AppManagement /></Suspense>} />
        <Route path="settings" element={<Suspense fallback={<PageLoader />}><Settings /></Suspense>} />
      </Route>
      <Route path="detail/:id" element={<Suspense fallback={<PageLoader />}><Detail /></Suspense>} />
    </Routes>
  )
}
