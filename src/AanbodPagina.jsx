import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "./supabase.js";

const NAVY = "#0B2A52";
const GOLD = "#AC9362";
const BORDER = "#DCD4C2";

// ---- Favorieten opslaan in localStorage ----
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
      title={isFav ? "Verwijder uit favorieten" : "Voeg toe aan favorieten"}
      style={{
        position: "absolute", top: 10, right: 10,
        width: 34, height: 34, borderRadius: "50%",
        background: "rgba(255,255,255,0.92)",
        border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
        transition: "transform 0.15s ease",
        zIndex: 2,
      }}
      onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.12)"}
      onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill={isFav ? "#e53935" : "none"} stroke={isFav ? "#e53935" : "#666"} strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </button>
  );
}

// ---- Woning kaart (Funda-stijl) ----
function WoningKaart({ w, favs, toggle }) {
  const badges = [];
  if (w.zeezicht) badges.push("Zeezicht");
  if (w.zwembad) badges.push("Zwembad");
  if (w.tuin) badges.push("Tuin");
  if (w.legale_grond) badges.push("Legale grond");

  return (
    <Link to={`/aanbod/${w.id}`} style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}>
      <div
        style={{
          background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8,
          overflow: "hidden", height: "100%", display: "flex", flexDirection: "column",
          transition: "box-shadow 0.2s, transform 0.15s",
        }}
        onMouseOver={(e) => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(11,42,82,0.13)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseOut={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
      >
        {/* FOTO */}
        <div style={{ height: 210, background: "#E8E4DA", position: "relative", flexShrink: 0 }}>
          {w.hoofdfoto
            ? <img src={w.hoofdfoto} alt={w.stad} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#9B8F7A", fontSize: 40 }}>🏠</div>
          }
          {/* Type badge links */}
          <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(11,42,82,0.85)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 12 }}>
            {w.type?.charAt(0).toUpperCase() + w.type?.slice(1)}
          </div>
          {/* Eigen foto's badge */}
          {!w.professionele_fotos && (
            <div style={{ position: "absolute", bottom: 10, left: 10, background: "rgba(172,147,98,0.92)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 10 }}>
              📷 Eigen foto's
            </div>
          )}
          {/* Hart knop */}
          <HartKnop id={w.id} favs={favs} toggle={toggle} />
        </div>

        {/* INFO */}
        <div style={{ padding: "14px 16px 18px", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 19, fontWeight: 700, color: NAVY }}>
            {formatPrijs(w.vraagprijs)}
          </div>
          <div style={{ fontSize: 13.5, color: "#444", fontWeight: 500 }}>
            {w.adres ? `${w.adres}, ` : ""}{w.stad}{w.regio ? `, ${w.regio}` : ""}
          </div>
          {/* Specs row */}
          <div style={{ display: "flex", gap: 12, fontSize: 13, color: "#555", marginTop: 2, flexWrap: "wrap", borderTop: `1px solid ${BORDER}`, paddingTop: 8 }}>
            {w.oppervlakte_m2 && <span>📐 {w.oppervlakte_m2} m²</span>}
            {w.slaapkamers && <span>🛏 {w.slaapkamers} slaapk.</span>}
            {w.badkamers && <span>🚿 {w.badkamers} badk.</span>}
            {w.perceel_m2 && <span>🌍 {w.perceel_m2} m² perceel</span>}
          </div>
          {/* Feature badges */}
          {badges.length > 0 && (
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 2 }}>
              {badges.map((b) => (
                <span key={b} style={{ background: "#F0EBE0", color: "#6B5528", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 10 }}>{b}</span>
              ))}
            </div>
          )}
          {/* Makelaar/verkoper footer */}
          <div style={{ marginTop: "auto", paddingTop: 8, fontSize: 12, color: "#888", display: "flex", alignItems: "center", gap: 5 }}>
            {w.verkoper_is_makelaar
              ? <><span>🏢</span><span>{w.makelaar_bedrijf || w.verkoper_naam}</span></>
              : <><span>👤</span><span>Particulier</span></>
            }
          </div>
        </div>
      </div>
    </Link>
  );
}

