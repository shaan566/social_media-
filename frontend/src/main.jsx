import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// Note: Utility initializations moved to App.jsx for Fast Refresh compatibility
// Reference: https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react#consistent-components-exports
import AuthProvider from "./store/Authprovider.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <App />
    </AuthProvider>
  </StrictMode>,
)
