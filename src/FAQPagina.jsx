import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getLang, FAQ_VERTALINGEN } from "./lang.js";

const NAVY = "#0B2A52";
const GOLD = "#AC9362";
const BORDER = "#DCD4C2";

// Alle FAQ Q&A platgooien voor AI context
function alleQA(secties) {
  return secties.flatMap(s => s.items.map(i => `Q: ${i.v}\nA: ${i.a}`)).join("\n\n");
}

function AIZoekbalk({ t, taal }) {
  const [vraag, setVraag] = useState("");
  const [antwoord, setAntwoord] = useState("");
  const [loading, setLoading] = useState(false);

  const stelVraag = async (e) => {
    e.preventDefault();
    if (!vraag.trim()) return;
    setLoading(true);
    setAntwoord("");
    const faqContext = t.secties.length > 0 ? alleQA(t.secties) : alleQA(FAQ_VERTALINGEN.nl.secties);
    try {
      const res = await fetch("/api/ai-faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vraag, context: faqContext }),
      });
      const data = await res.json();
      setAntwoord(data.antwoord || data.error || "Geen antwoord gevonden.");
    } catch {
      setAntwoord("Er ging iets mis. Probeer opnieuw of mail info@obrovrealestate.nl.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: NAVY, borderRadius: 10, padding: "24px 24px 20px", marginBottom: 40 }}>
      <div style={{ fontSize: 12, color: GOLD, fontWeight: 700, letterSpacing: 1.5, marginBottom: 6 }}>{t.aiTitel?.toUpperCase()}</div>
      <h2 style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "#FAF8F4", margin: "0 0 6px", fontWeight: 700 }}>{t.aiSub}</h2>
      <form onSubmit={stelVraag} style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
        <input
          type="text"
          value={vraag}
          onChange={(e) => setVraag(e.target.value)}
          placeholder={t.aiPlaceholder}
          style={{ flex: "1 1 260px", padding: "12px 16px", borderRadius: 6, border: "none", fontSize: 14.5, fontFamily: "inherit", outline: "none" }}
        />
        <button
          type="submit"
          disabled={loading || !vraag.trim()}
          style={{ background: GOLD, color: "#fff", border: "none", padding: "12px 20px", borderRadius: 6, fontWeight: 700, fontSize: 14, cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1, whiteSpace: "nowrap" }}
        >
          {loading ? t.aiBezig : `${t.aiKnop} \u2192`}
        </button>
      </form>
      {antwoord && (
        <div style={{ marginTop: 16, background: "rgba(255,255,255,0.09)", borderRadius: 6, padding: "14px 16px", color: "#EDE7DA", fontSize: 14.5, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
          {antwoord}
        </div>
      )}
    </div>
  );
}

function FAQItem({ v, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${BORDER}` }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 12 }}
      >
        <span style={{ fontSize: 15, fontWeight: 600, color: NAVY, lineHeight: 1.4 }}>{v}</span>
        <span style={{ fontSize: 20, color: GOLD, flexShrink: 0, transition: "transform 0.2s", transform: open ? "rotate(45deg)" : "none" }}>+</span>
      </button>
      {open && <div style={{ paddingBottom: 16, fontSize: 14.5, color: "#3D3D3D", lineHeight: 1.7 }}>{a}</div>}
    </div>
  );
}

// AV tekst per taal
const AV_TEKST = {
  nl: { h: "Algemene Voorwaarden Vastgoedplatform", intro: "Versie 1.2 | Juli 2026 | Masters in Pharmacy B.V.", artikelen: [
    { t: "1. Definities", b: "Platform: obrovrealestate.nl. Obrov: Masters in Pharmacy B.V. Adverteerder: gebruiker die vastgoed aanbiedt. Koper: gebruiker die vastgoed zoekt." },
    { t: "2. Rol van het platform", b: "Obrov is uitsluitend technisch facilitator, geen partij bij transacties, geen makelaar. Obrov verricht geen due diligence op advertenties." },
    { t: "3. Aansprakelijkheid advertentie-inhoud", b: "De adverteerder is als enige verantwoordelijk voor juistheid van alle informatie. Obrov aanvaardt geen aansprakelijkheid voor schade door onjuiste advertenties. De adverteerder vrijwaart Obrov van alle aanspraken van derden." },
    { t: "4. Beperking aansprakelijkheid", b: "Obrov is niet aansprakelijk voor directe of indirecte schade. Aansprakelijkheid is beperkt tot maximaal EUR 500." },
    { t: "5. Garanties adverteerder", b: "Adverteerder garandeert beschikkingsrecht, juiste informatie, correcte GPS-locatie, geldige documenten en rechtenvrij fotomateriaal. Schending leidt tot directe verwijdering zonder restitutie." },
    { t: "6. AI-gegenereerde inhoud", b: "AI-teksten kunnen onjuistheden bevatten. Publicatie geldt als goedkeuring. Obrov aanvaardt geen aansprakelijkheid voor AI-teksten." },
    { t: "7. Locatiegegevens", b: "Kaartdata zonder garantie. GPS-coordinaten worden ongewijzigd gepubliceerd. Kopers moeten locaties ter plaatse verificeren." },
    { t: "8. Verplichtingen gebruiker", b: "Verboden: valse advertenties, verkoop zonder beschikkingsrecht, strafbare handelingen, scraping en misbruik van persoonsgegevens." },
    { t: "9. Intellectueel eigendom", b: "Rechten op platform bij Obrov. Adverteerder verleent publicatielicentie en vrijwaart Obrov van aanspraken van derden." },
    { t: "10. Privacy (AVG)", b: "Verwerking conform AVG. Contactgegevens worden zichtbaar gepubliceerd. Geen verkoop aan derden. Verzoeken via info@obrovrealestate.nl." },
    { t: "11. Tarieven en opzegging", b: "Gratis t/m 31 oktober 2026. Daarna: particulier EUR 195 eenmalig; Starter EUR 250/maand (max. 5); Pro EUR 450/maand (onbeperkt). Geen restitutie bij tussentijdse verkoop. Opzegging per e-mail voor de 1e van de volgende maand." },
    { t: "12. Begeleidingsdiensten", b: "Basis EUR 2.500; Volledig EUR 4.500; of 1,5% aankoopprijs min. EUR 2.500. Fiscale coordinatie EUR 750 extra. Obrov niet aansprakelijk voor transactie-uitkomsten." },
    { t: "13. Toepasselijk recht", b: "Nederlands recht. Rechter Rotterdam. ODR-platform EU beschikbaar voor consumenten." },
    { t: "14. Wijziging voorwaarden", b: "Wijzigingen 30 dagen vooraf aangekondigd. Voortgezet gebruik geldt als aanvaarding." },
    { t: "15. Overige bepalingen", b: "Nietigheid van een bepaling tast overige bepalingen niet aan. Obrov kan rechten overdragen bij fusie of overname." },
  ]},
  en: { h: "Terms and Conditions", intro: "Version 1.2 | July 2026 | Masters in Pharmacy B.V.", artikelen: [
    { t: "1. Definitions", b: "Platform: obrovrealestate.nl. Obrov: Masters in Pharmacy B.V. Advertiser: user offering property. Buyer: user seeking property." },
    { t: "2. Role of the platform", b: "Obrov acts solely as a technical facilitator, not a party to transactions, not an agent. Obrov performs no due diligence on listings." },
    { t: "3. Liability for listing content", b: "The advertiser is solely responsible for the accuracy of all information. Obrov accepts no liability for damages caused by incorrect listings. The advertiser indemnifies Obrov against all third-party claims." },
    { t: "4. Limitation of liability", b: "Obrov is not liable for direct or indirect damages. Liability is capped at EUR 500 maximum." },
    { t: "5. Advertiser warranties", b: "Advertiser warrants right of disposal, accurate information, correct GPS location, valid documents and copyright-free images. Breach leads to immediate removal without refund." },
    { t: "6. AI-generated content", b: "AI texts may contain inaccuracies. Publication constitutes approval. Obrov accepts no liability for AI-generated texts." },
    { t: "7. Location data", b: "Map data provided without warranty. GPS coordinates are published unchanged. Buyers must verify locations on-site." },
    { t: "8. User obligations", b: "Prohibited: false listings, selling without right of disposal, criminal activities, scraping and misuse of personal data." },
    { t: "9. Intellectual property", b: "Platform rights belong to Obrov. Advertiser grants publication licence and indemnifies Obrov against third-party claims." },
    { t: "10. Privacy (GDPR)", b: "Processing in accordance with GDPR. Contact details are publicly displayed. No data sold to third parties. Requests via info@obrovrealestate.nl." },
    { t: "11. Pricing and cancellation", b: "Free until 31 October 2026. After that: private seller EUR 195 one-off; Starter EUR 250/month (max. 5); Pro EUR 450/month (unlimited). No refund on interim sale. Cancellation by email before the 1st of the following month." },
    { t: "12. Guidance services", b: "Basic EUR 2,500; Full EUR 4,500; or 1.5% purchase price min. EUR 2,500. Tax coordination EUR 750 extra. Obrov not liable for transaction outcomes." },
    { t: "13. Applicable law", b: "Dutch law applies. Court of Rotterdam. EU ODR platform available for consumers." },
    { t: "14. Amendment of terms", b: "Changes announced 30 days in advance. Continued use constitutes acceptance." },
    { t: "15. Miscellaneous", b: "Invalidity of one provision does not affect other provisions. Obrov may transfer rights upon merger or acquisition." },
  ]},
  de: { h: "Allgemeine Geschäftsbedingungen", intro: "Version 1.2 | Juli 2026 | Masters in Pharmacy B.V.", artikelen: [
    { t: "1. Definitionen", b: "Plattform: obrovrealestate.nl. Obrov: Masters in Pharmacy B.V. Inserent: Nutzer, der eine Immobilie anbietet. Kaufer: Nutzer, der eine Immobilie sucht." },
    { t: "2. Rolle der Plattform", b: "Obrov fungiert ausschliesslich als technischer Vermittler, ist keine Partei bei Transaktionen und kein Makler. Obrov fuhrt keine Due-Diligence-Prufung durch." },
    { t: "3. Haftung fur Inseratsinhalte", b: "Der Inserent ist allein verantwortlich fur die Richtigkeit aller Informationen. Obrov ubernimmt keine Haftung fur Schaden durch fehlerhafte Inserate. Der Inserent stellt Obrov von Anspruchen Dritter frei." },
    { t: "4. Haftungsbeschrankung", b: "Obrov haftet nicht fur direkte oder indirekte Schaden. Die Haftung ist auf maximal EUR 500 beschrankt." },
    { t: "5. Garantien des Inserenten", b: "Der Inserent garantiert Verfugungsrecht, korrekte Informationen, genaue GPS-Koordinaten, gultige Dokumente und rechtefreies Bildmaterial. Verstoss fuhrt zur sofortigen Loschung ohne Ruckerstattung." },
    { t: "6. KI-generierte Inhalte", b: "KI-Texte konnen Unrichtigkeiten enthalten. Die Veroffentlichung gilt als Genehmigung. Obrov ubernimmt keine Haftung fur KI-generierte Texte." },
    { t: "7. Standortdaten", b: "Kartendaten ohne Gewahrleistung. GPS-Koordinaten werden unverandert veroffentlicht. Kaufer mussen Standorte vor Ort uberprufem." },
    { t: "8. Nutzerpflichten", b: "Verboten: falsche Inserate, Verkauf ohne Verfugungsrecht, strafbare Handlungen, Scraping und Missbrauch personlicher Daten." },
    { t: "9. Geistiges Eigentum", b: "Plattformrechte liegen bei Obrov. Inserent erteilt Veroffentlichungslizenz und stellt Obrov von Anspruchen Dritter frei." },
    { t: "10. Datenschutz (DSGVO)", b: "Verarbeitung gemas DSGVO. Kontaktdaten werden offentlich angezeigt. Keine Weitergabe an Dritte. Anfragen an info@obrovrealestate.nl." },
    { t: "11. Preise und Kundigung", b: "Kostenlos bis 31. Oktober 2026. Danach: Privatperson EUR 195 einmalig; Starter EUR 250/Monat (max. 5); Pro EUR 450/Monat (unbegrenzt). Keine Ruckerstattung bei zwischenzeitlichem Verkauf. Kundigung per E-Mail vor dem 1. des Folgemonats." },
    { t: "12. Begleitungsleistungen", b: "Basis EUR 2.500; Vollstandig EUR 4.500; oder 1,5% Kaufpreis mind. EUR 2.500. Steuerkoordination EUR 750 extra. Obrov nicht haftbar fur Transaktionsergebnisse." },
    { t: "13. Anwendbares Recht", b: "Niederlandisches Recht. Zustandiges Gericht Rotterdam. EU-ODR-Plattform fur Verbraucher verfugbar." },
    { t: "14. Anderung der Bedingungen", b: "Anderungen werden 30 Tage im Voraus angekudigt. Fortgesetzte Nutzung gilt als Annahme." },
    { t: "15. Sonstige Bestimmungen", b: "Nichtigkeit einer Bestimmung beruhrt andere Bestimmungen nicht. Obrov kann Rechte bei Fusion oder Ubernahme ubertragen." },
  ]},
};

// Overige talen: gebruik EN als fallback maar met eigen koptekst
const AV_FALLBACK_TALEN = {
  fr: { h: "Conditions generales", intro: "Version 1.2 | Juillet 2026 | Masters in Pharmacy B.V." },
  sv: { h: "Allmanna villkor", intro: "Version 1.2 | Juli 2026 | Masters in Pharmacy B.V." },
  lb: { h: "Allgemeng Bedingungen", intro: "Versioun 1.2 | Juli 2026 | Masters in Pharmacy B.V." },
  me: { h: "Opsti uslovi", intro: "Verzija 1.2 | Juli 2026 | Masters in Pharmacy B.V." },
  bs: { h: "Opsti uslovi", intro: "Verzija 1.2 | Juli 2026 | Masters in Pharmacy B.V." },
  hr: { h: "Opci uvjeti", intro: "Verzija 1.2 | Srpanj 2026 | Masters in Pharmacy B.V." },
  sl: { h: "Splosni pogoji", intro: "Razlicica 1.2 | Julij 2026 | Masters in Pharmacy B.V." },
};

function AVModal({ onClose, taal }) {
  const avData = AV_TEKST[taal] || { ...AV_FALLBACK_TALEN[taal], ...AV_TEKST.en, h: AV_FALLBACK_TALEN[taal]?.h || AV_TEKST.en.h, intro: AV_FALLBACK_TALEN[taal]?.intro || AV_TEKST.en.intro };
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 8, maxWidth: 660, width: "100%", maxHeight: "85vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "18px 22px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 700, color: NAVY }}>{avData.h}</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{avData.intro}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#666", flexShrink: 0 }}>x</button>
        </div>
        <div style={{ padding: "18px 22px", overflowY: "auto", fontSize: 13.5, lineHeight: 1.7, color: "#3D3D3D" }}>
          {avData.artikelen.map((a, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: NAVY, marginBottom: 3 }}>{a.t}</div>
              <div>{a.b}</div>
            </div>
          ))}
          <div style={{ marginTop: 16, fontSize: 12, color: "#888", borderTop: `1px solid ${BORDER}`, paddingTop: 12 }}>
            Obrov Real Estate | info@obrovrealestate.nl | obrovrealestate.nl
          </div>
        </div>
        <div style={{ padding: "14px 22px", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ background: NAVY, color: "#fff", border: "none", padding: "10px 22px", borderRadius: 4, cursor: "pointer", fontWeight: 700, fontSize: 14 }}>Sluiten / Close</button>
        </div>
      </div>
    </div>
  );
}

const TARIEVEN = {
  nl: [
    { label: "Particulier", prijs: "195", periode: "eenmalig", sub: "1 woning, altijd zichtbaar" },
    { label: "Makelaar Starter", prijs: "250", periode: "/maand", sub: "tot 5 woningen" },
    { label: "Makelaar Pro", prijs: "450", periode: "/maand", sub: "onbeperkt woningen" },
    { label: "Begeleiding Basis", prijs: "2.500", periode: "vast", sub: "bezichtiging + advies" },
    { label: "Begeleiding Volledig", prijs: "4.500", periode: "vast", sub: "tot notariele overdracht" },
  ],
  en: [
    { label: "Private seller", prijs: "195", periode: "one-time", sub: "1 property, always visible" },
    { label: "Agent Starter", prijs: "250", periode: "/month", sub: "up to 5 properties" },
    { label: "Agent Pro", prijs: "450", periode: "/month", sub: "unlimited properties" },
    { label: "Guidance Basic", prijs: "2,500", periode: "fixed", sub: "viewing + advice" },
    { label: "Guidance Full", prijs: "4,500", periode: "fixed", sub: "through notarial transfer" },
  ],
  de: [
    { label: "Privatperson", prijs: "195", periode: "einmalig", sub: "1 Immobilie, immer sichtbar" },
    { label: "Makler Starter", prijs: "250", periode: "/Monat", sub: "bis 5 Immobilien" },
    { label: "Makler Pro", prijs: "450", periode: "/Monat", sub: "unbegrenzte Immobilien" },
    { label: "Begleitung Basis", prijs: "2.500", periode: "fest", sub: "Besichtigung + Beratung" },
    { label: "Begleitung Vollstandig", prijs: "4.500", periode: "fest", sub: "bis notarielle Ubertragung" },
  ],
};

export default function FAQPagina() {
  const [taal, setTaal] = useState("nl");
  const [showAV, setShowAV] = useState(false);

  useEffect(() => {
    // Detecteer taal: localStorage eerst, dan domein
    const saved = localStorage.getItem("obrov_lang");
    const geldige = ["nl","en","de","fr","sv","lb","me","bs","hr","sl"];
    if (saved && geldige.includes(saved)) {
      setTaal(saved);
      return;
    }
    // Domeindetectie
    const host = window.location.hostname;
    if (host.endsWith(".me")) { setTaal("me"); return; }
    if (host.endsWith(".de")) { setTaal("de"); return; }
    if (host.endsWith(".fr")) { setTaal("fr"); return; }
    if (host.endsWith(".lu")) { setTaal("lb"); return; }
    if (host.endsWith(".se")) { setTaal("sv"); return; }
    if (host.endsWith(".hr")) { setTaal("hr"); return; }
    if (host.endsWith(".ba")) { setTaal("bs"); return; }
    if (host.endsWith(".si")) { setTaal("sl"); return; }
    if (host.endsWith(".com")) { setTaal("en"); return; }
    setTaal("nl");
  }, []);

  const t = FAQ_VERTALINGEN[taal] || FAQ_VERTALINGEN.nl;
  const tarieven = TARIEVEN[taal] || TARIEVEN.en;
  const kleuren = [NAVY, "#1A4A7A", GOLD, "#1A5C3A", "#3A1A5C"];

  return (
    <div style={{ fontFamily: "Helvetica, Arial, sans-serif", background: "#FAF8F4", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`html,body{overflow-x:hidden;width:100%;max-width:100%}*{box-sizing:border-box}@media(max-width:500px){.tarief-grid{grid-template-columns:1fr 1fr!important}}`}</style>

      {/* Navbar */}
      <header style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <Link to="/"><img src="/logo.png" alt="Obrov Real Estate" style={{ height: 44, width: "auto" }} /></Link>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link to="/" style={{ fontSize: 14, color: NAVY, textDecoration: "none", fontWeight: 500 }}>← Home</Link>
          <Link to="/woning-plaatsen" style={{ background: GOLD, color: "#fff", padding: "8px 14px", borderRadius: 20, fontSize: 13, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
            + Plaatsen
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div style={{ background: NAVY, padding: "40px 20px 32px", textAlign: "center" }}>
        <div style={{ fontSize: 12, color: GOLD, fontWeight: 700, letterSpacing: 1.5, marginBottom: 8 }}>{t.titel?.toUpperCase()}</div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(20px, 4vw, 32px)", color: "#FAF8F4", margin: "0 0 10px", fontWeight: 700 }}>{t.hero}</h1>
        <p style={{ color: "#C9D2D0", fontSize: 14.5, maxWidth: 500, margin: "0 auto" }}>{t.heroSub}</p>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "28px 16px 80px" }}>

        {/* AI zoekbalk */}
        <AIZoekbalk t={t} taal={taal} />

        {/* Tarieven */}
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: 22, color: NAVY, margin: "0 0 16px", fontWeight: 700 }}>{t.tariefTitel}</h2>
        <div className="tarief-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 40 }}>
          {tarieven.map((tr, i) => (
            <div key={i} style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "14px 14px", borderTop: `4px solid ${kleuren[i]}` }}>
              <div style={{ fontSize: 11, color: "#888", fontWeight: 700, letterSpacing: 0.5, marginBottom: 5 }}>{tr.label.toUpperCase()}</div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700, color: kleuren[i] }}>EUR {tr.prijs}</div>
              <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{tr.periode}</div>
              <div style={{ fontSize: 12.5, color: "#3D3D3D", marginTop: 8, paddingTop: 8, borderTop: `1px solid ${BORDER}` }}>{tr.sub}</div>
            </div>
          ))}
        </div>

        {/* Gratis banner */}
        <div style={{ background: "#F0FDF4", border: "1.5px solid #86EFAC", borderRadius: 8, padding: "12px 16px", marginBottom: 36, display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ color: "#166534", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>✓</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#166534" }}>{t.gratisBanner}</div>
            <div style={{ fontSize: 13, color: "#166534", marginTop: 2 }}>{t.gratisSubtitel}</div>
          </div>
        </div>

        {/* AV knop */}
        <div style={{ marginBottom: 36 }}>
          <button
            onClick={() => setShowAV(true)}
            style={{ background: "none", border: `1.5px solid ${NAVY}`, color: NAVY, padding: "10px 20px", borderRadius: 4, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          >
            {t.avTitel || "Algemene Voorwaarden"} lezen
          </button>
        </div>

        {/* FAQ secties */}
        {t.secties && t.secties.length > 0 ? (
          t.secties.map((sectie) => (
            <div key={sectie.titel} style={{ marginBottom: 36 }}>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: 19, color: NAVY, margin: "0 0 4px", fontWeight: 700 }}>{sectie.titel}</h2>
              <div style={{ borderTop: `2px solid ${GOLD}`, paddingTop: 4 }}>
                {sectie.items.map((item) => <FAQItem key={item.v} v={item.v} a={item.a} />)}
              </div>
            </div>
          ))
        ) : (
          // Talen zonder volledige FAQ: toon NL secties
          FAQ_VERTALINGEN.nl.secties.map((sectie) => (
            <div key={sectie.titel} style={{ marginBottom: 36 }}>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: 19, color: NAVY, margin: "0 0 4px", fontWeight: 700 }}>{sectie.titel}</h2>
              <div style={{ borderTop: `2px solid ${GOLD}`, paddingTop: 4 }}>
                {sectie.items.map((item) => <FAQItem key={item.v} v={item.v} a={item.a} />)}
              </div>
            </div>
          ))
        )}

        {/* Contact CTA */}
        <div style={{ background: NAVY, borderRadius: 8, padding: "24px 20px", textAlign: "center" }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 19, color: "#FAF8F4", fontWeight: 700, marginBottom: 8 }}>{t.contactTitel}</div>
          <p style={{ color: "#C9D2D0", fontSize: 14, marginBottom: 14 }}>{t.contactSub}</p>
          <a href="mailto:info@obrovrealestate.nl" style={{ background: GOLD, color: "#fff", padding: "11px 22px", borderRadius: 4, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
            {t.contactKnop}
          </a>
        </div>
      </div>

      {showAV && <AVModal onClose={() => setShowAV(false)} taal={taal} />}
    </div>
  );
}
