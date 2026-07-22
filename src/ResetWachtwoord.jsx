import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "./supabase.js";

const NAVY = "#0B2A52";
const BORDER = "#DCD4C2";

export default function ResetWachtwoord() {
  const navigate = useNavigate();
  const [wachtwoord, setWachtwoord] = useState("");
  const [bevestig, setBevestig] = useState("");
  const [loading, setLoading] = useState(false);
  const [fout, setFout] = useState("");
  const [klaar, setKlaar] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (wachtwoord !== bevestig) { setFout("Wachtwoorden komen niet overeen."); return; }
    if (wachtwoord.length < 8) { setFout("Wachtwoord moet minimaal 8 tekens bevatten."); return; }
    setFout(""); setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: wachtwoord });
      if (error) throw error;
      setKlaar(true);
      setTimeout(() => navigate("/auth?modus=inloggen"), 3000);
    } catch (err) {
      setFout(err.message);
    } finally { setLoading(false); }
  };

  const inputStyle = { width: "100%", padding: "13px 15px", border: `1px solid ${BORDER}`, borderRadius: 4, fontSize: 15, outline: "none", fontFamily: "inherit", background: "#fff", color: "#1A1A1A", boxSizing: "border-box" };

  return (
    <div style={{ minHeight: "100vh", background: "#FAF8F4", fontFamily: "Helvetica, Arial, sans-serif" }}>
      <header style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "12px 24px" }}>
        <Link to="/"><img src="/logo.png" alt="Obrov Real Estate" style={{ height: 48, width: "auto" }} /></Link>
      </header>
      <div style={{ maxWidth: 440, margin: "60px auto", padding: "0 24px" }}>
        <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "36px 32px", boxShadow: "0 4px 24px rgba(11,42,82,0.08)" }}>
          {klaar ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✓</div>
              <p style={{ fontSize: 15, color: "#3D3D3D" }}>Wachtwoord succesvol gewijzigd. U wordt doorgestuurd...</p>
            </div>
          ) : (
            <>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700, color: NAVY, marginBottom: 20 }}>Nieuw wachtwoord instellen</div>
              {fout && <div style={{ background: "#fdf0f0", border: "1px solid #e5b0b0", color: "#8B2020", padding: "11px 14px", borderRadius: 4, fontSize: 14, marginBottom: 14 }}>{fout}</div>}
              <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: NAVY, display: "block", marginBottom: 5 }}>Nieuw wachtwoord</label>
                  <input type="password" required minLength={8} value={wachtwoord} onChange={(e) => setWachtwoord(e.target.value)} style={inputStyle} placeholder="Minimaal 8 tekens" />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: NAVY, display: "block", marginBottom: 5 }}>Bevestig wachtwoord</label>
                  <input type="password" required value={bevestig} onChange={(e) => setBevestig(e.target.value)} style={inputStyle} placeholder="Herhaal wachtwoord" />
                </div>
                <button type="submit" disabled={loading} style={{ background: NAVY, color: "#fff", border: "none", padding: "14px", borderRadius: 4, fontWeight: 700, fontSize: 15, cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1 }}>
                  {loading ? "Opslaan..." : "Wachtwoord opslaan"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
