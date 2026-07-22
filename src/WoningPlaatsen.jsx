import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase, supabaseConfigured } from "./supabase.js";

const NAVY = "#0B2A52";
const GOLD = "#AC9362";
const BORDER = "#DCD4C2";
const CREAM = "#FAF8F4";

const inputStyle = { width: "100%", padding: "11px 13px", border: `1px solid ${BORDER}`, borderRadius: 4, fontSize: 14.5, fontFamily: "inherit", outline: "none", background: "#fff", color: "#1A1A1A" };
const labelStyle = { fontSize: 13, fontWeight: 600, color: NAVY, display: "block", marginBottom: 6 };

function Field({ label, required, children, hint }) {
  return (
    <div>
      <label style={labelStyle}>{label}{required && <span style={{ color: GOLD }}> *</span>}</label>
      {hint && <div style={{ fontSize: 12, color: "#888", marginBottom: 5 }}>{hint}</div>}
      {children}
    </div>
  );
}

function Toggle({ label, value, onChange, sub }) {
  return (
    <label style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", border: `1.5px solid ${value ? NAVY : BORDER}`, borderRadius: 6, cursor: "pointer", background: value ? "#F0F4FA" : "#fff", transition: "all 0.15s" }}>
      <input type="checkbox" checked={value || false} onChange={(e) => onChange(e.target.checked)} style={{ width: 16, height: 16, accentColor: NAVY, marginTop: 2, flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: 14, fontWeight: value ? 600 : 400, color: value ? NAVY : "#333" }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{sub}</div>}
      </div>
    </label>
  );
}

// GPS kaart picker component
function KaartPicker({ lat, lng, onPick }) {
  const mapHtml = `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>body{margin:0}#map{height:100vh;cursor:crosshair}.info{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);background:rgba(11,42,82,0.92);color:#fff;padding:8px 16px;border-radius:20px;font-size:13px;font-family:sans-serif;z-index:1000;white-space:nowrap;pointer-events:none}</style>
</head><body>
<div id="map"></div>
<div class="info">Klik op de kaart om de locatie te pinnen</div>
<script>
var initLat = ${lat || 42.43}, initLng = ${lng || 19.26}, initZoom = ${lat ? 14 : 7};
var map = L.map('map').setView([initLat, initLng], initZoom);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'OSM'}).addTo(map);
var marker = null;
if(${!!lat}){
  marker = L.marker([${lat || 0},${lng || 0}],{draggable:true}).addTo(map);
  marker.on('dragend',function(e){window.parent.postMessage({type:'coords',lat:e.target.getLatLng().lat,lng:e.target.getLatLng().lng},'*');});
}
map.on('click',function(e){
  if(marker) map.removeLayer(marker);
  marker = L.marker(e.latlng,{draggable:true}).addTo(map);
  marker.on('dragend',function(ev){window.parent.postMessage({type:'coords',lat:ev.target.getLatLng().lat,lng:ev.target.getLatLng().lng},'*');});
  window.parent.postMessage({type:'coords',lat:e.latlng.lat,lng:e.latlng.lng},'*');
});
</script></body></html>`;

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === "coords") onPick(e.data.lat, e.data.lng);
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [onPick]);

  return (
    <div style={{ border: `1.5px solid ${BORDER}`, borderRadius: 8, overflow: "hidden", height: 320, position: "relative" }}>
      <iframe srcDoc={mapHtml} style={{ width: "100%", height: "100%", border: "none", display: "block" }} title="Locatie kiezen" />
      {lat && lng && (
        <div style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(11,42,82,0.9)", color: "#fff", padding: "5px 10px", borderRadius: 12, fontSize: 12, pointerEvents: "none" }}>
          {parseFloat(lat).toFixed(5)}, {parseFloat(lng).toFixed(5)}
        </div>
      )}
    </div>
  );
}

const STAPPEN = ["Woning", "Details", "Kenmerken", "Belasting", "Plattegrond", "Foto's", "Bevestig"];

const INIT_FORM = {
  type: "appartement", stad: "", regio: "", adres: "",
  lat: "", lng: "",
  vraagprijs: "",
  oppervlakte_m2: "", perceel_m2: "", kamers: "", slaapkamers: "", badkamers: "", bouwjaar: "",
  // Kenmerken
  tuin: false, zwembad: false, garage: false, zeezicht: false, bergzicht: false, rivierzicht: false,
  water: false, elektriciteit: false, geasfalteerde_weg: false, legale_grond: false,
  papieren_orde: false, vergunning_aanwezig: false, riolering: false,
  airco: false, verwarming: false, lift: false, terras: false, kelder: false,
  gemeubileerd: false, nieuwbouw: false, renovatie_nodig: false, bestaande_bouw: false,
  // Belasting
  belasting_per_jaar: "",
  // AI omschrijving
  ai_info_dump: "", omschrijving_nl: "", omschrijving_en: "", omschrijving_de: "", omschrijving_cg: "", ai_generating: false,
  // Foto's
  _fotoFiles: [], _plattegrondFiles: [],
  // Contact
  verkoper_naam: "", verkoper_email: "", verkoper_telefoon: "", verkoper_is_makelaar: false, makelaar_bedrijf: "",
};

