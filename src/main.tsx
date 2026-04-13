import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/global.css'

// Apply saved theme immediately to avoid flash
;(function () {
  try {
    const s = localStorage.getItem('optc_settings_v1')
    const theme = s ? JSON.parse(s).theme : null
    if (theme) document.documentElement.setAttribute('data-theme', theme)
  } catch { /* ignore */ }
})()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
