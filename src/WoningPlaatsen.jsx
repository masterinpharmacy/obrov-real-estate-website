import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase, supabaseConfigured } from "./supabase.js";

// ---- Coördinaten parser ----
// Herkent alle gangbare formaten die Google Maps produceert:
//   DMS:      42°05'17.6"N 19°06'00.5"E
//   DD:       42.0882, 19.1001
//   DD spatie: 42.0882 19.1001
function parseCoords(input) {
  if (!input || !input.trim()) return null;
  const s = input.trim();

  // Formaat 1: decimale graden met komma of puntkomma (42.0882, 19.1001)
  const ddComma = s.match(/^(-?\d+\.?\d*)\s*[,;]\s*(-?\d+\.?\d*)$/);
  if (ddComma) {
    const lat = parseFloat(ddComma[1]);
    const lng = parseFloat(ddComma[2]);
    if (isValid(lat, lng)) return { lat, lng };
  }

  // Formaat 2: decimale graden met spatie (42.0882 19.1001)
  const ddSpace = s.match(/^(-?\d+\.?\d+)\s+(-?\d+\.?\d+)$/);
  if (ddSpace) {
    const lat = parseFloat(ddSpace[1]);
    const lng = parseFloat(ddSpace[2]);
    if (isValid(lat, lng)) return { lat, lng };
  }

  // Formaat 3: DMS met N/S en E/W (42°05'17.6"N 19°06'00.5"E)
  // Ook varianten: 42° 05' 17.6" N of 42d05m17.6sN
  const dmsRe = /(\d+)[°d]\s*(\d+)['\u2019m]\s*([\d.]+)["\u201ds]?\s*([NnSs])\s*(\d+)[°d]\s*(\d+)['\u2019m]\s*([\d.]+)["\u201ds]?\s*([EeWwOo])/;
  const dms = s.match(dmsRe);
  if (dms) {
    let lat = parseInt(dms[1]) + parseInt(dms[2]) / 60 + parseFloat(dms[3]) / 3600;
    let lng = parseInt(dms[5]) + parseInt(dms[6]) / 60 + parseFloat(dms[7]) / 3600;
    if (/[Ss]/.test(dms[4])) lat = -lat;
    if (/[WwOo]/.test(dms[8])) lng = -lng;
    if (isValid(lat, lng)) return { lat: round(lat), lng: round(lng) };
  }

  // Formaat 4: enkel decimale waarden naast elkaar zonder scheidingsteken (zeldzaam)
  const parts = s.split(/\s+/);
  if (parts.length === 2) {
    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);
    if (!isNaN(lat) && !isNaN(lng) && isValid(lat, lng)) return { lat, lng };
  }

  return null;
}

