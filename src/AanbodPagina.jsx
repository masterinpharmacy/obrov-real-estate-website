import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase, supabaseConfigured } from "./supabase.js";
import { DEMO_WONINGEN, STAD_COORDS, afstandKm } from "./demoData.js";

const NAVY = "#0B2A52";
const GOLD = "#AC9362";
const BORDER = "#DCD4C2";

// ---- Favorieten ----
function useFavorieten() {
  const [favs, setFavs] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("obrov_favs") || "[]")); }
    catch { return new Set(); }
  });
  const toggle = useCallback((id) => {
    setFavs((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem("obrov_favs", JSON.stringify([...next]));
      return next;
    });
  }, []);
  return [favs, toggle];
}

function formatPrijs(p) {
  return "€ " + p.toLocaleString("nl-NL") + " k.k.";
}

// ---- Hart knop ----
function HartKnop({ id, favs, toggle }) {
  const isFav = favs.has(id);
  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(id); }}
      style={{
        position: "absolute", top: 10, right: 10,
        width: 34, height: 34, borderRadius: "50%",
        background: "rgba(255,255,255,0.95)",
        border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        zIndex: 2,
      }}
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill={isFav ? "#e53935" : "none"} stroke={isFav ? "#e53935" : "#555"} strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </button>
  );
}

