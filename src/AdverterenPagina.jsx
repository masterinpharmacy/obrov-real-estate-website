import React, { useState } from "react";
import { Link } from "react-router-dom";

const NAVY = "#0B2A52";
const GOLD = "#AC9362";
const BORDER = "#DCD4C2";

const inputStyle = {
  width: "100%", padding: "11px 13px", border: `1px solid ${BORDER}`,
  borderRadius: 4, fontSize: 14.5, fontFamily: "inherit", outline: "none",
  background: "#fff", color: "#1A1A1A", boxSizing: "border-box",
};

const PAKKETTEN = [
  {
    naam: "Banner Basis",
    prijs: "€ 150",
    periode: "per maand",
    kleur: NAVY,
    beschrijving: "Sidebar-banner op de aanbodpagina",
    punten: [
      "300x250px banner op het aanbodoverzicht",
      "Zichtbaar voor alle bezoekers van het platform",
      "Link naar uw eigen website",
      "Maandelijks opzegbaar",
    ],
  },
  {
    naam: "Banner Premium",
    prijs: "€ 350",
    periode: "per maand",
    kleur: GOLD,
    highlight: true,
    beschrijving: "Prominent banner + vermelding op homepage",
    punten: [
      "728x90px leaderboard banner boven het aanbod",
      "Vermelding in de Partnersectie op de homepage",
      "Logo en korte omschrijving (max. 80 tekens)",
      "Link naar uw website of contactpagina",
      "Rapportage: maandelijks aantal vertoningen",
    ],
  },
  {
    naam: "Gesponsorde Woning",
    prijs: "€ 95",
    periode: "per woning per maand",
    kleur: "#1A5C3A",
    beschrijving: "Uw woning bovenaan het aanbod uitgelicht",
    punten: [
      "Woning verschijnt bovenaan het aanbodoverzicht",
      "Gouden 'Uitgelicht' badge op de woningkaart",
      "Extra zichtbaarheid op de kaartweergave",
      "Geschikt voor particulieren en makelaars",
      "Combineerbaar met uw bestaande advertentie",
    ],
  },
  {
    naam: "Partner Jaarcontract",
    prijs: "Op aanvraag",
    periode: "per jaar",
    kleur: "#3A1A5C",
    beschrijving: "Exclusief partnership voor dienstverleners",
    punten: [
      "Exclusieve categorie (bijv. enige notaris op platform)",
      "Vermelding op elke detailpagina van woningen",
      "Co-branded content mogelijk (gastartikelen, tips)",
      "Directe verwijzing vanuit ons begeleidingspakket",
      "Geschikt voor advocaten, notarissen, taxateurs, verzekeraars",
    ],
  },
];

const DOELGROEPEN = [
  { icon: "⚖️", naam: "Vastgoedadvocaten", sub: "Lokale juridische begeleiding" },
  { icon: "📋", naam: "Notarissen", sub: "Montenegro, Kroatie, Bosnie, Slovenie" },
  { icon: "🏦", naam: "Hypotheekverstrekkers", sub: "Financiering voor buitenlandse kopers" },
  { icon: "📊", naam: "Taxateurs", sub: "Onroerend goed taxaties" },
  { icon: "🛡️", naam: "Verzekeraars", sub: "Opstal- en inboedelverzekeringen" },
  { icon: "🏗️", naam: "Aannemers & renovatie", sub: "Verbouwingsbedrijven op de Balkan" },
  { icon: "✈️", naam: "Reisbureaus", sub: "Bezichtigingsreizen en accommodatie" },
  { icon: "💼", naam: "Belasting- en fiscaal advies", sub: "Voor Europese kopers" },
];

