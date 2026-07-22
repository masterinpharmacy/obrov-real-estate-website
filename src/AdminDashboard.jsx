import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const NAVY = "#0B2A52";
const GOLD = "#AC9362";
const BORDER = "#DCD4C2";

const ADMIN_SECRET = "obrov-admin-2026"; // Zelfde als in api/admin.js

function StatKaart({ label, waarde, sub, kleur = NAVY }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "18px 20px", borderTop: `4px solid ${kleur}` }}>
      <div style={{ fontSize: 12, color: "#888", fontWeight: 700, letterSpacing: 0.5, marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 700, color: kleur }}>{waarde}</div>
      {sub && <div style={{ fontSize: 12.5, color: "#888", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    actief: { bg: "#E8F5E9", color: "#2E7D32", label: "Actief" },
    concept: { bg: "#FFF8E7", color: "#7A5C00", label: "In afwachting" },
    afgewezen: { bg: "#FFEBEE", color: "#C62828", label: "Afgewezen" },
    verkocht: { bg: "#E3F2FD", color: "#1565C0", label: "Verkocht" },
    betaald: { bg: "#E8F5E9", color: "#2E7D32", label: "Betaald" },
    open: { bg: "#FFF8E7", color: "#7A5C00", label: "Open" },
    verlopen: { bg: "#FFEBEE", color: "#C62828", label: "Verlopen" },
  };
  const c = config[status] || { bg: "#f0f0f0", color: "#666", label: status };
  return (
    <span style={{ background: c.bg, color: c.color, fontSize: 11.5, fontWeight: 700, padding: "3px 10px", borderRadius: 10, whiteSpace: "nowrap" }}>
      {c.label}
    </span>
  );
}

export default function AdminDashboard() {
  const [ingelogd, setIngelogd] = useState(false);
  const [wachtwoord, setWachtwoord] = useState("");
  const [fout, setFout] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [actieveTab, setActieveTab] = useState("overzicht");
  const [filter, setFilter] = useState("alle");
  const [zoek, setZoek] = useState("");
  const [bezig, setBezig] = useState({});

  const handleLogin = (e) => {
    e.preventDefault();
    if (wachtwoord === ADMIN_SECRET) {
      setIngelogd(true);
      laadData();
    } else {
      setFout("Onjuist wachtwoord.");
    }
  };

  const laadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: ADMIN_SECRET, actie: "statistieken" }),
      });
      const json = await res.json();
      setData(json);
    } catch {
      setFout("Kon data niet laden. Controleer of Supabase geconfigureerd is.");
    } finally {
      setLoading(false);
    }
  };

  const woningActie = async (woning_id, status) => {
    setBezig(b => ({ ...b, [woning_id]: true }));
    try {
      await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: ADMIN_SECRET, actie: "woning_status", woning_id, status }),
      });
      setData(d => ({
        ...d,
        woningen: d.woningen.map(w => w.id === woning_id ? { ...w, status } : w),
      }));
    } finally {
      setBezig(b => ({ ...b, [woning_id]: false }));
    }
  };

  const woningVerwijderen = async (woning_id) => {
    if (!confirm("Weet u zeker dat u deze woning wilt verwijderen?")) return;
    setBezig(b => ({ ...b, [woning_id]: true }));
    try {
      await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: ADMIN_SECRET, actie: "woning_verwijderen", woning_id }),
      });
      setData(d => ({ ...d, woningen: d.woningen.filter(w => w.id !== woning_id) }));
    } finally {
      setBezig(b => ({ ...b, [woning_id]: false }));
    }
  };

  const factuurActie = async (factuur_id, factuur_status) => {
    setBezig(b => ({ ...b, [factuur_id]: true }));
    try {
      await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: ADMIN_SECRET, actie: "factuur_status", factuur_id, factuur_status }),
      });
      setData(d => ({
        ...d,
        facturen: d.facturen.map(f => f.id === factuur_id ? { ...f, status: factuur_status } : f),
      }));
    } finally {
      setBezig(b => ({ ...b, [factuur_id]: false }));
    }
  };

  if (!ingelogd) {
    return (
      <div style={{ minHeight: "100vh", background: "#0B2A52", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Helvetica, Arial, sans-serif", padding: 24 }}>
        <div style={{ background: "#fff", borderRadius: 10, padding: "36px 32px", maxWidth: 380, width: "100%", boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <img src="/logo.png" alt="Obrov" style={{ height: 52, width: "auto", marginBottom: 16 }} />
            <div style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: NAVY }}>Admin Dashboard</div>
            <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>Obrov Real Estate</div>
          </div>
          {fout && <div style={{ background: "#fdf0f0", border: "1px solid #e5b0b0", color: "#8B2020", padding: "10px 13px", borderRadius: 4, fontSize: 13.5, marginBottom: 14 }}>{fout}</div>}
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="password"
              value={wachtwoord}
              onChange={(e) => setWachtwoord(e.target.value)}
              placeholder="Admin wachtwoord"
              style={{ padding: "12px 14px", border: `1px solid ${BORDER}`, borderRadius: 4, fontSize: 14.5, fontFamily: "inherit", outline: "none" }}
              autoFocus
            />
            <button type="submit" style={{ background: NAVY, color: "#fff", border: "none", padding: "13px", borderRadius: 4, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
              Inloggen
            </button>
          </form>
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Link to="/" style={{ fontSize: 13, color: "#888", textDecoration: "none" }}>Terug naar website</Link>
          </div>
        </div>
      </div>
    );
  }

  const woningen = data?.woningen || [];
  const gebruikers = data?.gebruikers || [];
  const facturen = data?.facturen || [];

  const gefilterdWoningen = woningen.filter(w => {
    if (filter !== "alle" && w.status !== filter) return false;
    if (zoek && !`${w.stad} ${w.verkoper_naam} ${w.verkoper_email} ${w.type}`.toLowerCase().includes(zoek.toLowerCase())) return false;
    return true;
  });

  const stats = {
    totaalWoningen: woningen.filter(w => !w.demo).length,
    actief: woningen.filter(w => w.status === "actief" && !w.demo).length,
    wachtend: woningen.filter(w => w.status === "concept").length,
    gebruikers: gebruikers.length,
    openFacturen: facturen.filter(f => f.status === "open").length,
    omzetTotaal: facturen.filter(f => f.status === "betaald").reduce((s, f) => s + (f.bedrag || 0), 0),
  };

  const tabs = [
    { key: "overzicht", label: "Overzicht" },
    { key: "woningen", label: `Woningen (${woningen.filter(w => !w.demo).length})` },
    { key: "beoordelen", label: `Te beoordelen (${stats.wachtend})`, alert: stats.wachtend > 0 },
    { key: "gebruikers", label: `Gebruikers (${stats.gebruikers})` },
    { key: "facturen", label: `Facturen (${facturen.length})`, alert: stats.openFacturen > 0 },
  ];

  return (
    <div style={{ fontFamily: "Helvetica, Arial, sans-serif", background: "#FAF8F4", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`*{box-sizing:border-box}html,body{overflow-x:hidden;width:100%;max-width:100%}@media(max-width:640px){.stat-grid{grid-template-columns:1fr 1fr!important}.admin-table td,.admin-table th{padding:8px 8px!important;font-size:12px!important}}`}</style>

      {/* Topbar */}
      <header style={{ background: NAVY, padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link to="/"><img src="/logo.png" alt="Obrov" style={{ height: 40, width: "auto", filter: "brightness(0) invert(1)", opacity: 0.9 }} /></Link>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>Admin Dashboard</div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={laadData} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "7px 14px", borderRadius: 4, fontSize: 13, cursor: "pointer" }}>
            Vernieuwen
          </button>
          <Link to="/" style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, textDecoration: "none" }}>Website</Link>
          <button onClick={() => setIngelogd(false)} style={{ background: "none", border: "1px solid rgba(255,255,255,0.3)", color: "rgba(255,255,255,0.7)", padding: "7px 14px", borderRadius: 4, fontSize: 13, cursor: "pointer" }}>
            Uitloggen
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", gap: 0, overflowX: "auto" }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActieveTab(tab.key)} style={{ background: "none", border: "none", cursor: "pointer", padding: "14px 18px", fontSize: 14, fontWeight: actieveTab === tab.key ? 700 : 500, color: actieveTab === tab.key ? NAVY : "#666", borderBottom: actieveTab === tab.key ? `3px solid ${GOLD}` : "3px solid transparent", whiteSpace: "nowrap", position: "relative" }}>
              {tab.label}
              {tab.alert && <span style={{ position: "absolute", top: 10, right: 6, width: 8, height: 8, borderRadius: "50%", background: "#e53935" }} />}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px 80px" }}>
        {loading && <div style={{ textAlign: "center", padding: 40, color: "#888" }}>Laden...</div>}

        {/* TAB: Overzicht */}
        {actieveTab === "overzicht" && !loading && (
          <div>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 22, color: NAVY, margin: "0 0 20px" }}>Overzicht</h2>
            <div className="stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
              <StatKaart label="ACTIEVE WONINGEN" waarde={stats.actief} sub={`van ${stats.totaalWoningen} totaal`} kleur="#2E7D32" />
              <StatKaart label="TE BEOORDELEN" waarde={stats.wachtend} sub="Wachten op goedkeuring" kleur={stats.wachtend > 0 ? "#e53935" : "#888"} />
              <StatKaart label="GEBRUIKERS" waarde={stats.gebruikers} sub="Geregistreerde accounts" kleur={NAVY} />
              <StatKaart label="OPEN FACTUREN" waarde={stats.openFacturen} sub="Nog te innen" kleur={stats.openFacturen > 0 ? "#E65100" : "#888"} />
              <StatKaart label="TOTALE OMZET" waarde={`EUR ${stats.omzetTotaal.toLocaleString("nl-NL")}`} sub="Betaalde facturen" kleur={GOLD} />
              <StatKaart label="GESPONSORD" waarde={woningen.filter(w => w.gesponsord).length} sub="Uitgelichte woningen" kleur="#3A1A5C" />
            </div>

            {/* Recente activiteit */}
            {stats.wachtend > 0 && (
              <div style={{ background: "#FFF8E7", border: "1.5px solid #F0C040", borderRadius: 8, padding: "16px 20px", marginBottom: 24 }}>
                <div style={{ fontWeight: 700, color: "#7A5C00", marginBottom: 8 }}>Actie vereist: {stats.wachtend} woning{stats.wachtend !== 1 ? "en" : ""} wacht{stats.wachtend === 1 ? "" : "en"} op beoordeling</div>
                <button onClick={() => setActieveTab("beoordelen")} style={{ background: "#7A5C00", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 4, fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}>
                  Beoordeel nu
                </button>
              </div>
            )}

            {/* Laatste 5 woningen */}
            <h3 style={{ fontSize: 16, color: NAVY, margin: "0 0 12px", fontWeight: 700 }}>Recentste woningen</h3>
            <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden" }}>
              {woningen.filter(w => !w.demo).slice(0, 5).map((w, i) => (
                <div key={w.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderBottom: i < 4 ? `1px solid ${BORDER}` : "none" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: NAVY }}>{w.type?.charAt(0).toUpperCase() + w.type?.slice(1)} in {w.stad}</div>
                    <div style={{ fontSize: 12.5, color: "#888", marginTop: 2 }}>{w.verkoper_naam} | EUR {parseInt(w.vraagprijs || 0).toLocaleString("nl-NL")}</div>
                  </div>
                  <StatusBadge status={w.status} />
                  <div style={{ fontSize: 12, color: "#aaa" }}>{new Date(w.created_at).toLocaleDateString("nl-NL")}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: Alle woningen */}
        {actieveTab === "woningen" && !loading && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: 22, color: NAVY, margin: 0 }}>Alle woningen</h2>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <input value={zoek} onChange={(e) => setZoek(e.target.value)} placeholder="Zoek op stad, naam..." style={{ padding: "8px 12px", border: `1px solid ${BORDER}`, borderRadius: 4, fontSize: 13.5, fontFamily: "inherit", outline: "none", width: 200 }} />
                <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: "8px 12px", border: `1px solid ${BORDER}`, borderRadius: 4, fontSize: 13.5, fontFamily: "inherit", background: "#fff" }}>
                  <option value="alle">Alle statussen</option>
                  <option value="actief">Actief</option>
                  <option value="concept">In afwachting</option>
                  <option value="afgewezen">Afgewezen</option>
                  <option value="verkocht">Verkocht</option>
                </select>
              </div>
            </div>
            <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "auto" }}>
              <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
                <thead>
                  <tr style={{ background: "#F5F5F5" }}>
                    {["Type / Stad", "Verkoper", "Prijs", "Status", "Datum", "Acties"].map(h => (
                      <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontWeight: 700, color: NAVY, fontSize: 12, letterSpacing: 0.3, borderBottom: `1px solid ${BORDER}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {gefilterdWoningen.filter(w => !w.demo).map((w, i) => (
                    <tr key={w.id} style={{ borderBottom: `1px solid ${BORDER}`, background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                      <td style={{ padding: "11px 14px" }}>
                        <div style={{ fontWeight: 600, color: NAVY }}>{w.type?.charAt(0).toUpperCase() + w.type?.slice(1)}</div>
                        <div style={{ fontSize: 12, color: "#888" }}>{w.stad}{w.regio ? `, ${w.regio}` : ""}</div>
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <div>{w.verkoper_naam || "?"}</div>
                        <div style={{ fontSize: 12, color: "#888" }}>{w.verkoper_email}</div>
                      </td>
                      <td style={{ padding: "11px 14px", fontWeight: 600 }}>EUR {parseInt(w.vraagprijs || 0).toLocaleString("nl-NL")}</td>
                      <td style={{ padding: "11px 14px" }}><StatusBadge status={w.status} /></td>
                      <td style={{ padding: "11px 14px", fontSize: 12, color: "#888" }}>{new Date(w.created_at).toLocaleDateString("nl-NL")}</td>
                      <td style={{ padding: "11px 14px" }}>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          <Link to={`/aanbod/${w.id}`} target="_blank" style={{ fontSize: 12, color: NAVY, textDecoration: "none", fontWeight: 600 }}>Bekijk</Link>
                          {w.status !== "actief" && <button onClick={() => woningActie(w.id, "actief")} disabled={bezig[w.id]} style={{ fontSize: 11.5, background: "#E8F5E9", color: "#2E7D32", border: "none", padding: "3px 8px", borderRadius: 3, cursor: "pointer", fontWeight: 600 }}>Goedkeuren</button>}
                          {w.status !== "afgewezen" && <button onClick={() => woningActie(w.id, "afgewezen")} disabled={bezig[w.id]} style={{ fontSize: 11.5, background: "#FFEBEE", color: "#C62828", border: "none", padding: "3px 8px", borderRadius: 3, cursor: "pointer", fontWeight: 600 }}>Afwijzen</button>}
                          <button onClick={() => woningVerwijderen(w.id)} disabled={bezig[w.id]} style={{ fontSize: 11.5, background: "#F5F5F5", color: "#666", border: "none", padding: "3px 8px", borderRadius: 3, cursor: "pointer" }}>Verwijder</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {gefilterdWoningen.filter(w => !w.demo).length === 0 && (
                <div style={{ textAlign: "center", padding: 40, color: "#888" }}>Geen woningen gevonden</div>
              )}
            </div>
          </div>
        )}

        {/* TAB: Te beoordelen */}
        {actieveTab === "beoordelen" && !loading && (
          <div>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 22, color: NAVY, margin: "0 0 8px" }}>Te beoordelen</h2>
            <p style={{ fontSize: 14, color: "#6B6B6B", margin: "0 0 20px" }}>Woningen die wachten op uw goedkeuring voor publicatie.</p>
            {woningen.filter(w => w.status === "concept").length === 0 ? (
              <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: 40, textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>✓</div>
                <div style={{ fontSize: 16, color: NAVY, fontWeight: 700 }}>Alles beoordeeld</div>
                <div style={{ fontSize: 14, color: "#888", marginTop: 6 }}>Er zijn geen woningen die wachten op beoordeling.</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {woningen.filter(w => w.status === "concept").map((w) => (
                  <div key={w.id} style={{ background: "#fff", border: `2px solid #F0C040`, borderRadius: 8, padding: "20px 22px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 700, color: NAVY, marginBottom: 4 }}>
                          {w.type?.charAt(0).toUpperCase() + w.type?.slice(1)} in {w.stad}
                          {w.regio ? ` (${w.regio})` : ""}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 20px", fontSize: 13.5, color: "#555", marginBottom: 12 }}>
                          <div><span style={{ color: "#888" }}>Prijs: </span><strong>EUR {parseInt(w.vraagprijs || 0).toLocaleString("nl-NL")}</strong></div>
                          <div><span style={{ color: "#888" }}>Verkoper: </span>{w.verkoper_naam || "?"}</div>
                          <div><span style={{ color: "#888" }}>E-mail: </span>{w.verkoper_email}</div>
                          <div><span style={{ color: "#888" }}>Geplaatst: </span>{new Date(w.created_at).toLocaleDateString("nl-NL")}</div>
                          {w.oppervlakte_m2 && <div><span style={{ color: "#888" }}>Woning: </span>{w.oppervlakte_m2} m2</div>}
                          {w.perceel_m2 && <div><span style={{ color: "#888" }}>Perceel: </span>{w.perceel_m2} m2</div>}
                        </div>
                        <Link to={`/aanbod/${w.id}`} target="_blank" style={{ fontSize: 13, color: NAVY, fontWeight: 600, textDecoration: "none" }}>
                          Bekijk volledige advertentie →
                        </Link>
                      </div>
                      <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                        <button
                          onClick={() => woningActie(w.id, "actief")}
                          disabled={bezig[w.id]}
                          style={{ background: "#2E7D32", color: "#fff", border: "none", padding: "11px 22px", borderRadius: 4, fontWeight: 700, fontSize: 14, cursor: "pointer", opacity: bezig[w.id] ? 0.6 : 1 }}
                        >
                          Goedkeuren
                        </button>
                        <button
                          onClick={() => woningActie(w.id, "afgewezen")}
                          disabled={bezig[w.id]}
                          style={{ background: "#fff", color: "#C62828", border: "2px solid #C62828", padding: "11px 22px", borderRadius: 4, fontWeight: 700, fontSize: 14, cursor: "pointer", opacity: bezig[w.id] ? 0.6 : 1 }}
                        >
                          Afwijzen
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: Gebruikers */}
        {actieveTab === "gebruikers" && !loading && (
          <div>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 22, color: NAVY, margin: "0 0 20px" }}>Gebruikers</h2>
            <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "auto" }}>
              <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
                <thead>
                  <tr style={{ background: "#F5F5F5" }}>
                    {["Naam", "E-mail", "Accounttype", "Aangemaakt", "Woningen"].map(h => (
                      <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontWeight: 700, color: NAVY, fontSize: 12, letterSpacing: 0.3, borderBottom: `1px solid ${BORDER}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {gebruikers.map((g, i) => (
                    <tr key={g.id} style={{ borderBottom: `1px solid ${BORDER}`, background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                      <td style={{ padding: "11px 14px", fontWeight: 600, color: NAVY }}>{g.naam || "Onbekend"}</td>
                      <td style={{ padding: "11px 14px" }}>{g.email}</td>
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{ fontSize: 12, background: g.account_type === "makelaar_pro" ? "#EDE0FF" : g.account_type === "makelaar_starter" ? "#E3F2FD" : "#F5F5F5", color: g.account_type === "makelaar_pro" ? "#5B2D8E" : g.account_type === "makelaar_starter" ? "#1565C0" : "#555", padding: "3px 9px", borderRadius: 10, fontWeight: 600 }}>
                          {g.account_type === "makelaar_pro" ? "Makelaar Pro" : g.account_type === "makelaar_starter" ? "Makelaar Starter" : "Particulier"}
                        </span>
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 12, color: "#888" }}>{new Date(g.created_at).toLocaleDateString("nl-NL")}</td>
                      <td style={{ padding: "11px 14px", textAlign: "center" }}>
                        {woningen.filter(w => w.user_id === g.id).length}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {gebruikers.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#888" }}>Nog geen gebruikers</div>}
            </div>
          </div>
        )}

        {/* TAB: Facturen */}
        {actieveTab === "facturen" && !loading && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: 22, color: NAVY, margin: 0 }}>Facturen</h2>
              <div style={{ display: "flex", gap: 16, fontSize: 14 }}>
                <div style={{ color: "#2E7D32", fontWeight: 700 }}>Betaald: EUR {facturen.filter(f => f.status === "betaald").reduce((s, f) => s + (f.bedrag || 0), 0).toLocaleString("nl-NL")}</div>
                <div style={{ color: "#E65100", fontWeight: 700 }}>Open: EUR {facturen.filter(f => f.status === "open").reduce((s, f) => s + (f.bedrag || 0), 0).toLocaleString("nl-NL")}</div>
              </div>
            </div>

            {facturen.length === 0 ? (
              <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: 40, textAlign: "center" }}>
                <div style={{ fontSize: 16, color: NAVY, fontWeight: 700, marginBottom: 8 }}>Nog geen facturen</div>
                <div style={{ fontSize: 14, color: "#888" }}>Facturen worden aangemaakt zodra gebruikers betalen.</div>
              </div>
            ) : (
              <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "auto" }}>
                <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
                  <thead>
                    <tr style={{ background: "#F5F5F5" }}>
                      {["Factuur", "Klant", "Bedrag", "Type", "Status", "Datum", "Actie"].map(h => (
                        <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontWeight: 700, color: NAVY, fontSize: 12, letterSpacing: 0.3, borderBottom: `1px solid ${BORDER}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {facturen.map((f, i) => (
                      <tr key={f.id} style={{ borderBottom: `1px solid ${BORDER}`, background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                        <td style={{ padding: "11px 14px", fontFamily: "monospace", fontSize: 12, color: "#888" }}>{f.id?.slice(0, 8)}...</td>
                        <td style={{ padding: "11px 14px" }}>
                          <div style={{ fontWeight: 600, color: NAVY }}>{f.naam || "?"}</div>
                          <div style={{ fontSize: 12, color: "#888" }}>{f.email}</div>
                        </td>
                        <td style={{ padding: "11px 14px", fontWeight: 700 }}>EUR {(f.bedrag || 0).toLocaleString("nl-NL")}</td>
                        <td style={{ padding: "11px 14px", fontSize: 12.5 }}>{f.type || "Plaatsing"}</td>
                        <td style={{ padding: "11px 14px" }}><StatusBadge status={f.status} /></td>
                        <td style={{ padding: "11px 14px", fontSize: 12, color: "#888" }}>{f.created_at ? new Date(f.created_at).toLocaleDateString("nl-NL") : "?"}</td>
                        <td style={{ padding: "11px 14px" }}>
                          <div style={{ display: "flex", gap: 6 }}>
                            {f.status === "open" && (
                              <button onClick={() => factuurActie(f.id, "betaald")} disabled={bezig[f.id]} style={{ fontSize: 11.5, background: "#E8F5E9", color: "#2E7D32", border: "none", padding: "4px 10px", borderRadius: 3, cursor: "pointer", fontWeight: 600 }}>
                                Markeer betaald
                              </button>
                            )}
                            {f.status === "betaald" && (
                              <button onClick={() => factuurActie(f.id, "open")} disabled={bezig[f.id]} style={{ fontSize: 11.5, background: "#F5F5F5", color: "#666", border: "none", padding: "4px 10px", borderRadius: 3, cursor: "pointer" }}>
                                Zet open
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