export default function WoningPlaatsen() {
  const navigate = useNavigate();
  const [gebruiker, setGebruiker] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [stap, setStap] = useState(0);
  const [form, setForm] = useState(INIT_FORM);
  const [fotoPreview, setFotoPreview] = useState([]);
  const [plattegrondPreview, setPlattegrondPreview] = useState([]);
  const [akkoordAV, setAkkoordAV] = useState(false);
  const [showAV, setShowAV] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabaseConfigured || !supabase) { setAuthLoading(false); return; }
    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user;
      if (user) {
        setGebruiker(user);

        // Contactgegevens voorinvullen vanuit het profiel, zodat een
        // ingelogde verkoper ze niet opnieuw hoeft te typen.
        const { data: profiel } = await supabase
          .from("profielen")
          .select("naam, email, telefoon, is_makelaar, bedrijf")
          .eq("id", user.id)
          .maybeSingle();

        setForm((f) => ({
          ...f,
          verkoper_naam: f.verkoper_naam || profiel?.naam || user.user_metadata?.naam || "",
          verkoper_email: f.verkoper_email || profiel?.email || user.email || "",
          verkoper_telefoon: f.verkoper_telefoon || profiel?.telefoon || "",
          verkoper_is_makelaar: f.verkoper_is_makelaar || profiel?.is_makelaar || false,
          makelaar_bedrijf: f.makelaar_bedrijf || profiel?.bedrijf || "",
        }));
      }
      setAuthLoading(false);
    });
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // Voegt nieuwe bestanden toe aan de bestaande selectie in plaats van te vervangen.
  // Dedupe op naam+grootte+datum zodat dezelfde foto niet dubbel in de lijst komt.
  const mergeFiles = (bestaand, nieuw) => {
    const key = (f) => `${f.name}-${f.size}-${f.lastModified}`;
    const aanwezig = new Set(bestaand.map(key));
    return [...bestaand, ...nieuw.filter((f) => !aanwezig.has(key(f)))];
  };

  const handleFotos = (e) => {
    const nieuw = Array.from(e.target.files);
    setForm((f) => {
      const samen = mergeFiles(f._fotoFiles || [], nieuw);
      setFotoPreview(samen.map((x) => URL.createObjectURL(x)));
      return { ...f, _fotoFiles: samen };
    });
    e.target.value = ""; // zodat dezelfde foto opnieuw gekozen kan worden na verwijderen
  };

  const verwijderFoto = (index) => {
    setForm((f) => {
      const over = (f._fotoFiles || []).filter((_, i) => i !== index);
      setFotoPreview((prev) => {
        if (prev[index]) URL.revokeObjectURL(prev[index]);
        return prev.filter((_, i) => i !== index);
      });
      return { ...f, _fotoFiles: over };
    });
  };

  const handlePlattegrond = (e) => {
    const nieuw = Array.from(e.target.files);
    setForm((f) => {
      const samen = mergeFiles(f._plattegrondFiles || [], nieuw);
      setPlattegrondPreview(samen.map((x) => URL.createObjectURL(x)));
      return { ...f, _plattegrondFiles: samen };
    });
    e.target.value = "";
  };

  const verwijderPlattegrond = (index) => {
    setForm((f) => {
      const over = (f._plattegrondFiles || []).filter((_, i) => i !== index);
      setPlattegrondPreview((prev) => {
        if (prev[index]) URL.revokeObjectURL(prev[index]);
        return prev.filter((_, i) => i !== index);
      });
      return { ...f, _plattegrondFiles: over };
    });
  };

  const handleAIGenereren = async () => {
    if (!form.ai_info_dump.trim()) { setError("Vul eerst informatie in over de woning."); return; }
    set("ai_generating", true);
    setError("");
    try {
      const res = await fetch("/api/ai-omschrijving", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          info: form.ai_info_dump,
          type: form.type,
          stad: form.stad,
          regio: form.regio,
          vraagprijs: form.vraagprijs,
          oppervlakte_m2: form.oppervlakte_m2,
          slaapkamers: form.slaapkamers,
          bouwjaar: form.bouwjaar,
          zeezicht: form.zeezicht,
          bergzicht: form.bergzicht,
          rivierzicht: form.rivierzicht,
          nieuwbouw: form.nieuwbouw,
          bestaande_bouw: form.bestaande_bouw,
          renovatie_nodig: form.renovatie_nodig,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Mislukt");
      setForm((f) => ({
        ...f,
        omschrijving_nl: data.nl || "",
        omschrijving_en: data.en || "",
        omschrijving_de: data.de || "",
        omschrijving_cg: data.cg || "",
      }));
    } catch (err) {
      setError(err.message && err.message !== "Mislukt" ? err.message : "AI genereren mislukt. Probeer opnieuw.");
    } finally {
      set("ai_generating", false);
    }
  };

  const volgende = () => {
    setError("");
    if (stap === 0) {
      if (!form.stad) { setError("Vul de stad in."); return; }
      if (!form.vraagprijs) { setError("Vul de vraagprijs in."); return; }
      if (!form.lat || !form.lng) { setError("Pin de locatie op de kaart."); return; }
    }
    if (stap === 1) {
      // Engels is verplicht: het aanbod wordt internationaal getoond.
      if (!form.omschrijving_en || form.omschrijving_en.trim().length < 50) {
        setError("Een Engelse omschrijving is verplicht. Genereer de teksten of vul het Engelse veld zelf aan."); return;
      }
      if (!form.omschrijving_nl || form.omschrijving_nl.trim().length < 50) {
        setError("Een Nederlandse omschrijving is verplicht."); return;
      }
    }
    if (stap === 4 && form._plattegrondFiles.length === 0) {
      setError("Upload minimaal 1 plattegrond."); return;
    }
    setStap((s) => s + 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    if (!akkoordAV) { setError("U dient akkoord te gaan met de algemene voorwaarden."); return; }
    setError(""); setUploading(true);
    try {
      if (!supabaseConfigured || !supabase) {
        await fetch("/api/auth-notificatie", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "plaatsing", naam: form.verkoper_naam, email: form.verkoper_email, woning: { type: form.type, stad: form.stad, vraagprijs: form.vraagprijs } }),
        }).catch(() => {});
        window.location.href = "/woning-plaatsen/succes"; return;
      }
      const payload = {
        type: form.type, stad: form.stad, regio: form.regio, adres: form.adres,
        lat: form.lat ? parseFloat(form.lat) : null, lng: form.lng ? parseFloat(form.lng) : null,
        vraagprijs: parseInt(form.vraagprijs),
        oppervlakte_m2: form.oppervlakte_m2 ? parseInt(form.oppervlakte_m2) : null,
        perceel_m2: form.perceel_m2 ? parseInt(form.perceel_m2) : null,
        kamers: form.kamers ? parseInt(form.kamers) : null,
        slaapkamers: form.slaapkamers ? parseInt(form.slaapkamers) : null,
        badkamers: form.badkamers ? parseInt(form.badkamers) : null,
        bouwjaar: form.bouwjaar ? parseInt(form.bouwjaar) : null,
        omschrijving_nl: form.omschrijving_nl, omschrijving_en: form.omschrijving_en,
        omschrijving_de: form.omschrijving_de, omschrijving_cg: form.omschrijving_cg,
        tuin: form.tuin, zwembad: form.zwembad, garage: form.garage, zeezicht: form.zeezicht,
        bergzicht: form.bergzicht, rivierzicht: form.rivierzicht, water: form.water, elektriciteit: form.elektriciteit,
        geasfalteerde_weg: form.geasfalteerde_weg, legale_grond: form.legale_grond,
        papieren_orde: form.papieren_orde, vergunning_aanwezig: form.vergunning_aanwezig,
        riolering: form.riolering, airco: form.airco, verwarming: form.verwarming,
        lift: form.lift, terras: form.terras, kelder: form.kelder,
        gemeubileerd: form.gemeubileerd, nieuwbouw: form.nieuwbouw, renovatie_nodig: form.renovatie_nodig,
        bestaande_bouw: form.bestaande_bouw,
        belasting_per_jaar: form.belasting_per_jaar ? parseFloat(form.belasting_per_jaar) : null,
        verkoper_naam: form.verkoper_naam, verkoper_email: form.verkoper_email,
        verkoper_telefoon: form.verkoper_telefoon, verkoper_is_makelaar: form.verkoper_is_makelaar,
        makelaar_bedrijf: form.makelaar_bedrijf, status: "actief", betaald: true,
        user_id: gebruiker?.id || null,
      };

      // Als de database een kolom nog niet kent (bijvoorbeeld door een
      // verouderde PostgREST schema cache), haalt Supabase de hele insert
      // onderuit. In plaats van de plaatsing te blokkeren laten we het
      // betreffende veld weg en proberen we het opnieuw. De woning wordt
      // dan geplaatst zonder dat ene kenmerk in plaats van helemaal niet.
      const insertMetHerstel = async (data, pogingen = 8) => {
        let huidig = { ...data };
        const weggelaten = [];
        for (let i = 0; i < pogingen; i++) {
          const res = await supabase.from("woningen").insert([huidig]).select().single();
          if (!res.error) return { woning: res.data, weggelaten };

          const bericht = res.error.message || "";
          const kolom = bericht.match(/'([^']+)' column/)?.[1]
            || bericht.match(/column "([^"]+)"/)?.[1];

          if (kolom && kolom in huidig) {
            console.warn(`Kolom ${kolom} onbekend in database, wordt overgeslagen.`);
            weggelaten.push(kolom);
            const { [kolom]: _weg, ...rest } = huidig;
            huidig = rest;
            continue;
          }
          throw new Error(bericht);
        }
        throw new Error("Plaatsing mislukt: te veel onbekende velden in de database.");
      };

      const { woning, weggelaten } = await insertMetHerstel(payload);
      if (weggelaten.length) {
        console.warn("Niet opgeslagen velden:", weggelaten.join(", "));
      }

      // Foto's uploaden
      const uploadFiles = async (files, prefix) => {
        const urls = [];
        for (const file of files) {
          const fn = `${woning.id}/${prefix}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
          const { error: upErr } = await supabase.storage.from("woningfotos").upload(fn, file, { upsert: false });
          if (!upErr) {
            const { data: u } = supabase.storage.from("woningfotos").getPublicUrl(fn);
            urls.push(u.publicUrl);
          }
        }
        return urls;
      };
      const fotoUrls = await uploadFiles(form._fotoFiles || [], "foto");
      const plattegrondUrls = await uploadFiles(form._plattegrondFiles || [], "plattegrond");
      if (fotoUrls.length || plattegrondUrls.length) {
        await supabase.from("woningen").update({ fotos: fotoUrls, hoofdfoto: fotoUrls[0] || null, plattegronden: plattegrondUrls }).eq("id", woning.id);
      }
      await fetch("/api/auth-notificatie", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "plaatsing", naam: form.verkoper_naam, email: form.verkoper_email, woning: { type: form.type, stad: form.stad, vraagprijs: form.vraagprijs } }) }).catch(() => {});
      window.location.href = `/woning-plaatsen/succes?woning_id=${woning.id}`;
    } catch (err) {
      setError(`Er ging iets mis: ${err.message}`);
      setUploading(false);
    }
  };

  if (authLoading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Helvetica, sans-serif", color: "#6B6B6B" }}>Laden...</div>;

  return (
    <div style={{ fontFamily: "Helvetica, Arial, sans-serif", background: CREAM, minHeight: "100vh" }}>
      <style>{`
        html,body{overflow-x:hidden;width:100%;max-width:100%;}
        *{box-sizing:border-box;}
        @media(max-width:600px){
          .grid-2{grid-template-columns:1fr!important;}
          .grid-toggle-2{grid-template-columns:1fr!important;}
          .form-padding{padding:20px 14px 60px!important;}
          .hero-padding{padding:24px 14px 20px!important;}
          .nav-padding{padding:10px 14px!important;}
        }
      `}</style>

      {/* NAVBAR */}
      <header className="nav-padding" style={{ background: "rgba(250,248,244,0.95)", borderBottom: `1px solid ${BORDER}`, padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/"><img src="/logo.png" alt="Obrov Real Estate" style={{ height: 52, width: "auto" }} /></Link>
        <Link to="/aanbod" style={{ fontSize: 14, color: NAVY, textDecoration: "none", fontWeight: 600 }}>Terug naar aanbod</Link>
      </header>

      {/* HERO */}
      <div className="hero-padding" style={{ background: NAVY, padding: "36px 24px 28px", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "rgba(172,147,98,0.2)", color: "#C2A877", fontSize: 12, fontWeight: 700, letterSpacing: 1.5, padding: "5px 14px", borderRadius: 20, marginBottom: 10 }}>
          WONING PLAATSEN
        </div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(20px, 4vw, 30px)", color: "#FAF8F4", margin: "0 0 6px", fontWeight: 700 }}>
          Bereik kopers uit heel Europa en de diaspora
        </h1>

        {/* Gratis banner */}
        <div style={{ display: "inline-block", background: "rgba(46,125,50,0.25)", border: "1px solid rgba(46,125,50,0.5)", color: "#A5D6A7", fontSize: 13, fontWeight: 700, padding: "5px 16px", borderRadius: 20, margin: "8px 0 14px" }}>
          Gratis plaatsen t/m 31 oktober 2026, daarna €195 eenmalig
        </div>

        {/* Stapindicator */}
        <div style={{ display: "flex", gap: 0, justifyContent: "center", maxWidth: 700, margin: "0 auto" }}>
          {STAPPEN.map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ height: 3, background: i <= stap ? GOLD : "rgba(255,255,255,0.2)", transition: "background 0.3s" }} />
              <div style={{ fontSize: 10, color: i <= stap ? "#C2A877" : "rgba(255,255,255,0.4)", marginTop: 5, fontWeight: i === stap ? 700 : 400 }}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FORMULIER */}
      <div className="form-padding" style={{ maxWidth: 720, margin: "0 auto", padding: "36px 24px 80px" }}>

        {/* STAP 0: Locatie */}
        {stap === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 24, color: NAVY, margin: "0 0 4px" }}>Uw woning</h2>

            <Field label="Type woning" required>
              <select value={form.type} onChange={(e) => set("type", e.target.value)} style={inputStyle}>
                <option value="appartement">Appartement</option>
                <option value="villa">Villa</option>
                <option value="huis">Huis / woonhuis</option>
                <option value="grond">Grond / perceel</option>
                <option value="project">Off-plan project</option>
                <option value="commercieel">Commercieel vastgoed</option>
              </select>
            </Field>

            <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
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

            <Field
              label="Locatie pinnen op kaart"
              required
              hint="Klik op de exacte locatie van de woning op de kaart. U kunt de pin ook verschuiven na plaatsing."
            >
              <KaartPicker
                lat={form.lat}
                lng={form.lng}
                onPick={(lat, lng) => { set("lat", String(lat.toFixed(6))); set("lng", String(lng.toFixed(6))); }}
              />
              {form.lat && form.lng ? (
                <div style={{ fontSize: 12.5, color: "#2E7D32", marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                  Locatie gepind: {parseFloat(form.lat).toFixed(5)}N, {parseFloat(form.lng).toFixed(5)}O
                  <a href={`https://www.google.com/maps?q=${form.lat},${form.lng}`} target="_blank" rel="noreferrer" style={{ color: GOLD }}>Controleer</a>
                </div>
              ) : (
                <div style={{ fontSize: 12.5, color: "#c62828", marginTop: 8 }}>Klik op de kaart om de locatie te pinnen (verplicht)</div>
              )}
            </Field>

            <Field label="Vraagprijs (EUR)" required>
              <input type="number" placeholder="bijv. 185000" value={form.vraagprijs} onChange={(e) => set("vraagprijs", e.target.value)} style={inputStyle} min="0" />
            </Field>
          </div>
        )}

        {/* STAP 1: Details */}
        {stap === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 24, color: NAVY, margin: "0 0 4px" }}>Details</h2>
            <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Woonoppervlakte (m2)">
                <input type="number" placeholder="bijv. 95" value={form.oppervlakte_m2} onChange={(e) => set("oppervlakte_m2", e.target.value)} style={inputStyle} />
              </Field>
              <Field label="Perceeloppervlakte (m2)">
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
                <input type="number" placeholder="bijv. 2018" value={form.bouwjaar} onChange={(e) => set("bouwjaar", e.target.value)} style={inputStyle} min="1800" max="2030" />
              </Field>
            </div>

            {/* AI beschrijving */}
            <div style={{ background: "#F0F4FA", border: `1px solid #C8D8F0`, borderRadius: 8, padding: "18px 20px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 4 }}>AI-omschrijving genereren</div>
              <div style={{ fontSize: 13, color: "#555", marginBottom: 12 }}>
                Vul hieronder alle relevante informatie in over de woning, locatie en omgeving. De AI verwerkt dit tot een professionele advertentietekst in het Nederlands en Engels, aangevuld met context over de buurt, voorzieningen en toekomstplannen.
              </div>
              <textarea
                rows={5}
                placeholder="Bijv: woning van 120m2, 3 slaapkamers, gerenoveerd in 2022, gelegen op 300 meter van het strand, rustige woonwijk, supermarkt op 5 minuten loopafstand, panoramisch uitzicht op de bergen, grote tuin met olijfbomen, dubbele beglazing..."
                value={form.ai_info_dump}
                onChange={(e) => set("ai_info_dump", e.target.value)}
                style={{ ...inputStyle, resize: "vertical", marginBottom: 10 }}
              />
              <button
                type="button"
                onClick={handleAIGenereren}
                disabled={form.ai_generating || !form.ai_info_dump.trim()}
                style={{ background: NAVY, color: "#fff", border: "none", padding: "10px 20px", borderRadius: 4, fontWeight: 700, fontSize: 14, cursor: "pointer", opacity: form.ai_generating ? 0.7 : 1 }}
              >
                {form.ai_generating ? "Genereren..." : "Genereer omschrijving met AI"}
              </button>
            </div>

            {(form.omschrijving_nl || form.omschrijving_en || form.omschrijving_de || form.omschrijving_cg) && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ background: "#F0F4FA", border: "1px solid #C8D8F0", borderRadius: 6, padding: "12px 14px", fontSize: 12.5, color: "#3D3D3D", lineHeight: 1.6 }}>
                  Deze teksten zijn door AI gegenereerd. Controleer ze op juistheid voordat u plaatst: u blijft als verkoper verantwoordelijk voor de inhoud van de advertentie. De Engelse versie is verplicht omdat het aanbod internationaal wordt getoond.
                </div>
                <Field label="Omschrijving Nederlands (gegenereerd door AI, aanpasbaar)">
                  <textarea rows={5} value={form.omschrijving_nl} onChange={(e) => set("omschrijving_nl", e.target.value)} style={{ ...inputStyle, resize: "vertical" }} />
                </Field>
                <Field label="Omschrijving Engels (verplicht, gegenereerd door AI, aanpasbaar)">
                  <textarea rows={5} value={form.omschrijving_en} onChange={(e) => set("omschrijving_en", e.target.value)} style={{ ...inputStyle, resize: "vertical" }} />
                </Field>
                <Field label="Omschrijving Duits (gegenereerd door AI, aanpasbaar)">
                  <textarea rows={5} value={form.omschrijving_de} onChange={(e) => set("omschrijving_de", e.target.value)} style={{ ...inputStyle, resize: "vertical" }} />
                </Field>
                <Field label="Omschrijving Montenegrijns (gegenereerd door AI, controleer extra zorgvuldig)">
                  <textarea rows={5} value={form.omschrijving_cg} onChange={(e) => set("omschrijving_cg", e.target.value)} style={{ ...inputStyle, resize: "vertical" }} />
                </Field>
              </div>
            )}
          </div>
        )}

        {/* STAP 2: Kenmerken */}
        {stap === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 24, color: NAVY, margin: "0 0 4px" }}>Kenmerken</h2>

            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 8, letterSpacing: 0.5 }}>LIGGING EN UITZICHT</div>
              <div className="grid-toggle-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <Toggle label="Zeezicht" value={form.zeezicht} onChange={(v) => set("zeezicht", v)} />
                <Toggle label="Bergzicht" value={form.bergzicht} onChange={(v) => set("bergzicht", v)} />
                <Toggle label="Rivieruitzicht" value={form.rivierzicht} onChange={(v) => set("rivierzicht", v)} />
              </div>
            </div>

            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 8, letterSpacing: 0.5 }}>BUITENRUIMTE</div>
              <div className="grid-toggle-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <Toggle label="Tuin" value={form.tuin} onChange={(v) => set("tuin", v)} />
                <Toggle label="Terras / balkon" value={form.terras} onChange={(v) => set("terras", v)} />
                <Toggle label="Zwembad" value={form.zwembad} onChange={(v) => set("zwembad", v)} />
                <Toggle label="Garage / parkeerplaats" value={form.garage} onChange={(v) => set("garage", v)} />
              </div>
            </div>

            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 8, letterSpacing: 0.5 }}>BINNENKANT</div>
              <div className="grid-toggle-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <Toggle label="Airconditioning" value={form.airco} onChange={(v) => set("airco", v)} />
                <Toggle label="Centrale verwarming" value={form.verwarming} onChange={(v) => set("verwarming", v)} />
                <Toggle label="Lift aanwezig" value={form.lift} onChange={(v) => set("lift", v)} />
                <Toggle label="Kelder / bergruimte" value={form.kelder} onChange={(v) => set("kelder", v)} />
                <Toggle label="Gemeubileerd" value={form.gemeubileerd} onChange={(v) => set("gemeubileerd", v)} />
              </div>
            </div>

            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 8, letterSpacing: 0.5 }}>NUTSVOORZIENINGEN</div>
              <div className="grid-toggle-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <Toggle label="Wateraansluiting aanwezig" value={form.water} onChange={(v) => set("water", v)} />
                <Toggle label="Elektriciteit aanwezig" value={form.elektriciteit} onChange={(v) => set("elektriciteit", v)} />
                <Toggle label="Riolering aanwezig" value={form.riolering} onChange={(v) => set("riolering", v)} />
                <Toggle label="Geasfalteerde weg ernaar toe" value={form.geasfalteerde_weg} onChange={(v) => set("geasfalteerde_weg", v)} />
              </div>
            </div>

            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 8, letterSpacing: 0.5 }}>JURIDISCH</div>
              <div className="grid-toggle-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <Toggle label="Legale grond" value={form.legale_grond} onChange={(v) => set("legale_grond", v)} sub="Eigendomsrecht volledig in orde" />
                <Toggle label="Alle papieren in orde" value={form.papieren_orde} onChange={(v) => set("papieren_orde", v)} />
                <Toggle label="Bouwvergunning aanwezig" value={form.vergunning_aanwezig} onChange={(v) => set("vergunning_aanwezig", v)} />
              </div>
            </div>

            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 8, letterSpacing: 0.5 }}>STAAT</div>
              <div className="grid-toggle-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <Toggle label="Nieuwbouw" value={form.nieuwbouw} onChange={(v) => set("nieuwbouw", v)} />
                <Toggle label="Renovatie nodig" value={form.renovatie_nodig} onChange={(v) => set("renovatie_nodig", v)} />
                <Toggle label="Bestaande woning" value={form.bestaande_bouw} onChange={(v) => set("bestaande_bouw", v)} sub="Bewoonbaar, geen renovatie nodig" />
              </div>
            </div>
          </div>
        )}

        {/* STAP 3: Belasting */}
        {stap === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 24, color: NAVY, margin: "0 0 4px" }}>Belasting</h2>
            <div style={{ background: "#F0F4FA", border: `1px solid #C8D8F0`, borderRadius: 8, padding: "16px 18px", fontSize: 14, color: "#3D3D3D", lineHeight: 1.7 }}>
              <strong>Waarom belasting vermelden?</strong> Kopers uit Europa willen weten wat de jaarlijkse kosten zijn. Door de lokale onroerendgoedbelasting te vermelden vergroot u de transparantie en het vertrouwen van potentiele kopers.
            </div>
            <Field
              label="Onroerendgoedbelasting per jaar (EUR)"
              hint="Vul het bedrag in dat u jaarlijks betaalt aan lokale belasting op dit vastgoed. Dit is verplicht voor landen als Montenegro (porez na nepokretnosti), Kroatie, Bosnie en Slovenie."
            >
              <input
                type="number"
                placeholder="bijv. 320"
                value={form.belasting_per_jaar}
                onChange={(e) => set("belasting_per_jaar", e.target.value)}
                style={inputStyle}
                min="0"
              />
            </Field>
            <div style={{ background: "#FFF8E7", border: "1px solid #F0C040", borderRadius: 6, padding: "14px 16px", fontSize: 13.5, color: "#7A5C00" }}>
              <strong>Montenegro:</strong> Onroerendgoedbelasting is 0,1% tot 1% van de getaxeerde waarde per jaar, afhankelijk van ligging en type. Kustplaatsen hebben doorgaans hogere tarieven.
              <br /><br />
              <strong>Kroatie:</strong> Geen jaarlijkse onroerendgoedbelasting meer (afgeschaft 2018). Wel communale bijdrage mogelijk.
              <br /><br />
              <strong>Bosnie-Herzegovina:</strong> Varieert per entiteit en gemeente, doorgaans 0,1% tot 0,5% van de waarde.
              <br /><br />
              <strong>Slovenie:</strong> Geen jaarlijkse onroerendgoedbelasting na uitspraak Constitutioneel Hof 2014.
            </div>
          </div>
        )}

        {/* STAP 4: Plattegrond */}
        {stap === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 24, color: NAVY, margin: "0 0 4px" }}>Plattegrond</h2>
            <div style={{ background: "#FFF8E7", border: "1px solid #F0C040", borderRadius: 6, padding: "12px 16px", fontSize: 13.5, color: "#7A5C00", fontWeight: 600 }}>
              Een plattegrond is verplicht. Kopers willen de indeling kennen voordat ze interesse tonen.
            </div>
            <Field
              label="Plattegrond uploaden"
              required
              hint="Upload een foto, scan of PDF van de plattegrond. Voor grond en percelen: upload een kadasterkaart of situatietekening."
            >
              <div style={{ border: `2px dashed ${BORDER}`, borderRadius: 4, padding: "28px 20px", textAlign: "center", background: "#fff" }}>
                <input type="file" accept="image/*,.pdf" multiple id="plattegrond-upload" onChange={handlePlattegrond} style={{ display: "none" }} />
                <label htmlFor="plattegrond-upload" style={{ cursor: "pointer" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📐</div>
                  <div style={{ fontSize: 14, color: NAVY, fontWeight: 600 }}>Klik om plattegrond te uploaden</div>
                  <div style={{ fontSize: 12, color: "#6B6B6B", marginTop: 4 }}>JPG, PNG of PDF</div>
                </label>
              </div>
              {plattegrondPreview.length > 0 && (
                <>
                  <div style={{ fontSize: 12, color: "#2E7D32", marginTop: 10, fontWeight: 600 }}>
                    {form._plattegrondFiles.length} bestand{form._plattegrondFiles.length === 1 ? "" : "en"} geselecteerd. Klik nogmaals om er meer toe te voegen.
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8, marginTop: 8 }}>
                    {plattegrondPreview.map((url, i) => {
                      const bestand = form._plattegrondFiles[i];
                      const isPdf = bestand && bestand.type === "application/pdf";
                      return (
                        <div key={url} style={{ position: "relative" }}>
                          {isPdf ? (
                            <div style={{ width: "100%", height: 110, borderRadius: 3, border: `1px solid ${BORDER}`, background: "#f5f5f5", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, padding: 6, boxSizing: "border-box" }}>
                              <div style={{ fontSize: 22 }}>📄</div>
                              <div style={{ fontSize: 10, color: "#6B6B6B", textAlign: "center", wordBreak: "break-all", lineHeight: 1.3 }}>{bestand.name}</div>
                            </div>
                          ) : (
                            <img src={url} alt="" style={{ width: "100%", height: 110, objectFit: "contain", borderRadius: 3, border: `1px solid ${BORDER}`, background: "#f5f5f5", display: "block" }} />
                          )}
                          <button
                            type="button"
                            onClick={() => verwijderPlattegrond(i)}
                            aria-label={`Bestand ${i + 1} verwijderen`}
                            style={{ position: "absolute", top: 4, right: 4, width: 22, height: 22, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: 14, lineHeight: "22px", cursor: "pointer", padding: 0 }}
                          >
                            &times;
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </Field>
          </div>
        )}

        {/* STAP 5: Foto's en contact */}
        {stap === 5 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 24, color: NAVY, margin: "0 0 4px" }}>Fotos en contactgegevens</h2>

            <Field label="Fotos uploaden" hint="Minimaal 3 fotos aanbevolen. Eerste foto wordt de hoofdfoto.">
              <div style={{ border: `2px dashed ${BORDER}`, borderRadius: 4, padding: "24px 20px", textAlign: "center", background: "#fff" }}>
                <input type="file" accept="image/*" multiple id="foto-upload" onChange={handleFotos} style={{ display: "none" }} />
                <label htmlFor="foto-upload" style={{ cursor: "pointer" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>📷</div>
                  <div style={{ fontSize: 14, color: NAVY, fontWeight: 600 }}>Klik om fotos te selecteren</div>
                  <div style={{ fontSize: 12, color: "#6B6B6B", marginTop: 4 }}>JPG, PNG, maximaal 10MB per foto</div>
                </label>
              </div>
              {fotoPreview.length > 0 && (
                <>
                  <div style={{ fontSize: 12, color: "#2E7D32", marginTop: 10, fontWeight: 600 }}>
                    {fotoPreview.length} foto{fotoPreview.length === 1 ? "" : "s"} geselecteerd. Klik nogmaals om er meer toe te voegen.
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 8, marginTop: 8 }}>
                    {fotoPreview.map((url, i) => (
                      <div key={url} style={{ position: "relative" }}>
                        <img src={url} alt="" style={{ width: "100%", height: 90, objectFit: "cover", borderRadius: 3, border: `1px solid ${BORDER}`, display: "block" }} />
                        {i === 0 && (
                          <div style={{ position: "absolute", left: 4, bottom: 4, background: "rgba(11,42,82,0.85)", color: "#C2A877", fontSize: 9, fontWeight: 700, letterSpacing: 0.5, padding: "2px 6px", borderRadius: 3 }}>
                            HOOFDFOTO
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => verwijderFoto(i)}
                          aria-label={`Foto ${i + 1} verwijderen`}
                          style={{ position: "absolute", top: 4, right: 4, width: 22, height: 22, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: 14, lineHeight: "22px", cursor: "pointer", padding: 0 }}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Field>

            <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 6 }}>Uw contactgegevens</div>
              {gebruiker && (
                <div style={{ fontSize: 12.5, color: "#2E7D32", marginBottom: 12, lineHeight: 1.5 }}>
                  Ingevuld vanuit uw account ({gebruiker.email}). U kunt de gegevens hieronder aanpassen als deze woning door iemand anders wordt verkocht.
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Toggle label="Ik ben een makelaar / zakelijk verkoper" value={form.verkoper_is_makelaar} onChange={(v) => set("verkoper_is_makelaar", v)} />
                {form.verkoper_is_makelaar && (
                  <Field label="Bedrijfsnaam / makelaarskantoor">
                    <input type="text" value={form.makelaar_bedrijf} onChange={(e) => set("makelaar_bedrijf", e.target.value)} style={inputStyle} placeholder="bijv. Obrov Real Estate" />
                  </Field>
                )}
                <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
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

        {/* STAP 6: Bevestiging */}
        {stap === 6 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: 26, color: NAVY, margin: "0 0 8px" }}>Klaar voor plaatsing</h2>
              <div style={{ display: "inline-block", background: "#E8F5E9", color: "#2E7D32", fontSize: 13.5, fontWeight: 700, padding: "6px 16px", borderRadius: 20 }}>
                Gratis t/m 31 oktober 2026
              </div>
            </div>

            <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "20px", marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: "#6B6B6B", fontWeight: 700, marginBottom: 8 }}>SAMENVATTING</div>
              <div style={{ fontSize: 15, color: NAVY, fontWeight: 600 }}>{form.type.charAt(0).toUpperCase() + form.type.slice(1)} in {form.stad}</div>
              {form.vraagprijs && <div style={{ fontSize: 14, color: "#3D3D3D", marginTop: 4 }}>Vraagprijs: EUR {parseInt(form.vraagprijs).toLocaleString("nl-NL")}</div>}
              {form.oppervlakte_m2 && <div style={{ fontSize: 14, color: "#3D3D3D" }}>{form.oppervlakte_m2} m2 woonoppervlakte</div>}
              {form.slaapkamers && <div style={{ fontSize: 14, color: "#3D3D3D" }}>{form.slaapkamers} slaapkamers</div>}
              {form.belasting_per_jaar && <div style={{ fontSize: 14, color: "#3D3D3D" }}>Belasting: EUR {parseFloat(form.belasting_per_jaar).toLocaleString("nl-NL")} per jaar</div>}
              <div style={{ borderTop: `1px solid ${BORDER}`, marginTop: 14, paddingTop: 14, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>Plaatsingskosten</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: "#2E7D32" }}>GRATIS</span>
              </div>
              <div style={{ fontSize: 12, color: "#6B6B6B", marginTop: 4 }}>Gratis t/m 31 oktober 2026. Daarna EUR 195 eenmalig.</div>
            </div>

            <div style={{ background: "#fff", border: `1.5px solid ${akkoordAV ? GOLD : BORDER}`, borderRadius: 6, padding: "16px 18px", marginBottom: 8 }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
                <input type="checkbox" checked={akkoordAV} onChange={(e) => setAkkoordAV(e.target.checked)} style={{ width: 18, height: 18, marginTop: 2, flexShrink: 0, cursor: "pointer" }} />
                <span style={{ fontSize: 14, color: "#1A1A1A", lineHeight: 1.6 }}>
                  Ik ga akkoord met de{" "}
                  <button type="button" onClick={() => setShowAV(true)} style={{ background: "none", border: "none", color: GOLD, fontWeight: 700, cursor: "pointer", fontSize: 14, padding: 0, textDecoration: "underline" }}>
                    algemene voorwaarden
                  </button>
                  {" "}van Obrov Real Estate. Na 31 oktober 2026 bedragen de plaatsingskosten EUR 195 eenmalig voor particulieren, EUR 250 per maand voor Makelaar Starter en EUR 450 per maand voor Makelaar Pro.
                </span>
              </label>
            </div>
          </div>
        )}

        {/* AV MODAL */}
        {showAV && (
          <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <div style={{ background: "#fff", borderRadius: 8, maxWidth: 640, width: "100%", maxHeight: "80vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "20px 24px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontFamily: "Georgia, serif", fontSize: 20, color: NAVY, margin: 0 }}>Algemene voorwaarden</h3>
                <button onClick={() => setShowAV(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#666" }}>x</button>
              </div>
              <div style={{ padding: "20px 24px", overflowY: "auto", fontSize: 13.5, lineHeight: 1.7, color: "#3D3D3D" }}>
                <p style={{ marginBottom: 12 }}><strong>Obrov Real Estate, Algemene Voorwaarden Vastgoedplatform</strong><br /><span style={{ color: "#888", fontSize: 12 }}>Versie 1.2 | Juli 2026 | Masters in Pharmacy B.V.</span></p>
                <p style={{ marginBottom: 8 }}><strong>Artikel 1. Definities</strong></p>
                <p style={{ marginBottom: 12 }}>Platform: obrovrealestate.nl en aanverwante domeinen. Obrov: Masters in Pharmacy B.V., handelend onder de naam Obrov Real Estate. Adverteerder: de gebruiker die een vastgoedobject aanbiedt. Koper: de gebruiker die vastgoed zoekt. Advertentie: de gepubliceerde beschrijving van een vastgoedobject inclusief fotos, plattegronden en locatiegegevens.</p>
                <p style={{ marginBottom: 8 }}><strong>Artikel 2. Aard en rol van het platform</strong></p>
                <p style={{ marginBottom: 12 }}>Obrov treedt uitsluitend op als technisch facilitator en is geen partij bij enige koopovereenkomst of transactie. Obrov is geen makelaar of vertegenwoordiger, tenzij schriftelijk overeengekomen. Obrov heeft geen kennis van de feitelijke staat, juridische status of eigendomssituatie van aangeboden objecten en verricht geen due diligence op advertenties.</p>
                <p style={{ marginBottom: 8 }}><strong>Artikel 3. Aansprakelijkheid voor advertentie-inhoud</strong></p>
                <p style={{ marginBottom: 12 }}>De adverteerder is als enige verantwoordelijk voor de volledigheid, juistheid en actualiteit van alle informatie in de advertentie, inclusief vraagprijs, oppervlaktematen, ligging, eigendomsstatus, bouwkundige staat, belastinggegevens en fotomateriaal. Obrov Real Estate aanvaardt geen enkele aansprakelijkheid voor schade die direct of indirect voortvloeit uit onjuiste, onvolledige, misleidende of verouderde informatie in een advertentie. Obrov is niet gehouden advertenties te controleren op juistheid of rechtmatigheid. De adverteerder vrijwaart Obrov van alle aanspraken van derden die verband houden met onjuiste advertentie-inhoud.</p>
                <p style={{ marginBottom: 8 }}><strong>Artikel 4. Beperking van aansprakelijkheid</strong></p>
                <p style={{ marginBottom: 12 }}>Obrov Real Estate is niet aansprakelijk voor enige directe, indirecte, incidentele of gevolgschade voortvloeiend uit gebruik van het platform, transacties via het platform, advertentie-inhoud, AI-gegenereerde teksten, kaart- of locatiegegevens, of technische storingen. Aansprakelijkheid is te allen tijde beperkt tot het bedrag dat de gebruiker in de voorafgaande twaalf maanden aan Obrov heeft betaald, met een absoluut maximum van EUR 500.</p>
                <p style={{ marginBottom: 8 }}><strong>Artikel 5. Garanties door de adverteerder</strong></p>
                <p style={{ marginBottom: 12 }}>Door het plaatsen van een advertentie garandeert de adverteerder dat hij gerechtigd is het object aan te bieden; alle informatie naar zijn beste weten juist en actueel is; GPS-coordinaten de exacte ligging weergeven; opgegeven maten zijn gebaseerd op feitelijke metingen of kadastermateriaal; genoemde juridische stukken daadwerkelijk bestaan en geldig zijn; de advertentie geen inbreuk maakt op rechten van derden. Schending geeft Obrov het recht de advertentie onmiddellijk te verwijderen zonder restitutie.</p>
                <p style={{ marginBottom: 8 }}><strong>Artikel 6. AI-gegenereerde inhoud</strong></p>
                <p style={{ marginBottom: 12 }}>AI-gegenereerde teksten kunnen onjuistheden bevatten. De adverteerder is verantwoordelijk voor het controleren en goedkeuren van AI-teksten voor publicatie. Publicatie geldt als volledige goedkeuring. Obrov aanvaardt geen aansprakelijkheid voor schade uit AI-gegenereerde teksten.</p>
                <p style={{ marginBottom: 8 }}><strong>Artikel 7. Locatiegegevens en kaartfunctionaliteit</strong></p>
                <p style={{ marginBottom: 12 }}>Obrov gebruikt OpenStreetMap-kaartdata en staat niet in voor de nauwkeurigheid daarvan. Ingevoerde GPS-coordinaten worden ongewijzigd gepubliceerd zonder verificatie. Kopers worden nadrukkelijk geadviseerd locaties ter plaatse te verificeren.</p>
                <p style={{ marginBottom: 8 }}><strong>Artikel 8. Verplichtingen van de gebruiker</strong></p>
                <p style={{ marginBottom: 12 }}>Het is verboden valse advertenties te plaatsen, vastgoed aan te bieden zonder beschikkingsrecht, het platform te gebruiken voor strafbare handelingen, gegevens te scrapen, of persoonsgegevens van andere gebruikers te misbruiken. Obrov kan overtreders zonder waarschuwing blokkeren en aangifte doen.</p>
                <p style={{ marginBottom: 8 }}><strong>Artikel 9. Intellectueel eigendom</strong></p>
                <p style={{ marginBottom: 12 }}>Alle rechten op het platform berusten bij Obrov. De adverteerder verleent Obrov een wereldwijde, kosteloze licentie om aangeleverde content te publiceren. De adverteerder garandeert dat hij daartoe gerechtigd is en vrijwaart Obrov van aanspraken van derden.</p>
                <p style={{ marginBottom: 8 }}><strong>Artikel 10. Privacy en gegevensbescherming</strong></p>
                <p style={{ marginBottom: 12 }}>Obrov verwerkt persoonsgegevens conform de AVG. Contactgegevens van adverteerders worden zichtbaar gepubliceerd; door registratie geeft de adverteerder hiervoor toestemming. Gegevens worden niet verkocht aan derden. Verzoeken tot inzage of verwijdering via info@obrovrealestate.nl.</p>
                <p style={{ marginBottom: 8 }}><strong>Artikel 11. Tarieven, betaling en opzegging</strong></p>
                <p style={{ marginBottom: 12 }}>Tot en met 31 oktober 2026 is plaatsen gratis. Daarna: particulier EUR 195 eenmalig; Makelaar Starter EUR 250 per maand (max. 5 advertenties); Makelaar Pro EUR 450 per maand (onbeperkt). Maandelijkse bedragen via SEPA-incasso op de eerste van de maand. Geen restitutie bij tussentijdse verkoop of verwijdering. Opzegging per e-mail voor de eerste van de volgende maand.</p>
                <p style={{ marginBottom: 8 }}><strong>Artikel 12. Begeleidingsdiensten</strong></p>
                <p style={{ marginBottom: 12 }}>Pakket Basis EUR 2.500; Pakket Volledig EUR 4.500; of 1,5% van aankoopprijs (minimum EUR 2.500). Fiscale coordinatie EUR 750 extra. Obrov is niet aansprakelijk voor de uitkomst van transacties of adviezen van ingeschakelde derden.</p>
                <p style={{ marginBottom: 8 }}><strong>Artikel 13. Toepasselijk recht en geschillen</strong></p>
                <p style={{ marginBottom: 12 }}>Nederlands recht is van toepassing. Geschillen worden voorgelegd aan de bevoegde rechter in Rotterdam. EU-consumenten kunnen gebruik maken van het ODR-platform van de Europese Commissie.</p>
                <p style={{ marginBottom: 8 }}><strong>Artikel 14. Wijziging voorwaarden</strong></p>
                <p style={{ marginBottom: 12 }}>Wijzigingen worden 30 dagen van tevoren aangekondigd. Voortgezet gebruik na inwerkingtreding geldt als aanvaarding.</p>
                <p style={{ marginBottom: 8 }}><strong>Artikel 15. Overige bepalingen</strong></p>
                <p style={{ marginBottom: 16 }}>Nietigheid van een bepaling tast de overige bepalingen niet aan. Obrov kan rechten en plichten overdragen bij fusie of overname. Communicatie geschiedt per e-mail aan het geregistreerde adres.</p>
                <p style={{ fontSize: 12, color: "#888" }}>Versie 1.2, Juli 2026 | Masters in Pharmacy B.V. | info@obrovrealestate.nl</p>
              </div>
              <div style={{ padding: "16px 24px", borderTop: `1px solid ${BORDER}`, display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button onClick={() => setShowAV(false)} style={{ background: "none", border: `1.5px solid ${BORDER}`, color: NAVY, padding: "10px 20px", borderRadius: 3, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>Sluiten</button>
                <button onClick={() => { setAkkoordAV(true); setShowAV(false); }} style={{ background: NAVY, color: "#fff", border: "none", padding: "10px 20px", borderRadius: 3, cursor: "pointer", fontWeight: 700, fontSize: 14 }}>Akkoord</button>
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

        {/* NAVIGATIE */}
        <div style={{ display: "flex", gap: 12, marginTop: 32, justifyContent: stap > 0 ? "space-between" : "flex-end" }}>
          {stap > 0 && (
            <button onClick={() => { setStap((s) => s - 1); setError(""); window.scrollTo(0,0); }} style={{ background: "none", border: `1.5px solid ${NAVY}`, color: NAVY, padding: "13px 24px", borderRadius: 3, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
              Vorige
            </button>
          )}
          {stap < 6 ? (
            <button onClick={volgende} style={{ background: NAVY, color: "#fff", border: "none", padding: "13px 28px", borderRadius: 3, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              Volgende
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={uploading || !akkoordAV} style={{ background: akkoordAV ? "#2E7D32" : "#aaa", color: "#fff", border: "none", padding: "15px 32px", borderRadius: 3, fontWeight: 700, fontSize: 15, cursor: (uploading || !akkoordAV) ? "default" : "pointer" }}>
              {uploading ? "Bezig met plaatsen..." : "Gratis plaatsen"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
