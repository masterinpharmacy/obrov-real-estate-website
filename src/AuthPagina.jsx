import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase, supabaseConfigured } from "./supabase.js";

const NAVY = "#0B2A52";
const GOLD = "#AC9362";
const BORDER = "#DCD4C2";

const inputStyle = {
  width: "100%",
  padding: "13px 15px",
  border: `1px solid ${BORDER}`,
  borderRadius: 4,
  fontSize: 15,
  outline: "none",
  fontFamily: "inherit",
  background: "#fff",
  color: "#1A1A1A",
  boxSizing: "border-box",
};

export default function AuthPagina() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initModus = params.get("modus") || "inloggen";
  const redirect = params.get("redirect") || "/aanbod";

  const [modus, setModus] = useState(initModus); // inloggen | registreren | vergeten | bevestigd
  const [naam, setNaam] = useState("");
  const [email, setEmail] = useState("");
  const [wachtwoord, setWachtwoord] = useState("");
  const [onthoud, setOnthoud] = useState(true);
  const [accountType, setAccountType] = useState("particulier"); // particulier | makelaar_starter | makelaar_pro
  const [loading, setLoading] = useState(false);
  const [fout, setFout] = useState("");
  const [succes, setSucces] = useState("");

  // Check of al ingelogd
  useEffect(() => {
    if (!supabaseConfigured || !supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate(redirect);
    });
  }, []);

  const handleInloggen = async (e) => {
    e.preventDefault();
    setFout(""); setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email, password: wachtwoord,
        options: { persistSession: onthoud },
      });
      if (error) throw error;
      navigate(redirect);
    } catch (err) {
      setFout(err.message === "Invalid login credentials"
        ? "E-mailadres of wachtwoord klopt niet."
        : err.message);
    } finally { setLoading(false); }
  };

  const handleRegistreren = async (e) => {
    e.preventDefault();
    setFout(""); setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email, password: wachtwoord,
        options: {
          data: { naam, account_type: "particulier" },
          emailRedirectTo: `${window.location.origin}/auth?modus=inloggen&redirect=${redirect}`,
        },
      });
      if (error) throw error;

      // Admin notificatie via Resend API
      await fetch("/api/auth-notificatie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "registratie", naam, email }),
      }).catch(() => {}); // stil falen

      setModus("bevestigd");
    } catch (err) {
      setFout(err.message.includes("already registered")
        ? "Dit e-mailadres is al geregistreerd. Probeer in te loggen."
        : err.message);
    } finally { setLoading(false); }
  };

  const handleVergeten = async (e) => {
    e.preventDefault();
    setFout(""); setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset`,
      });
      if (error) throw error;
      setSucces("Controleer uw inbox voor de resetlink.");
    } catch (err) {
      setFout(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FAF8F4", fontFamily: "Helvetica, Arial, sans-serif", overflowX: "hidden" }}>
      {/* Navbar */}
      <header style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/"><img src="/logo.png" alt="Obrov Real Estate" style={{ height: 48, width: "auto" }} /></Link>
        <Link to="/aanbod" style={{ fontSize: 14, color: NAVY, textDecoration: "none", fontWeight: 500 }}>← Terug naar aanbod</Link>
      </header>

      <div style={{ maxWidth: 440, margin: "40px auto", padding: "0 16px 80px" }}>
        {/* Card */}
        <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "clamp(20px, 5vw, 36px) clamp(16px, 5vw, 32px)", boxShadow: "0 4px 24px rgba(11,42,82,0.08)" }}>

          {/* Logo accent */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700, color: NAVY }}>
              {modus === "inloggen" && "Inloggen"}
              {modus === "registreren" && "Account aanmaken"}
              {modus === "vergeten" && "Wachtwoord vergeten"}
              {modus === "bevestigd" && "Bevestig uw e-mail"}
            </div>
            {modus === "inloggen" && <div style={{ fontSize: 14, color: "#6B6B6B", marginTop: 6 }}>Log in om uw woning te plaatsen</div>}
            {modus === "registreren" && <div style={{ fontSize: 14, color: "#6B6B6B", marginTop: 6 }}>Maak gratis een account aan</div>}
          </div>

          {/* Bevestiging scherm */}
          {modus === "bevestigd" && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✉️</div>
              <p style={{ fontSize: 15, color: "#3D3D3D", lineHeight: 1.7, marginBottom: 20 }}>
                We hebben een bevestigingsmail gestuurd naar <strong>{email}</strong>.<br />
                Klik op de link in de mail om uw account te activeren.
              </p>
              <button onClick={() => setModus("inloggen")} style={{ background: NAVY, color: "#fff", border: "none", padding: "12px 24px", borderRadius: 4, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                Terug naar inloggen
              </button>
            </div>
          )}

          {/* Fout/succes melding */}
          {fout && <div style={{ background: "#fdf0f0", border: "1px solid #e5b0b0", color: "#8B2020", padding: "11px 14px", borderRadius: 4, fontSize: 14, marginBottom: 16 }}>{typeof fout === "string" ? fout : JSON.stringify(fout)}</div>}
          {succes && <div style={{ background: "#f0fdf4", border: "1px solid #86efac", color: "#166534", padding: "11px 14px", borderRadius: 4, fontSize: 14, marginBottom: 16 }}>{succes}</div>}

          {/* INLOGGEN */}
          {modus === "inloggen" && (
            <form onSubmit={handleInloggen} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: NAVY, display: "block", marginBottom: 5 }}>E-mailadres</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="naam@voorbeeld.nl" autoComplete="email" />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: NAVY, display: "block", marginBottom: 5 }}>Wachtwoord</label>
                <input type="password" required value={wachtwoord} onChange={(e) => setWachtwoord(e.target.value)} style={inputStyle} placeholder="••••••••" autoComplete="current-password" />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 14, cursor: "pointer" }}>
                  <input type="checkbox" checked={onthoud} onChange={(e) => setOnthoud(e.target.checked)} />
                  Onthoud mij
                </label>
                <button type="button" onClick={() => { setModus("vergeten"); setFout(""); setSucces(""); }} style={{ background: "none", border: "none", color: GOLD, fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
                  Wachtwoord vergeten?
                </button>
              </div>
              <button type="submit" disabled={loading} style={{ background: NAVY, color: "#fff", border: "none", padding: "14px", borderRadius: 4, fontWeight: 700, fontSize: 15, cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1, marginTop: 4 }}>
                {loading ? "Inloggen..." : "Inloggen"}
              </button>
              <div style={{ textAlign: "center", fontSize: 14, color: "#6B6B6B", marginTop: 4 }}>
                Nog geen account?{" "}
                <button type="button" onClick={() => { setModus("registreren"); setFout(""); }} style={{ background: "none", border: "none", color: NAVY, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
                  Registreer hier
                </button>
              </div>
            </form>
          )}

          {/* REGISTREREN */}
          {modus === "registreren" && (
            <form onSubmit={handleRegistreren} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: NAVY, display: "block", marginBottom: 5 }}>Uw naam <span style={{ color: GOLD }}>*</span></label>
                <input type="text" required value={naam} onChange={(e) => setNaam(e.target.value)} style={inputStyle} placeholder="Voor- en achternaam" autoComplete="name" />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: NAVY, display: "block", marginBottom: 5 }}>E-mailadres <span style={{ color: GOLD }}>*</span></label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="naam@voorbeeld.nl" autoComplete="email" />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: NAVY, display: "block", marginBottom: 5 }}>Wachtwoord <span style={{ color: GOLD }}>*</span></label>
                <input type="password" required minLength={8} value={wachtwoord} onChange={(e) => setWachtwoord(e.target.value)} style={inputStyle} placeholder="Minimaal 8 tekens" autoComplete="new-password" />
              </div>


              <button type="submit" disabled={loading} style={{ background: GOLD, color: "#fff", border: "none", padding: "14px", borderRadius: 4, fontWeight: 700, fontSize: 15, cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1, marginTop: 4 }}>
                {loading ? "Account aanmaken..." : "Account aanmaken, gratis"}
              </button>
              <div style={{ textAlign: "center", fontSize: 13, color: "#6B6B6B" }}>
                Door te registreren gaat u akkoord met onze{" "}
                <Link to="/faq" style={{ color: NAVY, fontWeight: 600 }}>algemene voorwaarden</Link>.
              </div>
              <div style={{ textAlign: "center", fontSize: 14, color: "#6B6B6B" }}>
                Al een account?{" "}
                <button type="button" onClick={() => { setModus("inloggen"); setFout(""); }} style={{ background: "none", border: "none", color: NAVY, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
                  Inloggen
                </button>
              </div>
            </form>
          )}

          {/* WACHTWOORD VERGETEN */}
          {modus === "vergeten" && !succes && (
            <form onSubmit={handleVergeten} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <p style={{ fontSize: 14, color: "#3D3D3D", lineHeight: 1.6, margin: "0 0 8px" }}>
                Vul uw e-mailadres in. U ontvangt een link om uw wachtwoord opnieuw in te stellen.
              </p>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: NAVY, display: "block", marginBottom: 5 }}>E-mailadres</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="naam@voorbeeld.nl" autoComplete="email" />
              </div>
              <button type="submit" disabled={loading} style={{ background: NAVY, color: "#fff", border: "none", padding: "14px", borderRadius: 4, fontWeight: 700, fontSize: 15, cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1 }}>
                {loading ? "Verzenden..." : "Resetlink sturen"}
              </button>
              <button type="button" onClick={() => { setModus("inloggen"); setFout(""); setSucces(""); }} style={{ background: "none", border: "none", color: "#6B6B6B", fontSize: 14, cursor: "pointer" }}>
                ← Terug naar inloggen
              </button>
            </form>
          )}

          {modus === "vergeten" && succes && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📬</div>
              <p style={{ fontSize: 15, color: "#3D3D3D", lineHeight: 1.7, marginBottom: 20 }}>{succes}</p>
              <button onClick={() => { setModus("inloggen"); setSucces(""); }} style={{ background: NAVY, color: "#fff", border: "none", padding: "12px 24px", borderRadius: 4, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                Terug naar inloggen
              </button>
            </div>
          )}
        </div>

        {/* Supabase niet geconfigureerd melding */}
        {!supabaseConfigured && (
          <div style={{ marginTop: 16, background: "#FFF8E7", border: "1px solid #F0C040", borderRadius: 6, padding: "12px 16px", fontSize: 13, color: "#7A5C00" }}>
            <strong>Let op:</strong> Supabase is nog niet geconfigureerd in Vercel. Voeg de env vars toe om accounts te activeren.
          </div>
        )}
      </div>
    </div>
  );
}
