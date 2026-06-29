import React, { useState, useEffect, useRef, createContext, useContext } from "react";

// ---- Design tokens ----
// Navy:      #1B3A3F  (deep Adriatic)
// Navy-2:    #234C52
// Terracotta:#B5562C  (Kotor rooftops)
// Terracotta-2: #C46538
// Sand:      #D8C9A8
// Cream:     #FAF8F4
// Ink:       #1A1A1A
// Grey:      #6B6B6B

// ---------------------------------------------------------------------------
// CONTENT / TRANSLATIONS
// ---------------------------------------------------------------------------
const CONTENT = {
  nl: {
    langLabel: "NL",
    nav: { aanpak: "Aanpak", diensten: "Diensten", overOns: "Over ons", contact: "Contact" },
    navCta: "Plan een gesprek",
    heroBadge: "NEDERLANDS — MONTENEGRIJNS INVESTERINGSKANTOOR",
    heroTitle1: "Investeren in Montenegro,",
    heroTitle2: "zonder de gok.",
    heroText:
      "Wij begeleiden Nederlandse investeerders van eerste kennismaking tot notariële overdracht — met lokale ontwikkelaarscontacten, juridische zekerheid en fiscale begeleiding op maat. Geen tussenpersonen, één aanspreekpunt.",
    heroCta1: "Vraag een kennismaking aan",
    heroCta2: "Bekijk onze aanpak",
    stat1v: "100%", stat1l: "Euro-markt — geen wisselkoersrisico",
    stat2v: "3", stat2l: "Regio's met actieve contacten",
    stat3v: "1", stat3l: "Vast aanspreekpunt, heel het traject",
    whyTitle: "WAAROM MONTENEGRO",
    whyItems: [
      "EU-kandidaat-status — rechtszekerheid groeit mee",
      "Adriatische kust, lagere instapprijzen dan West-Europa",
      "Euro als de facto valuta — geen wisselkoersrisico",
      "Groeiend toerisme & jachthavens zoals Porto Montenegro",
    ],
    routeKicker: "HET TRAJECT",
    routeTitle: "Van Den Haag tot Budva, in één lijn",
    routeLeft: "Nederland",
    routeRight: "Montenegro",
    destinationsKicker: "DE MONTENEGRIJNSE KUST",
    destinationsTitle: "De hele kust, met focus op vijf kernplekken",
    destinationsIntro:
      "Onze contacten en projecten strekken zich uit over de volledige Montenegrijnse Adriatische kust. Vijf plekken vormen daarbinnen onze focus.",
    destinations: [
      { name: "Kotor", desc: "Historische baai, UNESCO werelderfgoed, omringd door bergen" },
      { name: "Budva", desc: "Levendige kustplaats met ommuurde oude stad en stranden" },
      { name: "Tivat", desc: "Thuis van jachthaven Porto Montenegro, internationale luchthaven" },
      { name: "Bar", desc: "Grootste jachthaven van Montenegro, groeiende stad aan zee" },
      { name: "Ulcinj", desc: "Zuidelijkste kustplaats, lange zandstranden richting Albanië" },
    ],
    stops: [
      { city: "Den Haag", sub: "Kennismaking & dossier", side: "nl" },
      { city: "Rotterdam", sub: "Juridisch & fiscaal traject", side: "nl" },
      { city: "Tivat", sub: "Bezichtiging & projectkeuze", side: "mne" },
      { city: "Kotor", sub: "Koopcontract & notaris", side: "mne" },
      { city: "Budva", sub: "Overdracht & sleuteloverdracht", side: "mne" },
    ],
    servicesKicker: "DIENSTVERLENING",
    servicesTitle: "Eén traject, volledig begeleid",
    services: [
      { num: "01", title: "Projectselectie", text: "Curatie van nieuwbouw- en bestaande projecten op basis van uw profiel, budget en doel — verhuur, lifestyle of vermogensspreiding." },
      { num: "02", title: "Verkenningsreis", text: "Persoonlijke bezichtigingsreis naar Montenegro, georganiseerd en begeleid, met directe toegang tot ontwikkelaars en locaties." },
      { num: "03", title: "Juridische begeleiding", text: "Vast netwerk van lokale advocaten voor contractcontrole, kadasteronderzoek en notariële overdracht." },
      { num: "04", title: "Fiscale afstemming", text: "Coördinatie met een Nederlandse fiscalist over de gevolgen voor box 3 en structurering van het eigendom." },
      { num: "05", title: "Transactiebegeleiding", text: "Van reservering tot sleuteloverdracht — wij bewaken elke stap en elke deadline namens u." },
      { num: "06", title: "Verhuurbeheer", text: "Optionele doorverwijzing naar of opzet van lokaal beheer voor wie het object (deels) wil verhuren." },
    ],
    aboutKicker: "OVER ONS",
    aboutTitle: "Toegewijd aan persoonlijke, kwalitatieve begeleiding",
    aboutQuote:
      "Wij geloven dat investeren in vastgoed pas goed voelt als elke stap persoonlijk begeleid en helder uitgelegd wordt.",
    aboutQuoteAttr: "— Obrov Real Estate",
    aboutP1:
      "Obrov Real Estate is toegewijd aan persoonlijke en kwalitatieve begeleiding bij de aan- en verkoop van nieuwbouwprojecten, investeringen en bestaande woningen in Montenegro. Wij combineren lokale marktkennis met een directe, persoonlijke aanpak, zodat elke klant precies weet waar hij aan toe is.",
    aboutP2:
      "Wij werken met een vast netwerk van lokale advocaten en een Nederlandse fiscalist, zodat elk traject niet alleen aantrekkelijk is, maar ook juridisch en fiscaal goed onderbouwd.",
    contactTitle: "Begin met een vrijblijvend gesprek",
    contactText: "Vertel ons uw situatie en doel. Binnen twee werkdagen nemen wij persoonlijk contact op.",
    formName: "Uw naam",
    formEmail: "E-mailadres",
    formMessage: "Wat is uw investeringsdoel of vraag?",
    formSubmit: "Verstuur aanvraag",
    sentTitle: "Bericht verzonden",
    sentText: "Dank voor uw interesse. Wij nemen spoedig contact met u op.",
    footerTag: "Obrov Real Estate — Montenegro Investments",
    footerRights: "© 2026 Obrov Real Estate. Alle rechten voorbehouden.",
  },

  en: {
    langLabel: "EN",
    nav: { aanpak: "Approach", diensten: "Services", overOns: "About us", contact: "Contact" },
    navCta: "Book a call",
    heroBadge: "DUTCH — MONTENEGRIN INVESTMENT AGENCY",
    heroTitle1: "Investing in Montenegro,",
    heroTitle2: "without the guesswork.",
    heroText:
      "We guide Dutch investors from first introduction to notarial transfer — with local developer contacts, legal certainty and tailored tax guidance. No middlemen, one point of contact.",
    heroCta1: "Request an introduction",
    heroCta2: "See our approach",
    stat1v: "100%", stat1l: "Euro market — no exchange-rate risk",
    stat2v: "3", stat2l: "Regions with active contacts",
    stat3v: "1", stat3l: "One point of contact, throughout",
    whyTitle: "WHY MONTENEGRO",
    whyItems: [
      "EU candidate status — legal certainty growing alongside it",
      "Adriatic coastline, lower entry prices than Western Europe",
      "Euro as de facto currency — no exchange-rate risk",
      "Growing tourism & marinas such as Porto Montenegro",
    ],
    routeKicker: "THE JOURNEY",
    routeTitle: "From The Hague to Budva, in one line",
    routeLeft: "Netherlands",
    routeRight: "Montenegro",
    destinationsKicker: "THE MONTENEGRIN COAST",
    destinationsTitle: "The entire coastline, with a focus on five key spots",
    destinationsIntro:
      "Our contacts and projects span the full Montenegrin Adriatic coast. Within that, five places form our main focus.",
    destinations: [
      { name: "Kotor", desc: "Historic bay, UNESCO World Heritage site, surrounded by mountains" },
      { name: "Budva", desc: "Lively coastal town with a walled old town and beaches" },
      { name: "Tivat", desc: "Home of the Porto Montenegro marina and the international airport" },
      { name: "Bar", desc: "Montenegro's largest marina, a growing town on the sea" },
      { name: "Ulcinj", desc: "The southernmost coastal town, long sandy beaches towards Albania" },
    ],
    stops: [
      { city: "The Hague", sub: "Introduction & file setup", side: "nl" },
      { city: "Rotterdam", sub: "Legal & tax process", side: "nl" },
      { city: "Tivat", sub: "Viewing & project selection", side: "mne" },
      { city: "Kotor", sub: "Purchase contract & notary", side: "mne" },
      { city: "Budva", sub: "Transfer & key handover", side: "mne" },
    ],
    servicesKicker: "SERVICES",
    servicesTitle: "One journey, fully guided",
    services: [
      { num: "01", title: "Project selection", text: "Curated new-build and existing projects matched to your profile, budget and goal — rental, lifestyle, or wealth diversification." },
      { num: "02", title: "Viewing trip", text: "A personally organised and guided viewing trip to Montenegro, with direct access to developers and locations." },
      { num: "03", title: "Legal guidance", text: "A fixed network of local lawyers for contract review, land registry checks and notarial transfer." },
      { num: "04", title: "Tax alignment", text: "Coordination with a Dutch tax adviser on the implications for box 3 and ownership structuring." },
      { num: "05", title: "Transaction guidance", text: "From reservation to key handover — we track every step and every deadline on your behalf." },
      { num: "06", title: "Rental management", text: "Optional referral to or setup of local rental management for those who wish to (partly) let their property." },
    ],
    aboutKicker: "ABOUT US",
    aboutTitle: "Dedicated to personal, quality guidance",
    aboutQuote:
      "We believe investing in real estate only feels right when every step is personally guided and clearly explained.",
    aboutQuoteAttr: "— Obrov Real Estate",
    aboutP1:
      "Obrov Real Estate is dedicated to personal and high-quality guidance in the purchase and sale of new-build projects, investments, and existing homes in Montenegro. We combine local market knowledge with a direct, personal approach, so every client knows exactly where they stand.",
    aboutP2:
      "We work with a fixed network of local lawyers and a Dutch tax adviser, so every transaction is not only attractive but also legally and fiscally sound.",
    contactTitle: "Start with a no-obligation conversation",
    contactText: "Tell us your situation and goal. We will personally get in touch within two business days.",
    formName: "Your name",
    formEmail: "Email address",
    formMessage: "What is your investment goal or question?",
    formSubmit: "Send request",
    sentTitle: "Message sent",
    sentText: "Thank you for your interest. We will contact you shortly.",
    footerTag: "Obrov Real Estate — Montenegro Investments",
    footerRights: "© 2026 Obrov Real Estate. All rights reserved.",
  },

  me: {
    langLabel: "CG",
    nav: { aanpak: "Pristup", diensten: "Usluge", overOns: "O nama", contact: "Kontakt" },
    navCta: "Zakažite razgovor",
    heroBadge: "HOLANDSKO — CRNOGORSKA INVESTICIONA AGENCIJA",
    heroTitle1: "Ulaganje u Crnu Goru,",
    heroTitle2: "bez nagađanja.",
    heroText:
      "Vodimo holandske investitore od prvog upoznavanja do notarskog prenosa vlasništva — uz lokalne kontakte sa investitorima, pravnu sigurnost i poreske savjete prilagođene vama. Bez posrednika, jedna kontakt osoba.",
    heroCta1: "Zatražite upoznavanje",
    heroCta2: "Pogledajte naš pristup",
    stat1v: "100%", stat1l: "Evro kao valuta — nema kursnog rizika",
    stat2v: "3", stat2l: "Regije sa aktivnim kontaktima",
    stat3v: "1", stat3l: "Jedna kontakt osoba, tokom cijelog procesa",
    whyTitle: "ZAŠTO CRNA GORA",
    whyItems: [
      "Status kandidata za EU — pravna sigurnost raste",
      "Jadranska obala, niže ulazne cijene nego u zapadnoj Evropi",
      "Evro kao zvanična valuta — nema kursnog rizika",
      "Rast turizma i marina, kao što je Porto Montenegro",
    ],
    routeKicker: "PUTOVANJE",
    routeTitle: "Od Hag-a do Budve, u jednoj liniji",
    routeLeft: "Holandija",
    routeRight: "Crna Gora",
    destinationsKicker: "CRNOGORSKO PRIMORJE",
    destinationsTitle: "Cijela obala, sa fokusom na pet ključnih mjesta",
    destinationsIntro:
      "Naši kontakti i projekti pokrivaju cijelu crnogorsku jadransku obalu. U okviru toga, fokusiramo se na pet mjesta.",
    destinations: [
      { name: "Kotor", desc: "Istorijski zaliv, lokalitet UNESCO svjetske baštine, okružen planinama" },
      { name: "Budva", desc: "Živahan primorski grad sa starim gradom i plažama" },
      { name: "Tivat", desc: "Dom marine Porto Montenegro i međunarodnog aerodroma" },
      { name: "Bar", desc: "Najveća marina u Crnoj Gori, grad u rastu na moru" },
      { name: "Ulcinj", desc: "Najjužniji primorski grad, duge pješčane plaže prema Albaniji" },
    ],
    stops: [
      { city: "Hag", sub: "Upoznavanje i dokumentacija", side: "nl" },
      { city: "Roterdam", sub: "Pravni i poreski proces", side: "nl" },
      { city: "Tivat", sub: "Razgledanje i odabir projekta", side: "mne" },
      { city: "Kotor", sub: "Kupoprodajni ugovor i notar", side: "mne" },
      { city: "Budva", sub: "Prenos i predaja ključeva", side: "mne" },
    ],
    servicesKicker: "USLUGE",
    servicesTitle: "Jedan put, potpuna podrška",
    services: [
      { num: "01", title: "Odabir projekta", text: "Pažljiv izbor novogradnje i postojećih projekata prema vašem profilu, budžetu i cilju — iznajmljivanje, način života ili diverzifikacija imovine." },
      { num: "02", title: "Putovanje razgledanja", text: "Lično organizovano i vođeno putovanje u Crnu Goru, sa direktnim pristupom investitorima i lokacijama." },
      { num: "03", title: "Pravna podrška", text: "Stalna mreža lokalnih advokata za provjeru ugovora, provjeru u katastru i notarski prenos." },
      { num: "04", title: "Poreska usklađenost", text: "Koordinacija sa holandskim poreskim savjetnikom o posljedicama za box 3 i strukturiranje vlasništva." },
      { num: "05", title: "Podrška u transakciji", text: "Od rezervacije do predaje ključeva — pratimo svaki korak i svaki rok u vaše ime." },
      { num: "06", title: "Upravljanje iznajmljivanjem", text: "Opciono upućivanje na ili organizacija lokalnog upravljanja za one koji žele (djelimično) iznajmiti nekretninu." },
    ],
    aboutKicker: "O NAMA",
    aboutTitle: "Posvećeni ličnoj i kvalitetnoj podršci",
    aboutQuote:
      "Vjerujemo da ulaganje u nekretnine ima smisla samo kada je svaki korak lično vođen i jasno objašnjen.",
    aboutQuoteAttr: "— Obrov Real Estate",
    aboutP1:
      "Obrov Real Estate je posvećen ličnoj i kvalitetnoj podršci u kupovini i prodaji novogradnje, investicija i postojećih nekretnina u Crnoj Gori. Kombinujemo poznavanje lokalnog tržišta sa direktnim, ličnim pristupom, tako da svaki klijent tačno zna na čemu je.",
    aboutP2:
      "Radimo sa stalnom mrežom lokalnih advokata i holandskim poreskim savjetnikom, tako da je svaka transakcija ne samo privlačna, već i pravno i poreski dobro utemeljena.",
    contactTitle: "Započnite razgovorom bez obaveza",
    contactText: "Recite nam vašu situaciju i cilj. Lično ćemo vas kontaktirati u roku od dva radna dana.",
    formName: "Vaše ime",
    formEmail: "Email adresa",
    formMessage: "Koji je vaš investicioni cilj ili pitanje?",
    formSubmit: "Pošaljite upit",
    sentTitle: "Poruka poslata",
    sentText: "Hvala na interesovanju. Uskoro ćemo vas kontaktirati.",
    footerTag: "Obrov Real Estate — Investicije u Crnoj Gori",
    footerRights: "© 2026 Obrov Real Estate. Sva prava zadržana.",
  },
};

