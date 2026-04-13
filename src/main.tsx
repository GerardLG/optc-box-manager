import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/global.css'

// Apply saved theme immediately to avoid FOUC
;(function () {
  try {
    const raw = localStorage.getItem('optc_settings_v1')
    const theme = raw ? (JSON.parse(raw) as { theme?: string }).theme : null
    if (theme === 'light' || theme === 'dark') {
      document.documentElement.setAttribute('data-theme', theme)
    } else {
      // default dark
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  } catch {
    document.documentElement.setAttribute('data-theme', 'dark')
  }
})()

// Handle GitHub Pages 404 SPA redirect
;(function () {
  try {
    const params = new URLSearchParams(window.location.search)
    const redirect = params.get('redirect')
    if (redirect) {
      const base = import.meta.env.BASE_URL.replace(/\/$/, '')
      window.history.replaceState(null, '', base + redirect)
    }
  } catch { /* ignore */ }
})()

const root = document.getElementById('root')
if (!root) throw new Error('No se encontró el elemento #root en el HTML')

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
