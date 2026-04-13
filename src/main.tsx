import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/global.css'

// Tema inicial (evita FOUC)
try {
  const raw = localStorage.getItem('optc_settings_v1')
  const theme = raw ? (JSON.parse(raw) as { theme?: string }).theme : null
  document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark')
} catch {
  document.documentElement.setAttribute('data-theme', 'dark')
}

const root = document.getElementById('root')
if (!root) throw new Error('No root element')

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
