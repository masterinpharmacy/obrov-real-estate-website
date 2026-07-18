import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import DeveloperPage from './DeveloperPage.jsx'
import AanbodPagina from './AanbodPagina.jsx'
import WoningDetail from './WoningDetail.jsx'
import WoningPlaatsen from './WoningPlaatsen.jsx'
import AuthPagina from './AuthPagina.jsx'
import ResetWachtwoord from './ResetWachtwoord.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/developers" element={<DeveloperPage />} />
        <Route path="/ontwikkelaars" element={<DeveloperPage />} />
        <Route path="/aanbod" element={<AanbodPagina />} />
        <Route path="/aanbod/:id" element={<WoningDetail />} />
        <Route path="/woning-plaatsen" element={<WoningPlaatsen />} />
        <Route path="/woning-plaatsen/succes" element={<WoningPlaatsenSucces />} />
        <Route path="/auth" element={<AuthPagina />} />
        <Route path="/auth/reset" element={<ResetWachtwoord />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)

function WoningPlaatsenSucces() {
  return (
    <div style={{ fontFamily: "Helvetica, Arial, sans-serif", background: "#FAF8F4", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>✓</div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: 28, color: "#0B2A52", margin: "0 0 16px" }}>Woning geplaatst!</h1>
        <p style={{ fontSize: 15, color: "#3D3D3D", lineHeight: 1.7, marginBottom: 24 }}>
          Uw woning is nu zichtbaar op Obrov Real Estate. Wij nemen binnen twee werkdagen contact op.
        </p>
        <a href="/aanbod" style={{ background: "#0B2A52", color: "#fff", padding: "14px 28px", borderRadius: 4, textDecoration: "none", fontWeight: 700, fontSize: 15 }}>
          Bekijk het aanbod
        </a>
      </div>
    </div>
  );
}
