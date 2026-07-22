import React, { useState, createContext, useContext } from "react";
import { Link } from "react-router-dom";

// ---------------------------------------------------------------------------
// CONTENT / TRANSLATIONS
// ---------------------------------------------------------------------------
const CONTENT = {
  nl: {
    langLabel: "NL",
    backHome: "← Terug naar home",
    heroBadge: "VOOR PROJECTONTWIKKELAARS",
    heroTitle: "Bereik Europese investeerders en de Balkan-diaspora wereldwijd",
    heroText:
      "Obrov Real Estate verbindt uw project rechtstreeks met Europese investeerders en de Balkan-diaspora wereldwijd. Ons platform bereikt kopers in 10 talen vanuit Nederland, Duitsland, Luxemburg, Zweden en de gehele Balkan-diaspora. Wij treden op als uw vertegenwoordiger in Europa, persoonlijk, professioneel en gericht op resultaat.",
    benefitsTitle: "Wat samenwerken oplevert",
    benefits: [
      { title: "Bereik Europa en de diaspora", text: "Ons platform bereikt kopers in 10 talen: Nederlandse, Duits-, Frans-, Zweeds- en Balkan-sprekende investeerders en diaspora wereldwijd." },
      { title: "Volledige transactiebegeleiding", text: "Van eerste kennismaking tot notariële overdracht, wij begeleiden de koper door het hele traject namens u." },
      { title: "Vertegenwoordiging op locatie in Nederland", text: "Wij presenteren uw project op bezoekreizen, informatieavonden en via persoonlijke gesprekken." },
      { title: "Exclusieve of preferred samenwerking", text: "U bepaalt de vorm, van preferred partner tot exclusieve vertegenwoordiging van uw project in Nederland." },
      { title: "Transparante afspraken", text: "Heldere commissiestructuur, duidelijke contracten en altijd één vast aanspreekpunt." },
      { title: "Meertalige presentatie", text: "Uw project gepresenteerd in 10 Europese talen, met exacte locatie op de kaart en volledige transparantie." },
    ],
    howTitle: "Hoe werkt het?",
    steps: [
      { num: "01", title: "Projectvoorstel", text: "U stuurt ons een korte omschrijving van uw project via het formulier hieronder." },
      { num: "02", title: "Kennismaking", text: "Wij plannen een gesprek om uw project te bespreken en de samenwerking te verkennen." },
      { num: "03", title: "Samenwerkingsovereenkomst", text: "Bij interesse stellen wij een heldere overeenkomst op met afspraken over vertegenwoordiging en commissie." },
      { num: "04", title: "Presentatie aan investeerders", text: "Wij stellen uw project voor aan ons Nederlandse netwerk en begeleiden geïnteresseerde kopers." },
    ],
    formTitle: "Stel uw project voor",
    formSub: "Vul het formulier in en wij nemen binnen twee werkdagen contact op.",
    devName: "Uw naam",
    devCompany: "Bedrijfsnaam",
    devLocation: "Projectlocatie (bijv. Budva, Kotor)",
    devUnits: "Aantal units / appartementen",
    devPrice: "Prijsrange (bijv. €150.000 – €400.000)",
    devDescription: "Korte omschrijving van het project",
    devEmail: "E-mailadres",
    devPhone: "Telefoonnummer (optioneel)",
    devSubmit: "Stuur projectvoorstel",
    devSending: "Versturen...",
    devSent: "Voorstel ontvangen! Wij nemen binnen twee werkdagen contact op.",
    devError: "Er ging iets mis. Probeer het opnieuw of mail naar info@obrovrealestate.nl.",
    footerTag: "Obrov Real Estate, Montenegro Investments",
    footerRights: "© 2026 Obrov Real Estate. Alle rechten voorbehouden.",
  },

  en: {
    langLabel: "EN",
    backHome: "← Back to home",
    heroBadge: "FOR PROJECT DEVELOPERS",
    heroTitle: "Reach European investors and the Balkan diaspora worldwide",
    heroText:
      "Obrov Real Estate connects your project directly with European investors and the Balkan diaspora worldwide. Our platform reaches buyers in 10 languages from the Netherlands, Germany, Luxembourg, Sweden and the entire Balkan diaspora. We act as your representative in Europe, personal, professional and results-driven.",
    benefitsTitle: "What collaboration delivers",
    benefits: [
      { title: "Reach Europe and the diaspora", text: "Our platform reaches buyers in 10 languages: Dutch, German, French, Swedish and Balkan-speaking investors and diaspora worldwide." },
      { title: "Full transaction guidance", text: "From first introduction to notarial transfer, we guide the buyer through the entire process on your behalf." },
      { title: "Representation in the Netherlands", text: "We present your project on viewing trips, information evenings and in personal conversations." },
      { title: "Exclusive or preferred collaboration", text: "You decide the form, from preferred partner to exclusive representation of your project in the Netherlands." },
      { title: "Transparent agreements", text: "Clear commission structure, straightforward contracts and always one fixed point of contact." },
      { title: "Multilingual presentation", text: "Your project presented in 10 European languages, with exact location on the map and full transparency." },
    ],
    howTitle: "How does it work?",
    steps: [
      { num: "01", title: "Project proposal", text: "Send us a brief description of your project via the form below." },
      { num: "02", title: "Introduction", text: "We schedule a call to discuss your project and explore the collaboration." },
      { num: "03", title: "Cooperation agreement", text: "If there is mutual interest, we draw up a clear agreement covering representation and commission." },
      { num: "04", title: "Presentation to investors", text: "We introduce your project to our Dutch network and guide interested buyers." },
    ],
    formTitle: "Introduce your project",
    formSub: "Fill in the form and we will get in touch within two business days.",
    devName: "Your name",
    devCompany: "Company name",
    devLocation: "Project location (e.g. Budva, Kotor)",
    devUnits: "Number of units / apartments",
    devPrice: "Price range (e.g. €150,000 – €400,000)",
    devDescription: "Brief description of the project",
    devEmail: "Email address",
    devPhone: "Phone number (optional)",
    devSubmit: "Send project proposal",
    devSending: "Sending...",
    devSent: "Proposal received! We will get in touch within two business days.",
    devError: "Something went wrong. Please try again or email info@obrovrealestate.nl.",
    footerTag: "Obrov Real Estate, Montenegro Investments",
    footerRights: "© 2026 Obrov Real Estate. All rights reserved.",
  },

  de: {
    langLabel: "DE",
    backHome: "← Zurück zur Startseite",
    heroBadge: "FÜR PROJEKTENTWICKLER",
    heroTitle: "Erreichen Sie europäische Investoren und die Balkan-Diaspora",
    heroText:
      "Obrov Real Estate verbindet Ihr Projekt direkt mit europäischen Investoren und der Balkan-Diaspora weltweit. Unsere Plattform erreicht Käufer in 10 Sprachen. Wir treten als Ihr Vertreter in Europa auf, persönlich, professionell und ergebnisorientiert.",
    benefitsTitle: "Was die Zusammenarbeit bringt",
    benefits: [
      { title: "Europa und Diaspora erreichen", text: "Unsere Plattform erreicht Käufer in 10 Sprachen: deutsch-, niederländisch-, französisch-, schwedisch- und balkansprachige Investoren weltweit." },
      { title: "Vollständige Transaktionsbegleitung", text: "Von der ersten Vorstellung bis zur notariellen Übertragung, wir begleiten den Käufer durch den gesamten Prozess." },
      { title: "Vertretung in den Niederlanden", text: "Wir präsentieren Ihr Projekt auf Besichtigungsreisen, Informationsabenden und in persönlichen Gesprächen." },
      { title: "Exklusive oder bevorzugte Zusammenarbeit", text: "Sie bestimmen die Form, vom bevorzugten Partner bis zur exklusiven Vertretung Ihres Projekts." },
      { title: "Transparente Vereinbarungen", text: "Klare Provisionsstruktur, eindeutige Verträge und immer ein fester Ansprechpartner." },
      { title: "Mehrsprachige Präsentation", text: "Ihr Projekt in 10 europäischen Sprachen präsentiert, mit exakter Lage auf der Karte und vollständiger Transparenz." },
    ],
    howTitle: "Wie funktioniert es?",
    steps: [
      { num: "01", title: "Projektvorschlag", text: "Senden Sie uns eine kurze Beschreibung Ihres Projekts über das untenstehende Formular." },
      { num: "02", title: "Kennenlernen", text: "Wir vereinbaren ein Gespräch, um Ihr Projekt zu besprechen und die Zusammenarbeit zu erkunden." },
      { num: "03", title: "Kooperationsvereinbarung", text: "Bei gegenseitigem Interesse erstellen wir eine klare Vereinbarung über Vertretung und Provision." },
      { num: "04", title: "Präsentation für Investoren", text: "Wir stellen Ihr Projekt unserem niederländischen Netzwerk vor und begleiten interessierte Käufer." },
    ],
    formTitle: "Stellen Sie Ihr Projekt vor",
    formSub: "Füllen Sie das Formular aus und wir melden uns innerhalb von zwei Werktagen.",
    devName: "Ihr Name",
    devCompany: "Firmenname",
    devLocation: "Projektstandort (z.B. Budva, Kotor)",
    devUnits: "Anzahl der Einheiten / Wohnungen",
    devPrice: "Preisrange (z.B. €150.000 – €400.000)",
    devDescription: "Kurze Beschreibung des Projekts",
    devEmail: "E-Mail-Adresse",
    devPhone: "Telefonnummer (optional)",
    devSubmit: "Projektvorschlag senden",
    devSending: "Wird gesendet...",
    devSent: "Vorschlag erhalten! Wir melden uns innerhalb von zwei Werktagen.",
    devError: "Etwas ist schiefgelaufen. Bitte erneut versuchen oder an info@obrovrealestate.nl schreiben.",
    footerTag: "Obrov Real Estate, Montenegro Investments",
    footerRights: "© 2026 Obrov Real Estate. Alle Rechte vorbehalten.",
  },

  me: {
    langLabel: "CG",
    backHome: "← Nazad na početnu",
    heroBadge: "ZA PROJEKTNE INVESTITORE",
    heroTitle: "Dosegnite evropske investitore i balkansku dijasporu",
    heroText:
      "Obrov Real Estate direktno povezuje vaš projekat novogradnje sa rastućom grupom holandskih investitora koji aktivno traže nekretnine na crnogorskom primorju. Nastupamo kao vaš zastupnik u Evropi, lično, profesionalno i orijentisano na rezultate.",
    benefitsTitle: "Šta saradnja donosi",
    benefits: [
      { title: "Direktan pristup motivisanim kupcima", text: "Održavamo aktivnu mrežu holandskih investitora koji su spremni da ulažu u Crnu Goru." },
      { title: "Potpuna podrška u transakciji", text: "Od prvog upoznavanja do notarskog prenosa, vodimo kupca kroz cijeli proces u vaše ime." },
      { title: "Zastupanje u Holandiji", text: "Predstavljamo vaš projekat na putovanjima razgledanja, informativnim večerima i u ličnim razgovorima." },
      { title: "Ekskluzivna ili preferirana saradnja", text: "Vi odlučujete o obliku, od preferiranog partnera do ekskluzivnog zastupanja vašeg projekta." },
      { title: "Transparentni sporazumi", text: "Jasna struktura provizije, jasni ugovori i uvijek jedna fiksna kontakt osoba." },
      { title: "Marketing na holandskom tržištu", text: "Vaš projekat predstavljen na holandskom jeziku, prilagođen onome što holandski investitori traže." },
    ],
    howTitle: "Kako funkcioniše?",
    steps: [
      { num: "01", title: "Prijedlog projekta", text: "Pošaljite nam kratak opis vašeg projekta putem obrasca ispod." },
      { num: "02", title: "Upoznavanje", text: "Zakazujemo razgovor kako bismo razgovarali o vašem projektu i istražili saradnju." },
      { num: "03", title: "Sporazum o saradnji", text: "Ako postoji obostrani interes, sastavljamo jasan sporazum o zastupanju i proviziji." },
      { num: "04", title: "Predstavljanje investitorima", text: "Predstavljamo vaš projekat našoj holandskoj mreži i vodimo zainteresovane kupce." },
    ],
    formTitle: "Predstavite vaš projekat",
    formSub: "Popunite obrazac i mi ćemo vas kontaktirati u roku od dva radna dana.",
    devName: "Vaše ime",
    devCompany: "Naziv kompanije",
    devLocation: "Lokacija projekta (npr. Budva, Kotor)",
    devUnits: "Broj jedinica / stanova",
    devPrice: "Raspon cijena (npr. €150.000 – €400.000)",
    devDescription: "Kratak opis projekta",
    devEmail: "Email adresa",
    devPhone: "Broj telefona (opciono)",
    devSubmit: "Pošaljite prijedlog projekta",
    devSending: "Slanje...",
    devSent: "Prijedlog primljen! Kontaktiraćemo vas u roku od dva radna dana.",
    devError: "Došlo je do greške. Pokušajte ponovo ili pišite na info@obrovrealestate.nl.",
    footerTag: "Obrov Real Estate, Investicije u Crnoj Gori",
    footerRights: "© 2026 Obrov Real Estate. Sva prava zadržana.",
  },
};

