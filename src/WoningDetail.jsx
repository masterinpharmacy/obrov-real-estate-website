import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase, supabaseConfigured } from "./supabase.js";

const NAVY = "#0B2A52";
const GOLD = "#AC9362";
const BORDER = "#DCD4C2";

function formatPrijs(p) {
  return "€" + p.toLocaleString("nl-NL");
}

function Kenmerk({ label, value, icon }) {
  if (!value && value !== 0) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 4, padding: "14px 16px", textAlign: "center" }}>
      <div style={{ fontSize: 22 }}>{icon}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: NAVY }}>{value}</div>
      <div style={{ fontSize: 12, color: "#6B6B6B" }}>{label}</div>
    </div>
  );
}

function BoolCheck({ label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `1px solid ${BORDER}` }}>
      <span style={{ fontSize: 16, color: value ? "#2E7D32" : "#ccc" }}>{value ? "✓" : "✗"}</span>
      <span style={{ fontSize: 14, color: value ? "#1A1A1A" : "#9B9B9B" }}>{label}</span>
    </div>
  );
}

export default function WoningDetail() {
  const { id } = useParams();
  const [woning, setWoning] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fotoIndex, setFotoIndex] = useState(0);
  const [contactOpen, setContactOpen] = useState(false);
  const [isFav, setIsFav] = useState(() => {
    try { return JSON.parse(localStorage.getItem("obrov_favs") || "[]").includes(id); }
    catch { return false; }
  });

  const toggleFav = useCallback(() => {
    setIsFav((prev) => {
      const favs = new Set(JSON.parse(localStorage.getItem("obrov_favs") || "[]"));
      prev ? favs.delete(id) : favs.add(id);
      localStorage.setItem("obrov_favs", JSON.stringify([...favs]));
      return !prev;
    });
  }, [id]);

  useEffect(() => {
    async function laad() {
      const { data } = await supabase.from("woningen").select("*").eq("id", id).single();
      setWoning(data);
      setLoading(false);
    }
    laad();
  }, [id]);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "Helvetica, sans-serif", color: "#6B6B6B" }}>
      Laden...
    </div>
  );

  if (!woning) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "Helvetica, sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>😕</div>
        <div style={{ color: NAVY, fontSize: 16, fontWeight: 600 }}>Woning niet gevonden</div>
        <Link to="/aanbod" style={{ color: GOLD, fontSize: 14 }}>← Terug naar aanbod</Link>
      </div>
    </div>
  );

  const fotos = woning.fotos?.length ? woning.fotos : [];

  return (
    <div style={{ fontFamily: "Helvetica, Arial, sans-serif", background: "#FAF8F4", minHeight: "100vh" }}>
      <style>{`html,body{overflow-x:hidden;max-width:100%;}*{box-sizing:border-box;}`}</style>

      {/* NAVBAR */}
      <header style={{ background: "rgba(250,248,244,0.95)", backdropFilter: "blur(8px)", borderBottom: `1px solid ${BORDER}`, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/"><img src="/logo.png" alt="Obrov Real Estate" style={{ height: 52, width: "auto" }} /></Link>
          <Link to="/aanbod" style={{ fontSize: 14, color: NAVY, textDecoration: "none", fontWeight: 600 }}>← Terug naar aanbod</Link>
        </div>
      </header>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "28px 24px 80px" }}>

        {/* FOTOGALERIJ */}
        {fotos.length > 0 ? (
          <div style={{ marginBottom: 28 }}>
            <div style={{ height: 420, background: "#E8E4DA", borderRadius: 6, overflow: "hidden", position: "relative" }}>
              <img src={fotos[fotoIndex]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              {!woning.professionele_fotos && (
                <div style={{ position: "absolute", top: 14, left: 14, background: "rgba(172,147,98,0.9)", color: "#fff", fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 12 }}>
                  📷 Eigen foto's, professionele fotosessie gepland
                </div>
              )}
              {fotos.length > 1 && (
                <>
                  <button onClick={() => setFotoIndex((i) => (i - 1 + fotos.length) % fotos.length)} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", color: "#fff", border: "none", width: 40, height: 40, borderRadius: "50%", fontSize: 18, cursor: "pointer" }}>‹</button>
                  <button onClick={() => setFotoIndex((i) => (i + 1) % fotos.length)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", color: "#fff", border: "none", width: 40, height: 40, borderRadius: "50%", fontSize: 18, cursor: "pointer" }}>›</button>
                  <div style={{ position: "absolute", bottom: 12, right: 14, background: "rgba(0,0,0,0.5)", color: "#fff", fontSize: 12, padding: "4px 10px", borderRadius: 10 }}>{fotoIndex + 1} / {fotos.length}</div>
                </>
              )}
            </div>
            {fotos.length > 1 && (
              <div style={{ display: "flex", gap: 8, marginTop: 8, overflowX: "auto", paddingBottom: 4 }}>
                {fotos.map((f, i) => (
                  <img key={i} src={f} alt="" onClick={() => setFotoIndex(i)} style={{ height: 70, width: 100, objectFit: "cover", borderRadius: 3, border: `2px solid ${i === fotoIndex ? GOLD : "transparent"}`, cursor: "pointer", flexShrink: 0 }} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{ height: 280, background: "#E8E4DA", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28, color: "#9B8F7A", fontSize: 40 }}>
            🏠
          </div>
        )}

        {/* HOOFDINFO + CONTACT */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32, alignItems: "start" }} className="detail-grid">

          <div>
            {/* Titel & prijs */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: GOLD, fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>
                {woning.type?.toUpperCase()}, {woning.stad?.toUpperCase()}{woning.regio ? `, ${woning.regio.toUpperCase()}` : ""}
              </div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 700, color: NAVY, marginBottom: 6 }}>
                {formatPrijs(woning.vraagprijs)}
              </div>
              {woning.adres && <div style={{ fontSize: 14, color: "#6B6B6B" }}>📍 {woning.adres}, {woning.stad}, Montenegro</div>}
            </div>

            {/* Specs raster */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 10, marginBottom: 28 }}>
              <Kenmerk label="Woonopperv." value={woning.oppervlakte_m2 ? `${woning.oppervlakte_m2} m²` : null} icon="📐" />
              <Kenmerk label="Perceel" value={woning.perceel_m2 ? `${woning.perceel_m2} m²` : null} icon="🌍" />
              <Kenmerk label="Kamers" value={woning.kamers} icon="🚪" />
              <Kenmerk label="Slaapkamers" value={woning.slaapkamers} icon="🛏" />
              <Kenmerk label="Badkamers" value={woning.badkamers} icon="🚿" />
              <Kenmerk label="Bouwjaar" value={woning.bouwjaar} icon="🏗" />
            </div>

            {/* Omschrijving */}
            {(woning.omschrijving_nl || woning.omschrijving_en) && (
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontFamily: "Georgia, serif", fontSize: 18, color: NAVY, margin: "0 0 12px" }}>Omschrijving</h3>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "#3D3D3D", whiteSpace: "pre-wrap" }}>
                  {woning.omschrijving_nl || woning.omschrijving_en}
                </p>
              </div>
            )}

            {/* Kenmerken */}
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontFamily: "Georgia, serif", fontSize: 18, color: NAVY, margin: "0 0 4px" }}>Kenmerken</h3>
              <BoolCheck label="Tuin" value={woning.tuin} />
              <BoolCheck label="Zwembad" value={woning.zwembad} />
              <BoolCheck label="Garage / parkeerplaats" value={woning.garage} />
              <BoolCheck label="Zeezicht" value={woning.zeezicht} />
              <BoolCheck label="Bergzicht" value={woning.bergzicht} />
              <BoolCheck label="Rivieruitzicht" value={woning.rivierzicht} />
              <BoolCheck label="Nieuwbouw" value={woning.nieuwbouw} />
              <BoolCheck label="Bestaande woning" value={woning.bestaande_bouw} />
              <BoolCheck label="Renovatie nodig" value={woning.renovatie_nodig} />
              <BoolCheck label="Water aanwezig" value={woning.water} />
              <BoolCheck label="Elektriciteit aanwezig" value={woning.elektriciteit} />
              <BoolCheck label="Geasfalteerde weg ernaar toe" value={woning.geasfalteerde_weg} />
              <BoolCheck label="Legale grond" value={woning.legale_grond} />
              <BoolCheck label="Alle papieren in orde" value={woning.papieren_orde} />
            </div>

            {/* Kaart placeholder */}
            {woning.lat && woning.lng && (
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontFamily: "Georgia, serif", fontSize: 18, color: NAVY, margin: "0 0 12px" }}>Locatie</h3>
                <div style={{ height: 220, background: "#E8E4DA", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", color: "#6B6B6B", fontSize: 14 }}>
                  📍 {woning.lat}, {woning.lng}<br />
                  <a href={`https://www.google.com/maps?q=${woning.lat},${woning.lng}`} target="_blank" rel="noreferrer" style={{ color: GOLD }}>
                    Bekijk op Google Maps →
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* CONTACT SIDEBAR */}
          <div style={{ position: "sticky", top: 80 }}>
            {/* Favoriet knop */}
            <button
              onClick={toggleFav}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: isFav ? "#fdf0f0" : "#fff", color: isFav ? "#e53935" : NAVY, border: `1.5px solid ${isFav ? "#e53935" : BORDER}`, borderRadius: 6, padding: "11px 16px", cursor: "pointer", fontWeight: 600, fontSize: 14, marginBottom: 12 }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill={isFav ? "#e53935" : "none"} stroke={isFav ? "#e53935" : NAVY} strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {isFav ? "Opgeslagen in favorieten" : "Bewaar als favoriet"}
            </button>

            <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "24px 22px" }}>
              <div style={{ fontSize: 13, color: "#6B6B6B", marginBottom: 4 }}>
                {woning.verkoper_is_makelaar ? "MAKELAAR" : "AANGEBODEN DOOR"}
              </div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 17, fontWeight: 700, color: NAVY, marginBottom: 4 }}>
                {woning.verkoper_is_makelaar && woning.makelaar_bedrijf ? woning.makelaar_bedrijf : woning.verkoper_naam}
              </div>
              {woning.verkoper_is_makelaar && woning.makelaar_bedrijf && (
                <div style={{ fontSize: 13, color: "#6B6B6B", marginBottom: 12 }}>{woning.verkoper_naam}</div>
              )}

              <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 16, marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                <a
                  href={`tel:${woning.verkoper_telefoon}`}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: NAVY, color: "#fff", padding: "13px 16px", borderRadius: 3, textDecoration: "none", fontWeight: 700, fontSize: 14 }}
                >
                  📞 Bel verkoper
                </a>
                <a
                  href={`mailto:${woning.verkoper_email}?subject=Interesse in woning ${woning.stad}`}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#fff", color: NAVY, border: `1.5px solid ${NAVY}`, padding: "13px 16px", borderRadius: 3, textDecoration: "none", fontWeight: 700, fontSize: 14 }}
                >
                  ✉ Stuur e-mail
                </a>
                {woning.verkoper_telefoon && (
                  <a
                    href={`https://wa.me/${woning.verkoper_telefoon.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#25D366", color: "#fff", padding: "13px 16px", borderRadius: 3, textDecoration: "none", fontWeight: 700, fontSize: 14 }}
                  >
                    💬 WhatsApp
                  </a>
                )}
              </div>

              <div style={{ marginTop: 16, padding: "12px 14px", background: "#F2EDE0", borderRadius: 3, fontSize: 12, color: "#6B6B6B", lineHeight: 1.5 }}>
                <strong style={{ color: NAVY }}>Obrov Real Estate</strong> is de plaatsende makelaar. Wij begeleiden u graag bij de aankoop.
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
