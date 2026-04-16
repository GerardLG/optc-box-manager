import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/global.css'
import { applyDocumentTheme, getSavedTheme } from './services/theme'

// Tema inicial (misma fuente que Layout / Ajustes; evita FOUC)
try {
  applyDocumentTheme(getSavedTheme())
} catch {
  applyDocumentTheme('dark')
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