const LangContext = createContext({ lang: "nl", t: CONTENT.nl, setLang: () => {} });
const useLang = () => useContext(LangContext);

function LangSwitcher() {
  const { lang, setLang } = useLang();
  const options = [
    { code: "nl", label: "NL" },
    { code: "en", label: "EN" },
    { code: "de", label: "DE" },
    { code: "me", label: "CG" },
  ];
  return (
    <div style={{ display: "flex", gap: 2, background: "#EDE6D7", borderRadius: 20, padding: 3 }}>
      {options.map((o) => (
        <button
          key={o.code}
          onClick={() => setLang(o.code)}
          style={{
            border: "none",
            background: lang === o.code ? "#0B2A52" : "transparent",
            color: lang === o.code ? "#FAF8F4" : "#0B2A52",
            fontSize: 12.5,
            fontWeight: 700,
            padding: "6px 12px",
            borderRadius: 16,
            cursor: "pointer",
            transition: "all 0.25s ease",
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function DevPage() {
  const { t } = useLang();
  const [form, setForm] = useState({ naam: "", bedrijf: "", locatie: "", units: "", prijs: "", omschrijving: "", email: "", telefoon: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);

  const inputStyle = {
    padding: "13px 15px",
    borderRadius: 3,
    border: "1px solid #DCD4C2",
    fontSize: 14,
    outline: "none",
    color: "#1A1A1A",
    fontFamily: "inherit",
    width: "100%",
    boxSizing: "border-box",
  };

  return (
    <div style={{ fontFamily: "Helvetica, Arial, sans-serif", color: "#1A1A1A", background: "#FAF8F4", minHeight: "100vh" }}>
      <style>{`html, body { overflow-x: hidden; max-width: 100%; } * { box-sizing: border-box; }`}</style>

      {/* NAVBAR */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(250,248,244,0.95)", backdropFilter: "blur(8px)", borderBottom: "1px solid #DCD4C2" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <img src="/logo.png" alt="Obrov Real Estate" style={{ height: 56, width: "auto", display: "block" }} />
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <LangSwitcher />
            <Link
              to="/"
              style={{ background: "#0B2A52", color: "#FAF8F4", padding: "10px 18px", borderRadius: 2, fontSize: 13, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}
            >
              {t.backHome}
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section style={{ background: "#0B2A52", padding: "70px 24px 60px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-block", background: "rgba(172,147,98,0.2)", color: "#C2A877", fontSize: 12.5, fontWeight: 700, letterSpacing: 1.5, padding: "6px 16px", borderRadius: 20, marginBottom: 22 }}>
            {t.heroBadge}
          </div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(26px, 4vw, 42px)", color: "#FAF8F4", margin: "0 0 20px", fontWeight: 700, lineHeight: 1.15 }}>
            {t.heroTitle}
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.65, color: "#C9D2D0", maxWidth: 620, margin: "0 auto" }}>
            {t.heroText}
          </p>
        </div>
      </section>

      {/* VOORDELEN */}
      <section style={{ padding: "70px 24px", maxWidth: 1180, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: 28, color: "#0B2A52", margin: "0 0 36px", fontWeight: 700, textAlign: "center" }}>
          {t.benefitsTitle}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {t.benefits.map((b, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #DCD4C2", borderRadius: 4, padding: "24px 22px" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#AC9362", color: "#fff", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                ✓
              </div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 17, fontWeight: 700, color: "#0B2A52", marginBottom: 8 }}>{b.title}</div>
              <div style={{ fontSize: 14, color: "#3D3D3D", lineHeight: 1.6 }}>{b.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOE WERKT HET */}
      <section style={{ padding: "60px 24px", background: "#F2EDE0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: 28, color: "#0B2A52", margin: "0 0 36px", fontWeight: 700, textAlign: "center" }}>
            {t.howTitle}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
            {t.steps.map((s) => (
              <div key={s.num} style={{ textAlign: "center", padding: "0 12px" }}>
                <div style={{ fontFamily: "Georgia, serif", fontSize: 36, fontWeight: 700, color: "#AC9362", marginBottom: 10 }}>{s.num}</div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: 17, fontWeight: 700, color: "#0B2A52", marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 14, color: "#3D3D3D", lineHeight: 1.6 }}>{s.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORMULIER */}
      <section style={{ padding: "70px 24px", maxWidth: 760, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: 28, color: "#0B2A52", margin: "0 0 10px", fontWeight: 700 }}>
            {t.formTitle}
          </h2>
          <p style={{ fontSize: 15.5, color: "#6B6B6B" }}>{t.formSub}</p>
        </div>

        {sent ? (
          <div style={{ background: "#EDE6D7", border: "1px solid #C2A877", borderRadius: 6, padding: "28px 24px", textAlign: "center", color: "#0B2A52", fontSize: 16, fontWeight: 600 }}>
            {t.devSent}
          </div>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setSending(true);
              setError(false);
              try {
                const res = await fetch("/api/developer", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(form),
                });
                if (!res.ok) throw new Error();
                setSent(true);
              } catch {
                setError(true);
              } finally {
                setSending(false);
              }
            }}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            {error && (
              <div style={{ background: "#fdf0f0", border: "1px solid #e5b0b0", color: "#8B2020", padding: "12px 16px", borderRadius: 3, fontSize: 14 }}>
                {t.devError}
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="form-row">
              <input required type="text" placeholder={t.devName} value={form.naam} onChange={(e) => setForm(s => ({ ...s, naam: e.target.value }))} style={inputStyle} />
              <input required type="text" placeholder={t.devCompany} value={form.bedrijf} onChange={(e) => setForm(s => ({ ...s, bedrijf: e.target.value }))} style={inputStyle} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="form-row">
              <input type="text" placeholder={t.devLocation} value={form.locatie} onChange={(e) => setForm(s => ({ ...s, locatie: e.target.value }))} style={inputStyle} />
              <input type="text" placeholder={t.devUnits} value={form.units} onChange={(e) => setForm(s => ({ ...s, units: e.target.value }))} style={inputStyle} />
            </div>
            <input type="text" placeholder={t.devPrice} value={form.prijs} onChange={(e) => setForm(s => ({ ...s, prijs: e.target.value }))} style={inputStyle} />
            <textarea
              required
              rows={5}
              placeholder={t.devDescription}
              value={form.omschrijving}
              onChange={(e) => setForm(s => ({ ...s, omschrijving: e.target.value }))}
              style={{ ...inputStyle, resize: "vertical" }}
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="form-row">
              <input required type="email" placeholder={t.devEmail} value={form.email} onChange={(e) => setForm(s => ({ ...s, email: e.target.value }))} style={inputStyle} />
              <input type="tel" placeholder={t.devPhone} value={form.telefoon} onChange={(e) => setForm(s => ({ ...s, telefoon: e.target.value }))} style={inputStyle} />
            </div>
            <button
              type="submit"
              disabled={sending}
              style={{ background: "#0B2A52", color: "#fff", border: "none", padding: "16px 24px", borderRadius: 3, fontWeight: 700, fontSize: 15, cursor: sending ? "default" : "pointer", opacity: sending ? 0.7 : 1, marginTop: 6 }}
            >
              {sending ? t.devSending : t.devSubmit}
            </button>
          </form>
        )}
        <style>{`
          @media (max-width: 600px) {
            .form-row { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "28px 24px", background: "#081D3D", color: "#9FB0AE", fontSize: 13 }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span>{t.footerTag}</span>
          <span>{t.footerRights}</span>
        </div>
      </footer>
    </div>
  );
}

export default function DeveloperPage() {
  const [lang, setLang] = useState("nl");
  const t = CONTENT[lang];
  return (
    <LangContext.Provider value={{ lang, t, setLang }}>
      <DevPage />
    </LangContext.Provider>
  );
}