function isValid(lat, lng) {
  return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

function round(n) {
  return Math.round(n * 100000) / 100000;
}

const NAVY = "#0B2A52";
const GOLD = "#AC9362";
const CREAM = "#FAF8F4";
const BORDER = "#DCD4C2";

const inputStyle = {
  padding: "13px 15px",
  borderRadius: 3,
  border: `1px solid ${BORDER}`,
  fontSize: 14,
  outline: "none",
  color: "#1A1A1A",
  fontFamily: "inherit",
  width: "100%",
  boxSizing: "border-box",
  background: "#fff",
};

const labelStyle = {
  fontSize: 13,
  fontWeight: 600,
  color: NAVY,
  marginBottom: 5,
  display: "block",
};

function Field({ label, required, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={labelStyle}>{label}{required && <span style={{ color: GOLD }}> *</span>}</label>
      {children}
    </div>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        border: `1px solid ${value ? GOLD : BORDER}`,
        borderRadius: 3,
        cursor: "pointer",
        background: value ? "#FDF7EE" : "#fff",
        userSelect: "none",
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: 3,
          border: `2px solid ${value ? GOLD : "#ccc"}`,
          background: value ? GOLD : "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {value && <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>✓</span>}
      </div>
      <span style={{ fontSize: 14, color: "#1A1A1A" }}>{label}</span>
    </div>
  );
}

const STAPPEN = ["Uw woning", "Details", "Kenmerken", "Foto's & contact", "Betaling"];

export default function WoningPlaatsen() {
  const [stap, setStap] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [fotoPreview, setFotoPreview] = useState([]);
  const [akkoordAV, setAkkoordAV] = useState(false);
  const [showAV, setShowAV] = useState(false);

  const [form, setForm] = useState({
    // Stap 1: basisinfo
    type: "appartement",
    stad: "",
    regio: "",
    adres: "",
    lat: "",
    lng: "",
    vraagprijs: "",

    // Stap 2: details
    oppervlakte_m2: "",
    perceel_m2: "",
    kamers: "",
    slaapkamers: "",
    badkamers: "",
    bouwjaar: "",
    omschrijving_nl: "",
    omschrijving_en: "",

    // Stap 3: kenmerken
    tuin: false,
    zwembad: false,
    garage: false,
    zeezicht: false,
    legale_grond: false,
    papieren_orde: false,
    geasfalteerde_weg: false,
    water: false,
    elektriciteit: false,

    // Stap 4: foto's & contact
    fotos: [],
    verkoper_naam: "",
    verkoper_email: "",
    verkoper_telefoon: "",
    verkoper_is_makelaar: false,
    makelaar_bedrijf: "",
  });

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleFotos = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const previews = files.map((f) => URL.createObjectURL(f));
    setFotoPreview((p) => [...p, ...previews]);
    // Store file objects for upload
    setForm((f) => ({ ...f, _fotoFiles: [...(f._fotoFiles || []), ...files] }));
  };

  const volgende = () => {
    setError("");
    // Validatie per stap
    if (stap === 0) {
      if (!form.stad || !form.vraagprijs) { setError("Vul stad en vraagprijs in."); return; }
    }
    if (stap === 3) {
      if (!form.verkoper_naam || !form.verkoper_email) { setError("Naam en e-mail zijn verplicht."); return; }
    }
    setStap((s) => s + 1);
  };

  const handleSubmit = async () => {
    if (!akkoordAV) {
      setError("U dient akkoord te gaan met de algemene voorwaarden.");
      return;
    }
    setError("");
    setUploading(true);

    try {
      // Woning aanmaken in Supabase — direct actief (gratis testfase)
      const { data: woning, error: dbError } = await supabase
        .from("woningen")
        .insert([{
          type: form.type,
          stad: form.stad,
          regio: form.regio,
          adres: form.adres,
          lat: form.lat ? parseFloat(form.lat) : null,
          lng: form.lng ? parseFloat(form.lng) : null,
          vraagprijs: parseInt(form.vraagprijs),
          oppervlakte_m2: form.oppervlakte_m2 ? parseInt(form.oppervlakte_m2) : null,
          perceel_m2: form.perceel_m2 ? parseInt(form.perceel_m2) : null,
          kamers: form.kamers ? parseInt(form.kamers) : null,
          slaapkamers: form.slaapkamers ? parseInt(form.slaapkamers) : null,
          badkamers: form.badkamers ? parseInt(form.badkamers) : null,
          bouwjaar: form.bouwjaar ? parseInt(form.bouwjaar) : null,
          omschrijving_nl: form.omschrijving_nl,
          omschrijving_en: form.omschrijving_en,
          tuin: form.tuin,
          zwembad: form.zwembad,
          garage: form.garage,
          zeezicht: form.zeezicht,
          legale_grond: form.legale_grond,
          papieren_orde: form.papieren_orde,
          geasfalteerde_weg: form.geasfalteerde_weg,
          water: form.water,
          elektriciteit: form.elektriciteit,
          verkoper_naam: form.verkoper_naam,
          verkoper_email: form.verkoper_email,
          verkoper_telefoon: form.verkoper_telefoon,
          verkoper_is_makelaar: form.verkoper_is_makelaar,
          makelaar_bedrijf: form.makelaar_bedrijf,
          status: "actief",   // ← Direct actief tijdens testfase
          betaald: true,      // ← Gratis, dus als betaald markeren
        }])
        .select()
        .single();

      if (dbError) throw new Error(dbError.message);

      // Foto's uploaden naar Supabase Storage
      if (form._fotoFiles?.length) {
        const uploadedUrls = [];
        for (const file of form._fotoFiles) {
          const fileName = `${woning.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
          const { error: uploadError } = await supabase.storage
            .from("woningfotos")
            .upload(fileName, file, { upsert: false });
          if (!uploadError) {
            const { data: urlData } = supabase.storage.from("woningfotos").getPublicUrl(fileName);
            uploadedUrls.push(urlData.publicUrl);
          }
        }
        if (uploadedUrls.length) {
          await supabase.from("woningen").update({
            fotos: uploadedUrls,
            hoofdfoto: uploadedUrls[0],
          }).eq("id", woning.id);
        }
      }

      // Direct doorsturen naar succespagina (geen Stripe in testfase)
      window.location.href = `/woning-plaatsen/succes?woning_id=${woning.id}`;

    } catch (err) {
      console.error(err);
      setError(`Er ging iets mis: ${err.message}`);
      setUploading(false);
    }
  };

  return (
    <div style={{ fontFamily: "Helvetica, Arial, sans-serif", background: CREAM, minHeight: "100vh" }}>
      <style>{`html,body{overflow-x:hidden;max-width:100%;}*{box-sizing:border-box;}`}</style>

      {/* NAVBAR */}
      <header style={{ background: "rgba(250,248,244,0.95)", borderBottom: `1px solid ${BORDER}`, padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/"><img src="/logo.png" alt="Obrov Real Estate" style={{ height: 52, width: "auto" }} /></Link>
        <Link to="/aanbod" style={{ fontSize: 14, color: NAVY, textDecoration: "none", fontWeight: 600 }}>← Terug naar aanbod</Link>
      </header>

      {/* HERO */}
      <div style={{ background: NAVY, padding: "48px 24px 36px", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "rgba(172,147,98,0.2)", color: "#C2A877", fontSize: 12, fontWeight: 700, letterSpacing: 1.5, padding: "5px 14px", borderRadius: 20, marginBottom: 16 }}>
          WONING PLAATSEN — GRATIS TESTFASE
        </div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(22px, 4vw, 36px)", color: "#FAF8F4", margin: "0 0 12px", fontWeight: 700 }}>
          Bereik kopers uit heel Europa en de diaspora
        </h1>
        <p style={{ color: "#C9D2D0", fontSize: 15, maxWidth: 520, margin: "0 auto 20px" }}>
          Plaats uw woning gratis tijdens onze testfase. Exacte locatie, volledige informatie — transparant voor iedere koper.
        </p>
        {/* Stapindicator */}
        <div style={{ display: "flex", gap: 0, justifyContent: "center", maxWidth: 600, margin: "0 auto" }}>
          {STAPPEN.map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ height: 4, background: i <= stap ? GOLD : "rgba(255,255,255,0.2)", transition: "background 0.3s" }} />
              <div style={{ fontSize: 11, color: i <= stap ? "#C2A877" : "rgba(255,255,255,0.4)", marginTop: 6, fontWeight: i === stap ? 700 : 400 }}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FORMULIER */}
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* STAP 0: Uw woning */}
        {stap === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 24, color: NAVY, margin: "0 0 4px" }}>Uw woning</h2>
            <Field label="Type woning" required>
              <select value={form.type} onChange={(e) => set("type", e.target.value)} style={inputStyle}>
                <option value="appartement">Appartement</option>
                <option value="villa">Villa</option>
                <option value="huis">Huis / woonhuis</option>
                <option value="grond">Grond / perceel</option>
                <option value="commercieel">Commercieel vastgoed</option>
              </select>
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Stad / gemeente" required>
                <input type="text" placeholder="bijv. Budva, Kotor, Tivat" value={form.stad} onChange={(e) => set("stad", e.target.value)} style={inputStyle} />
              </Field>
              <Field label="Regio">
                <input type="text" placeholder="bijv. Budva Riviera" value={form.regio} onChange={(e) => set("regio", e.target.value)} style={inputStyle} />
              </Field>
            </div>
            <Field label="Adres">
              <input type="text" placeholder="Straatnaam en huisnummer (optioneel)" value={form.adres} onChange={(e) => set("adres", e.target.value)} style={inputStyle} />
            </Field>
            <Field label="Locatie op kaart — GPS-coördinaten">
              <p style={{ fontSize: 13, color: "#6B6B6B", margin: "0 0 8px" }}>
                Ga naar <a href="https://maps.google.com" target="_blank" rel="noreferrer" style={{ color: GOLD }}>Google Maps</a>, rechtsklikt op de locatie → kopieer de coördinaten, en plak ze hier in één keer.
              </p>
              <input
                type="text"
                placeholder="bijv. 42.0882, 19.1001 of DMS-formaat"
                value={form._coordRaw || (form.lat && form.lng ? `${form.lat}, ${form.lng}` : "")}
                onChange={(e) => {
                  const raw = e.target.value;
                  set("_coordRaw", raw);
                  // Probeer te parsen
                  const parsed = parseCoords(raw);
                  if (parsed) {
                    set("lat", String(parsed.lat));
                    set("lng", String(parsed.lng));
                  } else {
                    set("lat", "");
                    set("lng", "");
                  }
                }}
                style={{ ...inputStyle, fontFamily: "monospace", fontSize: 13 }}
              />
              {/* Feedbackregel */}
              {form._coordRaw && (
                form.lat && form.lng
                  ? <div style={{ fontSize: 12, color: "#2E7D32", marginTop: 5 }}>
                      ✓ Herkend: {parseFloat(form.lat).toFixed(5)}°N, {parseFloat(form.lng).toFixed(5)}°O
                      {" "}<a href={`https://www.google.com/maps?q=${form.lat},${form.lng}`} target="_blank" rel="noreferrer" style={{ color: GOLD, marginLeft: 8 }}>Controleer op kaart →</a>
                    </div>
                  : <div style={{ fontSize: 12, color: "#c62828", marginTop: 5 }}>
                      Formaat niet herkend — probeer: 42.0882, 19.1001 of 42°05'17"N 19°06'00"E
                    </div>
              )}
            </Field>
            <Field label="Vraagprijs (€)" required>
              <input type="number" placeholder="bijv. 185000" value={form.vraagprijs} onChange={(e) => set("vraagprijs", e.target.value)} style={inputStyle} min="0" />
            </Field>
          </div>
        )}

        {/* STAP 1: Details */}
        {stap === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 24, color: NAVY, margin: "0 0 4px" }}>Details</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Woonoppervlakte (m²)">
                <input type="number" placeholder="bijv. 95" value={form.oppervlakte_m2} onChange={(e) => set("oppervlakte_m2", e.target.value)} style={inputStyle} />
              </Field>
              <Field label="Perceeloppervlakte (m²)">
                <input type="number" placeholder="bijv. 500" value={form.perceel_m2} onChange={(e) => set("perceel_m2", e.target.value)} style={inputStyle} />
              </Field>
              <Field label="Aantal kamers">
                <input type="number" placeholder="bijv. 4" value={form.kamers} onChange={(e) => set("kamers", e.target.value)} style={inputStyle} min="0" />
              </Field>
              <Field label="Aantal slaapkamers">
                <input type="number" placeholder="bijv. 2" value={form.slaapkamers} onChange={(e) => set("slaapkamers", e.target.value)} style={inputStyle} min="0" />
              </Field>
              <Field label="Aantal badkamers">
                <input type="number" placeholder="bijv. 1" value={form.badkamers} onChange={(e) => set("badkamers", e.target.value)} style={inputStyle} min="0" />
              </Field>
              <Field label="Bouwjaar">
                <input type="number" placeholder="bijv. 2018" value={form.bouwjaar} onChange={(e) => set("bouwjaar", e.target.value)} style={inputStyle} min="1900" max="2030" />
              </Field>
            </div>
            <Field label="Omschrijving (Nederlands)">
              <textarea rows={4} placeholder="Beschrijf de woning: ligging, staat, bijzonderheden..." value={form.omschrijving_nl} onChange={(e) => set("omschrijving_nl", e.target.value)} style={{ ...inputStyle, resize: "vertical" }} />
            </Field>
            <Field label="Omschrijving (Engels)">
              <textarea rows={4} placeholder="Describe the property in English (optional)..." value={form.omschrijving_en} onChange={(e) => set("omschrijving_en", e.target.value)} style={{ ...inputStyle, resize: "vertical" }} />
            </Field>
          </div>
        )}

        {/* STAP 2: Kenmerken */}
        {stap === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 24, color: NAVY, margin: "0 0 4px" }}>Kenmerken</h2>
            <p style={{ fontSize: 14, color: "#6B6B6B", margin: "0 0 8px" }}>Selecteer alle kenmerken die van toepassing zijn op uw woning.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Toggle label="Tuin" value={form.tuin} onChange={(v) => set("tuin", v)} />
              <Toggle label="Zwembad" value={form.zwembad} onChange={(v) => set("zwembad", v)} />
              <Toggle label="Garage / parkeerplaats" value={form.garage} onChange={(v) => set("garage", v)} />
              <Toggle label="Zeezicht" value={form.zeezicht} onChange={(v) => set("zeezicht", v)} />
              <Toggle label="Water aanwezig" value={form.water} onChange={(v) => set("water", v)} />
              <Toggle label="Elektriciteit aanwezig" value={form.elektriciteit} onChange={(v) => set("elektriciteit", v)} />
              <Toggle label="Geasfalteerde weg ernaar toe" value={form.geasfalteerde_weg} onChange={(v) => set("geasfalteerde_weg", v)} />
              <Toggle label="Legale grond" value={form.legale_grond} onChange={(v) => set("legale_grond", v)} />
              <Toggle label="Alle papieren in orde" value={form.papieren_orde} onChange={(v) => set("papieren_orde", v)} />
            </div>
          </div>
        )}

        {/* STAP 3: Foto's & contact */}
        {stap === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 24, color: NAVY, margin: "0 0 4px" }}>Foto's & contactgegevens</h2>

            {/* Foto upload */}
            <div>
              <label style={labelStyle}>Eigen foto's uploaden (voorlopig, professionele fotosessie volgt)</label>
              <div style={{ border: `2px dashed ${BORDER}`, borderRadius: 4, padding: "24px 20px", textAlign: "center", background: "#fff" }}>
                <input type="file" accept="image/*" multiple id="foto-upload" onChange={handleFotos} style={{ display: "none" }} />
                <label htmlFor="foto-upload" style={{ cursor: "pointer" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>📷</div>
                  <div style={{ fontSize: 14, color: NAVY, fontWeight: 600 }}>Klik om foto's te selecteren</div>
                  <div style={{ fontSize: 12, color: "#6B6B6B", marginTop: 4 }}>JPG, PNG — maximaal 10MB per foto</div>
                </label>
              </div>
              {fotoPreview.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 8, marginTop: 12 }}>
                  {fotoPreview.map((url, i) => (
                    <img key={i} src={url} alt="" style={{ width: "100%", height: 90, objectFit: "cover", borderRadius: 3, border: `1px solid ${BORDER}` }} />
                  ))}
                </div>
              )}
            </div>

            {/* Contact */}
            <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 20 }}>
              <label style={{ ...labelStyle, fontSize: 15, marginBottom: 14 }}>Uw contactgegevens</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Toggle label="Ik ben een makelaar / zakelijk verkoper" value={form.verkoper_is_makelaar} onChange={(v) => set("verkoper_is_makelaar", v)} />
                {form.verkoper_is_makelaar && (
                  <Field label="Bedrijfsnaam / makelaarskantoor">
                    <input type="text" value={form.makelaar_bedrijf} onChange={(e) => set("makelaar_bedrijf", e.target.value)} style={inputStyle} placeholder="bijv. Obrov Real Estate" />
                  </Field>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <Field label="Naam" required>
                    <input type="text" value={form.verkoper_naam} onChange={(e) => set("verkoper_naam", e.target.value)} style={inputStyle} placeholder="Uw volledige naam" />
                  </Field>
                  <Field label="Telefoonnummer">
                    <input type="tel" value={form.verkoper_telefoon} onChange={(e) => set("verkoper_telefoon", e.target.value)} style={inputStyle} placeholder="+31 6 12345678" />
                  </Field>
                </div>
                <Field label="E-mailadres" required>
                  <input type="email" value={form.verkoper_email} onChange={(e) => set("verkoper_email", e.target.value)} style={inputStyle} placeholder="naam@voorbeeld.nl" />
                </Field>
              </div>
            </div>
          </div>
        )}

        {/* STAP 4: Bevestiging + AV */}
        {stap === 4 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🏠</div>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: 26, color: NAVY, margin: "0 0 8px" }}>Klaar voor plaatsing</h2>
              <div style={{ display: "inline-block", background: "#E8F5E9", color: "#2E7D32", fontSize: 13.5, fontWeight: 700, padding: "6px 16px", borderRadius: 20 }}>
                ✓ Gratis plaatsen — testfase
              </div>
            </div>

            {/* Samenvatting */}
            <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "20px", marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: "#6B6B6B", fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>SAMENVATTING</div>
              <div style={{ fontSize: 15, color: NAVY, fontWeight: 600 }}>{form.type.charAt(0).toUpperCase() + form.type.slice(1)} in {form.stad}</div>
              {form.vraagprijs && <div style={{ fontSize: 14, color: "#3D3D3D", marginTop: 4 }}>Vraagprijs: €{parseInt(form.vraagprijs).toLocaleString("nl-NL")}</div>}
              {form.oppervlakte_m2 && <div style={{ fontSize: 14, color: "#3D3D3D" }}>{form.oppervlakte_m2} m² woonoppervlakte</div>}
              {form.slaapkamers && <div style={{ fontSize: 14, color: "#3D3D3D" }}>{form.slaapkamers} slaapkamers</div>}
              <div style={{ borderTop: `1px solid ${BORDER}`, marginTop: 14, paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>Plaatsingskosten</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: "#2E7D32" }}>GRATIS</span>
              </div>
              <div style={{ fontSize: 12, color: "#6B6B6B", marginTop: 4 }}>
                Tijdelijk gratis tijdens de testfase. Later: €150/maand via automatische incasso.
              </div>
            </div>

            {/* Wat u krijgt */}
            <div style={{ background: "#F2EDE0", borderRadius: 4, padding: "16px 18px", marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 10, letterSpacing: 1 }}>WAT U KRIJGT</div>
              {[
                "Directe zichtbaarheid voor kopers uit heel Europa en de diaspora",
                "Exacte locatie zichtbaar op de kaart — transparantie voor de koper",
                "Uw contactgegevens zichtbaar op de advertentie",
                "Aanbod in 10 Europese talen",
                "Professionele fotosessie beschikbaar op aanvraag",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                  <span style={{ color: GOLD, fontWeight: 700, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 13.5, color: "#3D3D3D" }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Algemene voorwaarden */}
            <div style={{ background: "#fff", border: `1.5px solid ${akkoordAV ? GOLD : BORDER}`, borderRadius: 6, padding: "16px 18px", marginBottom: 8 }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={akkoordAV}
                  onChange={(e) => setAkkoordAV(e.target.checked)}
                  style={{ width: 18, height: 18, marginTop: 2, flexShrink: 0, cursor: "pointer" }}
                />
                <span style={{ fontSize: 14, color: "#1A1A1A", lineHeight: 1.6 }}>
                  Ik ga akkoord met de{" "}
                  <button
                    type="button"
                    onClick={() => setShowAV(true)}
                    style={{ background: "none", border: "none", color: GOLD, fontWeight: 700, cursor: "pointer", fontSize: 14, padding: 0, textDecoration: "underline" }}
                  >
                    algemene voorwaarden
                  </button>
                  {" "}van Obrov Real Estate, inclusief de €150/maand abonnementskosten die na de gratis testfase via automatische incasso worden afgeschreven.
                </span>
              </label>
            </div>
          </div>
        )}

        {/* ALGEMENE VOORWAARDEN MODAL */}
        {showAV && (
          <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <div style={{ background: "#fff", borderRadius: 8, maxWidth: 640, width: "100%", maxHeight: "80vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "20px 24px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontFamily: "Georgia, serif", fontSize: 20, color: NAVY, margin: 0 }}>Algemene voorwaarden</h3>
                <button onClick={() => setShowAV(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#666" }}>×</button>
              </div>
              <div style={{ padding: "20px 24px", overflowY: "auto", fontSize: 13.5, lineHeight: 1.7, color: "#3D3D3D" }}>
                <p><strong>Obrov Real Estate — Algemene Voorwaarden Vastgoedplaatsing</strong></p>
                <p style={{ marginTop: 12 }}><strong>1. Partijen</strong><br/>
                Deze voorwaarden zijn van toepassing op de overeenkomst tussen Obrov Real Estate (onderdeel van Masters in Pharmacy B.V., gevestigd in Nederland) en de adverteerder die een vastgoedobject plaatst op het platform obrovrealestate.nl en aanverwante domeinen.</p>
                <p style={{ marginTop: 12 }}><strong>2. Plaatsing tijdens de testfase</strong><br/>
                Tijdens de testfase is plaatsing van vastgoedobjecten gratis. Obrov Real Estate behoudt zich het recht voor de testfase te beëindigen en over te gaan naar een betaald abonnement, met een minimale opzegtermijn van 30 dagen per e-mail.</p>
                <p style={{ marginTop: 12 }}><strong>3. Abonnementskosten na de testfase</strong><br/>
                Na afloop van de gratis testfase bedragen de plaatsingskosten €150 per maand per vastgoedobject. De adverteerder gaat bij plaatsing akkoord met een automatische maandelijkse incasso op iedere 1e van de maand via Stripe.</p>
                <p style={{ marginTop: 12 }}><strong>4. Geen restitutie</strong><br/>
                Bij verkoop van het object binnen een lopende maand wordt de maandelijkse bijdrage van €150 niet gerestitueerd. De adverteerder is verantwoordelijk voor het tijdig verwijderen of markeren als "verkocht" van het object.</p>
                <p style={{ marginTop: 12 }}><strong>5. Nauwkeurigheid van informatie</strong><br/>
                De adverteerder garandeert dat alle verstrekte informatie — inclusief locatie, oppervlakte, papieren en eigendomsstatus — correct en volledig is. Obrov Real Estate is niet aansprakelijk voor onjuiste informatie verstrekt door de adverteerder.</p>
                <p style={{ marginTop: 12 }}><strong>6. GPS-locatie</strong><br/>
                De adverteerder stemt ermee in de exacte GPS-coördinaten van het object te verstrekken. Dit is een kernwaarde van het platform: transparantie over locatie voor potentiële kopers.</p>
                <p style={{ marginTop: 12 }}><strong>7. Zichtbaarheid contactgegevens</strong><br/>
                De naam, het telefoonnummer en e-mailadres van de adverteerder worden zichtbaar weergegeven op de advertentiepagina en zijn toegankelijk voor alle bezoekers van het platform.</p>
                <p style={{ marginTop: 12 }}><strong>8. Opzegging</strong><br/>
                De adverteerder kan het abonnement op elk moment opzeggen via info@obrovrealestate.nl. Opzegging gaat in per de 1e van de volgende maand.</p>
                <p style={{ marginTop: 12 }}><strong>9. Toepasselijk recht</strong><br/>
                Op deze overeenkomst is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de bevoegde rechter in Nederland.</p>
                <p style={{ marginTop: 12, color: "#6B6B6B", fontSize: 12 }}>Versie 1.0 — Obrov Real Estate, 2026. Contact: info@obrovrealestate.nl</p>
              </div>
              <div style={{ padding: "16px 24px", borderTop: `1px solid ${BORDER}`, display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button onClick={() => setShowAV(false)} style={{ background: "none", border: `1.5px solid ${BORDER}`, color: NAVY, padding: "10px 20px", borderRadius: 3, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>Sluiten</button>
                <button onClick={() => { setAkkoordAV(true); setShowAV(false); }} style={{ background: NAVY, color: "#fff", border: "none", padding: "10px 20px", borderRadius: 3, cursor: "pointer", fontWeight: 700, fontSize: 14 }}>Akkoord & sluiten</button>
              </div>
            </div>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div style={{ background: "#fdf0f0", border: "1px solid #e5b0b0", color: "#8B2020", padding: "12px 16px", borderRadius: 3, fontSize: 14, marginTop: 16 }}>
            {error}
          </div>
        )}

        {/* NAVIGATIEKNOPPEN */}
        <div style={{ display: "flex", gap: 12, marginTop: 32, justifyContent: stap > 0 ? "space-between" : "flex-end" }}>
          {stap > 0 && (
            <button onClick={() => setStap((s) => s - 1)} style={{ background: "none", border: `1.5px solid ${NAVY}`, color: NAVY, padding: "13px 24px", borderRadius: 3, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
              ← Vorige
            </button>
          )}
          {stap < 4 ? (
            <button onClick={volgende} style={{ background: NAVY, color: "#fff", border: "none", padding: "13px 28px", borderRadius: 3, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              Volgende →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={uploading || !akkoordAV}
              style={{ background: akkoordAV ? "#2E7D32" : "#aaa", color: "#fff", border: "none", padding: "15px 32px", borderRadius: 3, fontWeight: 700, fontSize: 15, cursor: (uploading || !akkoordAV) ? "default" : "pointer" }}
            >
              {uploading ? "Bezig met plaatsen..." : "Gratis plaatsen →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
