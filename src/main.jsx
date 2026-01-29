import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// No importamos index.css aquí porque todos los estilos críticos están en App.jsx
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)