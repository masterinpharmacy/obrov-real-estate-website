import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import DeveloperPage from './DeveloperPage.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/developers" element={<DeveloperPage />} />
        <Route path="/ontwikkelaars" element={<DeveloperPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
