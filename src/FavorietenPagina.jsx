import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase, supabaseConfigured } from "./supabase.js";
import { DEMO_WONINGEN } from "./demoData.js";

const NAVY = "#0B2A52";
const GOLD = "#AC9362";
const BORDER = "#DCD4C2";

function formatPrijs(p) {
  return "€ " + parseInt(p).toLocaleString("nl-NL") + " k.k.";
}

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

export default function FavorietenPagina() {
  const navigate = useNavigate();
  const [gebruiker, setGebruiker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [woningen, setWoningen] = useState([]);
  const [mijnWoningen, setMijnWoningen] = useState([]);
  const [favs, toggleFav] = useFavorieten();
  const [actieveTab, setActieveTab] = useState("favorieten");
  const [uitloggen, setUitloggen] = useState(false);

  useEffect(() => {
    async function init() {
      if (!supabaseConfigured || !supabase) {
        // Geen Supabase: toon demo-favorieten
        setWoningen(DEMO_WONINGEN);
        setLoading(false);
        return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth?modus=inloggen&redirect=/favorieten");
        return;
      }
      setGebruiker(session.user);

      // Laad alle woningen (voor favorieten matching)
      try {
        const { data } = await supabase.from("woningen").select("*").eq("status", "actief");
        setWoningen(data?.length ? data : DEMO_WONINGEN);
      } catch {
        setWoningen(DEMO_WONINGEN);
      }

      // Laad eigen woningen
      try {
        const { data } = await supabase.from("woningen").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false });
        setMijnWoningen(data || []);
      } catch {}

      setLoading(false);
    }
    init();
  }, []);

  const handleUitloggen = async () => {
    setUitloggen(true);
    if (supabase) await supabase.auth.signOut();
    localStorage.removeItem("obrov_favs");
    navigate("/");
  };

  const favWoningen = woningen.filter((w) => favs.has(w.id));

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Helvetica, sans-serif", color: "#6B6B6B" }}>
      Laden...
    </div>
  );

  return (
    <div style={{ fontFamily: "Helvetica, Arial, sans-serif", background: "#FAF8F4", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`*{box-sizing:border-box}html,body{overflow-x:hidden;width:100%;max-width:100%}@media(max-width:600px){.account-grid{grid-template-columns:1fr!important}.woning-kaart-grid{grid-template-columns:1fr!important}}`}</style>

      {/* Navbar */}
      <header style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <Link to="/"><img src="/logo.png" alt="Obrov Real Estate" style={{ height: 46, width: "auto" }} /></Link>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link to="/aanbod" style={{ fontSize: 14, color: NAVY, textDecoration: "none", fontWeight: 500 }}>Aanbod</Link>
          <button
            onClick={handleUitloggen}
            disabled={uitloggen}
            style={{ background: "none", border: `1.5px solid ${BORDER}`, color: "#666", padding: "7px 14px", borderRadius: 20, fontSize: 13, cursor: "pointer", fontWeight: 500 }}
          >
            {uitloggen ? "Uitloggen..." : "Uitloggen"}
          </button>
        </div>
      </header>

      {/* Account banner */}
      <div style={{ background: NAVY, padding: "28px 24px 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          {gebruiker && (
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                {(gebruiker.user_metadata?.naam || gebruiker.email || "?")[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 700, color: "#FAF8F4" }}>
                  {gebruiker.user_metadata?.naam || "Mijn account"}
                </div>
                <div style={{ fontSize: 13, color: "#C9D2D0", marginTop: 2 }}>{gebruiker.email}</div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0 }}>
            {[
              { key: "favorieten", label: `Favorieten (${favWoningen.length})` },
              { key: "mijnwoningen", label: `Mijn advertenties (${mijnWoningen.length})` },
              { key: "account", label: "Account" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActieveTab(tab.key)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  padding: "10px 20px", fontSize: 14, fontWeight: actieveTab === tab.key ? 700 : 500,
                  color: actieveTab === tab.key ? "#FAF8F4" : "#8A9DB5",
                  borderBottom: actieveTab === tab.key ? `3px solid ${GOLD}` : "3px solid transparent",
                  whiteSpace: "nowrap",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 80px" }}>

        {/* TAB: Favorieten */}
        {actieveTab === "favorieten" && (
          <div>
            {favWoningen.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>♡</div>
                <div style={{ fontSize: 17, color: NAVY, fontWeight: 700, marginBottom: 8 }}>Nog geen favorieten</div>
                <div style={{ fontSize: 14, color: "#6B6B6B", marginBottom: 20 }}>Klik op het hartje bij een woning om hem hier op te slaan.</div>
                <Link to="/aanbod" style={{ background: NAVY, color: "#fff", padding: "12px 24px", borderRadius: 4, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
                  Bekijk het aanbod
                </Link>
              </div>
            ) : (
              <div className="woning-kaart-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18 }}>
                {favWoningen.map((w) => (
                  <div key={w.id} style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden" }}>
                    <div style={{ height: 180, background: "#E8E4DA", position: "relative" }}>
                      {w.hoofdfoto
                        ? <img src={w.hoofdfoto} alt={w.stad} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                        : <div style={{ width: "100%", height: "100%", background: "#D5CFC4" }} />
                      }
                      <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(11,42,82,0.85)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 12 }}>
                        {w.type?.charAt(0).toUpperCase() + w.type?.slice(1)}
                      </div>
                      <button
                        onClick={() => toggleFav(w.id)}
                        style={{ position: "absolute", top: 8, right: 8, width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.95)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="#e53935" stroke="#e53935" strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                      </button>
                    </div>
                    <div style={{ padding: "13px 15px 16px" }}>
                      <div style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 700, color: NAVY, marginBottom: 3 }}>
                        {formatPrijs(w.vraagprijs)}
                      </div>
                      <div style={{ fontSize: 13, color: "#555", marginBottom: 8 }}>
                        {w.stad}{w.regio && w.regio !== w.stad ? `, ${w.regio}` : ""}
                      </div>
                      <div style={{ display: "flex", gap: 10, fontSize: 12.5, color: "#666", flexWrap: "wrap", paddingTop: 8, borderTop: `1px solid ${BORDER}` }}>
                        {w.oppervlakte_m2 && <span>{w.oppervlakte_m2} m²</span>}
                        {w.perceel_m2 && <span>{w.perceel_m2} m² perceel</span>}
                        {w.slaapkamers && <span>{w.slaapkamers} slaapk.</span>}
                        {w.zeezicht && <span style={{ color: GOLD, fontWeight: 600 }}>Zeezicht</span>}
                        {w.rivierzicht && <span style={{ color: GOLD, fontWeight: 600 }}>Rivieruitzicht</span>}
                      </div>
                      <Link
                        to={`/aanbod/${w.id}`}
                        style={{ display: "block", marginTop: 12, background: NAVY, color: "#fff", textAlign: "center", padding: "9px", borderRadius: 4, textDecoration: "none", fontSize: 13.5, fontWeight: 600 }}
                      >
                        Bekijk woning
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: Mijn advertenties */}
        {actieveTab === "mijnwoningen" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: 22, color: NAVY, margin: 0 }}>Mijn advertenties</h2>
              <Link to="/woning-plaatsen" style={{ background: GOLD, color: "#fff", padding: "9px 18px", borderRadius: 20, textDecoration: "none", fontSize: 13.5, fontWeight: 700 }}>
                + Nieuwe woning
              </Link>
            </div>

            {mijnWoningen.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", background: "#fff", borderRadius: 8, border: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: 17, color: NAVY, fontWeight: 700, marginBottom: 8 }}>Nog geen advertenties</div>
                <div style={{ fontSize: 14, color: "#6B6B6B", marginBottom: 20 }}>Plaats uw eerste woning en bereik kopers uit heel Europa.</div>
                <Link to="/woning-plaatsen" style={{ background: NAVY, color: "#fff", padding: "12px 24px", borderRadius: 4, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
                  Woning plaatsen
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {mijnWoningen.map((w) => (
                  <div key={w.id} style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "16px 18px", display: "flex", gap: 16, alignItems: "center" }}>
                    <div style={{ width: 80, height: 64, background: "#E8E4DA", borderRadius: 4, flexShrink: 0, overflow: "hidden" }}>
                      {w.hoofdfoto && <img src={w.hoofdfoto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: NAVY }}>{formatPrijs(w.vraagprijs)}</div>
                      <div style={{ fontSize: 13, color: "#555", marginTop: 2 }}>{w.type?.charAt(0).toUpperCase() + w.type?.slice(1)} in {w.stad}</div>
                      <div style={{ marginTop: 6 }}>
                        <span style={{ background: w.status === "actief" ? "#E8F5E9" : "#FFF8E7", color: w.status === "actief" ? "#2E7D32" : "#7A5C00", fontSize: 11.5, fontWeight: 700, padding: "2px 8px", borderRadius: 10 }}>
                          {w.status === "actief" ? "Actief" : w.status}
                        </span>
                      </div>
                    </div>
                    <Link to={`/aanbod/${w.id}`} style={{ color: NAVY, textDecoration: "none", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>
                      Bekijk →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: Account */}
        {actieveTab === "account" && (
          <div style={{ maxWidth: 520 }}>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 22, color: NAVY, margin: "0 0 20px" }}>Accountgegevens</h2>

            <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden", marginBottom: 16 }}>
              {[
                { label: "E-mailadres", waarde: gebruiker?.email },
                { label: "Naam", waarde: gebruiker?.user_metadata?.naam || "Niet ingevuld" },
                { label: "Accounttype", waarde: (() => { const t = gebruiker?.user_metadata?.account_type; return t === "makelaar_starter" ? "Makelaar Starter" : t === "makelaar_pro" ? "Makelaar Pro" : "Particulier"; })() },
                { label: "Account aangemaakt", waarde: gebruiker?.created_at ? new Date(gebruiker.created_at).toLocaleDateString("nl-NL") : "" },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", padding: "14px 18px", borderBottom: i < 3 ? `1px solid ${BORDER}` : "none", gap: 12 }}>
                  <div style={{ fontSize: 13, color: "#888", fontWeight: 600, width: 140, flexShrink: 0 }}>{r.label}</div>
                  <div style={{ fontSize: 14, color: NAVY, fontWeight: 500 }}>{r.waarde}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "#FFF8E7", border: "1px solid #F0C040", borderRadius: 8, padding: "14px 18px", marginBottom: 20, fontSize: 13.5, color: "#7A5C00" }}>
              Voor wijzigingen in uw accountgegevens of abonnement, neem contact op via{" "}
              <a href="mailto:info@obrovrealestate.nl" style={{ color: "#7A5C00", fontWeight: 700 }}>info@obrovrealestate.nl</a>.
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <Link
                to="/woning-plaatsen"
                style={{ flex: 1, background: NAVY, color: "#fff", padding: "12px", borderRadius: 4, textDecoration: "none", fontWeight: 700, fontSize: 14, textAlign: "center" }}
              >
                Woning plaatsen
              </Link>
              <button
                onClick={handleUitloggen}
                style={{ flex: 1, background: "none", border: `1.5px solid #ccc`, color: "#666", padding: "12px", borderRadius: 4, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
              >
                Uitloggen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