// ---- Kaart weergave (OpenStreetMap iframe) ----
function KaartWeergave({ woningen, favs, toggle }) {
  const [geselecteerd, setGeselecteerd] = useState(null);
  const metCoord = woningen.filter((w) => w.lat && w.lng);

  // Bouw een OpenStreetMap URL met markers (via Leaflet CDN in iframe)
  const mapHtml = `<!DOCTYPE html><html><head>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>body{margin:0}#map{height:100vh}</style></head><body>
<div id="map"></div><script>
var map = L.map('map').setView([${metCoord.length ? metCoord[0].lat : 42.43}, ${metCoord.length ? metCoord[0].lng : 19.26}], ${metCoord.length > 1 ? 9 : 12});
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap'}).addTo(map);
var icon = L.divIcon({className:'',html:'<div style="background:#0B2A52;color:#fff;font-size:12px;font-weight:700;padding:4px 8px;border-radius:12px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.3)">€</div>',iconAnchor:[20,16]});
${metCoord.map((w) => `L.marker([${w.lat},${w.lng}],{icon:L.divIcon({className:'',html:'<div style="background:#0B2A52;color:#fff;font-size:11px;font-weight:700;padding:4px 9px;border-radius:12px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.3);cursor:pointer">€ ${Math.round(w.vraagprijs/1000)}k</div>',iconAnchor:[25,16]})}).addTo(map).bindPopup('<b>${w.stad}</b><br>€ ${w.vraagprijs?.toLocaleString()}<br>${w.type || ""} ${w.oppervlakte_m2 ? "· " + w.oppervlakte_m2 + " m²" : ""}');`).join("\n")}
if(${metCoord.length}>1){var bounds=L.latLngBounds([${metCoord.map((w)=>`[${w.lat},${w.lng}]`).join(",")}]);map.fitBounds(bounds,{padding:[30,30]});}
</script></body></html>`;

  return (
    <div style={{ display: "flex", height: "calc(100vh - 160px)", minHeight: 500, gap: 0, border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden" }}>
      {/* Kaart */}
      <div style={{ flex: 1, position: "relative" }}>
        {metCoord.length > 0 ? (
          <iframe
            srcDoc={mapHtml}
            style={{ width: "100%", height: "100%", border: "none" }}
            title="Woningen kaart"
          />
        ) : (
          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, color: "#6B6B6B", background: "#F2EDE0" }}>
            <div style={{ fontSize: 40 }}>🗺️</div>
            <div style={{ fontSize: 14, maxWidth: 260, textAlign: "center" }}>
              Woningen worden op de kaart getoond zodra verkopende partijen coördinaten hebben ingevuld.
            </div>
          </div>
        )}
      </div>
      {/* Lijst rechts naast kaart */}
      <div style={{ width: 340, overflowY: "auto", background: "#FAF8F4", borderLeft: `1px solid ${BORDER}`, flexShrink: 0 }}>
        {woningen.map((w) => (
          <Link key={w.id} to={`/aanbod/${w.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div
              style={{ display: "flex", gap: 10, padding: "12px 14px", borderBottom: `1px solid ${BORDER}`, cursor: "pointer", background: geselecteerd === w.id ? "#EDE6D7" : "#fff" }}
              onMouseOver={(e) => { setGeselecteerd(w.id); e.currentTarget.style.background = "#EDE6D7"; }}
              onMouseOut={(e) => { setGeselecteerd(null); e.currentTarget.style.background = "#fff"; }}
            >
              <div style={{ width: 72, height: 60, background: "#E8E4DA", borderRadius: 4, flexShrink: 0, overflow: "hidden" }}>
                {w.hoofdfoto
                  ? <img src={w.hoofdfoto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🏠</div>
                }
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: NAVY }}>€ {w.vraagprijs?.toLocaleString("nl-NL")} k.k.</div>
                <div style={{ fontSize: 12, color: "#555", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{w.stad}{w.regio ? `, ${w.regio}` : ""}</div>
                <div style={{ fontSize: 11.5, color: "#888", marginTop: 2 }}>
                  {[w.oppervlakte_m2 && `${w.oppervlakte_m2} m²`, w.slaapkamers && `${w.slaapkamers} slpk`, w.type].filter(Boolean).join(" · ")}
                </div>
              </div>
              <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(w.id); }} style={{ flexShrink: 0, paddingTop: 2, cursor: "pointer" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill={favs.has(w.id) ? "#e53935" : "none"} stroke={favs.has(w.id) ? "#e53935" : "#ccc"} strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ---- Filterbalk (Funda-stijl chips) ----
const FILTERS_DEFAULT = { type: "alle", maxPrijs: "", minOppervlakte: "", slaapkamers: "alle", stad: "", zeezicht: false, zwembad: false, tuin: false, legale_grond: false };

function FilterChip({ label, active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 5,
        background: active ? NAVY : "#fff",
        color: active ? "#fff" : "#1A1A1A",
        border: `1.5px solid ${active ? NAVY : BORDER}`,
        borderRadius: 20, padding: "7px 14px",
        fontSize: 13.5, fontWeight: active ? 600 : 400,
        cursor: "pointer", whiteSpace: "nowrap",
      }}
    >
      {label} {children && <span style={{ fontSize: 10 }}>▼</span>}
    </button>
  );
}

// ---- Favorietenpagina overlay ----
function FavorietenPanel({ woningen, favs, toggle, onClose }) {
  const favWoningen = woningen.filter((w) => favs.has(w.id));
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "flex-end" }}>
      <div style={{ width: "min(420px, 100vw)", background: "#FAF8F4", height: "100%", overflowY: "auto", boxShadow: "-4px 0 20px rgba(0,0,0,0.15)" }}>
        <div style={{ padding: "20px 20px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: NAVY }}>Mijn favorieten</div>
            <div style={{ fontSize: 13, color: "#6B6B6B", marginTop: 3 }}>{favWoningen.length} woning{favWoningen.length !== 1 ? "en" : ""}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#6B6B6B" }}>×</button>
        </div>
        <div style={{ padding: 16 }}>
          {favWoningen.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 20px", color: "#6B6B6B" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" style={{ display: "block", margin: "0 auto 12px" }}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              Klik op het ♡ bij een woning om hem hier te bewaren.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {favWoningen.map((w) => (
                <div key={w.id} style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, overflow: "hidden" }}>
                  <div style={{ height: 140, background: "#E8E4DA", position: "relative" }}>
                    {w.hoofdfoto
                      ? <img src={w.hoofdfoto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>🏠</div>
                    }
                    <button onClick={() => toggle(w.id)} style={{ position: "absolute", top: 8, right: 8, background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#e53935" stroke="#e53935" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </button>
                  </div>
                  <div style={{ padding: "12px 14px" }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: NAVY, marginBottom: 3 }}>{formatPrijs(w.vraagprijs)}</div>
                    <div style={{ fontSize: 13, color: "#555" }}>{w.stad}{w.regio ? `, ${w.regio}` : ""}</div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                      {[w.oppervlakte_m2 && `${w.oppervlakte_m2} m²`, w.slaapkamers && `${w.slaapkamers} slpk`].filter(Boolean).join(" · ")}
                    </div>
                    <Link to={`/aanbod/${w.id}`} style={{ display: "inline-block", marginTop: 10, fontSize: 13, color: NAVY, fontWeight: 600, textDecoration: "none" }}>
                      Bekijk woning →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---- Hoofd component ----
export default function AanbodPagina() {
  const [woningen, setWoningen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weergave, setWeergave] = useState("lijst");
  const [filters, setFilters] = useState(FILTERS_DEFAULT);
  const [zoekterm, setZoekterm] = useState("");
  const [showFavs, setShowFavs] = useState(false);
  const [openFilter, setOpenFilter] = useState(null); // "type" | "prijs" | "oppervlakte" | "slpk" | "meer"
  const [favs, toggleFav] = useFavorieten();

  useEffect(() => {
    async function laad() {
      setLoading(true);
      const { data } = await supabase.from("woningen").select("*").eq("status", "actief").order("created_at", { ascending: false });
      if (data) setWoningen(data);
      setLoading(false);
    }
    laad();
  }, []);

  const setF = (key, val) => setFilters((f) => ({ ...f, [key]: val }));

  const gefilterd = woningen.filter((w) => {
    if (filters.type !== "alle" && w.type !== filters.type) return false;
    if (filters.maxPrijs && w.vraagprijs > parseInt(filters.maxPrijs)) return false;
    if (filters.minOppervlakte && w.oppervlakte_m2 < parseInt(filters.minOppervlakte)) return false;
    if (filters.slaapkamers !== "alle" && w.slaapkamers < parseInt(filters.slaapkamers)) return false;
    if (filters.zeezicht && !w.zeezicht) return false;
    if (filters.zwembad && !w.zwembad) return false;
    if (filters.tuin && !w.tuin) return false;
    if (filters.legale_grond && !w.legale_grond) return false;
    if (zoekterm && !`${w.stad} ${w.regio} ${w.adres}`.toLowerCase().includes(zoekterm.toLowerCase())) return false;
    return true;
  });

  const actieveFilters = Object.entries(filters).filter(([k, v]) => v && v !== "alle" && v !== "").length;

  return (
    <div style={{ fontFamily: "Helvetica, Arial, sans-serif", background: "#FAF8F4", minHeight: "100vh" }}>
      <style>{`html,body{overflow-x:hidden;max-width:100%}*{box-sizing:border-box}.filter-popup{position:absolute;top:calc(100% + 8px);left:0;background:#fff;border:1px solid ${BORDER};border-radius:8px;padding:18px 18px 14px;min-width:240px;z-index:100;box-shadow:0 4px 20px rgba(0,0,0,0.12)}`}</style>

      {/* NAVBAR */}
      <header style={{ background: "rgba(250,248,244,0.97)", backdropFilter: "blur(8px)", borderBottom: `1px solid ${BORDER}`, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
          <Link to="/"><img src="/logo.png" alt="Obrov Real Estate" style={{ height: 46, width: "auto" }} /></Link>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Link to="/" style={{ fontSize: 14, color: NAVY, textDecoration: "none", fontWeight: 500 }}>Home</Link>
            {/* Favorieten knop */}
            <button
              onClick={() => setShowFavs(true)}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: `1.5px solid ${BORDER}`, borderRadius: 20, padding: "7px 14px", cursor: "pointer", fontSize: 13.5, fontWeight: 500, color: NAVY }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill={favs.size > 0 ? "#e53935" : "none"} stroke={favs.size > 0 ? "#e53935" : NAVY} strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              Favorieten {favs.size > 0 && <span style={{ background: "#e53935", color: "#fff", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{favs.size}</span>}
            </button>
            <Link to="/woning-plaatsen" style={{ background: GOLD, color: "#fff", padding: "8px 16px", borderRadius: 20, fontSize: 13.5, fontWeight: 700, textDecoration: "none" }}>
              + Woning plaatsen
            </Link>
          </div>
        </div>
      </header>

      {/* ZOEKBALK (Funda-stijl) */}
      <div style={{ background: NAVY, padding: "24px 24px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(20px, 3vw, 30px)", color: "#FAF8F4", margin: "0 0 16px", fontWeight: 700 }}>
            Vastgoed in Montenegro & de Balkan
          </h1>
          {/* Zoekbalk */}
          <div style={{ display: "flex", gap: 0, background: "#fff", borderRadius: "8px 8px 0 0", overflow: "hidden", maxWidth: 680 }}>
            <div style={{ display: "flex", alignItems: "center", flex: 1, padding: "0 16px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" style={{ flexShrink: 0, marginRight: 10 }}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Zoek op stad, regio of adres..."
                value={zoekterm}
                onChange={(e) => setZoekterm(e.target.value)}
                style={{ flex: 1, border: "none", outline: "none", fontSize: 15, padding: "14px 0", fontFamily: "inherit", background: "transparent" }}
              />
            </div>
            <div style={{ display: "flex", borderLeft: `1px solid ${BORDER}` }}>
              <button onClick={() => setWeergave("lijst")} style={{ padding: "0 16px", background: weergave === "lijst" ? "#EDE6D7" : "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: weergave === "lijst" ? 700 : 400, color: NAVY }}>
                ☰ Lijst
              </button>
              <button onClick={() => setWeergave("kaart")} style={{ padding: "0 16px", background: weergave === "kaart" ? "#EDE6D7" : "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: weergave === "kaart" ? 700 : 400, color: NAVY, borderLeft: `1px solid ${BORDER}` }}>
                🗺 Kaart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER CHIPS BALK */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, position: "sticky", top: 66, zIndex: 40 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "10px 24px", display: "flex", gap: 8, overflowX: "auto", alignItems: "center" }}>
          {/* Koop/Huur chip */}
          <FilterChip label="Koop" active={true} />

          {/* Prijs chip */}
          <div style={{ position: "relative" }}>
            <FilterChip
              label={filters.maxPrijs ? `Max. € ${parseInt(filters.maxPrijs).toLocaleString("nl-NL")}` : "Prijs"}
              active={!!filters.maxPrijs}
              onClick={() => setOpenFilter(openFilter === "prijs" ? null : "prijs")}
            >▼</FilterChip>
            {openFilter === "prijs" && (
              <div className="filter-popup">
                <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 10 }}>Max. vraagprijs</div>
                {[100000, 150000, 200000, 300000, 500000, 750000, 1000000].map((p) => (
                  <div key={p} onClick={() => { setF("maxPrijs", String(p)); setOpenFilter(null); }}
                    style={{ padding: "7px 10px", cursor: "pointer", borderRadius: 4, fontSize: 14, background: filters.maxPrijs === String(p) ? "#EDE6D7" : "transparent" }}>
                    Tot € {p.toLocaleString("nl-NL")}
                  </div>
                ))}
                {filters.maxPrijs && <div onClick={() => { setF("maxPrijs", ""); setOpenFilter(null); }} style={{ marginTop: 8, color: GOLD, fontSize: 13, cursor: "pointer", fontWeight: 600 }}>Wissen</div>}
              </div>
            )}
          </div>

          {/* Woningtype chip */}
          <div style={{ position: "relative" }}>
            <FilterChip
              label={filters.type !== "alle" ? filters.type.charAt(0).toUpperCase() + filters.type.slice(1) : "Woningtype"}
              active={filters.type !== "alle"}
              onClick={() => setOpenFilter(openFilter === "type" ? null : "type")}
            >▼</FilterChip>
            {openFilter === "type" && (
              <div className="filter-popup">
                <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 10 }}>Woningtype</div>
                {["alle", "appartement", "villa", "huis", "grond", "commercieel"].map((t) => (
                  <div key={t} onClick={() => { setF("type", t); setOpenFilter(null); }}
                    style={{ padding: "7px 10px", cursor: "pointer", borderRadius: 4, fontSize: 14, background: filters.type === t ? "#EDE6D7" : "transparent" }}>
                    {t === "alle" ? "Alle types" : t.charAt(0).toUpperCase() + t.slice(1)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Oppervlakte chip */}
          <div style={{ position: "relative" }}>
            <FilterChip
              label={filters.minOppervlakte ? `Min. ${filters.minOppervlakte} m²` : "Woonoppervl."}
              active={!!filters.minOppervlakte}
              onClick={() => setOpenFilter(openFilter === "opp" ? null : "opp")}
            >▼</FilterChip>
            {openFilter === "opp" && (
              <div className="filter-popup">
                <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 10 }}>Min. woonoppervlakte</div>
                {[40, 60, 80, 100, 150, 200].map((m) => (
                  <div key={m} onClick={() => { setF("minOppervlakte", String(m)); setOpenFilter(null); }}
                    style={{ padding: "7px 10px", cursor: "pointer", borderRadius: 4, fontSize: 14, background: filters.minOppervlakte === String(m) ? "#EDE6D7" : "transparent" }}>
                    Vanaf {m} m²
                  </div>
                ))}
                {filters.minOppervlakte && <div onClick={() => { setF("minOppervlakte", ""); setOpenFilter(null); }} style={{ marginTop: 8, color: GOLD, fontSize: 13, cursor: "pointer", fontWeight: 600 }}>Wissen</div>}
              </div>
            )}
          </div>

          {/* Slaapkamers chip */}
          <div style={{ position: "relative" }}>
            <FilterChip
              label={filters.slaapkamers !== "alle" ? `${filters.slaapkamers}+ slaapk.` : "Slaapkamers"}
              active={filters.slaapkamers !== "alle"}
              onClick={() => setOpenFilter(openFilter === "slpk" ? null : "slpk")}
            >▼</FilterChip>
            {openFilter === "slpk" && (
              <div className="filter-popup">
                <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 10 }}>Min. slaapkamers</div>
                {["alle", "1", "2", "3", "4", "5"].map((n) => (
                  <div key={n} onClick={() => { setF("slaapkamers", n); setOpenFilter(null); }}
                    style={{ padding: "7px 10px", cursor: "pointer", borderRadius: 4, fontSize: 14, background: filters.slaapkamers === n ? "#EDE6D7" : "transparent" }}>
                    {n === "alle" ? "Alle" : `${n}+ slaapkamers`}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Meer filters chip */}
          <div style={{ position: "relative" }}>
            <FilterChip
              label={`Meer filters${actieveFilters > 0 ? ` (${actieveFilters})` : ""}`}
              active={!!(filters.zeezicht || filters.zwembad || filters.tuin || filters.legale_grond)}
              onClick={() => setOpenFilter(openFilter === "meer" ? null : "meer")}
            >▼</FilterChip>
            {openFilter === "meer" && (
              <div className="filter-popup" style={{ minWidth: 280 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 12 }}>Kenmerken</div>
                {[["zeezicht","Zeezicht"],["zwembad","Zwembad"],["tuin","Tuin"],["legale_grond","Legale grond"]].map(([k, l]) => (
                  <label key={k} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 4px", cursor: "pointer", fontSize: 14 }}>
                    <input type="checkbox" checked={filters[k]} onChange={(e) => setF(k, e.target.checked)} style={{ width: 16, height: 16 }} />
                    {l}
                  </label>
                ))}
                <div style={{ borderTop: `1px solid ${BORDER}`, marginTop: 12, paddingTop: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 8 }}>Staat</div>
                  {[["papieren_orde", "Papieren in orde"],["geasfalteerde_weg","Geasfalteerde weg"],["water","Water aanwezig"],["elektriciteit","Elektriciteit aanwezig"]].map(([k, l]) => (
                    <label key={k} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 4px", cursor: "pointer", fontSize: 14 }}>
                      <input type="checkbox" checked={filters[k] || false} onChange={(e) => setF(k, e.target.checked)} style={{ width: 16, height: 16 }} />
                      {l}
                    </label>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, paddingTop: 10, borderTop: `1px solid ${BORDER}` }}>
                  <button onClick={() => setFilters(FILTERS_DEFAULT)} style={{ background: "none", border: "none", color: "#888", fontSize: 13, cursor: "pointer" }}>Wissen</button>
                  <button onClick={() => setOpenFilter(null)} style={{ background: NAVY, color: "#fff", border: "none", padding: "7px 18px", borderRadius: 16, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Toepassen</button>
                </div>
              </div>
            )}
          </div>

          {/* Resultaatteller rechts */}
          <div style={{ marginLeft: "auto", fontSize: 13, color: "#6B6B6B", whiteSpace: "nowrap", flexShrink: 0 }}>
            {loading ? "Laden..." : `${gefilterd.length} woning${gefilterd.length !== 1 ? "en" : ""}`}
          </div>
        </div>
      </div>

      {/* Close filter popup on outside click */}
      {openFilter && <div onClick={() => setOpenFilter(null)} style={{ position: "fixed", inset: 0, zIndex: 39 }} />}

      {/* INHOUD */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: weergave === "kaart" ? "16px 24px 0" : "24px 24px 60px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#6B6B6B" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>Woningen laden...
          </div>
        ) : gefilterd.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🏠</div>
            <div style={{ fontSize: 17, color: NAVY, fontWeight: 700, marginBottom: 8 }}>Geen woningen gevonden</div>
            <div style={{ fontSize: 14, color: "#6B6B6B", marginBottom: 18 }}>Pas uw filters aan of verwijder de zoekopdracht.</div>
            <button onClick={() => { setFilters(FILTERS_DEFAULT); setZoekterm(""); }} style={{ background: NAVY, color: "#fff", border: "none", padding: "11px 22px", borderRadius: 20, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              Alle filters wissen
            </button>
          </div>
        ) : weergave === "lijst" ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 20, gridAutoRows: "1fr" }}>
            {gefilterd.map((w) => <WoningKaart key={w.id} w={w} favs={favs} toggle={toggleFav} />)}
          </div>
        ) : (
          <KaartWeergave woningen={gefilterd} favs={favs} toggle={toggleFav} />
        )}
      </div>

      {/* FAVORIETEN PANEL */}
      {showFavs && <FavorietenPanel woningen={woningen} favs={favs} toggle={toggleFav} onClose={() => setShowFavs(false)} />}
    </div>
  );
}
