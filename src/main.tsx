import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/global.css'

// Apply saved theme immediately to avoid FOUC
;(function () {
  try {
    const s = localStorage.getItem('optc_settings_v1')
    const theme = s ? JSON.parse(s).theme : null
    if (theme) document.documentElement.setAttribute('data-theme', theme)
  } catch { /* ignore */ }
})()

// Handle SPA redirect from 404.html
;(function () {
  const params = new URLSearchParams(window.location.search)
  const redirect = params.get('redirect')
  if (redirect) {
    window.history.replaceState(null, '', '/optc-box-manager' + redirect)
  }
})()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/optc-box-manager">
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