export default function AdverterenPagina() {
  const [form, setForm] = useState({ bedrijf: "", naam: "", email: "", telefoon: "", pakket: "", bericht: "" });
  const [verstuurd, setVerstuurd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fout, setFout] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.bedrijf || !form.email) { setFout("Vul minimaal bedrijfsnaam en e-mailadres in."); return; }
    setFout(""); setLoading(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          naam: form.naam,
          email: form.email,
          bericht: `ADVERTENTIE AANVRAAG\n\nBedrijf: ${form.bedrijf}\nNaam: ${form.naam}\nTelefoon: ${form.telefoon}\nPakket interesse: ${form.pakket || "Nog niet gekozen"}\n\n${form.bericht}`,
        }),
      });
      setVerstuurd(true);
    } catch {
      setFout("Er ging iets mis. Stuur een mail naar info@obrovrealestate.nl.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "Helvetica, Arial, sans-serif", background: "#FAF8F4", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`*{box-sizing:border-box}html,body{overflow-x:hidden;width:100%;max-width:100%}@media(max-width:640px){.pakket-grid{grid-template-columns:1fr!important}.doel-grid{grid-template-columns:1fr 1fr!important}.hero-padding{padding:36px 16px!important}.content-padding{padding:40px 16px 80px!important}}`}</style>

      {/* Navbar */}
      <header style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <Link to="/"><img src="/logo.png" alt="Obrov Real Estate" style={{ height: 44, width: "auto" }} /></Link>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link to="/aanbod" style={{ fontSize: 14, color: NAVY, textDecoration: "none", fontWeight: 500 }}>Aanbod</Link>
          <Link to="/auth" style={{ background: GOLD, color: "#fff", padding: "8px 16px", borderRadius: 20, fontSize: 13.5, fontWeight: 700, textDecoration: "none" }}>Inloggen</Link>
        </div>
      </header>

      {/* Hero */}
      <div className="hero-padding" style={{ background: NAVY, padding: "56px 24px 48px", textAlign: "center" }}>
        <div style={{ fontSize: 12, color: GOLD, fontWeight: 700, letterSpacing: 1.5, marginBottom: 10 }}>ADVERTEREN OP OBROV REAL ESTATE</div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(22px, 4vw, 38px)", color: "#FAF8F4", margin: "0 0 14px", fontWeight: 700, maxWidth: 680, marginInline: "auto" }}>
          Bereik kopers en investeerders uit heel Europa
        </h1>
        <p style={{ color: "#C9D2D0", fontSize: 15.5, maxWidth: 560, margin: "0 auto 28px" }}>
          Obrov Real Estate verbindt Europese kopers met Balkan-vastgoed. Als dienstverlener bereikt u precies de doelgroep die u zoekt.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "Bezoekers per maand", waarde: "5.000+" },
            { label: "Landen", waarde: "10+" },
            { label: "Talen", waarde: "10" },
          ].map((s) => (
            <div key={s.label} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "14px 20px", textAlign: "center", minWidth: 120 }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 700, color: GOLD }}>{s.waarde}</div>
              <div style={{ fontSize: 12, color: "#C9D2D0", marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="content-padding" style={{ maxWidth: 1080, margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Doelgroepen */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 12, color: GOLD, fontWeight: 700, letterSpacing: 1.5, marginBottom: 8 }}>VOOR WIE?</div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: 26, color: NAVY, margin: "0 0 10px", fontWeight: 700 }}>Ideaal voor dienstverleners in vastgoed</h2>
          <p style={{ fontSize: 15, color: "#6B6B6B", maxWidth: 520, margin: "0 auto" }}>Onze bezoekers zijn actief op zoek naar vastgoed en de bijbehorende diensten.</p>
        </div>

        <div className="doel-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 56 }}>
          {DOELGROEPEN.map((d) => (
            <div key={d.naam} style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "16px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{d.icon}</span>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: NAVY }}>{d.naam}</div>
                <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{d.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Pakketten */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 12, color: GOLD, fontWeight: 700, letterSpacing: 1.5, marginBottom: 8 }}>PAKKETTEN</div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: 26, color: NAVY, margin: 0, fontWeight: 700 }}>Kies uw advertentiepositie</h2>
        </div>

        <div className="pakket-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 56 }}>
          {PAKKETTEN.map((pk) => (
            <div
              key={pk.naam}
              onClick={() => set("pakket", pk.naam)}
              style={{
                background: "#fff",
                border: `2px solid ${form.pakket === pk.naam ? pk.kleur : pk.highlight ? GOLD : BORDER}`,
                borderRadius: 10,
                overflow: "hidden",
                cursor: "pointer",
                transition: "box-shadow 0.15s",
                boxShadow: pk.highlight ? "0 4px 20px rgba(172,147,98,0.2)" : form.pakket === pk.naam ? `0 4px 16px rgba(0,0,0,0.12)` : "none",
              }}
            >
              {pk.highlight && (
                <div style={{ background: GOLD, color: "#fff", fontSize: 11.5, fontWeight: 700, textAlign: "center", padding: "4px 0", letterSpacing: 1 }}>
                  MEEST GEKOZEN
                </div>
              )}
              <div style={{ borderTop: `4px solid ${pk.kleur}`, padding: "20px 20px 22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: NAVY }}>{pk.naam}</div>
                    <div style={{ fontSize: 12.5, color: "#888", marginTop: 3 }}>{pk.beschrijving}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                    <div style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: pk.kleur }}>{pk.prijs}</div>
                    <div style={{ fontSize: 11.5, color: "#888" }}>{pk.periode}</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {pk.punten.map((punt, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <span style={{ color: pk.kleur, fontWeight: 700, fontSize: 13, flexShrink: 0, marginTop: 1 }}>✓</span>
                      <span style={{ fontSize: 13, color: "#3D3D3D", lineHeight: 1.5 }}>{punt}</span>
                    </div>
                  ))}
                </div>
                {form.pakket === pk.naam && (
                  <div style={{ marginTop: 12, background: pk.kleur, color: "#fff", textAlign: "center", padding: "7px", borderRadius: 4, fontSize: 12.5, fontWeight: 700 }}>
                    Geselecteerd
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Voorbeeldposities */}
        <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "28px 24px", marginBottom: 56 }}>
          <div style={{ fontSize: 12, color: GOLD, fontWeight: 700, letterSpacing: 1.5, marginBottom: 8 }}>VOORBEELDPOSITIES</div>
          <h3 style={{ fontFamily: "Georgia, serif", fontSize: 20, color: NAVY, margin: "0 0 20px", fontWeight: 700 }}>Waar uw advertentie verschijnt</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { positie: "Boven het aanbod (Leaderboard)", formaat: "728 x 90 px", paginas: "Aanbodoverzicht", pakket: "Banner Premium" },
              { positie: "Zijbalk aanbodoverzicht", formaat: "300 x 250 px", paginas: "Aanbodoverzicht", pakket: "Banner Basis" },
              { positie: "Woningdetailpagina (sidebar)", formaat: "300 x 250 px", paginas: "Alle detailpaginas", pakket: "Partner Jaarcontract" },
              { positie: "Homepage Partnersectie", formaat: "Logo + tekst", paginas: "Homepage", pakket: "Banner Premium / Partner" },
              { positie: "Gesponsorde woning (top aanbod)", formaat: "Woningkaart met badge", paginas: "Aanbodoverzicht + kaart", pakket: "Gesponsorde Woning" },
            ].map((r, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.5fr 1.5fr", gap: 12, padding: "12px 0", borderBottom: i < 4 ? `1px solid ${BORDER}` : "none", fontSize: 13.5 }}>
                <div style={{ fontWeight: 600, color: NAVY }}>{r.positie}</div>
                <div style={{ color: "#888" }}>{r.formaat}</div>
                <div style={{ color: "#555" }}>{r.paginas}</div>
                <div style={{ color: GOLD, fontWeight: 600 }}>{r.pakket}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Aanvraagformulier */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "flex-start" }} className="pakket-grid">
          <div>
            <div style={{ fontSize: 12, color: GOLD, fontWeight: 700, letterSpacing: 1.5, marginBottom: 8 }}>CONTACT</div>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 24, color: NAVY, margin: "0 0 12px", fontWeight: 700 }}>Vraag een voorstel aan</h2>
            <p style={{ fontSize: 14.5, color: "#3D3D3D", lineHeight: 1.7, marginBottom: 20 }}>
              Vul het formulier in en wij sturen u binnen twee werkdagen een passend voorstel op maat. Geen verplichtingen.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: 14, color: "#3D3D3D" }}>
              {[
                "Maandelijks opzegbaar (Basis en Gesponsord)",
                "Geen opstartkosten",
                "U levert het beeldmateriaal, wij plaatsen het",
                "Rapportage op aanvraag",
                "Exclusiviteit mogelijk per categorie",
              ].map((p, i) => (
                <div key={i} style={{ display: "flex", gap: 10 }}>
                  <span style={{ color: GOLD, fontWeight: 700 }}>✓</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "24px 22px" }}>
            {verstuurd ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 44, marginBottom: 14 }}>✓</div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: 20, color: NAVY, fontWeight: 700, marginBottom: 8 }}>Aanvraag ontvangen</div>
                <p style={{ fontSize: 14, color: "#3D3D3D" }}>We nemen binnen twee werkdagen contact met u op via <strong>{form.email}</strong>.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: NAVY, display: "block", marginBottom: 5 }}>Bedrijfsnaam *</label>
                  <input type="text" required value={form.bedrijf} onChange={(e) => set("bedrijf", e.target.value)} style={inputStyle} placeholder="Uw bedrijf" />
                </div>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: NAVY, display: "block", marginBottom: 5 }}>Contactpersoon</label>
                  <input type="text" value={form.naam} onChange={(e) => set("naam", e.target.value)} style={inputStyle} placeholder="Voor- en achternaam" />
                </div>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: NAVY, display: "block", marginBottom: 5 }}>E-mailadres *</label>
                  <input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} style={inputStyle} placeholder="naam@bedrijf.nl" />
                </div>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: NAVY, display: "block", marginBottom: 5 }}>Telefoonnummer</label>
                  <input type="tel" value={form.telefoon} onChange={(e) => set("telefoon", e.target.value)} style={inputStyle} placeholder="+31 6 12345678" />
                </div>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: NAVY, display: "block", marginBottom: 5 }}>Pakket interesse</label>
                  <select value={form.pakket} onChange={(e) => set("pakket", e.target.value)} style={inputStyle}>
                    <option value="">Nog niet zeker</option>
                    <option value="Banner Basis">Banner Basis (EUR 150/maand)</option>
                    <option value="Banner Premium">Banner Premium (EUR 350/maand)</option>
                    <option value="Gesponsorde Woning">Gesponsorde Woning (EUR 95/woning/maand)</option>
                    <option value="Partner Jaarcontract">Partner Jaarcontract (op aanvraag)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: NAVY, display: "block", marginBottom: 5 }}>Overige vragen of wensen</label>
                  <textarea rows={3} value={form.bericht} onChange={(e) => set("bericht", e.target.value)} style={{ ...inputStyle, resize: "vertical" }} placeholder="Bijv. specifieke doelgroep, taal, exclusiviteit..." />
                </div>
                {fout && <div style={{ background: "#fdf0f0", border: "1px solid #e5b0b0", color: "#8B2020", padding: "10px 13px", borderRadius: 4, fontSize: 13.5 }}>{fout}</div>}
                <button type="submit" disabled={loading} style={{ background: NAVY, color: "#fff", border: "none", padding: "13px", borderRadius: 4, fontWeight: 700, fontSize: 15, cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1 }}>
                  {loading ? "Versturen..." : "Voorstel aanvragen"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
