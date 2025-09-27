// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import Auth from './components/Auth.jsx'
import Pages from './pages/index.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth>
      <Pages />
    </Auth>
  </React.StrictMode>,
)