// ---- Woningkaart ----
function WoningKaart({ w, favs, toggle }) {
  return (
    <Link to={`/aanbod/${w.id}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
      <div
        style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden", transition: "box-shadow 0.2s, transform 0.15s" }}
        onMouseOver={(e) => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(11,42,82,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseOut={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
      >
        <div style={{ height: 195, background: "#E8E4DA", position: "relative" }}>
          {w.hoofdfoto
            ? <img src={w.hoofdfoto} alt={w.stad} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
            : <div style={{ width: "100%", height: "100%", background: "#D5CFC4" }} />
          }
          <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(11,42,82,0.85)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 12 }}>
            {w.type?.charAt(0).toUpperCase() + w.type?.slice(1)}
          </div>
          <HartKnop id={w.id} favs={favs} toggle={toggle} />
        </div>
        <div style={{ padding: "13px 15px 16px" }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 700, color: NAVY, marginBottom: 3 }}>
            {formatPrijs(w.vraagprijs)}
          </div>
          <div style={{ fontSize: 13, color: "#555", marginBottom: 8 }}>
            {w.stad}{w.regio && w.regio !== w.stad ? `, ${w.regio}` : ""}
          </div>
          <div style={{ display: "flex", gap: 12, fontSize: 12.5, color: "#666", paddingTop: 8, borderTop: `1px solid ${BORDER}`, flexWrap: "wrap" }}>
            {w.oppervlakte_m2 && <span>{w.oppervlakte_m2} m²</span>}
            {w.perceel_m2 && <span>{w.perceel_m2} m² perceel</span>}
            {w.slaapkamers && <span>{w.slaapkamers} slaapk.</span>}
            {w.badkamers && <span>{w.badkamers} badk.</span>}
            {w.zeezicht && <span style={{ color: GOLD, fontWeight: 600 }}>Zeezicht</span>}
          </div>
          <div style={{ marginTop: 8, fontSize: 11.5, color: "#999" }}>
            {w.verkoper_is_makelaar ? w.makelaar_bedrijf || w.verkoper_naam : `Particulier: ${w.verkoper_naam}`}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ---- Kaartweergave ----
function KaartWeergave({ woningen, favs, toggle }) {
  const [geselecteerd, setGeselecteerd] = useState(null);
  const [isMobiel, setIsMobiel] = useState(window.innerWidth < 768);
  const metCoord = woningen.filter((w) => w.lat && w.lng);

  useEffect(() => {
    const handler = () => setIsMobiel(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const mapHtml = `<!DOCTYPE html><html><head>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
body{margin:0}#map{height:100vh}
.leaflet-popup-content{margin:0;padding:0;width:220px!important;}
.leaflet-popup-content-wrapper{padding:0;border-radius:8px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.2);}
.leaflet-popup-tip-container{margin-top:-1px}
.popup-foto{width:220px;height:130px;object-fit:cover;display:block;background:#e8e4da;}
.popup-foto-placeholder{width:220px;height:130px;background:linear-gradient(135deg,#0B2A52,#163A6B);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.4);font-size:28px;}
.popup-body{padding:10px 12px 12px;}
.popup-prijs{font-family:Georgia,serif;font-size:16px;font-weight:700;color:#0B2A52;margin-bottom:3px;}
.popup-locatie{font-size:12px;color:#555;margin-bottom:6px;}
.popup-meta{font-size:11.5px;color:#888;margin-bottom:8px;}
.popup-link{display:block;background:#0B2A52;color:#fff;text-align:center;padding:7px;border-radius:4px;font-size:12.5px;font-weight:700;text-decoration:none;}
.popup-link:hover{background:#163A6B;}
</style></head><body>
<div id="map"></div><script>
var map = L.map('map').setView([${metCoord.length ? metCoord[0].lat : 42.43}, ${metCoord.length ? metCoord[0].lng : 19.26}], ${metCoord.length > 1 ? 7 : 12});
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap'}).addTo(map);
${metCoord.map((w) => {
  const prijs = `€ ${w.vraagprijs?.toLocaleString("nl-NL")} k.k.`;
  const type = w.type ? w.type.charAt(0).toUpperCase() + w.type.slice(1) : "";
  const meta = [type, w.oppervlakte_m2 ? `${w.oppervlakte_m2} m²` : "", w.slaapkamers ? `${w.slaapkamers} slpk` : ""].filter(Boolean).join(" · ");
  const foto = w.hoofdfoto ? `<img class='popup-foto' src='${w.hoofdfoto}' alt='' onerror="this.style.display='none';this.nextSibling.style.display='flex'"/><div class='popup-foto-placeholder' style='display:none'>~</div>` : `<div class='popup-foto-placeholder'>~</div>`;
  const popupHtml = `<div>${foto}<div class='popup-body'><div class='popup-prijs'>${prijs}</div><div class='popup-locatie'>${w.stad}${w.regio && w.regio !== w.stad ? ", " + w.regio : ""}</div><div class='popup-meta'>${meta}</div><a class='popup-link' href='/aanbod/${w.id}' target='_top'>Bekijk woning &rarr;</a></div></div>`;
  const pinSvg = '<div style="width:22px;height:30px;cursor:pointer"><svg viewBox=\"0 0 22 30\" xmlns=\"http://www.w3.org/2000/svg\" style=\"width:22px;height:30px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3))\"><path d=\"M11 0C4.925 0 0 4.925 0 11c0 7.7 11 19 11 19s11-11.3 11-19C22 4.925 17.075 0 11 0z\" fill=\"#0B2A52\"/><circle cx=\"11\" cy=\"11\" r=\"4.5\" fill=\"#AC9362\"/></svg></div>';
  return `L.marker([${w.lat},${w.lng}],{icon:L.divIcon({className:'',html:'${pinSvg}',iconAnchor:[11,30]})}).addTo(map).bindPopup(\`${popupHtml.replace(/`/g, "'")}\`,{maxWidth:220,minWidth:220});`;
}).join("\n")}
if(${metCoord.length}>1){var b=L.latLngBounds([${metCoord.map((w)=>`[${w.lat},${w.lng}]`).join(",")}]);map.fitBounds(b,{padding:[40,40]});}
</script></body></html>`;

  if (isMobiel) {
    // Mobiel: kaart bovenaan full-width, lijst eronder
    return (
      <div style={{ margin: "0 -12px" }} className="kaart-wrapper-mobiel">
        {/* Kaart, full width, geen border, geen border-radius */}
        <div style={{ height: "50vh", minHeight: 300 }}>
          <iframe srcDoc={mapHtml} style={{ width: "100%", height: "100%", border: "none", display: "block" }} title="Kaart" />
        </div>
        {/* Lijst eronder */}
        <div style={{ background: "#FAF8F4", borderTop: `1px solid ${BORDER}` }}>
          <div style={{ padding: "10px 14px", fontSize: 12.5, color: "#888", borderBottom: `1px solid ${BORDER}`, background: "#fff" }}>
            {woningen.length} woningen gevonden
          </div>
          {woningen.map((w) => (
            <Link key={w.id} to={`/aanbod/${w.id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{ display: "flex", gap: 12, padding: "12px 14px", borderBottom: `1px solid ${BORDER}`, background: "#fff", cursor: "pointer" }}>
                <div style={{ width: 72, height: 60, background: "#E8E4DA", borderRadius: 4, flexShrink: 0, overflow: "hidden" }}>
                  {w.hoofdfoto && <img src={w.hoofdfoto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: NAVY }}>€ {w.vraagprijs?.toLocaleString("nl-NL")} k.k.</div>
                  <div style={{ fontSize: 12.5, color: "#444", marginTop: 2 }}>{w.stad}{w.regio && w.regio !== w.stad ? `, ${w.regio}` : ""}</div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                    {w.type?.charAt(0).toUpperCase() + w.type?.slice(1)}
                    {w.oppervlakte_m2 ? ` · ${w.oppervlakte_m2} m²` : ""}
                    {w.slaapkamers ? ` · ${w.slaapkamers} slpk` : ""}
                  </div>
                </div>
                <div style={{ color: "#ccc", fontSize: 20, alignSelf: "center", flexShrink: 0 }}>›</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Desktop: kaart links, lijst rechts
  return (
    <div style={{ display: "flex", height: "calc(100vh - 130px)", gap: 0, borderRadius: 8, overflow: "hidden", border: `1px solid ${BORDER}` }}>
      <div style={{ flex: 1 }}>
        <iframe srcDoc={mapHtml} style={{ width: "100%", height: "100%", border: "none" }} title="Kaart" />
      </div>
      <div style={{ width: 300, overflowY: "auto", background: "#FAF8F4", borderLeft: `1px solid ${BORDER}`, flexShrink: 0 }}>
        {woningen.map((w) => (
          <Link key={w.id} to={`/aanbod/${w.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ display: "flex", gap: 10, padding: "11px 12px", borderBottom: `1px solid ${BORDER}`, background: geselecteerd === w.id ? "#EDE6D7" : "#fff", cursor: "pointer" }}
              onMouseOver={(e) => { setGeselecteerd(w.id); e.currentTarget.style.background = "#EDE6D7"; }}
              onMouseOut={(e) => { setGeselecteerd(null); e.currentTarget.style.background = "#fff"; }}>
              <div style={{ width: 64, height: 52, background: "#E8E4DA", borderRadius: 3, flexShrink: 0, overflow: "hidden" }}>
                {w.hoofdfoto && <img src={w.hoofdfoto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: NAVY }}>€ {w.vraagprijs?.toLocaleString("nl-NL")} k.k.</div>
                <div style={{ fontSize: 11.5, color: "#555", marginTop: 2 }}>{w.stad}</div>
                <div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>{w.type} {w.oppervlakte_m2 ? `· ${w.oppervlakte_m2} m²` : ""}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ---- Favorietenpaneel ----
function FavorietenPanel({ woningen, favs, toggle, onClose }) {
  const favWoningen = woningen.filter((w) => favs.has(w.id));
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "flex-end" }} onClick={onClose}>
      <div style={{ width: "min(400px, 100vw)", background: "#FAF8F4", height: "100%", overflowY: "auto", boxShadow: "-4px 0 20px rgba(0,0,0,0.15)" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: "18px 20px 12px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 19, fontWeight: 700, color: NAVY }}>Favorieten ({favWoningen.length})</div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#888" }}>×</button>
        </div>
        <div style={{ padding: 16 }}>
          {favWoningen.length === 0
            ? <div style={{ textAlign: "center", padding: "40px 20px", color: "#888", fontSize: 14 }}>Klik op het hartje bij een woning om hem hier te bewaren.</div>
            : favWoningen.map((w) => (
              <div key={w.id} style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden", marginBottom: 12 }}>
                <div style={{ height: 130, background: "#E8E4DA", position: "relative" }}>
                  {w.hoofdfoto && <img src={w.hoofdfoto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                  <button onClick={() => toggle(w.id)} style={{ position: "absolute", top: 8, right: 8, background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="#e53935" stroke="#e53935" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  </button>
                </div>
                <div style={{ padding: "11px 13px" }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: NAVY }}>{formatPrijs(w.vraagprijs)}</div>
                  <div style={{ fontSize: 12.5, color: "#555", marginTop: 3 }}>{w.stad}</div>
                  <Link to={`/aanbod/${w.id}`} style={{ display: "inline-block", marginTop: 8, fontSize: 12.5, color: NAVY, fontWeight: 600, textDecoration: "none" }}>Bekijk woning →</Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

// ---- Filterpaneel links ----
function FilterPaneel({ filters, setF, woningen, gefilterd, onReset }) {
  const Section = ({ title, children }) => (
    <div style={{ borderBottom: `1px solid ${BORDER}`, padding: "16px 0" }}>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: NAVY, letterSpacing: 0.5, marginBottom: 12 }}>{title}</div>
      {children}
    </div>
  );

  const CheckItem = ({ label, filterKey }) => (
    <label style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8, cursor: "pointer", fontSize: 13.5, color: "#333" }}>
      <input
        type="checkbox"
        checked={filters[filterKey] || false}
        onChange={(e) => setF(filterKey, e.target.checked)}
        style={{ width: 16, height: 16, cursor: "pointer", accentColor: NAVY }}
      />
      {label}
    </label>
  );

  const selectStyle = { width: "100%", padding: "9px 10px", border: `1px solid ${BORDER}`, borderRadius: 4, fontSize: 13.5, background: "#fff", color: "#1A1A1A", fontFamily: "inherit" };

  return (
    <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "16px 18px", position: "sticky", top: 130 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 700, color: NAVY }}>Filters</div>
        <button onClick={onReset} style={{ background: "none", border: "none", fontSize: 12.5, color: GOLD, cursor: "pointer", fontWeight: 600 }}>Wissen</button>
      </div>
      <div style={{ fontSize: 12, color: "#888", marginBottom: 12 }}>{gefilterd.length} van {woningen.length} woningen</div>

      <Section title="WONINGTYPE">
        {["alle", "appartement", "villa", "huis", "grond", "project", "commercieel"].map((t) => (
          <label key={t} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 7, cursor: "pointer", fontSize: 13.5, color: "#333" }}>
            <input
              type="radio"
              name="type"
              checked={filters.type === t}
              onChange={() => setF("type", t)}
              style={{ accentColor: NAVY, cursor: "pointer" }}
            />
            {t === "alle" ? "Alle types" : t.charAt(0).toUpperCase() + t.slice(1)}
          </label>
        ))}
      </Section>

      <Section title="MAX. VRAAGPRIJS">
        <select value={filters.maxPrijs} onChange={(e) => setF("maxPrijs", e.target.value)} style={selectStyle}>
          <option value="">Geen maximum</option>
          {[75000,100000,150000,200000,300000,500000,750000,1000000].map((p) => (
            <option key={p} value={p}>Tot € {p.toLocaleString("nl-NL")}</option>
          ))}
        </select>
      </Section>

      <Section title="MIN. OPPERVLAKTE">
        <select value={filters.minOppervlakte} onChange={(e) => setF("minOppervlakte", e.target.value)} style={selectStyle}>
          <option value="">Geen minimum</option>
          {[40,60,80,100,150,200,300].map((m) => (
            <option key={m} value={m}>Vanaf {m} m²</option>
          ))}
        </select>
      </Section>

      <Section title="SLAAPKAMERS">
        <select value={filters.slaapkamers} onChange={(e) => setF("slaapkamers", e.target.value)} style={selectStyle}>
          <option value="alle">Alle</option>
          {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}+ slaapkamers</option>)}
        </select>
      </Section>

      <Section title="KENMERKEN">
        <CheckItem label="Zeezicht" filterKey="zeezicht" />
        <CheckItem label="Bergzicht" filterKey="bergzicht" />
        <CheckItem label="Zwembad" filterKey="zwembad" />
        <CheckItem label="Tuin" filterKey="tuin" />
        <CheckItem label="Terras / balkon" filterKey="terras" />
        <CheckItem label="Garage / parkeerplaats" filterKey="garage" />
        <CheckItem label="Airconditioning" filterKey="airco" />
        <CheckItem label="Verwarming" filterKey="verwarming" />
        <CheckItem label="Lift" filterKey="lift" />
        <CheckItem label="Gemeubileerd" filterKey="gemeubileerd" />
        <CheckItem label="Nieuwbouw" filterKey="nieuwbouw" />
      </Section>

      <Section title="STAAT VAN EIGENDOM">
        <CheckItem label="Legale grond" filterKey="legale_grond" />
        <CheckItem label="Papieren in orde" filterKey="papieren_orde" />
        <CheckItem label="Geasfalteerde weg" filterKey="geasfalteerde_weg" />
        <CheckItem label="Water aanwezig" filterKey="water" />
        <CheckItem label="Elektriciteit aanwezig" filterKey="elektriciteit" />
      </Section>
    </div>
  );
}

const FILTERS_DEFAULT = {
  type: "alle", maxPrijs: "", minOppervlakte: "", slaapkamers: "alle",
  zeezicht: false, bergzicht: false, zwembad: false, tuin: false,
  terras: false, garage: false, airco: false, verwarming: false,
  lift: false, gemeubileerd: false, nieuwbouw: false,
  legale_grond: false, papieren_orde: false, geasfalteerde_weg: false,
  water: false, elektriciteit: false, riolering: false,
};

// ---- Hoofdcomponent ----
export default function AanbodPagina() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [woningen, setWoningen] = useState([]);
  const [loading, setLoading] = useState(false);
  const [weergave, setWeergave] = useState("lijst");
  const [filters, setFilters] = useState(FILTERS_DEFAULT);
  const [zoekStad, setZoekStad] = useState(params.get("stad") || "");
  const [zoekKm, setZoekKm] = useState(params.get("km") || "");
  const [showFavs, setShowFavs] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [favs, toggleFav] = useFavorieten();

  useEffect(() => {
    setWoningen(DEMO_WONINGEN);
    if (!supabaseConfigured || !supabase) return;
    const t = setTimeout(async () => {
      try {
        const { data } = await supabase.from("woningen").select("*").eq("status", "actief").order("created_at", { ascending: false });
        if (data?.length) setWoningen(data);
      } catch {}
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const setF = (key, val) => setFilters((f) => ({ ...f, [key]: val }));

  const zoekCoords = zoekStad ? STAD_COORDS[zoekStad.toLowerCase().trim()] || null : null;

  const gefilterd = woningen.filter((w) => {
    if (filters.type !== "alle" && w.type !== filters.type) return false;
    if (filters.maxPrijs && w.vraagprijs > parseInt(filters.maxPrijs)) return false;
    if (filters.minOppervlakte && w.oppervlakte_m2 < parseInt(filters.minOppervlakte)) return false;
    if (filters.slaapkamers !== "alle" && w.slaapkamers < parseInt(filters.slaapkamers)) return false;
    if (filters.zeezicht && !w.zeezicht) return false;
    if (filters.bergzicht && !w.bergzicht) return false;
    if (filters.zwembad && !w.zwembad) return false;
    if (filters.tuin && !w.tuin) return false;
    if (filters.terras && !w.terras) return false;
    if (filters.garage && !w.garage) return false;
    if (filters.airco && !w.airco) return false;
    if (filters.verwarming && !w.verwarming) return false;
    if (filters.lift && !w.lift) return false;
    if (filters.gemeubileerd && !w.gemeubileerd) return false;
    if (filters.nieuwbouw && !w.nieuwbouw) return false;
    if (filters.legale_grond && !w.legale_grond) return false;
    if (filters.papieren_orde && !w.papieren_orde) return false;
    if (filters.geasfalteerde_weg && !w.geasfalteerde_weg) return false;
    if (filters.water && !w.water) return false;
    if (filters.elektriciteit && !w.elektriciteit) return false;
    if (zoekStad && !zoekCoords) {
      if (!`${w.stad} ${w.regio} ${w.adres}`.toLowerCase().includes(zoekStad.toLowerCase())) return false;
    }
    if (zoekCoords && zoekKm && w.lat && w.lng) {
      if (afstandKm(zoekCoords.lat, zoekCoords.lng, w.lat, w.lng) > parseInt(zoekKm)) return false;
    }
    return true;
  });

  return (
    <div style={{ fontFamily: "Helvetica, Arial, sans-serif", background: "#FAF8F4", minHeight: "100vh" }}>
      <style>{`
        html,body{overflow-x:hidden;max-width:100%;width:100%}
        *{box-sizing:border-box}
        @media(max-width:768px){
          .zij-layout{flex-direction:column!important;padding:12px 12px 40px!important}
          .filter-paneel-desktop{display:none!important}
          .filter-toggle-btn{display:flex!important}
          .woningen-grid{grid-template-columns:1fr!important}
          .kaart-mobiel-fullwidth{display:block!important;width:100vw;margin-left:calc(-50vw + 50%)}
          .kaart-desktop-layout{display:none!important}
        }
        @media(min-width:769px){
          .filter-toggle-btn{display:none!important}
          .filter-mobiel{display:none!important}
          .kaart-mobiel-fullwidth{display:none!important}
        }
      `}</style>

      {/* NAVBAR */}
      <header style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
          <Link to="/"><img src="/logo.png" alt="Obrov Real Estate" style={{ height: 46, width: "auto" }} /></Link>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Link to="/" style={{ fontSize: 14, color: NAVY, textDecoration: "none", fontWeight: 500 }}>Home</Link>
            <button onClick={() => setShowFavs(true)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: `1.5px solid ${BORDER}`, borderRadius: 20, padding: "7px 14px", cursor: "pointer", fontSize: 13.5, color: NAVY }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill={favs.size > 0 ? "#e53935" : "none"} stroke={favs.size > 0 ? "#e53935" : NAVY} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              Favorieten {favs.size > 0 && <span style={{ background: "#e53935", color: "#fff", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{favs.size}</span>}
            </button>
            <Link to="/favorieten" style={{ fontSize: 13, color: NAVY, textDecoration: "none", fontWeight: 500 }}>Mijn account</Link>
            <Link to="/woning-plaatsen" style={{ background: GOLD, color: "#fff", padding: "8px 16px", borderRadius: 20, fontSize: 13.5, fontWeight: 700, textDecoration: "none" }}>
              + Woning plaatsen
            </Link>
          </div>
        </div>
      </header>

      {/* ZOEKBALK */}
      <div style={{ background: NAVY, padding: "16px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          {/* Stad */}
          <div style={{ display: "flex", alignItems: "center", background: "#fff", borderRadius: 6, flex: "1 1 300px", overflow: "hidden", minWidth: 200 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" style={{ flexShrink: 0, margin: "0 10px 0 14px" }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Zoek op stad of regio..."
              value={zoekStad}
              onChange={(e) => setZoekStad(e.target.value)}
              list="stad-suggestions"
              style={{ flex: 1, border: "none", outline: "none", fontSize: 14.5, padding: "12px 10px 12px 0", fontFamily: "inherit", background: "transparent" }}
            />
            <datalist id="stad-suggestions">
              {Object.keys(STAD_COORDS).map((s) => <option key={s} value={s.charAt(0).toUpperCase() + s.slice(1)} />)}
            </datalist>
            {zoekStad && <button onClick={() => { setZoekStad(""); setZoekKm(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#999", fontSize: 18, padding: "0 10px" }}>×</button>}
          </div>
          {/* Straal */}
          <select
            value={zoekKm}
            onChange={(e) => setZoekKm(e.target.value)}
            disabled={!zoekCoords}
            style={{ background: "#fff", border: "none", borderRadius: 6, padding: "12px 14px", fontSize: 14, fontFamily: "inherit", color: zoekCoords ? "#1A1A1A" : "#aaa", cursor: zoekCoords ? "pointer" : "default", minWidth: 140 }}
          >
            <option value="">Straal (km)</option>
            {[5,10,20,30,50,100].map((k) => <option key={k} value={k}>+ {k} km</option>)}
          </select>
          {/* Lijst / Kaart */}
          <div style={{ display: "flex", background: "#fff", borderRadius: 6, overflow: "hidden", marginLeft: "auto" }}>
            <button onClick={() => setWeergave("lijst")} style={{ padding: "11px 18px", border: "none", background: weergave === "lijst" ? "#EDE6D7" : "transparent", fontSize: 13.5, fontWeight: weergave === "lijst" ? 700 : 400, color: NAVY, cursor: "pointer" }}>Lijst</button>
            <button onClick={() => setWeergave("kaart")} style={{ padding: "11px 18px", border: "none", borderLeft: `1px solid ${BORDER}`, background: weergave === "kaart" ? "#EDE6D7" : "transparent", fontSize: 13.5, fontWeight: weergave === "kaart" ? 700 : 400, color: NAVY, cursor: "pointer" }}>Kaart</button>
          </div>
        </div>
      </div>

      {/* KAARTWEERGAVE MOBIEL, volledig buiten de zij-layout, full-width */}
      {weergave === "kaart" && (
        <div className="kaart-mobiel-fullwidth">
          <KaartWeergave woningen={gefilterd} favs={favs} toggle={toggleFav} />
        </div>
      )}

      {/* HOOFDINHOUD: filter links + woningen rechts (alleen lijst, en kaart op desktop) */}
      <div className="zij-layout" style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 24px 60px", display: weergave === "kaart" ? "none" : "flex", gap: 24, alignItems: "flex-start" }}>

        {/* FILTER TOGGLE KNOP, alleen mobiel zichtbaar */}
        <button
          className="filter-toggle-btn"
          onClick={() => setShowFilter(!showFilter)}
          style={{ display: "none", alignItems: "center", gap: 8, background: showFilter ? NAVY : "#fff", color: showFilter ? "#fff" : NAVY, border: `1.5px solid ${showFilter ? NAVY : BORDER}`, borderRadius: 20, padding: "9px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%", justifyContent: "center", marginBottom: 12 }}
        >
          {showFilter ? "Filters verbergen ▲" : `Filters tonen ▼ ${Object.values(filters).filter(v => v && v !== "alle" && v !== "").length > 0 ? `(${Object.values(filters).filter(v => v && v !== "alle" && v !== "").length} actief)` : ""}`}
        </button>

        {/* FILTER MOBIEL UITKLAP */}
        {showFilter && (
          <div className="filter-mobiel" style={{ width: "100%", marginBottom: 16 }}>
            <FilterPaneel filters={filters} setF={setF} woningen={woningen} gefilterd={gefilterd} onReset={() => { setFilters(FILTERS_DEFAULT); setShowFilter(false); }} />
          </div>
        )}

        {/* FILTER PANEEL DESKTOP, altijd zichtbaar op desktop */}
        <div className="filter-paneel filter-paneel-desktop" style={{ width: 240, flexShrink: 0 }}>
          <FilterPaneel
            filters={filters}
            setF={setF}
            woningen={woningen}
            gefilterd={gefilterd}
            onReset={() => setFilters(FILTERS_DEFAULT)}
          />
        </div>

        {/* WONINGEN RECHTS */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Gesponsorde woningen — bovenaan */}
          {gefilterd.filter(w => w.gesponsord).length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11.5, color: "#888", fontWeight: 600, letterSpacing: 0.5, marginBottom: 10 }}>UITGELICHT</div>
              <div className="woningen-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(260px, 100%), 1fr))", gap: 18 }}>
                {gefilterd.filter(w => w.gesponsord).map((w) => (
                  <div key={w.id} style={{ position: "relative" }}>
                    <div style={{ position: "absolute", top: 10, left: 10, zIndex: 3, background: GOLD, color: "#fff", fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 10, letterSpacing: 0.5 }}>
                      UITGELICHT
                    </div>
                    <WoningKaart w={w} favs={favs} toggle={toggleFav} />
                  </div>
                ))}
              </div>
              <div style={{ borderBottom: `1px solid ${BORDER}`, margin: "20px 0 8px" }} />
            </div>
          )}

          {gefilterd.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: 16, color: NAVY, fontWeight: 700, marginBottom: 8 }}>Geen woningen gevonden</div>
              <div style={{ fontSize: 14, color: "#6B6B6B", marginBottom: 16 }}>Pas de filters aan of verwijder de zoekopdracht.</div>
              <button onClick={() => { setFilters(FILTERS_DEFAULT); setZoekStad(""); setZoekKm(""); }} style={{ background: NAVY, color: "#fff", border: "none", padding: "10px 20px", borderRadius: 20, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                Alle filters wissen
              </button>
            </div>
          ) : (
            <div className="woningen-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(260px, 100%), 1fr))", gap: 18 }}>
              {gefilterd.map((w) => <WoningKaart key={w.id} w={w} favs={favs} toggle={toggleFav} />)}
            </div>
          )}
        </div>
      </div>

      {/* KAARTWEERGAVE DESKTOP, binnen zij-layout */}
      {weergave === "kaart" && (
        <div className="kaart-desktop-layout" style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 24px 60px", display: "flex", gap: 24, alignItems: "flex-start" }}>
          <div className="filter-paneel-desktop" style={{ width: 240, flexShrink: 0 }}>
            <FilterPaneel filters={filters} setF={setF} woningen={woningen} gefilterd={gefilterd} onReset={() => setFilters(FILTERS_DEFAULT)} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <KaartWeergave woningen={gefilterd} favs={favs} toggle={toggleFav} />
          </div>
        </div>
      )}

      {showFavs && <FavorietenPanel woningen={woningen} favs={favs} toggle={toggleFav} onClose={() => setShowFavs(false)} />}
    </div>
  );
}