const LangContext = createContext({ lang: "nl", t: CONTENT.nl, setLang: () => {} });
const useLang = () => useContext(LangContext);

// ---------------------------------------------------------------------------
// SHARED COMPONENTS
// ---------------------------------------------------------------------------
function ArchMark({ size = 48, light = false }) {
  return (
    <svg width={size} height={size * 0.78} viewBox="0 0 122 96" fill="none">
      <path
        d="M0 96 L25 51 L48 76 L70 34 L95 66 L120 96 Z"
        fill={light ? "#3A5A5F" : "#D8C9A8"}
        opacity="0.9"
      />
      <path d="M-2 96 L38 24 L62 58 L82 28 L122 96 Z" fill={light ? "#0F2629" : "#1B3A3F"} />
      <path d="M38 24 L47 37 L38 42 L29 37 Z" fill="#FAF8F4" />
      <path d="M82 28 L91 41 L82 46 L73 41 Z" fill={light ? "#E07A45" : "#B5562C"} />
      <rect x="-10" y="96" width="142" height="6" rx="1.5" fill={light ? "#E07A45" : "#B5562C"} />
    </svg>
  );
}

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Reveal({ children, delay = 0 }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
        height: "100%",
      }}
    >
      {children}
    </div>
  );
}

// ---- Route bridge: NL <-> Montenegro signature element ----
function BridgeRoute() {
  const { t } = useLang();
  const [active, setActive] = useState(0);
  const stops = t.stops;

  useEffect(() => {
    setActive(0);
    const id = setInterval(() => setActive((a) => (a + 1) % stops.length), 2600);
    return () => clearInterval(id);
  }, [stops]);

  return (
    <div style={{ width: "100%", maxWidth: 880, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 28,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 12,
          letterSpacing: 2,
          color: "#6B6B6B",
          textTransform: "uppercase",
        }}
      >
        <span>{t.routeLeft}</span>
        <span>{t.routeRight}</span>
      </div>
      <div style={{ position: "relative", height: 4, background: "#E3DCC9", borderRadius: 2 }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: 4,
            borderRadius: 2,
            background: "linear-gradient(90deg, #1B3A3F, #B5562C)",
            width: `${((active + 1) / stops.length) * 100}%`,
            transition: "width 0.6s ease",
          }}
        />
        {stops.map((s, i) => {
          const left = (i / (stops.length - 1)) * 100;
          const isActive = i <= active;
          return (
            <div
              key={s.city}
              style={{
                position: "absolute",
                top: "50%",
                left: `${left}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                style={{
                  width: i === active ? 18 : 12,
                  height: i === active ? 18 : 12,
                  borderRadius: "50%",
                  background: isActive ? (s.side === "nl" ? "#1B3A3F" : "#B5562C") : "#fff",
                  border: `2px solid ${s.side === "nl" ? "#1B3A3F" : "#B5562C"}`,
                  transition: "all 0.4s ease",
                  boxShadow: i === active ? "0 0 0 6px rgba(181,86,44,0.15)" : "none",
                }}
              />
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}>
        {stops.map((s, i) => (
          <div
            key={s.city}
            style={{
              flex: 1,
              textAlign: i === 0 ? "left" : i === stops.length - 1 ? "right" : "center",
              opacity: i === active ? 1 : 0.45,
              transition: "opacity 0.4s ease",
            }}
          >
            <div style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 15, color: "#1B3A3F" }}>
              {s.city}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#6B6B6B",
                marginTop: 2,
                maxWidth: 120,
                marginInline: i === 0 ? 0 : i === stops.length - 1 ? 0 : "auto",
              }}
            >
              {s.sub}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LangSwitcher() {
  const { lang, setLang } = useLang();
  const options = [
    { code: "nl", label: "NL" },
    { code: "en", label: "EN" },
    { code: "me", label: "CG" },
  ];
  return (
    <div style={{ display: "flex", gap: 2, background: "#EFE7D4", borderRadius: 20, padding: 3 }}>
      {options.map((o) => (
        <button
          key={o.code}
          onClick={() => setLang(o.code)}
          style={{
            border: "none",
            background: lang === o.code ? "#1B3A3F" : "transparent",
            color: lang === o.code ? "#FAF8F4" : "#1B3A3F",
            fontSize: 12.5,
            fontWeight: 700,
            padding: "6px 12px",
            borderRadius: 16,
            cursor: "pointer",
            letterSpacing: 0.5,
            transition: "all 0.25s ease",
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function NavBar() {
  const { t } = useLang();
  const navItems = [
    { key: "aanpak", href: "#aanpak" },
    { key: "diensten", href: "#diensten" },
    { key: "overOns", href: "#over-ons" },
  ];
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(250,248,244,0.92)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid #E3DCC9",
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ArchMark size={30} />
          <div style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 16, color: "#1B3A3F", letterSpacing: 0.3 }}>
            OBROV <span style={{ color: "#B5562C" }}>REAL ESTATE</span>
          </div>
        </div>
        <nav style={{ display: "none", gap: 32 }} className="desktop-nav">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              style={{ fontSize: 14, color: "#1A1A1A", textDecoration: "none", fontWeight: 500 }}
            >
              {t.nav[item.key]}
            </a>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <LangSwitcher />
          <a
            href="#contact"
            style={{
              background: "#1B3A3F",
              color: "#FAF8F4",
              padding: "10px 20px",
              borderRadius: 2,
              fontSize: 13.5,
              fontWeight: 600,
              textDecoration: "none",
              letterSpacing: 0.3,
              whiteSpace: "nowrap",
            }}
          >
            {t.navCta}
          </a>
        </div>
      </div>
      <style>{`
        @media (min-width: 860px) {
          .desktop-nav { display: flex !important; }
        }
      `}</style>
    </header>
  );
}

function StatBlock({ value, label }) {
  return (
    <div style={{ textAlign: "left" }}>
      <div style={{ fontFamily: "Georgia, serif", fontSize: 34, fontWeight: 700, color: "#1B3A3F" }}>{value}</div>
      <div style={{ fontSize: 13, color: "#6B6B6B", marginTop: 4, maxWidth: 160 }}>{label}</div>
    </div>
  );
}

function ServiceCard({ num, title, text }) {
  return (
    <Reveal>
      <div
        style={{
          background: "#fff",
          border: "1px solid #E3DCC9",
          borderRadius: 4,
          padding: "28px 26px",
          height: "100%",
        }}
      >
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#B5562C", letterSpacing: 1, marginBottom: 14 }}>
          {num}
        </div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 19, fontWeight: 700, color: "#1B3A3F", marginBottom: 10 }}>
          {title}
        </div>
        <div style={{ fontSize: 14.5, color: "#3D3D3D", lineHeight: 1.6 }}>{text}</div>
      </div>
    </Reveal>
  );
}

// Verified Unsplash CDN photo for each focus destination. Each URL was
// confirmed by fetching the photo's Unsplash page directly, so these point
// at real, currently-live images (not the discontinued Source redirect API).
const DESTINATION_PHOTOS = {
  "Kotor": "https://images.unsplash.com/photo-1614122027743-50a9e6e8002f?fm=jpg&q=75&w=900&auto=format&fit=crop",
  "Budva": "https://images.unsplash.com/photo-1682936770708-3a8d9301a151?fm=jpg&q=75&w=900&auto=format&fit=crop",
  "Tivat": "https://images.unsplash.com/photo-1634902252038-532bdbb280a6?fm=jpg&q=75&w=900&auto=format&fit=crop",
  "Bar": "https://images.unsplash.com/photo-1719772355253-cac25a978d76?fm=jpg&q=75&w=900&auto=format&fit=crop",
  "Ulcinj": "https://images.unsplash.com/photo-1668301157539-ede800d169d4?fm=jpg&q=75&w=900&auto=format&fit=crop",
};

function DestinationCard({ name, desc, index }) {
  const photoUrl = DESTINATION_PHOTOS[name];
  return (
    <Reveal delay={index * 80}>
      <div
        style={{
          borderRadius: 6,
          overflow: "hidden",
          background: "#fff",
          border: "1px solid #E3DCC9",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            height: 150,
            flexShrink: 0,
            position: "relative",
            backgroundImage: `url(${photoUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "#1B3A3F",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(15,38,41,0) 50%, rgba(15,38,41,0.6) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 12,
              left: 16,
              color: "#fff",
              fontFamily: "Georgia, serif",
              fontWeight: 700,
              fontSize: 19,
              textShadow: "0 1px 4px rgba(0,0,0,0.5)",
            }}
          >
            {name}
          </div>
        </div>
        <div style={{ padding: "16px 18px 20px" }}>
          <div style={{ fontSize: 13.5, color: "#3D3D3D", lineHeight: 1.55 }}>{desc}</div>
        </div>
      </div>
    </Reveal>
  );
}

function DestinationsStrip() {
  const { t } = useLang();
  return (
    <section style={{ padding: "70px 24px", maxWidth: 1180, margin: "0 auto" }}>
      <Reveal>
        <div style={{ marginBottom: 36, textAlign: "center" }}>
          <div style={{ fontSize: 12.5, color: "#B5562C", fontWeight: 700, letterSpacing: 1.5, marginBottom: 10 }}>
            {t.destinationsKicker}
          </div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: 30, color: "#1B3A3F", margin: "0 0 14px", fontWeight: 700 }}>
            {t.destinationsTitle}
          </h2>
          <p style={{ fontSize: 15, color: "#6B6B6B", maxWidth: 560, margin: "0 auto" }}>{t.destinationsIntro}</p>
        </div>
      </Reveal>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gridAutoRows: "1fr",
          gap: 20,
          alignItems: "stretch",
        }}
      >
        {t.destinations.map((d, i) => (
          <DestinationCard key={d.name} name={d.name} desc={d.desc} index={i} />
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// PAGE
// ---------------------------------------------------------------------------
function Page() {
  const { t } = useLang();
  const [formState, setFormState] = useState({ naam: "", email: "", bericht: "" });
  const [sent, setSent] = useState(false);

  return (
    <div style={{ fontFamily: "Helvetica, Arial, sans-serif", color: "#1A1A1A", background: "#FAF8F4" }}>
      <NavBar />

      {/* HERO */}
      <section
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "76px 24px 60px",
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: 48,
          alignItems: "center",
        }}
        className="hero-grid"
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#EFE7D4",
              color: "#8A5A2E",
              fontSize: 12.5,
              fontWeight: 600,
              letterSpacing: 0.6,
              padding: "6px 14px",
              borderRadius: 20,
              marginBottom: 22,
            }}
          >
            <ArchMark size={14} /> {t.heroBadge}
          </div>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(34px, 5vw, 54px)",
              lineHeight: 1.1,
              color: "#1B3A3F",
              margin: "0 0 22px",
              fontWeight: 700,
            }}
          >
            {t.heroTitle1}
            <br />
            <span style={{ color: "#B5562C" }}>{t.heroTitle2}</span>
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.65, color: "#3D3D3D", maxWidth: 480, marginBottom: 32 }}>
            {t.heroText}
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <a
              href="#contact"
              style={{
                background: "#B5562C",
                color: "#FAF8F4",
                padding: "14px 28px",
                borderRadius: 2,
                fontWeight: 700,
                fontSize: 14.5,
                textDecoration: "none",
              }}
            >
              {t.heroCta1}
            </a>
            <a
              href="#aanpak"
              style={{
                border: "1.5px solid #1B3A3F",
                color: "#1B3A3F",
                padding: "14px 28px",
                borderRadius: 2,
                fontWeight: 700,
                fontSize: 14.5,
                textDecoration: "none",
              }}
            >
              {t.heroCta2}
            </a>
          </div>

          <div style={{ display: "flex", gap: 40, marginTop: 56, flexWrap: "wrap" }}>
            <StatBlock value={t.stat1v} label={t.stat1l} />
            <StatBlock value={t.stat2v} label={t.stat2l} />
            <StatBlock value={t.stat3v} label={t.stat3l} />
          </div>
        </div>

        <div
          style={{
            background: "#1B3A3F",
            borderRadius: 6,
            padding: "40px 32px",
            position: "relative",
            overflow: "hidden",
            backgroundImage:
              "linear-gradient(160deg, rgba(27,58,63,0.93), rgba(15,38,41,0.93)), url(https://images.unsplash.com/photo-1614122027743-50a9e6e8002f?fm=jpg&q=70&w=1200&auto=format&fit=crop)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div style={{ position: "absolute", top: -30, right: -30, opacity: 0.12 }}>
            <ArchMark size={220} light />
          </div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ color: "#D8C9A8", fontSize: 12, letterSpacing: 2, fontWeight: 600, marginBottom: 18 }}>
              {t.whyTitle}
            </div>
            {t.whyItems.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "flex-start" }}>
                <div
                  style={{
                    minWidth: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "#B5562C",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ color: "#EDE7DA", fontSize: 14.5, lineHeight: 1.5 }}>{item}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ROUTE / BRIDGE SECTION */}
      <section id="aanpak" style={{ padding: "70px 24px", background: "#fff", borderTop: "1px solid #E3DCC9", borderBottom: "1px solid #E3DCC9" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 50 }}>
              <div style={{ fontSize: 12.5, color: "#B5562C", fontWeight: 700, letterSpacing: 1.5, marginBottom: 10 }}>
                {t.routeKicker}
              </div>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: 30, color: "#1B3A3F", margin: 0, fontWeight: 700 }}>
                {t.routeTitle}
              </h2>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <BridgeRoute />
          </Reveal>
        </div>
      </section>

      <DestinationsStrip />

      {/* SERVICES */}
      <section id="diensten" style={{ padding: "80px 24px", maxWidth: 1180, margin: "0 auto" }}>
        <Reveal>
          <div style={{ marginBottom: 46 }}>
            <div style={{ fontSize: 12.5, color: "#B5562C", fontWeight: 700, letterSpacing: 1.5, marginBottom: 10 }}>
              {t.servicesKicker}
            </div>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 30, color: "#1B3A3F", margin: 0, fontWeight: 700, maxWidth: 560 }}>
              {t.servicesTitle}
            </h2>
          </div>
        </Reveal>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gridAutoRows: "1fr",
            gap: 20,
            alignItems: "stretch",
          }}
        >
          {t.services.map((s) => (
            <ServiceCard key={s.num} num={s.num} title={s.title} text={s.text} />
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="over-ons" style={{ padding: "80px 24px", maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 56, alignItems: "center" }} className="about-grid">
          <Reveal>
            <div
              style={{
                background: "#1B3A3F",
                borderRadius: 6,
                padding: 40,
                color: "#EDE7DA",
                position: "relative",
                overflow: "hidden",
                backgroundImage:
                  "linear-gradient(160deg, rgba(27,58,63,0.93), rgba(15,38,41,0.93)), url(https://images.unsplash.com/photo-1615352916571-99807ec84e29?fm=jpg&q=70&w=1200&auto=format&fit=crop)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div style={{ position: "absolute", bottom: -40, left: -40, opacity: 0.1 }}>
                <ArchMark size={200} light />
              </div>
              <div style={{ position: "relative", fontFamily: "Georgia, serif", fontSize: 20, lineHeight: 1.6, fontStyle: "italic" }}>
                "{t.aboutQuote}"
              </div>
              <div style={{ marginTop: 22, fontWeight: 700, color: "#fff" }}>{t.aboutQuoteAttr}</div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div>
              <div style={{ fontSize: 12.5, color: "#B5562C", fontWeight: 700, letterSpacing: 1.5, marginBottom: 10 }}>
                {t.aboutKicker}
              </div>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: 28, color: "#1B3A3F", margin: "0 0 18px", fontWeight: 700 }}>
                {t.aboutTitle}
              </h2>
              <p style={{ fontSize: 15.5, lineHeight: 1.7, color: "#3D3D3D", marginBottom: 16 }}>{t.aboutP1}</p>
              <p style={{ fontSize: 15.5, lineHeight: 1.7, color: "#3D3D3D" }}>{t.aboutP2}</p>
            </div>
          </Reveal>
        </div>
      </section>
      <style>{`
        @media (max-width: 860px) {
          .about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* CONTACT */}
      <section id="contact" style={{ padding: "80px 24px", background: "#1B3A3F" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <ArchMark size={44} light />
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 30, color: "#FAF8F4", margin: "20px 0 12px", fontWeight: 700 }}>
              {t.contactTitle}
            </h2>
            <p style={{ color: "#C9D2D0", fontSize: 15.5, marginBottom: 40 }}>{t.contactText}</p>
          </Reveal>
          <Reveal delay={100}>
            {sent ? (
              <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 6, padding: 36, color: "#fff" }}>
                <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{t.sentTitle}</div>
                <div style={{ color: "#C9D2D0", fontSize: 14.5 }}>{t.sentText}</div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                style={{ display: "flex", flexDirection: "column", gap: 14, textAlign: "left" }}
              >
                <input
                  required
                  placeholder={t.formName}
                  value={formState.naam}
                  onChange={(e) => setFormState((s) => ({ ...s, naam: e.target.value }))}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 3,
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(255,255,255,0.06)",
                    color: "#fff",
                    fontSize: 14.5,
                    outline: "none",
                  }}
                />
                <input
                  required
                  type="email"
                  placeholder={t.formEmail}
                  value={formState.email}
                  onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 3,
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(255,255,255,0.06)",
                    color: "#fff",
                    fontSize: 14.5,
                    outline: "none",
                  }}
                />
                <textarea
                  placeholder={t.formMessage}
                  rows={4}
                  value={formState.bericht}
                  onChange={(e) => setFormState((s) => ({ ...s, bericht: e.target.value }))}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 3,
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(255,255,255,0.06)",
                    color: "#fff",
                    fontSize: 14.5,
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    marginTop: 6,
                    background: "#B5562C",
                    color: "#fff",
                    border: "none",
                    padding: "15px 24px",
                    borderRadius: 3,
                    fontWeight: 700,
                    fontSize: 14.5,
                    cursor: "pointer",
                  }}
                >
                  {t.formSubmit}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "32px 24px", background: "#16302F", color: "#9FB0AE", fontSize: 13 }}>
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ArchMark size={20} light />
            <span>{t.footerTag}</span>
          </div>
          <div>{t.footerRights}</div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState("nl");
  const t = CONTENT[lang];

  return (
    <LangContext.Provider value={{ lang, t, setLang }}>
      <Page />
    </LangContext.Provider>
  );
}
